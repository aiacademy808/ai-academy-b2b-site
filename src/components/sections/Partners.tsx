'use client';

import { useEffect, useState } from 'react';

interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  logoDarkUrl: string;
  darkMode: string;
  url: string;
  sortOrder: number;
}

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => r.json())
      .then(setPartners);
  }, []);

  if (partners.length === 0) return null;

  const displayPartners = [...partners, ...partners, ...partners];
  const duration = partners.length * 5;

  const darkModeClass = (mode: string) => {
    switch (mode) {
      case 'dark':
        return 'brightness-0';
      case 'invert':
        return 'invert';
      case 'white':
        return 'brightness-0 invert';
      default:
        return '';
    }
  };

  const PartnerCard = ({ partner }: { partner: Partner }) => {
    const hasSeparateDarkLogo = partner.darkMode === 'separate' && partner.logoDarkUrl;

    const content = (
      <div className="flex-shrink-0 flex flex-col items-center gap-3 px-8 py-6 w-[200px] group cursor-pointer">
        {partner.logoUrl ? (
          <div className="h-16 w-40 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <img
              src={hasSeparateDarkLogo ? partner.logoDarkUrl : partner.logoUrl}
              alt={partner.name}
              className={`max-h-full max-w-full object-contain ${hasSeparateDarkLogo ? '' : darkModeClass(partner.darkMode)}`}
            />
          </div>
        ) : (
          <div className="h-16 w-40 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">
              {partner.name}
            </span>
          </div>
        )}
        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors text-center max-w-[180px] leading-tight break-words">
          {partner.name}
        </span>
      </div>
    );

    if (partner.url) {
      return (
        <a href={partner.url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return content;
  };

  return (
    <section id="partners" className="py-16 bg-[#060810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white">
          Наши партнёры
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#060810] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#060810] to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center hover:[animation-play-state:paused]"
          style={{
            animation: `partnersScroll ${duration}s linear infinite`,
            width: 'max-content',
          }}
        >
          {displayPartners.map((partner, idx) => (
            <PartnerCard key={`${partner.id}-${idx}`} partner={partner} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes partnersScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}
