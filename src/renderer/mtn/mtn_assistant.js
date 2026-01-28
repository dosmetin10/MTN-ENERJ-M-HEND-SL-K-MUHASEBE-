(function () {
  if (!window.MTN) window.MTN = {};

  function dateKey(d) {
    try {
      const x = new Date(d);
      if (Number.isNaN(x.getTime())) return "";
      return x.toISOString().slice(0, 10);
    } catch (_) {
      return "";
    }
  }

  function startOfWeekMonday(dt) {
    const d = new Date(dt);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function endOfWeekSunday(dt) {
    const s = startOfWeekMonday(dt);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  }

  function sum(arr) {
    return (arr || []).reduce((a, b) => a + (Number(b) || 0), 0);
  }

  function formatTry(amount) {
    try {
      return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(amount) || 0);
    } catch (_) {
      return (Number(amount) || 0).toFixed(2) + " TL";
    }
  }

  function appendLog(line) {
    const log = document.getElementById("assistant-log");
    if (!log) return;
    const div = document.createElement("div");
    div.textContent = line;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;

    if (window.MTN.TTS && window.MTN.TTS.isEnabled()) {
      if (/^✔/.test(line)) window.MTN.TTS.speak(line.replace(/^✔\s*/, ""));
    }
  }

  async function getDataSafe() {
    try {
      if (window.mtnApp && window.mtnApp.getData) return await window.mtnApp.getData();
    } catch (_) {}
    return {};
  }

  async function cmdTodayTahsilat() {
    const data = await getDataSafe();
    const today = dateKey(new Date());
    const cash = data.cashTransactions || [];
    const todays = cash.filter(x => dateKey(x.createdAt) === today && String(x.type || "").toLowerCase() === "gelir" && (x.customerName || "").trim());
    const total = sum(todays.map(x => Number(x.amount) || 0));
    appendLog("✔ Bugünkü tahsilatlar: " + formatTry(total));
  }

  async function cmdWeekUstaTotal() {
    const data = await getDataSafe();
    const now = new Date();
    const w0 = startOfWeekMonday(now);
    const w1 = endOfWeekSunday(now);

    const customers = data.customers || [];
    const jobs = data.customerJobs || [];

    const ustaIds = new Set(customers.filter(c => (String(c.type || "").toLowerCase() === "usta")).map(c => c.id));
    const rows = jobs.filter(j => ustaIds.has(j.customerId) && new Date(j.createdAt) >= w0 && new Date(j.createdAt) <= w1);
    const total = sum(rows.map(r => Number(r.total) || (Number(r.quantity) || 0) * (Number(r.unitPrice) || 0)));

    appendLog("✔ Bu hafta ustalara puantaj toplamı: " + formatTry(total));
  }

  async function cmdCriticalStock() {
    const data = await getDataSafe();
    const stocks = data.stocks || [];
    const critical = stocks.filter(s => {
      const qty = Number(s.quantity) || 0;
      const crit = Number(s.criticalLevel || s.minLevel || s.minStock || 0) || 0;
      return crit > 0 && qty <= crit;
    });

    if (!critical.length) {
      appendLog("✔ Kritik stok bulunmuyor.");
      return;
    }
    const names = critical.slice(0, 8).map(s => `${s.name || s.title || "Ürün"} (${Number(s.quantity)||0})`).join(", ");
    appendLog("✔ Kritik stok: " + names + (critical.length > 8 ? " ..." : ""));
  }

  async function cmdLast10() {
    const data = await getDataSafe();
    const cash = (data.cashTransactions || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const last = cash.slice(0, 10);
    if (!last.length) {
      appendLog("✔ Son işlem bulunamadı.");
      return;
    }
    appendLog("✔ Son 10 işlem:");
    last.forEach(x => {
      const line = `• ${dateKey(x.createdAt)} | ${x.type || "-"} | ${(x.customerName || "-")} | ${formatTry(x.amount)}`;
      appendLog(line);
    });
  }

  function mountQuickButtons() {
    const wrap = document.querySelector(".assistant-live");
    const input = document.getElementById("assistant-command-input");
    if (!wrap || !input) return;

    let bar = wrap.querySelector(".assistant-live__quick");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "assistant-live__quick";
      bar.innerHTML = `
        <button type="button" class="mtn-quickcmd" data-cmd="today">Bugün tahsilatlar?</button>
        <button type="button" class="mtn-quickcmd" data-cmd="weekUsta">Bu hafta usta toplam?</button>
        <button type="button" class="mtn-quickcmd" data-cmd="critical">Kritik stok?</button>
        <button type="button" class="mtn-quickcmd" data-cmd="last10">Son 10 işlem</button>
      `;
      wrap.appendChild(bar);
    }

    bar.addEventListener("click", async (e) => {
      const b = e.target.closest(".mtn-quickcmd");
      if (!b) return;
      const cmd = b.dataset.cmd;
      if (cmd === "today") return cmdTodayTahsilat();
      if (cmd === "weekUsta") return cmdWeekUstaTotal();
      if (cmd === "critical") return cmdCriticalStock();
      if (cmd === "last10") return cmdLast10();
    });
  }

  function mountReminders() {
    const aside = document.querySelector(".dashboard__aside");
    if (!aside) return;

    let box = document.getElementById("mtn-reminders");
    if (!box) {
      box = document.createElement("article");
      box.className = "info-card";
      box.id = "mtn-reminders";
      box.innerHTML = `
        <h3>CANLI HATIRLATMA</h3>
        <div class="mtn-reminders__items" id="mtn-reminder-items"></div>
        <div class="mtn-reminders__todo">
          <input id="mtn-todo-input" class="search" placeholder="Bugün yapılacak ekle..." />
          <button id="mtn-todo-add" class="ghost" type="button">Ekle</button>
        </div>
      `;
      aside.prepend(box);
    }

    const input = box.querySelector("#mtn-todo-input");
    const add = box.querySelector("#mtn-todo-add");
    add.addEventListener("click", () => {
      const v = String(input.value || "").trim();
      if (!v) return;
      const key = "mtn_todos";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.unshift({ t: v, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr.slice(0, 20)));
      input.value = "";
      refreshReminders();
    });
  }

  async function refreshReminders() {
    const itemsEl = document.getElementById("mtn-reminder-items");
    if (!itemsEl) return;

    const data = await getDataSafe();
    const debts = data.customerDebts || [];

    const now = new Date();
    const horizon = new Date(now);
    horizon.setDate(horizon.getDate() + 3);

    const dueSoon = (debts || []).filter(d => {
      const due = new Date(d.dueDate || d.dueAt || d.due || "");
      if (Number.isNaN(due.getTime())) return false;
      return due >= now && due <= horizon;
    });

    const todos = JSON.parse(localStorage.getItem("mtn_todos") || "[]");

    itemsEl.innerHTML = "";

    const addLine = (title, detail) => {
      const div = document.createElement("div");
      div.className = "mtn-reminder";
      div.innerHTML = `<strong>${title}</strong><div class="muted">${detail}</div>`;
      itemsEl.appendChild(div);
    };

    if (dueSoon.length) {
      const names = dueSoon.slice(0, 5).map(x => x.customerName || x.name || "Cari").join(", ");
      addLine("Vadesi yaklaşan tahsilatlar", names + (dueSoon.length > 5 ? " ..." : ""));
    } else {
      addLine("Vade uyarısı", "3 gün içinde vadesi gelen tahsilat yok.");
    }

    if (todos.length) {
      addLine("Bugün yapılacaklar", todos.slice(0, 5).map(x => "• " + x.t).join("<br/>"));
    } else {
      addLine("Bugün yapılacaklar", "Kayıt yok.");
    }

    const stocks = data.stocks || [];
    const critical = stocks.filter(s => {
      const qty = Number(s.quantity) || 0;
      const crit = Number(s.criticalLevel || s.minLevel || s.minStock || 0) || 0;
      return crit > 0 && qty <= crit;
    });
    if (critical.length) {
      addLine("Kritik stok", critical.slice(0, 5).map(s => `${s.name || "Ürün"} (${Number(s.quantity)||0})`).join(", "));
    } else {
      addLine("Kritik stok", "Kritik ürün yok.");
    }
  }

  function bindEnterInterceptor() {
    const input = document.getElementById("assistant-command-input");
    if (!input) return;

    input.addEventListener("keydown", async (e) => {
      if (e.key !== "Enter") return;

      const raw = String(input.value || "").trim();
      if (!raw) return;

      const q = raw.toLowerCase();

      if (q.includes("bugün") && q.includes("tahsil")) {
        e.preventDefault(); e.stopPropagation();
        input.value = "";
        return cmdTodayTahsilat();
      }
      if (q.includes("bu hafta") && (q.includes("usta") || q.includes("personel"))) {
        e.preventDefault(); e.stopPropagation();
        input.value = "";
        return cmdWeekUstaTotal();
      }
      if (q.includes("kritik") && q.includes("stok")) {
        e.preventDefault(); e.stopPropagation();
        input.value = "";
        return cmdCriticalStock();
      }
      if (q.includes("son 10") && q.includes("işlem")) {
        e.preventDefault(); e.stopPropagation();
        input.value = "";
        return cmdLast10();
      }
    }, true);
  }

  const Assistant = {
    init() {
      mountQuickButtons();
      mountReminders();
      bindEnterInterceptor();
      refreshReminders();
      setInterval(refreshReminders, 60 * 1000);
    }
  };

  window.MTN.Assistant = Assistant;
})();
