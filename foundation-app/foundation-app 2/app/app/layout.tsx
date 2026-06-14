import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single();
  const active = profile && ['active', 'trialing'].includes(profile.subscription_status);
  if (!active) redirect('/pricing');
  return <>{children}</>;
}
