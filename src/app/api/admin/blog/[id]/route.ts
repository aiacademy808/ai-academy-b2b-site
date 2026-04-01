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

      if (body.isPublished && !body.publishedAt) {
        const existing = await prisma.blogPost.findUnique({ where: { id } });
        if (existing && !existing.publishedAt) {
          body.publishedAt = new Date();
        }
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: body,
      });

      return NextResponse.json(post);
    } catch (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to update blog post' },
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

      await prisma.blogPost.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Blog post deleted' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return NextResponse.json(
        { error: 'Failed to delete blog post' },
        { status: 500 }
      );
    }
  });
}
