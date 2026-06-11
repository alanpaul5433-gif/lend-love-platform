/**
 * Generates branded PDFs for the Privacy Policy and Terms of Service.
 * Output: legal/Privacy-Policy.pdf, legal/Terms-of-Service.pdf
 */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

const documents = [
  {
    md: 'legal/privacy-policy.md',
    pdf: 'legal/Privacy-Policy.pdf',
    title: 'Privacy Policy',
  },
  {
    md: 'legal/terms-of-service.md',
    pdf: 'legal/Terms-of-Service.pdf',
    title: 'Terms of Service',
  },
];

const css = `
  @page { size: A4; margin: 22mm 18mm 22mm 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 10.5pt;
    line-height: 1.65;
    color: #1F2937;
    margin: 0;
    padding: 0;
  }

  /* Cover */
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
    margin: -22mm -18mm 0 -18mm;
  }
  .cover-logo {
    font-family: 'Brush Script MT', cursive;
    font-size: 64pt;
    color: #5DBF3F;
    line-height: 1;
    letter-spacing: -2pt;
  }
  .cover-love {
    font-size: 28pt;
    color: #F5A800;
    font-weight: 900;
    letter-spacing: 4pt;
    margin-top: -6pt;
  }
  .cover-heart { color: #D32F2F; font-size: 30pt; vertical-align: middle; }
  .cover-tm { font-size: 10pt; color: #9CA3AF; vertical-align: super; }
  .cover-tagline {
    font-size: 13pt;
    color: #D1FAE5;
    margin-top: 28pt;
    font-style: italic;
    font-weight: 300;
  }
  .cover-title {
    font-size: 26pt;
    color: white;
    margin-top: 36pt;
    letter-spacing: 1pt;
    font-weight: 700;
  }
  .cover-meta {
    margin-top: 60pt;
    padding-top: 24pt;
    border-top: 2pt solid #3D9A2E;
    width: 70%;
    color: #E5E7EB;
    font-size: 10pt;
    line-height: 1.9;
  }
  .cover-meta strong { color: #5DBF3F; }

  /* Body */
  h1 {
    font-size: 18pt;
    color: #236E16;
    margin-top: 24pt;
    margin-bottom: 10pt;
    font-weight: 700;
    border-bottom: 2pt solid #3D9A2E;
    padding-bottom: 6pt;
    page-break-after: avoid;
  }
  h1:first-of-type {
    page-break-before: avoid;
    margin-top: 0;
  }
  h2 {
    font-size: 13.5pt;
    color: #2E7D32;
    margin-top: 18pt;
    margin-bottom: 6pt;
    font-weight: 700;
    page-break-after: avoid;
  }
  h3 {
    font-size: 11.5pt;
    color: #1F2937;
    margin-top: 12pt;
    margin-bottom: 4pt;
    font-weight: 600;
    page-break-after: avoid;
  }
  h4 {
    font-size: 10.5pt;
    color: #374151;
    margin-top: 8pt;
    margin-bottom: 3pt;
    font-weight: 600;
  }
  p {
    margin: 6pt 0;
    text-align: justify;
  }
  a { color: #3D9A2E; text-decoration: none; }
  strong { color: #111827; font-weight: 600; }
  em { color: #4B5563; }

  blockquote {
    border-left: 4pt solid #F5A800;
    background: #FFFBEB;
    margin: 10pt 0;
    padding: 8pt 14pt;
    color: #78350F;
    border-radius: 0 4pt 4pt 0;
    font-style: italic;
  }
  code {
    background: #F3F4F6;
    padding: 1pt 5pt;
    border-radius: 3pt;
    font-family: 'Consolas', monospace;
    font-size: 9.5pt;
    color: #BE185D;
  }

  ul, ol { margin: 6pt 0; padding-left: 22pt; }
  li { margin: 3pt 0; }

  hr {
    border: 0;
    border-top: 1pt solid #E5E7EB;
    margin: 14pt 0;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  thead {
    background: linear-gradient(135deg, #3D9A2E 0%, #2E7D32 100%);
    color: white;
  }
  th {
    padding: 7pt 9pt;
    text-align: left;
    font-weight: 600;
    border: 1pt solid #2E7D32;
  }
  td {
    padding: 6pt 9pt;
    border: 1pt solid #E5E7EB;
    vertical-align: top;
  }
  tbody tr:nth-child(even) { background: #F9FAFB; }
  tbody tr:nth-child(odd) { background: #FFFFFF; }

  /* Bracketed placeholders show as red bold so you can spot them */
  body { counter-reset: page; }
  .placeholder { color: #D32F2F; font-weight: bold; }
`;

function highlightPlaceholders(html) {
  // Wrap any [BRACKETED TEXT] in a span so it stands out in the PDF
  return html.replace(
    /\[([^\]]+)\]/g,
    (_m, content) => `<span class="placeholder">[${content}]</span>`
  );
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const docInfo of documents) {
    const mdPath = path.join(__dirname, docInfo.md);
    const pdfPath = path.join(__dirname, docInfo.pdf);

    const markdown = fs.readFileSync(mdPath, 'utf-8');
    let htmlBody = marked.parse(markdown);
    htmlBody = highlightPlaceholders(htmlBody);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${docInfo.title} — Lend Love™</title>
  <style>${css}</style>
</head>
<body>
  <div class="cover">
    <div class="cover-logo">Lend<span class="cover-tm">™</span></div>
    <div class="cover-love">L<span class="cover-heart">♥</span>VE</div>
    <div class="cover-tagline">Peer-to-Peer Lending — Made Personal, Made Safe</div>
    <div class="cover-title">${docInfo.title.toUpperCase()}</div>
    <div class="cover-meta">
      <div><strong>LEGAL DOCUMENT</strong></div>
      <div>Document Version 1.0</div>
      <div>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      <div><span style="color:#F5A800">⚠ Template — requires attorney review before publishing</span></div>
    </div>
  </div>
  <div class="content">${htmlBody}</div>
</body>
</html>`;

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '22mm', right: '18mm', bottom: '22mm', left: '18mm' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%; font-size:8pt; color:#6B7280; padding:0 18mm; display:flex; justify-content:space-between; font-family:Segoe UI, sans-serif;">
          <span>Lend Love™ — ${docInfo.title}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    });

    await page.close();

    const size = fs.statSync(pdfPath).size;
    console.log(`Generated: ${docInfo.pdf} (${(size / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
