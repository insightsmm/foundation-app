import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // called from a Server Component; safe to ignore, middleware refreshes
          }
        },
      },
    }
  );
}

type GateResult =
  | { user: { id: string; email: string | null } }
  | { error: Response };

export async function requireActiveUser(): Promise<GateResult> {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: new Response('Unauthorized', { status: 401 }) };

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status,is_admin')
    .eq('id', user.id)
    .single();

  const active = profile && (profile.is_admin || ['active', 'trialing'].includes(profile.subscription_status));
  if (!active) return { error: new Response('Subscription required', { status: 402 }) };

  return { user: { id: user.id, email: user.email ?? null } };
}
