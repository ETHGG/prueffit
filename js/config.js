// Central configuration. Keep APP_VERSION in sync with package.json and sw.js.

export const APP_VERSION = '0.2.0';
export const APP_NAME = 'PrüfFit';

// localStorage
export const STORAGE_KEY = 'prueffit.v1';
export const SCHEMA_VERSION = 1;
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
];
export const EXAMS = ['AP1', 'AP2'];
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

export const DEFAULT_SETTINGS = Object.freeze({ theme: 'auto', dailyGoal: 20 });
