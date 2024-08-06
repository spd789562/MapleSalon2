import Pqueue from 'p-queue';

export const characterLoadingQueue = new Pqueue({ concurrency: 1 });

export const simpleCharacterLoadingQueue = new Pqueue({ concurrency: 4 });
