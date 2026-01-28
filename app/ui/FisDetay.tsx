import React, { useMemo, useState } from "react";
import { canCancel, canReverse } from "../security/roles";

type Props = {
  userRole: "ADMIN" | "USER";
  fis: { id: string; tur: string; status: "ACTIVE"|"CANCELLED"|"REVERSED"; net_tutar: number };
  onCancel: (id: string, reason: string) => Promise<void>;
  onReverse: (id: string, reason: string) => Promise<void>;
};

const Badge: React.FC<{ status: Props["fis"]["status"] }> = ({ status }) => {
  const color = status === "ACTIVE" ? "#3b82f6" : status === "CANCELLED" ? "#9ca3af" : "#f59e0b";
  return <span style={{ background: color, color: "#fff", padding: "4px 8px", borderRadius: 8 }}>{status}</span>;
};

export default function FisDetay({ userRole, fis, onCancel, onReverse }: Props) {
  const [reason, setReason] = useState("");
  const allowCancel = useMemo(() => canCancel(userRole, fis.status), [userRole, fis.status]);
  const allowReverse = useMemo(() => canReverse(userRole, fis.status), [userRole, fis.status]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2>Fiş #{fis.id}</h2>
        <Badge status={fis.status} />
      </div>

      <div className="text-sm">
        <div>Tür: {fis.tur}</div>
        <div>Net: {fis.net_tutar.toFixed(2)} TL</div>
        <div className="text-amber-600 mt-2">
          {fis.tur.includes("SATIS") ? "Faturada stok düşer." : fis.tur.includes("ALIS") ? "Alışta stok artar." : "Düzeltme/Transfer özel değerlendirilir."}
        </div>
      </div>

      <input
        placeholder="Gerekçe"
        value={reason}
        onChange={e => setReason(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <div className="flex gap-8">
        <button
          onClick={() => onCancel(fis.id, reason)}
          disabled={!allowCancel}
          title={allowCancel ? "" : "ADMIN gerekli"}
          className={`px-4 py-2 rounded ${allowCancel ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-600"}`}
        >
          İptal
        </button>
        <button
          onClick={() => onReverse(fis.id, reason)}
          disabled={!allowReverse}
          title={allowReverse ? "" : "ADMIN gerekli"}
          className={`px-4 py-2 rounded ${allowReverse ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-600"}`}
        >
          Ters Kayıt
        </button>
      </div>
    </div>
  );
}
