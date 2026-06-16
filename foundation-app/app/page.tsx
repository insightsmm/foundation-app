import Link from 'next/link';

export default function Landing() {
  return (
    <div>
      <nav className="lnav">
        <span className="brandmark">Foundation <span className="muted">by TPO</span></span>
        <span className="lnav-links">
          <Link className="btn" href="/login" style={{ padding: '8px 14px' }}>Log in</Link>
          <Link className="btn mark" href="/signup" style={{ padding: '8px 14px' }}>Start Foundation</Link>
        </span>
      </nav>

      <header className="hero">
        <div className="eyebrow">Foundation by Insight Social Media Management</div>
        <h1>Thirty days of content, written in your voice.</h1>
        <p className="sub">
          Set your brand once. The engine writes on the TPO rhythm. Teach earns trust, Proof earns belief,
          Offer earns the booking. Every hook is pulled from a Clarity Mirror so it stops the scroll.
        </p>
        <div className="cta">
          <Link className="btn mark" href="/signup">Start Foundation</Link>
          <Link className="btn" href="/login">Log in</Link>
        </div>
      </header>

      <section className="section">
        <h2>The TPO rhythm</h2>
        <p className="sublede">Three jobs, one loop. Every post you publish is doing one of them on purpose.</p>
        <div className="three">
          <div className="tpo">
            <div className="k t">Teach</div>
            <h3>Earn trust</h3>
            <p>Give one clear idea your audience needs this week. Plain, useful, easy to save.</p>
          </div>
          <div className="tpo">
            <div className="k p">Proof</div>
            <h3>Earn belief</h3>
            <p>Show the result before you make the ask. A real win moves more people than a clever line.</p>
          </div>
          <div className="tpo">
            <div className="k o">Offer</div>
            <h3>Earn the booking</h3>
            <p>Say what you do in plain words and invite the next step. No pressure, just clarity.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What is inside</h2>
        <p className="sublede">A full content system, not a pile of prompts.</p>
        <div className="three">
          <div className="tpo feat">
            <h3>BrandOS</h3>
            <p>Your clarity, audience, offer, pillars, and Clarity Mirrors in one place. The engine reads from it.</p>
          </div>
          <div className="tpo feat">
            <h3>Content engine</h3>
            <p>Thirty days of hooks on the TPO rhythm, generated in your voice, broken into Setup, Punch, Land, CTA.</p>
          </div>
          <div className="tpo feat">
            <h3>Proof Vault</h3>
            <p>Log a win, turn it into a Proof post, and watch the flywheel spin faster every time.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>One plan. Everything you need to stay consistent.</h2>
        <p className="sublede">Foundation hands you the engine. When the wheel is turning, you graduate up to the Local Flywheel.</p>
        <div className="pricewrap">
          <div className="pricecard">
            <div className="eyebrow">Foundation</div>
            <div className="amt" style={{ marginTop: 8 }}>$97<span> / month</span></div>
            <ul>
              <li><span className="ck">&#10003;</span> BrandOS workspace, six tabs</li>
              <li><span className="ck">&#10003;</span> 30-day content engine in your voice</li>
              <li><span className="ck">&#10003;</span> Proof Vault and the flywheel loop</li>
              <li><span className="ck">&#10003;</span> 3Cs scoring and voice read</li>
              <li><span className="ck">&#10003;</span> Format Finder and publishing schedule</li>
            </ul>
            <Link className="btn mark" href="/signup" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Start Foundation</Link>
          </div>
        </div>
      </section>

      <section className="lcta">
        <h2>Your next thirty days are already written.</h2>
        <Link className="btn mark" href="/signup">Start Foundation</Link>
      </section>

      <footer className="lfoot">
        <span>insightsm.com &middot; @insightsocialmm</span>
        <span>Insight Social Media Management</span>
      </footer>
    </div>
  );
}
