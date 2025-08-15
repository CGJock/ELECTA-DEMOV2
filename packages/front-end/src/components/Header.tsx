"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@components/LanguageSwitcher';
// import SubscriptionBanner from '@components/SubscriptionBanner';
import WhitelistUserInfo from '@components/WhitelistUserInfo';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [dateStr, setDateStr] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setDateStr(formatted);
  }, []);

  return (
    <>
      <header className="relative overflow-hidden">
        {/* Background with gradient and subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-slate-500 to-cyan-400"></div>

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            {/* WhitelistUserInfo en la esquina superior izquierda (solo desktop) */}
            <div className="hidden md:block absolute top-4 left-8 z-20">
              <WhitelistUserInfo />
            </div>
            
            {/* LanguageSwitcher en la esquina superior derecha (solo desktop) */}
            <div className="hidden md:block absolute top-4 right-8 z-20">
              <LanguageSwitcher small />
            </div>
            <div className="flex items-center justify-center py-3 h-48 relative overflow-visible">
              {/* Logo centrado horizontalmente */}
              <div className="flex items-center justify-center">
                <div className="relative w-52 h-52 md:w-60 md:h-60 lg:w-68 lg:h-68">
                  <Image
                    src="/img/LogoDesigner.png"
                    alt="Logo Designer"
                    fill
                    className="object-contain scale-[1.7]"
                    priority
                  />
                </div>
              </div>
              {/* Mobile: Logo centrado, menú hamburguesa a la derecha */}
              <div className="flex md:hidden absolute right-4 top-3 items-center">
                {/* Botón hamburguesa solo en mobile, a la derecha */}
                <button
                  className="p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Abrir menú"
                >
                  <Menu size={28} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Desktop only */}
      <nav className="relative bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 hidden md:block">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-slate-800/30 to-slate-900/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center py-0.5 gap-8">
            {['home', 'elections', 'about', 'faq'].map((key) => (
              key === 'about' ? (
                <Link
                  key={key}
                  href="/about"
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-slate-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-slate-400 transition-all duration-300 group-hover:w-3/4"></div>
                </Link>
              ) : key === 'elections' ? (
                <Link
                  key={key}
                  href="/elections"
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-slate-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-slate-400 transition-all duration-300 group-hover:w-3/4"></div>
                </Link>
              ) : key === 'faq' ? (
                <Link
                  key={key}
                  href="/faq"
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-slate-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-slate-400 transition-all duration-300 group-hover:w-3/4"></div>
                </Link>
              ) : (
                <Link
                  key={key}
                  href="/"
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-slate-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-slate-400 transition-all duration-300 group-hover:w-3/4"></div>
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 bg-slate-900 h-full shadow-lg p-6 flex flex-col gap-6 relative animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={28} className="text-white" />
            </button>
            <div className="flex flex-col gap-4 mt-10">
              {['home', 'elections', 'about', 'faq'].map((key) => (
                <Link
                  key={key}
                  href={key === 'home' ? '/' : `/${key}`}
                  className="text-white text-lg font-semibold py-2 px-2 rounded hover:bg-slate-800 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(`nav.${key}`)}
                </Link>
              ))}
              <div className="mt-6 space-y-4">
                <WhitelistUserInfo />
                <LanguageSwitcher small />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <SubscriptionBanner dateStr={dateStr} /> */}
    </>
  );
};

export default Header;
