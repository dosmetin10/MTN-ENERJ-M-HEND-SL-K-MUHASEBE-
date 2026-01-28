import React from "react";

/**
 * Drop-in layout: keeps Cari list near top, Stok list near bottom (symmetry).
 * Wrap existing table components using the provided slots/props.
 */
type Props = {
  cariTitle?: string;
  stokTitle?: string;
  cariToolbar?: React.ReactNode;
  stokToolbar?: React.ReactNode;
  CariList: React.ReactNode;
  StokList: React.ReactNode;
};

export default function StockCariSymmetric(p: Props){
  return (
    <div className="mtn-shell">
      <div className="mtn-card mtn-top">
        <div className="mtn-card-header mtn-sticky-top">
          <div className="mtn-card-title">{p.cariTitle ?? "Cari Listesi"}</div>
          <div className="mtn-toolbar">{p.cariToolbar}</div>
        </div>
        <div className="mtn-card-body mtn-scroll">
          {p.CariList}
        </div>
      </div>

      <div className="mtn-card mtn-bottom">
        <div className="mtn-card-header mtn-sticky-bottom">
          <div className="mtn-card-title">{p.stokTitle ?? "Stok Listesi"}</div>
          <div className="mtn-toolbar">{p.stokToolbar}</div>
        </div>
        <div className="mtn-card-body mtn-scroll">
          {p.StokList}
        </div>
      </div>
    </div>
  );
}
