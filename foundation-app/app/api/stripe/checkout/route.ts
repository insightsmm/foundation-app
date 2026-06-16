import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const plan = body?.plan === 'agency' ? 'agency' : 'foundation';
  const price = plan === 'agency'
    ? (process.env.STRIPE_PRICE_ID_AGENCY || process.env.STRIPE_PRICE_ID || '')
    : (process.env.STRIPE_PRICE_ID || '');

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not connected. Set STRIPE_SECRET_KEY in your environment.' }, { status: 400 });
  }
  if (!price.startsWith('price_')) {
    return NextResponse.json({ error: `The ${plan} price is not set correctly. ${plan === 'agency' ? 'STRIPE_PRICE_ID_AGENCY' : 'STRIPE_PRICE_ID'} must be a recurring price ID that starts with price_.` }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const base = (process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || '').replace(/\/$/, '');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan },
      subscription_data: { metadata: { user_id: user.id, plan } },
      success_url: `${base}/app?checkout=success`,
      cancel_url: `${base}/pricing?checkout=cancel`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Stripe could not start checkout.' }, { status: 400 });
  }
}
