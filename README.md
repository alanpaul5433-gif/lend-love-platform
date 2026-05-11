# Lend Love™

Peer-to-peer lending platform supporting money and item loans, with a mobile user app, web admin panel, and Firebase backend.

> See [CLAUDE.md](CLAUDE.md) for development guidance, [docs/architecture.md](docs/architecture.md) for technical design, [docs/store-compliance.md](docs/store-compliance.md) for App Store + Play Store policies, and [Lend Love - Project Document.pdf](Lend%20Love%20-%20Project%20Document.pdf) for the full stakeholder document.

---

## Demo Mode

The application currently runs in **DEMO MODE** on Firebase Spark (free) plan. Paid integrations (Paykings, ID Analyzer, Stream Chat, SendGrid, Twilio) are mocked so the entire feature set is testable without billing.

Two pre-populated guest accounts let stakeholders evaluate every feature:
- **Continue as Guest Loaner** — verified user with 2 completed loans, 1 active money loan, 1 active item loan
- **Continue as Guest Borrower** — verified user with 1 borrowed loan + transactions + chat

When the client approves go-live, flip `demoMode: false` in `user-app/app.json`, upgrade Firebase to Blaze, and wire in the real integrations.

---

## Repository Structure

```
Lend Love/
├── user-app/         # React Native + Expo (iOS + Android)
├── admin-panel/      # Next.js 14 admin dashboard
├── backend/          # Firebase Cloud Functions + Firestore rules
│   ├── functions/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── storage.rules
├── shared/           # Shared types, Zod schemas, theme tokens
├── docs/             # Architecture + compliance docs
├── .claude/          # Specialized AI agents for development
├── firebase.json
└── package.json      # npm workspaces root
```

---

## Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm 10+** (comes with Node 20)
- **Firebase CLI**: `npm i -g firebase-tools` (already done if you're using the Firebase MCP)
- **Expo CLI**: included as a devDependency in `user-app/`
- A Google account with access to the `lend-love` Firebase project

---

## First-Time Setup

```bash
# Install all workspaces
npm install

# Verify Firebase CLI is logged in
firebase login

# Confirm active project
firebase use lend-love
```

Firestore Security Rules and indexes are already deployed.

---

## Running the Apps

### Mobile User App (Expo)

```bash
npm run mobile
```

Then either:
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Scan the QR code with **Expo Go** on a physical device

### Admin Panel (Next.js)

```bash
npm run admin
```

Open http://localhost:3000

### Firebase Emulators (optional for local dev)

```bash
npm run emulators
```

Opens at http://localhost:4000 (Emulator UI).

---

## What's Built

### ✅ Phase 0 — Foundation (Complete)
- Monorepo with shared types, Zod schemas, theme tokens
- Firebase project (`lend-love`) — Auth, Firestore, Storage enabled
- Firestore Security Rules + indexes deployed
- Cloud Functions skeleton (createLoan, deleteAccount, setRole, onCreateUser)
- Mobile app: Welcome / Sign Up + 5-tab navigation + Home + Profile
- Admin panel: Landing + Dashboard skeleton
- Demo seed: realistic data for Guest Loaner + Guest Borrower
- Store-compliance scaffolding: APR cap, term floor, age check in Zod schemas

### 🔜 Phase 1 — Up Next
- Marketplace screens (Money / Items / Requests tabs)
- Create Loan flow (money + item forms)
- Draft Agreement + e-Sign canvas + PDF preview
- Chat (Firestore-based for demo)
- KYC mock flow

---

## Brand Colors

| Token | Hex | Purpose |
|---|---|---|
| Lend Green | `#3D9A2E` | Primary actions |
| Lime Green | `#5DBF3F` | Highlights |
| Forest | `#236E16` | Pressed states |
| Lend Gold | `#F5A800` | Secondary actions |
| Heart Red | `#D32F2F` | Alerts, overdue |

Dark mode is the default; light mode supported and toggleable from Account Settings.

---

## Firebase Project Details

- **Project ID:** `lend-love`
- **Region:** `nam5` (US multi-region)
- **Plan:** Spark (free) — Blaze upgrade required before production launch
- **Bundle ID:** `com.lendlove.app`
- **Web App ID:** `1:523440774704:web:91b5bf75348ec84e5e97f5`

---

## Workflows for AI-assisted Development

Specialized agents live in `.claude/agents/`:

| Agent | When to use |
|---|---|
| `frontend-engineer` | Mobile UI or admin panel pages |
| `backend-engineer` | Cloud Functions, Firestore rules, schema |
| `integrations-engineer` | Paykings, ID Analyzer, Stream Chat, SendGrid, Twilio |
| `qa-engineer` | Unit, integration, E2E tests, compliance tests |
| `devops-engineer` | CI/CD, EAS builds, app store submissions |

Invoke any with: *"Use the X agent to do Y."*

---

## License

Proprietary © 2026 Lend Love™. All rights reserved.
