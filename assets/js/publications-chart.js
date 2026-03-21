/**
 * publications-chart.js
 * Renders a publications-per-year bar chart on the home page using Chart.js.
 * Lazy-loads Chart.js from CDN when the canvas is visible.
 */
(function () {
  'use strict';

  /* ── Static data ─────────────────────────────────────────────────────────
   * These counts mirror the FALLBACK_PUBS array in orcid-publications.js.
   * When adding or removing publications from that array, update this data
   * manually to keep the home-page chart accurate.
   * ──────────────────────────────────────────────────────────────────────── */
  var PUB_DATA = [
    { year: 2025, count: 3, types: { 'book-chapter': 1, 'conference-paper': 2 } }
  ];

  function getThemeColors() {
    var style = getComputedStyle(document.documentElement);
    return {
      accent:  style.getPropertyValue('--accent-cyan').trim()  || '#06b6d4',
      accent2: style.getPropertyValue('--accent-blue').trim()  || '#3b82f6',
      textMuted: style.getPropertyValue('--text-muted').trim() || '#64748b',
      bgCard:  style.getPropertyValue('--bg-card').trim()      || 'rgba(15,23,42,0.6)'
    };
  }

  function buildChart(Chart) {
    var canvas = document.getElementById('pub-timeline-chart');
    if (!canvas) return;

    var labels = PUB_DATA.map(function (d) { return String(d.year); });
    var counts = PUB_DATA.map(function (d) { return d.count; });
    var colors = getThemeColors();

    var chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Publications',
          data: counts,
          backgroundColor: colors.accent + '99',
          borderColor: colors.accent,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ' ' + ctx.parsed.y + ' publication' + (ctx.parsed.y !== 1 ? 's' : '');
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: colors.textMuted + '22' },
            ticks: { color: colors.textMuted, font: { family: 'Inter, sans-serif', size: 13 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: colors.textMuted + '22' },
            ticks: {
              color: colors.textMuted,
              font: { family: 'Inter, sans-serif', size: 13 },
              stepSize: 1
            }
          }
        }
      }
    });

    // Re-draw when the theme changes
    document.documentElement.addEventListener('themechange', function () {
      var c = getThemeColors();
      chart.data.datasets[0].backgroundColor = c.accent + '99';
      chart.data.datasets[0].borderColor = c.accent;
      chart.options.scales.x.grid.color = c.textMuted + '22';
      chart.options.scales.x.ticks.color = c.textMuted;
      chart.options.scales.y.grid.color = c.textMuted + '22';
      chart.options.scales.y.ticks.color = c.textMuted;
      chart.update();
    });
  }

  function loadChartJs(callback) {
    if (window.Chart) { callback(window.Chart); return; }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
    script.onload = function () { callback(window.Chart); };
    script.onerror = function () { /* silently skip */ };
    document.head.appendChild(script);
  }

  function run() {
    var canvas = document.getElementById('pub-timeline-chart');
    if (!canvas) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            observer.disconnect();
            loadChartJs(buildChart);
          }
        });
      }, { threshold: 0.1 });
      io.observe(canvas);
    } else {
      loadChartJs(buildChart);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
