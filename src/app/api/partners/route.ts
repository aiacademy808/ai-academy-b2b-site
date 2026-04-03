import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const partners = await prisma.partner.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(partners);
}
