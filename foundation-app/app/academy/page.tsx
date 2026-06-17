import Link from 'next/link';
import SiteShell from '../site-shell';
export const metadata = { title: 'TPO Method Academy — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">The TPO Method Academy</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Learn the method behind the software.</h1>
        <p className="sub">Anyone can generate a script. The Academy teaches the methodology that makes it work: the 3Cs, the TPO Method, the Clarity Mirror, and the systems that turn content into booked clients. Take it on your own, or work with Frantz 1:1.</p>
        <div className="hero-ctas">
          <a href="https://buy.stripe.com/cNi3cv5QM8lA9LL7ND0sU05" className="btn2 acc lg">Enroll in the course ($297)</a>
          <a href="/contact" className="btn2 ghost lg">Ask about 1:1 coaching</a>
        </div>
      </div></section>

      <section className="sec2"><div className="wrap2">
        <div className="eyebrow2">Two ways in</div>
        <h2 className="h2-2">Self-paced, or taught with you.</h2>
        <div className="pricing3">
          <div className="ptier2">
            <div className="nm">Digital Course</div>
            <div className="price">$297<span> one-time</span></div>
            <p className="desc">The full TPO Method, self-paced. Learn on your own schedule, keep it for life.</p>
            <ul className="plist">
              <li><span className="ck2">✓</span> The complete TPO Method, end to end</li>
              <li><span className="ck2">✓</span> Clarity Mirror, 3Cs, and Who-What-How frameworks</li>
              <li><span className="ck2">✓</span> The TPO Method playbook and 90-day system PDFs</li>
              <li><span className="ck2">✓</span> Lifetime access to materials and updates</li>
            </ul>
            <a href="https://buy.stripe.com/cNi3cv5QM8lA9LL7ND0sU05" className="btn2 dark">Enroll in the course</a>
          </div>
          <div className="ptier2 featured">
            <div className="badge2">High touch</div>
            <div className="nm">1:1 Coaching</div>
            <div className="price">Let's talk</div>
            <p className="desc">Six bi-weekly sessions across twelve weeks. The frameworks installed with you, around your offer.</p>
            <ul className="plist">
              <li><span className="ck2">✓</span> 6 bi-weekly 1:1 sessions over 12 weeks</li>
              <li><span className="ck2">✓</span> A personal content roadmap built on your offer</li>
              <li><span className="ck2">✓</span> Everything in the digital course</li>
              <li><span className="ck2">✓</span> Direct access between sessions</li>
            </ul>
            <a href="/contact" className="btn2 acc">Email Frantz to learn more</a>
          </div>
        </div>
      </div></section>

      <section className="sec2" style={{ background: '#fff', borderTop: '1px solid var(--t-line)' }}><div className="wrap2">
        <div className="eyebrow2">What you learn</div>
        <h2 className="h2-2">From a blank calendar to a converting system.</h2>
        <div className="cols3">
          <div className="pillarcard"><div className="eyebrow2">Module one</div><div className="q">The 3Cs diagnostic</div><p>Find which of Clarity, Consistency, or Credibility is broken, and fix it first.</p></div>
          <div className="pillarcard"><div className="eyebrow2">Module two</div><div className="q">The TPO calendar</div><p>Install a Teach, Prove, Offer rhythm you can actually keep.</p></div>
          <div className="pillarcard"><div className="eyebrow2">Module three</div><div className="q">The Clarity Mirror</div><p>Write hooks that use everyday analogies to make the foreign feel obvious.</p></div>
        </div>
      </div></section>
    </SiteShell>
  );
}
