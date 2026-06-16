'use client';
import { useState } from 'react';
import { analyzeProfile, type IgMetrics, type IgReport } from '@/lib/ai-client';

function fmt(n: number) { return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n); }

export default function Analyzer({ brand }: { brand: any }) {
  const [handle, setHandle] = useState(brand?.ig_handle || '');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [metrics, setMetrics] = useState<IgMetrics | null>(null);
  const [report, setReport] = useState<IgReport | null>(null);

  async function run() {
    if (!handle.trim()) { setErr('Enter an Instagram handle.'); return; }
    setLoading(true); setErr(''); setMetrics(null); setReport(null);
    const res = await analyzeProfile(handle);
    if (res.error) setErr(res.error);
    else { setMetrics(res.metrics || null); setReport(res.report || null); }
    setLoading(false);
  }

  return (
    <div>
      <div className="eyebrow">Profile analyzer</div>
      <h1 className="h-display proof-h1">Read any profile through the TPO lens.</h1>
      <p className="lede">Pull a public Instagram profile and score it on the 3Cs, spot its content pillars, and get specific moves to make. Use it on your own accounts, a client you are pitching, or a competitor.</p>

      <div className="addrow" style={{ maxWidth: 520 }}>
        <input className="field" placeholder="@handle or instagram.com/handle" value={handle} onChange={(e) => setHandle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') run(); }} />
        <button className="btn mark" onClick={run} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
      </div>
      {loading && <p className="muted" style={{ marginTop: 12 }}>Scraping the profile and reading it. This can take up to a minute.</p>}
      {err && <p className="err">{err}</p>}

      {metrics && (
        <div className="card" style={{ marginTop: 18 }}>
          <div className="row" style={{ gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <h2 className="h-display" style={{ fontSize: 20, margin: 0 }}>@{metrics.handle}</h2>
            {metrics.verified && <span className="adminbadge">verified</span>}
            {metrics.fullName && <span className="muted">{metrics.fullName}</span>}
          </div>
          {metrics.bio && <p className="muted" style={{ marginTop: 8, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{metrics.bio}</p>}
          <div className="metric-grid">
            <div className="metric"><div className="n">{fmt(metrics.followers)}</div><div className="l">Followers</div></div>
            <div className="metric"><div className="n">{fmt(metrics.following)}</div><div className="l">Following</div></div>
            <div className="metric"><div className="n">{fmt(metrics.postsCount)}</div><div className="l">Posts</div></div>
            <div className="metric"><div className="n">{fmt(metrics.avgLikes)}</div><div className="l">Avg likes</div></div>
            <div className="metric"><div className="n">{fmt(metrics.avgComments)}</div><div className="l">Avg comments</div></div>
            <div className="metric"><div className="n">{metrics.engagement}%</div><div className="l">Engagement</div></div>
          </div>
        </div>
      )}

      {report && (
        <div className="card" style={{ marginTop: 16 }}>
          {report.summary && <p style={{ marginTop: 0, lineHeight: 1.6 }}>{report.summary}</p>}
          {report.scores && (
            <div style={{ margin: '18px 0' }}>
              <Bar label="Clarity" value={report.scores.clarity} />
              <Bar label="Consistency" value={report.scores.consistency} />
              <Bar label="Credibility" value={report.scores.credibility} />
            </div>
          )}
          {report.pillars?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <label className="lab">Detected pillars</label>
              <div className="chips">{report.pillars.map((p, i) => <span key={i} className="chip">{p}</span>)}</div>
            </div>
          )}
          {report.hooks?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <label className="lab">Hooks to try</label>
              {report.hooks.map((h, i) => <div key={i} className="hookline"><span className="mk">{h}</span></div>)}
            </div>
          )}
          {report.recommendations?.length > 0 && (
            <div>
              <label className="lab">What to do next</label>
              {report.recommendations.map((r, i) => <div key={i} className="plan-line"><span className="plan-dot" />{r}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13 }}>{label}</span>
        <span className="muted" style={{ fontFamily: 'monospace' }}>{v}</span>
      </div>
      <div className="score-track"><div className="score-fill" style={{ width: v + '%' }} /></div>
    </div>
  );
}
