'use client';
import SiteShell from '../site-shell';

export default function Page() {
  const handleEmailClick = () => {
    window.location.href = 'mailto:frantz@insightsm.com?subject=TemPO%20HQ%20inquiry';
  };

  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Contact</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Let's talk.</h1>
        <p className="sub">Questions about the platform, the course, or 1:1 coaching? Reach out and Frantz will get back to you.</p>
      </div></section>
      <section className="sec2" style={{ paddingTop: 0 }}><div className="wrap2">
        <div className="contact-card">
          <div className="eyebrow2">Email</div>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: '6px 0 18px' }}>frantz@insightsm.com</p>
          <button onClick={handleEmailClick} className="btn2 acc">Send an email</button>
          <hr className="divider2" style={{ margin: '24px 0' }} />
          <p style={{ color: 'var(--t-mut)', fontSize: 14, margin: 0 }}>For coaching, put "Coaching" in the subject line and a sentence about your business and what you are trying to grow.</p>
        </div>
      </div></section>
    </SiteShell>
  );
}
