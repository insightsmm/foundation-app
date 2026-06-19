import Link from 'next/link';
import SiteShell from './site-shell';

export const metadata = { title: 'TemPO HQ — Content OS for Service Businesses' };

export default function Home() {
  return (
    <SiteShell>
      <section className="hero2">
        <div className="wrap2">
          <div className="eyebrow2">Content OS for service businesses</div>
          <h1>The headquarters for content that converts.</h1>
          <p className="sub">The 3Cs of branding and the TPO Method, turned into software. Plan a month of content in your voice, prove your results, analyze any profile, and remix what is already going viral. One system that runs on rhythm, not motivation.</p>
          <div className="hero-ctas">
            <Link href="/signup" className="btn2 acc lg">Start for $97 / month</Link>
            <Link href="/academy" className="btn2 ghost lg">Explore the course</Link>
          </div>
          <div className="builtfor">BUILT FOR LAWYERS · COACHES · CONTRACTORS · AGENCIES · SERVICE BUSINESSES</div>
        </div>
      </section>

      <section className="sec2" id="platform">
        <div className="wrap2">
          <div className="eyebrow2">The platform</div>
          <h2 className="h2-2">Five tools. One workflow.</h2>
          <p className="lede2">Each one is built on the TPO Method, so they all speak the same language and feed each other.</p>
          <div className="feat-grid">
            <div className="feat">
              <div className="ic">F</div>
              <h3>The Local Flywheel</h3>
              <p>The growth loop that turns one piece of content into compounding local visibility, leads, and proof.</p>
              <Link className="more" href="/flywheel">See how it works →</Link>
            </div>
            <div className="feat">
              <div className="ic">E</div>
              <h3>Content Engine</h3>
              <p>A 30-day calendar written in your voice on the Teach, Prove, Offer rhythm. One click, balanced ratios.</p>
              <Link className="more" href="/content-engine">See how it works →</Link>
            </div>
            <div className="feat">
              <div className="ic">A</div>
              <h3>Profile Analyzer</h3>
              <p>A full TPO audit of any Instagram profile, with scores, gaps, and a report you can hand a client.</p>
              <Link className="more" href="/analyzer">See how it works →</Link>
            </div>
            <div className="feat">
              <div className="ic">V</div>
              <h3>Viral Script</h3>
              <p>Drop in a viral video, get its structure rebuilt for your niche with hooks, on-screen text, and a shot list.</p>
              <Link className="more" href="/viral-script">See how it works →</Link>
            </div>
            <div className="feat">
              <div className="ic">U</div>
              <h3>TPO Academy</h3>
              <p>The methodology behind the software. Learn the full TPO Method on your own, or work with Frantz 1:1.</p>
              <Link className="more" href="/academy">Explore the course →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec2" style={{ background: '#fff', borderTop: '1px solid var(--t-line)', borderBottom: '1px solid var(--t-line)' }}>
        <div className="wrap2">
          <div className="eyebrow2">The philosophy</div>
          <h2 className="h2-2">The 3Cs of branding.</h2>
          <p className="lede2">Every brand that wins online runs on three pillars. Most focus on one and wonder why nothing sticks. TemPO HQ is built so all three run together.</p>
          <div className="cols3">
            <div className="pillarcard">
              <div className="eyebrow2">Pillar one · Clarity</div>
              <div className="q">"You cannot grow what you cannot articulate."</div>
              <p>Knowing exactly who you serve, what you do, and how to say it in one sentence.</p>
              <span className="tag2">Powered by the Clarity Mirror Method</span>
            </div>
            <div className="pillarcard">
              <div className="eyebrow2">Pillar two · Consistency</div>
              <div className="q">"The algorithm rewards repetition, not talent."</div>
              <p>Showing up on a predictable schedule across days, weeks, and months. The price of entry.</p>
              <span className="tag2">Powered by the TPO Method</span>
            </div>
            <div className="pillarcard">
              <div className="eyebrow2">Pillar three · Credibility</div>
              <div className="q">"Talk is cheap. Receipts close deals."</div>
              <p>Backing every claim with proof: testimonials, results, screenshots, case studies.</p>
              <span className="tag2">Powered by the Proof Vault</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sec2">
        <div className="wrap2">
          <div className="eyebrow2">The signature framework</div>
          <h2 className="h2-2">The TPO Method.</h2>
          <p className="lede2">Every post serves one of three purposes. That structure is what turns content into clients.</p>
          <div className="tpo3">
            <div className="t"><div className="L">T</div><h4>Teach</h4><p>Educational content that delivers one sharp insight your audience can use today.</p></div>
            <div className="t"><div className="L">P</div><h4>Prove</h4><p>Social proof showing evidence, results, and testimonials that make the claim believable.</p></div>
            <div className="t"><div className="L">O</div><h4>Offer</h4><p>A direct call to action inviting your audience to take a specific next step.</p></div>
          </div>
        </div>
      </section>

      <section className="sec2" style={{ background: '#fff', borderTop: '1px solid var(--t-line)', borderBottom: '1px solid var(--t-line)' }}>
        <div className="wrap2">
          <div className="eyebrow2">How it works</div>
          <h2 className="h2-2">Four steps from blank page to booked client.</h2>
          <div className="steps">
            <div className="step2"><div className="n">01</div><h4>Build your profile</h4><p>Onboard your brand voice, audience, offer, and transformation in about five minutes.</p></div>
            <div className="step2"><div className="n">02</div><h4>Generate your plan</h4><p>One click gives you a 30-day calendar with balanced Teach, Prove, Offer ratios.</p></div>
            <div className="step2"><div className="n">03</div><h4>Expand into scripts</h4><p>Open any day and the Clarity Mirror Method writes the full script in seconds.</p></div>
            <div className="step2"><div className="n">04</div><h4>Prove and repeat</h4><p>Bank every win in the Proof Vault and feed it back into next month's content.</p></div>
          </div>
        </div>
      </section>

      <section className="sec2" id="pricing">
        <div className="wrap2">
          <div className="eyebrow2">Pricing</div>
          <h2 className="h2-2">One price for the whole toolset.</h2>
          <p className="lede2">Foundation and Agency unlock every tool. The TPO course is a separate, one-time purchase you can take on your own time.</p>
          <div className="pricing3">
            <div className="ptier2">
              <div className="nm">Foundation</div>
              <div className="price">$97<span> / month</span></div>
              <p className="desc">For one brand. The full platform.</p>
              <ul className="plist">
                <li><span className="ck2">✓</span> The Local Flywheel</li>
                <li><span className="ck2">✓</span> 30-day Content Engine in your voice</li>
                <li><span className="ck2">✓</span> Profile Analyzer and saved reports</li>
                <li><span className="ck2">✓</span> Viral Script remixer</li>
                <li><span className="ck2">✓</span> Proof Vault</li>
                <li><span className="ck2">✓</span> One brand</li>
              </ul>
              <Link href="/signup" className="btn2 dark">Start Foundation</Link>
            </div>
            <div className="ptier2 featured">
              <div className="badge2">Most popular</div>
              <div className="nm">Agency</div>
              <div className="price">$297<span> / month</span></div>
              <p className="desc">For agencies running multiple client brands.</p>
              <ul className="plist">
                <li><span className="ck2">✓</span> Everything in Foundation</li>
                <li><span className="ck2">✓</span> Unlimited brand profiles</li>
                <li><span className="ck2">✓</span> One-click brand switcher</li>
                <li><span className="ck2">✓</span> Separate calendar and vault per brand</li>
                <li><span className="ck2">✓</span> Per-brand generation limits</li>
              </ul>
              <Link href="/signup" className="btn2 acc">Start Agency</Link>
            </div>
            <div className="ptier2">
              <div className="nm">TPO Course</div>
              <div className="price">$297<span> one-time</span></div>
              <p className="desc">The full TPO Method, self-paced. Learn it on your own.</p>
              <ul className="plist">
                <li><span className="ck2">✓</span> The complete TPO Method, end to end</li>
                <li><span className="ck2">✓</span> Clarity Mirror, 3Cs, Who-What-How</li>
                <li><span className="ck2">✓</span> Playbook and 90-day system PDFs</li>
                <li><span className="ck2">✓</span> Lifetime access to materials</li>
              </ul>
              <Link href="/academy" className="btn2 dark">Explore the course</Link>
            </div>
          </div>
          <div className="bigcta">
            <h2>Want it taught 1:1?</h2>
            <p>Six bi-weekly sessions across twelve weeks. The frameworks, the scripts, and the rhythm, installed with you. Reach out to talk about coaching.</p>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=frantz@insightsm.com&su=TPO%20Method%201:1%20Coaching" target="_blank" rel="noopener noreferrer" className="btn2 acc lg">Email Frantz about coaching</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
