# Lend Love™ — App Store Compliance Guide

**Goal: Approval on the first submission attempt for both Apple App Store and Google Play Store.**

This document is the **single source of truth** for store compliance. Every engineer (frontend, backend, integrations, QA, devops) must read this before building user-facing features.

---

## Core Principle

> Build for compliance from Day 1. Retrofitting compliance after a rejection costs 1–4 weeks per attempt.

P2P lending apps are **heavily scrutinized** by both stores. We treat every screen, permission, and piece of copy as if a reviewer is examining it under a microscope — because they are.

---

## 1. Apple App Store — Critical Requirements

### 1.1 Account Deletion (Guideline 5.1.1(v)) — MANDATORY

Apple **will reject** any app that lets users create an account but does not let them delete it in-app.

**Implementation:**
- A clearly labeled **"Delete Account"** option in `Profile → Account Settings`
- Two-step confirmation (must explain what data is deleted)
- Deletion must:
  - Delete user record from Firestore
  - Delete KYC documents from Storage
  - Anonymize signed loan agreements (legal retention)
  - Cancel any active subscriptions / auto-pay
  - Sign out from all devices
- Must complete within 30 days
- Provide a web-based deletion path too (`lendlove.com/delete-account`)

### 1.2 Privacy Policy (Guideline 5.1.1) — MANDATORY

- Hosted URL (e.g., `lendlove.com/privacy`)
- Linked from:
  - App Store metadata
  - Sign-up screen (before account creation)
  - Settings → About → Privacy Policy
- Must accurately describe ALL data collected (matches Privacy Nutrition Label)

### 1.3 Privacy Nutrition Labels (App Privacy Section)

Declare every data type the app collects. For Lend Love:

| Data Type | Collected | Linked to User | Used for Tracking |
|---|---|---|---|
| Contact Info (email, phone, name) | ✅ | ✅ | ❌ |
| Financial Info (loan history) | ✅ | ✅ | ❌ |
| Identifiers (User ID) | ✅ | ✅ | ❌ |
| Government IDs (KYC) | ✅ | ✅ | ❌ |
| Sensitive Info (biometrics) | ❌ (only device-local) | — | — |
| Usage Data | ✅ | ✅ | ❌ |
| Diagnostics | ✅ | ❌ | ❌ |
| Location | ❌ | — | — |

**Update labels whenever data collection changes** — mismatches = rejection.

### 1.4 Demo Account for Reviewers — MANDATORY for Lending Apps

App Store Connect submission must include:
- Demo email: `applereviewer@lendlove.com`
- Password: provided in submission notes
- Pre-loaded with verified KYC status + sample loans
- Demo notes: "Demo accounts allow testing without real KYC. Use Continue as Guest Loaner / Borrower from the welcome screen."

### 1.5 Sign in with Apple (Guideline 4.8) — REQUIRED if any social login is offered

We use email/password + guest demo. **If we later add Google Sign-In or Facebook Login, Sign in with Apple becomes mandatory.**

For MVP: not required. Document this for future planning.

### 1.6 Currency & Payment Rules

**P2P loans between users are NOT digital goods.** Therefore:
- ✅ Do NOT use Apple's In-App Purchase
- ✅ Use Paykings/NMI for real money transfers (legal)
- ⚠️ NEVER call loans "credits", "tokens", "coins" — Apple will misclassify as digital currency

### 1.7 User-Generated Content (Guideline 1.2) — for Chat + Listings

Lend Love has chat and user-created listings. Apple requires:
- ✅ A method to filter objectionable content
- ✅ Block / report users functionality (in Chat + Profile)
- ✅ Ability for user to block another user
- ✅ Published moderation guidelines
- ✅ Admin response within 24 hours to flagged content

### 1.8 Permissions — Minimize and Justify

Each permission needs a clear `NSUsageDescription` in `Info.plist`:

| Permission | When We Use It | Description Text |
|---|---|---|
| Camera | KYC selfie | "Lend Love uses the camera to verify your identity during the KYC process." |
| Photo Library | Upload proof of address | "Lend Love accesses your photos to upload documents for identity verification." |
| Face ID | Biometric login | "Lend Love uses Face ID to securely log you in." |
| Push Notifications | Loan + chat updates | "Lend Love sends notifications about your loans, payments, and messages." |
| Microphone | NOT USED — do not request |

### 1.9 App Tracking Transparency (ATT)

We do NOT track users across other apps/websites.
- ✅ Privacy Nutrition Label: "Not Used for Tracking"
- ✅ No ATT prompt needed
- ⚠️ If we later add Mixpanel + cross-device tracking, ATT prompt becomes required

### 1.10 Financial App Specifics (Guideline 5.0)

Apple requires lending apps to:
- ✅ Comply with all local financial regulations
- ✅ Display APR clearly (TILA)
- ✅ Have business legitimacy (LLC, EIN documented)
- ✅ Not engage in predatory lending practices
- ✅ Provide complete terms before user commits

### 1.11 Crash-Free Threshold

Apple monitors crashes via TestFlight + production. We need:
- ✅ Crash-free user rate > 99.5%
- ✅ Sentry + Crashlytics monitoring active before submission
- ✅ No critical crashes in last 50 sessions of TestFlight

### 1.12 Metadata (Title, Description, Screenshots)

- Title: **"Lend Love"** (no superlatives, no spam keywords)
- Subtitle: Clear value prop, no all-caps
- Description: ≤4000 chars, focused on user benefits
- Keywords: relevant only, no competitor names
- Screenshots: real UI (not marketing mockups), latest devices, all required sizes
- Preview video: optional but recommended

---

## 2. Google Play Store — Critical Requirements

### 2.1 Personal Loan Policy — STRICT for Lending Apps

Google Play has a dedicated **Personal Loans Policy** under Financial Services. We must:

**Required disclosures in app + Play Store listing:**

| Disclosure | Where |
|---|---|
| **Minimum and maximum APR** | App Store listing + in-app loan terms |
| **Repayment period (min / max)** | Same |
| **Representative example** | Show: principal, APR, total cost, repayment schedule |
| **Fees** | All fees disclosed before user commits |
| **Lender legal name + address** | Visible in app + listing |
| **Privacy practices link** | Privacy policy URL |
| **Contact info** | Email + physical address |

### 2.2 Forbidden Practices Under Personal Loan Policy

Google REJECTS apps that:
- ❌ Have APR > 36% per year (in many jurisdictions)
- ❌ Require repayment in full within 60 days (single-payment loans)
- ❌ Use deceptive language to hide fees
- ❌ Lack clear repayment schedules

> Our platform must enforce these caps in the Create Loan flow — interest rate cap configurable per region in admin panel.

### 2.3 Data Safety Form — MANDATORY

Google Play Console requires a complete Data Safety form:

| Section | Lend Love Answer |
|---|---|
| Data collected | Email, phone, name, address, government ID, financial info, photos (KYC) |
| Data shared with third parties | KYC data shared with ID Analyzer; payment data with Paykings |
| Data security practices | Encryption in transit (TLS), encryption at rest (Firebase default + KMS for KYC) |
| User can request deletion | Yes — in-app + web |
| Independent security review | Yes (annually) |

**Mismatches with actual behavior = rejection.**

### 2.4 Account Deletion — REQUIRED

Same as Apple. Google added this requirement in 2024.
- ✅ In-app deletion path
- ✅ Web-based deletion URL submitted in Play Console
- ✅ Confirms what data is deleted

### 2.5 Permissions — Justify Each One

For every permission, prepare a written justification for Google. Same list as Apple (Section 1.8).

Notable for Android:
- **REQUEST_INSTALL_PACKAGES**: NOT USED
- **QUERY_ALL_PACKAGES**: NOT USED
- **MANAGE_EXTERNAL_STORAGE**: NOT USED
- **SYSTEM_ALERT_WINDOW**: NOT USED

If we request any of these, expect rejection.

### 2.6 Target API Level

- Must target **Android API 34+** (Android 14) or higher at time of submission
- EAS Build auto-handles this with up-to-date Expo SDK
- 64-bit architecture (auto with React Native + Hermes)

### 2.7 Content Rating Questionnaire

Complete in Play Console:
- No violence, sexual content, gambling
- User-generated content: YES (chat) — must declare moderation
- Likely rating: **Everyone** or **Teen**

### 2.8 Test Account Credentials

Same as Apple — Play Console requires demo account info during submission.

### 2.9 App Bundle Format

- Required: `.aab` (Android App Bundle), not `.apk`
- EAS Build outputs `.aab` by default for production

### 2.10 Pre-Launch Report

Play Console automatically runs your app on real devices and flags:
- Crashes
- ANRs (App Not Responding)
- Accessibility issues
- Security vulnerabilities

**Must be clean before submission.**

---

## 3. Shared Compliance — Affects Both Stores

### 3.1 KYC + AML Disclosures

Add to onboarding (before user starts KYC):
> "To comply with anti-money laundering regulations, we verify your identity using a trusted third party (ID Analyzer). Your documents are encrypted and used only for identity verification."

### 3.2 Loan Agreement Disclosures (TILA Compliance)

Every generated loan agreement PDF must include:
- ✅ Annual Percentage Rate (APR)
- ✅ Finance charge
- ✅ Amount financed
- ✅ Total of payments
- ✅ Payment schedule
- ✅ Late payment fees
- ✅ Prepayment terms
- ✅ Security interest (if collateral)

### 3.3 Age Restrictions

- Minimum age: **18** (legal contract requirement in most jurisdictions)
- Add age verification on sign-up: "I am 18 years or older" checkbox
- Reject sign-ups with birthdate <18

### 3.4 Reporting & Blocking (User-Generated Content)

In chat AND on profile screens:
- ✅ Report button on every message
- ✅ Report button on user profiles
- ✅ Block user functionality (mutual hiding of content)
- ✅ Reported content removed from view within 24 hours
- ✅ Admin queue in admin panel for review

### 3.5 Terms of Service Acceptance

- Required checkbox on sign-up: "I agree to Terms of Service and Privacy Policy"
- Links open in WebView or system browser
- Store acceptance timestamp + ToS version in user document

### 3.6 In-App Subscription / Payment

We do NOT use Apple IAP or Google Play Billing. Our payments are:
- **Real money transfers** between users via Paykings (legal — not digital goods)
- **No subscription model** in MVP

If we add a premium feature later, evaluate carefully — physical lending services are exempt from store billing.

### 3.7 Children's Privacy (COPPA / Family Designation)

- App is **NOT** for users under 18
- Must NOT be listed as a family app
- Block sign-ups under 18

---

## 4. Implementation Checklist by Engineer

### Frontend Engineer

- [ ] Account deletion screen with two-step confirmation in `Account Settings`
- [ ] Privacy Policy link on sign-up + in settings
- [ ] Terms of Service acceptance checkbox on sign-up
- [ ] Age verification checkbox on sign-up
- [ ] Report user button on profile + chat messages
- [ ] Block user functionality
- [ ] APR display on every loan card and creation form
- [ ] AML disclosure before KYC starts
- [ ] Permission descriptions in `Info.plist` (iOS) + `AndroidManifest.xml`
- [ ] No use of words "credits", "tokens", "coins" anywhere
- [ ] No subscription / IAP code
- [ ] TILA-compliant agreement display
- [ ] Crash handling — never crash on bad data
- [ ] Sign in with Apple ready (if social logins added)

### Backend Engineer

- [ ] `users/deleteAccount` Cloud Function (cascade delete + anonymize)
- [ ] `users/checkAge` validation on registration
- [ ] APR enforcement in `loans/create` (configurable cap per region)
- [ ] Loan term limit enforcement (no <60-day single-payment loans by default)
- [ ] Anonymization preservation for legally required retention (loan records)
- [ ] Reporting/blocking endpoints
- [ ] Audit logging for all admin moderation actions
- [ ] Webhook for chat moderation flags

### Integrations Engineer

- [ ] ID Analyzer privacy URL added
- [ ] Paykings disclosure in payment screens
- [ ] Stream Chat: block list sync
- [ ] SendGrid: account-deletion confirmation email
- [ ] Sentry: PII redaction confirmed

### QA Engineer

- [ ] E2E test: full account deletion flow
- [ ] E2E test: age verification rejection (< 18)
- [ ] E2E test: APR cap enforcement
- [ ] E2E test: report user → admin sees in queue
- [ ] E2E test: block user → content hidden
- [ ] Pre-submission smoke test on physical iOS + Android devices
- [ ] Crash-free run for ≥7 days in TestFlight before submission
- [ ] Accessibility audit (TalkBack + VoiceOver)
- [ ] Permission flow test (deny + allow paths)

### DevOps Engineer

- [ ] Privacy Policy hosted at `lendlove.com/privacy`
- [ ] Terms of Service hosted at `lendlove.com/terms`
- [ ] Account deletion web page at `lendlove.com/delete-account`
- [ ] App Store Connect: full metadata, screenshots, demo account
- [ ] Play Console: Data Safety form complete + accurate
- [ ] Play Console: Personal Loan policy disclosures complete
- [ ] Privacy Nutrition Labels accurate in App Store Connect
- [ ] Target Android API 34+
- [ ] iOS minimum: iOS 15+
- [ ] Sentry source maps uploaded for crash readability
- [ ] Pre-launch report from Play Console reviewed + clean
- [ ] TestFlight beta build approved before App Store submission

---

## 5. Pre-Submission Checklist (Run before EVERY release)

### Common
- [ ] All compliance tests pass
- [ ] No console errors or warnings in production build
- [ ] Crash-free rate > 99.5%
- [ ] Privacy Policy + ToS URLs working
- [ ] Account deletion verified end-to-end
- [ ] Demo accounts populated with sample data
- [ ] No "debug" or "test" strings visible to users
- [ ] All permissions have clear justification
- [ ] All third-party SDKs disclosed in privacy docs

### Apple-Specific
- [ ] Demo credentials in App Store Connect submission notes
- [ ] Screenshots updated (all required sizes)
- [ ] Privacy Nutrition Labels accurate
- [ ] App icon meets specifications (no transparency, 1024×1024)
- [ ] All NSUsageDescription strings present
- [ ] No private APIs used
- [ ] No reference to other platforms (no "Android" mentions)

### Google-Specific
- [ ] Data Safety form complete + matches reality
- [ ] Personal Loan disclosures complete
- [ ] Target API 34+
- [ ] Bundle (.aab) signed correctly
- [ ] Pre-launch report green
- [ ] Content rating questionnaire complete
- [ ] All screenshots in required sizes

---

## 6. Common Rejection Reasons (and how we avoid them)

| Rejection Reason | Our Mitigation |
|---|---|
| **Missing account deletion** | Built into MVP from Day 1 |
| **Inaccurate privacy labels** | QA verifies on every release |
| **Inadequate Personal Loan disclosures** | Required fields in admin config + agreement template |
| **Demo account credentials missing** | Auto-populated each submission via DevOps checklist |
| **Crashes on review device** | TestFlight + pre-launch report must be clean |
| **Misleading metadata** | All copy reviewed by PM before submission |
| **Permission used but not justified** | Every permission documented with usage string |
| **Lacking moderation for UGC** | Report + block built into chat + profile |
| **Age verification missing** | Mandatory checkbox on sign-up + DOB check |
| **Loan APR > 36%** | Backend enforces cap; admin can configure |

---

## 7. Post-Submission Monitoring

After submission:
- ⏳ Apple: typical review time 24–72 hours
- ⏳ Google: typical review time 24–72 hours (longer for first submission, often 7 days for lending)
- ✅ Monitor App Store Connect / Play Console for messages
- ✅ Reply to reviewer questions within 24 hours
- ✅ If rejected: do NOT auto-resubmit. Read feedback, fix root cause, document in `docs/runbooks/store-rejections.md`

---

## 8. Required Legal Pages (Public Web)

| URL | Purpose |
|---|---|
| `lendlove.com/privacy` | Privacy Policy |
| `lendlove.com/terms` | Terms of Service |
| `lendlove.com/delete-account` | Web-based account deletion |
| `lendlove.com/support` | Contact + help |
| `lendlove.com/lending-disclosures` | TILA + APR + state-specific disclosures |

All must be:
- Publicly accessible (no login)
- Mobile-friendly
- Available before app submission

---

## 9. Owner Sign-Offs Before Submission

Each release requires sign-off from:

| Role | Confirms |
|---|---|
| **PM** | Metadata + screenshots accurate |
| **Frontend Engineer** | All UI compliance items present |
| **Backend Engineer** | Account deletion + APR enforcement working |
| **Integrations Engineer** | All providers' privacy URLs current |
| **QA Engineer** | Full compliance test suite passing |
| **DevOps Engineer** | Demo accounts ready + pre-launch report clean |

---

*Document owner: Compliance / Engineering*
*Last reviewed: 2026-05-11*
*Update cadence: monthly + on every store policy update*
