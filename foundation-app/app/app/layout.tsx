import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('subscription_status,is_admin').eq('id', user.id).single();
  const active = profile && (profile.is_admin || ['active', 'trialing'].includes(profile.subscription_status));
  if (!active) redirect('/pricing');
  return <>{children}</>;
}
