(() => {
  function computeBadge({ downMbps, upMbps, pingMs }) {
    const down = Number(downMbps) || 0;
    const up = Number(upMbps) || 0;
    const ping = Number(pingMs) || 0;

    if (down >= 200 && up >= 50 && ping <= 25) return "Diamond";
    if (down >= 100 && up >= 30 && ping <= 35) return "Gold";
    if (down >= 50 && up >= 15 && ping <= 50) return "Silver";
    if (down >= 20 && up >= 5 && ping <= 80) return "Bronze";
    return "Basic";
  }

  window.WaveCheck = window.WaveCheck || {};
  window.WaveCheck.badges = { computeBadge };
})();

