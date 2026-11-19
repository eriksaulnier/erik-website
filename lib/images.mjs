import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

// Workers static assets refuse files over 25 MiB; fail well before that.
const MAX_BYTES = 10 * 1024 * 1024;
const cache = new Map();

async function describe(src) {
  if (!cache.has(src)) {
    cache.set(
      src,
      (async () => {
        const file = join(process.cwd(), 'public', src);
        const { size } = await stat(file);
        if (size > MAX_BYTES)
          throw new Error(
            `Image too large (${size} bytes, max ${MAX_BYTES}): ${src}`,
          );
        const input = await readFile(file);
        const { width, height } = await sharp(input).metadata();
        const blur = await sharp(input).resize(10).png().toBuffer();
        return {
          width,
          height,
          blurDataURL: `data:image/png;base64,${blur.toString('base64')}`,
        };
      })(),
    );
  }
  return cache.get(src);
}

const isImage = (value) =>
  typeof value?.src === 'string' && value.src.startsWith('/images/');

/**
 * Replaces every `{src: '/images/...', alt}` object (image fields and Markdoc
 * image tag attributes) with the props next/image needs. `label` names the
 * entry in error messages.
 */
export async function resolveImages(data, label, path = []) {
  if (Array.isArray(data)) {
    return Promise.all(
      data.map((item, i) => resolveImages(item, label, [...path, i])),
    );
  }
  if (!data || typeof data !== 'object') return data;
  if (isImage(data)) {
    try {
      return { ...data, ...(await describe(data.src)), placeholder: 'blur' };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      throw new Error(
        `Image not found: ${data.src} in ${label} at ${path.join('.')}`,
      );
    }
  }
  const entries = await Promise.all(
    Object.entries(data).map(async ([key, value]) => [
      key,
      await resolveImages(value, label, [...path, key]),
    ]),
  );
  return Object.fromEntries(entries);
}
