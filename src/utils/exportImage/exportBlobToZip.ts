export async function makeBlobsZipBlob(images: [Blob, string][]) {
  const { ZipWriter, BlobWriter, BlobReader } = await import('@zip.js/zip.js');
  const zip = new ZipWriter(new BlobWriter('application/zip'));
  const newFolders = new Set<string>();
  const allPaths = new Set<string>();

  for (const [_, name] of images) {
    const parts = name.split('/');
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i++) {
        newFolders.add(parts.slice(0, i + 1).join('/'));
      }
    }
  }

  await Promise.all(
    Array.from(newFolders).map((name) =>
      zip.add(name, undefined, { directory: true }),
    ),
  );

  const promises = images.map(([blob, name]) => {
    if (allPaths.has(name)) {
      return;
    }
    allPaths.add(name);
    return zip.add(name, new BlobReader(blob));
  });
  await Promise.all(promises);
  return zip.close();
}
