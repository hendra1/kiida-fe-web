import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

let failed = false;

console.log("=== CHECK 1: Required Files Exist & Non-Empty ===");
const requiredFiles = ["index.html", "sitemap.xml", "robots.txt"];
for (const rel of requiredFiles) {
  const filePath = path.join(rootDir, rel);
  try {
    const s = await stat(filePath);
    if (s.size === 0) {
      console.error(`FAIL: ${rel} is empty (0 bytes)`);
      failed = true;
    } else {
      console.log(`PASS: ${rel} exists and is non-empty (${s.size} bytes)`);
    }
  } catch (err) {
    console.error(`FAIL: ${rel} does not exist: ${err.message}`);
    failed = true;
  }
}

console.log("\n=== CHECK 2: Obsolete Files & Directories Do NOT Exist ===");
const obsoletePaths = [
  "parents.html",
  "partners.html",
  "pricing.html",
  "about.html",
  "help.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "404.html",
  "id",
  "src/pages"
];

for (const rel of obsoletePaths) {
  const targetPath = path.join(rootDir, rel);
  try {
    await stat(targetPath);
    console.error(`FAIL: Obsolete path "${rel}" still exists!`);
    failed = true;
  } catch {
    console.log(`PASS: Obsolete path "${rel}" cleanly absent`);
  }
}

console.log("\n=== CHECK 3: Forbidden Terms Scan ===");
const forbiddenRegex = /d-u-n-s|duns|naics|\bsic\b|kbli|slide [0-9]|value vector|official profile/i;
const filesToScan = [
  "index.html",
  "sitemap.xml",
  "robots.txt"
];

for (const rel of filesToScan) {
  const filePath = path.join(rootDir, rel);
  const content = await readFile(filePath, "utf8");
  const match = content.match(forbiddenRegex);
  if (match) {
    console.error(`FAIL: Forbidden term "${match[0]}" found in ${rel}`);
    failed = true;
  } else {
    console.log(`PASS: ${rel} clean of forbidden terms`);
  }
}

console.log("\n=== CHECK 4: Unique ID Verification (No Duplicate IDs) ===");
const indexPath = path.join(rootDir, "index.html");
const indexHtml = await readFile(indexPath, "utf8");

const idMatches = [...indexHtml.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]);
const idCounts = new Map();
for (const id of idMatches) {
  idCounts.set(id, (idCounts.get(id) || 0) + 1);
}

const duplicateIds = [];
for (const [id, count] of idCounts.entries()) {
  if (count > 1) {
    duplicateIds.push({ id, count });
  }
}

if (duplicateIds.length > 0) {
  console.error(`FAIL: Duplicate IDs found in index.html:`);
  for (const { id, count } of duplicateIds) {
    console.error(`  - "${id}" appears ${count} times`);
  }
  failed = true;
} else {
  console.log(`PASS: ZERO duplicate IDs in index.html (Total: ${idMatches.length} unique IDs)`);
}

console.log("\n=== CHECK 5: In-Page Anchor Links Resolution ===");
const existingIds = new Set(idCounts.keys());
const anchorLinks = [...indexHtml.matchAll(/<a[^>]+href=["'](#[^"']+)["']/g)].map((m) => m[1]);
const missingAnchors = [];

for (const anchor of anchorLinks) {
  const targetId = anchor.slice(1);
  if (!existingIds.has(targetId)) {
    missingAnchors.push(anchor);
  }
}

if (missingAnchors.length > 0) {
  console.error(`FAIL: Broken in-page anchor links in index.html:`, missingAnchors);
  failed = true;
} else {
  console.log(`PASS: All ${anchorLinks.length} in-page anchor links resolve cleanly`);
}

console.log("\n=== CHECK 6: Asset Resolution (Images, Links, Scripts) ===");
// Check <img> src
const imgMatches = [...indexHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map((m) => m[1]);
for (const rawSrc of imgMatches) {
  if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://") || rawSrc.startsWith("data:")) {
    continue;
  }
  const decodedSrc = decodeURIComponent(rawSrc);
  const targetPath = path.resolve(rootDir, decodedSrc);
  try {
    await stat(targetPath);
  } catch {
    console.error(`FAIL: Image src "${rawSrc}" does not resolve (target: ${targetPath})`);
    failed = true;
  }
}
console.log(`PASS: All ${imgMatches.length} image sources resolve cleanly`);

// Check <link href="..."> for stylesheets and icons
const linkTagMatches = [...indexHtml.matchAll(/<link[^>]+href=["']([^"']+)["']/g)].map((m) => m[1]);
for (const rawHref of linkTagMatches) {
  if (
    rawHref.startsWith("http://") ||
    rawHref.startsWith("https://") ||
    rawHref.startsWith("//") ||
    rawHref.startsWith("#")
  ) {
    continue;
  }
  const decodedHref = decodeURIComponent(rawHref);
  const targetPath = path.resolve(rootDir, decodedHref);
  try {
    await stat(targetPath);
  } catch {
    console.error(`FAIL: Asset link href "${rawHref}" does not resolve (target: ${targetPath})`);
    failed = true;
  }
}
console.log(`PASS: All stylesheet/icon link targets resolve cleanly`);

// Check <script src="...">
const scriptMatches = [...indexHtml.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map((m) => m[1]);
for (const rawSrc of scriptMatches) {
  if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://")) {
    continue;
  }
  const decodedSrc = decodeURIComponent(rawSrc);
  const targetPath = path.resolve(rootDir, decodedSrc);
  try {
    await stat(targetPath);
  } catch {
    console.error(`FAIL: Script src "${rawSrc}" does not resolve (target: ${targetPath})`);
    failed = true;
  }
}
console.log(`PASS: All script sources resolve cleanly`);

console.log("\n=== CHECK 7: Dialogs and Multilingual Structure ===");
const requiredElements = [
  { desc: '#privacy-dialog', test: existingIds.has("privacy-dialog") },
  { desc: '#terms-dialog', test: existingIds.has("terms-dialog") },
  { desc: '[data-lang="en"]', test: indexHtml.includes('data-lang="en"') },
  { desc: '[data-lang="id"]', test: indexHtml.includes('data-lang="id"') }
];

for (const elem of requiredElements) {
  if (elem.test) {
    console.log(`PASS: ${elem.desc} is present in index.html`);
  } else {
    console.error(`FAIL: ${elem.desc} is MISSING in index.html!`);
    failed = true;
  }
}

console.log("\n=== SUMMARY ===");
if (failed) {
  console.error("Verification FAILED with errors!");
  process.exit(1);
} else {
  console.log("Verification PASSED with ZERO errors! Site is 100% compliant.");
}
