export function nextTick() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
