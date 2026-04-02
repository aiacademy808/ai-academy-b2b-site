import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  FileText, Brain, Headphones, MessageCircle, BarChart3, CheckCircle,
  AlertTriangle, Zap, Shield, Cpu, TrendingUp, Globe, Bot, Settings,
  Activity, Route, Bell, Layers, ScanLine, ShieldCheck, Plug, RefreshCw,
  Database, BrainCircuit, AudioLines, Star, MessageSquare, UserPlus,
  Cog, Truck, Landmark, ShoppingCart, Factory, ShoppingBag, Radio,
  Handshake, Wrench, UtensilsCrossed,
} from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getProductBySlug, getSettings } from "@/lib/data";

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/*  No static params - pages render on demand from DB                  */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Dynamic metadata                                                   */
/* ------------------------------------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Продукт не найден" };

  return {
    title: product.heroTitle,
    description: product.heroSlogan,
    openGraph: {
      title: product.heroTitle + " | AI Academy",
      description: product.heroSlogan,
      type: "website",
      locale: "ru_RU",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Icon name → component map                                          */
/* ------------------------------------------------------------------ */
const ICON_MAP: Record<string, React.ElementType> = {
  ScanLine, ShieldCheck, Plug, Layers, RefreshCw, Database, BrainCircuit, Activity,
  AudioLines, Star, AlertTriangle, FileText, Bot, MessageSquare, UserPlus, Globe,
  BarChart3, Cog, Route, Bell, Truck, Landmark, ShoppingCart, Factory,
  ShoppingBag, Radio, Handshake, Shield, Wrench, UtensilsCrossed, Zap,
  Brain, Headphones, MessageCircle, CheckCircle, Cpu, TrendingUp, Settings,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU");
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const accent = product.accentColor;
  const kpiItems = product.kpiItems as { value: string; label: string; source: string }[];
  const pains = product.pains as { title: string; description: string }[];
  const features = product.features as { title: string; description: string; icon: string }[];
  const whatsappNumber = settings.whatsappNumber || '996555000000';

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${accent}12 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {product.heroTitle.split(" — ")[0]}
            {product.heroTitle.includes(" — ") && (
              <>
                {" "}
                <br className="hidden sm:block" />
                <span style={{ color: accent }}>
                  {"— " + product.heroTitle.split(" — ")[1]}
                </span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {product.heroSlogan}
          </p>

          {/* KPI row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
            {kpiItems.map((k, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-heading font-bold mb-1"
                  style={{ color: accent }}
                >
                  {k.value}
                </div>
                <div className="text-sm text-gray-400">{k.label}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{ background: accent }}
            >
              Оставить заявку
            </a>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: `${accent}40` }}
            >
              <MessageCircle size={18} className="mr-2" />
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* PAINS */}
      <section className="py-16 md:py-24 bg-dot-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Знакомые <span style={{ color: accent }}>проблемы</span>?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Если хотя бы один пункт про вас — мы можем помочь.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pains.map((pain, i) => (
              <div
                key={i}
                className="group relative rounded-card bg-surface border border-border p-6 md:p-8 transition-all duration-300 hover:border-opacity-60 hover:shadow-card-hover"
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl mb-5"
                  style={{ background: `${accent}15` }}
                >
                  <AlertTriangle size={20} style={{ color: accent }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{pain.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{pain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Что вы <span style={{ color: accent }}>получите</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Ключевые возможности продукта
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feat, i) => {
              const Icon = ICON_MAP[feat.icon] ?? Zap;
              return (
                <div
                  key={i}
                  className="flex gap-4 rounded-card bg-surface border border-border p-6 transition-all duration-300 hover:shadow-card-hover"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ background: `${accent}12` }}
                  >
                    <Icon size={22} style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feat.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* KPI WITH SOURCES */}
      <section className="py-16 md:py-24 bg-dot-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Цифры, подтверждённые <span style={{ color: accent }}>исследованиями</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Каждый показатель основан на данных из открытых источников
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpiItems.map((k, i) => (
              <div
                key={i}
                className="relative rounded-card bg-surface border border-border p-8 text-center transition-all duration-300 hover:shadow-card-hover"
              >
                <div
                  className="text-4xl md:text-5xl font-heading font-bold mb-3"
                  style={{ color: accent }}
                >
                  {k.value}
                </div>
                <div className="text-white font-medium mb-3">{k.label}</div>
                <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-[#0d1120] border border-border rounded-full px-3 py-1">
                  <TrendingUp size={12} />
                  {k.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Тарифы
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Выберите подходящий план и начните с пилотного проекта
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {product.pricingTiers.map((tier, i) => {
              const isPopular = tier.isPopular;
              return (
                <div
                  key={i}
                  className={`relative rounded-card bg-surface p-8 transition-all duration-300 hover:shadow-card-hover ${
                    isPopular ? "border-2 md:scale-105" : "border border-border"
                  }`}
                  style={isPopular ? { borderColor: accent } : undefined}
                >
                  {isPopular && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-semibold text-white px-4 py-1 rounded-full"
                      style={{ background: accent }}
                    >
                      Популярный
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-2">
                      {tier.tierName}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{tier.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span
                        className="text-3xl md:text-4xl font-heading font-bold"
                        style={{ color: accent }}
                      >
                        {formatPrice(tier.price)}
                      </span>
                      <span className="text-sm text-gray-500">KGS</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2 mb-6">
                    {(tier.features as string[]).map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`block w-full text-center rounded-full py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      isPopular
                        ? "text-white"
                        : "border text-white hover:bg-white/5"
                    }`}
                    style={
                      isPopular
                        ? { background: accent }
                        : { borderColor: `${accent}40` }
                    }
                  >
                    Выбрать план
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-16 md:py-24 bg-dot-grid">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Готовы начать?
          </h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Оставьте заявку или напишите нам в WhatsApp — обсудим пилотный проект
            за 15 минут.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{ background: accent }}
            >
              Оставить заявку
            </a>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: `${accent}40` }}
            >
              <MessageCircle size={18} className="mr-2" />
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
