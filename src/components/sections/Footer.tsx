import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { label: 'Продукты', href: '#products' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Цены', href: '#pricing' },
  { label: 'Контакты', href: '#contact' },
];

export default function Footer() {
  return (
    <footer className="bg-[#060810] border-t border-[#1e2540] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & description */}
          <div>
            <a href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="AI Academy"
                width={160}
                height={26}
                className="h-7 w-auto"
              />
            </a>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              Внедряем искусственный интеллект в реальные бизнес-процессы
              компаний Кыргызстана и Центральной Азии.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Навигация
            </h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Контакты
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+996555000000"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Phone size={16} className="text-[#00e5ff] shrink-0" />
                +996 555 000 000
              </a>
              <a
                href="mailto:info@ai-academy.kg"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={16} className="text-[#00e5ff] shrink-0" />
                info@ai-academy.kg
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-[#00e5ff] shrink-0" />
                Бишкек, Кыргызская Республика
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#1e2540] text-center">
          <p className="text-xs text-gray-500">
            &copy; 2026 AI Academy. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
