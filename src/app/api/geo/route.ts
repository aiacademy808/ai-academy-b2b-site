import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Cloud Run passes country info via headers
  const country =
    request.headers.get('x-appengine-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    '';

  // Fallback: try to detect from Cloud Run / GCP headers
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';

  let detectedCountry = country.toUpperCase();

  // If no header-based detection, try a free geo API
  if (!detectedCountry && clientIP && clientIP !== '127.0.0.1') {
    try {
      const res = await fetch(`https://ipapi.co/${clientIP}/country/`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        detectedCountry = (await res.text()).trim().toUpperCase();
      }
    } catch {
      // ignore timeout
    }
  }

  return NextResponse.json({
    country: detectedCountry || 'KG', // default to KG
  });
}
