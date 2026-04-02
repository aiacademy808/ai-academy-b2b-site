import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const id = parseInt(params.id);
      const product = await prisma.product.findUnique({
        where: { id },
        include: { pricingTiers: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const id = parseInt(params.id);
      const body = await req.json();
      const { pricingTiers, ...productData } = body;

      // Remove fields that shouldn't be passed to Prisma
      delete productData.id;
      delete productData.createdAt;
      delete productData.updatedAt;

      await prisma.product.update({
        where: { id },
        data: productData,
      });

      // Update pricing tiers if provided
      if (pricingTiers && Array.isArray(pricingTiers)) {
        for (const tier of pricingTiers) {
          if (tier.id) {
            // Update existing tier
            await prisma.pricingTier.update({
              where: { id: tier.id },
              data: {
                tierName: tier.tierName,
                price: typeof tier.price === 'string' ? parseInt(tier.price) || 0 : tier.price,
                description: tier.description || '',
                features: tier.features || [],
                isPopular: tier.isPopular || false,
              },
            });
          } else {
            // Create new tier
            await prisma.pricingTier.create({
              data: {
                productId: id,
                tierName: tier.tierName,
                price: typeof tier.price === 'string' ? parseInt(tier.price) || 0 : tier.price,
                description: tier.description || '',
                features: tier.features || [],
                isPopular: tier.isPopular || false,
              },
            });
          }
        }
      }

      const updated = await prisma.product.findUnique({
        where: { id },
        include: { pricingTiers: true },
      });

      return NextResponse.json(updated);
    } catch (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
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

      await prisma.product.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }
  });
}
