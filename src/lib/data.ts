import prisma from './prisma';

export async function getProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { pricingTiers: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { pricingTiers: true },
  });
}

export async function getCases() {
  return prisma.caseStudy.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getBlogPosts(limit = 6) {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}
