'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import { useGeo } from '@/lib/useGeo';

interface ContactFormProps {
  productNames: string[];
  whatsappNumber?: string;
}

const COUNTRIES = [
  { code: 'KG', flag: '\u{1F1F0}\u{1F1EC}', dial: '+996', name: 'Кыргызстан', placeholder: 'XXX XXX XXX' },
  { code: 'KZ', flag: '\u{1F1F0}\u{1F1FF}', dial: '+7', name: 'Казахстан', placeholder: 'XXX XXX XX XX' },
  { code: 'RU', flag: '\u{1F1F7}\u{1F1FA}', dial: '+7', name: 'Россия', placeholder: 'XXX XXX XX XX' },
  { code: 'UZ', flag: '\u{1F1FA}\u{1F1FF}', dial: '+998', name: 'Узбекистан', placeholder: 'XX XXX XX XX' },
  { code: 'TJ', flag: '\u{1F1F9}\u{1F1EF}', dial: '+992', name: 'Таджикистан', placeholder: 'XX XXX XX XX' },
  { code: 'OTHER', flag: '\u{1F30D}', dial: '+', name: 'Другая', placeholder: 'Номер телефона' },
];

export default function ContactForm({ productNames, whatsappNumber }: ContactFormProps) {
  const { country } = useGeo();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    products: [] as string[],
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Auto-select country based on geo
  useEffect(() => {
    const match = COUNTRIES.find((c) => c.code === country);
    if (match) setSelectedCountry(match);
  }, [country]);

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
      const fullPhone = `${selectedCountry.dial} ${form.phone}`;
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: fullPhone }),
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
            <h3 className="text-2xl font-bold text-white mb-3">Спасибо!</h3>
            <p className="text-gray-400 mb-6">Свяжемся в течение 2 часов</p>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#00e5ff] text-[#00e5ff] font-medium rounded-full px-6 py-2.5 hover:bg-[#00e5ff]/10 transition-colors"
              >
                Написать в WhatsApp
              </a>
            )}
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
            Оставьте заявку — в течение 2 часов свяжемся, обсудим задачу и предложим решение.
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

          <div>
            <label htmlFor="company" className="block text-sm text-gray-400 mb-1.5">Компания</label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              placeholder="Название компании"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm text-gray-400 mb-1.5">
              Телефон / WhatsApp <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {/* Country selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 bg-[#060810] border border-[#1e2540] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#00e5ff] transition-colors h-full min-w-[100px]"
                >
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="text-gray-300">{selectedCountry.dial}</span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 bg-[#0d1120] border border-[#1e2540] rounded-xl shadow-2xl z-50 min-w-[200px] py-1 overflow-hidden">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setSelectedCountry(c); setDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#1e2540]/50 transition-colors ${
                            selectedCountry.code === c.code ? 'bg-[#00e5ff]/10 text-[#00e5ff]' : 'text-white'
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span>{c.name}</span>
                          <span className="text-gray-500 ml-auto">{c.dial}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="flex-1 bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
                placeholder={selectedCountry.placeholder}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              placeholder="email@company.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-3">Интересующий продукт</label>
            <div className="flex flex-wrap gap-2">
              {productNames.map((product) => (
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

          <div>
            <label htmlFor="message" className="block text-sm text-gray-400 mb-1.5">Сообщение</label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-[#060810] border border-[#1e2540] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] transition-colors resize-none"
              placeholder="Опишите вашу задачу..."
            />
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm">
              Произошла ошибка. Попробуйте ещё раз или свяжитесь по WhatsApp.
            </p>
          )}

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
