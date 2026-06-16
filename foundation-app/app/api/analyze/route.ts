import { NextRequest, NextResponse } from 'next/server';
import { requireActiveUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ACTOR = 'apify~instagram-profile-scraper';
const MODEL = 'claude-sonnet-4-6';
const VOICE_RULES = 'Never use an em dash. Never use the construction not X but Y. Keep it plain, confident, and human, with a setup punch land rhythm.';

async function claude(system: string, user: string, maxTokens = 1100): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error('anthropic ' + res.status);
  const data = await res.json();
  return (data.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
}

function num(v: any): number {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  const n = parseInt(String(v ?? '').replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

export async function POST(req: NextRequest) {
  const gate = await requireActiveUser();
  if ('error' in gate) return gate.error;

  if (!process.env.APIFY_TOKEN) {
    return NextResponse.json({ error: 'Apify is not connected yet. Add APIFY_TOKEN in your environment variables.' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({} as any));
  let handle = String(body?.handle || '').trim();
  handle = handle.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/.*$/, '').trim();
  if (!handle) return NextResponse.json({ error: 'Enter an Instagram handle.' }, { status: 400 });

  let items: any[] = [];
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 55000);
    const r = await fetch(`https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ usernames: [handle] }), signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) return NextResponse.json({ error: 'Scrape failed (' + r.status + '). Check the handle and your Apify token.' }, { status: 502 });
    items = await r.json();
  } catch {
    return NextResponse.json({ error: 'Scrape timed out. Try again, larger profiles take longer.' }, { status: 504 });
  }

  const p = Array.isArray(items) ? items[0] : items;
  if (!p || (!p.username && !p.followersCount)) {
    return NextResponse.json({ error: 'No data for that handle. It may be private, misspelled, or temporarily unavailable.' }, { status: 404 });
  }

  const followers = num(p.followersCount ?? p.followers);
  const following = num(p.followsCount ?? p.followingCount ?? p.following);
  const postsCount = num(p.postsCount ?? p.posts);
  const rawPosts: any[] = p.latestPosts || p.posts || [];
  const sample = rawPosts.slice(0, 12).map((x: any) => ({
    caption: String(x.caption || '').slice(0, 280),
    likes: num(x.likesCount ?? x.likes),
    comments: num(x.commentsCount ?? x.comments),
    type: x.type || x.productType || 'post',
  }));
  const eng = sample.filter((s) => s.likes || s.comments);
  const avgLikes = eng.length ? Math.round(eng.reduce((a, s) => a + s.likes, 0) / eng.length) : 0;
  const avgComments = eng.length ? Math.round(eng.reduce((a, s) => a + s.comments, 0) / eng.length) : 0;
  const engagement = followers ? +(((avgLikes + avgComments) / followers) * 100).toFixed(2) : 0;

  const metrics = {
    handle: p.username || handle,
    fullName: p.fullName || '',
    followers, following, postsCount, avgLikes, avgComments, engagement,
    verified: !!p.isVerified,
    bio: p.biography || '',
  };

  const sys =
    'You are a senior social media strategist producing a client-ready Instagram audit built on the TPO Method (Teach, Proof, Offer). ' +
    'Be specific and reference what you actually see in the captions, the bio, and the metrics. ' +
    'Return ONLY a JSON object with these keys: ' +
    'overall (integer 0 to 100, the headline health score); ' +
    'conversation_starter (2 to 4 sentences written as if speaking to the account owner, in the form: we have observed that NAME does X well, and here is the opportunity to Y); ' +
    'health_scores (object {teach, proof, offer, engagement, consistency} each integer 0 to 100; base engagement on the engagement rate provided); ' +
    'breakdown (object with keys teach, proof, offer, each an object {score (0 to 100), summary (2 to 3 sentences on current state), currently_doing (array of 3 to 5 short specific things they already do for that pillar), whats_missing (array of 3 to 5 short specific gaps), post_idea (one concrete post they could publish this week for that pillar)}); ' +
    'audience_insight (3 to 4 sentences on who the audience is and what they need in order to convert); ' +
    'bio_optimization (object {assessment (1 to 2 sentences judging the current bio for clarity and a clear next step), suggestions (array of 2 to 3 rewritten bio options, each under 150 characters, that make who it is for, what they get, and the next step obvious)}); ' +
    'recommendations (array of exactly 5 objects {title (short and specific), pillar (one of teach, proof, offer, engagement, consistency), priority (one of high, medium, low), detail (1 to 2 sentences of concrete guidance)}). ' +
    VOICE_RULES;
  const ctx =
    `Account @${metrics.handle} (${metrics.fullName}). Bio: ${metrics.bio}. ` +
    `Followers ${followers}, following ${following}, posts ${postsCount}. ` +
    `Average likes ${avgLikes}, average comments ${avgComments}, engagement ${engagement}%. ` +
    `Recent captions: ` + sample.map((s, i) => `(${i + 1}) ${s.caption}`).join(' | ');

  let report: any = null;
  try {
    const raw = await claude(sys, ctx + ' Return the JSON only.', 4000);
    const s = raw.indexOf('{');
    const e = raw.lastIndexOf('}');
    if (s >= 0 && e > s) report = JSON.parse(raw.slice(s, e + 1));
  } catch { report = null; }

  return NextResponse.json({ metrics, report });
}
