import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SOURCE_BASE = 'https://aiacademy.my';

function toAbsoluteUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SOURCE_BASE}${path}`;
}

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    const res = await fetch(`${SOURCE_BASE}/api/partners`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch partners from source' }, { status: 500 });
    }

    const sourcePartners = await res.json();

    let created = 0;
    let updated = 0;
    for (const p of sourcePartners) {
      const logoUrl = toAbsoluteUrl(p.logoUrl);
      const logoDarkUrl = toAbsoluteUrl(p.logoDarkUrl);

      const existing = await prisma.partner.findFirst({ where: { name: p.name } });
      if (existing) {
        // Update existing with correct absolute URLs
        await prisma.partner.update({
          where: { id: existing.id },
          data: {
            logoUrl,
            logoDarkUrl,
            darkMode: p.darkMode || 'none',
            url: p.url || '',
            sortOrder: p.sortOrder || 0,
          },
        });
        updated++;
      } else {
        await prisma.partner.create({
          data: {
            name: p.name,
            logoUrl,
            logoDarkUrl,
            darkMode: p.darkMode || 'none',
            url: p.url || '',
            sortOrder: p.sortOrder || 0,
          },
        });
        created++;
      }
    }

    return NextResponse.json({ success: true, total: sourcePartners.length, created, updated });
  });
}
