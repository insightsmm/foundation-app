import SubscribeButton from './subscribe-button';

export default function PricingPage() {
  return (
    <div className="center">
      <div className="card" style={{ width: 'min(420px,100%)', borderColor: 'rgba(242,188,45,.4)' }}>
        <div className="eyebrow">Foundation</div>
        <div className="h-display" style={{ fontSize: 40, margin: '8px 0 18px' }}>
          $97<span className="muted" style={{ fontSize: 16 }}> / month</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
          <li>Guided activation and your BrandOS record</li>
          <li>The TPO content engine, your voice, every month</li>
          <li>Proof that refills your calendar</li>
          <li>Cancel anytime</li>
        </ul>
        <SubscribeButton />
        <p className="muted" style={{ textAlign: 'center', marginTop: 12 }}>Secure checkout via Stripe.</p>
      </div>
    </div>
  );
}
