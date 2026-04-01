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

      const application = await prisma.application.update({
        where: { id },
        data: {
          status: body.status,
        },
      });

      return NextResponse.json(application);
    } catch (error) {
      console.error('Error updating application:', error);
      return NextResponse.json(
        { error: 'Failed to update application' },
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

      await prisma.application.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Application deleted' });
    } catch (error) {
      console.error('Error deleting application:', error);
      return NextResponse.json(
        { error: 'Failed to delete application' },
        { status: 500 }
      );
    }
  });
}
