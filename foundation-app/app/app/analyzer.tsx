'use client';
import { useState } from 'react';
import { analyzeProfile, type IgMetrics, type IgReport } from '@/lib/ai-client';

function fmt(n: number) { return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n); }
function clamp(v: any) { return Math.max(0, Math.min(100, Math.round(Number(v) || 0))); }

const PILLARS: { key: 'teach' | 'proof' | 'offer'; label: string; sub: string }[] = [
  { key: 'teach', label: 'Teach', sub: 'Share something worth knowing' },
  { key: 'proof', label: 'Proof', sub: 'Show that it works' },
  { key: 'offer', label: 'Offer', sub: 'Make the next step obvious' },
];
const HEALTH: { key: string; label: string }[] = [
  { key: 'teach', label: 'Teach' }, { key: 'proof', label: 'Proof' }, { key: 'offer', label: 'Offer' },
  { key: 'engagement', label: 'Engagement' }, { key: 'consistency', label: 'Consistency' },
];

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
    a.href = url; a.download = `insight-audit-${metrics.handle}.html`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function printReport() {
    if (!metrics || !report) return;
    const w = window.open('', '_blank');
    if (!w) { downloadReport(); return; }
    w.document.open(); w.document.write(buildReportHtml(metrics, report)); w.document.close(); w.focus();
    setTimeout(() => { try { w.print(); } catch {} }, 500);
  }

  const hs = report?.health_scores || {};
  return (
    <div>
      <div className="eyebrow">Profile analyzer</div>
      <h1 className="h-display proof-h1">A TPO audit you can hand to a client.</h1>
      <p className="lede">Pull a public Instagram profile and read it through the TPO Method. You get an overall score, a Teach Proof Offer breakdown with what is working and what is missing, weekly post ideas, audience insight, and tactical recommendations. Download it as a branded report to send over.</p>

      <div className="addrow" style={{ maxWidth: 520 }}>
        <input className="field" placeholder="@handle or instagram.com/handle" value={handle} onChange={(e) => setHandle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') run(); }} />
        <button className="btn mark" onClick={run} disabled={loading}>{loading ? 'Analyzing...' : 'Run audit'}</button>
      </div>
      {loading && <p className="muted" style={{ marginTop: 12 }}>Scraping the profile and writing the audit. This can take up to a minute.</p>}
      {err && <p className="err">{err}</p>}

      {metrics && report && (
        <>
          <div className="row" style={{ gap: 10, margin: '18px 0', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn mark" onClick={printReport}>Save as PDF</button>
            <button className="btn" onClick={downloadReport}>Download report</button>
            <span className="muted" style={{ fontSize: 12 }}>Branded and ready to send to the client.</span>
          </div>

          <div className="card hdrcard">
            <div style={{ flex: 1, minWidth: 220 }}>
              <div className="muted" style={{ fontSize: 13 }}>@{metrics.handle}</div>
              <h2 className="h-display" style={{ fontSize: 26, margin: '4px 0 6px' }}>{metrics.fullName || metrics.handle}</h2>
              {metrics.bio && <p className="muted" style={{ margin: 0, lineHeight: 1.5, fontSize: 13.5, whiteSpace: 'pre-wrap' }}>{metrics.bio}</p>}
              <div className="hdrstats">
                <span><b>{fmt(metrics.followers)}</b> followers</span>
                <span><b>{fmt(metrics.postsCount)}</b> posts</span>
                <span><b>{metrics.engagement}%</b> engagement</span>
              </div>
            </div>
            {typeof report.overall === 'number' && (
              <div className="overall"><div className="ov-l">Overall</div><div className="ov-n">{clamp(report.overall)}</div><div className="ov-s">/ 100</div></div>
            )}
          </div>

          {report.conversation_starter && (
            <div className="convo">
              <div className="convo-l">&#10022; Conversation starter</div>
              <p className="convo-q">{report.conversation_starter}</p>
            </div>
          )}

          {report.health_scores && (
            <div className="card">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 className="h-display" style={{ fontSize: 18, margin: 0 }}>TPO health scores</h3>
                <span className="muted" style={{ fontSize: 11, letterSpacing: '.1em' }}>TEACH &middot; PROOF &middot; OFFER</span>
              </div>
              <div className="health-grid">
                {HEALTH.map((h) => (
                  <div key={h.key} className="hitem">
                    <div className="row" style={{ justifyContent: 'space-between' }}><span className="hl">{h.label}</span><b>{clamp((hs as any)[h.key])}</b></div>
                    <div className="score-track"><div className="score-fill" style={{ width: clamp((hs as any)[h.key]) + '%' }} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.breakdown && (
            <>
              <h2 className="h-display" style={{ fontSize: 22, margin: '26px 0 12px' }}>The TPO breakdown</h2>
              {PILLARS.map((p) => {
                const b = (report.breakdown as any)?.[p.key];
                if (!b) return null;
                return (
                  <div key={p.key} className="card pillcard">
                    <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
                      <span className="pill-ico">{p.label[0]}</span>
                      <div style={{ flex: 1 }}>
                        <h3 className="h-display" style={{ fontSize: 19, margin: 0 }}>{p.label}</h3>
                        <div className="muted" style={{ fontSize: 12.5 }}>{p.sub}</div>
                      </div>
                      <div className="pillscore">{clamp(b.score)}<span>/100</span></div>
                    </div>
                    {b.summary && <p style={{ lineHeight: 1.6, marginTop: 12 }}>{b.summary}</p>}
                    <div className="twocol">
                      <div>
                        <div className="collab doing">Currently doing</div>
                        <ul className="clist">{(b.currently_doing || []).map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
                      </div>
                      <div>
                        <div className="collab missing">What's missing</div>
                        <ul className="clist">{(b.whats_missing || []).map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
                      </div>
                    </div>
                    {b.post_idea && (
                      <div className="postidea"><div className="pi-l">&#10022; Post idea for this week</div><div>{b.post_idea}</div></div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {report.audience_insight && (
            <div className="card" style={{ marginTop: 16 }}>
              <h3 className="h-display" style={{ fontSize: 19, margin: '0 0 8px' }}>Audience insight</h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{report.audience_insight}</p>
            </div>
          )}

          {report.recommendations && report.recommendations.length > 0 && (
            <>
              <h2 className="h-display" style={{ fontSize: 22, margin: '26px 0 12px' }}>Tactical recommendations</h2>
              {report.recommendations.map((r, i) => (
                <div key={i} className="card reccard">
                  <span className="recnum">{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <h4 className="h-display" style={{ fontSize: 16, margin: 0 }}>{r.title}</h4>
                      {r.pillar && <span className={'ptag ' + (r.pillar || '')}>{r.pillar}</span>}
                      {r.priority && <span className={'prio ' + (r.priority || '')}>{r.priority}</span>}
                    </div>
                    {r.detail && <p className="muted" style={{ margin: '6px 0 0', lineHeight: 1.5, fontSize: 13.5 }}>{r.detail}</p>}
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

function esc(s: any): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildReportHtml(m: any, r: any): string {
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const cl = (v: any) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
  const hs = r.health_scores || {};
  const meta: any = { teach: ['Teach', 'Share something worth knowing'], proof: ['Proof', 'Show that it works'], offer: ['Offer', 'Make the next step obvious'] };
  const healthRow = ['teach', 'proof', 'offer', 'engagement', 'consistency'].map((k) =>
    `<div class="hc"><div class="hc-top"><span>${k}</span><b>${cl(hs[k])}</b></div><div class="trk"><div class="fil" style="width:${cl(hs[k])}%"></div></div></div>`).join('');
  const list = (arr: any[]) => `<ul>${(arr || []).map((x: any) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const pill = (k: string) => {
    const b = (r.breakdown || {})[k]; if (!b) return '';
    return `<div class="card pill">
      <div class="pill-head"><span class="ico">${meta[k][0][0]}</span><div class="pill-t"><h3>${meta[k][0]}</h3><div class="sub">${meta[k][1]}</div></div><div class="pscore">${cl(b.score)}<span>/100</span></div></div>
      ${b.summary ? `<p>${esc(b.summary)}</p>` : ''}
      <div class="two"><div><div class="cl doing">Currently doing</div>${list(b.currently_doing)}</div><div><div class="cl missing">What's missing</div>${list(b.whats_missing)}</div></div>
      ${b.post_idea ? `<div class="pi"><div class="pi-l">&#10022; Post idea for this week</div><div>${esc(b.post_idea)}</div></div>` : ''}
    </div>`;
  };
  const recs = (r.recommendations || []).map((x: any, i: number) =>
    `<div class="rec"><span class="rn">${i + 1}</span><div><div class="rh"><b>${esc(x.title)}</b>${x.pillar ? `<span class="tag ${esc(x.pillar)}">${esc(x.pillar)}</span>` : ''}${x.priority ? `<span class="pr ${esc(x.priority)}">${esc(x.priority)}</span>` : ''}</div><p>${esc(x.detail)}</p></div></div>`).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Insight audit - @${esc(m.handle)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#F4EFE4;color:#1A1714;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5}
.serif{font-family:Georgia,'Iowan Old Style','Palatino Linotype',serif}
.wrap{max-width:840px;margin:0 auto;padding:34px 26px}
.card{background:#FFFDF8;border:1px solid #EBE3D3;border-radius:18px;padding:26px;margin-bottom:18px}
h1,h2,h3,h4{font-family:Georgia,'Iowan Old Style','Palatino Linotype',serif;font-weight:700;margin:0}
.hdr{display:flex;gap:20px;justify-content:space-between;align-items:flex-start}
.handle{color:#8a8378;font-size:13px}.name{font-size:34px;margin:4px 0 8px}.tag{color:#6f6a60;font-size:14px;max-width:60ch}
.stats{display:flex;gap:26px;margin-top:16px;font-size:13px;color:#6f6a60}.stats b{display:block;color:#1A1714;font-size:17px}
.badge{background:#C0512E;color:#fff;border-radius:16px;padding:20px 26px;text-align:center;min-width:120px}
.badge .l{font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.9}.badge .n{font-family:Georgia,serif;font-size:52px;font-weight:700;line-height:1}.badge .s{font-size:12px;opacity:.85}
.convo{background:#FBEAE2;border:1px solid #F3D6CA;border-radius:18px;padding:26px;margin-bottom:18px}
.convo .l{color:#C0512E;font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:12px}
.convo .q{font-family:Georgia,serif;font-size:23px;line-height:1.35;margin:0}
.hhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px}.hhead .r{color:#8a8378;font-size:11px;letter-spacing:.12em}
.health{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.hc-top{display:flex;justify-content:space-between;font-size:12px;color:#6f6a60;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}.hc-top b{color:#1A1714;font-size:15px}
.trk{height:7px;background:#ece5d6;border-radius:99px;overflow:hidden}.fil{height:100%;background:#C0512E}
.sec{font-size:24px;margin:28px 0 14px}
.pill-head{display:flex;align-items:flex-start;gap:12px}
.ico{width:34px;height:34px;border-radius:9px;background:#C0512E;color:#fff;font-family:Georgia,serif;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}
.pill-t{flex:1}.pill-t h3{font-size:21px}.pill-t .sub{color:#8a8378;font-size:13px}
.pscore{font-family:Georgia,serif;font-size:30px;font-weight:700}.pscore span{font-size:12px;color:#8a8378}
.pill p{color:#4a463f;margin:14px 0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:8px}
.cl{font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}.cl.doing{color:#2f8f6b}.cl.missing{color:#C0512E}
.two ul{margin:0;padding:0;list-style:none}.two li{position:relative;padding-left:16px;margin-bottom:7px;font-size:13.5px;color:#4a463f;line-height:1.45}.two li:before{content:'';position:absolute;left:2px;top:7px;width:5px;height:5px;border-radius:99px;background:#c9c0ad}
.pi{border:1px dashed #d9cfba;border-radius:12px;padding:16px;margin-top:18px}.pi-l{color:#C0512E;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;margin-bottom:6px}.pi div:last-child{font-size:14px;color:#3a362f}
.rec{display:flex;gap:14px;align-items:flex-start;background:#FFFDF8;border:1px solid #EBE3D3;border-radius:14px;padding:18px 20px;margin-bottom:12px}
.rn{flex:none;width:26px;height:26px;border-radius:7px;background:#C0512E;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px}
.rh{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.rh b{font-family:Georgia,serif;font-size:16px}
.tag,.pr{font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;padding:2px 7px;border-radius:99px;font-weight:700}
.tag.teach{background:#d6efe8;color:#1f7a63}.tag.proof{background:#d9f2d9;color:#1f7a1f}.tag.offer{background:#fbe3cf;color:#b5611f}.tag.engagement,.tag.consistency{background:#eee7d8;color:#7a7363}
.pr.high{background:#f7ddd5;color:#b53d1f}.pr.medium{background:#fbeec4;color:#9a7611}.pr.low{background:#eee7d8;color:#7a7363}
.rec p{margin:6px 0 0;color:#6f6a60;font-size:13.5px}
.foot{margin-top:30px;border-top:2px solid #1A1714;padding-top:14px;display:flex;justify-content:space-between;font-size:11px;color:#8a8378}
@media print{body{background:#fff}.wrap{padding:10px}@page{margin:12mm}.card,.rec,.convo{break-inside:avoid}}
@media(max-width:600px){.health{grid-template-columns:1fr 1fr}.two{grid-template-columns:1fr}.hdr{flex-direction:column}}
</style></head><body><div class="wrap">
<div class="card"><div class="hdr"><div><div class="handle">@${esc(m.handle)}</div><div class="name serif">${esc(m.fullName || m.handle)}</div>${m.bio ? `<div class="tag">${esc(m.bio)}</div>` : ''}
<div class="stats"><span><b>${fmt(m.followers)}</b>Followers</span><span><b>${fmt(m.postsCount)}</b>Posts</span><span><b>${esc(m.engagement)}%</b>Engagement</span></div></div>
${typeof r.overall === 'number' ? `<div class="badge"><div class="l">Overall</div><div class="n">${cl(r.overall)}</div><div class="s">/ 100</div></div>` : ''}</div></div>
${r.conversation_starter ? `<div class="convo"><div class="l">&#10022; Conversation starter</div><p class="q">${esc(r.conversation_starter)}</p></div>` : ''}
${r.health_scores ? `<div class="card"><div class="hhead"><h3 style="font-size:20px">TPO health scores</h3><span class="r">TEACH &middot; PROOF &middot; OFFER</span></div><div class="health">${healthRow}</div></div>` : ''}
${r.breakdown ? `<h2 class="sec">The TPO breakdown</h2>${pill('teach')}${pill('proof')}${pill('offer')}` : ''}
${r.audience_insight ? `<div class="card"><h3 style="font-size:19px;margin-bottom:8px">Audience insight</h3><p style="color:#4a463f;margin:0">${esc(r.audience_insight)}</p></div>` : ''}
${(r.recommendations && r.recommendations.length) ? `<h2 class="sec">Tactical recommendations</h2>${recs}` : ''}
<div class="foot"><span>insightsm.com &middot; @insightsocialmm</span><span>Insight Social Media Management</span></div>
</div></body></html>`;
}
