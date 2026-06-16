import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();
  if (!sig) return new Response('Missing signature', { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Bad signature', { status: 400 });
  }

  const admin = supabaseAdmin();
  async function setStatus(userId: string, status: string, customerId?: string, periodEnd?: number, plan?: string) {
    await admin
      .from('profiles')
      .update({
        subscription_status: status,
        stripe_customer_id: customerId ?? undefined,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        plan: plan || 'foundation',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = (s.metadata?.user_id as string) || (s.client_reference_id as string);
      const plan = s.metadata?.plan as string;
      if (userId) await setStatus(userId, 'active', s.customer as string, undefined, plan);
    }
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id as string;
      const plan = sub.metadata?.plan as string;
      const status = event.type === 'customer.subscription.deleted' ? 'canceled' : sub.status;
      if (userId) await setStatus(userId, status, sub.customer as string, (sub as any).current_period_end, plan);
    }
  } catch {
    return new Response('handler error', { status: 200 });
  }
  return new Response('ok', { status: 200 });
}
