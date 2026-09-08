# Facture JIRAMA — indexing tracker

Digitalises the monthly JIRAMA meter-index call (dial **547**) and shows, per
utility, whether this month's reading is **done** or **not done yet** — and who
did it. React + Vite + Tailwind, Clerk auth, Firebase/Firestore data.
**100% free tier — no Cloud Functions, no third-party servers.**

- Always dark, mobile-first, EN / FR / MG.
- Routes: `/login`, `/sign-up`, `/indexing`, `/billing`.
- Not signed in → `/login`. Signed in → `/indexing`.
- Status is **one-way**: not_done → done (never back). "Done" records `done_by`.
- Current month's `BILLS` records are **auto-created** on first visit each month.
- Signed-in users are **registered in Firestore** automatically (client-side).

---

## 0. What you need

- Node.js 18+.
- Your Clerk application.
- Your Firebase project with **Firestore** enabled.

Everything below stays on Firebase's free **Spark** plan.

## 1. Install & keys

```bash
npm install
cp .env.example .env
```

Fill `.env`:

| Variable | Where to get it |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API keys → Publishable key (`pk_...`) |
| `VITE_FIREBASE_*` | Firebase Console → Project settings → Your apps (Web app) → SDK config |

```bash
npm run dev
```

## 2. Clerk dashboard setup

**a. Email auth** — Clerk → **User & Authentication → Email, Phone, Username** →
enable **Email address** (verification code or password, your choice). The
`/login` and `/sign-up` pages use Clerk's components, so no code change needed.

**b. Firebase integration** (this is what links a Clerk user to Firestore) —
Clerk → **Integrations → Firebase** → enable.
- Firebase Console → **Project settings → Service accounts → Firebase Admin SDK**
  → **Generate new private key** (downloads a JSON).
- In Clerk's Firebase modal → **Upload JSON** → drop that file. Save.
- This creates the `integration_firebase` token the app already uses in
  `src/hooks/useFirebaseAuth.js`. Nothing to code.

## 3. Firebase setup

**a. Firestore** — Console → Firestore Database → Create (production mode).

**b. Rules** — deploy the included `firestore.rules`:

```bash
npm i -g firebase-tools
firebase login
firebase init firestore     # pick your project; keep firestore.rules
firebase deploy --only firestore:rules
```

Collections appear automatically on first write:
- `BILLS/{type_YYYY-MM}` — `{ type, ref, date:"MM/YYYY", ym, status, done_by, done_at }`
- `users/{clerkId}` — `{ clerkId, email, firstName, lastName, imageUrl, updatedAt }`

## 4. How users get registered in Firebase (no webhook)

You don't need Svix/webhooks for this. A webhook receiver would require a
server running on request — on Firebase that's Cloud Functions, which needs the
paid Blaze plan. Instead, the moment a user signs in, the browser already has
their Clerk profile, so `src/hooks/useSyncUser.js` writes it straight to
`users/{clerkId}`. Free, Firebase-only, runs on every sign-in.

The Firestore rule `request.auth.uid == userId` means each person can only
write their own record — `auth.uid` comes from the Clerk↔Firebase token and
equals the Clerk user id.

(If you ever *do* want real-time server-side sync — e.g. to catch a user
`deleted` in the Clerk dashboard — that specific case needs a webhook endpoint
hosted on something with free compute. Not needed for this app.)

## 5. Project structure

```
src/
├─ main.jsx                 # ClerkProvider + BrowserRouter (+ missing-key guard)
├─ App.jsx                  # routes: /login /sign-up /indexing /billing
├─ i18n/translations.js     # EN/FR/MG + month labels
├─ config/
│  ├─ data.js               # bill refs, per-utility theme, 547
│  └─ firebase.js           # app / db / auth (null until .env filled)
├─ lib/bills.js             # billId, periodParts, ensureCurrentMonthBills()
├─ hooks/
│  ├─ useFirebaseAuth.js    # Clerk token -> Firebase sign-in
│  ├─ useSyncUser.js        # register signed-in user in Firestore (free)
│  └─ useBills.js           # live BILLS + one-way markDone()
├─ components/
│  ├─ ProtectedLayout.jsx   # auth guard + Navbar + user-sync + monthly ensure
│  ├─ Navbar.jsx            # desktop inline / mobile hamburger
│  ├─ BillTile.jsx          # current-month tile + 547 CTA
│  ├─ IndexingHistory.jsx   # month picker → past records
│  ├─ BrandMark.jsx · LangSwitch.jsx
├─ pages/
│  ├─ LoginPage.jsx · SignUpPage.jsx
│  ├─ IndexingPage.jsx      # tabs + tile + history + account
│  └─ BillingPage.jsx       # placeholder for later
firestore.rules
```

## 6. Requirement → code map

- **Default not_done / always-visible "Tap to update" / one-way + `done_by`** →
  `BillTile.jsx` + `useBills.markDone` + `firestore.rules`.
- **User registered in Firebase** → `hooks/useSyncUser.js`.
- **Monthly auto-create** → `lib/bills.js:ensureCurrentMonthBills`, called from
  `ProtectedLayout` once Firebase is ready.
- **Current record shown** → `useBills.current[tab]` on `IndexingPage`.
- **History by date** → `IndexingHistory` + `useBills.months` / `billsByMonth`.
- **Navbar (hamburger mobile / inline desktop)** → `Navbar.jsx`.

## 7. Notes

- `tel:547` dials from a real phone, not a desktop tab.
- If a whole month passes with zero logins, that month's records are created on
  the next login (client-side ensure). Fine for normal use.
- Malagasy strings were drafted quickly — worth a native review.
