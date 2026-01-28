(function () {
  if (!window.MTN) window.MTN = {};

  const KEY_HOST_ID = "mtn-toast-host";

  function ensureHost() {
    let host = document.getElementById(KEY_HOST_ID);
    if (host) return host;

    host = document.createElement("div");
    host.id = KEY_HOST_ID;
    host.className = "mtn-toast-host";
    document.body.appendChild(host);
    return host;
  }

  function buildToast(message, type) {
    const el = document.createElement("div");
    el.className = `mtn-toast mtn-toast--${type || "info"}`;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    const text = document.createElement("div");
    text.className = "mtn-toast__text";
    text.textContent = String(message || "");

    const close = document.createElement("button");
    close.className = "mtn-toast__close";
    close.type = "button";
    close.textContent = "×";
    close.addEventListener("click", () => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 200);
    });

    el.appendChild(text);
    el.appendChild(close);
    return el;
  }

  const Toast = {
    init() {
      try { ensureHost(); } catch (_) {}
    },

    show(message, type, opts) {
      const host = ensureHost();
      const el = buildToast(message, type);

      host.appendChild(el);
      requestAnimationFrame(() => el.classList.add("is-on"));

      const duration = (opts && Number(opts.duration)) || 3200;
      if (duration > 0) {
        setTimeout(() => {
          if (!el.isConnected) return;
          el.classList.add("is-leaving");
          setTimeout(() => el.remove(), 220);
        }, duration);
      }
      return el;
    },

    success(msg, opts) { return this.show(msg, "success", opts); },
    warn(msg, opts) { return this.show(msg, "warn", opts); },
    error(msg, opts) { return this.show(msg, "error", opts); },
    info(msg, opts) { return this.show(msg, "info", opts); }
  };

  window.MTN.Toast = Toast;
})();
