(() => {
  const DEFAULT_LANG = "fr";
  const SUPPORTED = ["fr", "en", "es"];

  function getStoredLang() {
    const raw = localStorage.getItem("wavecheck:lang");
    return SUPPORTED.includes(raw) ? raw : null;
  }

  function detectLang() {
    const stored = getStoredLang();
    if (stored) return stored;
    const nav = (navigator.language || "").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : DEFAULT_LANG;
  }

  async function loadResource(lang) {
    const res = await fetch(`../locales/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`i18n: failed ${lang}`);
    return res.json();
  }

  function applyTranslations(root = document) {
    const nodes = root.querySelectorAll("[data-i18n]");
    nodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const txt = window.i18next?.t ? window.i18next.t(key) : null;
      if (txt && txt !== key) el.textContent = txt;
    });
  }

  async function setLanguage(lang) {
    const next = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
    localStorage.setItem("wavecheck:lang", next);

    if (!window.i18next) return; // i18next chargé via CDN
    const resources = await loadResource(next);

    if (!window.i18next.isInitialized) {
      await window.i18next.init({
        lng: next,
        fallbackLng: DEFAULT_LANG,
        resources: { [next]: { translation: resources } },
        interpolation: { escapeValue: false },
      });
    } else {
      window.i18next.addResourceBundle(next, "translation", resources, true, true);
      await window.i18next.changeLanguage(next);
    }

    document.documentElement.lang = next;
    applyTranslations();
  }

  function bindLangSelect() {
    const sel = document.getElementById("langSelect");
    if (!sel) return;
    const current = detectLang();
    sel.value = current;
    sel.addEventListener("change", () => setLanguage(sel.value).catch(console.error));
  }

  window.WaveCheck = window.WaveCheck || {};
  window.WaveCheck.i18n = {
    setLanguage,
    apply: applyTranslations,
    t: (k, opts) => (window.i18next?.t ? window.i18next.t(k, opts) : k),
    detectLang,
  };

  // Init
  bindLangSelect();
  setLanguage(detectLang()).catch((e) => {
    console.warn("i18n init failed:", e);
  });
})();

