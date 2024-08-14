import Pqueue from 'p-queue';

export const DEFAULT_CONCURRENCY = 4;
export const SUGGEST_MAX_CONCURRENCY = 20;

export const characterLoadingQueue = new Pqueue({ concurrency: 1 });

export const simpleCharacterLoadingQueue = new Pqueue({
  concurrency: DEFAULT_CONCURRENCY,
});

export function isValidConcurrency(value: number) {
  return Number.isInteger(value) && value > 0;
}
