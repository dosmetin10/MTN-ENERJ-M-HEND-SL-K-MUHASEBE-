-- Requires PostgreSQL 13+
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='fis_status') THEN
    CREATE TYPE fis_status AS ENUM ('ACTIVE','CANCELLED','REVERSED');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='fis_turu') THEN
    CREATE TYPE fis_turu AS ENUM ('SATIS','SATIS_IADE','ALIS','ALIS_IADE','TRANSFER','DÜZELTME');
  END IF;
  PERFORM 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='fis_turu' AND e.enumlabel='SATIS';         IF NOT FOUND THEN ALTER TYPE fis_turu ADD VALUE 'SATIS'; END IF;
  PERFORM 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='fis_turu' AND e.enumlabel='SATIS_IADE';    IF NOT FOUND THEN ALTER TYPE fis_turu ADD VALUE 'SATIS_IADE'; END IF;
  PERFORM 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='fis_turu' AND e.enumlabel='ALIS';          IF NOT FOUND THEN ALTER TYPE fis_turu ADD VALUE 'ALIS'; END IF;
  PERFORM 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='fis_turu' AND e.enumlabel='ALIS_IADE';     IF NOT FOUND THEN ALTER TYPE fis_turu ADD VALUE 'ALIS_IADE'; END IF;
  PERFORM 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='fis_turu' AND e.enumlabel='TRANSFER';      IF NOT FOUND THEN ALTER TYPE fis_turu ADD VALUE 'TRANSFER'; END IF;
  PERFORM 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='fis_turu' AND e.enumlabel='DÜZELTME';      IF NOT FOUND THEN ALTER TYPE fis_turu ADD VALUE 'DÜZELTME'; END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='kasa_turu') THEN
    CREATE TYPE kasa_turu AS ENUM ('TAHSILAT','ODEME');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS yetki_rol (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod TEXT UNIQUE NOT NULL,
  ad  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kullanici (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  pw_hash  TEXT NOT NULL,
  aktif    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kullanici_rol (
  kullanici_id UUID NOT NULL REFERENCES kullanici(id) ON DELETE CASCADE,
  rol_id       UUID NOT NULL REFERENCES yetki_rol(id) ON DELETE CASCADE,
  PRIMARY KEY (kullanici_id, rol_id)
);

CREATE INDEX IF NOT EXISTS ix_kullanici_rol_kullanici ON kullanici_rol(kullanici_id);
CREATE INDEX IF NOT EXISTS ix_kullanici_rol_rol       ON kullanici_rol(rol_id);

CREATE TABLE IF NOT EXISTS cari (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod TEXT UNIQUE,
  unvan TEXT NOT NULL,
  vergi_no TEXT,
  vergi_dairesi TEXT,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stok (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod TEXT UNIQUE,
  ad  TEXT NOT NULL,
  birim TEXT NOT NULL DEFAULT 'adet',
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fisler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fis_no TEXT UNIQUE,
  tur fis_turu NOT NULL,
  status fis_status NOT NULL DEFAULT 'ACTIVE',
  original_id UUID NULL,
  reversed_by_id UUID NULL,
  reason TEXT,
  tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
  para_birim TEXT NOT NULL DEFAULT 'TRY',
  toplam_tutar NUMERIC(18,2) NOT NULL DEFAULT 0,
  kdv_tutar    NUMERIC(18,2) NOT NULL DEFAULT 0,
  net_tutar    NUMERIC(18,2) NOT NULL DEFAULT 0,
  cari_id UUID NULL REFERENCES cari(id),
  created_by UUID NULL REFERENCES kullanici(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_fisler_tarih     ON fisler(tarih DESC);
CREATE INDEX IF NOT EXISTS ix_fisler_status    ON fisler(status);
CREATE INDEX IF NOT EXISTS ix_fisler_tur       ON fisler(tur);
CREATE INDEX IF NOT EXISTS ix_fisler_cari      ON fisler(cari_id);

CREATE TABLE IF NOT EXISTS fis_kalemleri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fis_id UUID NOT NULL REFERENCES fisler(id) ON DELETE CASCADE,
  stok_id UUID NOT NULL REFERENCES stok(id),
  miktar NUMERIC(18,4) NOT NULL,
  birim TEXT NOT NULL,
  birim_fiyat NUMERIC(18,4) NOT NULL,
  iskonto_oran NUMERIC(5,2) NOT NULL DEFAULT 0,
  kdv_oran     NUMERIC(5,2) NOT NULL DEFAULT 0,
  toplam_tutar NUMERIC(18,2) NOT NULL DEFAULT 0,
  status fis_status NOT NULL DEFAULT 'ACTIVE',
  original_id UUID NULL,
  reversed_by_id UUID NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_fk_fis_kalem_fis   ON fis_kalemleri(fis_id);
CREATE INDEX IF NOT EXISTS ix_fk_fis_kalem_stok  ON fis_kalemleri(stok_id);
CREATE INDEX IF NOT EXISTS ix_fk_fis_kalem_stat  ON fis_kalemleri(status);

CREATE TABLE IF NOT EXISTS stok_hareket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stok_id UUID NOT NULL REFERENCES stok(id),
  fis_id UUID NOT NULL REFERENCES fisler(id) ON DELETE CASCADE,
  miktar NUMERIC(18,4) NOT NULL,
  status fis_status NOT NULL DEFAULT 'ACTIVE',
  original_id UUID NULL,
  reversed_by_id UUID NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_stok_hareket_stok   ON stok_hareket(stok_id);
CREATE INDEX IF NOT EXISTS ix_stok_hareket_fis    ON stok_hareket(fis_id);
CREATE INDEX IF NOT EXISTS ix_stok_hareket_status ON stok_hareket(status);

CREATE TABLE IF NOT EXISTS cari_hareket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cari_id UUID NOT NULL REFERENCES cari(id),
  fis_id  UUID NOT NULL REFERENCES fisler(id) ON DELETE CASCADE,
  borc   NUMERIC(18,2) NOT NULL DEFAULT 0,
  alacak NUMERIC(18,2) NOT NULL DEFAULT 0,
  status fis_status NOT NULL DEFAULT 'ACTIVE',
  original_id UUID NULL,
  reversed_by_id UUID NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_cari_hareket_cari   ON cari_hareket(cari_id);
CREATE INDEX IF NOT EXISTS ix_cari_hareket_fis    ON cari_hareket(fis_id);
CREATE INDEX IF NOT EXISTS ix_cari_hareket_status ON cari_hareket(status);

CREATE TABLE IF NOT EXISTS kasa_hareket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fis_id UUID NOT NULL REFERENCES fisler(id) ON DELETE CASCADE,
  tur kasa_turu NOT NULL,
  tutar NUMERIC(18,2) NOT NULL,
  status fis_status NOT NULL DEFAULT 'ACTIVE',
  original_id UUID NULL,
  reversed_by_id UUID NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_kasa_hareket_fis    ON kasa_hareket(fis_id);
CREATE INDEX IF NOT EXISTS ix_kasa_hareket_tur    ON kasa_hareket(tur);
CREATE INDEX IF NOT EXISTS ix_kasa_hareket_status ON kasa_hareket(status);

CREATE TABLE IF NOT EXISTS yedek_kayit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dosya_yolu TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  alinan_tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
  otomatik BOOLEAN NOT NULL DEFAULT TRUE,
  notlar TEXT
);

CREATE OR REPLACE VIEW stok_ozet AS
SELECT
  sh.stok_id,
  COALESCE(SUM(CASE WHEN sh.status='ACTIVE' THEN sh.miktar ELSE 0 END),0) AS bakiye_miktar
FROM stok_hareket sh
GROUP BY sh.stok_id;

CREATE OR REPLACE VIEW cari_bakiye_ozet AS
SELECT
  ch.cari_id,
  COALESCE(SUM(CASE WHEN ch.status='ACTIVE' THEN ch.borc  ELSE 0 END),0)
  - COALESCE(SUM(CASE WHEN ch.status='ACTIVE' THEN ch.alacak ELSE 0 END),0) AS bakiye_tutar
FROM cari_hareket ch
GROUP BY ch.cari_id;

CREATE OR REPLACE VIEW kasa_gunluk_ozet AS
SELECT
  date_trunc('day', kh.created_at) AS gun,
  SUM(CASE WHEN kh.status='ACTIVE' AND kh.tur='TAHSILAT' THEN kh.tutar ELSE 0 END) AS toplam_tahsilat,
  SUM(CASE WHEN kh.status='ACTIVE' AND kh.tur='ODEME'    THEN kh.tutar ELSE 0 END) AS toplam_odeme,
  SUM(CASE WHEN kh.status='ACTIVE' AND kh.tur='TAHSILAT' THEN kh.tutar ELSE 0 END)
  - SUM(CASE WHEN kh.status='ACTIVE' AND kh.tur='ODEME'    THEN kh.tutar ELSE 0 END) AS net
FROM kasa_hareket kh
GROUP BY date_trunc('day', kh.created_at);

--[[
-- CREATE OR REPLACE FUNCTION block_delete() RETURNS trigger AS $$
-- BEGIN
--   RAISE EXCEPTION 'DELETE YASAK (iptal/ters kayıt kullanın)';
-- END $$ LANGUAGE plpgsql;
-- DO $$ BEGIN
--   IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_block_delete_fisler') THEN
--     CREATE TRIGGER trg_block_delete_fisler BEFORE DELETE ON fisler FOR EACH ROW EXECUTE FUNCTION block_delete();
--   END IF;
-- END $$;
--]]
