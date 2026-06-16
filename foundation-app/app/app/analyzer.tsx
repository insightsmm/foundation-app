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

  function downloadReport() {
    if (!metrics || !report) return;
    const html = buildReportHtml(metrics, report);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foundation-audit-${metrics.handle}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function printReport() {
    if (!metrics || !report) return;
    const w = window.open('', '_blank');
    if (!w) { downloadReport(); return; }
    w.document.open();
    w.document.write(buildReportHtml(metrics, report));
    w.document.close();
    w.focus();
    setTimeout(() => { try { w.print(); } catch {} }, 500);
  }

  return (
    <div>
      <div className="eyebrow">Profile analyzer</div>
      <h1 className="h-display proof-h1">A TPO audit of any profile.</h1>
      <p className="lede">Pull a public Instagram profile and read it through the TPO Method and the 3Cs. You get a clarity verdict, a Teach Proof Offer breakdown, the content gaps, ready-to-film posts, and a step-by-step plan. Use it on your own accounts, a client you are pitching, or a competitor.</p>

      <div className="addrow" style={{ maxWidth: 520 }}>
        <input className="field" placeholder="@handle or instagram.com/handle" value={handle} onChange={(e) => setHandle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') run(); }} />
        <button className="btn mark" onClick={run} disabled={loading}>{loading ? 'Analyzing...' : 'Run audit'}</button>
      </div>
      {loading && <p className="muted" style={{ marginTop: 12 }}>Scraping the profile and writing the audit. This can take up to a minute.</p>}
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
        <>
          <div className="row" style={{ gap: 10, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn mark" onClick={printReport}>Save as PDF</button>
            <button className="btn" onClick={downloadReport}>Download report</button>
            <span className="muted" style={{ fontSize: 12 }}>Branded and ready to send to the client.</span>
          </div>
          {report.summary && (
            <div className="card" style={{ marginTop: 16 }}>
              <label className="lab">The read</label>
              <p style={{ margin: '6px 0 0', lineHeight: 1.6 }}>{report.summary}</p>
              {report.clarity_verdict && (
                <div style={{ marginTop: 14 }}>
                  <label className="lab">Clarity verdict</label>
                  <p style={{ margin: '6px 0 0', lineHeight: 1.6 }}><span className="mk">{report.clarity_verdict}</span></p>
                </div>
              )}
            </div>
          )}

          {report.scores && (
            <div className="card" style={{ marginTop: 16 }}>
              <label className="lab">The 3Cs</label>
              <div style={{ marginTop: 10 }}>
                <Bar label="Clarity" value={report.scores.clarity} note={report.score_notes?.clarity} />
                <Bar label="Consistency" value={report.scores.consistency} note={report.score_notes?.consistency} />
                <Bar label="Credibility" value={report.scores.credibility} note={report.score_notes?.credibility} />
              </div>
            </div>
          )}

          {report.tpo && (
            <div className="card" style={{ marginTop: 16 }}>
              <label className="lab">TPO breakdown</label>
              <div style={{ marginTop: 10 }}>
                <TpoRow k="Teach" data={report.tpo.teach} />
                <TpoRow k="Proof" data={report.tpo.proof} />
                <TpoRow k="Offer" data={report.tpo.offer} />
              </div>
              {report.tpo.balance && <p className="muted" style={{ marginTop: 12, lineHeight: 1.6 }}>{report.tpo.balance}</p>}
            </div>
          )}

          {(report.pillars?.length || report.gaps?.length) && (
            <div className="card" style={{ marginTop: 16 }}>
              {report.pillars?.length > 0 && (
                <div style={{ marginBottom: report.gaps?.length ? 16 : 0 }}>
                  <label className="lab">Pillars they post now</label>
                  <div className="chips">{report.pillars.map((p, i) => <span key={i} className="chip">{p}</span>)}</div>
                </div>
              )}
              {report.gaps && report.gaps.length > 0 && (
                <div>
                  <label className="lab">Missing angles</label>
                  <div className="chips">{report.gaps.map((g, i) => <span key={i} className="chip gap">{g}</span>)}</div>
                </div>
              )}
            </div>
          )}

          {report.opportunities && report.opportunities.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <label className="lab">Opportunities</label>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {report.opportunities.map((o, i) => (
                  <div key={i} className="opp">
                    <div className="opp-t">{o.title}</div>
                    <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 4 }}>{o.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.sample_posts && report.sample_posts.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <label className="lab">Posts they could film this week</label>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {report.sample_posts.map((p, i) => (
                  <div key={i} className="samplepost">
                    <span className={'pill ' + (p.type || 'teach')}>{p.type}</span>
                    <h4 className="h-display" style={{ fontSize: 16, margin: '8px 0 10px' }}><span className="mk">{p.hook}</span></h4>
                    {p.setup && <div className="beat"><div className="bl">Setup</div><p>{p.setup}</p></div>}
                    {p.punch && <div className="beat"><div className="bl">Punch</div><p>{p.punch}</p></div>}
                    {p.land && <div className="beat"><div className="bl">Land</div><p>{p.land}</p></div>}
                    {p.cta && <div className="beat"><div className="bl">CTA</div><p>{p.cta}</p></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.action_plan && report.action_plan.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <label className="lab">The plan</label>
              <div style={{ marginTop: 8 }}>
                {report.action_plan.map((a, i) => (
                  <div key={i} className="plan-line"><span className="plan-num">{i + 1}</span>{a}</div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Bar({ label, value, note }: { label: string; value: number; note?: string }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13 }}>{label}</span>
        <span className="muted" style={{ fontFamily: 'monospace' }}>{v}</span>
      </div>
      <div className="score-track"><div className="score-fill" style={{ width: v + '%' }} /></div>
      {note && <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, margin: '6px 0 0' }}>{note}</p>}
    </div>
  );
}

function TpoRow({ k, data }: { k: string; data?: { rating: string; note: string } }) {
  if (!data) return null;
  const r = (data.rating || '').toLowerCase();
  return (
    <div className="tpo-row">
      <div className="tpo-k">{k}</div>
      <span className={'rating ' + (r === 'strong' ? 'good' : r === 'weak' ? 'bad' : 'mid')}>{data.rating}</span>
      <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{data.note}</div>
    </div>
  );
}

function esc(s: any): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildReportHtml(m: any, r: any): string {
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const clamp = (v: any) => Math.max(0, Math.min(100, Number(v) || 0));
  const bar = (label: string, v: any, note?: string) =>
    `<div class="bar"><div class="barhead"><span>${esc(label)}</span><span class="num">${clamp(v)}</span></div>` +
    `<div class="track"><div class="fill" style="width:${clamp(v)}%"></div></div>${note ? `<p class="note">${esc(note)}</p>` : ''}</div>`;
  const tpoRow = (k: string, d: any) => d ? `<tr><td class="k">${esc(k)}</td><td><span class="rate ${esc((d.rating || '').toLowerCase())}">${esc(d.rating)}</span></td><td>${esc(d.note)}</td></tr>` : '';
  const chips = (arr: any[], cls = '') => (arr || []).map((x) => `<span class="chip ${cls}">${esc(x)}</span>`).join('');
  const opps = (r.opportunities || []).map((o: any) => `<div class="opp"><div class="opp-t">${esc(o.title)}</div><div class="opp-d">${esc(o.detail)}</div></div>`).join('');
  const beats = (p: any) => ['setup', 'punch', 'land', 'cta'].filter((k) => p[k]).map((k) => `<div class="beat"><div class="bl">${k.toUpperCase()}</div><p>${esc(p[k])}</p></div>`).join('');
  const samples = (r.sample_posts || []).map((p: any) => `<div class="sample"><span class="pill">${esc(p.type)}</span><h4>${esc(p.hook)}</h4>${beats(p)}</div>`).join('');
  const plan = (r.action_plan || []).map((a: any, i: number) => `<div class="step"><span class="n">${i + 1}</span><span>${esc(a)}</span></div>`).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Foundation audit - @${esc(m.handle)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#FAF7F0;color:#0A0A0A;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.55}
.page{max-width:760px;margin:0 auto;padding:48px 40px}
.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0A0A0A;padding-bottom:16px;margin-bottom:22px}
.brand{font-weight:800;font-size:14px}.brand small{display:block;font-weight:500;color:#6b6b6b;letter-spacing:.12em;text-transform:uppercase;font-size:10px;margin-top:4px}
h1{font-size:30px;margin:0 0 4px}.handle{color:#6b6b6b;font-size:14px}.date{font-size:11px;color:#6b6b6b;text-transform:uppercase;letter-spacing:.1em}
.metrics{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 8px}
.metric{flex:1;min-width:90px;border:1px solid #e3ddcf;border-radius:8px;padding:10px;text-align:center}
.metric .v{font-size:20px;font-weight:800}.metric .l{font-size:9px;color:#6b6b6b;text-transform:uppercase;letter-spacing:.1em;margin-top:3px}
h2{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#6b6b6b;margin:26px 0 10px;border-top:1px solid #e3ddcf;padding-top:18px}
.mark{background:linear-gradient(transparent 55%,rgba(242,188,45,.85) 0)}p{margin:0 0 10px}
.bar{margin-bottom:14px}.barhead{display:flex;justify-content:space-between;font-weight:700;font-size:13px;margin-bottom:5px}.barhead .num{font-family:monospace;color:#6b6b6b}
.track{height:8px;background:#e9e3d5;border-radius:99px;overflow:hidden}.fill{height:100%;background:#F2BC2D}.note{font-size:12px;color:#555;margin:6px 0 0}
table{width:100%;border-collapse:collapse}td{padding:9px 8px;border-bottom:1px solid #e3ddcf;vertical-align:top;font-size:14px}td.k{font-weight:700;width:80px}
.rate{font-size:10px;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:99px;font-weight:700}
.rate.strong{background:#d9f2d9;color:#1f7a1f}.rate.okay{background:#fbeec4;color:#9a7611}.rate.weak{background:#f7d6d6;color:#a33}
.chip{display:inline-block;border:1px solid #d9d2c2;border-radius:99px;padding:5px 11px;font-size:12px;margin:0 6px 6px 0}.chip.gap{border-style:dashed;color:#777}
.opp{border-left:3px solid #F2BC2D;padding:2px 0 2px 12px;margin-bottom:12px}.opp-t{font-weight:700;font-size:14px}.opp-d{font-size:13px;color:#555;margin-top:3px}
.sample{border:1px solid #e3ddcf;border-radius:10px;padding:16px;margin-bottom:14px}
.pill{display:inline-block;font-size:10px;text-transform:uppercase;letter-spacing:.08em;background:#0A0A0A;color:#FAF7F0;padding:3px 9px;border-radius:99px}
.sample h4{font-size:16px;margin:10px 0 12px}.beat{margin-bottom:9px}.bl{font-size:9px;letter-spacing:.14em;color:#999;text-transform:uppercase;margin-bottom:2px}.beat p{font-size:13.5px;margin:0}
.step{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #e3ddcf;font-size:14px}.step:last-child{border-bottom:0}
.step .n{flex:none;width:20px;height:20px;border-radius:99px;background:#F2BC2D;color:#0A0A0A;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center}
.foot{margin-top:32px;border-top:3px solid #0A0A0A;padding-top:14px;display:flex;justify-content:space-between;font-size:11px;color:#6b6b6b}
@media print{body{background:#fff}.page{padding:24px}@page{margin:14mm}}
</style></head><body><div class="page">
<div class="top"><div class="brand">Insight Social Media Management<small>Foundation &middot; Profile Audit</small></div><div class="date">${esc(date)}</div></div>
<h1>@${esc(m.handle)}</h1><div class="handle">${esc(m.fullName || '')}</div>
<div class="metrics">
<div class="metric"><div class="v">${fmt(m.followers)}</div><div class="l">Followers</div></div>
<div class="metric"><div class="v">${fmt(m.postsCount)}</div><div class="l">Posts</div></div>
<div class="metric"><div class="v">${fmt(m.avgLikes)}</div><div class="l">Avg likes</div></div>
<div class="metric"><div class="v">${fmt(m.avgComments)}</div><div class="l">Avg comments</div></div>
<div class="metric"><div class="v">${esc(m.engagement)}%</div><div class="l">Engagement</div></div>
</div>
${r.summary ? `<h2>The read</h2><p>${esc(r.summary)}</p>` : ''}
${r.clarity_verdict ? `<h2>Clarity verdict</h2><p><span class="mark">${esc(r.clarity_verdict)}</span></p>` : ''}
${r.scores ? `<h2>The 3Cs</h2>${bar('Clarity', r.scores.clarity, r.score_notes && r.score_notes.clarity)}${bar('Consistency', r.scores.consistency, r.score_notes && r.score_notes.consistency)}${bar('Credibility', r.scores.credibility, r.score_notes && r.score_notes.credibility)}` : ''}
${r.tpo ? `<h2>TPO breakdown</h2><table>${tpoRow('Teach', r.tpo.teach)}${tpoRow('Proof', r.tpo.proof)}${tpoRow('Offer', r.tpo.offer)}</table>${r.tpo.balance ? `<p style="margin-top:12px">${esc(r.tpo.balance)}</p>` : ''}` : ''}
${(r.pillars && r.pillars.length) ? `<h2>Pillars they post now</h2><div>${chips(r.pillars)}</div>` : ''}
${(r.gaps && r.gaps.length) ? `<h2>Missing angles</h2><div>${chips(r.gaps, 'gap')}</div>` : ''}
${opps ? `<h2>Opportunities</h2>${opps}` : ''}
${samples ? `<h2>Posts to film this week</h2>${samples}` : ''}
${plan ? `<h2>The plan</h2>${plan}` : ''}
<div class="foot"><span>insightsm.com &middot; @insightsocialmm</span><span>Insight Social Media Management</span></div>
</div></body></html>`;
}
