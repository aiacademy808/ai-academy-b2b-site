import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const products = await prisma.product.findMany({
        include: { pricingTiers: true },
        orderBy: { sortOrder: 'asc' },
      });

      return NextResponse.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const { name, ...rest } = body;

      if (!name) {
        return NextResponse.json(
          { error: 'Product name is required' },
          { status: 400 }
        );
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9а-яё\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          tagline: rest.tagline || '',
          heroTitle: rest.heroTitle || '',
          heroSlogan: rest.heroSlogan || '',
          accentColor: rest.accentColor || '#00e5ff',
          kpiItems: rest.kpiItems || [],
          pains: rest.pains || [],
          features: rest.features || [],
          targetIndustries: rest.targetIndustries || [],
          sortOrder: rest.sortOrder || 0,
          isActive: rest.isActive !== undefined ? rest.isActive : true,
        },
        include: { pricingTiers: true },
      });

      return NextResponse.json(product, { status: 201 });
    } catch (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }
  });
}
