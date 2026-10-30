export async function compressImage(file, maxWidth = 1600, quality = 0.8) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file; // leave svg alone
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width); // never make it bigger
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
  if (!blob || blob.size >= file.size) return file; // keep the original if it did not get smaller
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
}
