'use client';
import { useState } from 'react';
import { startCheckout } from '@/lib/ai-client';

export default function SubscribeButton({ plan = 'foundation', label = 'Start Foundation' }: { plan?: string; label?: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  async function go() {
    setLoading(true);
    setErr('');
    try {
      await startCheckout(plan);
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
      setLoading(false);
    }
  }
  return (
    <>
      <button className="btn mark" style={{ width: '100%' }} onClick={go} disabled={loading}>
        {loading ? 'Starting checkout...' : label}
      </button>
      {err && <p className="err" style={{ marginTop: 10 }}>{err}</p>}
    </>
  );
}
