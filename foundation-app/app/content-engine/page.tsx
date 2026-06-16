import Link from 'next/link';
import SiteShell from '../site-shell';
export const metadata = { title: 'Content Engine — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Content Engine</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>A month of content, written in your voice, in one click.</h1>
        <p className="sub">Onboard your brand once. The engine generates a 30-day calendar on the Teach, Prove, Offer rhythm, then writes the full script for any day using the Clarity Mirror Method.</p>
        <div className="hero-ctas"><Link href="/signup" className="btn2 acc lg">Start for $97 / month</Link></div>
      </div></section>
      <section className="sec2"><div className="wrap2">
        <div className="eyebrow2">What you get</div>
        <h2 className="h2-2">Planned, balanced, and yours.</h2>
        <div className="feat-grid">
          <div className="feat"><div className="ic">30</div><h3>A full 30-day calendar</h3><p>Balanced Teach, Prove, Offer ratios so you are never just selling or just teaching.</p></div>
          <div className="feat"><div className="ic">7</div><h3>Weekly top-ups</h3><p>Generate a fresh 7-day plan up to four times a month when you want to adjust on the fly.</p></div>
          <div className="feat"><div className="ic">✎</div><h3>Full scripts on demand</h3><p>Open any day and get a Setup, Punch, Land, CTA script in your voice in seconds.</p></div>
          <div className="feat"><div className="ic">★</div><h3>Format library</h3><p>Proven viral formats you can drop straight onto the calendar as drafts.</p></div>
        </div>
        <p className="lede2" style={{ marginTop: 28 }}>Fair-use limits keep generation sustainable: one 30-day calendar per billing period and four 7-day calendars a month, counted per brand. You always see what you have left, and a clear note after every generation.</p>
      </div></section>
    </SiteShell>
  );
}
