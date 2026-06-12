# Legal Documents

This folder contains template legal documents for the Lend Love™ platform.

## Files

| File | Purpose | Required URL |
|---|---|---|
| `privacy-policy.md` | Privacy Policy | `lendlovellc.com/privacy` |
| `terms-of-service.md` | Terms of Service | `lendlovellc.com/terms` |

---

## ⚠️ Legal Review Required Before Publishing

These documents are **starting templates** drafted to satisfy:

- **Apple App Store** Guideline 5.1.1 (Privacy)
- **Google Play** Personal Loan Policy + Data Safety requirements
- **GDPR** (EU/UK) and **CCPA/CPRA** (California)
- **TILA** (Truth in Lending Act)
- **GLBA** (Gramm-Leach-Bliley Act)
- **Bank Secrecy Act / USA PATRIOT Act** (AML/KYC)

**They are NOT legal advice.** Before publishing, you must have a **licensed fintech attorney** review and customize them for:

1. **Your business structure** — corporation, LLC, jurisdiction
2. **Your state lending licenses** — required in most US states for consumer-lending facilitation
3. **State-specific addendums** — California, New York, Texas, Massachusetts each have unique requirements
4. **Your governing law and arbitration venue**
5. **The specific third-party providers you actually use** at launch
6. **Any business-to-business loans** (if you support them)
7. **Cross-border issues** if you operate outside the United States

Budget approximately **$1,500–$3,000** for a proper attorney review. Try fintech-specialized firms or platforms like:

- Stripe Atlas Legal
- Clerky
- Cooley
- Wilson Sonsini
- Local fintech-focused boutique firms

---

## Placeholders to Fill Before Publishing

Both documents contain placeholders in `[BRACKETS]` that must be replaced:

- `[DATE TO BE INSERTED]` — effective and last-updated dates
- `[STREET ADDRESS TO BE INSERTED]` — legal business address
- `[CITY, STATE, ZIP CODE]` — same
- `[COUNTRY]` — country of incorporation
- `[STATE TO BE INSERTED, e.g., Delaware]` — governing-law state
- `[CITY, STATE TO BE INSERTED]` — arbitration venue
- `[YEAR]` — copyright year
- `[JURISDICTION TO BE INSERTED]` — primary place of business
- `[TO BE INSERTED IF REQUIRED]` — EU representative (if applicable)

---

## Publishing Workflow

1. Have attorney review and customize the templates
2. Fill in placeholders with real values
3. Convert to HTML for the landing page (Markdown renders cleanly via tools like `markdown-it`, `marked`, or static site generators)
4. Host at `lendlovellc.com/privacy` and `lendlovellc.com/terms`
5. Ensure both URLs are publicly accessible (no login wall, no geo-block)
6. Update the URLs in `shared/src/constants.ts` if they differ
7. Test the in-app `Help & Support` screen — the links should open correctly
8. Submit URLs in App Store Connect and Google Play Console during app submission

---

## Why These URLs Matter for Store Submission

| Required | Where |
|---|---|
| Privacy Policy URL | Linked from sign-up screen, Settings → About, App Store metadata, Play Console |
| Terms of Service URL | Linked from sign-up screen, Settings → About |
| Account Deletion URL | Submitted in Play Console (Apple wants in-app deletion only) |

Without these public URLs hosted and reachable, **both stores will reject the app**.

---

## When You Update the Documents

After material changes:

1. Update the "Last Updated" date in the document
2. Provide in-app notice to users (e.g., a banner on next sign-in)
3. For GDPR/CCPA users, re-obtain consent for any new processing purpose
4. Archive previous versions for compliance audit (we recommend a versioned `/privacy/v2025-01-15` URL structure or similar)

---

*Last updated: 2026-05-12*
