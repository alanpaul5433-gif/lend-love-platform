# Lend Love™
## Project Documentation for Stakeholders

---

**Document Version:** 1.0
**Date:** May 11, 2026
**Prepared For:** Client / Stakeholder
**Project:** Lend Love™ — Peer-to-Peer Lending Platform

---

## Table of Contents

1. Executive Summary
2. Project Vision
3. What We Are Building
4. User Mobile App — Features & Screens
5. Web Admin Panel — Features & Modules
6. Brand & Design System
7. Technology Stack
8. Third-Party Services
9. Project Timeline & Phases
10. Team Structure
11. Deliverables
12. Investment Breakdown
13. Compliance & Legal Considerations
14. Risk Management
15. Post-Launch Support
16. Next Steps

---

## 1. Executive Summary

**Lend Love™** is a peer-to-peer (P2P) lending mobile platform that allows individuals to lend or borrow **money and physical items** between trusted parties. The platform combines the warmth of personal lending with the structure and safety of a digital financial service — backed by identity verification, legally formatted agreements, and secure payment processing.

### Project at a Glance

| Item | Detail |
|---|---|
| **Platform Type** | Peer-to-Peer Lending (Money + Items) |
| **Deliverables** | 1. Mobile User App (iOS + Android) <br> 2. Web-based Admin Panel <br> 3. Backend Infrastructure |
| **Total Duration** | 14–16 weeks (3.5–4 months) |
| **Target Launch** | September 2026 |
| **Team Size** | 6 professionals |

### Key Differentiators

- Supports **both money and physical item lending** in one app
- **Built-in legal agreements** with e-signature
- **Secure identity verification** for all users
- **In-app chat** for transparent negotiation
- **Analytics and tracking** for both lenders and borrowers
- **Comprehensive admin controls** for safety and oversight
- **Built for first-attempt approval** on both Apple App Store and Google Play Store

---

## 2. Project Vision

> *"Make lending personal again — with the safety, structure, and trust of modern technology."*

Lend Love bridges the gap between **informal lending** (friends and family) and **formal financial services** (banks). It empowers people to help each other while protecting both parties with verified identities, signed agreements, and a managed platform.

### Target Users

| Segment | Use Case |
|---|---|
| **Friends & Family** | Formalize personal loans with proper agreements |
| **Community Lenders** | Lend money or items within a trusted network |
| **Borrowers** | Access flexible loans without traditional bank red tape |
| **Item Lenders** | Lend out tools, cameras, equipment with deposit protection |

---

## 3. What We Are Building

### Three Connected Systems

```
┌──────────────────────┐   ┌──────────────────────┐
│   USER MOBILE APP    │   │   WEB ADMIN PANEL    │
│   (iOS & Android)    │   │  (For Operations)    │
└──────────┬───────────┘   └──────────┬───────────┘
           │                          │
           └─────────────┬────────────┘
                         ↓
              ┌──────────────────────┐
              │   BACKEND PLATFORM   │
              │  (Cloud + Database)  │
              └──────────────────────┘
```

| Component | For Whom | Purpose |
|---|---|---|
| **Mobile User App** | End users (Lenders & Borrowers) | Day-to-day lending activity |
| **Admin Panel** | Internal operations team | Manage users, loans, compliance, support |
| **Backend Platform** | Powers both | Stores data, processes business logic, integrates services |

---

## 4. User Mobile App — Features & Screens

The mobile app is the heart of Lend Love. It works for both **Loaners** (people lending) and **Borrowers** (people borrowing) — using the same app and same account, since any user can do both.

### 4.1 Authentication & Onboarding

| Screen | What It Does |
|---|---|
| **Welcome / Login** | Sign in with email and password |
| **Sign Up** | Create new account with email verification |
| **Forgot Password** | Password recovery via email |
| **Guest Demo Mode** | Try the app as Guest Loaner or Guest Borrower |
| **Biometric Login** | Use FaceID or fingerprint for quick access |

### 4.2 Home Dashboard

- Personalized welcome message
- Quick statistics: Completed loans, User rating, Overdue items
- **Two Quick Actions** — Create Loan or Request Loan
- List of currently active loans
- Notification bell with badge

### 4.3 Marketplace (3 Tabs)

| Tab | Content |
|---|---|
| **Money** | Browse money loans available from other users |
| **Items** | Browse items available to borrow |
| **Requests** | See loan requests posted by borrowers |

Each listing shows the amount, terms, due date, and full description. Users can apply, contact the other party, or proceed to draft an agreement.

### 4.4 Create Loan Flow

Loaners can publish two types of loans:

**Money Loan**
- Loan amount
- Interest rate
- Number of installments
- Payment frequency (monthly, weekly)
- Due date
- Notes

**Item Loan**
- Item title and description
- Condition (New, Good, Fair)
- Refundable deposit (optional)
- Replacement value
- Return date
- Special notes

### 4.5 Request Loan Flow

Borrowers can post loan requests that loaners can fulfill:
- Amount needed
- Purpose
- Repayment term
- Optional collateral
- Needed-by date

### 4.6 Agreement & E-Signature

A digital, legally formatted loan agreement is generated for every loan:
- **Draft Agreement** — Fill in terms
- **Preview & e-Sign** — Review the formatted PDF
- **Signature canvas** — Draw signature on screen
- **Print and Share** — Save or send the PDF
- All agreements stored permanently in the user's history

### 4.7 My Loans

Two tabs to track everything:
- **Lending** — Loans the user is providing
- **Borrowing** — Loans the user has taken

Each loan shows status, terms, due dates, and payment history.

### 4.8 In-App Chat

- Real-time messaging between loaner and borrower
- Share documents and PDFs
- Push notifications for new messages
- Conversation history per loan

### 4.9 Identity Verification (KYC)

Three-step verification process powered by ID Analyzer:
1. **Government ID upload** (Driver's license or passport)
2. **Selfie capture** (Face match with ID)
3. **Proof of address** (Utility bill or bank statement)

Once approved, users get a **Verified** badge on their profile.

### 4.10 Analytics

Personal financial insights:
- Total Lent
- Total Borrowed
- Active Loans count
- Overdue count
- Cashflow chart (last 6 transactions)
- Loan Types donut chart (Money vs Items)

### 4.11 Transaction History

Chronological list of all financial activity — disbursements, repayments, fees.

### 4.12 Profile & Settings

- Profile with rating, reviews, and verified badge
- Personal information (phone, address, birthday, occupation)
- Account Settings (editable info)
- Preferences (notifications, biometrics, theme)
- Help & Support
- Secure logout

### 4.13 Payments (Powered by Paykings)

- Add bank account or credit card
- Make repayments
- Set up auto-pay for installments
- View payment confirmations
- Payment notifications

---

## 5. Web Admin Panel — Features & Modules

The admin panel is a **web-based control center** for internal operations. Different team members get different access levels.

### 5.1 Admin Roles

| Role | Access Level |
|---|---|
| **Super Admin** | Full access to everything |
| **Operations** | KYC reviews, support, user management |
| **Finance** | Payments, settlements, financial reports |
| **Support** | User help, chat moderation |

All admin accounts require **two-factor authentication**.

### 5.2 Dashboard

A high-level snapshot:
- Total registered users
- Active loans (count and dollar value)
- Overdue loans
- Daily / weekly / monthly disbursements
- Platform revenue
- Default rate percentage
- User growth chart
- Loan volume chart

### 5.3 User Management

- Searchable user database
- Filter by verification status, role, activity, signup date
- Detailed user profile view
- View linked loans, transactions, chats, login history
- Actions: verify, suspend, ban, reset password, send messages
- Export user lists

### 5.4 KYC Review Queue

- Pending identity verifications
- View uploaded documents side-by-side
- ID Analyzer confidence score and AML screening results
- Manual approve / reject with reason
- Audit log of every decision

### 5.5 Loan Management

- Master list of all loans on the platform
- Filter by type, status, date, amount
- View signed agreements and payment schedules
- Admin actions: force cancel, mark overdue, trigger reminders
- Add internal notes

### 5.6 Marketplace Moderation

- Monitor all marketplace listings
- Review user-flagged listings
- Remove fraudulent or inappropriate content
- Auto-flagging for suspicious patterns

### 5.7 Transaction & Payment Management

- All payment activity in one place
- Failed payment recovery
- Chargeback dispute tracking
- Refund processing
- Reconciliation with Paykings settlement reports
- Rolling reserve tracker

### 5.8 Agreements Management

- All signed loan agreements
- Search by ID or party name
- Download or re-send PDFs
- Manage legal templates (Terms & Conditions)

### 5.9 Chat Moderation

- Review reported conversations
- Keyword alerts (fraud, threats, off-platform payments)
- Suspend chat privileges
- User warnings

### 5.10 Support Tickets

- All Help & Support requests from users
- Assign tickets to team members
- Reply via in-app or email
- Track ticket status
- Manage FAQ content

### 5.11 Reports & Analytics

Pre-built reports:
- Monthly Active Users
- Loan origination report
- Revenue and platform fees
- Default rate by user cohort
- Top loaners and borrowers
- KYC funnel analysis

All reports can be filtered by custom date ranges and exported to CSV or PDF.

### 5.12 Notifications & Announcements

- Send broadcast push notifications to selected user groups
- Send targeted email campaigns
- Display in-app banner announcements
- Manage message templates

### 5.13 Platform Configuration

Centralized control over:
- Minimum / maximum loan amounts
- Interest rate caps (by location)
- Platform fee percentages
- Late fee defaults
- Email and SMS templates
- Third-party API keys
- Feature flags (turn features on/off without redeploy)

### 5.14 Audit Log

Every admin action is recorded:
- Who did what, when, from which IP
- Before/after values
- Immutable record for compliance

### 5.15 Compliance Center

- AML/PEP flagged users
- Suspicious activity reports
- GDPR/CCPA data deletion requests
- Regulatory report generation

---

## 6. Brand & Design System

### 6.1 Logo
The Lend Love™ logo combines a **green cursive "Lend"** with bold **golden "LOVE"** featuring a red heart-and-dollar symbol. The heart-dollar mark serves as the app icon.

### 6.2 Color Palette

| Color | Hex | Used For |
|---|---|---|
| **Lend Green** | #3D9A2E | Primary buttons, success, links |
| **Lime Green** | #5DBF3F | Highlights, gradients |
| **Forest Green** | #236E16 | Pressed states |
| **Lend Gold** | #F5A800 | Secondary actions, highlights |
| **Heart Red** | #D32F2F | Alerts, overdue, danger |

### 6.3 Theme Support

The app supports **both Dark Mode and Light Mode** — switchable from Account Settings. Default follows the device's system preference.

### 6.4 Design Principles

| Quality | Expression |
|---|---|
| **Trustworthy** | Deep greens, clean typography, clear data |
| **Warm/Human** | Heart motif, gold accents, friendly copy |
| **Premium** | Generous spacing, polished cards |
| **Financial** | Tabular numbers, status badges |

---

## 7. Technology Stack

We are using **modern, industry-standard technologies** chosen for reliability, scalability, and developer ecosystem support.

| Layer | Technology | Why |
|---|---|---|
| **Mobile App** | React Native + TypeScript | Build for iOS + Android with one codebase |
| **Admin Panel** | Next.js + React + Tailwind CSS | Fast, modern web framework |
| **Backend** | Firebase (Google Cloud) | Reliable, scalable, secure infrastructure |
| **Database** | Firestore | Real-time data sync, scales to millions of users |
| **File Storage** | Firebase Storage | Secure document and image storage |
| **Authentication** | Firebase Auth | Industry-standard secure login |
| **Hosting** | Vercel (admin panel) | Fast, global delivery |
| **CI/CD** | GitHub Actions | Automated testing and deployment |

---

## 8. Third-Party Services

Lend Love integrates with carefully selected partners for specialized functions:

### 8.1 Identity Verification — ID Analyzer

- **Service:** Document scan + selfie + address verification
- **Why:** Covers 10,000+ document types across 190+ countries
- **Cost:** $89/month (Entry plan, 1,000 verifications)
- **Compliance:** ISO 27001, GDPR, CCPA certified

### 8.2 Payment Processing — Paykings

- **Service:** High-risk merchant account + payment gateway
- **Why:** Specializes in lending/fintech (Stripe rejects P2P lending)
- **Cost:** Negotiated rates, typically 3–5% transaction fee + monthly account fee
- **Handles:** Card payments, ACH bank transfers, chargebacks

### 8.3 Real-Time Chat — Stream Chat

- **Service:** In-app messaging infrastructure
- **Cost:** Free up to 100 monthly active users; ~$499/month at scale

### 8.4 Email Delivery — SendGrid

- **Service:** Transactional emails (signups, password resets, agreement confirmations)
- **Cost:** Free up to 100 emails/day; scales with volume

### 8.5 SMS / OTP — Twilio

- **Service:** Phone verification, optional 2FA
- **Cost:** Pay-per-message (~$0.0075 per SMS in US)

### 8.6 Push Notifications — Firebase Cloud Messaging

- **Service:** App notifications for loan updates, messages, reminders
- **Cost:** Free

### 8.7 Error Monitoring — Sentry

- **Service:** Catches and reports app crashes / errors
- **Cost:** Free tier sufficient initially; $26/month at scale

### 8.8 Analytics — Firebase Analytics + Mixpanel

- **Service:** User behavior tracking, funnels, retention
- **Cost:** Free tier sufficient initially

---

## 9. Project Timeline & Phases

### Total Duration: 14–16 weeks

```
Phase 0:  Discovery & Setup           Week 1
Phase 1:  Foundation                  Weeks 2-3
Phase 2:  Core User Features          Weeks 4-6
Phase 3:  Agreements & Chat           Weeks 7-8
Phase 4:  KYC, Analytics & Polish     Weeks 9-10
Phase 5:  Admin Panel Build-out       Weeks 9-11 (parallel)
Phase 6:  Payments Integration        Weeks 11-12
Phase 7:  QA & Beta Testing           Weeks 13-14
Phase 8:  Launch                      Weeks 15-16
```

### Detailed Phase Breakdown

| Phase | Weeks | Key Deliverables |
|---|---|---|
| **0 — Discovery** | 1 | Project setup, Firebase config, design system, Paykings application |
| **1 — Foundation** | 2–3 | Authentication, theming, navigation, admin login |
| **2 — Core Features** | 4–6 | Home, Marketplace, Create Loan, My Loans, Profile |
| **3 — Agreements** | 7–8 | Draft Agreement, e-Sign, PDF generation, Chat |
| **4 — KYC & Analytics** | 9–10 | Identity verification, Analytics charts, History |
| **5 — Admin Panel** | 9–11 | Full admin panel (built in parallel) |
| **6 — Payments** | 11–12 | Paykings integration, repayment flows |
| **7 — Testing** | 13–14 | QA, beta release, security audit |
| **8 — Launch** | 15–16 | App Store + Play Store submission, Admin Panel deployment |

### Key Milestones

| Milestone | Target Date |
|---|---|
| Project Kickoff | Week 1 |
| First Demo (Auth + Navigation) | Week 3 |
| Beta Release | Week 14 |
| Production Launch | Week 16 |

---

## 10. Team Structure

| Role | Headcount | Responsibility |
|---|---|---|
| **Project Manager** | 1 | Coordination, client communication, delivery |
| **UI/UX Designer** | 1 | Design system, mobile screens, admin panel UX |
| **Mobile Developers** | 2 | React Native development for iOS/Android |
| **Frontend Developer** | 1 | Next.js admin panel |
| **Backend Developer** | 1 | Firebase, integrations, security |
| **QA Engineer** | 1 (part-time) | Manual + automated testing |

**Total Team:** 6 people (5.5 FTE)

---

## 11. Deliverables

### Mobile App
- Full source code with documentation
- iOS build (App Store ready)
- Android build (Play Store ready)
- App Store assets (icons, screenshots, descriptions)
- TestFlight + Firebase App Distribution test builds

### Admin Panel
- Full source code with documentation
- Deployed on Vercel (staging + production)
- Custom domain configuration

### Backend
- Firebase Cloud Functions source
- Database schema and indexes
- API documentation (Postman collection)
- Security rules

### Documentation
- End-user guide (for app users)
- Admin operations manual
- Developer handover document
- Architecture diagrams
- Deployment runbooks

### Legal & Compliance Artifacts
- Privacy Policy
- Terms of Service
- Loan agreement legal template
- Cookie policy

### Post-Launch
- 2 weeks of post-launch support
- Bug fixes from beta feedback
- Performance monitoring setup

---

## 12. Investment Breakdown

### One-Time Costs

| Item | Estimated Cost |
|---|---|
| **Development team (16 weeks)** | $40,000 – $120,000 (offshore) <br> $150,000 – $300,000 (onshore) |
| **Apple Developer Account** | $99/year |
| **Google Play Console** | $25 one-time |
| **Fintech Lawyer (compliance)** | $2,000 – $5,000 |
| **Initial Domain + SSL** | $50 |

### Recurring Monthly Costs (Post-Launch)

| Service | Monthly Cost |
|---|---|
| Firebase (production) | $0 – $200 early; scales with users |
| ID Analyzer (Entry plan) | $89 |
| Paykings monthly fee | $25 – $99 |
| Stream Chat | $0 free tier; $499 at 100+ MAU |
| SendGrid + Twilio | $50 – $200 |
| Sentry + Mixpanel | $0 – $100 |
| Vercel (admin panel) | $20 |
| **Estimated Total** | **$200 – $1,200/month** |

### Transaction-Based Costs

| Item | Rate |
|---|---|
| Paykings card processing | 3.5% – 5.5% + $0.25 per transaction |
| Paykings ACH processing | 0.5% – 1.5% per transaction |
| Chargeback fees | $25 – $50 per dispute |
| Rolling reserve (held by Paykings) | 5–10% of revenue held for 180 days |

---

## 13. Compliance & Legal Considerations

### 13.0 App Store & Play Store Compliance — First-Attempt Approval Strategy

The app is engineered from Day 1 to comply with both **Apple App Store** and **Google Play Store** policies, with the explicit goal of **approval on the first submission attempt**. P2P lending apps are heavily scrutinized, so this is a first-class engineering concern, not an afterthought.

#### Built-In Compliance Features

| Requirement | How We Address It |
|---|---|
| **In-app account deletion** | Two-step deletion in Account Settings — required by both stores (Apple G5.1.1(v), Google 2024 policy) |
| **Web-based account deletion** | Hosted at `lendlove.com/delete-account` — Google requirement |
| **Privacy Policy + Terms of Service** | Hosted, linked from sign-up + Settings |
| **Age verification (18+)** | Mandatory checkbox + DOB validation on registration |
| **APR cap enforcement (≤36%)** | Backend rejects loans exceeding regional cap per Google's Personal Loan Policy |
| **Loan term floor (≥60 days)** | Backend rejects single-payment loans <60 days per Google policy |
| **TILA disclosures** | Every agreement PDF includes APR, finance charge, total payments, schedule, late fees |
| **AML / KYC disclosure** | Shown before user starts KYC process |
| **Report + Block on UGC** | Available on chat messages and user profiles |
| **Permission justifications** | Every iOS `NSUsageDescription` + Android permission documented |
| **No misleading currency terms** | Strict ban on "credits", "tokens", "coins" in loan context |
| **No App Store IAP / Play Billing** | P2P real-money transfers via Paykings only |
| **Privacy Nutrition Labels** | Accurate declarations of all data collection |
| **Data Safety Form (Google)** | Complete, matches reality, updated on every release |
| **Crash-free rate > 99.5%** | Monitored via Sentry + Crashlytics before each submission |
| **Demo account for reviewers** | Pre-populated guest account included in every submission |

#### Submission Strategy

1. **Submit to Google Play first** (longer review for lending — often 7+ days)
2. **Submit to App Store second** (typically 24–72 hour review)
3. Full pre-submission compliance test suite runs in CI before either submission
4. Engineering team on standby for 7 days post-submission to respond to reviewer questions

#### Compliance Documentation

A comprehensive compliance guide (`docs/store-compliance.md`) is maintained internally, covering:
- Apple-specific requirements (account deletion, privacy labels, demo accounts, etc.)
- Google-specific requirements (Personal Loan Policy disclosures, Data Safety form, etc.)
- Per-engineer checklists (frontend, backend, integrations, QA, devops)
- Pre-submission and post-submission checklists
- Rejection recovery playbook

---

### 13.1 Lending Regulations

P2P lending is a regulated activity. Depending on the operating regions:

| Requirement | Notes |
|---|---|
| **State Lending Licenses (US)** | Most US states require a Consumer Finance License |
| **Truth in Lending Act (TILA)** | APR must be disclosed on every loan |
| **Fair Credit Reporting Act (FCRA)** | If credit checks are performed |
| **Anti-Money Laundering (AML)** | KYC + transaction monitoring (built-in) |
| **GLBA / CCPA / GDPR** | Financial data and privacy regulations |

**Recommendation:** Engage a fintech lawyer in Phase 0 to identify required licenses for the launch markets. Estimated cost: $2,000–$5,000.

### 13.2 Stripe Rejection — Why Paykings

Stripe and most mainstream processors **reject P2P lending platforms** because they classify it as "money transmission" — a regulated category they don't underwrite. **Paykings is the appropriate alternative** as they specialize in high-risk merchant categories including lending.

### 13.3 Data Protection

- All sensitive data encrypted in transit and at rest
- KYC documents stored securely with access logs
- Right to delete (GDPR/CCPA compliance built-in)
- Audit logs for all administrative actions

---

## 14. Risk Management

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Paykings approval delay** | High | Build payments as a pluggable layer; launch core app first |
| **App Store rejection** | High | Pre-submission review; clear legal documentation |
| **Lending license requirements** | High | Engage fintech lawyer in Week 1 |
| **KYC false rejections** | Medium | Manual review queue in admin panel as backup |
| **Scope creep** | Medium | Formal change request process via PM |
| **Chargeback fraud** | Medium | Chat keyword monitoring + admin fraud detection |
| **Cost overruns (Firebase)** | Low | Budget alerts + query optimization |

---

## 15. Post-Launch Support

### Included in Project (Weeks 17–18)

- 2 weeks of dedicated post-launch support
- Critical bug fixes
- Performance monitoring and optimization
- User feedback collection and triage

### Ongoing Support Options (after Week 18)

| Tier | Hours/Month | Best For |
|---|---|---|
| **Maintenance** | 20 hrs | Bug fixes, minor updates |
| **Growth** | 40 hrs | New features + maintenance |
| **Premium** | 80+ hrs | Active development + scaling |

Specific support contracts to be negotiated separately.

---

## 16. Next Steps

### Immediate Actions (Week 1)

| # | Action | Responsible |
|---|---|---|
| 1 | Final scope approval and document sign-off | Client |
| 2 | Sign development agreement | Both |
| 3 | Apply for Paykings merchant account | Client + PM |
| 4 | Apply for ID Analyzer account | PM |
| 5 | Engage fintech lawyer for compliance review | Client |
| 6 | Apple Developer + Google Play accounts created | Client |
| 7 | Domain name registration (lendlove.com or similar) | Client |
| 8 | Kickoff meeting scheduled | PM |

### What We Need from the Client

- Business entity details (LLC/Corporation)
- EIN / Tax ID
- 3 months of business bank statements (for Paykings)
- Business plan or use case description
- Brand assets (high-resolution logo, brand guidelines if any)
- Target launch market(s) — required for licensing
- Designated point of contact for ongoing decisions

---

## Approval & Sign-Off

**Stakeholder Acknowledgment:**

By signing below, the stakeholder confirms:
- The features and scope outlined in this document have been reviewed
- The timeline and milestones are accepted
- The investment structure is understood and approved
- Authorization to proceed to Phase 0 (Discovery & Setup)

| Role | Name | Signature | Date |
|---|---|---|---|
| **Client / Stakeholder** | _____________________ | _____________________ | __________ |
| **Project Manager** | _____________________ | _____________________ | __________ |

---

## Appendix A — Application Screen Inventory

### User App Screens (~18 unique screens)

1. Welcome / Login
2. Sign Up
3. Forgot Password
4. Home Dashboard
5. Marketplace — Money tab
6. Marketplace — Items tab
7. Marketplace — Requests tab
8. Create Loan — Money form
9. Create Loan — Item form
10. Request Loan form
11. Draft Agreement
12. Preview & e-Sign
13. My Loans — Lending tab
14. My Loans — Borrowing tab
15. Chat / Messages list
16. Chat conversation view
17. Profile
18. Account Settings
19. Analytics
20. Transaction History
21. Agreements list
22. KYC Verification
23. Help & Support

### Admin Panel Modules (~15 modules)

1. Admin Login & Roles
2. Dashboard Overview
3. User Management
4. KYC Review Queue
5. Loan Management
6. Marketplace Moderation
7. Transaction Management
8. Agreements Management
9. Chat Moderation
10. Support Tickets
11. Reports & Analytics
12. Notifications & Announcements
13. Platform Configuration
14. Audit Log
15. Compliance Center

---

## Appendix B — Glossary

| Term | Definition |
|---|---|
| **P2P Lending** | Peer-to-peer lending — direct lending between individuals without a bank |
| **KYC** | Know Your Customer — identity verification process |
| **AML** | Anti-Money Laundering — financial crime prevention checks |
| **PEP** | Politically Exposed Person — screened for compliance |
| **ACH** | Automated Clearing House — US bank-to-bank transfer system |
| **APR** | Annual Percentage Rate — annualized cost of a loan |
| **Chargeback** | A reversed payment initiated by the cardholder's bank |
| **Rolling Reserve** | Funds held back by a payment processor as protection |
| **TILA** | Truth in Lending Act — US law requiring loan term disclosure |
| **FCM** | Firebase Cloud Messaging — push notification service |
| **SDK** | Software Development Kit — pre-built integration tools |

---

**End of Document**

*Lend Love™ — Project Documentation v1.0*
*Confidential — For Stakeholder Review Only*
