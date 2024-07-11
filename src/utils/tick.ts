export async function asyncNextTick<T>(callback: () => Promise<T>) {
  await new Promise<void>((resolve) =>
    setTimeout(async () => {
      await callback();
      resolve();
    }, 0),
  );
}
