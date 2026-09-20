'use client';

import { useActionState, useRef, useState } from 'react';
import Image from 'next/image';
import { uploadPhoto, removePhoto, type UploadState } from '@/lib/photo-actions';
import { cn } from '@/lib/utils';

const initialState: UploadState = { error: null, uploaded: null };

/**
 * Drag-and-drop for one photo slot.
 *
 * The file input is the real control — the drop zone writes into it and submits
 * the form. That keeps keyboard and screen-reader users on a plain file input
 * rather than a div that only responds to pointer events.
 */
export function PhotoUploader({
  slotId,
  label,
  currentSrc,
}: {
  slotId: string;
  label: string;
  currentSrc?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    uploadPhoto,
    initialState,
  );
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function submitFiles(files: FileList | null) {
    if (!files || files.length === 0 || !inputRef.current) return;
    // Assigning to the input means the action receives the file through the
    // form exactly as it would from the file picker.
    const transfer = new DataTransfer();
    transfer.items.add(files[0]);
    inputRef.current.files = transfer.files;
    formRef.current?.requestSubmit();
  }

  const src = state.uploaded ?? currentSrc;

  return (
    <div className='w-56 shrink-0'>
      <form action={formAction} ref={formRef}>
        <input type='hidden' name='slotId' value={slotId} />
        <input
          ref={inputRef}
          type='file'
          name='file'
          accept='image/jpeg,image/png,image/webp'
          className='sr-only'
          onChange={(event) => {
            if (event.target.files?.length) formRef.current?.requestSubmit();
          }}
        />

        <button
          type='button'
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsOver(false);
            submitFiles(event.dataTransfer.files);
          }}
          disabled={isPending}
          aria-label={
            src ? `Replace the photograph for ${label}` : `Upload a photograph for ${label}`
          }
          className={cn(
            'relative grid h-32 w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors',
            isOver
              ? 'border-accent bg-accent/8'
              : 'border-admin-border hover:border-ink/30 hover:bg-admin-canvas',
            isPending && 'opacity-60',
          )}
        >
          {src ? (
            <>
              <Image
                src={src}
                alt=''
                fill
                sizes='224px'
                className='object-cover'
              />
              <span className='relative rounded-full bg-ink/75 px-3 py-1 text-xs font-medium text-canvas'>
                {isPending ? 'Uploading…' : 'Replace'}
              </span>
            </>
          ) : (
            <span className='px-3 text-xs leading-relaxed opacity-70'>
              {isPending ? (
                'Uploading…'
              ) : (
                <>
                  <span className='block font-medium opacity-100'>
                    Drop a photo here
                  </span>
                  <span className='mt-0.5 block'>or click to choose · 8MB max</span>
                </>
              )}
            </span>
          )}
        </button>
      </form>

      {state.error && (
        <p role='alert' className='mt-2 text-xs leading-relaxed text-danger'>
          {state.error}
        </p>
      )}

      {src && !state.error && (
        <form action={removePhoto} className='mt-2 text-center'>
          <input type='hidden' name='slotId' value={slotId} />
          <button
            type='submit'
            className='text-xs opacity-60 underline underline-offset-2 hover:opacity-100'
          >
            Remove
          </button>
        </form>
      )}
    </div>
  );
}
