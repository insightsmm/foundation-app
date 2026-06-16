import Link from 'next/link';

const NAV: [string, string][] = [
  ['/flywheel', 'Flywheel'],
  ['/content-engine', 'Content Engine'],
  ['/analyzer', 'Analyzer'],
  ['/academy', 'Academy'],
  ['/blog', 'Blog'],
  ['/resources', 'Resources'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <nav className="site-nav">
        <div className="wrap2 row2">
          <Link href="/" className="logo2"><span className="dot" />TemPO HQ</Link>
          <div className="site-links">
            {NAV.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}
          </div>
          <div className="nav-spacer" />
          <Link href="/login" className="btn2 ghost">Sign in</Link>
          <Link href="/signup" className="btn2 acc">Get started</Link>
        </div>
      </nav>
      {children}
      <footer className="site-foot">
        <div className="wrap2">
          <div className="row2">
            <div className="logo2"><span className="dot" />TemPO HQ</div>
            <div className="foot-links">
              <Link href="/flywheel">Flywheel</Link>
              <Link href="/content-engine">Content Engine</Link>
              <Link href="/analyzer">Analyzer</Link>
              <Link href="/viral-script">Viral Script</Link>
              <Link href="/academy">Academy</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          <hr className="divider2" style={{ margin: '18px 0' }} />
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} TemPO HQ by Insight Social Media Management. The headquarters for content that converts.</p>
        </div>
      </footer>
    </div>
  );
}
