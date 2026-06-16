# Foundation — deploy guide

A Next.js 14 app: email/password auth (Supabase), a $97/mo Stripe paywall,
a BrandOS record, and the TPO content engine (server-side Anthropic calls).

## 1. Push to a new GitHub repo (your step — needs your login)
From inside this folder:

    git init
    git add .
    git commit -m "Foundation initial"
    git branch -M main
    git remote add origin https://github.com/<your-username>/foundation.git
    git push -u origin main

Create the empty repo named `foundation` on github.com first (no README), then run the above.

## 2. Import on Netlify
app.netlify.com → Add new project → Import from GitHub → pick `foundation`.
Build command and publish dir are already set by netlify.toml. Do NOT deploy yet — add env vars first.

## 3. Environment variables (Site configuration → Environment variables)
    ANTHROPIC_API_KEY            your Anthropic key
    NEXT_PUBLIC_SUPABASE_URL     https://qfbnmbazrtlewftmxbij.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY   Supabase → Project Settings → API → anon public
    SUPABASE_SERVICE_ROLE_KEY    Supabase → Project Settings → API → service_role (secret)
    STRIPE_SECRET_KEY            Stripe secret key (rotated)
    STRIPE_WEBHOOK_SECRET        from step 5
    STRIPE_PRICE_ID              from step 4
    NEXT_PUBLIC_SITE_URL         your final Netlify URL

## 4. Stripe product
Stripe → Products → add "Foundation", recurring $97/month. Copy the Price ID (price_...) into STRIPE_PRICE_ID.

## 5. Stripe webhook
Stripe → Developers → Webhooks → add endpoint:
    https://<your-site>/api/stripe/webhook
Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted.
Copy the signing secret (whsec_...) into STRIPE_WEBHOOK_SECRET, then redeploy.

## 6. Deploy and test
Deploy. Sign up → Stripe checkout (test card 4242 4242 4242 4242) → land in /app → save brand → Generate 30 days.

## Database
Already provisioned on your Supabase project (profiles has subscription fields;
brands and calendar_posts have row-level security). No SQL to run.

## What's in this build
Working core loop: auth, paywall, BrandOS record, content engine, live caption rewrite.
Next layer (not yet built): full six-tab BrandOS UI and the Proof Vault.
