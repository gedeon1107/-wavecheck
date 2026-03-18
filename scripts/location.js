(() => {
  /**
   * Récupère les infos de localisation via ipwho.is
   */
  async function getLocation() {
    // Appel direct à l'API gratuite ipwho.is
    const res = await fetch("https://ipwho.is/", { cache: "no-store" });
    const data = await res.json();

    if (!data || data.success === false) {
      const msg = data?.message ? ` (${data.message})` : "";
      throw new Error("ipwho.is failed" + msg);
    }

    const conn = data.connection || {};
    const tz = data.timezone || {};

    return {
      ip: data.ip,
      country: data.country,
      countryCode: data.country_code,
      region: data.region,
      city: data.city,
      lat: data.latitude,
      lon: data.longitude,
      isp: conn.isp || conn.org || "",
      networkType: conn.type || "",
      timezone: tz.id || tz.utc || ""
    };
  }

  window.WaveCheck = window.WaveCheck || {};
  window.WaveCheck.location = { getLocation };

  /**
   * Hydrate la page d'accueil avec les infos de localisation
   */
  document.addEventListener("DOMContentLoaded", async () => {
    const ipEl = document.getElementById("ipValue");
    const countryEl = document.getElementById("countryValue");
    const cityEl = document.getElementById("cityValue");
    const ispEl = document.getElementById("ispValue");
    const netEl = document.getElementById("networkTypeValue");
    const pill = document.getElementById("locationPill");

    if (!ipEl && !pill) return;

    try {
      const loc = await getLocation();

      if (ipEl) ipEl.textContent = loc.ip || "—";

      if (countryEl) {
        const region = loc.region ? `${loc.region}, ` : "";
        const code = loc.countryCode ? ` (${loc.countryCode})` : "";
        countryEl.textContent = `${region}${loc.country || "—"}${code}`;
      }

      if (cityEl) cityEl.textContent = loc.city || "—";
      if (ispEl) ispEl.textContent = loc.isp || "—";
      if (netEl) netEl.textContent = loc.networkType || "—";

      if (pill) {
        const label = [loc.city, loc.region, loc.countryCode].filter(Boolean).join(", ");
        pill.textContent = label || "—";
      }
    } catch (e) {
      console.warn(e);
      const t = window.WaveCheck?.i18n?.t;
      const msg = t ? t("errors.locationFailed") : "Localisation indisponible";
      if (pill) pill.textContent = msg;
    }
  });
})();

