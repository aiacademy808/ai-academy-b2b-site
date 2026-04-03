import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const partners = await prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(partners);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    const data = await req.json();
    const partner = await prisma.partner.create({ data });
    return NextResponse.json(partner, { status: 201 });
  });
}
