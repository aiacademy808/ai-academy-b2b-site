import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import Problems from '@/components/sections/Problems';
import Products from '@/components/sections/Products';
import Cases from '@/components/sections/Cases';
import Pricing from '@/components/sections/Pricing';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import FloatingWhatsApp from '@/components/sections/FloatingWhatsApp';
import { getProducts, getCases, getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [products, cases, settings] = await Promise.all([
    getProducts(),
    getCases(),
    getSettings(),
  ]);

  // Serialize for client components (dates -> strings, etc.)
  const serializedProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    accentColor: p.accentColor,
    kpiItems: p.kpiItems as { value: string; label: string }[],
    sortOrder: p.sortOrder,
    pricingTiers: p.pricingTiers.map((t) => ({
      tierName: t.tierName,
      price: t.price,
      description: t.description,
      features: t.features as string[],
      isPopular: t.isPopular,
    })),
  }));

  const serializedCases = cases.map((c) => ({
    slug: c.slug,
    title: c.title,
    clientName: c.clientName,
    productName: c.productName,
    cost: c.cost,
    timeline: c.timeline,
    result: c.result,
    status: c.status,
    quote: c.quote,
    quoteAuthor: c.quoteAuthor,
  }));

  const productNames = products.map((p) => p.name);

  return (
    <>
      <Header />
      <Hero />
      <Problems />
      <Products products={serializedProducts} />
      <Cases cases={serializedCases} />
      <Pricing products={serializedProducts} />
      <ContactForm productNames={productNames} whatsappNumber={settings.whatsappNumber} />
      <Footer settings={settings} />
      <FloatingWhatsApp number={settings.whatsappNumber} />
    </>
  );
}
