import Link from 'next/link';
import SiteShell from '../site-shell';
export const metadata = { title: 'Viral Script — TemPO HQ' };
export default function Page() {
  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Viral Script</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Study what went viral. Rebuild it for your niche.</h1>
        <p className="sub">Drop in a viral video's script or a reel link. The tool breaks down its structure beat by beat, then rebuilds it for your niche with on-screen hooks, a spoken script, a shot list, and a caption.</p>
        <div className="hero-ctas"><Link href="/signup" className="btn2 acc lg">Start for $97 / month</Link></div>
      </div></section>
      <section className="sec2"><div className="wrap2">
        <div className="eyebrow2">What it gives back</div>
        <h2 className="h2-2">A ready-to-film remix.</h2>
        <div className="feat-grid">
          <div className="feat"><div className="ic">▦</div><h3>The structure</h3><p>The original mapped beat by beat, plus why it worked, so you keep the mechanics not the topic.</p></div>
          <div className="feat"><div className="ic">A</div><h3>Hooks + on-screen text</h3><p>Several hook options and the overlay text in order, written for your audience.</p></div>
          <div className="feat"><div className="ic">▶</div><h3>Shot list</h3><p>A shot-by-shot guide so you know exactly how to film each part.</p></div>
          <div className="feat"><div className="ic">¶</div><h3>Script + caption</h3><p>The full spoken script in beats and a caption with a CTA keyword, ready to post.</p></div>
        </div>
      </div></section>
    </SiteShell>
  );
}
