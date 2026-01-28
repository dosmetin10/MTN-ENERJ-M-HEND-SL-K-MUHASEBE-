(function () {
  if (!window.MTN) window.MTN = {};

  const LS_KEY = "mtn_sound_fx_enabled";

  function readEnabled() {
    const v = localStorage.getItem(LS_KEY);
    if (v === null) return true;
    return v === "1";
  }

  function writeEnabled(on) {
    localStorage.setItem(LS_KEY, on ? "1" : "0");
  }

  function safeResume(ctx) {
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try { ctx.resume(); } catch (_) {}
    }
  }

  const Sound = {
    _enabled: true,
    _ctx: null,

    init() {
      this._enabled = readEnabled();
      const unlock = () => {
        if (!this._ctx) {
          try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
        }
        safeResume(this._ctx);
        window.removeEventListener("pointerdown", unlock, true);
        window.removeEventListener("keydown", unlock, true);
      };
      window.addEventListener("pointerdown", unlock, true);
      window.addEventListener("keydown", unlock, true);
    },

    isEnabled() { return !!this._enabled; },

    setEnabled(on) {
      this._enabled = !!on;
      writeEnabled(this._enabled);
      if (window.MTN.Toast) {
        window.MTN.Toast.info(this._enabled ? "Ses efektleri açıldı." : "Ses efektleri kapatıldı.");
      }
    },

    click() {
      if (!this._enabled) return;
      if (!this._ctx) {
        try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) { return; }
      }
      safeResume(this._ctx);

      const ctx = this._ctx;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(1600, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.03);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    }
  };

  window.MTN.Sound = Sound;
})();
