import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { isValidYouTubeUrl } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const { title, content, slug: formSlug, excerpt, imageUrl, videoUrl, isPublished } = body;

      if (!title || !content) {
        return NextResponse.json(
          { error: 'Title and content are required' },
          { status: 400 }
        );
      }

      // Validate videoUrl if provided
      if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        );
      }

      // Use form slug if provided, otherwise auto-generate from title
      const slug = formSlug || title
        .toLowerCase()
        .replace(/[^a-z0-9а-яё\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || null,
          imageUrl: imageUrl || null,
          videoUrl: videoUrl || null,
          isPublished: isPublished || false,
          publishedAt: isPublished ? new Date() : null,
        },
      });

      return NextResponse.json(post, { status: 201 });
    } catch (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      );
    }
  });
}
