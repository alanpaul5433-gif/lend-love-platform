const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

const NPM_GLOBAL = 'C:\\Users\\Sandeed Bin Hashim\\AppData\\Roaming\\npm\\node_modules';
process.env.NODE_PATH = NPM_GLOBAL;
require('module').Module._initPaths();

(async () => {
  const mdPath = path.join(__dirname, 'Lend Love - Project Document.md');
  const pdfPath = path.join(__dirname, 'Lend Love - Project Document.pdf');

  const markdown = fs.readFileSync(mdPath, 'utf-8');
  const htmlBody = marked.parse(markdown);

  const css = `
    @page {
      size: A4;
      margin: 20mm 18mm 22mm 18mm;
      @bottom-center {
        content: "Lend Love™ — Project Documentation  |  Page " counter(page) " of " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 9pt;
        color: #6B7280;
      }
    }

    * { box-sizing: border-box; }

    body {
      font-family: 'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10.5pt;
      line-height: 1.6;
      color: #1F2937;
      margin: 0;
      padding: 0;
    }

    /* Cover header strip */
    h1:first-of-type {
      font-size: 32pt;
      color: #236E16;
      background: linear-gradient(135deg, #3D9A2E 0%, #5DBF3F 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 4pt 0;
      padding-top: 30pt;
      font-weight: 800;
      letter-spacing: -0.5pt;
      border-bottom: 4pt solid #F5A800;
      padding-bottom: 16pt;
    }

    h1 {
      font-size: 22pt;
      color: #236E16;
      margin-top: 28pt;
      margin-bottom: 12pt;
      font-weight: 700;
      border-bottom: 2pt solid #3D9A2E;
      padding-bottom: 6pt;
      page-break-after: avoid;
    }

    h2 {
      font-size: 16pt;
      color: #2E7D32;
      margin-top: 22pt;
      margin-bottom: 8pt;
      font-weight: 700;
      page-break-after: avoid;
    }

    h3 {
      font-size: 13pt;
      color: #1F2937;
      margin-top: 16pt;
      margin-bottom: 6pt;
      font-weight: 600;
      page-break-after: avoid;
    }

    h4 {
      font-size: 11.5pt;
      color: #374151;
      margin-top: 12pt;
      margin-bottom: 4pt;
      font-weight: 600;
    }

    p {
      margin: 6pt 0;
      text-align: justify;
    }

    a {
      color: #3D9A2E;
      text-decoration: none;
    }

    strong {
      color: #111827;
      font-weight: 600;
    }

    em {
      color: #4B5563;
    }

    blockquote {
      border-left: 4pt solid #F5A800;
      background: #FFFBEB;
      margin: 10pt 0;
      padding: 8pt 14pt;
      color: #78350F;
      font-style: italic;
      border-radius: 0 4pt 4pt 0;
    }

    code {
      background: #F3F4F6;
      padding: 1pt 5pt;
      border-radius: 3pt;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 9.5pt;
      color: #BE185D;
    }

    pre {
      background: #0D1117;
      color: #C9D1D9;
      padding: 12pt 14pt;
      border-radius: 6pt;
      overflow-x: auto;
      font-size: 9pt;
      line-height: 1.5;
      page-break-inside: avoid;
      margin: 10pt 0;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: inherit;
    }

    ul, ol {
      margin: 6pt 0;
      padding-left: 22pt;
    }

    li {
      margin: 3pt 0;
    }

    hr {
      border: 0;
      border-top: 1pt solid #E5E7EB;
      margin: 18pt 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }

    thead {
      background: linear-gradient(135deg, #3D9A2E 0%, #2E7D32 100%);
      color: white;
    }

    th {
      padding: 8pt 10pt;
      text-align: left;
      font-weight: 600;
      font-size: 10pt;
      border: 1pt solid #2E7D32;
    }

    td {
      padding: 7pt 10pt;
      border: 1pt solid #E5E7EB;
      vertical-align: top;
    }

    tbody tr:nth-child(even) {
      background: #F9FAFB;
    }

    tbody tr:nth-child(odd) {
      background: #FFFFFF;
    }

    tbody tr:hover {
      background: #ECFDF5;
    }

    /* Cover Page */
    .cover {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%);
      color: white;
      padding: 60pt 40pt;
      margin: -20mm -18mm 0 -18mm;
    }

    .cover-logo {
      font-family: 'Brush Script MT', cursive;
      font-size: 70pt;
      color: #5DBF3F;
      margin-bottom: 0;
      line-height: 1;
      letter-spacing: -2pt;
    }

    .cover-love {
      font-size: 32pt;
      color: #F5A800;
      font-weight: 900;
      letter-spacing: 4pt;
      margin-top: -10pt;
    }

    .cover-heart {
      color: #D32F2F;
      font-size: 36pt;
      vertical-align: middle;
    }

    .cover-tm {
      font-size: 12pt;
      color: #9CA3AF;
      vertical-align: super;
    }

    .cover-tagline {
      font-size: 14pt;
      color: #D1FAE5;
      margin-top: 30pt;
      font-style: italic;
      font-weight: 300;
    }

    .cover-meta {
      margin-top: 80pt;
      padding-top: 30pt;
      border-top: 2pt solid #3D9A2E;
      width: 70%;
      color: #E5E7EB;
      font-size: 11pt;
      line-height: 2;
    }

    .cover-meta strong {
      color: #5DBF3F;
    }

    /* First H1 styling overrides the cover style */
    .content > h1:first-child {
      page-break-before: always;
    }

    /* Avoid page breaks in important blocks */
    h1, h2, h3, h4 { page-break-after: avoid; }
    table, pre, blockquote { page-break-inside: avoid; }
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Lend Love™ — Project Documentation</title>
  <style>${css}</style>
</head>
<body>
  <div class="cover">
    <div class="cover-logo">Lend<span class="cover-tm">™</span></div>
    <div class="cover-love">L<span class="cover-heart">♥</span>VE</div>
    <div class="cover-tagline">Peer-to-Peer Lending — Made Personal, Made Safe</div>
    <div class="cover-meta">
      <div><strong>PROJECT DOCUMENTATION</strong></div>
      <div>Version 1.0</div>
      <div>Prepared for: Client / Stakeholder</div>
      <div>Date: May 11, 2026</div>
    </div>
  </div>
  <div class="content">
    ${htmlBody}
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '18mm',
      bottom: '22mm',
      left: '18mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width:100%; font-size:8pt; color:#6B7280; padding:0 18mm; display:flex; justify-content:space-between; font-family:Segoe UI, sans-serif;">
        <span>Lend Love™ — Confidential</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();

  const stats = fs.statSync(pdfPath);
  console.log(`PDF created: ${pdfPath}`);
  console.log(`Size: ${(stats.size / 1024).toFixed(2)} KB`);
})().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
