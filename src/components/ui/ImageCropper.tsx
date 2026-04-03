'use client';

import { useState, useCallback, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  freeAspect?: boolean;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = imageSrc;
  });

  const isSvg = imageSrc.includes('.svg') || imageSrc.startsWith('data:image/svg');
  let imgWidth = image.naturalWidth;
  let imgHeight = image.naturalHeight;

  if (isSvg && (imgWidth === 0 || imgHeight === 0 || imgWidth < 100)) {
    imgWidth = 1000;
    imgHeight = 1000;
  }

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  if (isSvg) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imgWidth;
    tempCanvas.height = imgHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(image, 0, 0, imgWidth, imgHeight);
      ctx.drawImage(
        tempCanvas,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
      );
    }
  } else {
    ctx.drawImage(
      image,
      pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
      0, 0, pixelCrop.width, pixelCrop.height
    );
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      'image/png',
      0.95
    );
  });
}

const ASPECT_OPTIONS = [
  { label: 'Свободно', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
];

export default function ImageCropper({
  imageSrc,
  onComplete,
  onCancel,
  aspect: fixedAspect,
  freeAspect = false,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState(fixedAspect || 0);
  const [imageAspect, setImageAspect] = useState(4 / 3);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setImageAspect(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const currentAspect = fixedAspect
    ? fixedAspect
    : selectedAspect === 0
    ? imageAspect
    : selectedAspect;

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(blob);
    } catch (err) {
      console.error('Crop error:', err);
      alert('Ошибка при обрезке изображения');
    } finally {
      setSaving(false);
    }
  };

  const showAspectPicker = !fixedAspect || freeAspect;

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col z-[70]">
      <div className="flex items-center justify-between px-6 py-4 bg-black/50">
        <h3 className="text-white font-semibold text-lg">Обрезать изображение</h3>
        <button onClick={onCancel} className="text-white/70 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={currentAspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={true}
          style={{
            containerStyle: { background: '#000' },
          }}
        />
      </div>

      <div className="bg-black/50 px-6 py-4">
        {showAspectPicker && (
          <div className="flex items-center justify-center gap-2 mb-3">
            {ASPECT_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedAspect(opt.value)}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  selectedAspect === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mb-4">
          <ZoomOut size={18} className="text-white/60" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-48 accent-blue-600"
          />
          <ZoomIn size={18} className="text-white/60" />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-sm text-white/80 border border-white/20 rounded-lg hover:bg-white/10 transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Применить'}
          </button>
        </div>
      </div>
    </div>
  );
}
