"use client";
import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { emailService } from '@/services/emailService';

const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  const contactRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: t('about.contact.validation_error') || 'Por favor completa todos los campos'
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: t('about.contact.email_error') || 'Por favor ingresa un email válido'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await emailService.sendContactEmail(formData);
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: t('about.contact.success_message') || '¡Mensaje enviado exitosamente! Te responderemos pronto.'
        });
        // Limpiar formulario
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || t('about.contact.error_message') || 'Error al enviar el mensaje. Por favor intenta de nuevo.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('about.contact.error_message') || 'Error al enviar el mensaje. Por favor intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = [
    {
      title: t('about.values.transparency.title'),
      desc: t('about.values.transparency.description'),
    },
    {
      title: t('about.values.participation.title'),
      desc: t('about.values.participation.description'),
    },
    {
      title: t('about.values.justice.title'),
      desc: t('about.values.justice.description'),
    },
    {
      title: t('about.values.education.title'),
      desc: t('about.values.education.description'),
    },
    {
      title: t('about.values.integrity.title'),
      desc: t('about.values.integrity.description'),
    },
  ];

  // Evitar renderizado hasta que el componente esté montado
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans">
      {/* Hero Section */}
      <section className="relative py-32 px-6 flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-800 text-center overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        {/* Elegant gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl">
          
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-8 leading-tight">
            <span className="block font-normal bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {t('about.hero.title')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            {t('about.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToContact}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/30 border border-emerald-500/20"
            >
              <span className="flex items-center gap-2">
                {t('about.hero.cta_button')}
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center mb-16">
                      <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            {t('about.history.title')}
          </h2>
            <div className="w-16 h-px bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto"></div>
          </div>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p className="text-xl font-light first-letter:text-6xl first-letter:font-light first-letter:text-white first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                {t('about.history.paragraph1')}
              </p>
              <p className="text-lg">
                {t('about.history.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-light text-white mb-6 tracking-tight">
                  {t('about.mission.title')}
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    {t('about.mission.paragraph1')}
                  </p>
                  <p>
                    {t('about.mission.paragraph2')}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-light text-white mb-6 tracking-tight">
                  {t('about.vision.title')}
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    {t('about.vision.paragraph1')}
                  </p>
                  <p>
                    {t('about.vision.paragraph2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            {t('about.whatwedo.title')}
          </h2>
        </div>
        <div className="prose prose-lg prose-invert max-w-none mx-auto">
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-xl font-light">
              {t('about.whatwedo.paragraph1')}
            </p>
            <p className="text-lg">
              {t('about.whatwedo.paragraph2')}
            </p>
            <p className="text-lg">
              {t('about.whatwedo.paragraph3')}
            </p>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            {t('about.values.title')}
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t('about.values.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div 
              key={i}
              className="group relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-700/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-md"></div>
                </div>
                <h4 className="text-2xl font-light text-white mb-4 tracking-tight">
                  {v.title}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section 
        ref={contactRef} 
        className="py-24 px-6 bg-gradient-to-br from-slate-800 to-slate-900"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-white mb-4 tracking-tight">
              {t('about.contact.title')}
            </h2>
            <p className="text-xl text-slate-300">
              {t('about.contact.subtitle')}
            </p>
          </div>
          
          <div className="bg-slate-700/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-600/50">
            {submitStatus.type && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('about.contact.name_placeholder')}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('about.contact.email_placeholder')}
                  maxLength={80}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('about.contact.message_placeholder')}
                  maxLength={500}
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-400 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('about.contact.sending') || 'Enviando...'}
                  </span>
                ) : (
                  t('about.contact.submit_button')
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-slate-600">
              <p className="text-slate-300 mb-4 text-center">
                {t('about.contact.social_text')}
              </p>
              <div className="flex justify-center space-x-6">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.745.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;