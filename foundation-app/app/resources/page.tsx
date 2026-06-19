import SiteShell from '../site-shell';
import { supabaseServer } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Resources — TemPO HQ' };

export default async function Page() {
  const supabase = supabaseServer();
  const { data: resources } = await supabase
    .from('resources')
    .select('title,description,url,category,created_at')
    .order('created_at', { ascending: false });

  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Resources</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>What&apos;s working on social, right now.</h1>
        <p className="sub">Hand-picked tools, templates, and reads for service-business owners growing on social.</p>
      </div></section>
      <section className="sec2" style={{ paddingTop: 0 }}><div className="wrap2">
        {(!resources || resources.length === 0) ? (
          <div className="qbox" style={{ maxWidth: 620 }}>
            <div className="big">Resources are being added.</div>
            <p>New picks land here regularly. Check back shortly.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
            {resources.map((r: any, i: number) => (
              <div key={i} className="qbox">
                {r.category ? <div className="eyebrow2">{r.category}</div> : null}
                <div className="big" style={{ marginTop: 6 }}>
                  {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{r.title}</a> : r.title}
                </div>
                {r.description ? <p style={{ margin: '8px 0 0' }}>{r.description}</p> : null}
              </div>
            ))}
          </div>
        )}
      </div></section>
    </SiteShell>
  );
}
