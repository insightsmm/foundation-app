import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: me } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!me?.is_admin) redirect('/app');

  const admin = supabaseAdmin();
  const [{ data: profiles }, { data: brands }, usersRes] = await Promise.all([
    admin.from('profiles').select('id,plan,subscription_status,is_admin'),
    admin.from('brands').select('id,name,niche,user_id,created_at').order('created_at', { ascending: false }),
    admin.auth.admin.listUsers({ perPage: 1000 } as any),
  ]);

  const emailById = new Map<string, string>();
  for (const u of (usersRes?.data?.users || [])) emailById.set(u.id, u.email || '(no email)');

  const brandCount = new Map<string, number>();
  for (const b of (brands || [])) brandCount.set(b.user_id, (brandCount.get(b.user_id) || 0) + 1);

  const rows = (profiles || []).map((p: any) => ({
    email: emailById.get(p.id) || p.id,
    plan: p.plan || '-',
    status: p.subscription_status || '-',
    admin: !!p.is_admin,
    brands: brandCount.get(p.id) || 0,
  })).sort((a, b) => Number(b.admin) - Number(a.admin));

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="eyebrow">Super admin</div>
          <h1 className="h-display" style={{ fontSize: 26, margin: '6px 0 0' }}>Everything on the platform</h1>
        </div>
        <Link className="btn" href="/app">Back to workspace</Link>
      </div>

      <h2 className="admin-h">Accounts <span className="muted">({rows.length})</span></h2>
      <div className="admin-table">
        <div className="admin-tr admin-head"><span>Email</span><span>Plan</span><span>Status</span><span>Brands</span><span>Role</span></div>
        {rows.map((r) => (
          <div key={r.email} className="admin-tr">
            <span>{r.email}</span>
            <span>{r.plan}</span>
            <span><i className={'dot ' + (r.status === 'active' ? 'ok' : 'off')} /> {r.status}</span>
            <span>{r.brands}</span>
            <span>{r.admin ? <em className="adminbadge">admin</em> : 'member'}</span>
          </div>
        ))}
      </div>

      <h2 className="admin-h">Brands <span className="muted">({(brands || []).length})</span></h2>
      <div className="admin-table">
        <div className="admin-tr admin-head bt"><span>Brand</span><span>Niche</span><span>Owner</span><span>Created</span></div>
        {(brands || []).map((b: any) => (
          <div key={b.id} className="admin-tr bt">
            <span>{b.name || 'Untitled'}</span>
            <span className="muted">{b.niche || '-'}</span>
            <span>{emailById.get(b.user_id) || '-'}</span>
            <span className="muted">{new Date(b.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
