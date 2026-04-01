'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const productOptions = [
  'Умная первичка',
  'Обучение ML-модели',
  'CRM-Ассистент',
  'WhatsApp-Бот',
  'Оптимизатор',
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    products: [] as string[],
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const toggleProduct = (product: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      setForm({ name: '', company: '', phone: '', email: '', products: [], message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section id="contact" className="py-20 px-4 bg-[#060810]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0d1120] border border-[#1e2540] rounded-2xl p-12"
          >
            <CheckCircle size={56} className="text-[#10b981] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              Спасибо!
            </h3>
            <p className="text-gray-400">
              Свяжемся в течение 2 часов
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 px-4 bg-[#060810]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Получите бесплатный Digital Maturity Audit
          </h2>
          <p className="text-gray-400">
            Оставьте заявку — в течение 2 часов свяжемся, обсудим задачу и
            предложим решение.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-[#0d1120] border border-[#1e2540] rounded-2xl p-6 sm:p-8 space-y-5"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-1.5">
              Имя <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              placeholder="Ваше имя"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm text-gray-400 mb-1.5">
              Компания
            </label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              placeholder="Название компании"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-400 mb-1.5">
              Телефон / WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              placeholder="+996 XXX XXX XXX"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              placeholder="email@company.com"
            />
          </div>

          {/* Product checkboxes */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Интересующий продукт
            </label>
            <div className="flex flex-wrap gap-2">
              {productOptions.map((product) => (
                <button
                  key={product}
                  type="button"
                  onClick={() => toggleProduct(product)}
                  className={`text-xs px-3 py-2 rounded-full border transition-colors ${
                    form.products.includes(product)
                      ? 'bg-[#00e5ff]/15 border-[#00e5ff] text-[#00e5ff]'
                      : 'border-[#1e2540] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {product}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm text-gray-400 mb-1.5">
              Сообщение
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors resize-none"
              placeholder="Опишите вашу задачу..."
            />
          </div>

          {/* Error message */}
          {status === 'error' && (
            <p className="text-red-400 text-sm">
              Произошла ошибка. Попробуйте ещё раз или свяжитесь по WhatsApp.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-[#00e5ff] to-[#0066ff] text-white font-medium rounded-full px-8 py-3.5 hover:shadow-glow transition-shadow duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Отправляем...
              </>
            ) : (
              <>
                Получить аудит бесплатно
                <Send size={18} />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
