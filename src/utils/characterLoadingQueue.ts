import PQueue from 'p-queue';

export const characterLoadingQueue = new PQueue({ concurrency: 2 });
