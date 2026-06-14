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

export async function generateMonth(brandId: string): Promise<Post[]> {
  const batches = [
    { start: 1, count: 10 },
    { start: 11, count: 10 },
    { start: 21, count: 10 },
  ];
  const results = await Promise.all(
    batches.map((b) => callAI({ task: 'generate', brandId, start: b.start, count: b.count }))
  );
  const merged = results.flatMap((r: any) => parsePosts(r.raw));
  return normalize(merged).slice(0, 30).map((p, i) => ({ ...p, day: i + 1 }));
}

export async function analyzeVoice(brandId: string): Promise<string> {
  const { text } = await callAI({ task: 'analyze', brandId });
  return text;
}

export async function rewritePost(brandId: string, hook: string, type: string): Promise<string> {
  const { text } = await callAI({ task: 'rewrite', brandId, hook, type });
  return text;
}

export async function startCheckout() {
  const res = await fetch('/api/stripe/checkout', { method: 'POST' });
  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }
  if (!res.ok) throw new Error('checkout failed');
  const { url } = await res.json();
  window.location.href = url;
}

function parsePosts(raw: string): any[] {
  let txt = (raw || '').replace(/```json/gi, '').replace(/```/g, '').trim();
  const a = txt.indexOf('[');
  if (a >= 0) txt = txt.slice(a);
  try {
    return JSON.parse(txt);
  } catch {}
  const last = txt.lastIndexOf('}');
  if (last > 0) {
    try {
      return JSON.parse(txt.slice(0, last + 1) + ']');
    } catch {}
  }
  return [];
}

function normalize(arr: any[]): Post[] {
  return (arr || []).map((o, i) => ({
    day: o.d || i + 1,
    type: ['teach', 'proof', 'offer'].includes(o.t) ? o.t : 'teach',
    hook: o.h || '',
    mirror: o.m || '',
  }));
}
