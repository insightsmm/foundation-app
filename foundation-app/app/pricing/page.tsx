import SubscribeButton from './subscribe-button';

export default function PricingPage() {
  return (
    <div className="center" style={{ padding: '48px 20px' }}>
      <div className="pricetiers">
        <div className="card pricetier">
          <div className="eyebrow">Foundation</div>
          <div className="h-display amt">$97<span> / month</span></div>
          <p className="muted" style={{ margin: '4px 0 16px' }}>For one brand.</p>
          <ul>
            <li><span className="ck">&#10003;</span> BrandOS workspace, six tabs</li>
            <li><span className="ck">&#10003;</span> 30-day content engine in your voice</li>
            <li><span className="ck">&#10003;</span> Proof Vault and the flywheel loop</li>
            <li><span className="ck">&#10003;</span> One brand</li>
            <li><span className="ck">&#10003;</span> Cancel anytime</li>
          </ul>
          <SubscribeButton plan="foundation" label="Start Foundation" />
        </div>

        <div className="card pricetier premium">
          <div className="eyebrow">Agency</div>
          <div className="h-display amt">$297<span> / month</span></div>
          <p className="muted" style={{ margin: '4px 0 16px' }}>For agencies running multiple client brands.</p>
          <ul>
            <li><span className="ck">&#10003;</span> Everything in Foundation</li>
            <li><span className="ck">&#10003;</span> Multiple brands under one login</li>
            <li><span className="ck">&#10003;</span> Switch between clients in one click</li>
            <li><span className="ck">&#10003;</span> A separate calendar and vault per brand</li>
            <li><span className="ck">&#10003;</span> Cancel anytime</li>
          </ul>
          <SubscribeButton plan="agency" label="Start Agency" />
        </div>
      </div>
      <p className="muted" style={{ textAlign: 'center', marginTop: 16 }}>Secure checkout via Stripe.</p>
    </div>
  );
}
