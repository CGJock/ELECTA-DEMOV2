"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@components/LanguageSwitcher';
import SubscriptionBanner from '@components/SubscriptionBanner';
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
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400"></div>

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            {/* LanguageSwitcher en la esquina superior derecha (solo desktop) */}
            <div className="hidden md:block absolute top-4 right-8 z-20">
              <LanguageSwitcher small />
            </div>
            <div className="flex items-center justify-between py-6 min-h-[80px] relative">
              {/* Logo a la izquierda, completamente pegado al borde */}
              <div className="flex flex-1 items-center gap-4 min-w-0 pl-0 md:pl-0 lg:pl-0 xl:pl-0">
                <div className="relative w-24 h-24 md:w-28 md:h-28 group ml-0 -translate-x-6 md:-translate-x-10 lg:-translate-x-16 xl:-translate-x-24" style={{left: 0}}>
                  <Image
                    src="/img/Logo-trans.png"
                    alt="Electa Logo"
                    fill
                    className="object-contain transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-emerald-500/20"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              {/* Título centrado, más grande */}
              <div className="flex-1 flex justify-center items-center min-w-0">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight truncate text-center">
                  <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                    ELECTA
                  </span>
                </h1>
              </div>
              {/* Espacio a la derecha para mantener el centro */}
              <div className="flex-1"></div>
              {/* Mobile: Logo y título centrados, menú hamburguesa a la derecha */}
              <div className="flex md:hidden flex-1 items-center justify-center relative w-full">
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="relative w-20 h-20 group mx-auto">
                    <Image
                      src="/img/Logo-trans.png"
                      alt="Electa Logo"
                      fill
                      className="object-contain transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-emerald-500/20"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-1 relative text-center">
                    <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent relative group">
                      ELECTA
                    </span>
                  </h1>
                </div>
                {/* Botón hamburguesa solo en mobile, a la derecha */}
                <button
                  className="md:hidden absolute right-2 top-2 p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-300 group-hover:w-3/4"></div>
                </Link>
              ) : key === 'elections' ? (
                <Link
                  key={key}
                  href="/elections"
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-300 group-hover:w-3/4"></div>
                </Link>
              ) : key === 'faq' ? (
                <Link
                  key={key}
                  href="/faq"
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-300 group-hover:w-3/4"></div>
                </Link>
              ) : (
                <Link
                  key={key}
                  href="/"
                  className="group relative text-white font-medium text-sm px-4 py-1 rounded-lg transition-all duration-300 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-300 group-hover:w-3/4"></div>
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
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
              <div className="mt-6">
                <LanguageSwitcher small />
              </div>
            </div>
          </div>
        </div>
      )}
      <SubscriptionBanner dateStr={dateStr} />
    </>
  );
};

export default Header;
