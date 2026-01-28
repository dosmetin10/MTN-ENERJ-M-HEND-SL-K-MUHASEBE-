(function () {
  if (!window.MTN) window.MTN = {};

  const LS_KEY = "mtn_theme_config_v2";
  const LS_PRESET = "mtn_theme_preset_v2";

  // Presetler: Light varsayılan okunabilir + kurumsal.
  const PRESETS = {
    white: {
      name: "Kurumsal Beyaz",
      // Uygulama arkaplanı hafif gri, paneller beyaz (örnek ekran gibi)
      bg: "#f6f7fb",
      bg2: "#eef2ff",
      panel: "#ffffff",
      panel2: "#f9fafb",
      text: "#0f172a",
      title: "#0b1220",
      muted: "#64748b",
      primary: "#2563eb",
      primary2: "#1d4ed8",
      accent: "#2563eb",
      buttonText: "#ffffff",
      border: "rgba(15,23,42,0.14)",
      tableHead: "#eef2f7",
      zebra1: "#ffffff",
      zebra2: "#f8fafc",
      sidebar: "#ffffff",
      sidebarDark: "#f3f4f6",
      shadow: "0 14px 40px rgba(15,23,42,0.10)",
      shadowSoft: "0 10px 26px rgba(15,23,42,0.08)"
    },
    dark: {
      name: "Kurumsal Koyu",
      bg: "#081427",
      bg2: "#0b1c36",
      panel: "#102545",
      panel2: "#12305a",
      text: "#f2f6ff",
      title: "#ffffff",
      muted: "#b6c5e6",
      primary: "#2f6bff",
      primary2: "#1f55d8",
      accent: "#4aa3ff",
      buttonText: "#ffffff",
      border: "rgba(255,255,255,0.10)",
      tableHead: "rgba(255,255,255,0.06)",
      zebra1: "rgba(255,255,255,0.02)",
      zebra2: "rgba(255,255,255,0.04)",
      sidebar: "#07152c",
      sidebarDark: "#050f22",
      shadow: "0 14px 40px rgba(0,0,0,0.35)",
      shadowSoft: "0 10px 26px rgba(0,0,0,0.22)"
    },
    mtn: {
      name: "MTN Metalik Mavi",
      bg: "#081427",
      bg2: "#0b1c36",
      panel: "#102545",
      panel2: "#12305a",
      text: "#f2f6ff",
      title: "#ffffff",
      muted: "#b6c5e6",
      primary: "#2f6bff",
      primary2: "#1f55d8",
      accent: "#4aa3ff",
      buttonText: "#ffffff",
      border: "rgba(255,255,255,0.10)",
      tableHead: "rgba(255,255,255,0.06)",
      zebra1: "rgba(255,255,255,0.02)",
      zebra2: "rgba(255,255,255,0.05)",
      sidebar: "#07152c",
      sidebarDark: "#050f22",
      shadow: "0 14px 40px rgba(0,0,0,0.35)",
      shadowSoft: "0 10px 26px rgba(0,0,0,0.22)"
    }
  };

  function safeParse(json, fallback) {
    try { return JSON.parse(json); } catch (_) { return fallback; }
  }

  function luminance(hex) {
    const h = String(hex || "").replace("#", "");
    if (h.length !== 6) return 1;
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function autoText(bg) {
    return luminance(bg) > 0.55 ? "#0f172a" : "#f3f4f6";
  }

  function applyVars(cfg) {
    const c = cfg || PRESETS.white;
    const root = document.documentElement;

    // ana renkler
    const bg = c.bg || c.background || "#ffffff";
    const bg2 = c.bg2 || "#f6f7fb";
    const panel = c.panel || "#ffffff";
    const panel2 = c.panel2 || "#f9fafb";

    const ink = c.text || autoText(bg);
    const title = c.title || ink;

    const primary = c.primary || "#1d4ed8";
    const primary2 = c.primary2 || primary;
    const accent = c.accent || primary;

    const border = c.border || (luminance(bg) > 0.55 ? "rgba(15,23,42,0.14)" : "rgba(255,255,255,0.10)");
    const muted = c.muted || (luminance(bg) > 0.55 ? "#64748b" : "#b7c3d6");

    // okunabilirlik kurtarma
    // Eğer ink ile bg aynıysa otomatik düzelt.
    if (String(ink).toLowerCase() === String(bg).toLowerCase()) {
      c.text = autoText(bg);
    }

    root.style.setProperty("--bg", bg);
    root.style.setProperty("--bg-2", bg2);
    root.style.setProperty("--panel", panel);
    root.style.setProperty("--panel-2", panel2);

    root.style.setProperty("--ink", ink);
    root.style.setProperty("--muted", muted);

    root.style.setProperty("--primary", primary);
    root.style.setProperty("--primary-dark", primary2);
    root.style.setProperty("--accent", accent);

    // styles.css içinde bazı yerlerde bu değişkenler kullanılıyor
    root.style.setProperty("--blue", primary);
    root.style.setProperty("--blue-2", primary2);

    root.style.setProperty("--sidebar", c.sidebar || panel);
    root.style.setProperty("--sidebar-dark", c.sidebarDark || panel2);

    root.style.setProperty("--border", border);
    root.style.setProperty("--border-2", border);

    root.style.setProperty("--shadow", c.shadow || "0 14px 40px rgba(15,23,42,0.10)");
    root.style.setProperty("--shadow-soft", c.shadowSoft || "0 10px 26px rgba(15,23,42,0.08)");

    // MTN detay
    root.style.setProperty("--mtn-title", title);
    root.style.setProperty("--mtn-btn-text", c.buttonText || "#ffffff");
    root.style.setProperty("--mtn-table-head", c.tableHead || "#eef2f7");
    root.style.setProperty("--mtn-zebra-1", c.zebra1 || "#ffffff");
    root.style.setProperty("--mtn-zebra-2", c.zebra2 || "#f8fafc");

    // tarayıcı form kontrol uyumu
    root.style.colorScheme = luminance(bg) > 0.55 ? "light" : "dark";
  }

  function loadConfig() {
    const cfg = safeParse(localStorage.getItem(LS_KEY) || "", null);
    if (cfg && (cfg.bg || cfg.background)) return cfg;
    const preset = localStorage.getItem(LS_PRESET) || "mtn";
    return PRESETS[preset] || PRESETS.white;
  }

  function saveConfig(cfg) {
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  }

  function setPreset(id) {
    const p = PRESETS[id] || PRESETS.white;
    localStorage.setItem(LS_PRESET, id);
    saveConfig(p);
    applyVars(p);
    if (window.MTN && MTN.Toast) MTN.Toast.success("Tema uygulandı: " + p.name);
  }

  function mountSettingsUI() {
    const settingsPanel = document.getElementById("settings-panel");
    if (!settingsPanel) return;

    // Eski küçük tema kartını gizle (bozmadan)
    const oldThemeForm = document.getElementById("theme-form");
    if (oldThemeForm) {
      const card = oldThemeForm.closest(".table-card") || oldThemeForm.parentElement;
      if (card) card.classList.add("mtn-hidden");
    }

    let host = document.getElementById("mtn-theme-settings");
    if (host) return;

    host = document.createElement("div");
    host.id = "mtn-theme-settings";
    host.className = "table-card";
    host.innerHTML = `
      <h3>Tema (Kurumsal ve Okunur)</h3>

      <div class="mtn-theme-presets">
        <button class="ghost" type="button" data-preset="white">Kurumsal Beyaz</button>
        <button class="ghost" type="button" data-preset="dark">Kurumsal Koyu</button>
        <button class="ghost" type="button" data-preset="mtn">MTN Özel</button>
        <button class="ghost" type="button" id="mtn-theme-safe">Okunur Varsayılan</button>
      </div>

      <div class="mtn-theme-fields">
        <label>Arkaplan <input type="color" data-k="bg"></label>
        <label>Arkaplan 2 <input type="color" data-k="bg2"></label>
        <label>Panel <input type="color" data-k="panel"></label>
        <label>Panel 2 <input type="color" data-k="panel2"></label>

        <label>Metin <input type="color" data-k="text"></label>
        <label>Başlık <input type="color" data-k="title"></label>
        <label>Vurgu (Primary) <input type="color" data-k="primary"></label>
        <label>Buton Yazı <input type="color" data-k="buttonText"></label>

        <label>Tablo Başlık <input type="color" data-k="tableHead"></label>
        <label>Zebra 1 <input type="color" data-k="zebra1"></label>
        <label>Zebra 2 <input type="color" data-k="zebra2"></label>
      </div>

      <div class="mtn-theme-actions">
        <button class="primary" id="mtn-theme-save" type="button">Kaydet & Uygula</button>
        <button class="ghost" id="mtn-theme-reset" type="button">Sıfırla</button>
      </div>

      <hr class="mtn-sep"/>

      <div class="mtn-settings-inline">
        <label class="mtn-toggle">
          <input type="checkbox" id="mtn-sfx-toggle">
          <span>Ses Efektleri</span>
        </label>

        <label class="mtn-toggle">
          <input type="checkbox" id="mtn-tts-toggle">
          <span>Konuşma (Kadın Ses)</span>
        </label>

        <label class="mtn-inline">
          Varsayılan Vade (Gün)
          <input type="number" min="0" step="1" id="mtn-default-due" style="max-width:120px">
        </label>

        <button class="ghost" type="button" id="mtn-default-due-save">Vade Kaydet</button>
      </div>

      <div class="mtn-theme-preview">
        <div class="mtn-preview-head">
          <strong>Önizleme</strong>
          <button class="primary" type="button">Örnek Buton</button>
        </div>
        <table class="table mtn-grid">
          <thead><tr><th>Başlık</th><th>Tutar</th><th>Durum</th></tr></thead>
          <tbody>
            <tr><td>Satır 1</td><td>1.250</td><td>Aktif</td></tr>
            <tr><td>Satır 2</td><td>540</td><td>Beklemede</td></tr>
            <tr><td>Satır 3</td><td>90</td><td>Kapalı</td></tr>
          </tbody>
        </table>
      </div>

      <p class="muted" style="margin-top:10px">Okunabilirlik kuralı: Metin ve arkaplan zıt olmalıdır.</p>
    `;

    const module = settingsPanel.querySelector(".module") || settingsPanel;
    module.appendChild(host);

    const cfg = loadConfig();

    const bind = () => {
      host.querySelectorAll('input[type="color"][data-k]').forEach(inp => {
        const k = inp.dataset.k;
        const def = (PRESETS.white[k] || PRESETS.white.background || "#ffffff");
        inp.value = cfg[k] || def;
        inp.addEventListener("input", () => {
          cfg[k] = inp.value;
          applyVars(cfg);
        });
      });
    };
    bind();

    host.querySelector(".mtn-theme-presets").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-preset]");
      if (!b) return;
      setPreset(b.dataset.preset);
      const fresh = loadConfig();
      Object.assign(cfg, fresh);
      bind();
    });

    host.querySelector("#mtn-theme-safe").addEventListener("click", () => {
      setPreset("white");
      if (window.MTN && MTN.Toast) MTN.Toast.info("Okunur varsayılan tema uygulandı.");
    });

    host.querySelector("#mtn-theme-save").addEventListener("click", () => {
      // otomatik kontrast kurtarma
      const bg = cfg.bg || cfg.background || "#ffffff";
      if (String(cfg.text || "").toLowerCase() === String(bg).toLowerCase()) {
        cfg.text = autoText(bg);
        if (window.MTN && MTN.Toast) MTN.Toast.warn("Metin rengi okunabilirlik için otomatik düzeltildi.");
      }
      saveConfig(cfg);
      applyVars(cfg);
      if (window.MTN && MTN.Toast) MTN.Toast.success("Tema kaydedildi ve uygulandı.");
    });

    host.querySelector("#mtn-theme-reset").addEventListener("click", () => {
      localStorage.removeItem(LS_KEY);
      localStorage.setItem(LS_PRESET, "white");
      // reset sonrası v13 zorlamasını da yeniden uygula
      localStorage.setItem("mtn_theme_forced_light_v13", "1");
      const fresh = loadConfig();
      applyVars(fresh);
      bind();
      if (window.MTN && MTN.Toast) MTN.Toast.info("Tema sıfırlandı.");
    });

    // Ses / TTS / Vade
    const sfx = host.querySelector("#mtn-sfx-toggle");
    const tts = host.querySelector("#mtn-tts-toggle");
    const due = host.querySelector("#mtn-default-due");
    const dueSave = host.querySelector("#mtn-default-due-save");

    if (window.MTN && MTN.Sound) sfx.checked = MTN.Sound.isEnabled();
    if (window.MTN && MTN.TTS) tts.checked = MTN.TTS.isEnabled();
    if (window.MTN && MTN.Rules) due.value = String(MTN.Rules.getDefaultDueDays() || 15);

    sfx.addEventListener("change", () => window.MTN && MTN.Sound && MTN.Sound.setEnabled(sfx.checked));
    tts.addEventListener("change", () => window.MTN && MTN.TTS && MTN.TTS.setEnabled(tts.checked));
    dueSave.addEventListener("click", () => {
      if (!window.MTN || !MTN.Rules) return;
      const v = MTN.Rules.setDefaultDueDays(due.value);
      if (MTN.Toast) MTN.Toast.success("Varsayılan vade güncellendi: " + v);
    });
  }

  const Theme = {
    init() {
      // v4 geçiş onarımı: önceki sürüm beyaz tema kaydı kaldıysa metalik temaya döndür
      try {
        if (!localStorage.getItem("mtn_theme_migrated_v4")) {
          const preset = localStorage.getItem("mtn_theme_preset") || "";
          const raw = safeParse(localStorage.getItem("mtn_theme_config_v1") || "", null);
          const looksWhite =
            preset === "white" ||
            (raw && ((raw.bg || raw.background || "").toLowerCase() === "#ffffff"));
          if (looksWhite) {
            localStorage.setItem("mtn_theme_preset", "mtn");
            localStorage.removeItem("mtn_theme_config_v1");
          }
          localStorage.setItem("mtn_theme_migrated_v4", "1");
        }
      } catch (_) {}

      // v13: Varsayılan tema artık "Kurumsal Beyaz" (örnek ekran uyumu)
      // Kullanıcı isterse Ayarlar > Tema kısmından yeniden Koyu/MTN seçebilir.
      try {
        if (!localStorage.getItem("mtn_theme_forced_light_v13")) {
          localStorage.setItem(LS_PRESET, "white");
          saveConfig(PRESETS.white);
          localStorage.setItem("mtn_theme_forced_light_v13", "1");
        }
      } catch (_) {}

      const cfg = loadConfig();
      applyVars(cfg);
      // UI injection: sayfa açıldıktan sonra çalışsın
      setTimeout(mountSettingsUI, 0);
    },
    setPreset,
    apply(config) { applyVars(config); saveConfig(config); }
  };

  window.MTN.Theme = Theme;
})();