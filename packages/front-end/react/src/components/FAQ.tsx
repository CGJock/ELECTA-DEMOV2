"use client";

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  questions: FAQItem[];
}

// Componente FAQItem individual
const FAQItemComponent: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleAccordion();
    }
  };

  return (
    <div className="border-b border-slate-700/20 last:border-b-0">
      <button
        className={`w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-xl transition-all duration-500 group
          ${isOpen ? 'bg-gradient-to-r from-blue-900/30 via-slate-800/40 to-indigo-900/30 shadow-xl shadow-blue-900/10' : 'hover:bg-slate-800/30'}`}
        onClick={toggleAccordion}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${item.question}`}
        id={`faq-trigger-${item.question}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-6">
            <h3 className={`text-lg font-medium transition-all duration-500 leading-relaxed
              ${isOpen ? 'text-blue-100 drop-shadow' : 'text-white group-hover:text-blue-50'}`}
            >
              {item.question}
            </h3>
          </div>
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full bg-slate-700/40 flex items-center justify-center transition-all duration-500 group-hover:bg-blue-500/20 ${isOpen ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20' : ''}`}> 
              <KeyboardArrowDownIcon
                className={`w-6 h-6 text-slate-400 transition-all duration-500 group-hover:text-blue-300 ${isOpen ? 'rotate-180 text-blue-300' : ''}`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </button>
      <div
        id={`faq-content-${item.question}`}
        className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
        aria-labelledby={`faq-trigger-${item.question}`}
      >
        <div className="px-8 pb-8">
          <div className="relative">
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-400/60 via-indigo-400/60 to-blue-500/60 rounded-full" />
            <div className="ml-6">
              <div className="rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-500/10 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 p-6 animate-fade-in backdrop-blur-sm">
                <p className="text-slate-200 leading-relaxed text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal FAQ
const FAQ: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener las categorías y preguntas desde la traducción
  const categories: FAQCategory[] = useMemo(() => {
    const raw = t('faq_content', { returnObjects: true });
    if (!raw || typeof raw !== 'object') return [];
    return Object.entries(raw).map(([id, value]: [string, any]) => ({
      id,
      title: value.title,
      questions: value.questions || [],
    }));
  }, [t, i18n.language]);

  // Filtrar por término de búsqueda en el idioma activo
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories
      .map(category => ({
        ...category,
        questions: category.questions.filter(item =>
          item.question.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term)
        )
      }))
      .filter(category => category.questions.length > 0);
  }, [categories, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-800/5 to-indigo-900/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 mb-6 animate-pulse">
                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                {t('faq.title', 'Preguntas Frecuentes')}
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t('faq.subtitle', 'Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma de monitoreo electoral y cómo usar sus funciones.')}
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-6 pb-16 mt-8">
        <div className="relative">
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <SearchIcon className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={t('faq.search_placeholder', 'Buscar preguntas y respuestas...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-16 pr-12 py-5 bg-slate-800/60 backdrop-blur-sm border border-slate-600/40 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-500 text-lg shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* Indicador de búsqueda activa */}
          {searchTerm && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-600/40 shadow-lg">
                <span className="text-sm text-slate-300">
                  {t('faq.searching_for', 'Buscando')} "{searchTerm}"
                </span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-300 p-1 rounded-full hover:bg-blue-500/10"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/60 rounded-full flex items-center justify-center shadow-lg">
                <SearchIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                {t('faq.no_results_title', 'No se encontraron resultados')}
              </h3>
              <p className="text-slate-400 text-lg mb-8">
                {t('faq.no_results', 'No se encontraron preguntas que coincidan con tu búsqueda.')}
              </p>
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('faq.clear_search', 'Limpiar búsqueda')}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Resumen de resultados */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                {filteredData.reduce((total, category) => total + category.questions.length, 0)} {t('faq.results_found', 'resultados encontrados')}
              </p>
            </div>
            {/* Categorías y preguntas */}
            {filteredData.map((category, categoryIndex) => (
              <div 
                key={category.id} 
                className="bg-slate-800/40 backdrop-blur-sm rounded-3xl border border-slate-700/30 overflow-hidden shadow-2xl shadow-slate-900/20 animate-fade-in"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <div className="px-8 py-8 bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-b border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white">
                      {category.title}
                    </h2>
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                      {category.questions.length} {category.questions.length === 1 ? t('faq.question', 'pregunta') : t('faq.questions', 'preguntas')}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-slate-700/20">
                  {category.questions.map((item, idx) => (
                    <FAQItemComponent key={item.question + idx} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-10 border border-blue-500/20 text-center backdrop-blur-sm shadow-2xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 mb-4">
              <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-semibold text-white mb-4">
            {t('faq.need_help', '¿Aún necesitas ayuda?')}
          </h3>
          <p className="text-slate-300 mb-8 text-lg">
            {t('faq.contact_message', 'Si no encontraste la respuesta que buscas, no dudes en contactarnos directamente.')}
          </p>
          <button 
            onClick={() => window.location.href = '/about'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
          >
            {t('faq.contact_us', 'Contáctanos')}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FAQ; 