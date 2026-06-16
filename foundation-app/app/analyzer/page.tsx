import Link from 'next/link';
import SiteShell from '../site-shell';
export const metadata = { title: 'Profile Analyzer — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Profile Analyzer</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>A TPO audit you can hand a client.</h1>
        <p className="sub">Pull any public Instagram profile and read it through the TPO Method. Get an overall score, a Teach, Prove, Offer breakdown, bio optimization, audience insight, and tactical recommendations, downloadable as a branded report.</p>
        <div className="hero-ctas"><Link href="/signup" className="btn2 acc lg">Start for $97 / month</Link></div>
      </div></section>
      <section className="sec2"><div className="wrap2">
        <div className="eyebrow2">Inside the report</div>
        <h2 className="h2-2">Everything a paid audit should say.</h2>
        <div className="feat-grid">
          <div className="feat"><div className="ic">#</div><h3>Overall + 3Cs</h3><p>A headline health score plus Teach, Prove, Offer, engagement, and consistency, each scored with a reason.</p></div>
          <div className="feat"><div className="ic">“</div><h3>Conversation starter</h3><p>A consultative opener you can paste straight into an outreach DM or email.</p></div>
          <div className="feat"><div className="ic">B</div><h3>Bio optimization</h3><p>An assessment of the current bio plus two or three rewritten options that convert.</p></div>
          <div className="feat"><div className="ic">↓</div><h3>Branded export</h3><p>Download the whole audit as a polished report, ready to send to a prospect.</p></div>
        </div>
        <p className="lede2" style={{ marginTop: 28 }}>Save any report to your sidebar so you can reopen it later without running it again. And switch to Viral Remix to rebuild a trending video for your niche.</p>
        <div className="hero-ctas" style={{ justifyContent: 'flex-start', marginTop: 20 }}><Link href="/viral-script" className="btn2 ghost">See Viral Script →</Link></div>
      </div></section>
    </SiteShell>
  );
}
