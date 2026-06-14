'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { generateMonth, rewritePost, type Post } from '@/lib/ai-client';

const PILLARS = ['Behind the scenes', 'Client wins', 'How-to teaching', 'Myth busting', 'Personal story', 'Local spotlight'];
const MIRRORS = ['coffee filter', 'thermostat', 'traffic light', 'recipe card', 'doorbell', 'grocery list', 'umbrella', 'toolbox', 'metronome'];
const RHYTHMS = ['3x / week', '4x / week', '5x / week', 'Daily'];

type Brand = any;

export default function Dashboard({ initialBrand, userId }: { initialBrand: Brand; userId: string }) {
  const supabase = supabaseBrowser();
  const cd = initialBrand?.client_data || {};
  const [tab, setTab] = useState<'brand' | 'content'>(initialBrand ? 'content' : 'brand');
  const [brandId, setBrandId] = useState<string | null>(initialBrand?.id ?? null);
  const [name, setName] = useState(initialBrand?.name || '');
  const [niche, setNiche] = useState(initialBrand?.niche || '');
  const [goal, setGoal] = useState(initialBrand?.goal || '');
  const [ig, setIg] = useState(initialBrand?.ig_handle || '');
  const [clarity, setClarity] = useState(cd.clarity || '');
  const [audience, setAudience] = useState(cd.audience || '');
  const [offer, setOffer] = useState(cd.offer || '');
  const [rhythm, setRhythm] = useState<string>(cd.rhythm || '4x / week');
  const [pillars, setPillars] = useState<string[]>(cd.pillars || []);
  const [mirrors, setMirrors] = useState<string[]>(cd.mirrors || []);
  const [proof, setProof] = useState(cd.proof || '');
  const [pov, setPov] = useState(cd.pov || '');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const [posts, setPosts] = useState<Post[]>([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genErr, setGenErr] = useState('');
  const [open, setOpen] = useState<Post | null>(null);

  function toggle(list: string[], set: (v: string[]) => void, v: string) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  async function saveBrand() {
    setSaving(true);
    setSavedMsg('');
    const payload = {
      user_id: userId,
      name,
      niche,
      goal,
      ig_handle: ig,
      client_data: { clarity, audience, offer, rhythm, pillars, mirrors, proof, pov },
    };
    let res;
    if (brandId) res = await supabase.from('brands').update(payload).eq('id', brandId).select('id').single();
    else res = await supabase.from('brands').insert(payload).select('id').single();
    setSaving(false);
    if (res.error) { setSavedMsg('Could not save: ' + res.error.message); return; }
    setBrandId(res.data.id);
    setSavedMsg('Saved. The engine writes from this now.');
  }

  async function generate() {
    if (!brandId) { setTab('brand'); setSavedMsg('Save your brand first, then generate.'); return; }
    setGenLoading(true);
    setGenErr('');
    try {
      const result = await generateMonth(brandId);
      setPosts(result);
    } catch (e: any) {
      setGenErr('Generation failed. Check your keys and try again.');
    }
    setGenLoading(false);
  }

  return (
    <div className="wrap">
      <div className="eyebrow">Foundation</div>
      <h1 className="h-display" style={{ fontSize: 26, margin: '6px 0 18px' }}>Your workspace</h1>
      <div className="tabs">
        <button className={'tab' + (tab === 'brand' ? ' on' : '')} onClick={() => setTab('brand')}>Brand</button>
        <button className={'tab' + (tab === 'content' ? ' on' : '')} onClick={() => setTab('content')}>Content engine</button>
      </div>

      {tab === 'brand' && (
        <div className="card">
          <div className="fieldgrid">
            <div><label className="lab">Brand or client name</label><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="lab">Instagram handle</label><input className="field" value={ig} onChange={(e) => setIg(e.target.value)} /></div>
            <div><label className="lab">Niche</label><input className="field" value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
            <div><label className="lab">Primary goal</label><input className="field" value={goal} onChange={(e) => setGoal(e.target.value)} /></div>
            <div className="full"><label className="lab">Clarity statement</label><textarea className="field" rows={2} value={clarity} onChange={(e) => setClarity(e.target.value)} /></div>
            <div className="full"><label className="lab">Ideal customer</label><input className="field" value={audience} onChange={(e) => setAudience(e.target.value)} /></div>
            <div className="full"><label className="lab">Core offer</label><input className="field" value={offer} onChange={(e) => setOffer(e.target.value)} /></div>
            <div className="full">
              <label className="lab">Posting rhythm</label>
              <div>{RHYTHMS.map((r) => (<span key={r} className={'opt' + (rhythm === r ? ' sel' : '')} onClick={() => setRhythm(r)}>{r}</span>))}</div>
            </div>
            <div className="full">
              <label className="lab">Content pillars</label>
              <div>{PILLARS.map((p) => (<span key={p} className={'opt' + (pillars.includes(p) ? ' sel' : '')} onClick={() => toggle(pillars, setPillars, p)}>{p}</span>))}</div>
            </div>
            <div className="full">
              <label className="lab">Clarity Mirror objects</label>
              <div>{MIRRORS.map((m) => (<span key={m} className={'opt' + (mirrors.includes(m) ? ' sel' : '')} onClick={() => toggle(mirrors, setMirrors, m)}>{m}</span>))}</div>
            </div>
            <div className="full"><label className="lab">Signature proof</label><textarea className="field" rows={2} value={proof} onChange={(e) => setProof(e.target.value)} /></div>
            <div className="full"><label className="lab">Permission line</label><textarea className="field" rows={2} value={pov} onChange={(e) => setPov(e.target.value)} /></div>
          </div>
          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn mark" onClick={saveBrand} disabled={saving}>{saving ? 'Saving...' : 'Save brand'}</button>
            {savedMsg && <span className="muted">{savedMsg}</span>}
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div>
          <div className="row" style={{ marginBottom: 16 }}>
            <button className="btn mark" onClick={generate} disabled={genLoading}>{genLoading ? 'Generating...' : 'Generate 30 days'}</button>
            {genErr && <span className="err">{genErr}</span>}
          </div>
          {posts.length === 0 && !genLoading && <p className="muted">Generate to fill your calendar. Each hook comes back in your brand voice.</p>}
          <div className="grid">
            {posts.map((p) => (
              <div key={p.day} className="cell" onClick={() => setOpen(p)}>
                <div className="day">Day {p.day}</div>
                <span className={'pill ' + p.type}>{p.type}</span>
                <div className="hook"><span className="mk">{p.hook}</span></div>
                {p.mirror && <div className="muted" style={{ fontFamily: 'monospace', marginTop: 'auto' }}>◇ {p.mirror}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {open && brandId && <PostModal post={open} brandId={brandId} onClose={() => setOpen(null)} />}
    </div>
  );
}

function PostModal({ post, brandId, onClose }: { post: Post; brandId: string; onClose: () => void }) {
  const [body, setBody] = useState<string>('');
  const [loading, setLoading] = useState(false);
  async function rewrite() {
    setLoading(true);
    try {
      const text = await rewritePost(brandId, post.hook, post.type);
      setBody(text);
    } catch {
      setBody('Could not reach the model. Try again.');
    }
    setLoading(false);
  }
  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className={'pill ' + post.type}>{post.type}</span>
          <button className="btn" onClick={onClose} style={{ padding: '4px 10px' }}>Close</button>
        </div>
        <h3 className="h-display" style={{ fontSize: 20, margin: '14px 0' }}>{post.hook}</h3>
        {post.mirror && <p className="muted" style={{ fontFamily: 'monospace' }}>◇ Clarity Mirror: {post.mirror}</p>}
        <div style={{ marginTop: 16 }}>
          <button className="btn mark" onClick={rewrite} disabled={loading}>{loading ? 'Writing...' : 'Write full caption with AI'}</button>
        </div>
        {body && <p style={{ marginTop: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{body}</p>}
      </div>
    </div>
  );
}
