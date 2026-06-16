import { supabaseServer } from '@/lib/auth';
import Dashboard from './dashboard';

export const dynamic = 'force-dynamic';

export default async function AppPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true });
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan,is_admin')
    .eq('id', user!.id)
    .single();
  return <Dashboard initialBrands={brands || []} userId={user!.id} plan={profile?.plan || 'foundation'} isAdmin={!!profile?.is_admin} />;
}
