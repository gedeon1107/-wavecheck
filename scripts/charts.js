(() => {
  function ensureChartJs() {
    if (!window.Chart) {
      console.warn("Chart.js not loaded");
      return false;
    }
    return true;
  }

  function renderRankingChart() {
    const canvas = document.getElementById("rankingChart");
    if (!canvas) return;
    if (!ensureChartJs()) return;

    const ctx = canvas.getContext("2d");
    new window.Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Avg Download (Mbps)",
            data: [65, 72, 80, 78, 92, 105],
            borderColor: "#1A73E8",
            backgroundColor: "rgba(26, 115, 232, 0.15)",
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "rgba(255,255,255,0.75)" } } },
        scales: {
          x: { ticks: { color: "rgba(255,255,255,0.65)" }, grid: { color: "rgba(255,255,255,0.06)" } },
          y: { ticks: { color: "rgba(255,255,255,0.65)" }, grid: { color: "rgba(255,255,255,0.06)" } },
        },
      },
    });
  }

  function renderMonthlyChart() {
    const canvas = document.getElementById("monthlyChart");
    if (!canvas) return;
    if (!ensureChartJs()) return;

    const KEY = "wavecheck:history:v1";
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      items = [];
    }

    const byDay = new Map();
    items.forEach((r) => {
      if (!r?.ts) return;
      const d = new Date(r.ts);
      const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const prev = byDay.get(dayKey) || [];
      prev.push(Number(r.down) || 0);
      byDay.set(dayKey, prev);
    });

    const labels = Array.from(byDay.keys()).slice(-14);
    const values = labels.map((k) => {
      const arr = byDay.get(k) || [];
      if (!arr.length) return 0;
      return Math.round((arr.reduce((s, n) => s + n, 0) / arr.length) * 10) / 10;
    });

    const ctx = canvas.getContext("2d");
    new window.Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Avg Download (Mbps)",
            data: values,
            borderColor: "#1A73E8",
            backgroundColor: "rgba(26, 115, 232, 0.22)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "rgba(255,255,255,0.75)" } } },
        scales: {
          x: { ticks: { color: "rgba(255,255,255,0.65)" }, grid: { color: "rgba(255,255,255,0.06)" } },
          y: { ticks: { color: "rgba(255,255,255,0.65)" }, grid: { color: "rgba(255,255,255,0.06)" } },
        },
      },
    });
  }

  function renderRankingTable() {
    const body = document.getElementById("rankingBody");
    if (!body) return;
    const rows = [
      { c: "US", down: 185, up: 48 },
      { c: "FR", down: 162, up: 40 },
      { c: "ES", down: 145, up: 35 },
      { c: "JP", down: 198, up: 52 },
      { c: "BR", down: 92, up: 22 },
    ];
    body.innerHTML = rows
      .map((r) => `<tr><td>${r.c}</td><td>${r.down} Mbps</td><td>${r.up} Mbps</td></tr>`)
      .join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderRankingTable();
    renderRankingChart();
    renderMonthlyChart();
  });
})();

