export function nextTick() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}
