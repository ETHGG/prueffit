// Downscales the raster figures of print.html before page.pdf() (issue #21).
// The app keeps the 2400 × 1600 images (sharp when zooming); in the PDFs Chromium would
// embed them at full size (209 MB instead of 87 MB). No extra dependency: a canvas in the
// page draws each image at the print size and replaces src with a JPEG data URL, which
// Chromium embeds as JPEG (DCT) instead of re-encoding the decoded pixels losslessly.

export const PDF_IMAGE_MAX_WIDTH = 1200;
export const PDF_IMAGE_QUALITY = 0.9;

// Target size for an image of naturalWidth × naturalHeight: at most maxWidth wide, aspect
// ratio kept, never enlarged. Returns null when nothing needs to change or the size is unusable.
export function pdfImageSize(naturalWidth, naturalHeight, maxWidth = PDF_IMAGE_MAX_WIDTH) {
  if (![naturalWidth, naturalHeight, maxWidth].every((n) => Number.isFinite(n) && n > 0)) return null;
  if (naturalWidth <= maxWidth) return null;
  return { width: maxWidth, height: Math.max(1, Math.round((naturalHeight * maxWidth) / naturalWidth)) };
}

// Only raster files are shrunk; SVG sketches (skizze-*.svg) stay vector graphics.
export function isShrinkableImage(src) {
  if (typeof src !== 'string' || src.startsWith('data:')) return false;
  const path = src.split(/[?#]/)[0].toLowerCase();
  return /\.(webp|png|jpe?g)$/.test(path);
}

// Runs in the page (page.evaluate). Gets the helpers as source text because page.evaluate
// cannot pass functions. Returns the widths of all raster images afterwards.
export async function shrinkImagesInPage({ maxWidth, quality, sizeSource, shrinkableSource }) {
  const size = new Function(`return (${sizeSource})`)();
  const shrinkable = new Function(`return (${shrinkableSource})`)();
  const images = [...document.images];
  for (const img of images) img.loading = 'eager';
  await Promise.all(images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))));
  for (const img of images) {
    if (!shrinkable(img.getAttribute('src') ?? '')) continue;
    if (!img.naturalWidth) throw new Error(`Bild nicht geladen: ${img.getAttribute('src')}`);
    const target = size(img.naturalWidth, img.naturalHeight, maxWidth);
    if (!target) continue;
    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // JPEG has no alpha; the print view is white
    ctx.fillRect(0, 0, target.width, target.height);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, target.width, target.height);
    const url = canvas.toDataURL('image/jpeg', quality);
    img.src = url;
    await img.decode();
  }
  return images.filter((img) => !(img.getAttribute('src') ?? '').toLowerCase().split(/[?#]/)[0].endsWith('.svg'))
    .map((img) => img.naturalWidth);
}

// Node side: shrink all figures of the current page and verify the result.
export async function shrinkPdfImages(page, maxWidth = PDF_IMAGE_MAX_WIDTH) {
  const widths = await page.evaluate(`(${shrinkImagesInPage.toString()})(${JSON.stringify({
    maxWidth, quality: PDF_IMAGE_QUALITY,
    sizeSource: pdfImageSize.toString(), shrinkableSource: isShrinkableImage.toString(),
  })})`);
  const tooWide = widths.filter((w) => w > maxWidth);
  if (tooWide.length) throw new Error(`${tooWide.length} Bilder breiter als ${maxWidth} px im PDF`);
  return widths.length;
}
