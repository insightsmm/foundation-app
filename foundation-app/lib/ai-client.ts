'use client';

export class NeedsSubscription extends Error {}

async function callAI(payload: Record<string, unknown>) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 402) throw new NeedsSubscription();
  if (!res.ok) throw new Error('ai request failed: ' + res.status);
  return res.json();
}

export type Post = { day: number; type: string; hook: string; mirror: string };
export type Scores = { clarity: number; consistency: number; credibility: number; note: string };
export type Format = { name: string; why: string };

function stripFences(raw: string): string {
  return (raw || '').replace(/```json/gi, '').replace(/```/g, '').trim();
}

function parseJsonLoose<T>(raw: string, open: string, close: string, fallback: T): T {
  let txt = stripFences(raw);
  const a = txt.indexOf(open);
  if (a >= 0) txt = txt.slice(a);
  try {
    return JSON.parse(txt) as T;
  } catch {}
  const last = txt.lastIndexOf(close);
  if (last > 0) {
    try {
      return JSON.parse(txt.slice(0, last + 1)) as T;
    } catch {}
  }
  return fallback;
}

export async function generateMonth(brandId: string): Promise<Post[]> {
  const batches = [
    { start: 1, count: 10 },
    { start: 11, count: 10 },
    { start: 21, count: 10 },
  ];
  const results = await Promise.all(
    batches.map((b) => callAI({ task: 'generate', brandId, start: b.start, count: b.count }))
  );
  const merged = results.flatMap((r: any) => parseJsonLoose<any[]>(r.raw, '[', ']', []));
  return normalize(merged).slice(0, 30).map((p, i) => ({ ...p, day: i + 1 }));
}

export async function analyzeVoice(brandId: string): Promise<string> {
  const { text } = await callAI({ task: 'analyze', brandId });
  return text;
}

export async function score3Cs(brandId: string): Promise<Scores> {
  const { raw } = await callAI({ task: 'score3cs', brandId });
  const o = parseJsonLoose<any>(raw, '{', '}', {});
  const clamp = (n: any) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
  return {
    clarity: clamp(o.clarity),
    consistency: clamp(o.consistency),
    credibility: clamp(o.credibility),
    note: typeof o.note === 'string' ? o.note : '',
  };
}

export async function tailorFormats(brandId: string, names: string[]): Promise<string[]> {
  const { raw } = await callAI({ task: 'formats', brandId, names });
  const arr = parseJsonLoose<any[]>(raw, '[', ']', []);
  return names.map((_, i) => (typeof arr[i] === 'string' ? arr[i] : ''));
}

export async function advise(brandId: string, mode: 'system' | 'production'): Promise<string> {
  const { text } = await callAI({ task: 'advise', brandId, mode });
  return text;
}

export async function rewritePost(brandId: string, hook: string, type: string): Promise<string> {
  const { text } = await callAI({ task: 'rewrite', brandId, hook, type });
  return text;
}

export async function startCheckout(plan: string = 'foundation') {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(data?.error || 'Checkout failed.');
  if (data?.url) window.location.href = data.url;
}

function normalize(arr: any[]): Post[] {
  return (arr || []).map((o, i) => ({
    day: o.d || i + 1,
    type: ['teach', 'proof', 'offer'].includes(o.t) ? o.t : 'teach',
    hook: o.h || '',
    mirror: o.m || '',
  }));
}

export type IgMetrics = { handle: string; fullName: string; followers: number; following: number; postsCount: number; avgLikes: number; avgComments: number; engagement: number; verified: boolean; bio: string };
export type Breakdown = { score?: number; summary?: string; currently_doing?: string[]; whats_missing?: string[]; post_idea?: string };
export type Recommendation = { title: string; pillar?: string; priority?: string; detail?: string };
export type IgReport = {
  overall?: number;
  conversation_starter?: string;
  health_scores?: { teach?: number; proof?: number; offer?: number; engagement?: number; consistency?: number };
  breakdown?: { teach?: Breakdown; proof?: Breakdown; offer?: Breakdown };
  audience_insight?: string;
  recommendations?: Recommendation[];
};

export async function analyzeProfile(handle: string): Promise<{ metrics?: IgMetrics; report?: IgReport; error?: string }> {
  const res = await fetch('/api/analyze', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ handle }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: data?.error || ('Request failed (' + res.status + ')') };
  return data;
}
