'use server';

import { writeFile, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { verifySession } from './session';
import { photos, type PhotoId } from './photos';
import { uploadedPhotos } from './photo-overlay';

export type UploadState = { error: string | null; uploaded: string | null };

/** Extension is chosen from the detected type, never from the supplied name. */
const ACCEPTED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_BYTES = 8 * 1024 * 1024;

const PUBLIC_PHOTOS = path.join(process.cwd(), 'public', 'photos');
const OVERLAY_FILE = path.join(process.cwd(), 'lib', 'photo-overlay.ts');

function isKnownSlot(id: string): id is PhotoId {
  return Object.prototype.hasOwnProperty.call(photos, id);
}

async function writeOverlay(next: Record<string, string>): Promise<void> {
  const entries = Object.entries(next)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, src]) => `  ${JSON.stringify(id)}: ${JSON.stringify(src)},`)
    .join('\n');

  const body = `/**
 * Written by the photo uploader in the coach's panel. Do not edit by hand —
 * it is regenerated whenever a photograph is uploaded or removed.
 *
 * Maps a photo slot id to the public path of the file that was uploaded for it.
 * lib/photos.ts merges this over the static slot definitions, so an uploaded
 * photograph wins over the placeholder without the source file changing.
 */
export const uploadedPhotos: Record<string, string> = {${
    entries ? `\n${entries}\n` : ''
  }};
`;
  await writeFile(OVERLAY_FILE, body, 'utf8');
}

function readOnlyFilesystemMessage(): string {
  return 'This deployment has a read-only filesystem, so the photo cannot be saved. Uploading works when the site is run locally. To upload on the live site it needs object storage — see the note under the shot list.';
}

export async function uploadPhoto(
  _previousState: UploadState,
  formData: FormData,
): Promise<UploadState> {
  // A Server Function is reachable by direct POST, not only through the form.
  // This one writes files, so it re-establishes who is calling before anything
  // touches the disk.
  const session = await verifySession();
  if (!session) {
    return { error: 'Your session has expired. Sign in again.', uploaded: null };
  }

  const slotId = String(formData.get('slotId') ?? '');
  if (!isKnownSlot(slotId)) {
    return { error: 'That is not a photo slot on this site.', uploaded: null };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'No file arrived. Try again.', uploaded: null };
  }

  const extension = ACCEPTED[file.type];
  if (!extension) {
    return {
      error: 'Only JPEG, PNG and WebP images can be uploaded.',
      uploaded: null,
    };
  }

  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return {
      error: `That file is ${mb}MB. The limit is 8MB — export it smaller and try again.`,
      uploaded: null,
    };
  }

  // The filename comes from the slot id, which was matched against a known set
  // above, so nothing the uploader supplies can escape this directory.
  const filename = `${slotId}.${extension}`;
  const publicPath = `/photos/${filename}`;

  try {
    await mkdir(PUBLIC_PHOTOS, { recursive: true });
    await writeFile(
      path.join(PUBLIC_PHOTOS, filename),
      Buffer.from(await file.arrayBuffer()),
    );

    // Remove a previous upload for this slot in a different format, so an old
    // .png does not linger after a .jpg replaces it.
    for (const other of Object.values(ACCEPTED)) {
      if (other === extension) continue;
      await unlink(path.join(PUBLIC_PHOTOS, `${slotId}.${other}`)).catch(
        () => {},
      );
    }

    await writeOverlay({ ...uploadedPhotos, [slotId]: publicPath });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === 'EROFS' || code === 'EACCES' || code === 'EPERM') {
      return { error: readOnlyFilesystemMessage(), uploaded: null };
    }
    return {
      error: 'Could not save that photograph. Try again.',
      uploaded: null,
    };
  }

  revalidatePath('/admin/photos');
  revalidatePath('/', 'layout');
  return { error: null, uploaded: publicPath };
}

export async function removePhoto(formData: FormData): Promise<void> {
  const session = await verifySession();
  if (!session) return;

  const slotId = String(formData.get('slotId') ?? '');
  if (!isKnownSlot(slotId)) return;

  try {
    for (const extension of Object.values(ACCEPTED)) {
      await unlink(path.join(PUBLIC_PHOTOS, `${slotId}.${extension}`)).catch(
        () => {},
      );
    }
    const next = { ...uploadedPhotos };
    delete next[slotId];
    await writeOverlay(next);
  } catch {
    // A failure here leaves the photograph in place, which the page will show.
    return;
  }

  revalidatePath('/admin/photos');
  revalidatePath('/', 'layout');
}
