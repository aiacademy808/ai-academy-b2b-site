'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface PricingTier {
  tierName: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

interface ProductWithPricing {
  name: string;
  pricingTiers: PricingTier[];
}

const tierOrder = ['Старт', 'Бизнес', 'Про'];

export default function Pricing({ products }: { products: ProductWithPricing[] }) {
  const [openProduct, setOpenProduct] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

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
                {tierOrder.map((tier) => (
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
              {products.map((product) => {
                const sortedTiers = tierOrder.map(
                  (name) => product.pricingTiers.find((t) => t.tierName === name)
                );
                return (
                  <tr
                    key={product.name}
                    className="border-b border-[#1e2540] hover:bg-[#0d1120]/50 transition-colors"
                  >
                    <td className="p-4 text-white font-medium text-sm">
                      {product.name}
                    </td>
                    {sortedTiers.map((tier, idx) => (
                      <td key={idx} className="p-4 text-center">
                        {tier ? (
                          <>
                            <div className="text-white font-semibold text-lg">
                              {formatPrice(tier.price)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {tier.description}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile accordion */}
        <div className="lg:hidden flex flex-col gap-3">
          {products.map((product, idx) => {
            const sortedTiers = tierOrder.map(
              (name) => product.pricingTiers.find((t) => t.tierName === name)
            );
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="bg-[#0d1120] border border-[#1e2540] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenProduct(openProduct === idx ? null : idx)}
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
                    {sortedTiers.map((tier, ti) =>
                      tier ? (
                        <div
                          key={ti}
                          className="bg-[#060810] rounded-xl p-4 border border-[#1e2540]"
                        >
                          <div className="text-xs text-[#00e5ff] font-medium mb-2">
                            {tierOrder[ti]}
                          </div>
                          <div className="text-xl font-bold text-white">
                            {formatPrice(tier.price)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">KGS</div>
                          <div className="text-xs text-gray-400 mt-2">
                            {tier.description}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

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
