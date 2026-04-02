'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({ number }: { number?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '996555000000';

  if (!visible) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 animate-pulse"
    >
      <MessageCircle size={28} className="text-white" fill="white" />
    </a>
  );
}
