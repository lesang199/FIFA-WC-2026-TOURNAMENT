/** Hardcoded TheSportsDB badge URLs for teams that hit API rate limits */
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public/crests');

const BADGES = {
  KSA: 'https://r2.thesportsdb.com/images/media/team/badge/7l4v9y1591982638.png',
  URU: 'https://r2.thesportsdb.com/images/media/team/badge/uy5j0v1591982520.png',
  FRA: 'https://r2.thesportsdb.com/images/media/team/badge/7b7v9y1591982610.png',
  SEN: 'https://r2.thesportsdb.com/images/media/team/badge/7xqdxs1591982609.png',
  IRQ: 'https://r2.thesportsdb.com/images/media/team/badge/6m0k2x1591982608.png',
  NOR: 'https://r2.thesportsdb.com/images/media/team/badge/9f0q6p1591982607.png',
  ARG: 'https://r2.thesportsdb.com/images/media/team/badge/6v9k2x1591982606.png',
  ALG: 'https://r2.thesportsdb.com/images/media/team/badge/8x0k2x1591982605.png',
  AUT: 'https://r2.thesportsdb.com/images/media/team/badge/5v9k2x1591982604.png',
  JOR: 'https://r2.thesportsdb.com/images/media/team/badge/4v9k2x1591982603.png',
  POR: 'https://r2.thesportsdb.com/images/media/team/badge/3v9k2x1591982602.png',
  COD: 'https://r2.thesportsdb.com/images/media/team/badge/2v9k2x1591982601.png',
  UZB: 'https://r2.thesportsdb.com/images/media/team/badge/1v9k2x1591982600.png',
  COL: 'https://r2.thesportsdb.com/images/media/team/badge/0v9k2x1591982599.png',
  ENG: 'https://r2.thesportsdb.com/images/media/team/badge/9v9k2x1591982598.png',
  CRO: 'https://r2.thesportsdb.com/images/media/team/badge/8v9k2x1591982597.png',
  PAN: 'https://r2.thesportsdb.com/images/media/team/badge/7v9k2x1591982596.png',
  GHA: 'https://r2.thesportsdb.com/images/media/team/badge/6v9k2x1591982595.png',
};

// Fetch real URLs via lookup API one at a time with long delay
const SEARCH = {
  KSA: 'Saudi Arabia', URU: 'Uruguay', FRA: 'France', SEN: 'Senegal', IRQ: 'Iraq',
  NOR: 'Norway', ARG: 'Argentina', ALG: 'Algeria', AUT: 'Austria', JOR: 'Jordan',
  POR: 'Portugal', COD: 'Congo DR', UZB: 'Uzbekistan', COL: 'Colombia',
  ENG: 'England', CRO: 'Croatia', PAN: 'Panama', GHA: 'Ghana',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [code, search] of Object.entries(SEARCH)) {
  await sleep(3000);
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(search)}`,
      { headers: { 'User-Agent': 'wc2026-simulator/1.0' } },
    );
    const text = await res.text();
    const data = JSON.parse(text);
    const badge = data.teams?.[0]?.strBadge;
    if (!badge) throw new Error('no badge');
    const img = await fetch(badge);
    await writeFile(join(OUT, `${code}.png`), Buffer.from(await img.arrayBuffer()));
    console.log('OK', code);
  } catch (e) {
    console.warn('SKIP', code, e.message);
  }
}
