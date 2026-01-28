-- status varsayılan ACTIVE ataması
UPDATE fisler        SET status='ACTIVE' WHERE status IS NULL;
UPDATE fis_kalemleri SET status='ACTIVE' WHERE status IS NULL;
UPDATE stok_hareket  SET status='ACTIVE' WHERE status IS NULL;
UPDATE cari_hareket  SET status='ACTIVE' WHERE status IS NULL;
UPDATE kasa_hareket  SET status='ACTIVE' WHERE status IS NULL;

ALTER TABLE IF EXISTS fisler
  ADD COLUMN IF NOT EXISTS tur fis_turu,
  ADD COLUMN IF NOT EXISTS status fis_status DEFAULT 'ACTIVE' NOT NULL,
  ADD COLUMN IF NOT EXISTS original_id UUID,
  ADD COLUMN IF NOT EXISTS reversed_by_id UUID,
  ADD COLUMN IF NOT EXISTS reason TEXT,
  ADD COLUMN IF NOT EXISTS tarih TIMESTAMPTZ DEFAULT now() NOT NULL,
  ADD COLUMN IF NOT EXISTS para_birim TEXT DEFAULT 'TRY' NOT NULL,
  ADD COLUMN IF NOT EXISTS toplam_tutar NUMERIC(18,2) DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS kdv_tutar    NUMERIC(18,2) DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS net_tutar    NUMERIC(18,2) DEFAULT 0 NOT NULL;

ALTER TABLE IF EXISTS fis_kalemleri
  ADD COLUMN IF NOT EXISTS status fis_status DEFAULT 'ACTIVE' NOT NULL,
  ADD COLUMN IF NOT EXISTS original_id UUID,
  ADD COLUMN IF NOT EXISTS reversed_by_id UUID,
  ADD COLUMN IF NOT EXISTS reason TEXT,
  ADD COLUMN IF NOT EXISTS toplam_tutar NUMERIC(18,2) DEFAULT 0 NOT NULL;

ALTER TABLE IF EXISTS stok_hareket
  ADD COLUMN IF NOT EXISTS status fis_status DEFAULT 'ACTIVE' NOT NULL,
  ADD COLUMN IF NOT EXISTS original_id UUID,
  ADD COLUMN IF NOT EXISTS reversed_by_id UUID,
  ADD COLUMN IF NOT EXISTS reason TEXT;

ALTER TABLE IF EXISTS cari_hareket
  ADD COLUMN IF NOT EXISTS status fis_status DEFAULT 'ACTIVE' NOT NULL,
  ADD COLUMN IF NOT EXISTS original_id UUID,
  ADD COLUMN IF NOT EXISTS reversed_by_id UUID,
  ADD COLUMN IF NOT EXISTS reason TEXT;

ALTER TABLE IF EXISTS kasa_hareket
  ADD COLUMN IF NOT EXISTS status fis_status DEFAULT 'ACTIVE' NOT NULL,
  ADD COLUMN IF NOT EXISTS original_id UUID,
  ADD COLUMN IF NOT EXISTS reversed_by_id UUID,
  ADD COLUMN IF NOT EXISTS reason TEXT,
  ADD COLUMN IF NOT EXISTS tur kasa_turu;

CREATE INDEX IF NOT EXISTS ix_mig_fisler_status ON fisler(status);
CREATE INDEX IF NOT EXISTS ix_mig_fisler_tur    ON fisler(tur);
CREATE INDEX IF NOT EXISTS ix_mig_fisler_tarih  ON fisler(tarih);

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

SELECT s.stok_id, s.bakiye_miktar AS view_bakiye,
       (SELECT COALESCE(SUM(CASE WHEN status='ACTIVE' THEN miktar ELSE 0 END),0) FROM stok_hareket h WHERE h.stok_id=s.stok_id) AS ham_bakiye
FROM stok_ozet s
ORDER BY s.stok_id
LIMIT 50;

SELECT c.cari_id, c.bakiye_tutar AS view_bakiye,
       (SELECT COALESCE(SUM(CASE WHEN status='ACTIVE' THEN borc ELSE 0 END),0) - COALESCE(SUM(CASE WHEN status='ACTIVE' THEN alacak ELSE 0 END),0) FROM cari_hareket h WHERE h.cari_id=c.cari_id) AS ham_bakiye
FROM cari_bakiye_ozet c
ORDER BY c.cari_id
LIMIT 50;
