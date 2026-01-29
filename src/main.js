const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const zlib = require("zlib");

const storageFileName = "mtn-data.json";
const settingsFileName = "mtn-settings.json";

const getDefaultData = () => ({
  customers: [],
  customerDebts: [],
  customerJobs: [],
  stocks: [],
  stockReceipts: [],
  cashTransactions: [],
  sales: [],
  stockMovements: [],
  invoices: [],
  accounts: [],
  ledgerEntries: [],
  unitConversions: [],
  auditLogs: [],
  proposals: [],
  periods: [],
  periodBatches: [],
  periodLocks: []
});

const getDefaultAccounts = () => [
  { code: "100", name: "KASA", type: "varlik" },
  { code: "102", name: "BANKALAR", type: "varlik" },
  { code: "120", name: "ALICILAR", type: "varlik" },
  { code: "320", name: "SATICILAR", type: "yukumluluk" },
  { code: "153", name: "TİCARİ MALLAR", type: "varlik" },
  { code: "600", name: "YURTİÇİ SATIŞLAR", type: "gelir" },
  { code: "620", name: "SATILAN MALIN MALİYETİ", type: "gider" },
  { code: "191", name: "İNDİRİLECEK KDV", type: "varlik" },
  { code: "391", name: "HESAPLANAN KDV", type: "yukumluluk" }
];


const loadStorage = async () => {
  const filePath = path.join(app.getPath("userData"), storageFileName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return normalizeData(JSON.parse(raw));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  const data = getDefaultData();
  await saveStorage(data);
  return data;
};

const saveStorage = async (data) => {
  const filePath = path.join(app.getPath("userData"), storageFileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
};

const loadBackupFile = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return parsed?.data ? parsed.data : parsed;
};

const loadSettings = async () => {
  const filePath = path.join(app.getPath("userData"), settingsFileName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  return {
    autoSyncPath: "",
    cloudBackupPath: "",
    enableAutoSync: false,
    enableCloudBackup: false,
    enableAutoBackup: false,
    lastAutoBackupAt: "",
    hasOnboarded: false,
    onboardingStep: 0,
    onboardingCompletedAt: "",
    companyName: "MTN ENERJİ MÜHENDİSLİK (METİN DÖŞ)",
    companyOwner: "Metin Döş",
    companyAddress:
      "Ertuğrulgazi Mah. Suyolu Cad. No:77 Şahinbey / Gaziantep",
    companyPhone: "05356419061",
    companyIban: "TR13 0011 1000 0000 0136 9157 74",
    companyBank: "FİNANSBANK",
    taxOffice: "ŞAHİNBEY",
    taxNumber: "14168163156",
    logoDataUrl: "",
    backupFolder: "",
    currentPeriodYear: new Date().getFullYear(),
    enableTour: true,
    autoUpdateEnabled: true,
    autoUpdateLastCheckedAt: "",
    autoUpdateChannel: "stable",
    defaultCashName: "Ana Kasa",
    defaultWarehouse: "Ana Depo",
    stockValuationMethod: "ortalama",
    users: [],
    licenseKey: ""
  };
};

const getBackupBaseDir = () =>
  path.join(app.getPath("documents"), "MTN-Muhasebe-Yedekler");

const getAttachmentBaseDir = () =>
  path.join(app.getPath("userData"), "attachments");

const saveAttachment = async ({ path: filePath, name, category }) => {
  if (!filePath) {
    return null;
  }
  const baseDir = getAttachmentBaseDir();
  await fs.mkdir(baseDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = name ? name.replace(/[^\w.-]+/g, "_") : "dosya";
  const targetName = `${category || "dosya"}-${timestamp}-${safeName}`;
  const targetPath = path.join(baseDir, targetName);
  await fs.copyFile(filePath, targetPath);
  return {
    path: targetPath,
    name: name || targetName,
    createdAt: new Date().toISOString()
  };
};

const createBackupEntry = async (payload) => {
  const baseDir = getBackupBaseDir();
  await fs.mkdir(baseDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(baseDir, `Yedek-${timestamp}`);
  await fs.mkdir(backupDir, { recursive: true });
  const backupPayload = {
    createdAt: new Date().toISOString(),
    ...payload
  };
  await fs.writeFile(
    path.join(backupDir, "yedek.json"),
    JSON.stringify(backupPayload, null, 2),
    "utf8"
  );
  return { backupDir, createdAt: backupPayload.createdAt };
};

const maybeAutoBackup = async (data) => {
  const settings = await loadSettings();
  if (!settings.enableAutoBackup) {
    return;
  }
  const lastRun = settings.lastAutoBackupAt
    ? new Date(settings.lastAutoBackupAt)
    : null;
  const now = new Date();
  if (lastRun && now - lastRun < 1000 * 60 * 60) {
    return;
  }
  await createBackupEntry({
    meta: {
      module: "auto-backup",
      appVersion: "0.1.0"
    },
    data
  });
  await saveSettings({ ...settings, lastAutoBackupAt: now.toISOString() });
};

const saveSettings = async (settings) => {
  const filePath = path.join(app.getPath("userData"), settingsFileName);
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2), "utf8");
};

const syncStorageCopies = async (data) => {
  const settings = await loadSettings();
  const payload = JSON.stringify(data, null, 2);
  const tasks = [];
  if (settings.enableAutoSync && settings.autoSyncPath) {
    const target = path.join(settings.autoSyncPath, storageFileName);
    tasks.push(fs.writeFile(target, payload, "utf8"));
  }
  if (settings.enableCloudBackup && settings.cloudBackupPath) {
    const target = path.join(settings.cloudBackupPath, storageFileName);
    tasks.push(fs.writeFile(target, payload, "utf8"));
  }
  await Promise.allSettled(tasks);
};

const createRecord = (items, record) => {
  const { createdAt, ...rest } = record;
  return [
    ...items,
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: createdAt
        ? new Date(createdAt).toISOString()
        : new Date().toISOString(),
      ...rest
    }
  ];
};

const normalizeNumber = (value) => Number(value || 0);

const getCurrentPeriodYear = (settings) =>
  Number(settings?.currentPeriodYear) || new Date().getFullYear();

const resolvePeriodYear = (record, fallbackYear) => {
  if (record?.periodYear) {
    return Number(record.periodYear);
  }
  const createdAt = record?.createdAt || record?.date || record?.issuedAt;
  const parsed = createdAt ? new Date(createdAt) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    return parsed.getFullYear();
  }
  return Number(fallbackYear);
};

const ensurePeriods = (periods, year) => {
  const normalizedYear = Number(year);
  const exists = periods.find((period) => Number(period.year) === normalizedYear);
  if (exists) {
    return periods;
  }
  return [
    ...periods,
    {
      year: normalizedYear,
      status: "open",
      locked: false,
      createdAt: new Date().toISOString()
    }
  ];
};

const ensurePeriodLock = (periodLocks, year, locked) => {
  const normalizedYear = Number(year);
  const cleaned = (periodLocks || []).filter(
    (item) => Number(item.year) !== normalizedYear
  );
  if (!locked) {
    return cleaned;
  }
  return [
    ...cleaned,
    {
      year: normalizedYear,
      lockedAt: new Date().toISOString()
    }
  ];
};

const isPeriodLocked = (data, year) => {
  const normalizedYear = Number(year);
  return (data.periodLocks || []).some(
    (entry) => Number(entry.year) === normalizedYear
  );
};

const normalizeSpaces = (value) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
};

const fixTurkishTypos = (value) => {
  return value
    .replaceAll("MANSON", "MANŞON")
    .replaceAll("KOLLEKTOR", "KOLLEKTÖR")
    .replaceAll("KOLLEKOR", "KOLLEKTÖR");
};

const inchToQMap = new Map([
  ["1/2", "Q20"],
  ["3/4", "Q25"],
  ["1", "Q32"],
  ["1 1/4", "Q40"],
  ["1 1/2", "Q50"],
  ["2", "Q63"]
]);

const normalizeStockName = (value) => {
  if (!value) {
    return "";
  }
  let next = normalizeSpaces(String(value).toLocaleUpperCase("tr-TR"));
  next = next.replaceAll("İNC", "İNÇ").replaceAll("INCH", "İNÇ");
  next = fixTurkishTypos(next);
  next = next.replace(/(\d)\s*"\s*(\d)/g, "$1/$2\"");
  next = next.replace(/(\d)\s*\/\s*(\d)/g, "$1/$2");
  const inchMatch = next.match(/(\d+(?:\s*\d\/\d)?)\s*İNÇ/);
  if (inchMatch) {
    const inchValue = normalizeSpaces(inchMatch[1]);
    const qValue = inchToQMap.get(inchValue);
    if (qValue) {
      next = next.replace(inchMatch[0], `${qValue} LİK`);
    }
    if (!next.includes("PPRC")) {
      next = `${next} PPRC`;
    }
  }
  return normalizeSpaces(next);
};

const resolveWarehouse = (value, settings) => {
  if (value) {
    return value;
  }
  return settings?.defaultWarehouse || "Ana Depo";
};

const pruneAuditLogs = (logs) => {
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
  return (logs || []).filter((entry) => {
    const createdAt = new Date(entry.createdAt || 0).getTime();
    return Number.isNaN(createdAt) || createdAt >= cutoff;
  });
};

const normalizeData = (data) => ({
  ...getDefaultData(),
  ...data,
  periods: data.periods || [],
  periodBatches: data.periodBatches || [],
  periodLocks: data.periodLocks || [],
  customers: (data.customers || []).map((customer) => ({
    ...customer,
    normalizedName:
      customer.normalizedName || normalizeSpaces(customer.name || ""),
    isActive: customer.isActive !== false
  })),
  customerDebts: (data.customerDebts || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  customerJobs: (data.customerJobs || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  stocks: (data.stocks || []).map((stock) => ({
    ...stock,
    normalizedName: stock.normalizedName || normalizeStockName(stock.name || ""),
    warehouse: stock.warehouse || "Ana Depo",
    isActive: stock.isActive !== false
  })),
  stockReceipts: (data.stockReceipts || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  cashTransactions: (data.cashTransactions || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  sales: (data.sales || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  stockMovements: (data.stockMovements || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  invoices: (data.invoices || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  accounts: (data.accounts && data.accounts.length ? data.accounts : getDefaultAccounts()).map(
    (account) => ({
      ...account,
      code: String(account.code || "").trim(),
      name: normalizeSpaces(account.name || "")
    })
  ),
  ledgerEntries: (data.ledgerEntries || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  })),
  unitConversions: data.unitConversions || [],
  auditLogs: pruneAuditLogs(data.auditLogs || []),
  proposals: (data.proposals || []).map((entry) => ({
    ...entry,
    periodYear: resolvePeriodYear(entry, new Date().getFullYear())
  }))
});

const calculatePeriodPreview = (data, year) => {
  const periodYear = Number(year);
  const cashTransactions = (data.cashTransactions || []).filter(
    (entry) => Number(entry.periodYear) === periodYear
  );
  const cashIncome = cashTransactions
    .filter((entry) => entry.type === "gelir")
    .reduce((sum, entry) => sum + normalizeNumber(entry.amount), 0);
  const cashExpense = cashTransactions
    .filter((entry) => entry.type === "gider")
    .reduce((sum, entry) => sum + normalizeNumber(entry.amount), 0);
  const cashBalance = cashIncome - cashExpense;

  const customerBalances = (data.customers || [])
    .map((customer) => ({
      customerId: customer.id,
      customerName: customer.name,
      balance: normalizeNumber(customer.balance)
    }))
    .filter((entry) => entry.balance !== 0);

  const stockSnapshots = (data.stocks || []).map((stock) => {
    const quantity = normalizeNumber(stock.quantity);
    const unitPrice = normalizeNumber(stock.purchasePrice || stock.salePrice);
    return {
      stockId: stock.id,
      stockName: stock.name,
      quantity,
      unitPrice,
      totalValue: quantity * unitPrice
    };
  });
  const stockValue = stockSnapshots.reduce(
    (sum, item) => sum + normalizeNumber(item.totalValue),
    0
  );

  return {
    periodYear,
    toYear: periodYear + 1,
    cashBalance,
    cashIncome,
    cashExpense,
    customerCount: customerBalances.length,
    customerBalances,
    stockCount: stockSnapshots.length,
    stockValue,
    stockSnapshots
  };
};

const addAuditLog = (data, entry) => {
  data.auditLogs = pruneAuditLogs(createRecord(data.auditLogs, entry));
};

const addLedgerEntry = (data, entry) => {
  data.ledgerEntries = createRecord(data.ledgerEntries, entry);
};

const detectDelimiter = (line) => {
  const counts = {
    ",": (line.match(/,/g) || []).length,
    ";": (line.match(/;/g) || []).length,
    "\t": (line.match(/\t/g) || []).length
  };
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
};

const splitCsvLine = (line, delimiter) => {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === delimiter && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values.map((cell) => cell.trim());
};

const parseCsvContent = (content) => {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) {
    return [];
  }
  const delimiter = detectDelimiter(lines[0]);
  const header = splitCsvLine(lines[0], delimiter);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line, delimiter);
    const row = {};
    header.forEach((key, index) => {
      row[key] = values[index] || "";
    });
    return row;
  });
};

const normalizeHeaderKey = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replaceAll("İ", "I")
    .replaceAll("Ş", "S")
    .replaceAll("Ğ", "G")
    .replaceAll("Ü", "U")
    .replaceAll("Ö", "O")
    .replaceAll("Ç", "C")
    .replace(/\s+/g, "");

const normalizeImportRow = (row) => {
  const normalized = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    normalized[normalizeHeaderKey(key)] = value;
  });
  return normalized;
};

const mapImportRow = (row) => {
  const normalized = normalizeImportRow(row);
  return {
    code:
      normalized.STOKKODU ||
      normalized.KOD ||
      normalized.CODE ||
      row.code ||
      "",
    name:
      normalized.MALZEMEADI ||
      normalized.STOKADI ||
      normalized.NAME ||
      row.name ||
      "",
    quantity:
      normalized.ADET ||
      normalized.MIKTAR ||
      normalized.QUANTITY ||
      row.quantity ||
      "",
    unit: normalized.BIRIM || normalized.UNIT || row.unit || "",
    diameter: normalized.CAP || normalized.DIAMETER || row.diameter || ""
  };
};

const extractPdfText = (content) => {
  const text = [];
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match = null;
  while ((match = tjRegex.exec(content)) !== null) {
    text.push(match[1]);
  }
  const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(content)) !== null) {
    const parts = match[1].match(/\(([^)]+)\)/g) || [];
    parts.forEach((part) => {
      text.push(part.replace(/[()]/g, ""));
    });
  }
  return decodeXmlEntities(text.join("\n"));
};

const parsePdfFile = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const content = buffer.toString("latin1");
  const rawText = extractPdfText(content);
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) {
    return [];
  }
  const header = lines[0].split(/\s{2,}|\t/).map((cell) => cell.trim());
  if (header.length >= 2 && lines.length > 1) {
    return lines.slice(1).map((line) => {
      const cells = line.split(/\s{2,}|\t/).map((cell) => cell.trim());
      const row = {};
      header.forEach((key, index) => {
        row[key] = cells[index] || "";
      });
      return row;
    });
  }
  return lines.map((line) => {
    const parts = line.split(/\s+/);
    const quantity = parts.pop();
    return {
      "MALZEME ADI": parts.join(" "),
      "ADET": quantity
    };
  });
};

const decodeXmlEntities = (value) =>
  String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 10))
    );

const findZipCentralDirectory = (buffer) => {
  const signature = 0x06054b50;
  const minOffset = Math.max(0, buffer.length - 0x10000);
  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === signature) {
      return offset;
    }
  }
  return -1;
};

const readZipEntries = (buffer) => {
  const centralDirectoryOffset = findZipCentralDirectory(buffer);
  if (centralDirectoryOffset < 0) {
    throw new Error("ZIP merkezi dizini bulunamadı.");
  }
  const totalEntries = buffer.readUInt16LE(centralDirectoryOffset + 10);
  const directoryStart = buffer.readUInt32LE(centralDirectoryOffset + 16);
  let offset = directoryStart;
  const entries = {};
  for (let index = 0; index < totalEntries; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      break;
    }
    const compression = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const nameStart = offset + 46;
    const nameEnd = nameStart + fileNameLength;
    const fileName = buffer.slice(nameStart, nameEnd).toString("utf8");
    offset = nameEnd + extraLength + commentLength;
    if (!fileName) {
      continue;
    }
    if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
      continue;
    }
    const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressedData = buffer.slice(dataStart, dataStart + compressedSize);
    let contentBuffer = null;
    if (compression === 0) {
      contentBuffer = compressedData;
    } else if (compression === 8) {
      contentBuffer = zlib.inflateRawSync(compressedData);
    }
    if (contentBuffer) {
      entries[fileName] = contentBuffer.toString("utf8");
    }
  }
  return entries;
};

const columnLabelToIndex = (label) => {
  let result = 0;
  for (const char of label) {
    result = result * 26 + (char.charCodeAt(0) - 64);
  }
  return result - 1;
};

const parseSharedStrings = (xml) => {
  if (!xml) {
    return [];
  }
  const matches = xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g);
  return Array.from(matches, (match) => decodeXmlEntities(match[1]));
};

const parseWorksheetRows = (xml, sharedStrings) => {
  const rows = [];
  const cellRegex = /<c[^>]*r="([A-Z]+)(\d+)"[^>]*?(?:t="([^"]+)")?[^>]*>([\s\S]*?)<\/c>/g;
  let match = null;
  while ((match = cellRegex.exec(xml)) !== null) {
    const [, colLetters, rowNumber, cellType, cellXml] = match;
    const rowIndex = Number(rowNumber) - 1;
    const colIndex = columnLabelToIndex(colLetters);
    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }
    let value = "";
    if (cellType === "inlineStr") {
      const inlineMatch = /<t[^>]*>([\s\S]*?)<\/t>/.exec(cellXml);
      value = inlineMatch ? decodeXmlEntities(inlineMatch[1]) : "";
    } else {
      const valueMatch = /<v>([\s\S]*?)<\/v>/.exec(cellXml);
      value = valueMatch ? valueMatch[1] : "";
      if (cellType === "s") {
        const sharedIndex = Number(value);
        value = sharedStrings[sharedIndex] ?? "";
      } else {
        value = decodeXmlEntities(value);
      }
    }
    rows[rowIndex][colIndex] = value;
  }
  return rows.filter((row) => row && row.some((cell) => cell && cell !== ""));
};

const resolveWorksheetPath = (entries) => {
  if (entries["xl/worksheets/sheet1.xml"]) {
    return "xl/worksheets/sheet1.xml";
  }
  const workbookXml = entries["xl/workbook.xml"];
  const relsXml = entries["xl/_rels/workbook.xml.rels"];
  if (!workbookXml || !relsXml) {
    return "";
  }
  const sheetMatch = /<sheet[^>]*r:id="([^"]+)"[^>]*>/i.exec(workbookXml);
  if (!sheetMatch) {
    return "";
  }
  const relId = sheetMatch[1];
  const relRegex = new RegExp(
    `<Relationship[^>]*Id="${relId}"[^>]*Target="([^"]+)"[^>]*>`,
    "i"
  );
  const relMatch = relRegex.exec(relsXml);
  if (!relMatch) {
    return "";
  }
  const target = relMatch[1];
  return target.startsWith("xl/") ? target : `xl/${target}`;
};

const parseXlsxFile = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const entries = readZipEntries(buffer);
  const sharedStrings = parseSharedStrings(entries["xl/sharedStrings.xml"]);
  const sheetPath = resolveWorksheetPath(entries);
  if (!sheetPath || !entries[sheetPath]) {
    throw new Error("Excel çalışma sayfası bulunamadı.");
  }
  const rows = parseWorksheetRows(entries[sheetPath], sharedStrings);
  if (!rows.length) {
    return [];
  }
  const header = rows[0].map((cell) => String(cell || "").trim());
  return rows.slice(1).map((row) => {
    const record = {};
    header.forEach((key, index) => {
      if (!key) {
        return;
      }
      record[key] = row[index] ?? "";
    });
    return record;
  });
};

const parseImportFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".csv") {
    const content = await fs.readFile(filePath, "utf8");
    return { rows: parseCsvContent(content).map(mapImportRow), error: "" };
  }
  if (ext === ".xlsx") {
    try {
      const rows = await parseXlsxFile(filePath);
      return { rows: rows.map(mapImportRow), error: "" };
    } catch (error) {
      return {
        rows: [],
        error: "Excel dosyası okunamadı. Lütfen dosyayı kontrol edin."
      };
    }
  }
  if (ext === ".pdf") {
    try {
      const rows = await parsePdfFile(filePath);
      return { rows: rows.map(mapImportRow), error: "" };
    } catch (error) {
      return {
        rows: [],
        error: "PDF içeriği okunamadı. Lütfen metin tabanlı PDF kullanın."
      };
    }
  }
  return { rows: [], error: "Desteklenmeyen dosya türü." };
};

const analyzeImportRows = (data, rows, warehouse, settings) => {
  const reportRows = [];
  let newCount = 0;
  let updateCount = 0;
  let errorCount = 0;
  rows.forEach((row) => {
    const payload = mapImportRow(row);
    const incomingName = normalizeSpaces(payload.name || "");
    const incomingQuantity = normalizeNumber(payload.quantity);
    const normalizedName = normalizeStockName(incomingName);
    if (!incomingName || incomingQuantity <= 0) {
      errorCount += 1;
      reportRows.push({
        status: "error",
        statusLabel: "Hatalı",
        code: payload.code,
        name: incomingName,
        quantity: payload.quantity,
        unit: payload.unit,
        reason: "Eksik veya geçersiz miktar"
      });
      return;
    }
    const stockIndex = data.stocks.findIndex((stock) => {
      if (payload.code && stock.code === payload.code) {
        return true;
      }
      return (
        stock.normalizedName === normalizedName &&
        stock.warehouse === warehouse
      );
    });
    if (stockIndex >= 0) {
      updateCount += 1;
      reportRows.push({
        status: "update",
        statusLabel: "Güncellenecek",
        code: payload.code || data.stocks[stockIndex].code,
        name: normalizedName,
        quantity: incomingQuantity,
        unit: payload.unit
      });
    } else {
      newCount += 1;
      reportRows.push({
        status: "new",
        statusLabel: "Yeni",
        code: payload.code,
        name: normalizedName,
        quantity: incomingQuantity,
        unit: payload.unit
      });
    }
  });
  return {
    summary: { newCount, updateCount, errorCount },
    rows: reportRows,
    warehouse,
    settings
  };
};

// Varsayım: kritik seviye girilmezse miktarın %10'u (en az 1) kritik eşik kabul edilir.
const getAutoThreshold = (quantity) => {
  const normalized = normalizeNumber(quantity);
  if (normalized <= 0) {
    return 0;
  }
  return Math.max(1, Math.round(normalized * 0.1));
};

const generateCode = (prefix) => {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
  const random = Math.floor(Math.random() * 900 + 100);
  return `${prefix}-${stamp}-${random}`;
};

const upsertStockEntry = (data, payload, meta = {}, settings = {}) => {
  const incomingName = normalizeSpaces(payload.name || "");
  const incomingQuantity = normalizeNumber(payload.quantity);
  if (!incomingName || incomingQuantity <= 0) {
    return { status: "error", reason: "Geçersiz stok adı veya miktar." };
  }
  const normalizedName = normalizeStockName(incomingName);
  const warehouse = resolveWarehouse(payload.warehouse, settings);
  const threshold =
    payload.threshold === "" || payload.threshold === undefined
      ? getAutoThreshold(incomingQuantity)
      : normalizeNumber(payload.threshold);
  const hasCode = Boolean(payload.code);
  const existingIndex = data.stocks.findIndex((stock) => {
    if (hasCode && stock.code === payload.code) {
      return true;
    }
    return (
      stock.normalizedName === normalizedName && stock.warehouse === warehouse
    );
  });
  if (existingIndex >= 0) {
    const existing = data.stocks[existingIndex];
    const nextQuantity =
      normalizeNumber(existing.quantity) + incomingQuantity;
    data.stocks[existingIndex] = {
      ...existing,
      name: incomingName || existing.name,
      normalizedName,
      diameter: payload.diameter || existing.diameter,
      unit: payload.unit || existing.unit,
      purchasePrice:
        payload.purchasePrice !== undefined && payload.purchasePrice !== ""
          ? normalizeNumber(payload.purchasePrice)
          : existing.purchasePrice,
      salePrice:
        payload.salePrice !== undefined && payload.salePrice !== ""
          ? normalizeNumber(payload.salePrice)
          : existing.salePrice,
      vatRate:
        payload.vatRate !== undefined && payload.vatRate !== ""
          ? normalizeNumber(payload.vatRate)
          : existing.vatRate,
      description: payload.description || existing.description,
      warehouse,
      quantity: nextQuantity,
      threshold,
      updatedAt: new Date().toISOString()
    };
    data.stockMovements = createRecord(data.stockMovements, {
      stockName: normalizedName,
      type: "giris",
      quantity: incomingQuantity,
      note: meta.note || "Fiş girişi",
      createdAt: meta.createdAt || payload.createdAt
    });
    return {
      status: "updated",
      name: normalizedName,
      quantity: incomingQuantity,
      total: nextQuantity
    };
  }
  data.stocks = createRecord(data.stocks, {
    code: payload.code || generateCode("STK"),
    name: incomingName,
    normalizedName,
    diameter: payload.diameter,
    unit: payload.unit,
    purchasePrice:
      payload.purchasePrice !== undefined && payload.purchasePrice !== ""
        ? normalizeNumber(payload.purchasePrice)
        : undefined,
    salePrice:
      payload.salePrice !== undefined && payload.salePrice !== ""
        ? normalizeNumber(payload.salePrice)
        : undefined,
    vatRate:
      payload.vatRate !== undefined && payload.vatRate !== ""
        ? normalizeNumber(payload.vatRate)
        : undefined,
    description: payload.description || "",
    warehouse,
    quantity: incomingQuantity,
    threshold,
    isActive: payload.isActive !== false,
    updatedAt: new Date().toISOString()
  });
  data.stockMovements = createRecord(data.stockMovements, {
    stockName: normalizedName,
    type: "giris",
    quantity: incomingQuantity,
    note: meta.note || "Fiş girişi",
    createdAt: meta.createdAt || payload.createdAt
  });
  return {
    status: "created",
    name: normalizedName,
    quantity: incomingQuantity
  };
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#f5f7fb",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.maximize();
  return mainWindow;
};

app.whenReady().then(() => {
  const mainWindow = createWindow();

  ipcMain.handle("backup:create", async (_event, payload) =>
    createBackupEntry(payload)
  );

  ipcMain.handle("attachments:save", async (_event, payload) =>
    saveAttachment(payload)
  );

  ipcMain.handle("file:open", async (_event, filePath) => {
    if (!filePath) {
      return { ok: false };
    }
    const error = await shell.openPath(filePath);
    if (error) {
      return { ok: false, error };
    }
    return { ok: true };
  });

  ipcMain.handle("data:get", async () => loadStorage());
  ipcMain.handle("data:reset", async () => {
    const data = getDefaultData();
    data.accounts = getDefaultAccounts();
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });
  ipcMain.handle("backup:restore", async (_event, payload) => {
    const { path: filePath } = payload || {};
    if (!filePath) {
      return { ok: false, error: "Yedek dosyası seçilmedi." };
    }
    const restored = normalizeData(await loadBackupFile(filePath));
    if (!restored.accounts?.length) {
      restored.accounts = getDefaultAccounts();
    }
    await saveStorage(restored);
    await syncStorageCopies(restored);
    await maybeAutoBackup(restored);
    addAuditLog(restored, {
      module: "backup",
      action: "restore",
      message: "Yedek geri yüklendi."
    });
    await saveStorage(restored);
    return { ok: true, data: restored };
  });

  // ---------------------------------------------------------------------------
  // Engineering index loader
  //
  // Reads pre-defined engineering index files from the renderer assets folder.
  // Allowed names: index, demo_index, isitma_index. Returns the HTML content
  // so the renderer can embed via srcdoc. Rejects other names for security.
  ipcMain.handle('engineering:loadIndex', async (_event, name) => {
    try {
      const allowed = ['index', 'demo_index', 'isitma_index'];
      const safeName = String(name || '').replace(/[^\w]/g, '');
      if (!allowed.includes(safeName)) {
        return { ok: false, error: 'İzin verilmeyen index adı.' };
      }
      // Construct file path relative to renderer assets/engineering
      const filePath = path.join(__dirname, 'renderer', 'assets', 'engineering', `${safeName}.html`);
      const html = await fs.readFile(filePath, 'utf8');
      return { ok: true, html };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  // Attachment opener: opens a file (e.g. Excel) with the default OS handler.
  ipcMain.handle('attachment:open', async (_event, payload) => {
    try {
      const { path: filePath } = payload || {};
      if (!filePath) {
        return { ok: false, error: 'Dosya yolu belirtilmedi.' };
      }
      const error = await shell.openPath(filePath);
      if (error) {
        return { ok: false, error };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });
  ipcMain.handle("settings:get", async () => loadSettings());
  ipcMain.handle("settings:save", async (_event, payload) => {
    await saveSettings(payload);
    return payload;
  });

  ipcMain.handle("periods:preview", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const year = Number(payload?.year || settings.currentPeriodYear || new Date().getFullYear());
    return { ok: true, preview: calculatePeriodPreview(data, year) };
  });

  ipcMain.handle("periods:list", async () => {
    const data = await loadStorage();
    return { ok: true, periods: data.periods || [] };
  });

  ipcMain.handle("periods:batches", async () => {
    const data = await loadStorage();
    return { ok: true, batches: data.periodBatches || [] };
  });

  ipcMain.handle("periods:close", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const year = Number(payload?.year || settings.currentPeriodYear || new Date().getFullYear());
    const toYear = year + 1;
    const lockPeriod = Boolean(payload?.lockPeriod);
    const switchPeriod = payload?.switchPeriod !== false;

    if ((data.periodBatches || []).some((batch) => Number(batch.fromYear) === year)) {
      return { ok: false, error: "Bu dönem için zaten devir işlemi var." };
    }

    const preview = calculatePeriodPreview(data, year);
    await createBackupEntry({
      meta: {
        module: "year-end",
        year,
        appVersion: settings?.appVersion || "0.2.1"
      },
      data
    });

    data.periodBatches = createRecord(data.periodBatches, {
      fromYear: year,
      toYear,
      preview,
      locked: lockPeriod,
      status: "closed",
      label: `Yıl Sonu Devri ${year}`
    });
    data.periods = ensurePeriods(data.periods || [], year);
    data.periods = ensurePeriods(data.periods || [], toYear).map((period) => {
      if (Number(period.year) === year) {
        return { ...period, status: "closed", locked: lockPeriod, closedAt: new Date().toISOString() };
      }
      if (Number(period.year) === toYear) {
        return { ...period, status: "open", locked: false };
      }
      return period;
    });
    data.periodLocks = ensurePeriodLock(data.periodLocks || [], year, lockPeriod);

    addAuditLog(data, {
      module: "periods",
      action: "close",
      message: `Yıl sonu devri: ${year} → ${toYear}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);

    if (switchPeriod) {
      await saveSettings({ ...settings, currentPeriodYear: toYear });
    }

    return { ok: true, batch: data.periodBatches.at(-1) };
  });

  ipcMain.handle("periods:rollback", async (_event, payload) => {
    const data = await loadStorage();
    const { batchId } = payload || {};
    if (!batchId) {
      return { ok: false, error: "Batch ID eksik." };
    }
    const batch = (data.periodBatches || []).find((entry) => entry.id === batchId);
    if (!batch) {
      return { ok: false, error: "Batch bulunamadı." };
    }
    data.periodBatches = (data.periodBatches || []).filter((entry) => entry.id !== batchId);
    data.periodLocks = ensurePeriodLock(data.periodLocks || [], batch.fromYear, false);
    data.periods = (data.periods || []).map((period) => {
      if (Number(period.year) === Number(batch.fromYear)) {
        return { ...period, status: "open", locked: false, reopenedAt: new Date().toISOString() };
      }
      return period;
    });

    addAuditLog(data, {
      module: "periods",
      action: "rollback",
      message: `Yıl sonu devri geri alındı: ${batch.fromYear} → ${batch.toYear}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return { ok: true };
  });

  ipcMain.handle("accounts:create", async (_event, payload) => {
    const data = await loadStorage();
    const normalizedCode = String(payload.code || "").trim();
    const normalizedName = normalizeSpaces(payload.name || "");
    data.accounts = createRecord(data.accounts, {
      code: normalizedCode,
      name: normalizedName,
      type: payload.type || "varlik",
      description: payload.description || ""
    });
    addAuditLog(data, {
      module: "accounts",
      action: "create",
      message: `Hesap planı eklendi: ${normalizedCode} ${normalizedName}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.accounts;
  });

  ipcMain.handle("unit-conversions:create", async (_event, payload) => {
    const data = await loadStorage();
    data.unitConversions = createRecord(data.unitConversions, {
      baseUnit: payload.baseUnit,
      targetUnit: payload.targetUnit,
      factor: Number(payload.factor || 0),
      note: payload.note || ""
    });
    addAuditLog(data, {
      module: "stocks",
      action: "unit-conversion",
      message: `Birim dönüşüm eklendi: ${payload.baseUnit} → ${payload.targetUnit}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.unitConversions;
  });

  ipcMain.handle("customers:create", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    const { openingDebt, openingCredit, ...rest } = payload;
    const normalizedOpeningDebt = normalizeNumber(openingDebt);
    const normalizedOpeningCredit = normalizeNumber(openingCredit);
    const normalizedName = normalizeSpaces(payload.name || "");
    // At customer creation time, default a 15‑day payment term unless explicitly provided.
    // The `dueDays` field controls how soon a receivable becomes due. If the caller
    // does not pass a value, we set it to 15 so that the UI can calculate due dates.
    data.customers = createRecord(data.customers, {
      code: payload.code || generateCode("CAR"),
      balance: normalizedOpeningDebt - normalizedOpeningCredit,
      normalizedName,
      isActive: true,
      // carry over all other payload fields
      ...rest,
      // default dueDays if missing
      dueDays: typeof rest.dueDays !== "undefined" && rest.dueDays !== "" ? Number(rest.dueDays) : 15
    });
    if (normalizedOpeningDebt > 0) {
      const latestCustomer = data.customers.at(-1);
      data.customerDebts = createRecord(data.customerDebts, {
        customerId: latestCustomer?.id || "",
        customerName: latestCustomer?.name || "",
        amount: normalizedOpeningDebt,
        note: "Açılış borcu",
        createdAt: payload.createdAt,
        periodYear
      });
      addLedgerEntry(data, {
        accountCode: "120",
        accountName: "ALICILAR",
        debit: normalizedOpeningDebt,
        credit: 0,
        note: "Cari açılış borcu",
        periodYear
      });
    }
    if (normalizedOpeningCredit > 0) {
      const latestCustomer = data.customers.at(-1);
      data.customerDebts = createRecord(data.customerDebts, {
        customerId: latestCustomer?.id || "",
        customerName: latestCustomer?.name || "",
        amount: -normalizedOpeningCredit,
        note: "Açılış alacak",
        createdAt: payload.createdAt,
        periodYear
      });
      addLedgerEntry(data, {
        accountCode: "120",
        accountName: "ALICILAR",
        debit: 0,
        credit: normalizedOpeningCredit,
        note: "Cari açılış alacak",
        periodYear
      });
    }
    addAuditLog(data, {
      module: "customers",
      action: "create",
      message: `Cari eklendi: ${normalizedName}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.customers;
  });

  ipcMain.handle("customers:update", async (_event, payload) => {
    const data = await loadStorage();
    const { customerId, ...rest } = payload || {};
    if (!customerId) {
      return data.customers;
    }
    data.customers = data.customers.map((customer) => {
      if (customer.id !== customerId) {
        return customer;
      }
      const normalizedName = normalizeSpaces(rest.name || customer.name || "");
      return {
        ...customer,
        code: rest.code || customer.code,
        name: rest.name || customer.name,
        normalizedName,
        type: rest.type || customer.type,
        identityNumber: rest.identityNumber || customer.identityNumber,
        phone: rest.phone || customer.phone,
        taxNumber: rest.taxNumber || customer.taxNumber,
        email: rest.email || customer.email,
        riskLimit: rest.riskLimit || customer.riskLimit,
        dueDays: rest.dueDays || customer.dueDays,
        address: rest.address || customer.address,
        note: rest.note || customer.note,
        updatedAt: new Date().toISOString()
      };
    });
    addAuditLog(data, {
      module: "customers",
      action: "update",
      message: `Cari güncellendi: ${normalizedName}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.customers;
  });

  ipcMain.handle("customers:delete", async (_event, payload) => {
    const data = await loadStorage();
    const { customerId } = payload || {};
    if (!customerId) {
      return data;
    }
    const removed = data.customers.find((customer) => customer.id === customerId);
    data.customers = data.customers.filter((customer) => customer.id !== customerId);
    data.customerDebts = (data.customerDebts || []).filter(
      (entry) => entry.customerId !== customerId
    );
    data.customerJobs = (data.customerJobs || []).filter(
      (entry) => entry.customerId !== customerId
    );
    addAuditLog(data, {
      module: "customers",
      action: "delete",
      message: `Cari silindi: ${removed?.name || "Bilinmeyen"}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("customers:toggle-status", async (_event, payload) => {
    const data = await loadStorage();
    const { customerId, isActive } = payload || {};
    data.customers = data.customers.map((customer) => {
      if (customer.id !== customerId) {
        return customer;
      }
      return {
        ...customer,
        isActive: Boolean(isActive),
        deactivatedAt: isActive ? "" : new Date().toISOString()
      };
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.customers;
  });

  ipcMain.handle("customers:transaction", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const { customerId, amount, note, createdAt, type, paymentMethod } = payload;
    const normalizedAmount = normalizeNumber(amount);
    const customerName = data.customers.find(
      (customer) => customer.id === customerId
    )?.name;
    if (!customerName) {
      return data;
    }
    data.customers = data.customers.map((customer) => {
      if (customer.id !== customerId) {
        return customer;
      }
      const current = Number(customer.balance || 0);
      const nextBalance =
        type === "tahsilat" ? current - normalizedAmount : current + normalizedAmount;
      return { ...customer, balance: nextBalance };
    });
    data.cashTransactions = createRecord(data.cashTransactions, {
      type: type === "tahsilat" ? "gelir" : "gider",
      amount: normalizedAmount,
      paymentMethod: paymentMethod || "nakit",
      note: note || "Cari İşlem",
      createdAt,
      customerId,
      customerName,
      periodYear
    });
    addLedgerEntry(data, {
      accountCode: type === "tahsilat" ? "100" : "320",
      accountName: type === "tahsilat" ? "KASA" : "SATICILAR",
      debit: type === "tahsilat" ? normalizedAmount : 0,
      credit: type === "tahsilat" ? 0 : normalizedAmount,
      note: note || "Cari işlem",
      periodYear
    });
    if (type !== "tahsilat") {
      data.customerDebts = createRecord(data.customerDebts, {
        customerId,
        customerName,
        amount: normalizedAmount,
        note: note || "Cari Ödeme",
        createdAt,
        periodYear
      });
    }
    addAuditLog(data, {
      module: "customers",
      action: "transaction",
      message: `Cari işlem: ${customerName} ${type}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("customers:payment", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const { customerId, amount, note, createdAt, paymentMethod } = payload;
    const normalizedAmount = Number(amount || 0);
    const customerName = data.customers.find(
      (customer) => customer.id === customerId
    )?.name;
    data.customers = data.customers.map((customer) => {
      if (customer.id !== customerId) {
        return customer;
      }
      return {
        ...customer,
        balance: Math.max(
          0,
          Number(customer.balance || 0) - Number(normalizedAmount || 0)
        )
      };
    });
    data.cashTransactions = createRecord(data.cashTransactions, {
      type: "gelir",
      amount: normalizedAmount,
      paymentMethod: paymentMethod || "nakit",
      note: note || "Cari Tahsilat",
      createdAt,
      customerId,
      customerName,
      periodYear
    });
    addLedgerEntry(data, {
      accountCode: "100",
      accountName: "KASA",
      debit: normalizedAmount,
      credit: 0,
      note: note || "Cari tahsilat",
      periodYear
    });
    addAuditLog(data, {
      module: "customers",
      action: "payment",
      message: `Cari tahsilat: ${customerName}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("customers:debt", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const { customerId, amount, note, createdAt, paymentMethod } = payload;
    const normalizedAmount = normalizeNumber(amount);
    const customerName = data.customers.find(
      (customer) => customer.id === customerId
    )?.name;
    data.customers = data.customers.map((customer) => {
      if (customer.id !== customerId) {
        return customer;
      }
      return {
        ...customer,
        balance: Number(customer.balance || 0) + normalizedAmount
      };
    });
    data.customerDebts = createRecord(data.customerDebts, {
      customerId,
      customerName,
      amount: normalizedAmount,
      note: note || "Cari Borç",
      createdAt,
      periodYear
    });
    addLedgerEntry(data, {
      accountCode: "120",
      accountName: "ALICILAR",
      debit: normalizedAmount,
      credit: 0,
      note: note || "Cari borç",
      periodYear
    });
    addAuditLog(data, {
      module: "customers",
      action: "debt",
      message: `Cari borç eklendi: ${customerName}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("customers:job", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const {
      customerId,
      title,
      quantity,
      unit,
      unitPrice,
      total,
      note,
      createdAt
    } = payload;
    const normalizedTotal = normalizeNumber(total);
    const customerName = data.customers.find(
      (customer) => customer.id === customerId
    )?.name;
    data.customerJobs = createRecord(data.customerJobs, {
      customerId,
      customerName,
      title,
      quantity: normalizeNumber(quantity),
      unit,
      unitPrice: normalizeNumber(unitPrice),
      total: normalizedTotal,
      note,
      createdAt,
      isActive: true,
      periodYear
    });
    data.customers = data.customers.map((customer) => {
      if (customer.id !== customerId) {
        return customer;
      }
      return {
        ...customer,
        balance: Number(customer.balance || 0) + normalizedTotal
      };
    });
    addLedgerEntry(data, {
      accountCode: "120",
      accountName: "ALICILAR",
      debit: normalizedTotal,
      credit: 0,
      note: "İş kalemi",
      periodYear
    });
    addAuditLog(data, {
      module: "customers",
      action: "job",
      message: `İş kalemi eklendi: ${customerName}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  
  ipcMain.handle("customers:job:update", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const { id, title, quantity, unit, unitPrice, total, note, createdAt, isActive } = payload || {};
    const current = data.customerJobs.find((job) => job.id === id);
    if (!current) {
      return data;
    }
    const periodYear = Number(current.periodYear || getCurrentPeriodYear(settings));
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const nextTotal = normalizeNumber(total ?? current.total);
    const delta = nextTotal - normalizeNumber(current.total);

    data.customerJobs = data.customerJobs.map((job) => {
      if (job.id !== id) return job;
      return {
        ...job,
        title: title ?? job.title,
        quantity: quantity === undefined ? job.quantity : normalizeNumber(quantity),
        unit: unit ?? job.unit,
        unitPrice: unitPrice === undefined ? job.unitPrice : normalizeNumber(unitPrice),
        total: nextTotal,
        note: note ?? job.note,
        createdAt: createdAt ? new Date(createdAt).toISOString() : job.createdAt,
        isActive: isActive === undefined ? (job.isActive !== false) : Boolean(isActive)
      };
    });

    data.customers = data.customers.map((customer) => {
      if (customer.id !== current.customerId) return customer;
      return {
        ...customer,
        balance: normalizeNumber(customer.balance) + delta
      };
    });

    addLedgerEntry(data, {
      accountCode: "120",
      accountName: "ALICILAR",
      debit: delta > 0 ? delta : 0,
      credit: delta < 0 ? Math.abs(delta) : 0,
      note: "İş kalemi düzeltme",
      periodYear
    });

    addAuditLog(data, {
      module: "customers",
      action: "job_update",
      message: `İş kalemi güncellendi: ${current.customerName || ""}`
    });

    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("customers:job:delete", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const { id } = payload || {};
    const current = data.customerJobs.find((job) => job.id === id);
    if (!current) {
      return data;
    }
    const periodYear = Number(current.periodYear || getCurrentPeriodYear(settings));
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const amount = normalizeNumber(current.total);

    data.customerJobs = data.customerJobs.filter((job) => job.id !== id);

    data.customers = data.customers.map((customer) => {
      if (customer.id !== current.customerId) return customer;
      return {
        ...customer,
        balance: Math.max(0, normalizeNumber(customer.balance) - amount)
      };
    });

    addLedgerEntry(data, {
      accountCode: "120",
      accountName: "ALICILAR",
      debit: 0,
      credit: amount,
      note: "İş kalemi silme",
      periodYear
    });

    addAuditLog(data, {
      module: "customers",
      action: "job_delete",
      message: `İş kalemi silindi: ${current.customerName || ""}`
    });

    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

ipcMain.handle("stocks:create", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    upsertStockEntry(data, payload, { note: "Stok kartı girişi" }, settings);
    addAuditLog(data, {
      module: "stocks",
      action: "create",
      message: `Stok kartı: ${payload.name || "Malzeme"}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.stocks;
  });

  ipcMain.handle("stocks:toggle-status", async (_event, payload) => {
    const data = await loadStorage();
    const { stockId, isActive } = payload || {};
    data.stocks = data.stocks.map((stock) => {
      if (stock.id !== stockId) {
        return stock;
      }
      return {
        ...stock,
        isActive: Boolean(isActive),
        deactivatedAt: isActive ? "" : new Date().toISOString()
      };
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.stocks;
  });

  ipcMain.handle("stocks:update", async (_event, payload) => {
    const data = await loadStorage();
    const { stockId, updates } = payload || {};
    data.stocks = data.stocks.map((stock) => {
      if (stock.id !== stockId) {
        return stock;
      }
      const next = {
        ...stock,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      if (updates?.name) {
        next.normalizedName = normalizeStockName(updates.name);
      }
      return next;
    });
    addAuditLog(data, {
      module: "stocks",
      action: "update",
      message: "Stok kartı güncellendi."
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.stocks;
  });

  ipcMain.handle("stocks:delete", async (_event, payload) => {
    const data = await loadStorage();
    const { stockId } = payload || {};
    data.stocks = data.stocks.filter((stock) => stock.id !== stockId);
    addAuditLog(data, {
      module: "stocks",
      action: "delete",
      message: "Stok kartı silindi."
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.stocks;
  });

  ipcMain.handle("stocks:receipt", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const { items = [], createdAt, note, supplier, warehouse, attachment, draft } =
      payload || {};
    const receiptItems = items.map((item) => ({
      ...item,
      warehouse: warehouse || item.warehouse
    }));
    // When a receipt is marked as draft we do not transfer it to stock immediately.
    // transferredAt is left blank so that the frontend can later transfer it.
    const receiptRecord = createRecord(data.stockReceipts, {
      createdAt,
      supplier,
      warehouse: resolveWarehouse(warehouse, settings),
      note,
      attachment,
      items: receiptItems,
      transferredAt: draft ? "" : new Date().toISOString(),
      periodYear
    });
    data.stockReceipts = receiptRecord;
    if (!draft) {
      // Only update actual stock quantities when the receipt is not a draft.
      receiptItems.forEach((item) => {
        upsertStockEntry(
          data,
          item,
          {
            note: note || "Fiş girişi",
            createdAt
          },
          settings
        );
      });
      addAuditLog(data, {
        module: "stocks",
        action: "receipt",
        message: `Fiş işlendi: ${supplier || "Tedarikçi"}`
      });
    } else {
      addAuditLog(data, {
        module: "stocks",
        action: "receipt-draft",
        message: `Taslak fiş oluşturuldu: ${supplier || "Taslak"}`
      });
    }
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("stocks:receipt-transfer", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const { receiptIds = [] } = payload || {};
    let processed = 0;
    let created = 0;
    let updated = 0;
    receiptIds.forEach((receiptId) => {
      const receipt = data.stockReceipts.find((item) => item.id === receiptId);
      if (!receipt || receipt.transferredAt) {
        return;
      }
      receipt.items?.forEach((item) => {
        const result = upsertStockEntry(
          data,
          { ...item, warehouse: receipt.warehouse },
          {
            note: `Fiş aktarımı: ${receipt.supplier || "Tedarikçi"}`,
            createdAt: receipt.createdAt
          },
          settings
        );
        if (result?.status === "created") {
          created += 1;
        }
        if (result?.status === "updated") {
          updated += 1;
        }
      });
      receipt.transferredAt = new Date().toISOString();
      processed += 1;
    });
    addAuditLog(data, {
      module: "stocks",
      action: "receipt-transfer",
      message: `Fiş aktarımı: ${processed} kayıt`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return {
      ...data,
      message: processed
        ? `Depoya aktarıldı. Yeni: ${created}, Güncel: ${updated}`
        : "Bu fiş daha önce depoya aktarılmış."
    };
  });

  ipcMain.handle("stocks:movement", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const { stockName, type, quantity, note, createdAt } = payload;
    const normalizedName = normalizeStockName(stockName);
    data.stockMovements = createRecord(data.stockMovements, {
      stockName: normalizedName,
      type,
      quantity: Number(quantity || 0),
      note,
      createdAt,
      periodYear
    });
    data.stocks = data.stocks.map((stock) => {
      if (stock.normalizedName !== normalizedName && stock.name !== stockName) {
        return stock;
      }
      const current = Number(stock.quantity || 0);
      const delta = Number(quantity || 0);
      const nextQuantity = type === "giris" ? current + delta : current - delta;
      return {
        ...stock,
        quantity: Math.max(nextQuantity, 0)
      };
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    addAuditLog(data, {
      module: "stocks",
      action: "movement",
      message: `Stok hareketi: ${normalizedName} (${type})`
    });
    return data;
  });

  ipcMain.handle("stocks:import-preview", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const { path: filePath, warehouse } = payload || {};
    if (!filePath) {
      return { error: "Dosya yolu bulunamadı.", rows: [], summary: {} };
    }
    const parsed = await parseImportFile(filePath);
    if (parsed.error) {
      return { error: parsed.error, rows: [], summary: {} };
    }
    const rows = parsed.rows || [];
    if (!rows.length) {
      return {
        error: "Dosyada okunabilir kayıt bulunamadı.",
        rows: [],
        summary: {}
      };
    }
    const report = analyzeImportRows(
      data,
      rows,
      resolveWarehouse(warehouse, settings),
      settings
    );
    return {
      rows,
      summary: report.summary,
      report
    };
  });

  ipcMain.handle("stocks:import-apply", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const { rows = [], warehouse } = payload || {};
    const targetWarehouse = resolveWarehouse(warehouse, settings);
    const report = analyzeImportRows(data, rows, targetWarehouse, settings);
    report.rows.forEach((row, index) => {
      if (row.status === "error") {
        return;
      }
      const source = mapImportRow(rows[index] || {});
      const result = upsertStockEntry(
        data,
        {
          ...source,
          name: row.name,
          quantity: row.quantity,
          unit: source.unit,
          diameter: source.diameter,
          warehouse: targetWarehouse
        },
        {
          note: "Toplu aktarım",
          createdAt: new Date().toISOString()
        },
        settings
      );
      if (result?.status === "updated") {
        row.statusLabel = "Güncellendi";
      }
      if (result?.status === "created") {
        row.statusLabel = "Eklendi";
      }
    });
    addAuditLog(data, {
      module: "stocks",
      action: "import",
      message: "Toplu stok aktarımı tamamlandı"
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return { ...data, report };
  });

  ipcMain.handle("cash:create", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const customerName =
      payload.customerName ||
      data.customers.find((customer) => customer.id === payload.customerId)?.name ||
      "";
    data.cashTransactions = createRecord(data.cashTransactions, {
      ...payload,
      customerName,
      periodYear
    });
    addLedgerEntry(data, {
      accountCode: payload.type === "gider" ? "320" : "100",
      accountName: payload.type === "gider" ? "SATICILAR" : "KASA",
      debit: payload.type === "gider" ? 0 : normalizeNumber(payload.amount),
      credit: payload.type === "gider" ? normalizeNumber(payload.amount) : 0,
      note: payload.note || "Kasa hareketi",
      periodYear
    });
    addAuditLog(data, {
      module: "cash",
      action: "create",
      message: `Kasa hareketi: ${payload.type}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data.cashTransactions;
  });

  ipcMain.handle("invoices:create", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    data.invoices = createRecord(data.invoices, { ...payload, periodYear });
    addAuditLog(data, {
      module: "invoices",
      action: "create",
      message: `Fatura yüklendi: ${payload.vendor || "Firma"}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });
  ipcMain.handle("invoices:delete", async (_event, payload) => {
    const data = await loadStorage();
    const { invoiceId } = payload || {};
    data.invoices = data.invoices.filter((invoice) => invoice.id !== invoiceId);
    addAuditLog(data, {
      module: "invoices",
      action: "delete",
      message: "Fatura silindi."
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });
  ipcMain.handle("proposals:create", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    data.proposals = createRecord(data.proposals, { ...payload, periodYear });
    addAuditLog(data, {
      module: "proposals",
      action: "create",
      message: `Teklif kaydedildi: ${payload.title || "Teklif"}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  
  ipcMain.handle("proposals:update", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const { proposalId, patch } = payload || {};
    if (!proposalId) return data;
    data.proposals = (data.proposals || []).map((proposal) => {
      if (proposal.id !== proposalId) return proposal;
      return { ...proposal, ...patch, periodYear };
    });
    addAuditLog(data, {
      module: "proposals",
      action: "update",
      message: `Teklif güncellendi: ${proposalId}`
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

ipcMain.handle("proposals:delete", async (_event, payload) => {
    const data = await loadStorage();
    const { proposalId } = payload || {};
    data.proposals = data.proposals.filter((proposal) => proposal.id !== proposalId);
    addAuditLog(data, {
      module: "proposals",
      action: "delete",
      message: "Teklif silindi."
    });
    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("app:quit", () => {
    app.quit();
    return { ok: true };
  });

  ipcMain.handle("sales:create", async (_event, payload) => {
    const data = await loadStorage();
    const settings = await loadSettings();
    const periodYear = getCurrentPeriodYear(settings);
    if (isPeriodLocked(data, periodYear)) {
      throw new Error("Seçili dönem kilitli. İşlem yapılamaz.");
    }
    const { customerId, customerName, items, total, vatRate } = payload;
    const saleRecord = {
      customerId,
      customerName,
      items,
      total,
      vatRate,
      periodYear
    };
    data.sales = createRecord(data.sales, saleRecord);
    addLedgerEntry(data, {
      accountCode: "600",
      accountName: "YURTİÇİ SATIŞLAR",
      debit: 0,
      credit: normalizeNumber(total),
      note: `Satış: ${customerName || "Genel"}`,
      periodYear
    });

    if (customerId) {
      data.customers = data.customers.map((customer) => {
        if (customer.id !== customerId) {
          return customer;
        }
        return {
          ...customer,
          balance: Number(customer.balance || 0) + Number(total || 0)
        };
      });
    }

    const updatedStocks = data.stocks.map((stock) => {
      const item = items.find(
        (entry) =>
          normalizeStockName(entry.name) === stock.normalizedName ||
          entry.name === stock.name
      );
      if (!item) {
        return stock;
      }
      const nextQuantity =
        Number(stock.quantity || 0) - Number(item.quantity || 0);
      return {
        ...stock,
        quantity: Math.max(nextQuantity, 0)
      };
    });
    data.stocks = updatedStocks;
    items.forEach((item) => {
      if (!item.name) {
        return;
      }
      const normalizedName = normalizeStockName(item.name);
      data.stockMovements = createRecord(data.stockMovements, {
        stockName: normalizedName || item.name,
        type: "cikis",
        quantity: normalizeNumber(item.quantity),
        note: `Satış: ${customerName || "Genel"}`,
        periodYear
      });
    });

    data.cashTransactions = createRecord(data.cashTransactions, {
      type: "gelir",
      amount: total,
      note: `Satış: ${customerName || "Genel"}`,
      periodYear
    });
    addLedgerEntry(data, {
      accountCode: "100",
      accountName: "KASA",
      debit: normalizeNumber(total),
      credit: 0,
      note: `Satış tahsilat: ${customerName || "Genel"}`,
      periodYear
    });
    addAuditLog(data, {
      module: "sales",
      action: "create",
      message: `Satış kaydı: ${customerName || "Genel"}`
    });

    await saveStorage(data);
    await syncStorageCopies(data);
    await maybeAutoBackup(data);
    return data;
  });

  ipcMain.handle("report:generate", async (_event, payload) => {
    const { title, html } = payload;
    const reportsDir = path.join(
      app.getPath("documents"),
      "MTN-Muhasebe-Raporlar"
    );
    await fs.mkdir(reportsDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const reportFile = path.join(reportsDir, `${title}-${timestamp}.pdf`);
    const reportWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        sandbox: false
      }
    });
    const content = `<!DOCTYPE html><html><head><meta charset=\"utf-8\" /><style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px;color:#1f2a44;position:relative}h1{font-size:20px;margin-bottom:6px}.report-frame{border:2px solid #0f172a;border-radius:12px;padding:20px;min-height:720px}.report-header{display:flex;justify-content:flex-start;align-items:flex-start;margin-bottom:16px;gap:18px}.report-header p{margin:4px 0;font-size:11px;color:#516081}.report-header--corporate{align-items:stretch}.report-header--offer{align-items:flex-start}.report-brand{display:flex;align-items:center;gap:12px}.report-brand h1{font-size:18px;margin:0}.report-meta{max-width:420px;font-size:11px;color:#516081}.report-meta h1{margin-bottom:6px}.report-meta p{margin:2px 0}.report-logo-block{display:flex;align-items:flex-start;justify-content:flex-start;min-width:140px}.report-logo{font-size:28px;font-weight:700;color:#1f2a44}.report-logo-img{width:120px;max-height:70px;object-fit:contain;background:#fff;border-radius:8px;padding:6px;border:1px solid #e2e8f0}.report-logo-img--mono{filter:grayscale(1) contrast(1.1)}.report-watermark{position:fixed;top:35%;left:10%;right:10%;text-align:center;font-size:48px;color:rgba(0,76,140,0.1);transform:rotate(-18deg);z-index:0}.report-watermark img{width:220px;opacity:0.08}table{width:100%;border-collapse:collapse;font-size:12px;position:relative;z-index:1}th,td{border:1px solid #d7deef;padding:8px;text-align:left}th{background:#f2f5fb}</style></head><body>${html}</body></html>`;
    await reportWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(content)}`
    );
    const pdfBuffer = await reportWindow.webContents.printToPDF({});
    await fs.writeFile(reportFile, pdfBuffer);
    reportWindow.close();
    return { reportFile };
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});



// === MTN: Toplu Stok – satır analizi (Ön İzleme için) ===
ipcMain.handle("stocks:import-analyze", async (_event, payload) => {
  try {
    const data = await loadStorage();
    const settings = await loadSettings();
    const rows = (payload && payload.rows) ? payload.rows : [];
    const warehouse = (payload && payload.warehouse) ? payload.warehouse : "Ana Depo";
    const targetWarehouse = typeof resolveWarehouse === "function" ? resolveWarehouse(warehouse, settings) : warehouse;
    const report = typeof analyzeImportRows === "function" ? analyzeImportRows(data, rows, targetWarehouse, settings) : { rows: [], summary: {} };
    return { ok: true, rows, summary: report.summary || {}, report };
  } catch (error) {
    return { ok: false, error: error.message || String(error), rows: [], summary: {}, report: { rows: [] } };
  }
});
