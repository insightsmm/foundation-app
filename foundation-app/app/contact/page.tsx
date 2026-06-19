'use client';
import { useState } from 'react';
import SiteShell from '../site-shell';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: '1px solid var(--t-line, #e6ddcd)', background: '#fff',
  fontFamily: 'inherit', fontSize: 15, marginTop: 6,
};

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const su = encodeURIComponent(`TemPO HQ inquiry from ${name.trim()}`);
    const body = encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=frantz@insightsm.com&su=${su}&body=${body}`;
    window.open(url, '_blank', 'noopener');
    setSent(true);
  }

  return (
    <SiteShell>
      <section className="hero2"><div className="wrap2">
        <div className="eyebrow2">Contact</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Let&apos;s talk.</h1>
        <p className="sub">Questions about the platform, the course, or 1:1 coaching? Fill this out and it opens an email straight to Frantz.</p>
      </div></section>
      <section className="sec2" style={{ paddingTop: 0 }}><div className="wrap2">
        <div className="contact-card" style={{ maxWidth: 560 }}>
          <form onSubmit={send} style={{ display: 'grid', gap: 14 }}>
            <label>Your name<input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required /></label>
            <label>Your email<input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label>Message<textarea style={{ ...inputStyle, minHeight: 140 }} value={message} onChange={(e) => setMessage(e.target.value)} required /></label>
            <button type="submit" className="btn2 acc" style={{ justifySelf: 'start' }}>Send to Frantz</button>
          </form>
          {sent ? <p style={{ marginTop: 14, color: 'var(--t-mut, #6b665c)', fontSize: 14 }}>Your email opened in Gmail with the details filled in. Hit send there and it lands in Frantz&apos;s inbox.</p> : null}
          <hr className="divider2" style={{ margin: '24px 0' }} />
          <p style={{ color: 'var(--t-mut, #6b665c)', fontSize: 14, margin: 0 }}>Prefer to write directly? Email frantz@insightsm.com. For coaching, mention your business and what you are trying to grow.</p>
        </div>
      </div></section>
    </SiteShell>
  );
}
