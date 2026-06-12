/**
 * Generates clean DOCX files for Privacy Policy and Terms of Service.
 * Output: legal/Lend-Love-Privacy-Policy.docx, legal/Lend-Love-Terms-of-Service.docx
 *
 * These are designed to be easy for developers to copy/paste into web pages.
 * Placeholders are highlighted in RED so they stand out for replacement.
 */
const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  ExternalHyperlink,
  Header,
  Footer,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  BorderStyle,
} = require('docx');

// ---------------- Helpers ----------------

const PLACEHOLDER_RE = /\[([^\]]+)\]/g;

function richRuns(text, baseProps = {}) {
  // Split text on [PLACEHOLDERS] and ** bold **
  const runs = [];
  let last = 0;
  const tokens = [];
  let m;
  // First find placeholders
  PLACEHOLDER_RE.lastIndex = 0;
  while ((m = PLACEHOLDER_RE.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type: 'text', value: text.slice(last, m.index) });
    tokens.push({ type: 'placeholder', value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });

  // Now split each text token by **bold**
  const final = [];
  for (const tok of tokens) {
    if (tok.type !== 'text') {
      final.push(tok);
      continue;
    }
    let str = tok.value;
    const re = /\*\*([^*]+)\*\*/g;
    let l = 0, mm;
    while ((mm = re.exec(str)) !== null) {
      if (mm.index > l) final.push({ type: 'text', value: str.slice(l, mm.index) });
      final.push({ type: 'bold', value: mm[1] });
      l = mm.index + mm[0].length;
    }
    if (l < str.length) final.push({ type: 'text', value: str.slice(l) });
  }

  for (const tok of final) {
    if (tok.type === 'placeholder') {
      runs.push(
        new TextRun({ ...baseProps, text: tok.value, color: 'C00000', bold: true })
      );
    } else if (tok.type === 'bold') {
      runs.push(new TextRun({ ...baseProps, text: tok.value, bold: true }));
    } else {
      runs.push(new TextRun({ ...baseProps, text: tok.value }));
    }
  }
  return runs;
}

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 280 },
    alignment: AlignmentType.JUSTIFIED,
    ...opts,
    children: richRuns(text, opts.run ?? {}),
  });
}

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true })],
  });
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true })],
  });
}

function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true })],
  });
}

function Bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 80 },
    children: richRuns(text),
  });
}

function HR() {
  return new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999', space: 6 },
    },
    spacing: { before: 200, after: 200 },
    children: [new TextRun('')],
  });
}

function Callout(text) {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    shading: { type: ShadingType.CLEAR, fill: 'FFF8E1' },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'F5A800' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'F5A800' },
      left: { style: BorderStyle.SINGLE, size: 24, color: 'F5A800' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'F5A800' },
    },
    children: richRuns(text, { italics: true }),
  });
}

const COMMON_DOC = {
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } }, // 11pt
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 32, bold: true, font: 'Calibri', color: '1F2937' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 26, bold: true, font: 'Calibri', color: '236E16' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 22, bold: true, font: 'Calibri', color: '1F2937' },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
};

function pageProps() {
  return {
    page: {
      size: { width: 12240, height: 15840 }, // US Letter
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
    },
  };
}

function pageHeaderFooter(title) {
  return {
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'Lend Love™ ', bold: true, color: '236E16' }),
              new TextRun({ text: `— ${title}`, color: '6B7280' }),
            ],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 8, color: '3D9A2E', space: 4 },
            },
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Page ', size: 18, color: '6B7280' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '6B7280' }),
              new TextRun({ text: ' of ', size: 18, color: '6B7280' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '6B7280' }),
            ],
          }),
        ],
      }),
    },
  };
}

function coverParagraphs(title, subtitle) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 4000, after: 240 },
      children: [
        new TextRun({ text: 'Lend Love', size: 80, bold: true, color: '5DBF3F', font: 'Brush Script MT' }),
        new TextRun({ text: '™', size: 24, color: '9CA3AF', superScript: true }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'L', size: 60, bold: true, color: 'F5A800' }),
        new TextRun({ text: '♥', size: 60, bold: true, color: 'D32F2F' }),
        new TextRun({ text: 'VE', size: 60, bold: true, color: 'F5A800' }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [
        new TextRun({
          text: 'Peer-to-Peer Lending — Made Personal, Made Safe',
          italics: true,
          size: 24,
          color: '236E16',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 12, color: '3D9A2E', space: 12 },
      },
      children: [
        new TextRun({ text: title.toUpperCase(), size: 52, bold: true, color: '1F2937' }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: subtitle, size: 22, color: '6B7280' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200 },
      children: [
        new TextRun({
          text: '⚠ TEMPLATE — Replace red [PLACEHOLDERS] before publishing.',
          size: 18,
          color: 'C00000',
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80 },
      children: [
        new TextRun({
          text: 'Have a fintech attorney review before going live.',
          size: 18,
          color: '6B7280',
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: '', break: 1 })],
      pageBreakBefore: true,
    }),
  ];
}

// ===================== PRIVACY POLICY =====================

function buildPrivacyPolicy() {
  const content = [
    ...coverParagraphs('Privacy Policy', `Document Version 1.0  •  Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`),

    H1('Privacy Policy'),
    P('**Effective Date:** [DATE TO BE INSERTED]'),
    P('**Last Updated:** [DATE TO BE INSERTED]'),
    HR(),

    H2('1. Introduction'),
    P('Lend Love, Inc. ("Lend Love," "we," "us," or "our") operates the Lend Love™ peer-to-peer lending platform (the "Service"), including our mobile applications, websites, and related services. This Privacy Policy explains how we collect, use, share, and protect personal information when you use the Service.'),
    P('By using the Service, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use the Service.'),
    P('This Privacy Policy is incorporated by reference into our Terms of Service available at https://lendlovellc.com/terms.'),

    H2('2. Information We Collect'),
    P('We collect information in three categories.'),
    H3('2.1 Information You Provide'),
    Bullet('**Account information:** full name, email address, phone number, password (hashed).'),
    Bullet('**Verification information (KYC):** date of birth, home address, occupation, government-issued ID (driver license, passport), selfie photo, and proof of address (utility bill, bank statement).'),
    Bullet('**Financial information:** bank account or card details (handled and tokenized by our payment processor — we never store raw card or bank numbers), loan amounts, interest rates, repayment history.'),
    Bullet('**User-generated content:** loan listings, loan requests, agreement terms, chat messages, signatures, profile photos, reviews.'),
    Bullet('**Communications:** emails, support tickets, in-app messages, and chat history.'),

    H3('2.2 Information We Collect Automatically'),
    Bullet('**Device information:** device model, operating system version, unique device identifiers.'),
    Bullet('**Usage data:** screens visited, features used, taps, scroll behavior, session duration, crash reports.'),
    Bullet('**Approximate location:** derived from IP address (not precise GPS unless you explicitly grant location permission).'),
    Bullet('**Network data:** IP address, browser type, language preferences, time zone.'),
    Bullet('**Cookies and similar technologies** as described in Section 9.'),

    H3('2.3 Information from Third Parties'),
    Bullet('**Identity-verification provider (ID Analyzer):** document authenticity checks, biometric face match, AML/PEP screening results.'),
    Bullet('**Payment processor (Paykings):** tokenized payment method data, transaction status, chargeback information.'),
    Bullet('**Push-notification services (Firebase Cloud Messaging):** device push tokens.'),
    Bullet('**Analytics providers (Firebase Analytics, Mixpanel):** aggregated usage events.'),

    H2('3. How We Use Your Information'),
    P('We use personal information to:'),
    Bullet('Provide, operate, and maintain the Service.'),
    Bullet('Verify your identity and comply with anti-money-laundering (AML), know-your-customer (KYC), and counter-terrorism financing obligations.'),
    Bullet('Process loan disbursements and repayments through our payment processor.'),
    Bullet('Facilitate communication between lenders and borrowers.'),
    Bullet('Generate Truth-in-Lending Act (TILA) compliant loan agreements.'),
    Bullet('Detect, prevent, and investigate fraud, money laundering, unauthorized access, and other illegal activity.'),
    Bullet('Send transactional emails (loan reminders, agreement notifications, security alerts).'),
    Bullet('Provide customer support.'),
    Bullet('Improve and personalize the Service.'),
    Bullet('Comply with legal obligations and respond to lawful requests.'),
    Bullet('Enforce our Terms of Service.'),
    P('We do not sell your personal information to third parties.'),

    H2('4. Legal Basis for Processing (EU / UK Users)'),
    P('Where the EU General Data Protection Regulation ("GDPR") or UK GDPR applies, we process personal information on the following legal bases: performance of contract for providing the Service; legal obligation for KYC, AML, and regulatory compliance; legitimate interests for fraud prevention, security, and platform improvement; consent for marketing communications and for processing biometric and government-ID data.'),

    H2('5. How We Share Information'),
    H3('5.1 With Other Users'),
    Bullet('Your public profile (name, rating, verified status, completed loan count) is visible to other users you transact with.'),
    Bullet('Signed loan agreements include both parties\' names and contact information for the purpose of the loan.'),
    Bullet('Chat messages are visible to participants of the conversation.'),

    H3('5.2 With Service Providers'),
    P('We work with the following third-party providers, each contractually required to protect your information: **Firebase (Google LLC)** for authentication, database, hosting, and push notifications; **ID Analyzer** for identity verification; **Paykings + NMI Gateway** for payment processing; **Stream Chat** for in-app messaging in production; **SendGrid (Twilio Inc.)** for transactional email; **Twilio** for SMS, OTP, and phone verification; **Sentry** for error monitoring and crash reporting (PII-scrubbed); **Mixpanel** for aggregated product analytics.'),

    H3('5.3 With Authorities and for Legal Reasons'),
    P('We may disclose information to government agencies, regulators, or law-enforcement authorities when required by law, subpoena, or court order; to comply with our regulatory obligations including reporting suspicious activity under the Bank Secrecy Act; to protect our rights, property, or safety, or that of our users or the public; and to investigate, prevent, or take action regarding fraud or other illegal activity.'),

    H3('5.4 In Business Transfers'),
    P('If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or use.'),

    H2('6. Data Retention'),
    P('We retain personal information only as long as needed to provide the Service or as required by law. Account profiles are retained while the account is active plus 30 days after deletion. Loan records are retained for **7 years** after loan closure (US lending recordkeeping requirement). Signed loan agreements are retained for 7 years with the name redacted upon account deletion. KYC documents are retained for **5 years** after account closure under the AML Bank Secrecy Act. Transaction logs are retained for 7 years for tax and audit purposes. Chat messages are retained while the account is active plus 90 days. Support tickets are retained for 3 years. Audit logs of administrative actions are retained for 7 years for compliance. Server and device logs are retained for 90 days. After the retention period, we securely delete or anonymize the information.'),

    H2('7. Security'),
    P('We implement reasonable administrative, technical, and physical safeguards including: encryption in transit via TLS 1.3; encryption at rest for sensitive data (KYC documents stored with Google Cloud KMS); access controls restricting employee access to personal information on a need-to-know basis; mandatory two-factor authentication for all administrative accounts; regular security audits and vulnerability scanning; tokenization of payment data so raw card numbers never touch our servers; and audit logging of all administrative actions. No method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.'),

    H2('8. Cookies and Tracking Technologies'),
    P('Our Service uses cookies and similar technologies in browsers and SDK identifiers in mobile apps to keep you signed in, remember your preferences (theme, language), analyze how the Service is used so we can improve it, and detect fraud and security threats. We do not use cookies for third-party advertising or behavioral profiling across other websites. You can control cookies through your browser settings, but disabling them may limit functionality.'),

    H2('9. Your Rights and Choices'),
    H3('9.1 All Users'),
    Bullet('**Access** — request a copy of the personal information we hold about you.'),
    Bullet('**Correction** — update inaccurate or incomplete information directly in your account settings.'),
    Bullet('**Deletion** — delete your account from within the app (Profile → Account Settings → Delete Account) or via the web at https://lendlovellc.com/delete-account.'),
    Bullet('**Withdraw consent** — where processing is based on consent, you may withdraw it at any time.'),

    H3('9.2 European Economic Area / UK Residents (GDPR)'),
    P('In addition to the above rights, you may request portability (receive your data in a machine-readable format), restriction (limit how we process your data), object to processing based on legitimate interests, and lodge a complaint with your local data-protection authority.'),

    H3('9.3 California Residents (CCPA / CPRA)'),
    P('You have the right to know what categories of personal information we collect and how it is used and shared, request deletion (subject to legal retention requirements), opt out of the sale or sharing of personal information (we do not sell personal information), limit the use of sensitive personal information, and exercise these rights without discrimination.'),
    P('To exercise any of these rights, contact us at support@lendlovellc.com. We may need to verify your identity before fulfilling certain requests.'),

    H3('9.4 Account Deletion — What Gets Deleted vs. Retained'),
    P('When you delete your account, we **delete** your profile information (name, email, phone, address), KYC documents (after the 5-year AML retention period), profile photos and signatures, saved payment methods (tokens revoked with payment processor), push notification tokens, and chat message contents. We **retain (anonymized)** loan records (required by federal lending law for 7 years), signed agreements with your name redacted (required for audit), and transaction history (required for tax and regulatory reporting). This balance allows us to honor your right to deletion while complying with mandatory recordkeeping obligations.'),

    H2('10. Children\'s Privacy'),
    P('The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from anyone under 18. If you believe we have collected information from someone under 18, please contact us at support@lendlovellc.com and we will delete it promptly.'),

    H2('11. Third-Party Links and Services'),
    P('Our Service may contain links to third-party websites, products, or services we do not control. Those services have their own privacy policies, and we are not responsible for their practices.'),

    H2('12. Notice of Financial-Information Practices (Gramm-Leach-Bliley Act)'),
    P('As a financial-services platform, we are subject to the Gramm-Leach-Bliley Act ("GLBA"). We collect and share nonpublic personal information only as described in this Privacy Policy and only as permitted by GLBA. You have the right to opt out of certain sharing, though most of our sharing falls under permitted exceptions for processing transactions, regulatory compliance, and security.'),

    H2('13. Updates to This Privacy Policy'),
    P('We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last Updated" date at the top of this document, provide notice through the app or by email if the change is significant, and obtain your consent if required by law. Your continued use of the Service after the effective date of an updated Privacy Policy constitutes your acceptance of the changes.'),

    H2('14. Contact Us'),
    P('If you have questions about this Privacy Policy or our data practices, please contact us:'),
    P('**Lend Love, Inc.**'),
    P('Support: support@lendlovellc.com'),
    P('Web: https://lendlovellc.com'),

    HR(),
    P('© [YEAR] Lend Love, Inc. All rights reserved. Lend Love™ is a trademark of Lend Love, Inc.'),
  ];

  return new Document({
    ...COMMON_DOC,
    sections: [
      {
        properties: pageProps(),
        ...pageHeaderFooter('Privacy Policy'),
        children: content,
      },
    ],
  });
}

// ===================== TERMS OF SERVICE =====================

function buildTermsOfService() {
  const content = [
    ...coverParagraphs('Terms of Service', `Document Version 1.0  •  Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`),

    H1('Terms of Service'),
    P('**Effective Date:** [DATE TO BE INSERTED]'),
    P('**Last Updated:** [DATE TO BE INSERTED]'),
    HR(),

    H2('Important Notices Before You Use the Service'),
    Callout('ARBITRATION NOTICE. These Terms contain a mandatory arbitration clause and class-action waiver (Section 20). By using the Service, you agree to resolve disputes through individual arbitration rather than in court, and you waive your right to participate in class actions.'),
    Callout('NOT A LENDER. Lend Love is a technology platform that facilitates peer-to-peer loan transactions between consenting users. Lend Love is NOT a bank, lender, or borrower. We are not a party to any loan.'),
    Callout('18+ ONLY. You must be at least 18 years of age to use the Service.'),

    H2('1. Acceptance of Terms'),
    P('These Terms of Service ("Terms") form a binding agreement between you ("you" or "User") and Lend Love, Inc. ("Lend Love," "we," "us," or "our") governing your access to and use of our mobile applications, websites, and related services (collectively, the "Service").'),
    P('By creating an account, accessing, or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy available at https://lendlovellc.com/privacy. If you do not agree, do not use the Service.'),

    H2('2. Eligibility'),
    P('To use the Service, you must be at least 18 years of age (or the age of majority in your jurisdiction, whichever is greater); have the legal capacity to enter into binding contracts; reside in a jurisdiction where the Service is available; not be prohibited from using the Service under applicable law, including United States sanctions, anti-money-laundering, or counter-terrorism financing requirements; and provide accurate, current, and complete information about yourself.'),
    P('We may, in our sole discretion, refuse to provide the Service to any person or entity at any time.'),

    H2('3. Account Registration and Security'),
    H3('3.1 Account Creation'),
    P('You must register an account to use most features of the Service. When you register, you agree to provide accurate, complete, and current information; maintain the security of your password and accept all risks of unauthorized access; notify us immediately at support@lendlovellc.com if you suspect unauthorized use of your account; and not share your account credentials with anyone.'),
    P('You are responsible for all activity that occurs under your account, whether or not you authorized it.'),

    H3('3.2 Identity Verification (KYC) and AML'),
    P('To comply with US federal law (the Bank Secrecy Act, USA PATRIOT Act, and OFAC sanctions) and with state lending laws, we (through our third-party verification provider) collect and verify your name, date of birth, and physical address; a government-issued identification document; a real-time selfie matched against the ID; and proof of address such as a utility bill or bank statement.'),
    P('We may decline, suspend, or terminate your account if we are unable to verify your identity, you appear on a sanctioned-persons list, your activity is consistent with money laundering, fraud, or other prohibited conduct, or you provide false or misleading information.'),

    H2('4. The Service: Peer-to-Peer Lending Platform'),
    H3('4.1 What We Do'),
    P('Lend Love operates a technology platform that allows users to post offers to lend money or physical items, post requests to borrow money or physical items, communicate via in-app chat, generate Truth-in-Lending Act ("TILA") compliant loan agreements, electronically sign those agreements, and route payments between users through our third-party payment processor.'),

    H3('4.2 What We Are NOT'),
    P('**Lend Love is not a bank, lender, broker, or party to any loan.** We do not extend credit, lend funds, or guarantee repayment of any loan. All loans are between users acting in their personal capacities. Lend Love does not control whether a loan is funded, does not control whether a loan is repaid, does not guarantee any user\'s identity, creditworthiness, or behavior, is not responsible for any loss arising from a transaction between users, and does not provide legal, tax, or financial advice. You assume all risk associated with loans you enter into through the Service.'),

    H3('4.3 Item Loans'),
    P('Lend Love also supports loans of physical items between users. The lending and borrowing user are solely responsible for the condition, delivery, and return of any item. Lend Love is not responsible for any damage, loss, or theft.'),

    H2('5. Loan Terms and Disclosures'),
    H3('5.1 Truth-in-Lending Disclosures'),
    P('Every money loan agreement generated through the Service includes the following TILA-mandated disclosures: Annual Percentage Rate (APR), Finance Charge, Amount Financed, Total of Payments, Payment Schedule, Late Payment Fees, and Prepayment Terms. Review these disclosures carefully before signing any loan agreement.'),

    H3('5.2 APR Cap and Term Floor'),
    P('To comply with consumer-protection requirements and the Google Play Personal Loan Policy, money loans on the Service may not exceed an annual percentage rate of **36%** (or any lower applicable state cap), must have a repayment term of at least **60 days**, and must comply with all applicable state lending and consumer-protection laws. We reserve the right to reject any proposed loan that exceeds these limits or otherwise violates applicable law.'),

    H3('5.3 Electronic Signatures'),
    P('By electronically signing a loan agreement through the Service, you agree that your electronic signature has the same legal effect as a handwritten signature under the U.S. Electronic Signatures in Global and National Commerce Act ("E-SIGN") and the Uniform Electronic Transactions Act ("UETA"); you have the technical capability to access and retain a copy of the agreement; and you agree to receive related notices and disclosures electronically.'),

    H3('5.4 You Are Bound by Your Agreement'),
    P('A signed loan agreement is a legally binding contract between the lender and the borrower. Lend Love is not a party to that contract. Disputes arising from a loan agreement must be resolved between the parties (subject to Section 17 below).'),

    H2('6. Payments'),
    H3('6.1 Payment Processor'),
    P('All money transfers occur through our third-party payment processor, Paykings, using the NMI Gateway. Use of the payment service is subject to that provider\'s terms.'),

    H3('6.2 Disbursements and Repayments'),
    P('Disbursements are initiated when both parties sign the agreement and the lender authorizes funding. Repayments may be scheduled automatically through ACH debit or made via card or bank transfer. Failed payments may result in late fees, additional ACH-failure fees from the processor, and damage to platform standing.'),

    H3('6.3 Platform Fee'),
    P('Lend Love charges a platform fee (currently 1.5% of the disbursed amount, subject to change with notice). The fee is deducted automatically and is non-refundable except as required by law.'),

    H3('6.4 Refunds and Chargebacks'),
    P('Initiating a chargeback for a legitimate loan repayment may result in suspension or termination of your account. We will cooperate fully with payment processors and law-enforcement authorities to investigate fraudulent chargebacks.'),

    H3('6.5 Tax Responsibility'),
    P('You are solely responsible for any tax consequences of loans you enter into through the Service, including reporting interest income. We may issue tax forms (such as IRS Form 1099) as required by law.'),

    H2('7. User Conduct'),
    P('You agree NOT to use the Service to:'),
    Bullet('Violate any law, regulation, or third-party right.'),
    Bullet('Submit false, inaccurate, or misleading information.'),
    Bullet('Engage in money laundering, terrorist financing, or sanctions evasion.'),
    Bullet('Solicit or transact loans for illegal activities, gambling, firearms, controlled substances, or any other prohibited purpose.'),
    Bullet('Discriminate against any user based on race, religion, gender, national origin, disability, or any protected category.'),
    Bullet('Harass, threaten, defraud, or harm any other user.'),
    Bullet('Impersonate any person or entity.'),
    Bullet('Bypass the in-platform payment system by paying users off-platform.'),
    Bullet('Use bots, scrapers, or automated tools to access the Service.'),
    Bullet('Interfere with the security or availability of the Service.'),
    Bullet('Attempt to reverse engineer, decompile, or extract source code from any part of the Service.'),
    Bullet('Use the Service to compete with us or build a competing product.'),
    Bullet('Upload any virus, malware, or harmful code.'),
    Bullet('Use the Service for any non-consumer (commercial) lending without our prior written consent.'),
    P('Violation of these prohibitions may result in immediate suspension or termination, forfeiture of pending transactions, and referral to law-enforcement authorities.'),

    H2('8. User-Generated Content'),
    H3('8.1 Your Content'),
    P('You retain ownership of content you submit to the Service (profiles, loan listings, chat messages, signatures, etc.). By submitting content, you grant Lend Love a non-exclusive, worldwide, royalty-free license to use, store, display, reproduce, modify, and distribute that content solely for the purpose of operating and improving the Service.'),

    H3('8.2 Your Representations'),
    P('You represent and warrant that you have all rights necessary to submit your content and that your content does not violate any law or third-party right.'),

    H3('8.3 Moderation'),
    P('We may, but are not obligated to, monitor, review, or remove any user content. We may remove content that violates these Terms, our community guidelines, or applicable law. We are not responsible for content submitted by other users.'),

    H3('8.4 Report Abuse'),
    P('You may report inappropriate content or conduct via the in-app Report button or by emailing support@lendlovellc.com. We investigate reports promptly and may take action including warning, suspension, or termination of accounts.'),

    H3('8.5 Blocking Other Users'),
    P('You may block another user from contacting you through the Service. Blocked users will be hidden from you and unable to message you.'),

    H2('9. Intellectual Property'),
    P('All content provided by Lend Love — including software, designs, logos, trademarks, text, graphics, and user interfaces — is owned by or licensed to Lend Love and is protected by copyright, trademark, and other intellectual-property laws. "Lend Love" and the Lend Love logo are trademarks of Lend Love, Inc. You may not copy, modify, distribute, sell, or lease any part of the Service, nor reverse engineer or attempt to extract source code, except as expressly permitted by law.'),

    H2('10. Third-Party Services'),
    P('The Service integrates with third-party providers including ID Analyzer for identity verification, Paykings and NMI Gateway for payment processing, Stream Chat for messaging in production, Firebase (Google) for authentication, database, and notifications, SendGrid for email, and Twilio for SMS. Your use of those services is subject to their own terms and privacy policies. We are not responsible for any third-party service.'),

    H2('11. Privacy'),
    P('Our collection and use of personal information is governed by our Privacy Policy at https://lendlovellc.com/privacy, which is incorporated by reference into these Terms.'),

    H2('12. Account Suspension and Termination'),
    H3('12.1 By You'),
    P('You may terminate your account at any time by following the instructions in Profile → Account Settings → Delete Account within the app or by visiting https://lendlovellc.com/delete-account.'),

    H3('12.2 By Us'),
    P('We may suspend or terminate your account at any time, with or without notice, if we believe you have violated these Terms, posed a risk of harm to others or the platform, or for any other reason in our reasonable discretion.'),

    H3('12.3 Effect of Termination'),
    P('Termination does not discharge outstanding loan obligations between users, accrued payment, fee, or repayment obligations, or sections of these Terms intended to survive termination, including Sections 4.2 (Limitation of Service), 9 (Intellectual Property), 13–15 (Disclaimers, Limitation of Liability, Indemnification), and 20 (Arbitration).'),

    H2('13. Disclaimers'),
    P('THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.'),
    P('Without limiting the foregoing, Lend Love does not warrant that the Service will be uninterrupted, secure, or error-free; that any loan posted on the platform will be funded, repaid, or be a good investment; that other users are who they claim to be, despite our KYC efforts; that information posted by users is accurate; or that defects in the Service will be corrected.'),
    P('Lend Love is not responsible for the conduct of any user. We do not guarantee the outcome of any loan, item exchange, or interaction between users. Some jurisdictions do not allow exclusion of certain warranties, so portions of this section may not apply to you.'),

    H2('14. Limitation of Liability'),
    P('TO THE MAXIMUM EXTENT PERMITTED BY LAW, Lend Love, its officers, directors, employees, agents, and suppliers will not be liable for any indirect, incidental, special, consequential, or exemplary damages, including damages for loss of profits, data, business opportunities, or goodwill, arising out of or in connection with the Service, even if we have been advised of the possibility of such damages.'),
    P('Our total liability to you for all claims arising from or related to the Service will not exceed the greater of (a) the total fees you paid to Lend Love in the 12 months preceding the claim, or (b) one hundred US dollars ($100). These limitations apply regardless of the legal theory and apply even if any limited remedy fails of its essential purpose. Some jurisdictions do not allow these limitations, so portions of this section may not apply to you.'),

    H2('15. Indemnification'),
    P('You agree to indemnify, defend, and hold harmless Lend Love and its officers, directors, employees, agents, and suppliers from any claim, demand, loss, liability, expense, or damage (including reasonable attorneys\' fees) arising out of or relating to your use of the Service, your violation of these Terms or any law, your violation of any third-party right, any content you submit, or any loan or transaction between you and another user.'),

    H2('16. Governing Law'),
    P('These Terms are governed by the laws of the State of New York, without regard to its conflict-of-laws principles. The United Nations Convention on Contracts for the International Sale of Goods does not apply.'),

    H2('17. Disputes Between Users'),
    P('Loan disputes (e.g., non-payment, item damage, fraud) are between the users involved. Lend Love does not arbitrate such disputes, but we may provide tools, transcripts of in-app communication, and other relevant information upon a valid legal request. We encourage users to communicate directly through the in-app chat, refer to the signed loan agreement for terms, consider mediation services in your jurisdiction, and consult an attorney for serious disputes.'),

    H2('18. Changes to These Terms'),
    P('We may modify these Terms at any time. We will update the "Last Updated" date at the top of this document, provide notice through the app or by email if changes are material, and where required by law, obtain your consent or give you the opportunity to delete your account. Your continued use of the Service after the effective date of an updated Terms means you accept the changes.'),

    H2('19. Notice and Right to Cure'),
    P('Before initiating a dispute, you must first send written notice to legal@lendlovellc.com describing the claim. We will have 60 days from receipt of the notice to attempt to resolve the matter informally.'),

    H2('20. Mandatory Arbitration and Class Action Waiver'),
    P('PLEASE READ CAREFULLY. THIS SECTION AFFECTS YOUR LEGAL RIGHTS.'),
    H3('20.1 Agreement to Arbitrate'),
    P('Any dispute, claim, or controversy arising out of or relating to these Terms or the Service (a "Dispute") that cannot be resolved informally under Section 19 must be resolved through binding individual arbitration administered by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules, NOT in court.'),

    H3('20.2 Class Action Waiver'),
    P('YOU AND LEND LOVE EACH WAIVE THE RIGHT TO PARTICIPATE IN A CLASS, COLLECTIVE, OR REPRESENTATIVE ACTION. Disputes will be resolved on an individual basis only.'),

    H3('20.3 Exceptions'),
    P('You may pursue claims in small-claims court if eligible. Either party may seek injunctive relief in court to protect intellectual-property rights.'),

    H3('20.4 Right to Opt Out'),
    P('You may opt out of the arbitration agreement and class-action waiver by emailing legal@lendlovellc.com within 30 days of first accepting these Terms. You must include your full name, account email, and a clear statement that you wish to opt out.'),

    H3('20.5 Location and Costs'),
    P('Arbitration will be conducted in New York County, New York, or by remote means if the AAA Consumer Arbitration Rules so allow. The AAA Consumer Arbitration Rules govern the allocation of fees.'),

    H2('21. Miscellaneous'),
    Bullet('**Entire Agreement.** These Terms (together with the Privacy Policy) constitute the entire agreement between you and Lend Love.'),
    Bullet('**Severability.** If any provision is found unenforceable, the remaining provisions remain in full effect.'),
    Bullet('**No Waiver.** Our failure to enforce a provision is not a waiver of our right to do so later.'),
    Bullet('**Assignment.** You may not assign these Terms without our prior written consent. We may assign these Terms freely.'),
    Bullet('**Force Majeure.** We are not liable for failures caused by events beyond our reasonable control.'),
    Bullet('**Headings.** Section headings are for convenience only and do not affect interpretation.'),
    Bullet('**English Language.** These Terms are in English; any translation is for convenience only.'),

    H2('22. Contact'),
    P('If you have questions about these Terms, contact us at:'),
    P('**Lend Love, Inc.**'),
    P('Legal: legal@lendlovellc.com'),
    P('Support: support@lendlovellc.com'),
    P('Web: https://lendlovellc.com'),

    HR(),
    P('© [YEAR] Lend Love, Inc. All rights reserved. Lend Love™ is a trademark of Lend Love, Inc.'),
  ];

  return new Document({
    ...COMMON_DOC,
    sections: [
      {
        properties: pageProps(),
        ...pageHeaderFooter('Terms of Service'),
        children: content,
      },
    ],
  });
}

// ===================== ACCOUNT DELETION =====================

function buildAccountDeletion() {
  const content = [
    ...coverParagraphs('Account Deletion', `Document Version 1.0  •  Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`),

    H1('How to Delete Your Lend Love™ Account'),
    P('**Effective Date:** [DATE TO BE INSERTED]'),
    P('**Last Updated:** [DATE TO BE INSERTED]'),
    HR(),

    H2('Overview'),
    P('Lend Love makes it easy to delete your account and your personal data whenever you choose. This page explains how to delete your account, what data is removed, what we are required to keep by law, and how long the process takes.'),
    P('You can delete your account in two ways:'),
    Bullet('**From inside the mobile app** (fastest)'),
    Bullet('**From this web page** (if you no longer have the app installed)'),

    H2('Option 1 — Delete From the Mobile App'),
    P('This is the fastest way. Your account is deleted immediately and you are signed out.'),
    H3('Steps'),
    Bullet('Open the Lend Love app on your phone.'),
    Bullet('Sign in to the account you want to delete.'),
    Bullet('Tap the **Profile** tab at the bottom right.'),
    Bullet('Tap the **gear icon** in the top right to open **Account Settings**.'),
    Bullet('Scroll to the bottom and tap **⚠ Delete Account**.'),
    Bullet('Review the disclosure of what gets deleted and what is retained.'),
    Bullet('Type the word **DELETE** in the confirmation field.'),
    Bullet('Tap **Delete my account permanently**.'),
    Bullet('Confirm the second prompt.'),
    P('That\'s it. Your account, personal data, and signed-in sessions on every device are removed within seconds.'),

    H2('Option 2 — Delete From This Web Page'),
    P('Use this option if you no longer have the app, can no longer sign in, or simply prefer to handle the request by email.'),
    H3('Steps'),
    Bullet('Send an email from the email address on your Lend Love account to **support@lendlovellc.com**'),
    Bullet('Use the subject line: **Account Deletion Request**'),
    Bullet('In the body, include your full name on the account, the email address linked to your Lend Love account, and (optionally) the reason you are leaving.'),
    Bullet('Send the email. We will reply within **3 business days** to confirm the request.'),
    Bullet('We will verify your identity (we may ask a question only the account owner could answer) and then delete the account. You will receive a confirmation email when deletion is complete.'),
    P('We will complete every web-based deletion request within **30 days** of receiving it, as required by law.'),

    H2('What Gets Deleted'),
    P('When you delete your account, we permanently remove:'),
    Bullet('Your **profile information** — name, email, phone number, home address, date of birth, occupation'),
    Bullet('Your **identity-verification (KYC) documents** — government ID, selfie, proof of address'),
    Bullet('Your **profile photo** and any signatures you uploaded'),
    Bullet('Any **saved payment methods** (tokens revoked with our payment processor)'),
    Bullet('Your **push notification tokens** (you will not receive further notifications)'),
    Bullet('Your **chat message contents**'),
    Bullet('Any **support tickets** older than the active resolution period'),
    Bullet('All **active sessions** on every device'),

    H2('What Is Retained (and Why)'),
    P('By law we are required to keep certain records even after you delete your account. These records are **anonymized** — your name is replaced with "Deleted User" and personally identifying details are removed.'),
    Bullet('**Loan records** — US lending recordkeeping law requires retention for **7 years** after the loan is closed.'),
    Bullet('**Signed loan agreements** — Required for legal audit, with your name redacted, for **7 years**.'),
    Bullet('**Transaction history** — Tax and regulatory reporting (IRS, FinCEN) requires **7 years**.'),
    Bullet('**KYC documents** — Anti-Money-Laundering / Bank Secrecy Act requires **5 years** after account closure.'),
    Bullet('**Audit log of administrative actions** — Regulatory compliance, **7 years**.'),
    P('These records cannot be retrieved or used to identify you personally. Once the retention period expires, they are also securely destroyed.'),

    H2('How Long Does Deletion Take?'),
    Bullet('**In-app deletion** — Immediate, within seconds of confirming.'),
    Bullet('**Email request** — Up to 30 days (usually within 3 business days).'),
    P('If you do not receive a confirmation email within 30 days of submitting a web request, please contact us at **support@lendlovellc.com** and we will investigate.'),

    H2('Outstanding Loans'),
    P('If you have an **active loan** (either as the lender or as the borrower) on the platform when you request deletion:'),
    Bullet('Your **profile and personal information** are anonymized as described above.'),
    Bullet('The **loan itself remains active**. You and the other party are still legally bound by the signed agreement. Lend Love is not a party to the loan and does not assume your obligations.'),
    Bullet('We will continue to provide the other party with the information they need to honor or enforce the agreement.'),
    P('We strongly recommend you close out any active loans before requesting deletion. If you cannot, please disclose the loan in your email and we will coordinate with you and the other party as appropriate.'),

    H2('After Deletion'),
    Bullet('Your email address will **not** be reusable on Lend Love for **30 days** after deletion — this protects against accidental sign-ups during the wind-down period.'),
    Bullet('You may create a new account after that 30-day window with the same email, but the new account will be entirely separate and will not retain any history from the deleted one.'),
    Bullet('Marketing or transactional emails will stop within 24 hours of deletion.'),

    H2('Need Help?'),
    P('If you have any questions about account deletion or are having trouble completing either method, please contact us:'),
    P('📧 **Support:** support@lendlovellc.com'),
    P('🌐 **Web:** https://lendlovellc.com'),
    P('We typically respond within **one business day**.'),

    H2('Related Documents'),
    Bullet('**Privacy Policy** — full details on what data we collect and how we use it: https://lendlovellc.com/privacy'),
    Bullet('**Terms of Service** — your agreement with Lend Love: https://lendlovellc.com/terms'),

    HR(),
    P('© [YEAR] Lend Love, Inc. All rights reserved. Lend Love™ is a trademark of Lend Love, Inc.'),
  ];

  return new Document({
    ...COMMON_DOC,
    sections: [
      {
        properties: pageProps(),
        ...pageHeaderFooter('Account Deletion'),
        children: content,
      },
    ],
  });
}

// ===================== Build =====================

(async () => {
  const outDir = path.join(__dirname, 'legal');

  const docs = [
    { build: buildPrivacyPolicy, file: 'Lend-Love-Privacy-Policy.docx' },
    { build: buildTermsOfService, file: 'Lend-Love-Terms-of-Service.docx' },
    { build: buildAccountDeletion, file: 'Lend-Love-Account-Deletion.docx' },
  ];

  console.log('Generating:');
  for (const d of docs) {
    const p = path.join(outDir, d.file);
    try {
      const buf = await Packer.toBuffer(d.build());
      fs.writeFileSync(p, buf);
      const s = fs.statSync(p);
      console.log(`  OK   ${d.file}  (${(s.size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      if (e.code === 'EBUSY') {
        console.log(`  SKIP ${d.file}  (file is open in another application — close it and re-run)`);
      } else {
        throw e;
      }
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
