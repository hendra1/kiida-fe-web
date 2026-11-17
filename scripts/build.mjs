import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site, ui } from "../src/site.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function resolvePath(obj, dotPath) {
  return dotPath.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
}

function renderTemplate(template, vars) {
  return template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => String(resolvePath(vars, key) ?? ""));
}

const sections = [
  { key: "home", id: "home", className: "hero-section" },
  { key: "sound-familiar", id: "sound-familiar", className: "section" },
  { key: "how-it-works", id: "how-it-works", className: "section section-lilac" },
  { key: "whats-inside", id: "whats-inside", className: "section" },
  { key: "parents", id: "parents", className: "section section-oat" },
  { key: "partners", id: "partners", className: "section" },
  { key: "pricing", id: "pricing", className: "section section-lilac" },
  { key: "about", id: "about", className: "section" },
  { key: "faq", id: "faq", className: "section section-oat" },
  { key: "contact", id: "contact", className: "section section-lilac" }
];

async function renderSectionPair(sec, vars) {
  const enRaw = await readFile(path.join(rootDir, "src/sections/en", `${sec.key}.html`), "utf8");
  const idRaw = await readFile(path.join(rootDir, "src/sections/id", `${sec.key}.html`), "utf8");

  const enHtml = renderTemplate(enRaw, vars).trim();
  const idHtml = renderTemplate(idRaw, vars).trim();

  return [
    `    <section id="${sec.id}" class="${sec.className}">`,
    `      <div class="container">`,
    `        <div data-lang="en">\n${enHtml}\n        </div>`,
    `        <div data-lang="id">\n${idHtml}\n        </div>`,
    `      </div>`,
    `    </section>`
  ].join("\n");
}

async function renderLegalDialog({ id, titleId, closeBtnId, titleEn, titleIdText, badgeEn, badgeId, key, vars }) {
  const enRaw = await readFile(path.join(rootDir, "src/sections/en", `${key}.html`), "utf8");
  const idRaw = await readFile(path.join(rootDir, "src/sections/id", `${key}.html`), "utf8");

  const enHtml = renderTemplate(enRaw, vars).trim();
  const idHtml = renderTemplate(idRaw, vars).trim();

  return [
    `  <dialog id="${id}" class="legal-dialog" closedby="any" aria-labelledby="${titleId}">`,
    `    <div class="dialog-shell">`,
    `      <div class="dialog-header">`,
    `        <div>`,
    `          <span class="eyebrow-pill">`,
    `            <span class="eyebrow-dot" aria-hidden="true"></span>`,
    `            <span data-lang="en">${badgeEn}</span>`,
    `            <span data-lang="id">${badgeId}</span>`,
    `          </span>`,
    `          <h2 id="${titleId}" class="dialog-title">`,
    `            <span data-lang="en">${titleEn}</span>`,
    `            <span data-lang="id">${titleIdText}</span>`,
    `          </h2>`,
    `        </div>`,
    `        <form method="dialog" class="dialog-close-form">`,
    `          <button id="${closeBtnId}" type="submit" class="dialog-close-btn" autofocus>`,
    `            <span data-lang="en">Close ✕</span>`,
    `            <span data-lang="id">Tutup ✕</span>`,
    `          </button>`,
    `        </form>`,
    `      </div>`,
    `      <div class="dialog-body">`,
    `        <div data-lang="en">\n${enHtml}\n        </div>`,
    `        <div data-lang="id">\n${idHtml}\n        </div>`,
    `      </div>`,
    `    </div>`,
    `  </dialog>`
  ].join("\n");
}

async function build() {
  const headTpl = await readFile(path.join(rootDir, "src/partials/head.html"), "utf8");
  const headerTpl = await readFile(path.join(rootDir, "src/partials/header.html"), "utf8");
  const footerTpl = await readFile(path.join(rootDir, "src/partials/footer.html"), "utf8");

  const vars = {
    site,
    t_en: ui.en,
    t_id: ui.id,
    root: ""
  };

  const renderedSections = [];
  for (const sec of sections) {
    renderedSections.push(await renderSectionPair(sec, vars));
  }

  const privacyDialog = await renderLegalDialog({
    id: "privacy-dialog",
    titleId: "privacy-dialog-title",
    closeBtnId: "privacy-dialog-close",
    badgeEn: "Privacy Policy • Last Updated: November 2026",
    badgeId: "Kebijakan Privasi • Diperbarui: November 2026",
    titleEn: "Privacy Policy &amp; Children’s Data Protection",
    titleIdText: "Kebijakan Privasi &amp; Perlindungan Data Anak",
    key: "privacy",
    vars
  });

  const termsDialog = await renderLegalDialog({
    id: "terms-dialog",
    titleId: "terms-dialog-title",
    closeBtnId: "terms-dialog-close",
    badgeEn: "Terms of Service • Last Updated: November 2026",
    badgeId: "Syarat &amp; Ketentuan • Diperbarui: November 2026",
    titleEn: "Terms of Service &amp; Booking Policy",
    titleIdText: "Syarat &amp; Ketentuan Layanan &amp; Pemesanan",
    key: "terms",
    vars
  });

  // footerTpl ends with `<script type="module" src="js/main.js"></script>\n</body>\n</html>`,
  // so place dialogs right before the script tag cleanly by stripping closing tags from footerTpl
  const footerHtml = renderTemplate(footerTpl, vars).replace(
    /\s*<script type="module" src="js\/main\.js"><\/script>\s*<\/body>\s*<\/html>\s*$/,
    ""
  );

  const fullHtml = [
    renderTemplate(headTpl, vars),
    renderTemplate(headerTpl, vars),
    `  <main id="main-content">`,
    ...renderedSections,
    `  </main>`,
    footerHtml,
    privacyDialog,
    termsDialog,
    `  <script type="module" src="js/main.js"></script>`,
    `</body>`,
    `</html>`
  ].join("\n");

  await writeFile(path.join(rootDir, "index.html"), fullHtml, "utf8");

  const sitemapXml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    `  <url>`,
    `    <loc>${site.url}/</loc>`,
    `  </url>`,
    `</urlset>`
  ].join("\n") + "\n";
  await writeFile(path.join(rootDir, "sitemap.xml"), sitemapXml, "utf8");

  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`;
  await writeFile(path.join(rootDir, "robots.txt"), robotsTxt, "utf8");

  console.log("Built single-page index.html + sitemap.xml + robots.txt.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
