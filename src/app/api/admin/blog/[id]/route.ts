import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { isValidYouTubeUrl } from '@/lib/youtube';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const id = parseInt(params.id);
      const body = await req.json();

      // Whitelist allowed fields (prevent mass assignment)
      const { title, slug, content, excerpt, imageUrl, videoUrl, isPublished } = body;

      // Validate videoUrl if provided
      if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        );
      }

      // Handle publishedAt on first publish
      let publishedAt: Date | undefined;
      if (isPublished) {
        const existing = await prisma.blogPost.findUnique({ where: { id } });
        if (existing && !existing.publishedAt) {
          publishedAt = new Date();
        }
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || null,
          imageUrl: imageUrl || null,
          videoUrl: videoUrl || null,
          isPublished: isPublished ?? false,
          ...(publishedAt ? { publishedAt } : {}),
        },
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
