'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ProductData {
  slug: string;
  name: string;
  tagline: string;
  accentColor: string;
  kpiItems: { value: string; label: string }[];
  sortOrder: number;
}

export default function Products({ products }: { products: ProductData[] }) {
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
            {products.length} AI-продуктов с измеримым результатом
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5 max-w-4xl mx-auto">
          {products.map((product, i) => {
            const kpiText = (product.kpiItems as { value: string; label: string }[])
              .slice(0, 2)
              .map((k) => `${k.value} ${k.label}`)
              .join(' · ');

            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="bg-[#0d1120] border border-[#1e2540] rounded-2xl p-6 hover:translate-y-[-4px] hover:shadow-card-hover transition-all duration-300 group"
                style={{ borderLeftWidth: '4px', borderLeftColor: product.accentColor }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-sm font-mono font-bold"
                        style={{ color: product.accentColor }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {product.tagline}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {kpiText.split(' · ').map((kpi) => (
                        <span
                          key={kpi}
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${product.accentColor}15`,
                            color: product.accentColor,
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
                    style={{ color: product.accentColor }}
                  >
                    Подробнее
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
