'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Calendar, DollarSign, Zap } from 'lucide-react';

export default function Cases() {
  return (
    <section id="cases" className="py-20 px-4 bg-[#060810]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Реальные результаты — закреплённые в договоре
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-[#0d1120] border border-[#1e2540] rounded-2xl p-8 md:p-10 shadow-glow-lg overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#00e5ff]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Status badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#10b981]/15 text-[#10b981] text-sm font-medium px-3 py-1 rounded-full">
                <CheckCircle size={14} />
                Реализован
              </span>
            </div>

            {/* Client name */}
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Чакан ГЭС
            </h3>
            <p className="text-gray-400 mb-8">
              Кыргызская Республика
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap size={18} className="text-[#a78bfa]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Продукт
                  </div>
                  <div className="text-sm text-white font-medium">
                    Оптимизатор
                  </div>
                  <div className="text-xs text-gray-400">
                    BI + ML + Мониторинг — Тариф «Про»
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign size={18} className="text-[#00e5ff]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Стоимость
                  </div>
                  <div className="text-sm text-white font-medium">
                    850 000 KGS
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar size={18} className="text-[#f59e0b]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Сроки
                  </div>
                  <div className="text-sm text-white font-medium">
                    6-8 недель
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={18} className="text-[#10b981]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Результат
                  </div>
                  <div className="text-sm text-white font-medium">
                    Автоматизация мониторинга
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#060810]/60 rounded-xl p-5 border border-[#1e2540]">
              <p className="text-gray-400 text-sm leading-relaxed">
                Автоматизация мониторинга оборудования, BI-дашборды для
                руководства, ML-прогноз нагрузки на генерацию.
                Полный цикл внедрения от аудита до продуктивной эксплуатации.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
