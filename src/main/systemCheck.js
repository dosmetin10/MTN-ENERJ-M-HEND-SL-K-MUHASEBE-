const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const BACKUP_EXTENSIONS = ['.bak', '.zip', '.backup'];
const BACKUP_WARNING_DAYS = 7;

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeStat(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (error) {
    return null;
  }
}

function findLatestBackup(backupDir) {
  if (!fs.existsSync(backupDir)) {
    return null;
  }

  const entries = fs.readdirSync(backupDir)
    .map((name) => path.join(backupDir, name))
    .map((filePath) => ({
      filePath,
      stat: safeStat(filePath)
    }))
    .filter((entry) => entry.stat && entry.stat.isFile())
    .filter((entry) => BACKUP_EXTENSIONS.includes(path.extname(entry.filePath).toLowerCase()));

  if (entries.length === 0) {
    return null;
  }

  entries.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  return entries[0];
}

function buildItem({ key, ok, title, message }) {
  return {
    key,
    ok,
    title,
    message
  };
}

function runSystemCheck() {
  const userDataPath = app.getPath('userData');
  const dataDir = path.join(userDataPath, 'data');
  const backupDir = path.join(userDataPath, 'backups');
  const logsDir = path.join(userDataPath, 'logs');
  const dbPath = path.join(dataDir, 'mtn-muhasebe.db');

  ensureDir(logsDir);

  const items = [];
  const dbStat = safeStat(dbPath);

  if (dbStat) {
    items.push(buildItem({
      key: 'db-connection',
      ok: true,
      title: 'Veritabanı bağlantısı',
      message: 'Veritabanı dosyası bulundu ve erişilebilir.'
    }));
  } else {
    items.push(buildItem({
      key: 'db-connection',
      ok: false,
      title: 'Veritabanı bağlantısı',
      message: 'Veritabanı dosyası bulunamadı. Veri yolu veya erişim izinlerini kontrol edin.'
    }));
  }

  if (dbStat && dbStat.size > 0) {
    items.push(buildItem({
      key: 'data-integrity',
      ok: true,
      title: 'Veri bütünlüğü',
      message: 'Veri dosyası boyutu normal görünüyor.'
    }));
  } else {
    items.push(buildItem({
      key: 'data-integrity',
      ok: false,
      title: 'Veri bütünlüğü',
      message: 'Veri dosyası boş veya erişilemiyor. Yedeklerden geri yükleme gerekebilir.'
    }));
  }

  const latestBackup = findLatestBackup(backupDir);

  if (latestBackup) {
    const ageDays = Math.floor((Date.now() - latestBackup.stat.mtimeMs) / (1000 * 60 * 60 * 24));
    const isFresh = ageDays <= BACKUP_WARNING_DAYS;

    items.push(buildItem({
      key: 'last-backup',
      ok: isFresh,
      title: 'Son yedek durumu',
      message: isFresh
        ? `En güncel yedek ${ageDays} gün önce alınmış.`
        : `Son yedek ${ageDays} gün önce alınmış. Yeni bir yedek önerilir.`
    }));
  } else {
    items.push(buildItem({
      key: 'last-backup',
      ok: false,
      title: 'Son yedek durumu',
      message: 'Herhangi bir yedek bulunamadı. İlk yedeğinizi hemen almanız önerilir.'
    }));
  }

  const hasIssues = items.some((item) => !item.ok);
  const result = {
    timestamp: new Date().toISOString(),
    items,
    hasIssues
  };

  const logLine = `${result.timestamp} | ${hasIssues ? 'WARN' : 'OK'} | ${items.map((item) => `${item.key}:${item.ok ? 'OK' : 'WARN'}`).join(', ')}\n`;
  fs.appendFileSync(path.join(logsDir, 'system-check.log'), logLine, 'utf8');

  return result;
}

module.exports = {
  runSystemCheck
};
