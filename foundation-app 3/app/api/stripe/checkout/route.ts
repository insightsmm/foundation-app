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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer_email: user.email || undefined,
    client_reference_id: user.id,
    metadata: { user_id: user.id },
    subscription_data: { metadata: { user_id: user.id } },
    success_url: `${origin}/app?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancel`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
