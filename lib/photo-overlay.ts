/**
 * Written by the photo uploader in the coach's panel. Do not edit by hand —
 * it is regenerated whenever a photograph is uploaded or removed.
 *
 * Maps a photo slot id to the public path of the file that was uploaded for it.
 * lib/photos.ts merges this over the static slot definitions, so an uploaded
 * photograph wins over the placeholder without the source file changing.
 */
export const uploadedPhotos: Record<string, string> = {};
