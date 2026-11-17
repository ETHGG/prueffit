// Statistics: "Heute üben", charts (Chart.js, loaded lazily), hit rate per topic with traffic light.

import { topicStats, overallStats, areaStats } from '../stats.js';
import { h, formatPercent, formatNumber, trafficDot, LIGHT_LABELS, append } from './dom.js';
import { suggestionsCard } from './suggestions.js';
import { loadChartJs, themeColors, reducedMotion } from './charts.js';

const dateFormat = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Berlin' });

export function render(root, ctx) {
  const { topics, questions } = ctx.catalog;
  const list = topicStats(topics, questions, ctx.progress.answers);
  const total = overallStats(ctx.progress.answers, questions);
  const areaList = areaStats(list);
  const practicedAreas = areaList.filter((a) => a.attempts > 0);
  const exams = ctx.progress.exams.filter((e) => Number.isFinite(e.points) && e.max > 0).slice(-12);
  const questionCount = new Map();
  for (const q of questions) questionCount.set(q.topic, (questionCount.get(q.topic) ?? 0) + 1);
  const areas = [...new Set(list.map((t) => t.area))];

  const areaCanvas = h('canvas', {
    role: 'img',
    'aria-label': `Trefferquote pro Bereich: ${practicedAreas.map((a) => `${a.area} ${formatPercent(a.rate)}`).join(', ')}`,
  });
  const examCanvas = h('canvas', {
    role: 'img',
    'aria-label': `Prüfungsergebnisse: ${exams.map((e) => `${e.exam} ${Math.round((e.points / e.max) * 100)} %, Note ${e.grade}`).join('; ')}`,
  });

  append(root, 
    h('h1', { text: 'Statistik' }),
    suggestionsCard(ctx),
    h('section', { class: 'card', 'aria-labelledby': 'stats-total' },
      h('h2', { id: 'stats-total', text: 'Gesamt' }),
      h('div', { class: 'kpis' },
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatPercent(total.rate)),
          h('div', { class: 'kpi-label row' }, trafficDot(total.light), 'Trefferquote')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatNumber(total.attempts)),
          h('div', { class: 'kpi-label' }, 'Versuche')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatNumber(total.correct)),
          h('div', { class: 'kpi-label' }, 'davon richtig')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatNumber(ctx.progress.exams.length)),
          h('div', { class: 'kpi-label' }, 'Prüfungen')))),
    practicedAreas.length
      ? h('section', { class: 'card', 'aria-labelledby': 'chart-areas' },
        h('h2', { id: 'chart-areas', text: 'Trefferquote pro Bereich' }),
        h('div', { class: 'chart-box' }, areaCanvas))
      : null,
    exams.length
      ? h('section', { class: 'card', 'aria-labelledby': 'chart-exams' },
        h('h2', { id: 'chart-exams', text: 'Prüfungsergebnisse' }),
        h('div', { class: 'chart-box' }, examCanvas),
        h('p', { class: 'muted small' }, 'Gestrichelte Linie: 50 % – ab hier „ausreichend“.'))
      : null,
    h('div', { class: 'legend card', 'aria-label': 'Legende der Ampel' },
      ['green', 'yellow', 'red', 'grey'].map((l) => h('span', {}, h('span', { class: `light light-${l}`, 'aria-hidden': 'true' }), LIGHT_LABELS[l]))),
    ...areas.map((area) => h('section', { class: 'card', 'aria-label': area },
      h('h2', { text: area }),
      h('ul', { class: 'stat-list' },
        list.filter((t) => t.area === area).map((t) => h('li', { class: 'stat-item' },
          trafficDot(t.light),
          h('span', { class: 'stat-name', text: t.name }),
          h('span', { class: 'stat-rate', text: formatPercent(t.rate) }),
          h('span', { class: 'stat-detail' },
            t.attempts === 0
              ? `Noch nicht geübt · ${questionCount.get(t.id) ?? 0} Fragen`
              : `${t.correct} von ${t.attempts} ${t.attempts === 1 ? 'Versuch' : 'Versuchen'} richtig · ${questionCount.get(t.id) ?? 0} Fragen`)))))),
    h('p', { class: 'muted small center' }, 'Als richtig zählt eine Antwort mit voller Punktzahl. Die Ampel erscheint ab 5 Versuchen pro Thema.'),
  );

  // Charts are optional: without Chart.js the page still shows all numbers.
  const charts = [];
  let disposed = false;
  if (practicedAreas.length || exams.length) {
    loadChartJs().then((Chart) => {
      if (disposed) return;
      const c = themeColors();
      Chart.defaults.color = c.muted;
      Chart.defaults.borderColor = c.border;
      Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
      const common = { responsive: true, maintainAspectRatio: false, animation: reducedMotion() ? false : { duration: 300 } };
      const lightColor = (l) => ({ green: c.green, yellow: c.yellow, red: c.red, grey: c.grey })[l];
      if (practicedAreas.length) {
        charts.push(new Chart(areaCanvas, {
          type: 'bar',
          data: {
            labels: practicedAreas.map((a) => a.area),
            datasets: [{ label: 'Trefferquote in %', data: practicedAreas.map((a) => Math.round(a.rate * 100)), backgroundColor: practicedAreas.map((a) => lightColor(a.light)), borderRadius: 6 }],
          },
          options: {
            ...common,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { min: 0, max: 100, ticks: { callback: (v) => `${v} %` } }, y: { ticks: { color: c.text } } },
          },
        }));
      }
      if (exams.length) {
        charts.push(new Chart(examCanvas, {
          type: 'line',
          data: {
            labels: exams.map((e) => `${e.exam} ${e.date ? dateFormat.format(new Date(e.date)) : ''}`),
            datasets: [
              { label: 'Ergebnis in %', data: exams.map((e) => Math.round((e.points / e.max) * 100)), borderColor: c.primary, backgroundColor: c.primary, tension: 0.2, pointRadius: 4 },
              { label: 'Bestehensgrenze', data: exams.map(() => 50), borderColor: c.red, borderDash: [6, 4], pointRadius: 0, borderWidth: 1.5 },
            ],
          },
          options: {
            ...common,
            plugins: { legend: { display: false }, tooltip: { callbacks: { afterLabel: (item) => (item.datasetIndex === 0 ? `Note ${exams[item.dataIndex].grade}` : '') } } },
            scales: { y: { min: 0, max: 100, ticks: { callback: (v) => `${v} %` } } },
          },
        }));
      }
    }).catch(() => {
      // Chart.js unavailable: leave the text summary (aria-label) and the lists.
    });
  }
  return () => {
    disposed = true;
    for (const chart of charts) chart.destroy();
  };
}
