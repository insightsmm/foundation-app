import SiteShell from '../site-shell';
export const metadata = { title: 'Resources — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Resources</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>What's working on social, right now.</h1>
        <p className="sub">A running pulse on what is trending, the formats that are breaking out, and the platform changes worth knowing, summarized for busy service-business owners.</p>
      </div></section>
      <section className="sec2" style={{ paddingTop: 0 }}><div className="wrap2">
        <div className="qbox" style={{ maxWidth: 620 }}>
          <div className="big">The live feed is coming online.</div>
          <p>This page will refresh on a schedule from real, current sources. We are wiring it up now so it surfaces genuine trends rather than guesses.</p>
        </div>
      </div></section>
    </SiteShell>
  );
}
