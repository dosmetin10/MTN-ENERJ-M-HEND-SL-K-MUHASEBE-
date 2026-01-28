import React from "react";
import StockCariSymmetric from "../layout/StockCariSymmetric";

/** Replace the tables with your existing components **/
const DummyTable: React.FC<{rows?:number, label?:string}> = ({rows=8,label="Table"}) => (
  <table style={{width:"100%"}}>
    <thead><tr><th className="mtn-muted" style={{textAlign:"left"}}>{label} Başlık</th></tr></thead>
    <tbody>
      {Array.from({length: rows}).map((_,i)=>(
        <tr key={i}><td style={{padding:"6px 0", borderBottom:"1px solid #1f2937"}}>Satır {i+1}</td></tr>
      ))}
    </tbody>
  </table>
);

export default function StockCariDemoPage(){
  return (
    <StockCariSymmetric
      cariTitle="MTN Enerji Mühendislik — Cari Listesi"
      stokTitle="MTN Enerji Mühendislik — Stok Listesi"
      cariToolbar={<>
        <button className="mtn-btn">Ekle</button>
        <button className="mtn-btn">Dışa Aktar</button>
        <span className="mtn-muted">Top 100</span>
      </>}
      stokToolbar={<>
        <button className="mtn-btn">Etiket</button>
        <button className="mtn-btn">Barkod</button>
        <span className="mtn-muted">Top 100</span>
      </>}
      CariList={<DummyTable label="Cari"/>}
      StokList={<DummyTable label="Stok"/>}
    />
  );
}
