(() => {
  const HISTORY_KEY = "wavecheck:history:v1";

  function isConfigured(cfg) {
    if (!cfg) return false;
    return Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
  }

  function safeJson(obj) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return "{}";
    }
  }

  function saveToLocalHistory(result) {
    try {
      const current = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const next = [result, ...current].slice(0, 200);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("local history save failed:", e);
    }
  }

  async function initFirebase() {
    const cfg = window.WAVECHECK_FIREBASE_CONFIG;
    if (!isConfigured(cfg)) return { enabled: false };
    if (!window.firebase?.initializeApp || !window.firebase?.firestore) return { enabled: false };

    try {
      const app = window.firebase.initializeApp(cfg);
      const db = window.firebase.firestore(app);
      return { enabled: true, app, db };
    } catch (e) {
      console.warn("firebase init failed:", e);
      return { enabled: false };
    }
  }

  async function saveTestResult(result) {
    // Toujours sauvegarder en local
    saveToLocalHistory(result);

    const fb = await initFirebase();
    if (!fb.enabled) return { saved: true, mode: "local" };

    try {
      await fb.db.collection("tests").add(result);
      return { saved: true, mode: "firebase" };
    } catch (e) {
      console.warn("firebase save failed:", e);
      return { saved: true, mode: "local" };
    }
  }

  window.WaveCheck = window.WaveCheck || {};
  window.WaveCheck.firebase = {
    initFirebase,
    saveTestResult,
    HISTORY_KEY,
    safeJson,
  };
})();

