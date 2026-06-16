'use client';
import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { score3Cs, analyzeVoice, advise, tailorFormats, type Scores } from '@/lib/ai-client';

const PILLARS = ['Behind the scenes', 'Client wins', 'How-to teaching', 'Myth busting', 'Personal story', 'Local spotlight'];
const MIRRORS = ['coffee filter', 'thermostat', 'traffic light', 'recipe card', 'doorbell', 'grocery list', 'umbrella', 'toolbox', 'metronome'];
const RHYTHMS = ['3x / week', '4x / week', '5x / week', 'Daily'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Format = { name: string; why: string; example?: string };
const VIRAL_FORMATS: Format[] = [
  { name: 'Talking head + B-roll', why: 'Teach one idea fast with footage running behind your words. The workhorse format.' },
  { name: 'Text-on-screen list', why: 'Three to five quick points people screenshot and save. Built for reach.' },
  { name: 'Before / after reveal', why: 'Show a transformation in one cut. Pure proof, almost no talking needed.' },
  { name: 'Green screen react', why: 'Stand in front of a post, stat, or headline and respond. Fast to film, high context.' },
  { name: 'POV', why: 'Put the viewer in a scene they recognize. Strong hook, built for shares.' },
  { name: 'Day in the life', why: 'Show the work behind the result so people trust the outcome.' },
  { name: 'Myth vs fact', why: 'Bust a common belief in your niche. The built-in tension holds attention.' },
  { name: 'Hook + payoff on trending audio', why: 'Ride a trending sound and land your own point on the beat.' },
  { name: 'Storytime', why: 'One real story with a lesson. The most human format and the stickiest.' },
  { name: '3 mistakes / 3 things', why: 'Numbered, fast, easy to follow, and promises value in the first second.' },
];

const TABS: { id: BTab; label: string }[] = [
  { id: 'profile', label: 'Brand Profile' },
  { id: 'discovery', label: 'Discovery & Clarity' },
  { id: 'system', label: 'System Build' },
  { id: 'production', label: 'Production Planning' },
  { id: 'formats', label: 'Format Finder' },
  { id: 'schedule', label: 'Publishing Schedule' },
];
type BTab = 'profile' | 'discovery' | 'system' | 'production' | 'formats' | 'schedule';

export default function BrandOS({ brand, brandId, userId, onSaved }: { brand: any; brandId: string | null; userId: string; onSaved: (b: any) => void }) {
  const supabase = supabaseBrowser();
  const cd = brand?.client_data || {};
  const [tab, setTab] = useState<BTab>('profile');

  const [name, setName] = useState(brand?.name || '');
  const [niche, setNiche] = useState(brand?.niche || '');
  const [goal, setGoal] = useState(brand?.goal || '');
  const [ig, setIg] = useState(brand?.ig_handle || '');
  const [clarity, setClarity] = useState(cd.clarity || '');
  const [audience, setAudience] = useState(cd.audience || '');
  const [offer, setOffer] = useState(cd.offer || '');
  const [rhythm, setRhythm] = useState<string>(cd.rhythm || '4x / week');
  const [pillars, setPillars] = useState<string[]>(cd.pillars || []);
  const [mirrors, setMirrors] = useState<string[]>(cd.mirrors || []);
  const [proof, setProof] = useState(cd.proof || '');
  const [pov, setPov] = useState(cd.pov || '');

  const [scores, setScores] = useState<Scores | null>(cd.scores || null);
  const [voice, setVoice] = useState(cd.voiceRead || '');
  const [systemText, setSystemText] = useState(cd.systemPlan || '');
  const [productionText, setProductionText] = useState(cd.productionPlan || '');
  const [formats, setFormats] = useState<Format[]>(cd.formats && cd.formats.length ? cd.formats : VIRAL_FORMATS);

  const [status, setStatus] = useState('All changes saved');
  const idRef = useRef<string | null>(brandId);
  const loadedRef = useRef(false);
  const latestRef = useRef<any>(null);
  const savingRef = useRef(false);

  function toggle(list: string[], set: (v: string[]) => void, v: string) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  function buildPayload() {
    return {
      user_id: userId, name, niche, goal, ig_handle: ig,
      client_data: { clarity, audience, offer, rhythm, pillars, mirrors, proof, pov, scores, voiceRead: voice, systemPlan: systemText, productionPlan: productionText, formats },
    };
  }

  async function persist(silent: boolean) {
    if (savingRef.current) return;
    savingRef.current = true;
    const body = latestRef.current || buildPayload();
    try {
      if (idRef.current) {
        await supabase.from('brands').update(body).eq('id', idRef.current);
      } else {
        const { data } = await supabase.from('brands').insert(body).select('id').single();
        if (data) idRef.current = (data as any).id;
      }
      if (idRef.current) onSaved({ id: idRef.current, ...body });
      if (!silent) setStatus('All changes saved');
    } catch {
      if (!silent) setStatus('Save failed, will retry');
    } finally {
      savingRef.current = false;
    }
  }

  const serialized = JSON.stringify(buildPayload());
  useEffect(() => {
    latestRef.current = JSON.parse(serialized);
    if (!loadedRef.current) { loadedRef.current = true; return; }
    setStatus('Saving...');
    const t = setTimeout(() => persist(false), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [serialized]);

  useEffect(() => {
    return () => {
      const body = latestRef.current;
      if (!body) return;
      if (idRef.current) supabase.from('brands').update(body).eq('id', idRef.current).then(() => {}, () => {});
      else supabase.from('brands').insert(body).select('id').single().then(() => {}, () => {});
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="area-head">
        <div>
          <h2 className="h-display" style={{ fontSize: 20, margin: 0 }}>BrandOS</h2>
          <p className="muted" style={{ margin: '4px 0 0' }}>Clarity, consistency, credibility, set once and carried everywhere.</p>
        </div>
        <span className="savestatus">{status}</span>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={'tab' + (tab === t.id ? ' on' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card">
          <div className="fieldgrid">
            <div><label className="lab">Brand or client name</label><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="lab">Instagram handle</label><input className="field" value={ig} onChange={(e) => setIg(e.target.value)} /></div>
            <div><label className="lab">Niche</label><input className="field" value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
            <div><label className="lab">Primary goal</label><input className="field" value={goal} onChange={(e) => setGoal(e.target.value)} /></div>
            <div className="full"><label className="lab">Clarity statement</label><textarea className="field" rows={2} value={clarity} onChange={(e) => setClarity(e.target.value)} /></div>
            <div className="full"><label className="lab">Ideal customer</label><input className="field" value={audience} onChange={(e) => setAudience(e.target.value)} /></div>
            <div className="full"><label className="lab">Core offer</label><input className="field" value={offer} onChange={(e) => setOffer(e.target.value)} /></div>
            <div className="full"><label className="lab">Posting rhythm</label>
              <div>{RHYTHMS.map((r) => (<span key={r} className={'opt' + (rhythm === r ? ' sel' : '')} onClick={() => setRhythm(r)}>{r}</span>))}</div></div>
            <div className="full"><label className="lab">Content pillars</label>
              <div>{PILLARS.map((p) => (<span key={p} className={'opt' + (pillars.includes(p) ? ' sel' : '')} onClick={() => toggle(pillars, setPillars, p)}>{p}</span>))}</div></div>
            <div className="full"><label className="lab">Clarity Mirror objects</label>
              <div>{MIRRORS.map((m) => (<span key={m} className={'opt' + (mirrors.includes(m) ? ' sel' : '')} onClick={() => toggle(mirrors, setMirrors, m)}>{m}</span>))}</div></div>
            <div className="full"><label className="lab">Signature proof</label><textarea className="field" rows={2} value={proof} onChange={(e) => setProof(e.target.value)} /></div>
            <div className="full"><label className="lab">Permission line</label><textarea className="field" rows={2} value={pov} onChange={(e) => setPov(e.target.value)} /></div>
          </div>
          <p className="muted" style={{ marginTop: 14, fontSize: 13 }}>Everything here saves on its own as you type. The whole workspace reads from it.</p>
        </div>
      )}

      {tab === 'discovery' && (
        <Discovery brandId={idRef.current} scores={scores} voice={voice} onResult={(s, v) => { setScores(s); setVoice(v); }} />
      )}
      {tab === 'system' && (
        <Advisor brandId={idRef.current} mode="system" title="A simple system you can actually run every week." text={systemText} onResult={setSystemText} />
      )}
      {tab === 'production' && (
        <Advisor brandId={idRef.current} mode="production" title="Batch it once, publish all week." text={productionText} onResult={setProductionText} />
      )}
      {tab === 'formats' && (
        <Formats brandId={idRef.current} niche={niche} formats={formats} onResult={setFormats} />
      )}
      {tab === 'schedule' && <Schedule rhythm={rhythm} pillars={pillars} />}
    </div>
  );
}

function Discovery({ brandId, scores, voice, onResult }: { brandId: string | null; scores: Scores | null; voice: string; onResult: (s: Scores, v: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  async function run() {
    if (!brandId) { setErr('Add a brand name first so this has something to read.'); return; }
    setLoading(true); setErr('');
    try {
      const [s, v] = await Promise.all([score3Cs(brandId), analyzeVoice(brandId)]);
      onResult(s, v);
    } catch { setErr('Could not reach the model. Try again.'); }
    setLoading(false);
  }
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <p className="muted" style={{ margin: 0 }}>Score the 3Cs and read the brand voice back. Results stay saved.</p>
        <button className="btn mark" onClick={run} disabled={loading}>{loading ? 'Reading...' : scores ? 'Re-run' : 'Run analysis'}</button>
      </div>
      {err && <p className="err">{err}</p>}
      {scores && (
        <div style={{ marginTop: 18 }}>
          <ScoreBar label="Clarity" value={scores.clarity} />
          <ScoreBar label="Consistency" value={scores.consistency} />
          <ScoreBar label="Credibility" value={scores.credibility} />
          {scores.note && <p style={{ marginTop: 14, lineHeight: 1.6 }}><span className="mk">{scores.note}</span></p>}
        </div>
      )}
      {voice && (<div style={{ marginTop: 18 }}><label className="lab">Voice read</label><p className="muted" style={{ lineHeight: 1.6 }}>{voice}</p></div>)}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13 }}>{label}</span>
        <span className="muted" style={{ fontFamily: 'monospace' }}>{value}</span>
      </div>
      <div className="score-track"><div className="score-fill" style={{ width: value + '%' }} /></div>
    </div>
  );
}

function Advisor({ brandId, mode, title, text, onResult }: { brandId: string | null; mode: 'system' | 'production'; title: string; text: string; onResult: (t: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  async function run() {
    if (!brandId) { setErr('Add a brand name first so this has something to read.'); return; }
    setLoading(true); setErr('');
    try { onResult(await advise(brandId, mode)); }
    catch { setErr('Could not reach the model. Try again.'); }
    setLoading(false);
  }
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <p className="muted" style={{ margin: 0 }}>{title}</p>
        <button className="btn mark" onClick={run} disabled={loading}>{loading ? 'Building...' : text ? 'Rebuild' : 'Build it'}</button>
      </div>
      {err && <p className="err">{err}</p>}
      {text && (
        <div style={{ marginTop: 16 }}>
          {text.split('\n').filter((l) => l.trim()).map((line, i) => (
            <div key={i} className="plan-line"><span className="plan-dot" />{line.replace(/^[-*]\s*/, '')}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function Formats({ brandId, niche, formats, onResult }: { brandId: string | null; niche: string; formats: Format[]; onResult: (f: Format[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  async function tailor() {
    if (!brandId) { setErr('Add a brand name first so the examples fit your niche.'); return; }
    setLoading(true); setErr('');
    try {
      const examples = await tailorFormats(brandId, formats.map((f) => f.name));
      onResult(formats.map((f, i) => ({ ...f, example: examples[i] || f.example })));
    } catch { setErr('Could not reach the model. The formats below still apply.'); }
    setLoading(false);
  }
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <p className="muted" style={{ margin: 0 }}>Proven viral short-form formats{niche ? ' for ' + niche : ''}.</p>
        <button className="btn mark" onClick={tailor} disabled={loading}>{loading ? 'Tailoring...' : 'Tailor to my niche'}</button>
      </div>
      {err && <p className="err">{err}</p>}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {formats.map((f, i) => (
          <div key={i} className="format-row">
            <span className="format-name">{f.name}</span>
            <span className="muted" style={{ fontSize: 13 }}>{f.why}</span>
            {f.example && <span className="format-eg"><span className="mk">{f.example}</span></span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Schedule({ rhythm, pillars }: { rhythm: string; pillars: string[] }) {
  const perWeek = rhythm === 'Daily' ? 7 : parseInt(rhythm, 10) || 4;
  const postDays = pickDays(perWeek);
  const usePillars = pillars.length ? pillars : ['Teach', 'Proof', 'Offer'];
  let pi = 0;
  return (
    <div className="card">
      <p className="muted" style={{ marginTop: 0 }}>Your week at a glance, built from your rhythm and pillars.</p>
      <div className="week">
        {DAYS.map((d, idx) => {
          const posting = postDays.includes(idx);
          const pillar = posting ? usePillars[pi++ % usePillars.length] : '';
          return (
            <div key={d} className={'week-day' + (posting ? ' on' : '')}>
              <div className="week-name">{d}</div>
              {posting ? <div className="week-pillar">{pillar}</div> : <div className="muted" style={{ fontSize: 12 }}>rest</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function pickDays(n: number): number[] {
  const patterns: Record<number, number[]> = { 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4], 6: [0, 1, 2, 3, 4, 5], 7: [0, 1, 2, 3, 4, 5, 6] };
  return patterns[n] || [0, 2, 4];
}
