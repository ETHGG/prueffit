// Print layout of the Lernzettel (print.html). Used to generate the PDFs in pdf/
// (scripts/build-pdfs.mjs) and usable directly in the browser („Drucken“ → „Als PDF sichern“).
//   print.html?pdf=ap1                AP1 notes (same for all jobs)
//   print.html?pdf=ap2-fisi           AP2 notes of one job
//   print.html?pdf=abkuerzungen-fisi  abbreviations of one job
//   print.html?pdf=formeln-fisi       formula collection of one job (since 2.10.3)
//   print.html?pdf=alle | abkuerzungen | <area name>  all notes, whole glossary, one area
//   (older links use ?bereich= instead of ?pdf=)
//   print.html?sim=AP2&teil=ga1&beruf=fisi&seed=123456&blatt=aufgaben|loesung
//                                     printable exam simulation with solution sheet (since 2.11)

import { h, append, formatNumber } from './dom.js';
import { questionFigure } from './figure.js';
import { questionText } from './questionText.js';
import { APP_VERSION } from '../config.js';
import { loadCatalog } from '../questions.js';
import { renderNoteContent } from './notesView.js';
import { sortGlossary, initialOf } from '../glossary.js';
import { groupFormulas } from '../formulas.js';
import {
  pdfSections, pdfTitle, pdfFileName, glossaryForPdf, formulasForPdf, isFormulasKey, pdfJob, PDF_ALL, PDF_AP1, PDF_GLOSSARY,
} from '../pdfs.js';
import { jobById } from '../curriculum.js';
import { catalogForJob } from '../jobCatalog.js';
import {
  parsePrintParams, createPrintExam, printTasks, pointsOf, taskTitle, optionLetter, isSketchTask, writingLines,
  printLayout, solutionLines, answerHint, coverFacts, printSheetUrl, newSeed, gradeThresholds,
} from '../examPrint.js';

const root = document.getElementById('print');

function cover(title, subtitle, lines) {
  return h('section', { class: 'cover' },
    h('p', { class: 'cover-brand' }, 'PrüfFit · AP1/AP2-Lerntrainer'),
    h('h1', { text: title }),
    h('p', { class: 'cover-sub', text: subtitle }),
    h('ul', { class: 'cover-facts' }, lines.map((l) => h('li', { text: l }))),
    h('p', { class: 'cover-note' },
      'Alle Inhalte in eigenen Worten, keine Originalaufgaben der IHK. Aktuelle Version und Übungen: ethgg.github.io/prueffit'));
}

function renderNotes(catalog, key) {
  const topicsById = new Map(catalog.topics.map((t) => [t.id, t]));
  const sections = pdfSections(catalog, key);
  const notes = sections.flatMap((g) => g.notes);
  const title = pdfTitle(key);
  const job = jobById(pdfJob(key));
  document.title = `PrüfFit – ${title}`;
  append(root,
    cover(title, key === PDF_AP1 ? 'Gilt für alle IT-Berufe · kompakt zum Wiederholen' : 'Kompakt zum Wiederholen vor der Prüfung', [
      `${notes.length} Lernzettel in ${sections.length} ${key === PDF_AP1 || job ? 'Prüfungsbereichen' : 'Bereichen'}`,
      `Stand: Version ${APP_VERSION}`,
    ]),
    h('nav', { class: 'toc', 'aria-label': 'Inhalt' },
      h('h2', { text: 'Inhalt' }),
      sections.map((g) => h('section', {},
        sections.length > 1 ? h('h3', { text: g.title }) : null,
        h('ol', {}, g.notes.map((n) => h('li', {}, h('a', { href: `#${n.id}` }, n.title))))))),
    notes.map((n) => {
      const t = topicsById.get(n.topic);
      return h('article', { class: 'note-page', id: n.id },
        h('p', { class: 'note-meta', text: `${t.area} · ${t.name} · ${t.exams.join('/')}` }),
        h('h2', { text: n.title }),
        h('div', { class: 'note' }, renderNoteContent(n.content, '')),
        n.refs?.length ? h('p', { class: 'note-refs', text: `Grundlage: ${n.refs.join(' · ')}` }) : null);
    }));
}

function renderGlossary(catalog, key) {
  const entries = sortGlossary(glossaryForPdf(catalog, key));
  const job = jobById(pdfJob(key));
  document.title = `PrüfFit – ${pdfTitle(key)}`;
  const groups = new Map();
  for (const e of entries) {
    const k = initialOf(e);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(e);
  }
  append(root,
    cover(job ? `Abkürzungsverzeichnis ${job.short}` : 'Abkürzungsverzeichnis', job ? `Alle Abkürzungen aus den Lernzetteln für ${job.name}` : 'Alle Abkürzungen aus den Lernzetteln, ausgeschrieben und erklärt', [
      `${entries.length} Abkürzungen von A bis Z`,
      `Stand: Version ${APP_VERSION}`,
    ]),
    [...groups].map(([letter, list]) => h('section', { class: 'gloss-section' },
      h('h2', { text: letter }),
      h('table', { class: 'gloss-table' },
        h('thead', {}, h('tr', {}, h('th', { text: 'Abkürzung' }), h('th', { text: 'Ausgeschrieben und Erklärung' }), h('th', { text: 'Bereich' }))),
        h('tbody', {}, list.map((e) => h('tr', {},
          h('td', { class: 'gloss-abbr' }, e.abbr, e.aliases?.length ? h('span', { class: 'alias', text: ` (${e.aliases.join(', ')})` }) : null),
          h('td', {}, h('strong', { text: e.full }), e.explanation ? h('span', { class: 'expl', text: ` – ${e.explanation}` }) : null),
          h('td', { class: 'gloss-area', text: e.area }))))))));
}

function renderFormulas(catalog, key) {
  const job = jobById(pdfJob(key));
  const { topics } = catalogForJob(catalog, job.id);
  const groups = groupFormulas(formulasForPdf(catalog, key), topics);
  const count = groups.reduce((n, g) => n + g.topics.reduce((m, t) => m + t.formulas.length, 0), 0);
  document.title = `PrüfFit – ${pdfTitle(key)}`;
  append(root,
    cover(`Formelsammlung ${job.short}`, `Alle Formeln aus den Prüfungsthemen für ${job.name}`, [
      `${count} Formeln in ${groups.length} Bereichen`,
      'Hilfsmittel nennt die Einladung der IHK; üblich ist nur ein nicht programmierbarer, netzunabhängiger Taschenrechner ohne Kommunikationsmöglichkeit – Formeln also auswendig können.',
      `Stand: Version ${APP_VERSION}`,
    ]),
    groups.map((g) => h('section', { class: 'formula-area' },
      h('h2', { text: g.area }),
      g.topics.map((t) => h('section', { class: 'formula-topic' },
        h('h3', { text: `${t.topic.name} · ${t.topic.exams.join('/')}` }),
        t.formulas.map((f) => h('div', { class: 'formula' },
          h('h4', { text: f.name }),
          h('pre', {}, h('code', { text: f.formula })),
          f.legend ? h('p', { class: 'formula-legend', text: f.legend }) : null,
          f.example ? h('p', { class: 'formula-example' }, h('strong', { text: 'Beispiel: ' }), f.example) : null)))))));
}


// ---------------------------------------------------------------- exam simulation (since 2.11)

const lines = (n) => h('div', { class: 'write-lines', style: `--lines: ${n}`, 'aria-hidden': 'true' });
const box = () => h('span', { class: 'check-box', 'aria-hidden': 'true' });

/** Answer area of one question on the task sheet (paper form of the app inputs). */
function answerArea(q, layout) {
  switch (q.type) {
    case 'single':
    case 'multi':
      // Since 2.22 in the shuffled order of the layout (same letters on the solution sheet).
      return h('ul', { class: 'choice-list' }, (layout?.options ?? q.options.map((_, i) => i))
        .map((idx, i) => h('li', {}, box(), h('span', { class: 'choice-letter', text: `${optionLetter(i)})` }), h('span', { text: q.options[idx] }))));
    case 'number':
      return h('div', {},
        h('p', { class: 'result-line' }, 'Ergebnis: ', h('span', { class: 'blank', 'aria-hidden': 'true' }), q.answer.unit ? ` ${q.answer.unit}` : ''),
        h('p', { class: 'small-label', text: 'Rechenweg:' }), lines(4));
    case 'match':
      return h('div', { class: 'match-grid' },
        h('table', { class: 'sheet-table' },
          h('thead', {}, h('tr', {}, h('th', { text: 'Begriff' }), h('th', { class: 'col-letter', text: 'Buchstabe' }))),
          h('tbody', {}, Object.keys(q.answer).map((l) => h('tr', {}, h('td', { text: l }), h('td', { class: 'col-letter' }))))),
        h('ul', { class: 'match-rights' }, layout.rights.map((r, i) => h('li', {}, h('span', { class: 'choice-letter', text: `${optionLetter(i)})` }), h('span', { text: r })))));
    case 'order':
      return h('table', { class: 'sheet-table' },
        h('thead', {}, h('tr', {}, h('th', { class: 'col-letter', text: 'Nr.' }), h('th', { text: 'Schritt' }))),
        h('tbody', {}, layout.order.map((item, i) => h('tr', {}, h('td', { class: 'col-letter' }), h('td', {}, h('span', { class: 'choice-letter', text: `${optionLetter(i)})` }), item)))));
    case 'table': {
      const [c1 = 'Position', c2 = 'Wert'] = q.answer.columns ?? [];
      const unit = q.answer.unit ? ` in ${q.answer.unit}` : '';
      return h('table', { class: 'sheet-table fill-table' },
        h('thead', {}, h('tr', {}, h('th', { text: c1 }), h('th', { text: `${c2}${unit}` }))),
        h('tbody', {}, q.answer.rows.map((r) => h('tr', {},
          h('td', { text: r.label }),
          Number.isFinite(r.value) ? h('td', { class: 'fill-cell' }) : h('td', { class: 'given-cell', text: String(r.given ?? '') })))));
    }
    case 'text':
      return isSketchTask(q) ? h('div', { class: 'sketch-box', 'aria-label': 'Platz für die Skizze' }) : lines(writingLines(q));
    default:
      return null;
  }
}

function examHeader(px, job, sheetName) {
  const examName = px.exam === 'AP1' ? 'Abschlussprüfung Teil 1' : 'Abschlussprüfung Teil 2';
  return h('p', { class: 'sheet-head' }, `PrüfFit · ${examName} · ${job.short} · ${px.part.title} · ${sheetName} · Simulations-Nr. ${px.seed}`);
}

function toolbar(params, other, otherLabel) {
  return h('nav', { class: 'print-toolbar', 'aria-label': 'Druckansicht' },
    h('button', { type: 'button', class: 'print-button', onClick: () => window.print() }, 'Drucken / als PDF sichern'),
    h('a', { class: 'print-button secondary', href: printSheetUrl({ ...params, sheet: other }) }, otherLabel),
    h('a', { class: 'print-button secondary', href: './#/pruefung' }, 'Zurück zur App'),
    h('p', { class: 'print-tip', text: 'Auf dem iPhone: Teilen → Drucken, dann mit zwei Fingern auf die Vorschau aufziehen und erneut teilen, um ein PDF zu sichern.' }));
}

function renderExamTasks(catalog, px, job, params) {
  const byId = new Map(px.questions.map((q) => [q.id, q]));
  const topicById = new Map(catalog.topics.map((t) => [t.id, t]));
  const layout = printLayout(px.questions, px.seed);
  const facts = coverFacts(px);
  const tasks = printTasks(px.part);
  document.title = `PrüfFit – ${px.exam} ${px.part.title} – Aufgaben`;
  append(root,
    toolbar(params, 'loesung', 'Lösungsblatt öffnen'),
    h('section', { class: 'cover exam-cover' },
      h('p', { class: 'cover-brand' }, 'PrüfFit · Prüfungssimulation zum Ausdrucken'),
      h('h1', { text: px.exam === 'AP1' ? 'Abschlussprüfung Teil 1' : 'Abschlussprüfung Teil 2' }),
      h('p', { class: 'cover-sub', text: `${job.name} · ${px.part.title}` }),
      h('table', { class: 'sheet-table cover-table' },
        h('tbody', {},
          h('tr', {}, h('th', { text: 'Bearbeitungszeit' }), h('td', { text: `${facts.minutes} Minuten` })),
          h('tr', {}, h('th', { text: 'Punkte' }), h('td', { text: `${facts.points} Punkte` })),
          h('tr', {}, h('th', { text: 'Umfang' }), h('td', { text: tasks.length > 1 ? `${tasks.length} Aufgaben mit ${facts.questions} Teilaufgaben` : `${facts.questions} Aufgaben` })),
          h('tr', {}, h('th', { text: 'Hilfsmittel' }), h('td', { text: 'nicht programmierbarer Taschenrechner' })),
          h('tr', {}, h('th', { text: 'Simulations-Nr.' }), h('td', { text: `${px.seed} (gleiche Nr. auf dem Lösungsblatt)` })))),
      h('table', { class: 'sheet-table cover-table points-table' },
        h('thead', {}, h('tr', {}, h('th', { text: 'Aufgabe' }), h('th', { text: 'Punkte' }), h('th', { text: 'erreicht' }))),
        h('tbody', {},
          facts.tasks.map((t) => h('tr', {}, h('td', { text: tasks.length > 1 ? `Aufgabe ${t.number}` : 'Aufgaben' }), h('td', { text: String(t.points) }), h('td', {}))),
          h('tr', { class: 'total-row' }, h('td', { text: 'Summe' }), h('td', { text: String(facts.points) }), h('td', {})))),
      h('div', { class: 'name-fields' },
        h('p', {}, 'Name: ', h('span', { class: 'blank wide', 'aria-hidden': 'true' })),
        h('p', {}, 'Datum: ', h('span', { class: 'blank', 'aria-hidden': 'true' }))),
      h('ul', { class: 'cover-hints' },
        h('li', { text: 'Lesen Sie zuerst die Ausgangssituation und alle Aufgaben durch.' }),
        h('li', { text: 'Bearbeiten Sie die Aufgaben auf diesem Blatt; bei Auswahlaufgaben kreuzen Sie die Kästchen an.' }),
        h('li', { text: 'Bei Rechenaufgaben gehört der Rechenweg dazu. Bewerten Sie sich danach mit dem Lösungsblatt.' })),
      h('p', { class: 'cover-note' }, 'Aufgaben in eigenen Worten nach dem Muster der IHK-Prüfungen, keine Originalaufgaben. ethgg.github.io/prueffit')),
    tasks.map((task, ti) => h('section', { class: 'exam-task' },
      examHeader(px, job, 'Aufgaben'),
      h('h2', {}, tasks.length > 1 ? `Aufgabe ${ti + 1}` : 'Aufgaben', h('span', { class: 'task-points', text: ` (${pointsOf(task.ids, byId)} Punkte)` })),
      tasks.length > 1 ? h('p', { class: 'task-title', text: taskTitle(task, { byId, topicById, scenario: px.scenario }) }) : null,
      task.scenario && px.scenario
        ? h('div', { class: 'scenario-print' }, h('p', { class: 'scenario-kicker', text: 'Ausgangssituation' }), h('div', { class: 'note' }, renderNoteContent(px.scenario.situation, '')))
        : null,
      task.ids.map((id, qi) => {
        const q = byId.get(id);
        return h('article', { class: `exam-q type-${q.type}` },
          h('div', { class: 'q-head' },
            h('span', { class: 'q-number', text: tasks.length > 1 ? `${ti + 1}.${qi + 1}` : `${qi + 1}.` }),
            questionText(q.question, 'p', { class: 'q-text' }, 'q-text'),
            questionFigure(q, { zoom: false }),
            h('span', { class: 'q-points', text: `${q.points} P.` })),
          h('p', { class: 'q-hint', text: answerHint(q) }),
          answerArea(q, layout.get(q.id)));
      }))));
}

function renderExamSolution(catalog, px, job, params) {
  const byId = new Map(px.questions.map((q) => [q.id, q]));
  const topicById = new Map(catalog.topics.map((t) => [t.id, t]));
  const layout = printLayout(px.questions, px.seed);
  const facts = coverFacts(px);
  const tasks = printTasks(px.part);
  document.title = `PrüfFit – ${px.exam} ${px.part.title} – Lösungen`;
  append(root,
    toolbar(params, 'aufgaben', 'Aufgabenblatt öffnen'),
    h('section', { class: 'solution-intro' },
      examHeader(px, job, 'Lösungen'),
      h('h1', { text: `Lösungsblatt · ${px.part.title}` }),
      h('p', { text: `${job.name} · ${facts.points} Punkte · ${facts.minutes} Minuten · Simulations-Nr. ${px.seed}` }),
      h('p', { class: 'small-label', text: 'Offene Aufgaben bewerten Sie mit dem Bewertungsraster: Punkte für jedes erfüllte Kriterium. Die Musterlösung ist ein Beispiel, gleichwertige Antworten zählen auch.' }),
      h('table', { class: 'sheet-table grade-table' },
        h('caption', { text: 'Notenschlüssel der IHK (Prozent der Punkte, kaufmännisch gerundet)' }),
        h('thead', {}, h('tr', {}, h('th', { text: 'Note' }), h('th', { text: 'Prozent' }), h('th', { text: `Punkte (von ${facts.points})` }))),
        h('tbody', {}, gradeThresholds(facts.points).map((r) => h('tr', {}, h('td', { text: `${r.grade} (${r.label})` }), h('td', { text: `${r.minPercent}–${r.maxPercent} %` }), h('td', { text: `ab ${formatNumber(r.minPoints)}` }))))),
    ),
    tasks.map((task, ti) => h('section', { class: 'solution-task' },
      h('h2', {}, tasks.length > 1 ? `Aufgabe ${ti + 1}` : 'Aufgaben', h('span', { class: 'task-points', text: ` (${pointsOf(task.ids, byId)} Punkte)` })),
      tasks.length > 1 ? h('p', { class: 'task-title', text: taskTitle(task, { byId, topicById, scenario: px.scenario }) }) : null,
      task.ids.map((id, qi) => {
        const q = byId.get(id);
        const sol = solutionLines(q, layout.get(q.id));
        return h('article', { class: 'solution-q' },
          h('div', { class: 'q-head' },
            h('span', { class: 'q-number', text: tasks.length > 1 ? `${ti + 1}.${qi + 1}` : `${qi + 1}.` }),
            h('p', { class: 'q-text short', text: q.question.split('\n')[0] }),
            h('span', { class: 'q-points', text: `${q.points} P.` })),
          h('p', { class: 'solution-label', text: q.type === 'text' ? 'Musterlösung' : 'Lösung' }),
          sol.length > 1 ? h('ul', { class: 'solution-list' }, sol.map((l) => h('li', { text: l }))) : h('p', { class: 'solution', text: sol[0] ?? '' }),
          q.type === 'text' && q.answer.rubric?.length
            ? h('table', { class: 'sheet-table rubric-table' },
              h('thead', {}, h('tr', {}, h('th', { text: 'Bewertungsraster' }), h('th', { class: 'col-letter', text: 'Punkte' }), h('th', { class: 'col-letter', text: 'erreicht' }))),
              h('tbody', {}, q.answer.rubric.map((r) => h('tr', {}, h('td', { text: r.criterion }), h('td', { class: 'col-letter', text: String(r.points) }), h('td', { class: 'col-letter' })))))
            : null,
          q.type !== 'single' && q.type !== 'text' && q.type !== 'order' ? h('p', { class: 'q-hint', text: partialHint(q) }) : null,
          q.explanation ? h('p', { class: 'explanation' }, h('strong', { text: 'Erklärung: ' }), q.explanation) : null);
      }))));
}

/** How partial points are given (same as the app grading, js/grading.js). */
function partialHint(q) {
  switch (q.type) {
    case 'multi': return 'Teilpunkte: richtige minus falsche Kreuze, mindestens 0.';
    case 'match': return 'Teilpunkte für jede richtige Zuordnung.';
    case 'table': return 'Teilpunkte für jedes richtige Feld.';
    case 'number': return 'Volle Punkte nur für das richtige Ergebnis (innerhalb der Toleranz).';
    default: return '';
  }
}

function renderExamPrint(catalog, params) {
  const job = jobById(params.job);
  if (!job) {
    append(root, h('p', { text: 'Unbekannter Beruf. Bitte die Druckansicht aus der App (Prüfung → Zum Ausdrucken) öffnen.' }));
    return;
  }
  if (params.seed === null) {
    // No seed: draw a new one and keep it in the URL, so reloads and the other sheet match.
    const seed = newSeed();
    history.replaceState(null, '', printSheetUrl({ ...params, seed }));
    params = { ...params, seed };
  }
  let px;
  try {
    px = createPrintExam({ exam: params.exam, job: job.id, partId: params.partId, questions: catalog.questions, scenarios: catalog.scenarios ?? [], seed: params.seed });
  } catch {
    append(root, h('p', { text: 'Für diese Auswahl gibt es keine passenden Aufgaben.' }));
    return;
  }
  document.body.classList.add('exam-print');
  if (params.sheet === 'loesung') renderExamSolution(catalog, px, job, params);
  else renderExamTasks(catalog, px, job, params);
}

async function main() {
  const params = new URLSearchParams(location.search);
  const key = params.get('pdf') ?? params.get('bereich') ?? PDF_ALL;
  const catalog = await loadCatalog((url) => fetch(url, { cache: 'no-cache' }));
  root.replaceChildren();
  const examParams = parsePrintParams(location.search);
  if (examParams) renderExamPrint(catalog, examParams);
  else if (key === PDF_GLOSSARY || (pdfJob(key) && key.startsWith(PDF_GLOSSARY))) renderGlossary(catalog, key);
  else if (isFormulasKey(key)) renderFormulas(catalog, key);
  else if (pdfFileName(key)) renderNotes(catalog, key);
  else append(root, h('p', { text: `Unbekanntes PDF „${key}“.` }));
  document.body.dataset.ready = '1';
}

main().catch((e) => {
  root.replaceChildren(h('p', { text: `Fehler beim Laden: ${e.message}` }));
  document.body.dataset.ready = 'error';
});
