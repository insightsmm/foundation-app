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
    .order('created_at', { ascending: true })
    .limit(1);
  const brand = brands && brands.length ? brands[0] : null;
  return <Dashboard initialBrand={brand} userId={user!.id} />;
}
