'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-browser';
import BrandOS from './brandos';
import Engine from './engine';
import Proof from './proof';

type Area = 'brandos' | 'engine' | 'proof';
const NAV: { id: Area; label: string }[] = [
  { id: 'brandos', label: 'BrandOS' },
  { id: 'engine', label: 'Content engine' },
  { id: 'proof', label: 'Proof Vault' },
];

export default function Dashboard({ initialBrands, userId, plan, isAdmin }: { initialBrands: any[]; userId: string; plan: string; isAdmin?: boolean }) {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [brands, setBrands] = useState<any[]>(initialBrands);
  const [activeId, setActiveId] = useState<string | null>(initialBrands[0]?.id ?? null);
  const [area, setArea] = useState<Area>(initialBrands.length ? 'engine' : 'brandos');
  const [creating, setCreating] = useState(false);

  const active = brands.find((b) => b.id === activeId) ?? null;
  const maxBrands = plan === 'agency' ? 50 : 1;
  const canAdd = brands.length < maxBrands;

  function upsertBrand(b: any) {
    setBrands((prev) => {
      const i = prev.findIndex((x) => x.id === b.id);
      if (i >= 0) { const c = [...prev]; c[i] = b; return c; }
      return [...prev, b];
    });
  }

  async function addBrand() {
    if (!canAdd || creating) return;
    setCreating(true);
    const { data } = await supabase.from('brands').insert({ user_id: userId, name: 'New brand', client_data: {} }).select('*').single();
    if (data) { setBrands((prev) => [...prev, data]); setActiveId((data as any).id); setArea('brandos'); }
    setCreating(false);
  }

  async function signOut() { await supabase.auth.signOut(); router.push('/login'); }

  return (
    <div className="shell">
      <aside className="rail">
        <div className="rail-top">
          <div className="eyebrow">Foundation{plan === 'agency' ? ' Agency' : ''}</div>
          {brands.length > 0 ? (
            <select className="brandswitch" value={activeId || ''} onChange={(e) => setActiveId(e.target.value)}>
              {brands.map((b) => (<option key={b.id} value={b.id}>{b.name || 'Untitled brand'}</option>))}
            </select>
          ) : (
            <div className="rail-brand">No brand yet</div>
          )}
          {canAdd ? (
            <button className="addbrand" onClick={addBrand} disabled={creating}>+ Add brand</button>
          ) : (
            <Link className="addbrand upsell" href="/pricing">+ Add brand (upgrade to Agency)</Link>
          )}
        </div>
        <nav className="rail-nav">
          {NAV.map((n) => (
            <button key={n.id} className={'navitem' + (area === n.id ? ' on' : '')} onClick={() => setArea(n.id)}>{n.label}</button>
          ))}
          {isAdmin && <Link className="navitem adminlink" href="/app/admin">Super admin</Link>}
        </nav>
        <button className="navitem signout" onClick={signOut}>Sign out</button>
      </aside>

      <main className="main">
        {!active ? (
          <div className="center" style={{ minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="eyebrow">Welcome</div>
              <h2 className="h-display" style={{ fontSize: 24, margin: '8px 0 14px' }}>Create your first brand</h2>
              <p className="muted" style={{ maxWidth: '42ch', margin: '0 auto 20px', lineHeight: 1.6 }}>Set it up once and the whole workspace runs off it.</p>
              <button className="btn mark" onClick={addBrand} disabled={creating}>{creating ? 'Creating...' : 'Create brand'}</button>
            </div>
          </div>
        ) : area === 'brandos' ? (
          <BrandOS key={active.id} brand={active} brandId={active.id} userId={userId} onSaved={upsertBrand} />
        ) : area === 'engine' ? (
          <Engine key={active.id} brandId={active.id} userId={userId} brand={active} />
        ) : (
          <Proof key={active.id} brandId={active.id} userId={userId} />
        )}
      </main>
    </div>
  );
}
