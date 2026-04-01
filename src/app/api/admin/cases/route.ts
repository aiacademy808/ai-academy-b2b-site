import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const cases = await prisma.caseStudy.findMany({
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
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const { title, ...rest } = body;

      if (!title) {
        return NextResponse.json(
          { error: 'Title is required' },
          { status: 400 }
        );
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9а-яё\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const caseStudy = await prisma.caseStudy.create({
        data: {
          title,
          slug,
          clientName: rest.clientName || '',
          productName: rest.productName || '',
          cost: rest.cost || null,
          timeline: rest.timeline || null,
          result: rest.result || '',
          status: rest.status || 'completed',
          quote: rest.quote || null,
          quoteAuthor: rest.quoteAuthor || null,
          imageUrl: rest.imageUrl || null,
          isPublished: rest.isPublished || false,
          sortOrder: rest.sortOrder || 0,
        },
      });

      return NextResponse.json(caseStudy, { status: 201 });
    } catch (error) {
      console.error('Error creating case study:', error);
      return NextResponse.json(
        { error: 'Failed to create case study' },
        { status: 500 }
      );
    }
  });
}
