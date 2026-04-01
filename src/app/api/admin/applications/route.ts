import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const applications = await prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }
  });
}
