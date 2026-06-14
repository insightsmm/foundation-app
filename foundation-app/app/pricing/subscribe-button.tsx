'use client';
import { useState } from 'react';
import { startCheckout } from '@/lib/ai-client';

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  async function go() {
    setLoading(true);
    setErr('');
    try {
      await startCheckout();
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
      setLoading(false);
    }
  }
  return (
    <>
      <button className="btn mark" style={{ width: '100%' }} onClick={go} disabled={loading}>
        {loading ? 'Starting checkout...' : 'Start Foundation'}
      </button>
      {err && <p className="err" style={{ marginTop: 10 }}>{err}</p>}
    </>
  );
}
