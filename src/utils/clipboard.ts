export function copyText(text: string) {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise<void>((resolve, reject) => {
    const $textarea = document.createElement('textarea');
    $textarea.value = text;
    $textarea.style.opacity = '0';
    document.body.appendChild($textarea);
    $textarea.focus();
    $textarea.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch (e) {
      reject(e);
    }
    document.body.removeChild($textarea);
  });
}

async function converToPngBlob(blob: Blob) {
  const imageData = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return blob;
  }
  ctx.drawImage(imageData, 0, 0);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        return resolve(blob);
      }
      return reject();
    }, 'image/png');
  });
}

export async function copyImage(url: string) {
  const imageFetch = fetch(url);
  if ('write' in navigator.clipboard) {
    let imageBlob = await imageFetch.then((res) => res.blob());
    if (imageBlob.type === 'image/webp') {
      imageBlob = await converToPngBlob(imageBlob);
    }
    return navigator.clipboard.write([
      new ClipboardItem({
        'image/png': imageBlob,
      }),
    ]);
  }
  return copyText(url);
}
