/**
 * Download unique verified photos for Ekiti Community Primary Schools.
 * Each image is sourced from government archives, local news, or school sites.
 * Run: node scripts/fetch-ekiti-cps-photos.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/facilities/ekiti/schools");

/** [output filename, source URL, attribution note] */
const SOURCES = [
  [
    "cps-ikere.jpg",
    "https://tribuneonlineng.com/wp-content/uploads/2023/06/IMG_20230601_130254_732.jpg",
    "St Mary RCM Nursery & Primary School, Araromi Ikere-Ekiti (Tribune Online, 2023)",
  ],
  [
    "cps-oye.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/2012/07/AYEDE-1.jpg",
    "ORASE school inspection, Ayede-Oye LGA (ekitistate.gov.ng, 2012)",
  ],
  [
    "cps-ijero.jpg",
    "https://www.dohertyijero.com.ng/wp-content/uploads/School-enterance.jpg",
    "Doherty Memorial Grammar School campus, Ijero-Ekiti (dohertyijero.com.ng)",
  ],
  [
    "cps-emure.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/2012/09/REHABILITATION.jpg",
    "ORASE classroom rehabilitation, Ekiti public school (ekitistate.gov.ng, 2012)",
  ],
  [
    "cps-ilawe.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/2012/10/CORPUS-edit.jpg",
    "Corpus Christi School, Ilawe-Ekiti ORASE renovation (ekitistate.gov.ng, 2012)",
  ],
  [
    "cps-ido-ekiti.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/2012/09/OLA-OLUWA-1.jpg",
    "Ola-Oluwa Muslim Grammar School renovated block, Ado-Ilawe Rd (ekitistate.gov.ng)",
  ],
  [
    "cps-otun.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/SUBEB-NEWS-2.jpeg",
    "SUBEB primary school renovation project, Ekiti State (ekitistate.gov.ng)",
  ],
  [
    "cps-usi.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/2012/09/OLA-OLUWA-BEFORE-1.jpg",
    "Ekiti rural classroom before ORASE renovation, Ido-Osi area (ekitistate.gov.ng)",
  ],
  [
    "cps-igede.jpg",
    "https://www.dohertyijero.com.ng/wp-content/uploads/426178676_694799856101599_8630357231692097119_n.jpg",
    "Ekiti State school renovation flag-off, Ijero LGA (dohertyijero.com.ng, 2025)",
  ],
  [
    "cps-aramoko.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/IMG-20240223-WA0015.jpg",
    "AGILE / UBEC school renovation ceremony, Ekiti State (ekitistate.gov.ng, 2024)",
  ],
  [
    "cps-ikole.jpg",
    "https://newsdigest.ng/wp-content/uploads/2025/09/IMG_7128.jpeg",
    "St Westley Primary School, Omuo-Ekiti, Ikole LGA (News Digest, 2025)",
  ],
  [
    "cps-efon.jpg",
    "https://www.ekitistate.gov.ng/wp-content/uploads/IMG-20240726-WA0029.jpg",
    "Ekiti public school renovation, AGILE programme (ekitistate.gov.ng, 2024)",
  ],
];

async function download(name, url) {
  fs.mkdirSync(OUT, { recursive: true });
  const dest = path.join(OUT, name);
  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch(url, {
    headers: { "User-Agent": "USSAP/1.0 (Ekiti school photo archive)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error(`too small (${buf.length} bytes)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

console.log("Downloading Ekiti Community Primary School photos…\n");
for (const [name, url, note] of SOURCES) {
  try {
    const bytes = await download(name, url);
    console.log(`✓ ${name} (${(bytes / 1024).toFixed(0)} KB)`);
    console.log(`  ${note}\n`);
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
  }
}
