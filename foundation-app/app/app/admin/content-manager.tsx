'use client';
import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--line)', background: '#fff',
  fontFamily: 'inherit', fontSize: 14, marginTop: 6,
};
const delStyle: React.CSSProperties = {
  background: 'none', border: 0, color: '#b00', cursor: 'pointer',
  fontFamily: 'inherit', fontSize: 13, padding: 0, textDecoration: 'underline',
};

export default function ContentManager() {
  const supabase = supabaseBrowser();
  const [posts, setPosts] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [pTitle, setPTitle] = useState(''); const [pExcerpt, setPExcerpt] = useState(''); const [pBody, setPBody] = useState('');
  const [rTitle, setRTitle] = useState(''); const [rDesc, setRDesc] = useState(''); const [rUrl, setRUrl] = useState(''); const [rCat, setRCat] = useState('');
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);

  async function load() {
    const { data: p } = await supabase.from('blog_posts').select('id,title,slug,created_at').order('created_at', { ascending: false });
    const { data: r } = await supabase.from('resources').select('id,title,category,created_at').order('created_at', { ascending: false });
    setPosts(p || []); setResources(r || []);
  }
  useEffect(() => { load(); }, []);

  async function addPost() {
    if (!pTitle.trim() || !pBody.trim()) { setMsg('Title and body are required.'); return; }
    setBusy(true); setMsg('');
    const slug = slugify(pTitle) + '-' + Math.random().toString(36).slice(2, 6);
    const { error } = await supabase.from('blog_posts').insert({ title: pTitle.trim(), slug, excerpt: pExcerpt.trim() || null, body: pBody.trim() });
    setBusy(false);
    if (error) { setMsg('Error: ' + error.message); return; }
    setPTitle(''); setPExcerpt(''); setPBody(''); setMsg('Post published.'); load();
  }
  async function addResource() {
    if (!rTitle.trim()) { setMsg('Resource title is required.'); return; }
    setBusy(true); setMsg('');
    const { error } = await supabase.from('resources').insert({ title: rTitle.trim(), description: rDesc.trim() || null, url: rUrl.trim() || null, category: rCat.trim() || null });
    setBusy(false);
    if (error) { setMsg('Error: ' + error.message); return; }
    setRTitle(''); setRDesc(''); setRUrl(''); setRCat(''); setMsg('Resource added.'); load();
  }
  async function delPost(id: string) { if (!confirm('Delete this post?')) return; await supabase.from('blog_posts').delete().eq('id', id); load(); }
  async function delResource(id: string) { if (!confirm('Delete this resource?')) return; await supabase.from('resources').delete().eq('id', id); load(); }

  return (
    <div style={{ marginTop: 40 }}>
      <h2 className="admin-h">Publish a blog post</h2>
      <div className="admin-table" style={{ padding: 16, display: 'grid', gap: 10 }}>
        <label>Title<input style={inputStyle} value={pTitle} onChange={(e) => setPTitle(e.target.value)} /></label>
        <label>Excerpt (one line shown in the list)<input style={inputStyle} value={pExcerpt} onChange={(e) => setPExcerpt(e.target.value)} /></label>
        <label>Body (plain text, leave a blank line between paragraphs)<textarea style={{ ...inputStyle, minHeight: 160 }} value={pBody} onChange={(e) => setPBody(e.target.value)} /></label>
        <button className="btn" onClick={addPost} disabled={busy} style={{ justifySelf: 'start' }}>{busy ? 'Saving…' : 'Publish post'}</button>
      </div>
      <div className="admin-table" style={{ marginTop: 12 }}>
        <div className="admin-tr admin-head"><span>Post</span><span>Slug</span><span>Date</span><span></span></div>
        {posts.map((p) => (
          <div key={p.id} className="admin-tr">
            <span>{p.title}</span>
            <span className="muted">{p.slug}</span>
            <span className="muted">{new Date(p.created_at).toLocaleDateString()}</span>
            <span><button style={delStyle} onClick={() => delPost(p.id)}>Delete</button></span>
          </div>
        ))}
      </div>

      <h2 className="admin-h">Add a resource</h2>
      <div className="admin-table" style={{ padding: 16, display: 'grid', gap: 10 }}>
        <label>Title<input style={inputStyle} value={rTitle} onChange={(e) => setRTitle(e.target.value)} /></label>
        <label>Description<input style={inputStyle} value={rDesc} onChange={(e) => setRDesc(e.target.value)} /></label>
        <label>Link (URL)<input style={inputStyle} value={rUrl} onChange={(e) => setRUrl(e.target.value)} /></label>
        <label>Category<input style={inputStyle} value={rCat} onChange={(e) => setRCat(e.target.value)} /></label>
        <button className="btn" onClick={addResource} disabled={busy} style={{ justifySelf: 'start' }}>{busy ? 'Saving…' : 'Add resource'}</button>
      </div>
      <div className="admin-table" style={{ marginTop: 12 }}>
        <div className="admin-tr admin-head"><span>Resource</span><span>Category</span><span>Date</span><span></span></div>
        {resources.map((r) => (
          <div key={r.id} className="admin-tr">
            <span>{r.title}</span>
            <span className="muted">{r.category || '-'}</span>
            <span className="muted">{new Date(r.created_at).toLocaleDateString()}</span>
            <span><button style={delStyle} onClick={() => delResource(r.id)}>Delete</button></span>
          </div>
        ))}
      </div>
      {msg && <p style={{ marginTop: 12, color: msg.startsWith('Error') ? '#b00' : 'var(--muted)' }}>{msg}</p>}
    </div>
  );
}
