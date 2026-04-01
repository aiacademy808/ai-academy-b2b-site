import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const id = parseInt(params.id);
      const body = await req.json();

      const caseStudy = await prisma.caseStudy.update({
        where: { id },
        data: body,
      });

      return NextResponse.json(caseStudy);
    } catch (error) {
      console.error('Error updating case study:', error);
      return NextResponse.json(
        { error: 'Failed to update case study' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const id = parseInt(params.id);

      await prisma.caseStudy.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Case study deleted' });
    } catch (error) {
      console.error('Error deleting case study:', error);
      return NextResponse.json(
        { error: 'Failed to delete case study' },
        { status: 500 }
      );
    }
  });
}
