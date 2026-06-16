'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Win = { id: string; title: string; created_at: string; status: string };

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  if (diff < 3600000) return 'just now';
  if (diff < day) return Math.floor(diff / 3600000) + 'h ago';
  const days = Math.floor(diff / day);
  if (days === 1) return '1 day ago';
  if (days < 7) return days + ' days ago';
  const w = Math.floor(days / 7);
  return w === 1 ? '1 week ago' : w + ' weeks ago';
}

export default function Proof({ brandId, userId }: { brandId: string | null; userId: string }) {
  const supabase = supabaseBrowser();
  const [wins, setWins] = useState<Win[]>([]);
  const [queued, setQueued] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);
    if (!brandId) { setWins([]); setQueued(0); setLoading(false); return; }
    const { data } = await supabase
      .from('proof_items')
      .select('id,title,created_at,status')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });
    const w = (data as Win[]) || [];
    setWins(w);
    setQueued(w.filter((x) => x.status === 'used').length);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  function flash(m: string) { setToast(m); setTimeout(() => setToast(''), 2600); }

  async function logWin() {
    const v = input.trim();
    if (!v) return;
    setInput('');
    const { data } = await supabase
      .from('proof_items')
      .insert({ user_id: userId, brand_id: brandId, title: v, kind: 'win', status: 'new' })
      .select('id,title,created_at,status')
      .single();
    if (data) setWins((prev) => [data as Win, ...prev]);
    flash('Win logged to your vault.');
  }

  async function turnInto(w: Win) {
    const today = new Date().toISOString().slice(0, 10);
    await supabase.from('calendar_posts').insert({
      user_id: userId, brand_id: brandId, type: 'proof', pillar: 'Proof',
      post_date: today, hook: w.title, caption_hook: w.title, status: 'draft', notes: 'From the Proof Vault',
    });
    await supabase.from('proof_items').update({ status: 'used' }).eq('id', w.id);
    setWins((prev) => prev.map((x) => (x.id === w.id ? { ...x, status: 'used' } : x)));
    setQueued((q) => q + 1);
    flash('Added to your calendar. Open the Content engine to see it.');
  }

  const spin = Math.max(5, 16 - queued * 1.6);
  const ringStyle = { ['--spin' as string]: spin + 's' } as CSSProperties;

  return (
    <div>
      <div className="eyebrow">Proof vault</div>
      <h1 className="h-display proof-h1">Every win becomes tomorrow&apos;s content.</h1>
      <p className="lede">Log a result the moment it happens. One tap turns it into a Proof post and drops it into your calendar. That loop is the flywheel. The more you win, the more you have to post, the more you win.</p>

      <div className="proofgrid">
        <div>
          <div className="addrow">
            <input
              className="field"
              placeholder="A client booked 6 calls from one reel..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') logWin(); }}
            />
            <button className="btn" onClick={logWin}>Log win</button>
          </div>
          <div>
            {loading ? (
              <p className="muted">Loading your vault...</p>
            ) : wins.length === 0 ? (
              <p className="muted">No wins yet. Log the first result you are proud of.</p>
            ) : (
              wins.map((w) => {
                const q = w.status === 'used';
                return (
                  <div key={w.id} className={'win' + (q ? ' queued' : '')}>
                    <div className="wt"><p>{w.title}</p><small>{ago(w.created_at)}</small></div>
                    <button className={'btn' + (q ? '' : ' mark')} disabled={q} onClick={() => { if (!q) turnInto(w); }}>
                      {q ? 'In your calendar \u2713' : 'Turn into proof post'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card flycard">
          <div className="ring" style={ringStyle}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(250,247,240,.1)" strokeWidth="6" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--mark)" strokeWidth="6" strokeLinecap="round" strokeDasharray="62 251" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="10" r="4.5" fill="var(--teach)" />
              <circle cx="84" cy="68" r="4.5" fill="var(--proof)" />
              <circle cx="16" cy="68" r="4.5" fill="var(--offer)" />
            </svg>
            <div className="ctr"><div><b>{queued}</b><small>queued</small></div></div>
          </div>
          <p>Proof posts waiting in your calendar. Each new win spins the wheel a little faster.</p>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
