'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const kpis = [
  {
    value: '6–8×',
    label: 'Ускорение обработки документов',
    source: 'Feathery, 2024',
  },
  {
    value: '+25%',
    label: 'Рост конверсии продаж',
    source: 'Salesforce / Nucleus Research',
  },
  {
    value: '−18%',
    label: 'Снижение операционных расходов',
    source: 'McKinsey & Company',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#060810] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-dot-grid opacity-40" />
      <div className="absolute inset-0 gradient-hero" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto"
        >
          AI-автоматизация{' '}
          <span className="gradient-brand-text">
            для бизнеса
          </span>{' '}
          Кыргызстана
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Мы внедряем искусственный интеллект в реальные бизнес-процессы — документооборот,
          продажи, логистику. С измеримым результатом, закреплённым в договоре.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="bg-gradient-to-r from-[#00e5ff] to-[#0066ff] text-white font-medium rounded-full px-8 py-3.5 hover:shadow-glow transition-shadow duration-300 flex items-center gap-2"
          >
            Получить бесплатный аудит
            <ArrowRight size={18} />
          </a>
          <a
            href="#products"
            className="border border-[#00e5ff] text-[#00e5ff] font-medium rounded-full px-8 py-3.5 hover:bg-[#00e5ff]/10 transition-colors duration-300"
          >
            Смотреть продукты
          </a>
        </motion.div>

        {/* KPI counters */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          {kpis.map((kpi) => (
            <div key={kpi.value} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#00e5ff]">
                {kpi.value}
              </div>
              <div className="mt-2 text-sm text-gray-300">{kpi.label}</div>
              <div className="mt-1 text-xs text-gray-500">{kpi.source}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16"
        >
          <a
            href="#problems"
            className="inline-flex flex-col items-center text-gray-500 hover:text-gray-400 transition-colors"
          >
            <ChevronDown size={24} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
