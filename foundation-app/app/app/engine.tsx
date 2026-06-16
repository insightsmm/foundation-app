'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { generateMonth, rewritePost, type Post } from '@/lib/ai-client';

type Saved = { id: string; post_date: string; type: string; hook: string; visual_note: string | null; status: string };
type Beat = { l: string; t: string };
const STREAM_ROWS = ['Reading your brand voice...', 'Pulling Clarity Mirror objects...', 'Balancing Teach / Proof / Offer...', 'Writing your hooks in rhythm...'];
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function dateLabel(iso: string) {
  try { return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
  catch { return iso; }
}
function mirrorOf(s: Saved) { return s.visual_note || (s.type === 'proof' ? 'your win' : ''); }

function scriptFor(p: Post, brand: any): Beat[] {
  const cd = brand?.client_data || {};
  const aud = cd.audience || 'the people you serve';
  const mir = p.mirror && p.mirror !== 'your win' ? p.mirror : 'the everyday thing in your hook';
  if (p.type === 'proof') return [
    { l: 'Setup', t: 'Here is what actually happened. ' + p.hook },
    { l: 'Punch', t: 'No big launch, no viral moment, no luck. The system did its job while the work spoke for itself.' },
    { l: 'Land', t: 'Show the result before you make the ask and the ask gets easier every time.' },
    { l: 'CTA', t: 'Comment PROOF and I will walk you through how we set this up.' },
  ];
  if (p.type === 'offer') return [
    { l: 'Setup', t: 'If your weekend disappears into guessing what to post, that is the exact thing this removes.' },
    { l: 'Punch', t: cd.offer ? 'Here it is in plain words. ' + cd.offer : 'One plan, thirty posts, none of them invented by you.' },
    { l: 'Land', t: 'You stay the face and the voice. The system carries the weight.' },
    { l: 'CTA', t: 'Comment SYSTEM and I will send you the 30-day map we run with clients.' },
  ];
  return [
    { l: 'Setup', t: 'Think about ' + mir + '. It does one job and does it without apology.' },
    { l: 'Punch', t: 'Your content earns attention the same way. Pick one idea ' + aud + ' need this week and say it plainly.' },
    { l: 'Land', t: 'Clarity is a choice you make before you ever hit post.' },
    { l: 'CTA', t: 'Save this if your feed has been trying to say too much at once.' },
  ];
}

export default function Engine({ brandId, userId, brand }: { brandId: string | null; userId: string; brand: any }) {
  const supabase = supabaseBrowser();
  const [saved, setSaved] = useState<Saved[]>([]);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [tab, setTab] = useState<'calendar' | 'library'>('calendar');
  const [streaming, setStreaming] = useState(false);
  const [shownRows, setShownRows] = useState(0);
  const [liveNote, setLiveNote] = useState('');
  const [err, setErr] = useState('');
  const [open, setOpen] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!brandId) { setSaved([]); setLoading(false); return; }
    const { data } = await supabase
      .from('calendar_posts').select('id,post_date,type,hook,visual_note,status')
      .eq('brand_id', brandId).order('post_date', { ascending: true });
    setSaved((data as Saved[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const limit = view === 'week' ? 7 : 30;
  const generated = saved.some((s) => s.status === 'generated');

  async function generate() {
    if (!brandId) { setErr('Save a brand in BrandOS first, then generate.'); return; }
    setErr(''); setStreaming(true); setShownRows(0); setLiveNote('');
    STREAM_ROWS.forEach((_, i) => setTimeout(() => setShownRows((n) => Math.max(n, i + 1)), i * 340));
    let live = true;
    let got: Post[] = [];
    try { got = await generateMonth(brandId); } catch { live = false; }
    await delay(STREAM_ROWS.length * 340 + 300);
    if (live && got.length) {
      const today = new Date();
      const rows = got.map((p, i) => {
        const d = new Date(today); d.setDate(d.getDate() + i);
        return { user_id: userId, brand_id: brandId, type: p.type, pillar: p.type, post_date: d.toISOString().slice(0, 10), hook: p.hook, caption_hook: p.hook, visual_note: p.mirror || '', status: 'generated' };
      });
      await supabase.from('calendar_posts').delete().eq('brand_id', brandId).eq('status', 'generated');
      await supabase.from('calendar_posts').insert(rows);
      await load();
      setLiveNote('\u2713 Written live by Claude and saved to your calendar');
    } else {
      setLiveNote('\u25CB Live model unavailable. Check your keys and try again.');
      setErr('Generation failed. Check your keys and try again.');
    }
    await delay(550);
    setStreaming(false);
  }

  const shown = saved.slice(0, limit);

  function toPost(s: Saved): Post { return { day: 0, type: s.type, hook: s.hook, mirror: mirrorOf(s) }; }

  return (
    <div>
      <div className="eyebrow">Content engine</div>
      <h1 className="h-display proof-h1">Your content calendar, written in your voice.</h1>
      <p className="lede">The engine writes on the TPO rhythm. Teach earns trust, Proof earns belief, Offer earns the booking. Everything you generate and every win you bank from the Proof Vault lands right here and stays.</p>

      <div className="toggle" style={{ marginBottom: 16 }}>
        <button className={tab === 'calendar' ? 'on' : ''} onClick={() => setTab('calendar')}>Calendar</button>
        <button className={tab === 'library' ? 'on' : ''} onClick={() => setTab('library')}>Format library</button>
      </div>

      {tab === 'calendar' && (<>
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
        {STREAM_ROWS.map((r, i) => (<div key={i} className={'srow' + (i < shownRows ? ' in' : '')}><span className="tick">&rsaquo;</span> {r}</div>))}
        {liveNote && <div className="live">{liveNote}</div>}
      </div>

      {err && <p className="err">{err}</p>}

      {!loading && shown.length === 0 && !streaming && (
        <div className="grid"><div className="empty-note">Your calendar is empty. Hit Generate, or log a win in the Proof Vault and turn it into a post.</div></div>
      )}

      <div className="grid">
        {shown.map((s, i) => (
          <div key={s.id} className={'cell reveal' + (s.type === 'proof' ? ' newpost' : '')} style={{ animationDelay: i * 0.04 + 's' }} onClick={() => setOpen(toPost(s))}>
            <div className="day">{dateLabel(s.post_date)}{s.type === 'proof' && <span className="newtag">vault</span>}</div>
            <span className={'pill ' + s.type}>{s.type}</span>
            <div className="hook"><span className="mk">{s.hook}</span></div>
            {mirrorOf(s) && <div className="mref">&#9671; {mirrorOf(s)}</div>}
          </div>
        ))}
      </div>

      </>)}
      {tab === 'library' && <FormatLibrary brandId={brandId} userId={userId} onAdded={load} />}
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

  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="mtop">
          <span className={'pill ' + post.type}>{post.type}</span>
          {post.mirror && <span className="mmir">&#9671; {post.mirror}</span>}
          <span className="grow" />
          <button className="btn" onClick={onClose} style={{ padding: '4px 10px' }}>Close</button>
        </div>
        <h3 className="h-display" style={{ fontSize: 21, margin: '4px 0 16px' }}><span className="mk">{post.hook}</span></h3>
        <div>
          {live && <div className="beat"><div className="bl">Live draft from Claude</div></div>}
          {beats.map((b, i) => (<div key={i} className="beat">{b.l && <div className="bl">{b.l}</div>}<p>{b.t}</p></div>))}
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

const FORMAT_LIB = [
  { name: 'Talking head + B-roll', pillar: 'teach', why: 'Teach one idea fast with footage running behind your words.', beats: ['Hook on camera', 'Cut to B-roll as you explain', 'Land the point', 'CTA'] },
  { name: 'Text-on-screen list', pillar: 'teach', why: 'Three to five quick points people screenshot and save.', beats: ['Title card hook', 'Point 1', 'Point 2', 'Point 3', 'CTA'] },
  { name: 'Before / after reveal', pillar: 'proof', why: 'Show a transformation in one cut.', beats: ['Before state', 'Hard cut', 'After state', 'One line on how'] },
  { name: 'Green screen react', pillar: 'teach', why: 'Stand in front of a post or stat and respond.', beats: ['Put the post on screen', 'React with your take', 'Add the nuance', 'CTA'] },
  { name: 'POV', pillar: 'teach', why: 'Put the viewer in a scene they recognize.', beats: ['POV text hook', 'Act out the moment', 'Flip to the lesson', 'CTA'] },
  { name: 'Day in the life', pillar: 'proof', why: 'Show the work behind the result.', beats: ['Morning setup', 'The real work', 'A small win', 'Wrap with the why'] },
  { name: 'Myth vs fact', pillar: 'teach', why: 'Bust a common belief in your niche.', beats: ['State the myth', 'Pause', 'Drop the fact', 'Why it matters'] },
  { name: 'Storytime', pillar: 'proof', why: 'One real story with a lesson.', beats: ['Hook with the stakes', 'The turn', 'The result', 'The takeaway'] },
  { name: '3 mistakes', pillar: 'teach', why: 'Numbered, fast, promises value in the first second.', beats: ['Hook: 3 mistakes', 'Mistake 1', 'Mistake 2', 'Mistake 3 + fix'] },
  { name: 'Offer in plain words', pillar: 'offer', why: 'Say what you do and invite the next step.', beats: ['Name the problem', 'Name your offer', 'Remove the risk', 'CTA with keyword'] },
];

function FormatLibrary({ brandId, userId, onAdded }: { brandId: string | null; userId: string; onAdded: () => void }) {
  const supabase = supabaseBrowser();
  const [added, setAdded] = useState('');
  async function addToCalendar(f: any) {
    if (!brandId) { setAdded('Save a brand first.'); return; }
    const today = new Date().toISOString().slice(0, 10);
    await supabase.from('calendar_posts').insert({
      user_id: userId, brand_id: brandId, type: f.pillar, pillar: f.pillar, post_date: today,
      hook: f.name + ' idea', caption_hook: f.name, visual_note: f.beats.join(' -> '),
      script_body: f.beats.join('\n'), status: 'draft', notes: 'From the format library',
    });
    setAdded('Added "' + f.name + '" to your calendar as a draft.');
    onAdded();
    setTimeout(() => setAdded(''), 2800);
  }
  return (
    <div>
      <p className="muted" style={{ marginTop: 0 }}>Proven viral short-form formats. Tap one to drop a draft into your calendar, then open it to write it out.</p>
      {added && <p className="ok-note">{added}</p>}
      <div className="fmt-grid">
        {FORMAT_LIB.map((f, i) => (
          <div key={i} className="card fmt-card">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="h-display" style={{ fontSize: 16, margin: 0 }}>{f.name}</h3>
              <span className={'pill ' + f.pillar}>{f.pillar}</span>
            </div>
            <p className="muted" style={{ fontSize: 13, margin: '6px 0 10px', lineHeight: 1.45 }}>{f.why}</p>
            <div className="fmt-beats">{f.beats.map((b, j) => <span key={j} className="fmt-beat">{b}</span>)}</div>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => addToCalendar(f)} disabled={!brandId}>Add to calendar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
