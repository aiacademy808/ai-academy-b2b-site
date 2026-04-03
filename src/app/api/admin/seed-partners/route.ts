import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    // Fetch partners from the source site
    const res = await fetch('https://aiacademy.my/api/partners');
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch partners from source' }, { status: 500 });
    }

    const sourcePartners = await res.json();

    let created = 0;
    for (const p of sourcePartners) {
      // Check if partner already exists by name
      const existing = await prisma.partner.findFirst({ where: { name: p.name } });
      if (!existing) {
        await prisma.partner.create({
          data: {
            name: p.name,
            logoUrl: p.logoUrl || '',
            logoDarkUrl: p.logoDarkUrl || '',
            darkMode: p.darkMode || 'none',
            url: p.url || '',
            sortOrder: p.sortOrder || 0,
          },
        });
        created++;
      }
    }

    return NextResponse.json({ success: true, total: sourcePartners.length, created });
  });
}
