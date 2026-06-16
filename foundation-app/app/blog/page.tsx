import SiteShell from '../site-shell';
export const metadata = { title: 'Blog — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">The Blog</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Run your business on social, the TPO way.</h1>
        <p className="sub">A fresh post every week on the best practices of growing a service business on social media, built around the 3Cs and the TPO Method.</p>
      </div></section>
      <section className="sec2" style={{ paddingTop: 0 }}><div className="wrap2">
        <div className="qbox" style={{ maxWidth: 620 }}>
          <div className="big">First posts are publishing soon.</div>
          <p>The weekly engine is being switched on. Check back shortly, or start with the platform and put the method to work today.</p>
        </div>
      </div></section>
    </SiteShell>
  );
}
