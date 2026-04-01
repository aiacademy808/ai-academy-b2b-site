import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const productId = parseInt(params.id);
      const { tiers } = await req.json();

      if (!Array.isArray(tiers)) {
        return NextResponse.json(
          { error: 'Tiers must be an array' },
          { status: 400 }
        );
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      const results = await Promise.all(
        tiers.map((tier: {
          tierName: string;
          price: number;
          currency?: string;
          description: string;
          features?: string[];
          isPopular?: boolean;
        }) =>
          prisma.pricingTier.upsert({
            where: {
              productId_tierName: {
                productId,
                tierName: tier.tierName,
              },
            },
            update: {
              price: tier.price,
              currency: tier.currency || 'KGS',
              description: tier.description,
              features: tier.features || [],
              isPopular: tier.isPopular || false,
            },
            create: {
              productId,
              tierName: tier.tierName,
              price: tier.price,
              currency: tier.currency || 'KGS',
              description: tier.description,
              features: tier.features || [],
              isPopular: tier.isPopular || false,
            },
          })
        )
      );

      return NextResponse.json(results, { status: 201 });
    } catch (error) {
      console.error('Error upserting pricing tiers:', error);
      return NextResponse.json(
        { error: 'Failed to update pricing tiers' },
        { status: 500 }
      );
    }
  });
}
