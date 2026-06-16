'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function SignupPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setMsg('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/app` : undefined },
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    if (data.session) router.push('/pricing');
    else setMsg('Check your email to confirm your account, then log in.');
  }

  return (
    <div className="center">
      <form onSubmit={submit} className="card" style={{ width: 'min(380px,100%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 className="h-display" style={{ fontSize: 22 }}>Create your account</h1>
        <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button className="btn mark" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <p className="muted" style={{ textAlign: 'center' }}>Already have one? <Link href="/login" style={{ color: 'var(--mark)' }}>Log in</Link></p>
      </form>
    </div>
  );
}
