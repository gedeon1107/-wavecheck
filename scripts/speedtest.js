(() => {
  // Intégration LibreSpeed côté client:
  // - Le widget est chargé via iframe (page `test.html`).
  // - Pour des mesures programmatiques (ping/down/up), un serveur LibreSpeed auto-hébergé
  //   et son API sont recommandés. Ici, on fournit un squelette gratuit + fallback.

  const START_BTN_ID = "startTestBtn";
  const SAVE_BTN_ID = "saveResultBtn";

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  async function basicPing(url = "https://www.cloudflare.com/cdn-cgi/trace") {
    const t0 = performance.now();
    await fetch(url, { cache: "no-store", mode: "cors" });
    const t1 = performance.now();
    return Math.round(t1 - t0);
  }

  // Mesure très simple de download (non équivalente à LibreSpeed, mais gratuite)
  async function basicDownloadMbps(url = "https://speed.hetzner.de/10MB.bin") {
    const t0 = performance.now();
    const res = await fetch(url, { cache: "no-store", mode: "cors" });
    const blob = await res.blob();
    const t1 = performance.now();
    const bits = blob.size * 8;
    const seconds = (t1 - t0) / 1000;
    return Math.round((bits / seconds / 1e6) * 10) / 10;
  }

  async function runTest() {
    const startBtn = $(START_BTN_ID);
    const saveBtn = $(SAVE_BTN_ID);
    if (startBtn) startBtn.disabled = true;
    if (saveBtn) saveBtn.disabled = true;

    setText("pingValue", "…");
    setText("downValue", "…");
    setText("upValue", "—");
    setText("badgeValue", "—");

    const loc = await (window.WaveCheck?.location?.getLocation?.().catch(() => null) ?? null);

    let ping = null;
    let down = null;
    let up = null;

    try {
      ping = await basicPing();
    } catch {
      ping = null;
    }

    try {
      down = await basicDownloadMbps();
    } catch {
      down = null;
    }

    // Upload: non mesuré dans ce squelette (nécessite endpoint dédié)
    up = null;

    setText("pingValue", ping ?? "—");
    setText("downValue", down ?? "—");
    setText("upValue", up ?? "—");

    const badge = window.WaveCheck?.badges?.computeBadge
      ? window.WaveCheck.badges.computeBadge({ downMbps: down, upMbps: up, pingMs: ping })
      : "—";
    setText("badgeValue", badge);

    const result = {
      ts: Date.now(),
      ping,
      down,
      up,
      badge,
      ip: loc?.ip,
      country: loc?.country,
      countryCode: loc?.countryCode,
      city: loc?.city,
      lat: loc?.lat,
      lon: loc?.lon,
      source: "client-basic",
    };

    const jsonEl = $("resultJson");
    if (jsonEl) jsonEl.textContent = window.WaveCheck?.firebase?.safeJson ? window.WaveCheck.firebase.safeJson(result) : JSON.stringify(result, null, 2);

    if (startBtn) startBtn.disabled = false;
    if (saveBtn) saveBtn.disabled = false;

    return result;
  }

  async function saveLast(result) {
    if (!result) return;
    const saveBtn = $(SAVE_BTN_ID);
    if (saveBtn) saveBtn.disabled = true;
    try {
      await window.WaveCheck?.firebase?.saveTestResult?.(result);
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const startBtn = $(START_BTN_ID);
    const saveBtn = $(SAVE_BTN_ID);
    if (!startBtn) return;

    let lastResult = null;
    startBtn.addEventListener("click", async () => {
      lastResult = await runTest().catch((e) => {
        console.warn(e);
        const t = window.WaveCheck?.i18n?.t;
        const msg = t ? t("errors.testFailed") : "Test échoué";
        setText("pingValue", "—");
        setText("downValue", "—");
        setText("upValue", "—");
        const jsonEl = $("resultJson");
        if (jsonEl) jsonEl.textContent = msg;
        if (startBtn) startBtn.disabled = false;
        if (saveBtn) saveBtn.disabled = true;
        return null;
      });
    });

    if (saveBtn) {
      saveBtn.addEventListener("click", () => saveLast(lastResult).catch(console.error));
    }
  });
})();

