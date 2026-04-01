'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface PricingProduct {
  name: string;
  tiers: {
    start: { price: string; desc: string };
    business: { price: string; desc: string };
    pro: { price: string; desc: string };
  };
}

const pricingData: PricingProduct[] = [
  {
    name: 'Умная первичка',
    tiers: {
      start: { price: '80 000', desc: 'До 500 документов/мес, 1 шаблон' },
      business: { price: '140 000', desc: 'До 2000 документов/мес, 5 шаблонов' },
      pro: { price: '200 000', desc: 'Безлимит, кастомные шаблоны, интеграция' },
    },
  },
  {
    name: 'Обучение ML-модели',
    tiers: {
      start: { price: '150 000', desc: '1 модель, базовый датасет' },
      business: { price: '250 000', desc: '2-3 модели, расширенный датасет' },
      pro: { price: '400 000', desc: 'Кастомная архитектура, full support' },
    },
  },
  {
    name: 'CRM-Ассистент',
    tiers: {
      start: { price: '100 000', desc: 'До 3 менеджеров, базовая аналитика' },
      business: { price: '180 000', desc: 'До 10 менеджеров, AI-скоринг' },
      pro: { price: '250 000', desc: 'Безлимит, кастомные воронки, API' },
    },
  },
  {
    name: 'WhatsApp-Бот',
    tiers: {
      start: { price: '80 000', desc: '1 номер, до 1000 диалогов/мес' },
      business: { price: '130 000', desc: '3 номера, до 5000 диалогов/мес' },
      pro: { price: '180 000', desc: 'Безлимит, мультиязычность, CRM-интеграция' },
    },
  },
  {
    name: 'Оптимизатор',
    tiers: {
      start: { price: '200 000', desc: 'BI-дашборды, базовая аналитика' },
      business: { price: '400 000', desc: 'BI + ML-прогнозирование' },
      pro: { price: '850 000', desc: 'BI + ML + Мониторинг, полный цикл' },
    },
  },
];

const tierNames = ['Старт', 'Бизнес', 'Про'] as const;
const tierKeys = ['start', 'business', 'pro'] as const;

export default function Pricing() {
  const [openProduct, setOpenProduct] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-20 px-4 bg-[#060810]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Прозрачное ценообразование — без скрытых платежей
          </h2>
        </motion.div>

        {/* Desktop table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-gray-400 text-sm font-medium border-b border-[#1e2540]">
                  Продукт
                </th>
                {tierNames.map((tier) => (
                  <th
                    key={tier}
                    className="p-4 text-center text-sm font-medium border-b border-[#1e2540]"
                  >
                    <span className="text-[#00e5ff]">{tier}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingData.map((product) => (
                <tr
                  key={product.name}
                  className="border-b border-[#1e2540] hover:bg-[#0d1120]/50 transition-colors"
                >
                  <td className="p-4 text-white font-medium text-sm">
                    {product.name}
                  </td>
                  {tierKeys.map((key) => (
                    <td key={key} className="p-4 text-center">
                      <div className="text-white font-semibold text-lg">
                        {product.tiers[key].price}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {product.tiers[key].desc}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile accordion */}
        <div className="lg:hidden flex flex-col gap-3">
          {pricingData.map((product, idx) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="bg-[#0d1120] border border-[#1e2540] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenProduct(openProduct === idx ? null : idx)
                }
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium">{product.name}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-200 ${
                    openProduct === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openProduct === idx && (
                <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tierKeys.map((key, ti) => (
                    <div
                      key={key}
                      className="bg-[#060810] rounded-xl p-4 border border-[#1e2540]"
                    >
                      <div className="text-xs text-[#00e5ff] font-medium mb-2">
                        {tierNames[ti]}
                      </div>
                      <div className="text-xl font-bold text-white">
                        {product.tiers[key].price}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">KGS</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {product.tiers[key].desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-500 mt-10"
        >
          * Все цены указаны в KGS. Для клиентов Казахстана применяется
          коэффициент ×2.
        </motion.p>
      </div>
    </section>
  );
}
