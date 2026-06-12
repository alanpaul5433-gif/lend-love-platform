# CLAUDE.md

This file provides guidance to Claude Code when working with the Lend Love™ project.

---

## Project Overview

**Lend Love™** is a peer-to-peer (P2P) lending platform supporting **money loans and item loans** between individuals. The platform consists of three connected systems:

1. **Mobile User App** (React Native + Expo) — iOS & Android
2. **Web Admin Panel** (Next.js 14) — internal operations
3. **Backend Platform** (Firebase Cloud Functions) — API + business logic

Both Loaners (lenders) and Borrowers use the **same mobile app and account**. A user can lend AND borrow simultaneously.

---

## 🚨 STORE COMPLIANCE — FIRST-CLASS REQUIREMENT

**Every line of code, every screen, every API must be built to comply with Apple App Store and Google Play Store policies. The target is approval on the FIRST submission attempt.**

P2P lending apps are heavily scrutinized. Retrofitting compliance after rejection costs 1–4 weeks per attempt. **Read [docs/store-compliance.md](docs/store-compliance.md) before building any user-facing feature.**

### Non-Negotiable Compliance Rules

1. **Account deletion** — In-app + web-based (`/delete-account`). Required by both Apple and Google.
2. **Privacy Policy + Terms of Service** — Hosted at `lendlovellc.com/privacy` + `lendlovellc.com/terms`. Linked from sign-up.
3. **Age verification (18+)** — Checkbox + DOB validation on registration.
4. **APR caps** — Backend enforces ≤36% (configurable per region) per Google's Personal Loan Policy.
5. **Loan term minimums** — Reject loans requiring repayment in <60 days (Google policy).
6. **TILA disclosures** — Every agreement PDF must show APR, finance charge, total of payments, schedule.
7. **AML disclosure** — Shown before KYC starts.
8. **Report + Block** — On all user-generated content (chat, profiles, listings).
9. **Permission justification** — Every iOS `NSUsageDescription` + Android permission documented.
10. **No misleading terms** — Never call loans "credits", "tokens", "coins" (Apple may flag as digital currency).
11. **No Apple IAP / Google Play Billing** — P2P money transfers via Paykings only.
12. **Demo account for reviewers** — Auto-populated, pre-verified.
13. **Crash-free rate > 99.5%** — Sentry + Crashlytics monitoring active before every submission.
14. **Accurate Privacy Labels + Data Safety Form** — Must match real data collection.
15. **Target Android API 34+, iOS 15+** — Required minimum.

When in doubt, default to the **more restrictive** of Apple's or Google's policies.

---

## Repository Structure (Monorepo)

```
Lend Love/
├── user-app/                 # React Native mobile app (Expo)
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── theme/
│   │   ├── hooks/
│   │   ├── services/         # Firebase, ID Analyzer, Paykings clients
│   │   ├── store/            # Zustand state
│   │   └── utils/
│   ├── app.json
│   └── package.json
│
├── admin-panel/              # Next.js 14 web app
│   ├── app/                  # App Router
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── package.json
│
├── backend/                  # Firebase Cloud Functions
│   ├── functions/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── loans/
│   │   │   ├── agreements/
│   │   │   ├── kyc/          # ID Analyzer integration
│   │   │   ├── payments/     # Paykings integration
│   │   │   ├── chat/         # Stream Chat
│   │   │   ├── notifications/
│   │   │   └── admin/
│   │   └── package.json
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   ├── storage.rules
│   └── firebase.json
│
├── shared/                   # Shared types & utils
│   ├── types/                # TypeScript shared types
│   └── constants/
│
├── docs/
│   ├── architecture.md
│   └── api.md
│
├── Loaner UI/                # Original mobile screen mockups
├── Borrower UI/              # Original mobile screen mockups
├── .claude/
│   └── agents/               # Specialized sub-agents
├── CLAUDE.md                 # This file
└── Lend Love - Project Document.pdf
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile** | React Native (Expo SDK 51+) + TypeScript |
| **Admin Web** | Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| **Backend** | Firebase Cloud Functions (Node.js 20 + TypeScript) |
| **Database** | Firestore |
| **Auth** | Firebase Authentication |
| **Storage** | Firebase Storage |
| **State (mobile)** | Zustand + TanStack Query |
| **State (web)** | TanStack Query + Zustand |
| **Forms** | React Hook Form + Zod |
| **Navigation** | React Navigation 6 |
| **Charts (mobile)** | Victory Native |
| **Charts (web)** | Recharts |
| **Chat** | Stream Chat |
| **KYC** | ID Analyzer (DocuPass WebView) |
| **Payments** | Paykings + NMI Gateway |
| **Email** | SendGrid |
| **SMS** | Twilio |
| **Push** | Firebase Cloud Messaging |
| **Monitoring** | Sentry + Firebase Crashlytics |
| **Analytics** | Firebase Analytics + Mixpanel |

---

## Brand & Theme

### Colors (Tailwind + Theme Tokens)

| Token | Hex | Use |
|---|---|---|
| `primary` (Lend Green) | `#3D9A2E` | Buttons, success, links |
| `primary-light` | `#5DBF3F` | Hover, gradient top |
| `primary-dark` | `#236E16` | Pressed state |
| `secondary` (Gold) | `#F5A800` | Request Loan, highlights |
| `danger` (Heart Red) | `#D32F2F` | Overdue, alerts |

### Theme Support
- **Dark mode (default)** matches the original UI mockups
- **Light mode** also supported
- Toggle in Account Settings → follows OS preference by default

---

## Coding Conventions

### TypeScript
- **Strict mode ON** in all packages
- All shared types live in `shared/types/`
- Avoid `any` — use `unknown` if truly unknown
- Use `zod` schemas for runtime validation at all API boundaries

### File Naming
- React Native screens: `PascalCase.tsx` (e.g., `HomeScreen.tsx`)
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` / `*.test.tsx`

### Component Style
- **Functional components only** — no class components
- **Named exports preferred** for components
- **One component per file** (with co-located styles)
- **Keep components under 200 lines** — split if larger

### State Management
- **Local state** → `useState`
- **Server state** → TanStack Query
- **Global UI state** → Zustand (small, focused stores)
- **Never put server data in Zustand** — TanStack Query owns the cache

### Firestore Queries
- Always use `where` + `orderBy` with proper indexes (defined in `firestore.indexes.json`)
- Paginate with `startAfter()` — never fetch unbounded lists
- Use real-time listeners (`onSnapshot`) only on screens that need them; unsubscribe on unmount

### Cloud Functions
- One folder per domain (`loans/`, `kyc/`, `payments/`, etc.)
- Each function: `export const functionName = functions.https.onCall(...)`
- All inputs validated with `zod` before processing
- All errors thrown as `HttpsError` with proper codes
- Secrets accessed via Firebase config: `functions.config().paykings.api_key`

### Security
- **Never** put third-party API keys in mobile or web client
- All payment/KYC calls go through Cloud Functions
- Firestore Security Rules deny by default — opt-in per collection
- Admin operations require custom claim `role: admin`
- 2FA mandatory for admin panel

---

## Common Commands

### Mobile App
```bash
cd user-app
npm install
npm run start              # Expo dev server
npm run ios                # Run on iOS simulator
npm run android            # Run on Android emulator
npm run lint
npm run typecheck
npm test                   # Jest unit tests
npm run e2e:ios            # Detox E2E
eas build --platform ios   # Production iOS build
eas build --platform android
eas submit                 # Submit to stores
```

### Admin Panel
```bash
cd admin-panel
npm install
npm run dev                # localhost:3000
npm run build
npm run lint
npm run typecheck
npm test                   # Vitest unit tests
npx playwright test        # E2E tests
```

### Backend (Firebase)
```bash
cd backend/functions
npm install
npm run build              # Compile TS
npm run serve              # Local emulator
npm run deploy             # Deploy to Firebase
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase emulators:start   # All emulators
```

### Repo-wide
```bash
npm run lint               # All packages
npm run typecheck          # All packages
npm test                   # All tests
```

---

## Environment Variables

### Mobile App (`user-app/.env`)
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_STREAM_CHAT_KEY=
EXPO_PUBLIC_SENTRY_DSN=
```

### Admin Panel (`admin-panel/.env.local`)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ...
NEXT_PUBLIC_SENTRY_DSN=
```

### Backend (Firebase Functions Config)
```
firebase functions:config:set \
  idanalyzer.api_key="..." \
  paykings.api_key="..." \
  paykings.gateway_id="..." \
  sendgrid.api_key="..." \
  twilio.account_sid="..." \
  twilio.auth_token="..." \
  stream.api_key="..." \
  stream.api_secret="..."
```

---

## Sub-Agents (in `.claude/agents/`)

| Agent | Phase / Purpose |
|---|---|
| `frontend-engineer` | Mobile + admin UI development |
| `backend-engineer` | Cloud Functions, Firestore, security rules |
| `integrations-engineer` | Paykings, ID Analyzer, Stream Chat, SendGrid, Twilio |
| `qa-engineer` | Unit, integration, E2E testing |
| `devops-engineer` | CI/CD, deployments, monitoring, app store releases |

Use these for specialized, deep work on each domain. Each agent has full context on its scope.

---

## Key Files to Read First (When Onboarding)

1. `CLAUDE.md` — this file
2. `docs/architecture.md` — system architecture
3. `Lend Love - Project Document.md` — full project plan
4. `shared/types/index.ts` — domain models
5. `backend/firestore.rules` — security model

---

## Workflow Rules

### When Adding a New Feature
1. Define types in `shared/types/`
2. Add zod schema for validation
3. Implement Cloud Function (backend)
4. Update Firestore Security Rules if needed
5. Add client service (`services/`)
6. Build UI screens
7. Write tests (unit + E2E if user-facing)
8. Update relevant docs

### When Modifying Database Schema
1. Update `shared/types/`
2. Update Firestore Security Rules
3. Add/update indexes in `firestore.indexes.json`
4. Create migration script if needed
5. Update admin panel views

### Before Committing
- Run `npm run lint` + `npm run typecheck` in affected packages
- Run relevant tests
- Update CHANGELOG.md for user-visible changes

### Pull Request Checklist
- [ ] Tests pass
- [ ] Lint + typecheck clean
- [ ] No secrets in code
- [ ] Firestore rules tested if modified
- [ ] Screenshots for UI changes
- [ ] Breaking changes documented

---

## Domain Concepts (Quick Reference)

| Concept | Definition |
|---|---|
| **Loan** | An agreement to lend money or an item with defined terms |
| **Loaner** | Person providing the loan |
| **Borrower** | Person receiving the loan |
| **Money Loan** | Cash loan with optional interest + installments |
| **Item Loan** | Physical item loan with return date + optional deposit |
| **Marketplace** | Public listing of available loans + open requests |
| **Loan Request** | Borrower-initiated post seeking a loaner |
| **Agreement** | PDF contract with both parties' signatures |
| **KYC** | Identity verification flow via ID Analyzer |
| **Rolling Reserve** | Funds held by Paykings as chargeback protection |

---

## Don'ts

- ❌ Don't put API keys in client code
- ❌ Don't bypass Cloud Functions for payment/KYC calls
- ❌ Don't fetch unbounded Firestore queries
- ❌ Don't store PII without encryption
- ❌ Don't skip Firestore Security Rules tests
- ❌ Don't use `any` in TypeScript
- ❌ Don't commit `.env` files
- ❌ Don't disable lint/typecheck to merge
- ❌ Don't add new third-party services without security review
- ❌ Don't skip the store-compliance checklist before submission
- ❌ Don't use Apple In-App Purchase or Google Play Billing for loans
- ❌ Don't call loans "credits", "tokens", "coins", or any digital-currency-like term
- ❌ Don't allow account creation without age verification (18+)
- ❌ Don't ship UGC features (chat, listings) without report + block
- ❌ Don't request permissions without a clear usage description

---

*Last updated: 2026-05-11*
