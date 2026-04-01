import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  FileText,
  Brain,
  Headphones,
  MessageCircle,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Cpu,
  TrendingUp,
  Globe,
  Bot,
  Settings,
  Activity,
  Route,
  Bell,
  Layers,
} from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getProductBySlug, getAllProductSlugs } from "@/data/products";

/* ------------------------------------------------------------------ */
/*  Static params for SSG                                              */
/* ------------------------------------------------------------------ */
export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Dynamic metadata                                                   */
/* ------------------------------------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
/*  Feature icons map                                                  */
/* ------------------------------------------------------------------ */
const featureIconSets: Record<string, React.ElementType[]> = {
  "umnaya-pervichka": [FileText, Shield, Layers, Zap],
  "ml-model": [Brain, Cpu, TrendingUp, Settings],
  "crm-assistant": [Headphones, CheckCircle, AlertTriangle, FileText],
  "whatsapp-bot": [Bot, MessageCircle, Globe, Activity],
  optimizer: [BarChart3, Cpu, Route, Bell],
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
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const accent = product.accentColor;
  const icons = featureIconSets[product.slug] ?? [Zap, Zap, Zap, Zap];

  return (
    <>
      <Header />

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Radial glow background */}
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
            {product.kpi.map((k, i) => (
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
              href="https://wa.me/996555000000"
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

      {/* ============================================================ */}
      {/*  PAINS                                                       */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-dot-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Знакомые{" "}
            <span style={{ color: accent }}>проблемы</span>?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Если хотя бы один пункт про вас — мы можем помочь.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.pains.map((pain, i) => (
              <div
                key={i}
                className="group relative rounded-card bg-surface border border-border p-6 md:p-8 transition-all duration-300 hover:border-opacity-60 hover:shadow-card-hover"
                style={
                  {
                    "--hover-border": accent,
                  } as React.CSSProperties
                }
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl mb-5"
                  style={{ background: `${accent}15` }}
                >
                  <AlertTriangle size={20} style={{ color: accent }} />
                </div>
                <p className="text-gray-300 leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES                                                    */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Что вы <span style={{ color: accent }}>получите</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Ключевые возможности продукта
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {product.features.map((feat, i) => {
              const Icon = icons[i] ?? Zap;
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
                  <p className="text-gray-300 leading-relaxed pt-2.5">
                    {feat}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  KPI WITH SOURCES                                            */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-dot-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Цифры, подтверждённые{" "}
            <span style={{ color: accent }}>исследованиями</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Каждый показатель основан на данных из открытых источников
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.kpi.map((k, i) => (
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

      {/* ============================================================ */}
      {/*  PRICING                                                     */}
      {/* ============================================================ */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Тарифы
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Выберите подходящий план и начните с пилотного проекта
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {product.pricing.map((tier, i) => {
              const isMiddle = i === 1;
              return (
                <div
                  key={i}
                  className={`relative rounded-card bg-surface p-8 transition-all duration-300 hover:shadow-card-hover ${
                    isMiddle ? "border-2 md:scale-105" : "border border-border"
                  }`}
                  style={
                    isMiddle
                      ? { borderColor: accent }
                      : undefined
                  }
                >
                  {isMiddle && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-semibold text-white px-4 py-1 rounded-full"
                      style={{ background: accent }}
                    >
                      Популярный
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-2">
                      {tier.tier}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{tier.desc}</p>
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

                  <a
                    href="#contact"
                    className={`block w-full text-center rounded-full py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      isMiddle
                        ? "text-white"
                        : "border text-white hover:bg-white/5"
                    }`}
                    style={
                      isMiddle
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

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
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
              href="https://wa.me/996555000000"
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

      <Footer />
    </>
  );
}
