import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const id = parseInt(params.id);
      const body = await request.json();
      const { username, password, name, role } = body;

      const updateData: Record<string, string> = {};
      if (username) updateData.username = username;
      if (name) updateData.name = name;
      if (role) updateData.role = role;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: 'No fields to update' },
          { status: 400 }
        );
      }

      // Check username uniqueness if changing
      if (username) {
        const existing = await prisma.adminUser.findFirst({
          where: { username, NOT: { id } },
        });
        if (existing) {
          return NextResponse.json(
            { error: 'Username already exists' },
            { status: 409 }
          );
        }
      }

      const admin = await prisma.adminUser.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
        },
      });

      return NextResponse.json(admin);
    } catch (error) {
      console.error('Error updating admin:', error);
      return NextResponse.json(
        { error: 'Failed to update admin' },
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
