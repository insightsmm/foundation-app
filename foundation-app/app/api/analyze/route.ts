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
    'You are a senior social media strategist delivering a paid profile audit using the TPO Method (Teach, Proof, Offer) and the 3Cs (Clarity, Consistency, Credibility). ' +
    'Be specific and concrete. Reference what you actually see in the captions and the metrics. Give guided recommendations a client could act on this week. ' +
    'Return ONLY a JSON object with these keys: ' +
    'summary (3 to 4 sentences on where this profile stands and the single biggest opportunity); ' +
    'clarity_verdict (2 to 3 sentences on whether a stranger could tell who this is for and what they offer within five seconds, plus the one positioning line they should own); ' +
    'scores (object {clarity, consistency, credibility} each an integer 0 to 100); ' +
    'score_notes (object {clarity, consistency, credibility} each one sentence explaining that score with evidence); ' +
    'tpo (object {teach:{rating,note}, proof:{rating,note}, offer:{rating,note}, balance}) where rating is one of strong, okay, weak, note is one sentence on how well they do that job now and the fix, and balance is one to two sentences on how their current mix skews and what is missing); ' +
    'pillars (array of 3 to 5 content themes you actually detect); ' +
    'gaps (array of 3 to 5 specific content angles they are not posting but should); ' +
    'opportunities (array of 3 to 5 objects {title, detail} where detail is one to two sentences of specific guidance); ' +
    'sample_posts (array of 2 to 3 objects {type, hook, setup, punch, land, cta} that are ready to film in the TPO rhythm, type one of teach, proof, offer); ' +
    'action_plan (array of 4 to 6 prioritized, specific next steps). ' +
    VOICE_RULES;
  const ctx =
    `Account @${metrics.handle} (${metrics.fullName}). Bio: ${metrics.bio}. ` +
    `Followers ${followers}, following ${following}, posts ${postsCount}. ` +
    `Average likes ${avgLikes}, average comments ${avgComments}, engagement ${engagement}%. ` +
    `Recent captions: ` + sample.map((s, i) => `(${i + 1}) ${s.caption}`).join(' | ');

  let report: any = null;
  try {
    const raw = await claude(sys, ctx + ' Return the JSON only.', 3000);
    const s = raw.indexOf('{');
    const e = raw.lastIndexOf('}');
    if (s >= 0 && e > s) report = JSON.parse(raw.slice(s, e + 1));
  } catch { report = null; }

  return NextResponse.json({ metrics, report });
}
