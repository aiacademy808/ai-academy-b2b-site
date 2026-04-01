import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const admins = await prisma.adminUser.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
        },
      });

      return NextResponse.json(admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      return NextResponse.json(
        { error: 'Failed to fetch admins' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const { username, password, name, role } = body;

      if (!username || !password || !name) {
        return NextResponse.json(
          { error: 'Username, password, and name are required' },
          { status: 400 }
        );
      }

      const existing = await prisma.adminUser.findUnique({
        where: { username },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.adminUser.create({
        data: {
          username,
          password: hashedPassword,
          name,
          role: role || 'admin',
        },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
        },
      });

      return NextResponse.json(admin, { status: 201 });
    } catch (error) {
      console.error('Error creating admin:', error);
      return NextResponse.json(
        { error: 'Failed to create admin' },
        { status: 500 }
      );
    }
  });
}
