import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const id = parseInt(params.id);

      const adminCount = await prisma.adminUser.count();
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 }
        );
      }

      await prisma.adminUser.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Admin deleted' });
    } catch (error) {
      console.error('Error deleting admin:', error);
      return NextResponse.json(
        { error: 'Failed to delete admin' },
        { status: 500 }
      );
    }
  });
}
