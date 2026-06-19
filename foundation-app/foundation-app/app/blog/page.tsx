import Link from 'next/link';
import SiteShell from '../site-shell';
import { supabaseServer } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog — TemPO HQ' };

export default async function Page() {
  const supabase = supabaseServer();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title,slug,excerpt,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">The Blog</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Run your business on social, the TPO way.</h1>
        <p className="sub">Fresh posts on growing a service business on social media, built around the 3Cs and the TPO Method.</p>
      </div></section>
      <section className="sec2" style={{ paddingTop: 0 }}><div className="wrap2">
        {(!posts || posts.length === 0) ? (
          <div className="qbox" style={{ maxWidth: 620 }}>
            <div className="big">First posts are publishing soon.</div>
            <p>New writing lands here regularly. Check back shortly.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
            {posts.map((p: any) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="qbox" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div className="eyebrow2">{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div className="big" style={{ marginTop: 6 }}>{p.title}</div>
                {p.excerpt ? <p style={{ margin: '8px 0 0' }}>{p.excerpt}</p> : null}
                <span style={{ display: 'inline-block', marginTop: 12, fontWeight: 700 }}>Read →</span>
              </Link>
            ))}
          </div>
        )}
      </div></section>
    </SiteShell>
  );
}
