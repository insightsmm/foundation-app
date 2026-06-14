'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type ProofItem = {
  id: string;
  title: string;
  detail: string | null;
  kind: string;
  metric: string | null;
  status: string;
  created_at: string;
};

const KINDS = ['win', 'testimonial', 'result', 'milestone'];

export default function Proof({ brandId, userId }: { brandId: string | null; userId: string }) {
  const supabase = supabaseBrowser();
  const [items, setItems] = useState<ProofItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [kind, setKind] = useState('win');
  const [metric, setMetric] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('proof_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setItems((data as ProofItem[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function addProof() {
    if (!title.trim()) return;
    setMsg('');
    const { error } = await supabase.from('proof_items').insert({
      user_id: userId,
      brand_id: brandId,
      title: title.trim(),
      detail: detail.trim() || null,
      kind,
      metric: metric.trim() || null,
      status: 'new',
    });
    if (error) { setMsg('Could not save: ' + error.message); return; }
    setTitle(''); setDetail(''); setMetric(''); setKind('win');
    load();
  }

  async function turnIntoPost(item: ProofItem) {
    setMsg('');
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from('calendar_posts').insert({
      user_id: userId,
      brand_id: brandId,
      type: 'proof',
      pillar: 'Proof',
      post_date: today,
      hook: item.title,
      caption_hook: item.metric ? `${item.title} (${item.metric})` : item.title,
      script_body: item.detail || '',
      status: 'draft',
      notes: 'From the Proof Vault',
    });
    if (error) { setMsg('Could not create the post: ' + error.message); return; }
    await supabase.from('proof_items').update({ status: 'used' }).eq('id', item.id);
    setMsg('Dropped into your calendar as a proof post.');
    load();
  }

  async function remove(id: string) {
    await supabase.from('proof_items').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="area-head">
        <div>
          <h2 className="h-display" style={{ fontSize: 20, margin: 0 }}>Proof Vault</h2>
          <p className="muted" style={{ margin: '4px 0 0' }}>Log every win. Turn it into proof that refills your calendar.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="fieldgrid">
          <div className="full"><label className="lab">What happened</label><input className="field" placeholder="Booked a 6-month retainer" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><label className="lab">Kind</label>
            <div>{KINDS.map((k) => (<span key={k} className={'opt' + (kind === k ? ' sel' : '')} onClick={() => setKind(k)}>{k}</span>))}</div>
          </div>
          <div><label className="lab">Metric (optional)</label><input className="field" placeholder="+38% reach" value={metric} onChange={(e) => setMetric(e.target.value)} /></div>
          <div className="full"><label className="lab">Detail (optional)</label><textarea className="field" rows={2} value={detail} onChange={(e) => setDetail(e.target.value)} /></div>
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn mark" onClick={addProof} disabled={!title.trim()}>Log proof</button>
          {!brandId && <span className="muted">Save a brand first so proof posts attach to it.</span>}
          {msg && <span className="ok">{msg}</span>}
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading your vault...</p>
      ) : items.length === 0 ? (
        <p className="muted">No wins logged yet. Every screenshot, every result, every kind word counts.</p>
      ) : (
        <div className="proof-grid">
          {items.map((it) => (
            <div key={it.id} className="proof-card">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className={'pill ' + (it.status === 'used' ? 'teach' : 'offer')}>{it.kind}</span>
                {it.status === 'used' && <span className="muted" style={{ fontSize: 11 }}>used</span>}
              </div>
              <div className="hook" style={{ marginTop: 8 }}>{it.title}</div>
              {it.metric && <div className="mk-inline">{it.metric}</div>}
              {it.detail && <p className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{it.detail}</p>}
              <div className="row" style={{ marginTop: 'auto', gap: 8 }}>
                <button className="btn mark" style={{ padding: '7px 12px', fontSize: 13 }} onClick={() => turnIntoPost(it)} disabled={!brandId}>Turn into proof post</button>
                <button className="btn" style={{ padding: '7px 10px', fontSize: 13 }} onClick={() => remove(it.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
