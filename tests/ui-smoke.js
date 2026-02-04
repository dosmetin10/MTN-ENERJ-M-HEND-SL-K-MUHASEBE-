const fs = require('fs');
const path = require('path');

const read = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

const indexHtml = read('src/renderer/index.html');
const tourConfig = read('src/renderer/tour-config.js');
const mainJs = read('src/main.js');

const checks = [
  {
    name: 'Cari detay bölümü mevcut',
    ok: indexHtml.includes('id="customer-detail-section"')
  },
  {
    name: 'Malzeme listesi arama alanı mevcut',
    ok: indexHtml.includes('id="stock-list-search"')
  },
  {
    name: 'Malzeme listesi tablo alanı mevcut',
    ok: indexHtml.includes('id="stock-list-table"')
  },
  {
    name: 'Yardım/Tur anahtarı mevcut',
    ok: indexHtml.includes('id="tour-enabled"')
  },
  {
    name: 'Stock list tur adımları tanımlı',
    ok: /"stock-list-panel"\s*:\s*\[/m.test(tourConfig)
  },
  {
    name: 'PDF şablonunda logo alanı var',
    ok: mainJs.includes('report-logo-img')
  }
];

let failed = 0;
checks.forEach((check) => {
  if (!check.ok) {
    failed += 1;
    console.error(`FAIL: ${check.name}`);
  } else {
    console.log(`PASS: ${check.name}`);
  }
});

if (failed > 0) {
  console.error(`\n${failed} kontrol başarısız.`);
  process.exit(1);
}

console.log('\nTüm UI smoke kontrolleri geçti.');
