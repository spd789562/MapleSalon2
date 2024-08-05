export async function makeBlobsZipBlob(images: [Blob, string][]) {
  const { ZipWriter, BlobWriter, BlobReader } = await import('@zip.js/zip.js');
  const zip = new ZipWriter(new BlobWriter('application/zip'));
  const promises = images.map(([blob, name]) => {
    zip.add(name, new BlobReader(blob));
  });
  await Promise.all(promises);
  return zip.close();
}
