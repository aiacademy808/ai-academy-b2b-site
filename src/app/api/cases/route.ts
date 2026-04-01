import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cases = await prisma.caseStudy.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}
