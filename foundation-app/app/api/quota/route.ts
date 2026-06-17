import { NextRequest, NextResponse } from 'next/server';
import { requireActiveUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const ALLOW_30 = 1;
const ALLOW_7 = 4;

function monthStartISO(): string {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), 1)).toISOString();
}

async function status(userId: string, brandId: string) {
  const admin = supabaseAdmin();
  const { data: prof } = await admin.from('profiles').select('is_admin,current_period_end,plan').eq('id', userId).single();
  const isAdmin = !!prof?.is_admin;
  const periodEnd = prof?.current_period_end || null;

  const mStart = monthStartISO();
  let thirtyStart = mStart;
  if (periodEnd) {
    const ps = new Date(periodEnd);
    ps.setUTCMonth(ps.getUTCMonth() - 1);
    thirtyStart = ps.toISOString();
  }

  const c30 = await admin.from('generation_events').select('id', { count: 'exact', head: true })
    .eq('brand_id', brandId).eq('span', '30').gte('created_at', thirtyStart);
  const c7 = await admin.from('generation_events').select('id', { count: 'exact', head: true })
    .eq('brand_id', brandId).eq('span', '7').gte('created_at', mStart);

  const used30 = c30.count || 0;
  const used7 = c7.count || 0;
  return {
    isAdmin, plan: prof?.plan || null, periodEnd,
    used30, allowed30: ALLOW_30, can30: isAdmin || used30 < ALLOW_30,
    used7, allowed7: ALLOW_7, can7: isAdmin || used7 < ALLOW_7,
  };
}

export async function POST(req: NextRequest) {
  const gate = await requireActiveUser();
  if ('error' in gate) return gate.error;
  const userId = gate.user.id;

  const body = await req.json().catch(() => ({} as any));
  const brandId = String(body?.brandId || '');
  const action = String(body?.action || 'status');
  const span = body?.span === '7' ? '7' : '30';
  if (!brandId) return NextResponse.json({ error: 'Missing brand.' }, { status: 400 });

  const st = await status(userId, brandId);

  if (action === 'status') return NextResponse.json(st);

  if (action === 'consume') {
    const can = span === '30' ? st.can30 : st.can7;
    if (!can) {
      const msg = span === '30'
        ? `You have used your 30-day generation for this brand this billing period. The next one unlocks at renewal${st.periodEnd ? ' on ' + new Date(st.periodEnd).toLocaleDateString() : ''}.`
        : `You have used all ${ALLOW_7} weekly generations for this brand this month. They reset on the 1st.`;
      return NextResponse.json({ ok: false, message: msg, ...st }, { status: 200 });
    }
    const admin = supabaseAdmin();
    await admin.from('generation_events').insert({ user_id: userId, brand_id: brandId, span });
    const after = await status(userId, brandId);
    return NextResponse.json({ ok: true, ...after });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
