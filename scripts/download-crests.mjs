/**
 * Download national team crests to public/crests/{FIFA_CODE}.png
 * Run: node scripts/download-crests.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/crests');

const TEAMS = [
  { code: 'MEX', search: 'Mexico' },
  { code: 'RSA', search: 'South Africa' },
  { code: 'KOR', search: 'South Korea' },
  { code: 'CZE', search: 'Czech Republic' },
  { code: 'CAN', search: 'Canada' },
  { code: 'BIH', search: 'Bosnia' },
  { code: 'QAT', search: 'Qatar' },
  { code: 'SUI', search: 'Switzerland' },
  { code: 'BRA', search: 'Brazil' },
  { code: 'MAR', search: 'Morocco' },
  { code: 'HAI', search: 'Haiti' },
  { code: 'SCO', search: 'Scotland' },
  { code: 'USA', search: 'United States' },
  { code: 'PAR', search: 'Paraguay' },
  { code: 'AUS', search: 'Australia' },
  { code: 'TUR', search: 'Turkey' },
  { code: 'GER', search: 'Germany' },
  { code: 'CUW', search: 'Curacao' },
  { code: 'CIV', search: 'Ivory Coast' },
  { code: 'ECU', search: 'Ecuador' },
  { code: 'NED', search: 'Netherlands' },
  { code: 'JPN', search: 'Japan' },
  { code: 'SWE', search: 'Sweden' },
  { code: 'TUN', search: 'Tunisia' },
  { code: 'BEL', search: 'Belgium' },
  { code: 'EGY', search: 'Egypt' },
  { code: 'IRN', search: 'Iran' },
  { code: 'NZL', search: 'New Zealand' },
  { code: 'ESP', search: 'Spain' },
  { code: 'CPV', search: 'Cape Verde' },
  { code: 'KSA', search: 'Saudi Arabia' },
  { code: 'URU', search: 'Uruguay' },
  { code: 'FRA', search: 'France' },
  { code: 'SEN', search: 'Senegal' },
  { code: 'IRQ', search: 'Iraq' },
  { code: 'NOR', search: 'Norway' },
  { code: 'ARG', search: 'Argentina' },
  { code: 'ALG', search: 'Algeria' },
  { code: 'AUT', search: 'Austria' },
  { code: 'JOR', search: 'Jordan' },
  { code: 'POR', search: 'Portugal' },
  { code: 'COD', search: 'Congo DR' },
  { code: 'UZB', search: 'Uzbekistan' },
  { code: 'COL', search: 'Colombia' },
  { code: 'ENG', search: 'England' },
  { code: 'CRO', search: 'Croatia' },
  { code: 'PAN', search: 'Panama' },
  { code: 'GHA', search: 'Ghana' },
];

async function findBadge(search) {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(search)}`;
  const res = await fetch(url);
  const data = await res.json();
  const teams = data.teams ?? [];
  const national = teams.find((t) => /national|soccer/i.test(t.strTeam ?? '')) ?? teams[0];
  return national?.strBadge ?? national?.strTeamBadge ?? null;
}

async function downloadImage(imgUrl, dest) {
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

await mkdir(OUT_DIR, { recursive: true });

let ok = 0;
let fail = 0;

for (const team of TEAMS) {
  const dest = join(OUT_DIR, `${team.code}.png`);
  try {
    const badge = await findBadge(team.search);
    if (!badge) throw new Error('No badge found');
    await downloadImage(badge, dest);
    console.log(`OK  ${team.code} <- ${badge}`);
    ok++;
  } catch (e) {
    console.warn(`FAIL ${team.code}: ${e.message}`);
    fail++;
  }
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);
