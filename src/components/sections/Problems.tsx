'use client';

import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  HardHat,
  ShoppingCart,
  Landmark,
  Calculator,
  HeartPulse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProblemCard {
  icon: LucideIcon;
  industry: string;
  pain: string;
  solution: string;
}

const problems: ProblemCard[] = [
  {
    icon: UtensilsCrossed,
    industry: 'Общепит',
    pain: 'Устали от воровства на кассах и списаний «в никуда»?',
    solution: 'Экономим от 135 000 до 230 000 сом в месяц',
  },
  {
    icon: HardHat,
    industry: 'Строительство',
    pain: 'Материалы «исчезают», а сроки срываются?',
    solution: 'Контроль «план vs факт», который окупается на 1-м объекте',
  },
  {
    icon: ShoppingCart,
    industry: 'Торговля и Ретейл',
    pain: 'Деньги «заморожены» в товаре, который не продаётся?',
    solution: 'Оптимизируем остатки, ROI за 4–6 недель',
  },
  {
    icon: Landmark,
    industry: 'Банки и МФО',
    pain: 'Слишком долго принимаете решения по кредитам?',
    solution: 'AI-скоринг: дефолты −2–4%, одобрение за минуты',
  },
  {
    icon: Calculator,
    industry: 'Учёт и анализ',
    pain: 'Сотрудники тратят 15 часов в неделю на ручные отчёты?',
    solution: 'AI-автоматизация: −50% времени, ноль ошибок',
  },
  {
    icon: HeartPulse,
    industry: 'Медицина',
    pain: 'Теряете прибыль из-за списания лекарств и ручных записей?',
    solution: 'AI-прогноз спроса + ассистент регистратуры за 4–6 недель',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Problems() {
  return (
    <section id="problems" className="py-20 px-4 bg-[#060810]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Узнайте себя — мы решаем именно это
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.industry}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                custom={i}
                className="bg-[#0d1120] border border-[#1e2540] rounded-2xl p-6 hover:translate-y-[-4px] hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#00e5ff]" />
                  </div>
                  <span className="text-sm text-[#00e5ff] font-medium uppercase tracking-wide">
                    {card.industry}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
                  {card.pain}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {card.solution}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
