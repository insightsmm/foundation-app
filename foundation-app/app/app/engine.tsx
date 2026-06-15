'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { generateMonth, rewritePost, type Post } from '@/lib/ai-client';

type VaultPost = { id: string; hook: string };
type Beat = { l: string; t: string };
const STREAM_ROWS = [
  'Reading your brand voice...',
  'Pulling Clarity Mirror objects...',
  'Balancing Teach / Proof / Offer...',
  'Writing your hooks in rhythm...',
];
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function scriptFor(p: Post, brand: any): Beat[] {
  const cd = brand?.client_data || {};
  const aud = cd.audience || 'the people you serve';
  const mir = p.mirror && p.mirror !== 'your win' ? p.mirror : 'the everyday thing in your hook';
  if (p.type === 'proof') {
    return [
      { l: 'Setup', t: 'Here is what actually happened. ' + p.hook },
      { l: 'Punch', t: 'No big launch, no viral moment, no luck. The system did its job while the work spoke for itself.' },
      { l: 'Land', t: 'Show the result before you make the ask and the ask gets easier every time.' },
      { l: 'CTA', t: 'Comment PROOF and I will walk you through how we set this up.' },
    ];
  }
  if (p.type === 'offer') {
    return [
      { l: 'Setup', t: 'If your weekend disappears into guessing what to post, that is the exact thing this removes.' },
      { l: 'Punch', t: cd.offer ? 'Here it is in plain words. ' + cd.offer : 'One plan, thirty posts, none of them invented by you.' },
      { l: 'Land', t: 'You stay the face and the voice. The system carries the weight.' },
      { l: 'CTA', t: 'Comment SYSTEM and I will send you the 30-day map we run with clients.' },
    ];
  }
  return [
    { l: 'Setup', t: 'Think about ' + mir + '. It does one job and does it without apology.' },
    { l: 'Punch', t: 'Your content earns attention the same way. Pick one idea ' + aud + ' need this week and say it plainly.' },
    { l: 'Land', t: 'Clarity is a choice you make before you ever hit post.' },
    { l: 'CTA', t: 'Save this if your feed has been trying to say too much at once.' },
  ];
}

export default function Engine({ brandId, userId, brand }: { brandId: string | null; userId: string; brand: any }) {
  const supabase = supabaseBrowser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [vault, setVault] = useState<VaultPost[]>([]);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [generated, setGenerated] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [shownRows, setShownRows] = useState(0);
  const [liveNote, setLiveNote] = useState('');
  const [err, setErr] = useState('');
  const [open, setOpen] = useState<Post | null>(null);

  async function loadVault() {
    const { data } = await supabase
      .from('calendar_posts').select('id,hook')
      .eq('user_id', userId).eq('type', 'proof').eq('status', 'draft')
      .order('created_at', { ascending: false });
    setVault((data as VaultPost[]) || []);
  }
  useEffect(() => { loadVault(); /* eslint-disable-next-line */ }, []);

  const limit = view === 'week' ? 7 : 30;

  async function generate() {
    if (!brandId) { setErr('Save your brand in BrandOS first, then generate.'); return; }
    setErr(''); setStreaming(true); setShownRows(0); setLiveNote('');
    STREAM_ROWS.forEach((_, i) => setTimeout(() => setShownRows((n) => Math.max(n, i + 1)), i * 340));
    let live = true;
    let got: Post[] = [];
    try { got = await generateMonth(brandId); } catch { live = false; }
    await delay(STREAM_ROWS.length * 340 + 300);
    setLiveNote(live ? '\u2713 Written live by Claude in your voice' : '\u25CB Live model unavailable. Check your keys and try again.');
    await delay(550);
    setStreaming(false);
    if (live) { setPosts(got); setGenerated(true); }
    else setErr('Generation failed. Check your keys and try again.');
  }

  const shown = posts.slice(0, limit);

  return (
    <div>
      <div className="eyebrow">Content engine</div>
      <h1 className="h-display proof-h1">Thirty days of posts, written in your voice.</h1>
      <p className="lede">The engine writes on the TPO rhythm. Teach earns trust, Proof earns belief, Offer earns the booking. Every hook is pulled from a Clarity Mirror object so it stops the scroll.</p>

      <div className="toolbar">
        <div className="toggle">
          <button className={view === 'month' ? 'on' : ''} onClick={() => setView('month')}>Month</button>
          <button className={view === 'week' ? 'on' : ''} onClick={() => setView('week')}>Week</button>
        </div>
        <div className="spacer" />
        <button className="btn ai" onClick={generate} disabled={streaming}>
          {streaming ? '\u2726 Generating...' : '\u2726 ' + (generated ? 'Regenerate ' : 'Generate ') + limit + ' days'}
        </button>
      </div>

      <div className="legend">
        <span><i className="sw" style={{ background: 'var(--teach)' }} /> Teach</span>
        <span><i className="sw" style={{ background: 'var(--proof)' }} /> Proof</span>
        <span><i className="sw" style={{ background: 'var(--offer)' }} /> Offer</span>
      </div>

      <div className={'streamer' + (streaming ? ' on' : '')}>
        {STREAM_ROWS.map((r, i) => (
          <div key={i} className={'srow' + (i < shownRows ? ' in' : '')}><span className="tick">&rsaquo;</span> {r}</div>
        ))}
        {liveNote && <div className="live">{liveNote}</div>}
      </div>

      {err && <p className="err">{err}</p>}

      {vault.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="vaulthead"><span className="vdot" /> From your vault</div>
          <div className="grid">
            {vault.map((v, i) => (
              <div key={v.id} className="cell newpost reveal" style={{ animationDelay: i * 0.04 + 's' }} onClick={() => setOpen({ day: 0, type: 'proof', hook: v.hook, mirror: 'your win' })}>
                <div className="day">Up next <span className="newtag">new</span></div>
                <span className="pill proof">proof</span>
                <div className="hook"><span className="mk">{v.hook}</span></div>
                <div className="mref">&#9671; your win</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {shown.length === 0 && !streaming && vault.length === 0 && (
        <div className="grid"><div className="empty-note">Your calendar is empty. Hit Generate and watch it fill.</div></div>
      )}

      <div className="grid">
        {shown.map((p, i) => (
          <div key={p.day} className="cell reveal" style={{ animationDelay: i * 0.04 + 's' }} onClick={() => setOpen(p)}>
            <div className="day">Day {p.day}</div>
            <span className={'pill ' + p.type}>{p.type}</span>
            <div className="hook"><span className="mk">{p.hook}</span></div>
            {p.mirror && <div className="mref">&#9671; {p.mirror}</div>}
          </div>
        ))}
      </div>

      {open && <PostModal post={open} brandId={brandId} brand={brand} onClose={() => setOpen(null)} />}
    </div>
  );
}

function PostModal({ post, brandId, brand, onClose }: { post: Post; brandId: string | null; brand: any; onClose: () => void }) {
  const [beats, setBeats] = useState<Beat[]>(() => scriptFor(post, brand));
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  async function rewrite() {
    if (!brandId) return;
    setLoading(true);
    try {
      const text = await rewritePost(brandId, post.hook, post.type);
      setBeats(text.split(/\n+/).filter((l) => l.trim()).map((l) => ({ l: '', t: l.trim() })));
      setLive(true);
    } catch { setCopied('Live model unavailable. Keeping the built-in script.'); }
    setLoading(false);
  }
  function copy() {
    const txt = post.hook + '\n\n' + beats.map((b) => b.t).join('\n\n');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(() => setCopied('Script copied.'), () => setCopied('Copy not available here.'));
    else setCopied('Copy not available here.');
  }

  const dayLabel = post.day ? 'Day ' + post.day : 'Up next';
  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="mtop">
          <span className={'pill ' + post.type}>{post.type}</span>
          <span className="mday">{dayLabel}</span>
          {post.mirror && <span className="mmir">&#9671; {post.mirror}</span>}
          <span className="grow" />
          <button className="btn" onClick={onClose} style={{ padding: '4px 10px' }}>Close</button>
        </div>
        <h3 className="h-display" style={{ fontSize: 21, margin: '4px 0 16px' }}><span className="mk">{post.hook}</span></h3>
        <div>
          {live && <div className="beat"><div className="bl">Live draft from Claude</div></div>}
          {beats.map((b, i) => (
            <div key={i} className="beat">{b.l && <div className="bl">{b.l}</div>}<p>{b.t}</p></div>
          ))}
        </div>
        <div className="mfoot">
          <button className="btn ai" onClick={rewrite} disabled={loading || !brandId}>{loading ? '\u2726 Rewriting...' : '\u2726 Rewrite live'}</button>
          <span className="grow" />
          {copied && <span className="muted" style={{ fontSize: 12 }}>{copied}</span>}
          <button className="btn" onClick={copy}>Copy script</button>
        </div>
      </div>
    </div>
  );
}
