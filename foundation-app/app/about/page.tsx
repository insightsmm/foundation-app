import Link from 'next/link';
import SiteShell from '../site-shell';
export const metadata = { title: 'About — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Built by an operator</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Hey, I'm Frantz.</h1>
        <p className="sub">I run Insight Social Media Management, a Tampa-based content agency working with law firms, coaches, contractors, and service businesses.</p>
      </div></section>
      <section className="sec2"><div className="wrap2" style={{ maxWidth: 760 }}>
        <p className="lede2">After years building content systems for clients, I kept seeing the same pattern: the best operators were losing to less qualified competitors who simply showed up online consistently.</p>
        <p className="lede2" style={{ marginTop: 18 }}>So I built the systems my clients needed. The TPO Method came first. Then the Clarity Mirror Method. Then the 3Cs framework. Then the software to run all of it. That software is TemPO HQ.</p>
        <p className="lede2" style={{ marginTop: 18 }}>The best lawyer does not always win. The most visible one does. TemPO HQ exists to give the best operators the system to also be the most visible.</p>
        <div className="hero-ctas" style={{ justifyContent: 'flex-start', marginTop: 28 }}>
          <Link href="/signup" className="btn2 acc">Start for $97 / month</Link>
          <Link href="/contact" className="btn2 ghost">Get in touch</Link>
        </div>
      </div></section>
    </SiteShell>
  );
}
