(function () {
  if (!window.MTN) window.MTN = {};

  const MAP = {
    // Metin Döş - Kurumsal kod sistemi (ERP)
    // İstenen formatlar:
    //  - Usta:      UST0001
    //  - Tedarikçi: MALZMCİ0001
    //  - Cari:      CARİ0001
    musteri: "CARİ",
    tedarikci: "MALZMCİ",
    usta: "UST"
  };

  // Eski sürümlerde kullanılan kod önekleri ile uyumluluk
  // (veri kaybı olmasın, eski cariler düzenlenebilsin)
  const ALIASES = {
    musteri: ["CARİ", "CARI", "CAR"],
    tedarikci: ["MALZMCİ", "MALZMCI", "MTN"],
    usta: ["UST"]
  };

  // Yeni standart: 4 haneli sıra (0001)
  // Eski veriler 5 haneli olabilir (00001). Okuma tarafında ikisini de kabul ediyoruz.
  const SERIAL_WIDTH = 4;

  // Kod normalizasyonu (Türkçe karakter + boşluk temizleme)
  function normalizeCode(code) {
    return String(code || "").trim().replace(/\s+/g, "").toLocaleUpperCase('tr-TR');
  }

  // Canonical form: benzersizlik kontrolünde İ/I, Ş/S gibi varyantları aynı say.
  function canonicalize(code) {
    return normalizeCode(code)
      .replace(/İ/g, 'I')
      .replace(/İ/g, 'I')
      .replace(/Ş/g, 'S')
      .replace(/Ç/g, 'C')
      .replace(/Ğ/g, 'G')
      .replace(/Ü/g, 'U')
      .replace(/Ö/g, 'O');
  }

  function padSerial(n) {
    const x = Math.max(0, Number(n) || 0);
    return String(Math.floor(x)).padStart(SERIAL_WIDTH, "0");
  }

  function prefixFor(type) {
    const t = String(type || "").toLowerCase().trim();
    return MAP[t] || "CARİ";
  }

  function validPrefixesFor(type) {
    const t = String(type || "").toLowerCase().trim();
    return ALIASES[t] || [prefixFor(t)];
  }

  function regexFor(prefix) {
    // Yeni 4 hane + Eski 5 hane uyum
    return new RegExp("^" + prefix + "(\\d{4}|\\d{5})$");
  }

  function counterKey(prefix) {
    return "mtn_code_counter_" + prefix;
  }

  function readCounter(prefix) {
    try {
      const v = Number(localStorage.getItem(counterKey(prefix)) || "0");
      return Number.isFinite(v) ? v : 0;
    } catch (_) {
      return 0;
    }
  }

  function writeCounter(prefix, n) {
    try {
      localStorage.setItem(counterKey(prefix), String(n));
    } catch (_) {}
  }

  function maxExisting(prefix, customers, excludeId) {
    let max = 0;
    const re = new RegExp("^" + prefix + "(\\d+)$");
    (customers || []).forEach(c => {
      if (excludeId && c && c.id === excludeId) return;
      const code = String((c && c.code) || "");
      const m = code.match(re);
      if (!m) return;
      const num = Number(m[1]);
      if (Number.isFinite(num) && num > max) max = num;
    });
    return max;
  }

  function nextCode(prefix, customers, excludeId) {
    const maxInData = maxExisting(prefix, customers, excludeId);
    const maxInLs = readCounter(prefix);
    const next = Math.max(maxInData, maxInLs) + 1;
    writeCounter(prefix, next);
    return prefix + padSerial(next);
  }

  function validateCariCode(type, code) {
    const c = normalizeCode(code);
    if (!c) return false;
    const prefixes = validPrefixesFor(type);
    return prefixes.some((p) => regexFor(p).test(c));
  }

  window.MTN.Codes = {
    prefixFor,
    validPrefixesFor,
    nextCariCode(type, customers, excludeId) {
      // Alias uyumu: CARİ/CARI/CAR veya MALZMCİ/MALZMCI/MTN gibi eski kodları da say.
      const desired = prefixFor(type);
      const prefixes = validPrefixesFor(type);
      let maxInData = 0;
      prefixes.forEach((p) => { maxInData = Math.max(maxInData, maxExisting(p, customers, excludeId)); });
      let maxInLs = 0;
      prefixes.forEach((p) => { maxInLs = Math.max(maxInLs, readCounter(p)); });
      const next = Math.max(maxInData, maxInLs) + 1;
      writeCounter(desired, next);
      return desired + padSerial(next);
    },
    validateCariCode,
    ensureUnique(code, customers, excludeId) {
      const c = canonicalize(code);
      if (!c) return true;
      const hit = (customers || []).some(x => {
        if (!x) return false;
        if (excludeId && x.id === excludeId) return false;
        return canonicalize(x.code) === c;
      });
      return !hit;
    }
  };
})();
