'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Product {
  number: string;
  name: string;
  color: string;
  tagline: string;
  kpis: string;
  slug: string;
}

const products: Product[] = [
  {
    number: '01',
    name: 'Умная первичка',
    color: '#00e5ff',
    tagline: 'Забудьте о ручном вводе накладных навсегда',
    kpis: 'Ускорение 6–8× · 97% точность',
    slug: 'umnaya-pervichka',
  },
  {
    number: '02',
    name: 'Обучение ML-модели',
    color: '#a78bfa',
    tagline: 'Есть данные — обучим. Нет данных — соберём сами',
    kpis: '+20–30% точность прогноза',
    slug: 'ml-model',
  },
  {
    number: '03',
    name: 'CRM-Ассистент',
    color: '#10b981',
    tagline: 'Ваш отдел продаж под контролем AI 24/7',
    kpis: '+25% конверсия · ROI $8.71:$1',
    slug: 'crm-assistant',
  },
  {
    number: '04',
    name: 'WhatsApp-Бот',
    color: '#f59e0b',
    tagline: 'Отвечает клиентам пока вы спите',
    kpis: '+225% скорость · +27% продажи',
    slug: 'whatsapp-bot',
  },
  {
    number: '05',
    name: 'Оптимизатор',
    color: '#fb7185',
    tagline: 'Остановите потери в логистике и производстве',
    kpis: '−18–25% затраты · ROI 10:1–30:1',
    slug: 'optimizer',
  },
];

export default function Products() {
  return (
    <section id="products" className="py-20 px-4 bg-[#060810]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            5 AI-продуктов с измеримым результатом
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5 max-w-4xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={product.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="bg-[#0d1120] border border-[#1e2540] rounded-2xl p-6 hover:translate-y-[-4px] hover:shadow-card-hover transition-all duration-300 group"
              style={{ borderLeftWidth: '4px', borderLeftColor: product.color }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: product.color }}
                    >
                      {product.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {product.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.kpis.split(' · ').map((kpi) => (
                      <span
                        key={kpi}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${product.color}15`,
                          color: product.color,
                        }}
                      >
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all duration-200 shrink-0"
                  style={{ color: product.color }}
                >
                  Подробнее
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
