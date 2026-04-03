'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface BackgroundRemoverProps {
  imageSrc: string;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
}

function detectBackgroundColor(ctx: CanvasRenderingContext2D, w: number, h: number): [number, number, number] {
  const samples: [number, number, number][] = [];
  const data = ctx.getImageData(0, 0, w, h).data;

  const getPixel = (x: number, y: number): [number, number, number] => {
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  samples.push(getPixel(0, 0));
  samples.push(getPixel(w - 1, 0));
  samples.push(getPixel(0, h - 1));
  samples.push(getPixel(w - 1, h - 1));

  for (let i = 0; i < 10; i++) {
    const x = Math.floor((w / 10) * i);
    const y = Math.floor((h / 10) * i);
    samples.push(getPixel(x, 0));
    samples.push(getPixel(x, h - 1));
    samples.push(getPixel(0, y));
    samples.push(getPixel(w - 1, y));
  }

  const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();
  for (const [r, g, b] of samples) {
    const qr = Math.round(r / 16) * 16;
    const qg = Math.round(g / 16) * 16;
    const qb = Math.round(b / 16) * 16;
    const key = `${qr},${qg},${qb}`;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(key, { count: 1, r: qr, g: qg, b: qb });
    }
  }

  let maxCount = 0;
  let bgColor: [number, number, number] = [255, 255, 255];
  colorMap.forEach((v) => {
    if (v.count > maxCount) {
      maxCount = v.count;
      bgColor = [v.r, v.g, v.b];
    }
  });

  return bgColor;
}

function removeBackgroundCanvas(
  canvas: HTMLCanvasElement,
  tolerance: number
): Blob | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;

  const bgColor = detectBackgroundColor(ctx, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      (r - bgColor[0]) ** 2 +
      (g - bgColor[1]) ** 2 +
      (b - bgColor[2]) ** 2
    );

    if (dist < tolerance) {
      data[i + 3] = 0;
    } else if (dist < tolerance * 1.5) {
      const alpha = Math.round(((dist - tolerance) / (tolerance * 0.5)) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return null;
}

export default function BackgroundRemover({
  imageSrc,
  onComplete,
  onCancel,
}: BackgroundRemoverProps) {
  const [processing, setProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(60);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
    };
    img.onerror = () => {
      setError('Не удалось загрузить изображение');
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const processImage = () => {
    const img = originalImageRef.current;
    if (!img || !canvasRef.current) return;

    setProcessing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');

      ctx.drawImage(img, 0, 0);
      removeBackgroundCanvas(canvas, tolerance);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (resultUrl) URL.revokeObjectURL(resultUrl);
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
          }
          setProcessing(false);
        },
        'image/png'
      );
    } catch {
      setError('Ошибка при обработке');
      setProcessing(false);
    }
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (blob) onComplete(blob);
      },
      'image/png'
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[70] p-4">
      <div className="w-full max-w-2xl flex items-center justify-between px-4 py-3">
        <h3 className="text-white font-semibold text-lg">Удаление фона</h3>
        <button onClick={onCancel} className="text-white/70 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="w-full max-w-2xl px-4 pb-4">
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <p className="text-white/60 text-xs sm:text-sm mb-2 text-center">Оригинал</p>
              <div className="bg-white/10 rounded-lg p-2 flex items-center justify-center aspect-square">
                <img
                  src={imageSrc}
                  alt="Original"
                  className="max-w-full max-h-full object-contain rounded"
                />
              </div>
            </div>
            <div>
              <p className="text-white/60 text-xs sm:text-sm mb-2 text-center">Результат</p>
              <div
                className="rounded-lg p-2 flex items-center justify-center aspect-square"
                style={{
                  background: resultUrl
                    ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                    : 'rgba(255,255,255,0.1)',
                }}
              >
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Result"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : (
                  <p className="text-white/40 text-xs sm:text-sm text-center px-2">
                    Настройте чувствительность и нажмите &quot;Удалить фон&quot;
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-white/60 text-xs sm:text-sm">Чувствительность</label>
              <span className="text-white/60 text-xs">{tolerance}</span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-white/30">
              <span>Точнее</span>
              <span>Агрессивнее</span>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 text-sm text-white/80 border border-white/20 rounded-lg hover:bg-white/10 transition"
            >
              Отмена
            </button>
            <button
              onClick={processImage}
              disabled={processing}
              className="w-full sm:w-auto px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Обработка...
                </>
              ) : resultUrl ? (
                'Пересоздать'
              ) : (
                'Удалить фон'
              )}
            </button>
            {resultUrl && (
              <button
                onClick={handleApply}
                className="w-full sm:w-auto px-6 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Применить
              </button>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
