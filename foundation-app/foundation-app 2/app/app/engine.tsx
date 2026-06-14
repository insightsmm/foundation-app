'use client';
import { useState } from 'react';
import { generateMonth, rewritePost, type Post } from '@/lib/ai-client';

export default function Engine({ brandId, onProofToCalendar }: { brandId: string | null; onProofToCalendar?: (p: Post) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState<Post | null>(null);

  async function generate() {
    if (!brandId) { setErr('Save your brand in BrandOS first, then generate.'); return; }
    setLoading(true);
    setErr('');
    try {
      setPosts(await generateMonth(brandId));
    } catch {
      setErr('Generation failed. Check your keys and try again.');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="area-head">
        <div>
          <h2 className="h-display" style={{ fontSize: 20, margin: 0 }}>Content engine</h2>
          <p className="muted" style={{ margin: '4px 0 0' }}>Thirty days on the TPO rhythm, every hook in your voice.</p>
        </div>
        <button className="btn mark" onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate 30 days'}</button>
      </div>
      {err && <p className="err">{err}</p>}
      {posts.length === 0 && !loading && <p className="muted">Your calendar is empty. Generate to fill it.</p>}
      <div className="grid">
        {posts.map((p) => (
          <div key={p.day} className="cell" onClick={() => setOpen(p)}>
            <div className="day">Day {p.day}</div>
            <span className={'pill ' + p.type}>{p.type}</span>
            <div className="hook"><span className="mk">{p.hook}</span></div>
            {p.mirror && <div className="muted" style={{ fontFamily: 'monospace', marginTop: 'auto' }}>&#9671; {p.mirror}</div>}
          </div>
        ))}
      </div>
      {open && brandId && <PostModal post={open} brandId={brandId} onClose={() => setOpen(null)} />}
    </div>
  );
}

function PostModal({ post, brandId, onClose }: { post: Post; brandId: string; onClose: () => void }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  async function rewrite() {
    setLoading(true);
    try {
      setBody(await rewritePost(brandId, post.hook, post.type));
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
        {post.mirror && <p className="muted" style={{ fontFamily: 'monospace' }}>&#9671; Clarity Mirror: {post.mirror}</p>}
        <div style={{ marginTop: 16 }}>
          <button className="btn mark" onClick={rewrite} disabled={loading}>{loading ? 'Writing...' : 'Write full caption with AI'}</button>
        </div>
        {body && <p style={{ marginTop: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{body}</p>}
      </div>
    </div>
  );
}
