import { NextRequest, NextResponse } from 'next/server';
import { requireActiveUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ACTOR = 'apify~instagram-scraper';
const MODEL = 'claude-sonnet-4-6';
const VOICE_RULES = 'Never use an em dash. Never use the construction not X but Y. Keep it plain, confident, and human, with a setup punch land rhythm.';

async function claude(system: string, user: string, maxTokens = 2500): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error('anthropic ' + res.status);
  const data = await res.json();
  return (data.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
}

async function scrapeCaption(url: string): Promise<string> {
  if (!process.env.APIFY_TOKEN) return '';
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 45000);
    const r = await fetch(`https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ directUrls: [url], resultsType: 'posts', resultsLimit: 1 }), signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) return '';
    const items = await r.json();
    const p = Array.isArray(items) ? items[0] : items;
    return p ? String(p.caption || '') : '';
  } catch { return ''; }
}

export async function POST(req: NextRequest) {
  const gate = await requireActiveUser();
  if ('error' in gate) return gate.error;

  const body = await req.json().catch(() => ({} as any));
  const niche = String(body?.niche || '').trim();
  let source = String(body?.script || '').trim();
  const url = String(body?.url || '').trim();

  if (!source && url) source = await scrapeCaption(url);
  if (!source) {
    return NextResponse.json({ error: 'Paste the video script or on-screen text. If you only have a reel URL, set APIFY_TOKEN and it will pull the caption.' }, { status: 400 });
  }
  if (!niche) return NextResponse.json({ error: 'Tell me which niche to remix it for.' }, { status: 400 });

  const sys =
    'You are a short-form video strategist. You study a viral video and rebuild its structure for a different niche, keeping what made it work. ' +
    'Return ONLY a JSON object with these keys: ' +
    'structure (array of 4 to 7 objects {beat, purpose} that map the source video beat by beat); ' +
    'why_it_works (2 to 3 sentences on the mechanics that made it spread); ' +
    'hooks (array of 3 to 4 on-screen text hook options written for the new niche); ' +
    'script (array of objects {label, line} that is the full spoken script for the new niche, label being the beat name like Hook, Setup, Payoff, CTA); ' +
    'onscreen_text (array of short text overlays to put on screen, in order); ' +
    'shot_list (array of objects {shot, note} describing how to film each part); ' +
    'caption (a ready caption for the post); ' +
    'cta (one call to action line with a comment keyword). ' +
    VOICE_RULES;
  const usr = `Source video script or caption:\n"""${source.slice(0, 4000)}"""\n\nRebuild it for this niche: ${niche}. Return the JSON only.`;

  let result: any = null;
  try {
    const raw = await claude(sys, usr, 3000);
    const s = raw.indexOf('{');
    const e = raw.lastIndexOf('}');
    if (s >= 0 && e > s) result = JSON.parse(raw.slice(s, e + 1));
  } catch { result = null; }

  if (!result) return NextResponse.json({ error: 'The model could not build the remix. Try again.' }, { status: 502 });
  return NextResponse.json({ result, source: source.slice(0, 600) });
}
