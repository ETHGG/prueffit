// Central configuration. Keep APP_VERSION in sync with package.json and sw.js.

export const APP_VERSION = '1.1.0';
export const APP_NAME = 'PrüfFit';
export const REPO_URL = 'https://github.com/ETHGG/prueffit';
export const ISSUE_LABEL = 'inhalt';

// localStorage
export const STORAGE_KEY = 'prueffit.v1';
export const SCHEMA_VERSION = 5;
export const BACKUP_PREFIX = 'prueffit.backup.';
export const CORRUPT_BACKUP_KEY = 'prueffit.backup.corrupt';

// Content
export const DATA_BASE = './data/';
export const AREAS = [
  { id: 'netzwerke', name: 'Netzwerke' },
  { id: 'hardware', name: 'Hardware' },
  { id: 'sicherheit', name: 'IT-Sicherheit' },
  { id: 'wirtschaft', name: 'Wirtschaft' },
  { id: 'projekt', name: 'Projektmanagement' },
  { id: 'programmierung', name: 'Programmierung' },
  { id: 'recht', name: 'Recht' },
  { id: 'wiso', name: 'WiSo' },
];
export const EXAMS = ['AP1', 'AP2'];
// Apprenticeships covered (CLAUDE.md 1). AP1 is identical for all, AP2 differs.
export const JOBS = [
  { id: 'fisi', name: 'Fachinformatik Systemintegration', short: 'FISI' },
  { id: 'fiae', name: 'Fachinformatik Anwendungsentwicklung', short: 'FIAE' },
  { id: 'itsm', name: 'IT-System-Management', short: 'ITSM' },
];
export const ALL_JOBS = 'alle';
export const QUESTION_TYPES = ['single', 'multi', 'number', 'text', 'match', 'order'];
// Types the quiz can present in this version.
export const SUPPORTED_QUIZ_TYPES = ['single', 'multi', 'number', 'text', 'match', 'order'];

// Quiz
export const QUIZ_SIZES = [5, 10, 20];
export const DEFAULT_QUIZ_SIZE = 10;

// Statistics (CLAUDE.md 6.2)
export const MIN_ATTEMPTS_FOR_RATING = 5;
export const THRESHOLD_GREEN = 0.8;
export const THRESHOLD_YELLOW = 0.5;

// onboarded: the welcome questions (job, next exam) were answered or skipped.
// examTarget: { exam: 'AP1'|'AP2', day: 'YYYY-MM-DD' } or null.
export const DEFAULT_SETTINGS = Object.freeze({
  theme: 'auto', dailyGoal: 20, job: 'alle', onboarded: false, examTarget: null,
  backup: Object.freeze({ lastAt: null, snoozeUntil: null }),
});
