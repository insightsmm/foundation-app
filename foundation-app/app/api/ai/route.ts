import { NextRequest, NextResponse } from 'next/server';
import { requireActiveUser, supabaseServer } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-6';
const VOICE_RULES =
  'Never use an em dash. Never use the construction not X but Y. Keep it plain and human, with a setup punch land rhythm.';

async function claude(system: string, user: string, maxTokens = 800): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error('anthropic ' + res.status);
  const data = await res.json();
  return (data.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
}

function brandContext(b: any): string {
  if (!b) return '';
  const c = b.client_data || {};
  let u = '';
  if (c.clarity) u += `Brand voice: ${c.clarity}. `;
  if (b.niche) u += `Niche: ${b.niche}. `;
  if (b.goal) u += `Goal: ${b.goal}. `;
  if (c.audience) u += `Audience: ${c.audience}. `;
  if (c.offer) u += `Core offer: ${c.offer}. `;
  if (Array.isArray(c.pillars) && c.pillars.length) u += `Pillars: ${c.pillars.join(', ')}. `;
  if (Array.isArray(c.mirrors) && c.mirrors.length) u += `Prefer these Clarity Mirror objects: ${c.mirrors.join(', ')}. `;
  return u;
}

export async function POST(req: NextRequest) {
  const gate = await requireActiveUser();
  if ('error' in gate) return gate.error;

  const body = await req.json().catch(() => ({}));
  const { task, brandId, hook, type, start, count } = body as any;

  let brand: any = null;
  if (brandId) {
    const supabase = supabaseServer();
    const { data } = await supabase.from('brands').select('*').eq('id', brandId).single();
    brand = data;
  }
  const ctx = brandContext(brand);

  try {
    if (task === 'generate') {
      const s = Math.max(1, Number(start) || 1);
      const c = Math.min(12, Math.max(1, Number(count) || 10));
      const sys =
        'You are a social media copywriter for Insight Social Media Management. ' +
        'Output ONLY a JSON array, no prose, no markdown fences. Each item is ' +
        '{"d":number,"t":"teach"|"proof"|"offer","h":string,"m":string}. ' +
        'h is a scroll-stopping hook under 16 words that opens from an everyday object (a Clarity Mirror), ' +
        'and m names that object in one to three words. Weekly rhythm, mostly teach with proof and offer mixed in. ' +
        VOICE_RULES;
      const raw = await claude(
        sys,
        ctx + `Write posts for days ${s} to ${s + c - 1} as the JSON array, one object per day. Vary the hooks. Keep each hook tight.`,
        800
      );
      return NextResponse.json({ raw });
    }
    if (task === 'analyze') {
      const sys = 'You analyze a brand voice for a social media agency. Output ONLY 2 to 3 short sentences, plain text, no preamble, no quotes. ' + VOICE_RULES;
      const text = await claude(sys, ctx + 'Give a brand voice read.', 220);
      return NextResponse.json({ text: text.trim() });
    }
    if (task === 'rewrite') {
      const sys = 'You write a single short social media caption for Insight Social Media Management. Output ONLY the caption text, no preamble, no quotes. ' + VOICE_RULES;
      const text = await claude(sys, ctx + `Write the full caption for a ${type || 'teach'} post built on this hook: ${hook || ''}.`, 400);
      return NextResponse.json({ text: text.trim() });
    }
    return new Response('Unknown task', { status: 400 });
  } catch {
    return new Response('AI temporarily unavailable', { status: 502 });
  }
}
