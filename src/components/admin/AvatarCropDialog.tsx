"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageBlob } from "@/lib/images/crop";

type Props = {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (file: File) => void | Promise<void>;
};

export function AvatarCropDialog({ imageSrc, onCancel, onConfirm }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, 512);
      const file = new File([blob], `avatar-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      await onConfirm(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crop failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-[14px] border border-border bg-surface shadow-2xl">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-heading text-lg font-bold">Crop profile photo</h3>
          <p className="mt-1 text-xs text-muted">
            Drag to reposition. Use the slider to zoom. Output is a square avatar.
          </p>
        </div>

        <div className="relative h-72 w-full bg-black sm:h-80">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-4 px-4 py-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-medium text-muted">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[var(--color-primary,#4600bb)]"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="rounded-[10px] border border-border px-4 py-2 text-sm text-muted hover:text-white disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy || !croppedAreaPixels}
              onClick={() => void handleConfirm()}
              className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {busy ? "Applying…" : "Use photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
