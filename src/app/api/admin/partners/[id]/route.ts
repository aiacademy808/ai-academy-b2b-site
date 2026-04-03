import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req) => {
    const data = await req.json();
    const partner = await prisma.partner.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(partner);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async () => {
    await prisma.partner.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  });
}
