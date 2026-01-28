(function () {
  if (!window.MTN) window.MTN = {};

  const LS_DUE = "mtn_default_due_days";

  function getDefaultDueDays() {
    const v = Number(localStorage.getItem(LS_DUE));
    if (!Number.isFinite(v)) return 15;
    return Math.max(0, Math.floor(v));
  }

  function setDefaultDueDays(n) {
    const x = Math.max(0, Math.floor(Number(n) || 0));
    localStorage.setItem(LS_DUE, String(x));
    return x;
  }

  function normalizeCariType(t) {
    const s = String(t || "").toLowerCase().trim();
    if (s === "musteri" || s === "müşteri") return "musteri";
    if (s === "tedarikci" || s === "tedarikçi") return "tedarikci";
    if (s === "usta" || s === "personel") return "usta";
    return "musteri";
  }

  function enforceTransaction(cariType, txType) {
    const ct = normalizeCariType(cariType);
    const tt = String(txType || "").toLowerCase().trim();

    if (ct === "musteri" && tt === "odeme") {
      return { ok: false, message: "Müşteri için ödeme değil tahsilat yapılır." };
    }
    if (ct === "tedarikci" && tt === "tahsilat") {
      return { ok: false, message: "Tedarikçi için tahsilat değil ödeme yapılır." };
    }
    if (ct === "usta" && tt === "tahsilat") {
      return { ok: false, message: "Usta/Personel için tahsilat olmaz. Sadece ödeme yapılır." };
    }
    return { ok: true, message: "" };
  }

  function warn(msg) {
    if (window.MTN.Toast) window.MTN.Toast.warn(msg);
    else alert(msg);
  }

  window.MTN.Rules = {
    normalizeCariType,
    getDefaultDueDays,
    setDefaultDueDays,
    enforceTransaction,
    guardTransaction(cariType, txType) {
      const r = enforceTransaction(cariType, txType);
      if (!r.ok) warn(r.message);
      return r.ok;
    }
  };
})();
