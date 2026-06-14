'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function Dashboard({ initialBrand, userId }: { initialBrand: any; userId: string }) {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [brand, setBrand] = useState<any>(initialBrand);
  const [area, setArea] = useState<Area>(initialBrand ? 'engine' : 'brandos');
  const brandId = brand?.id ?? null;

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <div className="shell">
      <aside className="rail">
        <div className="rail-top">
          <div className="eyebrow">Foundation</div>
          <div className="rail-brand">{brand?.name || 'Your brand'}</div>
        </div>
        <nav className="rail-nav">
          {NAV.map((n) => (
            <button key={n.id} className={'navitem' + (area === n.id ? ' on' : '')} onClick={() => setArea(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <button className="navitem signout" onClick={signOut}>Sign out</button>
      </aside>

      <main className="main">
        {area === 'brandos' && (
          <BrandOS brand={brand} brandId={brandId} userId={userId} onSaved={(b) => { setBrand(b); }} />
        )}
        {area === 'engine' && <Engine brandId={brandId} />}
        {area === 'proof' && <Proof brandId={brandId} userId={userId} />}
      </main>
    </div>
  );
}
