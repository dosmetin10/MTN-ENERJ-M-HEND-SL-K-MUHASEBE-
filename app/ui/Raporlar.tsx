import React, { useEffect, useState } from "react";

type Row = Record<string, any>;

function toCSV(rows: Row[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const header = cols.join(",");
  const body = rows.map(r => cols.map(c => JSON.stringify(r[c] ?? "")).join(",")).join("\n");
  return header + "\n" + body;
}

export default function Raporlar() {
  const [stok, setStok] = useState<Row[]>([]);
  const [cari, setCari] = useState<Row[]>([]);
  const [kasa, setKasa] = useState<Row[]>([]);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    fetch("/rapor/stok-ozet").then(r=>r.json()).then(setStok);
    fetch("/rapor/cari-bakiye").then(r=>r.json()).then(setCari);
  }, []);

  const loadKasa = () => {
    const qs = date ? `?gun=${encodeURIComponent(date)}` : "";
    fetch(`/rapor/kasa-gunluk${qs}`).then(r=>r.json()).then(setKasa);
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <section className="border rounded p-3">
        <h3>Stok Özet</h3>
        <button onClick={()=> {
          const blob = new Blob([toCSV(stok)], { type: "text/csv" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "stok_ozet.csv";
          a.click();
        }}>CSV</button>
        <ul className="text-sm mt-2 max-h-64 overflow-auto">
          {stok.map((r,i)=> <li key={i}>{r.stok_id} — {r.bakiye_miktar}</li>)}
        </ul>
      </section>

      <section className="border rounded p-3">
        <h3>Cari Bakiye</h3>
        <button onClick={()=> {
          const blob = new Blob([toCSV(cari)], { type: "text/csv" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "cari_bakiye.csv";
          a.click();
        }}>CSV</button>
        <ul className="text-sm mt-2 max-h-64 overflow-auto">
          {cari.map((r,i)=> <li key={i}>{r.cari_id} — {r.bakiye_tutar}</li>)}
        </ul>
      </section>

      <section className="border rounded p-3">
        <h3>Kasa Günlük</h3>
        <div className="flex gap-2 items-center">
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border p-1 rounded"/>
          <button onClick={loadKasa}>Getir</button>
          <button onClick={()=> {
            const blob = new Blob([toCSV(kasa)], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "kasa_gunluk.csv";
            a.click();
          }}>CSV</button>
        </div>
        <ul className="text-sm mt-2 max-h-64 overflow-auto">
          {kasa.map((r,i)=> <li key={i}>{r.gun} — Tahsilat:{r.toplam_tahsilat} Ödeme:{r.toplam_odeme} Net:{r.net}</li>)}
        </ul>
      </section>
    </div>
  );
}
