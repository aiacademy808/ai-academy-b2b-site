import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const [
        productsCount,
        applicationsTotal,
        applicationsNew,
        applicationsInProgress,
        applicationsClosed,
        casesCount,
        blogPostsCount,
      ] = await Promise.all([
        prisma.product.count(),
        prisma.application.count(),
        prisma.application.count({ where: { status: 'new' } }),
        prisma.application.count({ where: { status: 'in_progress' } }),
        prisma.application.count({ where: { status: 'closed' } }),
        prisma.caseStudy.count(),
        prisma.blogPost.count(),
      ]);

      return NextResponse.json({
        products: productsCount,
        applications: {
          total: applicationsTotal,
          new: applicationsNew,
          in_progress: applicationsInProgress,
          closed: applicationsClosed,
        },
        cases: casesCount,
        blogPosts: blogPostsCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }
  });
}
