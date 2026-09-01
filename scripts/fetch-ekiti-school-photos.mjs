/**
 * Download verified Ekiti school photos from government archives and school sites.
 * Run: node scripts/fetch-ekiti-school-photos.mjs
 *
 * Sources:
 * - Ayede Grammar School ORASE inspection: ekitistate.gov.ng/archives/4358
 * - Ipoti High School rehabilitation: ekitistate.gov.ng/archives/4875
 * - AGILE / renovation ceremonies: ekitistate.gov.ng/archives/27875, 29067
 * - Christ's School Ado-Ekiti: Wikimedia Commons
 * - Doherty Memorial Grammar School Ijero: dohertyijero.com.ng
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/facilities/ekiti/schools");

const SOURCES = [
  ["ayede-grammar-school.jpg", "http://ekitistate.gov.ng/wp-content/uploads/2012/09/RENOVATION-2.jpg"],
  ["ipoti-community-high-school.jpg", "http://ekitistate.gov.ng/wp-content/uploads/2012/10/SCHOOL-REHABILITATION.jpg"],
  ["christs-school-ado-ekiti.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/73/Christ%27s_School_Ado_Ekiti.jpg"],
  ["ijero-grammar-school.jpg", "https://www.dohertyijero.com.ng/wp-content/uploads/first-lady-benefits.jpg"],
  ["agile-renovation-2024.jpg", "https://www.ekitistate.gov.ng/wp-content/uploads/IMG-20240726-WA0029-864x380.jpg"],
  ["school-renovation-2024.jpg", "https://www.ekitistate.gov.ng/wp-content/uploads/IMG-20240223-WA0015-864x380.jpg"],
  ["ola-oluwa-before.jpg", "http://ekitistate.gov.ng/wp-content/uploads/2012/09/OLA-OLUWA-BEFORE-1.jpg"],
  ["methodist-aaye.jpg", "http://ekitistate.gov.ng/wp-content/uploads/2012/09/REHABILITATION.jpg"],
  ["cps-ido-ekiti.jpg", "http://ekitistate.gov.ng/wp-content/uploads/2012/09/OLA-OLUWA-1.jpg"],
  ["cps-ijero.jpg", "https://www.dohertyijero.com.ng/wp-content/uploads/426178676_694799856101599_8630357231692097119_n-390x220.jpg"],
];

async function download(name, url) {
  fs.mkdirSync(OUT, { recursive: true });
  const dest = path.join(OUT, name);
  await new Promise((r) => setTimeout(r, 2000));
  const res = await fetch(url, { headers: { "User-Agent": "USSAP/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${name}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log("ok", name);
}

for (const [name, url] of SOURCES) {
  try {
    await download(name, url);
  } catch (e) {
    console.error("skip", name, e.message);
  }
}
