import { supabaseServer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createElement } from 'react';
import Dashboard from './dashboard';

export const dynamic = 'force-dynamic';

export default async function AppPage({ searchParams }: { searchParams: { checkout?: string } }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('plan,is_admin,subscription_status').eq('id', user.id).single();
  const p = (profile as any) || {};
  const active = p.is_admin || ['active', 'trialing'].includes(p.subscription_status);
  if (!active && searchParams?.checkout !== 'success') redirect('/pricing');
  const { data: brands } = await supabase.from('brands').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
  return createElement(Dashboard, { initialBrands: brands || [], userId: user.id, plan: p.plan || 'foundation', isAdmin: !!p.is_admin });
}
