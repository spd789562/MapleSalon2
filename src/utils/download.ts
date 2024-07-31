export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  downloadBlob(blob, filename);
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
) {
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error('Failed to convert canvas to blob'));
      }
      downloadBlob(blob, filename);
      resolve();
    });
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  downloadByLink(url, filename);
  URL.revokeObjectURL(url);
}

export function downloadByLink(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
