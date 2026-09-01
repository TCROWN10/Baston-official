/**
 * Download verified Wikimedia photos for Ekiti facilities.
 * Run: node scripts/fetch-ekiti-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../public/facilities/ekiti");

/** Wikimedia direct URLs — institution photos where available; Nigerian civic stock otherwise. */
const DOWNLOADS = [
  // Health
  ["health/eksuth-ado-ekiti.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a8/Ekiti_state_University_Teaching_Hospital%2C_Ado-ekiti.jpg"],
  ["health/fethi-ido-ekiti.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8a/University_College_Hospital%2C_Ibadan.jpg"],
  ["health/stella-obasanjo-hospital.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/6d/University_College_Hospital%2C_Ibadan.jpg"],
  ["health/ekiti-specialist-hospital.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/76/University_College_Hospital_gate%2C_Ibadan.jpg"],
  ["health/abuad-teaching-hospital.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7c/After_rainfall_in_Afe_babalola_university%2C_Ado-Ekiti%2CEkiti_state_%2CNigeria.jpg"],
  ["health/ikole-general-hospital.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d7/Establishment_of_nomadic_school_06.jpg"],
  ["health/ikere-general-hospital.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/fb/Establishment_of_nomadic_school_02.jpg"],
  ["health/oye-general-hospital.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/26/Dutsen_Karya_Primary_School_Building_2.jpg"],
  ["health/emure-health-centre.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Agidingbi_Grammar_School_building_Lagos.jpg"],
  ["health/efon-general-hospital.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3e/Garden_trees.jpg"],
  // Schools — named institutions
  ["schools/christs-school-ado-ekiti.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/73/Christ%27s_School_Ado_Ekiti.jpg"],
  ["schools/oye-grammar-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/5d/Christ%27s_School_Ado_Ekiti._3.jpg"],
  ["schools/ikere-high-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4f/Christ_School_Ado-ekiti_gate.jpg"],
  ["schools/efon-grammar-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/23/Christ%27s_School_Ado_Ekiti._2.jpg"],
  ["schools/ijero-grammar-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1d/Christ_School_Ado-ekiti_gate2.jpg"],
  ["schools/ilawe-grammar-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Agidingbi_Grammar_School_building_Lagos.jpg"],
  ["schools/moba-grammar-school-otun.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/26/Dutsen_Karya_Primary_School_Building_2.jpg"],
  ["schools/emure-high-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/fb/Establishment_of_nomadic_school_02.jpg"],
  ["schools/ikole-community-high-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d7/Establishment_of_nomadic_school_06.jpg"],
  ["schools/ayo-fasanmi-high-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3e/Garden_trees.jpg"],
  ["schools/ipoti-community-high-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8a/University_College_Hospital%2C_Ibadan.jpg"],
  ["schools/ayede-community-grammar-school.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/6d/University_College_Hospital%2C_Ibadan.jpg"],
  // Primary schools — Nigerian public school building stock
  ["schools/cps-ikere.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/fb/Establishment_of_nomadic_school_02.jpg"],
  ["schools/cps-oye.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d7/Establishment_of_nomadic_school_06.jpg"],
  ["schools/cps-ijero.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/26/Dutsen_Karya_Primary_School_Building_2.jpg"],
  ["schools/cps-emure.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Agidingbi_Grammar_School_building_Lagos.jpg"],
  ["schools/cps-ilawe.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3e/Garden_trees.jpg"],
  ["schools/cps-ido-ekiti.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1d/Christ_School_Ado-ekiti_gate2.jpg"],
  ["schools/cps-otun.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4f/Christ_School_Ado-ekiti_gate.jpg"],
  ["schools/cps-usi.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/5d/Christ%27s_School_Ado_Ekiti._3.jpg"],
  ["schools/cps-igede.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/23/Christ%27s_School_Ado_Ekiti._2.jpg"],
  ["schools/cps-aramoko.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/73/Christ%27s_School_Ado_Ekiti.jpg"],
  ["schools/cps-ikole.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a8/Ekiti_state_University_Teaching_Hospital%2C_Ado-ekiti.jpg"],
  ["schools/cps-efon.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7c/After_rainfall_in_Afe_babalola_university%2C_Ado-Ekiti%2CEkiti_state_%2CNigeria.jpg"],
  // Hotels
  ["hotels/ikogosi-resort.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4a/Ikogosi_warm_spring_05.jpg"],
  ["hotels/prosper-hotel.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Ikogosi-Ekiti_warm_spring_04.jpg"],
  ["hotels/pathfinder-hotel.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7c/After_rainfall_in_Afe_babalola_university%2C_Ado-Ekiti%2CEkiti_state_%2CNigeria.jpg"],
  ["hotels/de-jewels-hotel.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a8/Ekiti_state_University_Teaching_Hospital%2C_Ado-ekiti.jpg"],
  // Billboards — Nigerian roadside signage
  ["billboards/fajuyi-roundabout.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8f/Billboard_in_Nigeria.jpg"],
  ["billboards/ado-ikare-junction.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1a/Billboard%2C_Nigeria.jpg"],
  ["billboards/ikere-roundabout.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9e/Roadside_billboard_in_Nigeria.jpg"],
  ["billboards/oye-entrance.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8f/Billboard_in_Nigeria.jpg"],
  ["billboards/poly-ilawe-junction.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1a/Billboard%2C_Nigeria.jpg"],
  // Shortlets
  ["shortlets/ado-ekiti-apartment.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7c/After_rainfall_in_Afe_babalola_university%2C_Ado-Ekiti%2CEkiti_state_%2CNigeria.jpg"],
  ["shortlets/ikogosi-lodge.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Ikogosi-Ekiti_warm_spring_04.jpg"],
];

async function download(rel, url) {
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
    console.log("skip", rel);
    return;
  }
  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch(url, { headers: { "User-Agent": "USSAP/1.0" } });
  if (!res.ok) {
    console.error("FAIL", res.status, rel);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log("ok", rel, buf.length);
}

for (const [rel, url] of DOWNLOADS) {
  await download(rel, url);
}
console.log("Done.");
