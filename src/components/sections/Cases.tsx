'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Calendar, DollarSign, Zap } from 'lucide-react';
import { useGeo, convertCostToKZT } from '@/lib/useGeo';

interface CaseData {
  slug: string;
  title: string;
  clientName: string;
  productName: string;
  cost: string | null;
  timeline: string | null;
  result: string;
  status: string;
  quote: string | null;
  quoteAuthor: string | null;
}

export default function Cases({ cases }: { cases: CaseData[] }) {
  const { isKZ } = useGeo();

  if (cases.length === 0) return null;

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

        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {cases.map((caseItem) => (
            <motion.div
              key={caseItem.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative bg-[#0d1120] border border-[#1e2540] rounded-2xl p-8 md:p-10 shadow-glow-lg overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#00e5ff]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-[#10b981]/15 text-[#10b981] text-sm font-medium px-3 py-1 rounded-full">
                    <CheckCircle size={14} />
                    {caseItem.status === 'completed' ? 'Реализован' : 'В работе'}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {caseItem.clientName}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={18} className="text-[#a78bfa]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Продукт</div>
                      <div className="text-sm text-white font-medium">{caseItem.productName}</div>
                    </div>
                  </div>

                  {caseItem.cost && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <DollarSign size={18} className="text-[#00e5ff]" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Стоимость</div>
                        <div className="text-sm text-white font-medium">{isKZ && caseItem.cost ? convertCostToKZT(caseItem.cost) : caseItem.cost}</div>
                      </div>
                    </div>
                  )}

                  {caseItem.timeline && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar size={18} className="text-[#f59e0b]" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Сроки</div>
                        <div className="text-sm text-white font-medium">{caseItem.timeline}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#060810]/60 rounded-xl p-5 border border-[#1e2540]">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {caseItem.result}
                  </p>
                </div>

                {caseItem.quote && (
                  <div className="mt-6 border-l-2 border-[#00e5ff] pl-4">
                    <p className="text-gray-300 text-sm italic">&ldquo;{caseItem.quote}&rdquo;</p>
                    {caseItem.quoteAuthor && (
                      <p className="text-gray-500 text-xs mt-2">— {caseItem.quoteAuthor}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
