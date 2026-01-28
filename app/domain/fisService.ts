import { PoolClient } from "pg";

export type FisKalemi = {
  stok_id: string;
  miktar: number;
  birim: string;
  birim_fiyat: number;
  iskonto_oran?: number;
  kdv_oran?: number;
};
export type CreateFisPayload = {
  tur: "SATIS" | "SATIS_IADE" | "ALIS" | "ALIS_IADE" | "TRANSFER" | "DÜZELTME";
  cari_id?: string;
  para_birim?: string;
  kalemler: FisKalemi[];
  tahsilat?: { tutar: number };
  odeme?: { tutar: number };
};

function calcTotals(kalemler: FisKalemi[]): { brut: number; kdv: number; net: number } {
  const brut = kalemler.reduce((s, k) => s + (k.miktar * k.birim_fiyat) * (1 - (k.iskonto_oran ?? 0)/100), 0);
  const avgKdv = kalemler.length ? (kalemler.reduce((s,k)=> s + (k.kdv_oran ?? 0), 0)/kalemler.length) : 0;
  const kdv = +(brut * (avgKdv/100)).toFixed(2);
  const net = +(brut + kdv).toFixed(2);
  return { brut:+brut.toFixed(2), kdv, net };
}

export async function createFis(client: PoolClient, payload: CreateFisPayload): Promise<{ fis_id: string }> {
  const { brut, kdv, net } = calcTotals(payload.kalemler);
  const para_birim = payload.para_birim ?? "TRY";

  const fisRes = await client.query(
    `INSERT INTO fisler(tur,status,reason,tarih,para_birim,toplam_tutar,kdv_tutar,net_tutar,cari_id)
     VALUES($1,'ACTIVE',NULL,now(),$2,$3,$4,$5,$6) RETURNING id`,
    [payload.tur, para_birim, brut, kdv, net, payload.cari_id ?? null]
  );
  const fisId: string = fisRes.rows[0].id;

  for (const k of payload.kalemler) {
    await client.query(
      `INSERT INTO fis_kalemleri(fis_id,stok_id,miktar,birim,birim_fiyat,iskonto_oran,kdv_oran,toplam_tutar,status)
       VALUES($1,$2,$3,$4,$5,$6,$7,ROUND(($3*$5)*(1-COALESCE($6,0)/100.0),2),'ACTIVE')`,
      [fisId, k.stok_id, k.miktar, k.birim, k.birim_fiyat, k.iskonto_oran ?? 0, k.kdv_oran ?? 0]
    );
  }

  if (payload.tur === "SATIS") {
    for (const k of payload.kalemler) {
      await client.query(
        `INSERT INTO stok_hareket(stok_id,fis_id,miktar,status) VALUES($1,$2,$3,'ACTIVE')`,
        [k.stok_id, fisId, -Math.abs(k.miktar)]
      );
    }
    if (payload.cari_id) {
      await client.query(
        `INSERT INTO cari_hareket(cari_id,fis_id,borc,alacak,status) VALUES($1,$2,$3,0,'ACTIVE')`,
        [payload.cari_id, fisId, net]
      );
    }
    if (payload.tahsilat?.tutar && payload.tahsilat.tutar > 0) {
      await client.query(
        `INSERT INTO kasa_hareket(fis_id,tur,tutar,status) VALUES($1,'TAHSILAT',$2,'ACTIVE')`,
        [fisId, payload.tahsilat.tutar]
      );
      if (payload.cari_id) {
        await client.query(
          `INSERT INTO cari_hareket(cari_id,fis_id,borc,alacak,status) VALUES($1,$2,0,$3,'ACTIVE')`,
          [payload.cari_id, fisId, payload.tahsilat.tutar]
        );
      }
    }
  } else if (payload.tur === "ALIS") {
    for (const k of payload.kalemler) {
      await client.query(
        `INSERT INTO stok_hareket(stok_id,fis_id,miktar,status) VALUES($1,$2,$3,'ACTIVE')`,
        [k.stok_id, fisId, Math.abs(k.miktar)]
      );
    }
    if (payload.cari_id) {
      await client.query(
        `INSERT INTO cari_hareket(cari_id,fis_id,borc,alacak,status) VALUES($1,$2,0,$3,'ACTIVE')`,
        [payload.cari_id, fisId, net]
      );
    }
    if (payload.odeme?.tutar && payload.odeme.tutar > 0) {
      await client.query(
        `INSERT INTO kasa_hareket(fis_id,tur,tutar,status) VALUES($1,'ODEME',$2,'ACTIVE')`,
        [fisId, payload.odeme.tutar]
      );
      if (payload.cari_id) {
        await client.query(
          `INSERT INTO cari_hareket(cari_id,fis_id,borc,alacak,status) VALUES($1,$2,$3,0,'ACTIVE')`,
          [payload.cari_id, fisId, payload.odeme.tutar]
        );
      }
    }
  } else if (payload.tur === "SATIS_IADE") {
    for (const k of payload.kalemler) {
      await client.query(
        `INSERT INTO stok_hareket(stok_id,fis_id,miktar,status) VALUES($1,$2,$3,'ACTIVE')`,
        [k.stok_id, fisId, Math.abs(k.miktar)]
      );
    }
    if (payload.cari_id) {
      await client.query(
        `INSERT INTO cari_hareket(cari_id,fis_id,borc,alacak,status) VALUES($1,$2,0,$3,'ACTIVE')`,
        [payload.cari_id, fisId, net]
      );
    }
  } else if (payload.tur === "ALIS_IADE") {
    for (const k of payload.kalemler) {
      await client.query(
        `INSERT INTO stok_hareket(stok_id,fis_id,miktar,status) VALUES($1,$2,$3,'ACTIVE')`,
        [k.stok_id, fisId, -Math.abs(k.miktar)]
      );
    }
    if (payload.cari_id) {
      await client.query(
        `INSERT INTO cari_hareket(cari_id,fis_id,borc,alacak,status) VALUES($1,$2,$3,0,'ACTIVE')`,
        [payload.cari_id, fisId, net]
      );
    }
  }
  return { fis_id: fisId };
}

export async function cancelFis(client: PoolClient, fisId: string, reason: string): Promise<void> {
  const row = await client.query(`SELECT status FROM fisler WHERE id=$1 FOR UPDATE`, [fisId]);
  if (!row.rowCount) throw new Error("P0002:Fis yok");
  if (row.rows[0].status !== "ACTIVE") throw new Error("P0001:ACTIVE olmayan fiş iptal edilemez");

  await client.query(`UPDATE fisler SET status='CANCELLED', reason=$2, updated_at=now() WHERE id=$1`, [fisId, reason]);
  await client.query(`UPDATE fis_kalemleri SET status='CANCELLED', reason=$2 WHERE fis_id=$1`, [fisId, reason]);
  await client.query(`UPDATE stok_hareket   SET status='CANCELLED', reason=$2 WHERE fis_id=$1`, [fisId, reason]);
  await client.query(`UPDATE cari_hareket   SET status='CANCELLED', reason=$2 WHERE fis_id=$1`, [fisId, reason]);
  await client.query(`UPDATE kasa_hareket   SET status='CANCELLED', reason=$2 WHERE fis_id=$1`, [fisId, reason]);
}

export async function reverseFis(client: PoolClient, fisId: string, reason: string): Promise<{ reversed_id: string }> {
  const head = await client.query(`SELECT id, tur, status, cari_id FROM fisler WHERE id=$1 FOR UPDATE`, [fisId]);
  if (!head.rowCount) throw new Error("P0002:Fis yok");
  const h = head.rows[0];
  if (h.status !== "ACTIVE") throw new Error("P0001:ACTIVE olmayan fiş terslenemez");

  const rev = await client.query(
    `INSERT INTO fisler(tur,status,original_id,reason,para_birim,toplam_tutar,kdv_tutar,net_tutar,cari_id)
     SELECT tur,'REVERSED',id,$2,para_birim,toplam_tutar,kdv_tutar,net_tutar,cari_id FROM fisler WHERE id=$1 RETURNING id`,
    [fisId, reason]
  );
  const reversedId = rev.rows[0].id;

  await client.query(`UPDATE fisler SET reversed_by_id=$2 WHERE id=$1`, [fisId, reversedId]);

  await client.query(
    `INSERT INTO fis_kalemleri(fis_id,stok_id,miktar,birim,birim_fiyat,iskonto_oran,kdv_oran,toplam_tutar,status,original_id,reason)
     SELECT $1, stok_id, -miktar, birim, birim_fiyat, iskonto_oran, kdv_oran, toplam_tutar,'REVERSED', id, $2
     FROM fis_kalemleri WHERE fis_id=$3 AND status='ACTIVE'`,
    [reversedId, reason, fisId]
  );

  await client.query(
    `INSERT INTO stok_hareket(stok_id,fis_id,miktar,status,original_id,reason)
     SELECT stok_id, $1, -miktar, 'REVERSED', id, $2
     FROM stok_hareket WHERE fis_id=$3 AND status='ACTIVE'`,
    [reversedId, reason, fisId]
  );

  await client.query(
    `INSERT INTO cari_hareket(cari_id,fis_id,borc,alacak,status,original_id,reason)
     SELECT cari_id, $1, alacak, borc, 'REVERSED', id, $2
     FROM cari_hareket WHERE fis_id=$3 AND status='ACTIVE'`,
    [reversedId, reason, fisId]
  );

  await client.query(
    `INSERT INTO kasa_hareket(fis_id,tur,tutar,status,original_id,reason)
     SELECT $1, CASE WHEN tur='TAHSILAT' THEN 'ODEME' ELSE 'TAHSILAT' END, tutar, 'REVERSED', id, $2
     FROM kasa_hareket WHERE fis_id=$3 AND status='ACTIVE'`,
    [reversedId, reason, fisId]
  );

  return { reversed_id: reversedId };
}
