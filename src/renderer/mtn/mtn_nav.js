(function () {
  if (!window.MTN) window.MTN = {};

  const Nav = {
    _panel: null,
    _scrim: null,
    _title: null,
    _body: null,
    _back: null,
    _open: false,
    _lastTrigger: null,
    _lastPointerAt: 0,

    init() {
      // Sol menü: sadece ana grup başlıkları görünür, alt menü sağ panelden açılır.
      try { document.body.classList.add("mtn-submenu-only"); } catch (_) {}

      this._mount();
      this._forceCollapseAll();
      this._bindSidebarGroups();
      this._bindGlobal();
    },

    _mount() {
      if (document.querySelector(".mtn-submenu-panel")) {
        this._panel = document.querySelector(".mtn-submenu-panel");
        this._scrim = document.querySelector(".mtn-submenu-scrim");
        this._title = this._panel && this._panel.querySelector(".mtn-submenu-title");
        this._body = this._panel && this._panel.querySelector(".mtn-submenu-body");
        this._back = this._panel && this._panel.querySelector(".mtn-submenu-back");
        return;
      }

      const panel = document.createElement("aside");
      panel.className = "mtn-submenu-panel";
      panel.setAttribute("aria-hidden", "true");
      panel.innerHTML = `
        <div class="mtn-submenu-head">
          <button class="mtn-submenu-back" type="button">GERİ</button>
          <div class="mtn-submenu-title">Menü</div>
        </div>
        <div class="mtn-submenu-body"></div>
      `;

      const scrim = document.createElement("div");
      scrim.className = "mtn-submenu-scrim";

      document.body.appendChild(scrim);
      document.body.appendChild(panel);

      this._panel = panel;
      this._scrim = scrim;
      this._title = panel.querySelector(".mtn-submenu-title");
      this._body = panel.querySelector(".mtn-submenu-body");
      this._back = panel.querySelector(".mtn-submenu-back");

      const closeHandler = (e) => {
        try {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
        } catch (_) {}
        this.close();
      };

      // Kapanma garanti: pointerdown + click
      this._back.addEventListener("pointerdown", closeHandler, true);
      this._back.addEventListener("click", closeHandler, true);
      scrim.addEventListener("pointerdown", closeHandler, true);
      scrim.addEventListener("click", closeHandler, true);
    },

    _bindGlobal() {
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this._open) this.close();
      });
      window.addEventListener("resize", () => {
        if (this._open) this._fitPanel();
      });
    },

    _forceCollapseAll() {
      // app.js menü grup aç/kapa davranışı bu projede var.
      // Biz kurumsal alt menü panel mantığı için grupları sürekli kapalı tutuyoruz.
      const groups = document.querySelectorAll(".menu__group");
      groups.forEach((g) => {
        try { g.classList.add("is-collapsed"); } catch (_) {}
        try {
          const k = g.dataset.group || "";
          if (k) localStorage.setItem("mtn_menu_group_" + k, "collapsed");
        } catch (_) {}
      });
    },

    _bindSidebarGroups() {
      const groups = document.querySelectorAll(".menu__group");
      groups.forEach((group) => {
        const key = group.dataset.group || "";
        const sub = group.querySelector(".menu__sub");
        const originalHeader = group.querySelector(".menu__group-header");
        if (!originalHeader || !sub) return;

        // Başlangıçta kesin kapalı
        try { group.classList.add("is-collapsed"); } catch (_) {}
        try { if (key) localStorage.setItem("mtn_menu_group_" + key, "collapsed"); } catch (_) {}

        // app.js içindeki click listener anonim, kaldırılamaz.
        // Bu yüzden header'ı klonlayarak değiştiriyoruz (tüm eski listenerlar silinir).
        const header = originalHeader.cloneNode(true);
        originalHeader.parentNode.replaceChild(header, originalHeader);

        header.classList.add("mtn-menu");
        header.dataset.menuId = key;

        const openSub = (ev, source) => {
          try {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            ev.stopPropagation();
          } catch (_) {}

          // Aynı başlığa tekrar basılırsa: paneli kapat
          if (this._open && this._lastTrigger === header) {
            this.close();
            return;
          }

          this._lastTrigger = header;

          // Sidebar grubunu açık bırakma
          try { group.classList.add("is-collapsed"); } catch (_) {}
          try { if (key) localStorage.setItem("mtn_menu_group_" + key, "collapsed"); } catch (_) {}

          const labelEl = header.querySelector(".menu__label");
          const title = (labelEl ? labelEl.textContent : header.textContent || "").trim() || key.toUpperCase();
          const items = Array.from(sub.querySelectorAll(".menu__subitem"));
          this.open(title, items);
        };

        // Double-fire (pointerdown + click) engeli
        header.addEventListener(
          "pointerdown",
          (e) => {
            this._lastPointerAt = Date.now();
            openSub(e, "pointerdown");
          },
          true
        );

        header.addEventListener(
          "click",
          (e) => {
            // pointerdown yeni çalıştıysa click'i yoksay
            if (Date.now() - this._lastPointerAt < 450) {
              try {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
              } catch (_) {}
              return;
            }
            openSub(e, "click");
          },
          true
        );

        header.addEventListener(
          "keydown",
          (e) => {
            if (e.key === "Enter" || e.key === " ") openSub(e, "keydown");
          },
          true
        );
      });
    },

    _fitPanel() {
      if (!this._panel) return;

      const pad = 10;
      const sidebar = document.querySelector(".sidebar");
      const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : { left: 0, width: 280, right: 280 };

      // Ekran dar mı? (paneli neredeyse tam ekran açacağımız durum)
      const isSmall = (window.innerWidth - sidebarRect.right - pad) < 260;

      // Panel, sidebar'ın hemen sağından başlar.
      let left = sidebarRect.right;

      // Varsayılan genişlik
      let width = 320;

      // Ekran küçükse: paneli ekrana sığdır
      const available = window.innerWidth - left - pad;
      if (available < 260) {
        // Kenarlardan pay bırakıp neredeyse tam ekran yap
        left = pad;
        width = Math.max(260, window.innerWidth - pad * 2);
      } else {
        width = Math.min(width, available);
        width = Math.max(260, width);
        // Sağ taşma olmasın
        const maxLeft = window.innerWidth - width - pad;
        left = Math.min(left, maxLeft);
        left = Math.max(pad, left);
      }

      this._panel.style.left = left + "px";
      this._panel.style.width = width + "px";
      // CSS'de ilk yüklemede right ile hizalanıyor; JS hesaplayınca right devre dışı.
      try { this._panel.style.right = "auto"; } catch (_) {}

      // Scrim: sol menünün üstüne binmesin (menü canlı kalsın)
      try {
        if (this._scrim) {
          const scrimLeft = isSmall ? pad : sidebarRect.right;
          this._scrim.style.left = scrimLeft + "px";
          this._scrim.style.right = "0";
          this._scrim.style.top = "0";
          this._scrim.style.bottom = "0";
        }
      } catch (_) {}
    },

    open(title, sourceItems) {
      if (!this._panel || !this._body) return;

      this._fitPanel();

      this._title.textContent = title || "Menü";
      this._body.innerHTML = "";

      (sourceItems || []).forEach((srcBtn) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "mtn-submenu-item";
        b.textContent = (srcBtn.textContent || "").trim();

        b.addEventListener("click", (e) => {
          try {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
          } catch (_) {}
          try { srcBtn.click(); } catch (_) {}
          this.close();
        });

        this._body.appendChild(b);
      });

      this._open = true;
      try { document.body.classList.add("mtn-submenu-open"); } catch (_) {}

      this._scrim.classList.add("is-on");
      this._panel.classList.add("is-on");
      this._panel.setAttribute("aria-hidden", "false");

      try { this._back.focus(); } catch (_) {}
    },

    close() {
      if (!this._panel) return;

      this._open = false;
      try { document.body.classList.remove("mtn-submenu-open"); } catch (_) {}

      this._panel.classList.remove("is-on");
      this._scrim.classList.remove("is-on");
      this._panel.setAttribute("aria-hidden", "true");

      try { this._lastTrigger && this._lastTrigger.focus(); } catch (_) {}
    }
  };

  window.MTN.Nav = Nav;
})();
