import Link from 'next/link';
import SiteShell from '../site-shell';
export const metadata = { title: 'The Local Flywheel — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">The Local Flywheel</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Content that compounds, not content that disappears.</h1>
        <p className="sub">Most local businesses post and pray. The Flywheel turns each post into momentum: attention becomes leads, leads become proof, and proof fuels the next round of content that pulls even harder.</p>
        <div className="hero-ctas"><Link href="/signup" className="btn2 acc lg">Start for $97 / month</Link></div>
      </div></section>
      <section className="sec2"><div className="wrap2">
        <div className="eyebrow2">The loop</div>
        <h2 className="h2-2">Four turns of the wheel.</h2>
        <div className="steps">
          <div className="step2"><div className="n">01</div><h4>Publish on rhythm</h4><p>The Content Engine keeps you posting on a Teach, Prove, Offer cadence so the algorithm remembers you.</p></div>
          <div className="step2"><div className="n">02</div><h4>Capture the lead</h4><p>Clear offers and CTAs turn attention into DMs, calls, and bookings instead of vanity views.</p></div>
          <div className="step2"><div className="n">03</div><h4>Bank the proof</h4><p>Every win, result, and testimonial goes into the Proof Vault the moment it happens.</p></div>
          <div className="step2"><div className="n">04</div><h4>Feed it back</h4><p>Proof becomes your most believable content, which pulls the next lead. The wheel spins faster.</p></div>
        </div>
      </div></section>
      <section className="sec2" style={{ background: '#fff', borderTop: '1px solid var(--t-line)' }}><div className="wrap2">
        <h2 className="h2-2">It runs on rhythm, not motivation.</h2>
        <p className="lede2">You do not need to feel inspired. You need a system that keeps turning. That is the whole point of TemPO HQ.</p>
        <div className="hero-ctas" style={{ justifyContent: 'flex-start', marginTop: 24 }}><Link href="/content-engine" className="btn2 ghost">See the Content Engine →</Link></div>
      </div></section>
    </SiteShell>
  );
}
