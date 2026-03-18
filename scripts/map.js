(() => {
  /**
   * Initialise la carte Leaflet avec tuiles OpenStreetMap
   */
  function initMap(lat = 20, lon = 0, zoom = 2) {
    if (!window.L) {
      console.warn("Leaflet not loaded");
      return null;
    }
    const el = document.getElementById("map");
    if (!el) return null;

    const map = window.L.map(el, {
      zoomControl: true,
      worldCopyJump: true,
    }).setView([lat, lon], zoom);

    // Fond de carte OpenStreetMap (gratuit)
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = window.L.marker([lat, lon]).addTo(map);
    return { map, marker };
  }

  /**
   * Centre la carte automatiquement sur la zone de l'utilisateur
   */
  async function initWithLocation() {
    const state = initMap();
    if (!state) return;

    try {
      const loc = await window.WaveCheck?.location?.getLocation?.();
      if (!loc || typeof loc.lat !== "number" || typeof loc.lon !== "number") return;
      // Zoom plus précis sur la zone de l'utilisateur
      state.map.setView([loc.lat, loc.lon], 11);
      state.marker.setLatLng([loc.lat, loc.lon]).bindPopup(
        `${loc.city || ""} ${loc.countryCode ? `(${loc.countryCode})` : ""}`.trim()
      );
    } catch {
      // fallback: world view already set
    }

    const btn = document.getElementById("recenterBtn");
    if (btn) {
      btn.addEventListener("click", async () => {
        try {
          const loc = await window.WaveCheck?.location?.getLocation?.();
          if (!loc) return;
          state.map.setView([loc.lat, loc.lon], 11);
          state.marker.setLatLng([loc.lat, loc.lon]);
        } catch (e) {
          console.warn(e);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initWithLocation().catch(console.error);
  });
})();

