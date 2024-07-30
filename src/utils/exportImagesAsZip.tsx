export async function makeImagesZipBlob(images: HTMLImageElement[]) {
  const { ZipWriter, BlobWriter, HttpReader } = await import('@zip.js/zip.js');
  const zip = new ZipWriter(new BlobWriter('application/zip'));
  const promises = images.map((image, index) => {
    let name = image.alt || `image-${index}`;
    if (!name.endsWith('.png')) {
      name += '.png';
    }
    zip.add(
      name,
      new HttpReader(image.src, {
        preventHeadRequest: true,
      }),
    );
  });
  await Promise.all(promises);
  return zip.close();
}
