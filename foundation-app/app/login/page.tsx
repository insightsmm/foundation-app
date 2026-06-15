'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else router.push('/app');
  }

  return (
    <div className="center">
      <form onSubmit={submit} className="card" style={{ width: 'min(380px,100%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 className="h-display" style={{ fontSize: 22 }}>Log in</h1>
        <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="err">{err}</p>}
        <button className="btn mark" disabled={loading}>{loading ? 'Signing in...' : 'Log in'}</button>
        <p className="muted" style={{ textAlign: 'center' }}>No account? <Link href="/signup" style={{ color: 'var(--mark)' }}>Create one</Link></p>
      </form>
    </div>
  );
}
