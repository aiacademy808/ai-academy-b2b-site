'use client';

import { useEffect, useState } from 'react';

export interface GeoInfo {
  country: string; // "KG", "KZ", etc.
  isKZ: boolean;
}

let cachedGeo: GeoInfo | null = null;

export function useGeo(): GeoInfo {
  const [geo, setGeo] = useState<GeoInfo>(cachedGeo || { country: '', isKZ: false });

  useEffect(() => {
    if (cachedGeo) {
      setGeo(cachedGeo);
      return;
    }

    // Use client-side geo detection via free API
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data) => {
        const country = (data.country_code || '').toUpperCase();
        const info: GeoInfo = {
          country: country || 'KG',
          isKZ: country === 'KZ',
        };
        cachedGeo = info;
        setGeo(info);
      })
      .catch(() => {
        // Fallback: try our server endpoint
        fetch('/api/geo')
          .then((r) => r.json())
          .then((data) => {
            const info: GeoInfo = {
              country: data.country || 'KG',
              isKZ: data.country === 'KZ',
            };
            cachedGeo = info;
            setGeo(info);
          })
          .catch(() => {
            const fallback: GeoInfo = { country: 'KG', isKZ: false };
            cachedGeo = fallback;
            setGeo(fallback);
          });
      });
  }, []);

  return geo;
}

// Helper to convert KGS cost string to KZT
// e.g. "850 000 KGS" -> "4 680 000 KZT"
const KGS_TO_KZT = 5.5;

export function convertCostToKZT(cost: string): string {
  // Extract number from cost string like "850 000 KGS" or "850000"
  const numStr = cost.replace(/[^\d]/g, '');
  if (!numStr) return cost;

  const num = parseInt(numStr, 10);
  if (isNaN(num)) return cost;

  const kzt = Math.round(num * KGS_TO_KZT / 10000) * 10000;
  const formatted = kzt.toLocaleString('ru-RU');

  // Replace currency
  if (cost.includes('KGS')) {
    return `${formatted} KZT`;
  }
  return `${formatted} KZT`;
}
