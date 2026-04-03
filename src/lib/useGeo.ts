'use client';

import { useEffect, useState } from 'react';

export interface GeoInfo {
  country: string; // "KG", "KZ", etc.
  isKZ: boolean;
}

let cachedGeo: GeoInfo | null = null;

export function useGeo(): GeoInfo {
  const [geo, setGeo] = useState<GeoInfo>(cachedGeo || { country: 'KG', isKZ: false });

  useEffect(() => {
    if (cachedGeo) return;

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
        // default to KG
      });
  }, []);

  return geo;
}
