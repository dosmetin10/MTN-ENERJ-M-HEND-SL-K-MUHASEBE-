(function () {
  if (!window.MTN) window.MTN = {};

  const LS_KEY = "mtn_tts_enabled";

  function readEnabled() {
    const v = localStorage.getItem(LS_KEY);
    if (v === null) return false;
    return v === "1";
  }
  function writeEnabled(on) {
    localStorage.setItem(LS_KEY, on ? "1" : "0");
  }

  function pickFemaleVoice(voices) {
    if (!voices || !voices.length) return null;

    const tr = voices.filter(v => (v.lang || "").toLowerCase().startsWith("tr"));
    const score = (v) => {
      const name = (v.name || "").toLowerCase();
      const lang = (v.lang || "").toLowerCase();
      let s = 0;
      if (lang.startsWith("tr")) s += 50;
      if (/female|kadin|kadın/.test(name)) s += 40;
      if (/google/.test(name)) s += 10;
      if (/zira|zeynep|ayşe|ayse|selin|elif/.test(name)) s += 15;
      if (v.default) s += 5;
      return s;
    };

    const candidates = (tr.length ? tr : voices).slice().sort((a, b) => score(b) - score(a));
    return candidates[0] || null;
  }

  const TTS = {
    _enabled: false,
    _voice: null,
    _ready: false,

    init() {
      this._enabled = readEnabled();

      const loadVoices = () => {
        try {
          const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
          this._voice = pickFemaleVoice(voices);
          this._ready = true;
        } catch (_) {}
      };

      loadVoices();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => loadVoices();
      }
    },

    isEnabled() { return !!this._enabled; },

    setEnabled(on) {
      this._enabled = !!on;
      writeEnabled(this._enabled);
      if (window.MTN.Toast) {
        window.MTN.Toast.info(this._enabled ? "Konuşma (TTS) açıldı." : "Konuşma (TTS) kapatıldı.");
      }
      if (!this._enabled) this.stop();
    },

    stop() {
      try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (_) {}
    },

    speak(text, opts) {
      if (!this._enabled) return;
      const msg = String(text || "").trim();
      if (!msg) return;

      try {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(msg);
        if (this._voice) u.voice = this._voice;

        u.lang = (this._voice && this._voice.lang) ? this._voice.lang : "tr-TR";
        u.rate = (opts && opts.rate) ? Number(opts.rate) : 1.02;
        u.pitch = (opts && opts.pitch) ? Number(opts.pitch) : 1.05;
        u.volume = (opts && opts.volume) ? Number(opts.volume) : 1.0;

        window.speechSynthesis.speak(u);
      } catch (_) {}
    }
  };

  window.MTN.TTS = TTS;
})();
