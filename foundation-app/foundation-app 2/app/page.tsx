import Link from 'next/link';

export default function Landing() {
  return (
    <div className="wrap" style={{ paddingTop: 80 }}>
      <div className="eyebrow">Foundation by TPO</div>
      <h1 className="h-display" style={{ fontSize: 44, lineHeight: 1.1, maxWidth: '16ch', margin: '12px 0 16px' }}>
        Thirty days of content, written in your voice.
      </h1>
      <p className="muted" style={{ fontSize: 17, maxWidth: '52ch', lineHeight: 1.6 }}>
        Set your brand once. The engine writes on the TPO rhythm, Teach earns trust, Proof earns belief,
        Offer earns the booking. Every hook pulled from a Clarity Mirror so it stops the scroll.
      </p>
      <div className="row" style={{ marginTop: 28 }}>
        <Link className="btn mark" href="/signup">Start Foundation</Link>
        <Link className="btn" href="/login">Log in</Link>
      </div>
      <p className="muted" style={{ marginTop: 40, fontFamily: 'monospace' }}>insightsm.com · @insightsocialmm</p>
    </div>
  );
}
