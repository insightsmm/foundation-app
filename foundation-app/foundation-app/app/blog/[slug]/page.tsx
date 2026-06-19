import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteShell from '../../site-shell';
import { supabaseServer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = supabaseServer();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title,body,author,created_at')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  const paras = String(post.body || '').split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2" style={{ maxWidth: 760 }}>
        <Link href="/blog" className="eyebrow2" style={{ textDecoration: 'none' }}>← Blog</Link>
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', marginTop: 8 }}>{post.title}</h1>
        <p className="sub">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.author}</p>
      </div></section>
      <section className="sec2" style={{ paddingTop: 0 }}><div className="wrap2" style={{ maxWidth: 760 }}>
        <article style={{ fontSize: 17, lineHeight: 1.7 }}>
          {paras.map((para, i) => <p key={i} style={{ margin: '0 0 18px' }}>{para}</p>)}
        </article>
      </div></section>
    </SiteShell>
  );
}
