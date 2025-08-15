import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useWhitelistAccess } from '@/hooks/useWhitelistAccess';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';

interface MaintenancePageProps {
  isPrivateAccess?: boolean;
}

export default function MaintenancePage({ isPrivateAccess = false }: MaintenancePageProps) {
  const { verifyAccess, isVerified, user, error, isLoading } = useWhitelistAccess();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    allowed: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setVerificationResult({
        success: false,
        allowed: false,
        message: t('admin.sections.maintenance.complete_fields')
      });
      return;
    }

    setVerificationResult(null);

    try {
      // Usar el hook useWhitelistAccess para verificar
      const success = await verifyAccess(formData.name, formData.email);
      
      if (success) {
        setVerificationResult({
          success: true,
          allowed: true,
          message: t('admin.sections.maintenance.redirecting')
        });
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setVerificationResult({
          success: false,
          allowed: false,
          message: error || t('admin.sections.maintenance.access_denied')
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setVerificationResult({
        success: false,
        allowed: false,
        message: t('admin.sections.maintenance.connection_error')
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '' });
    setVerificationResult(null);
  };

  // Si es acceso privado, mostrar formulario de verificación
  if (isPrivateAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header con toggle de idioma */}
          <div className="flex justify-end items-start mb-8">
            <LanguageSwitcher small={true} />
          </div>

          {/* Formulario de Verificación */}
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm">
            <div className="text-center mb-8">
              <Image
                src="/img/LogoDesigner.png"
                alt="ELECTA Logo"
                width={80}
                height={80}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t('admin.sections.maintenance.verification_title')}
              </h2>
              <p className="text-slate-400 text-base">
                {t('admin.sections.maintenance.verification_description')}
              </p>
            </div>

            {/* Disclaimer de Acceso Restringido */}
            <div className="mb-8 p-6 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                {t('admin.sections.maintenance.disclaimer.title')}
              </h3>
              <div className="text-sm text-slate-300 space-y-4">
                <p>{t('admin.sections.maintenance.disclaimer.greeting')}</p>
                <p>{t('admin.sections.maintenance.disclaimer.description')}</p>
                
                <div className="mt-6">
                  <p className="font-medium text-cyan-300 mb-3">
                    {t('admin.sections.maintenance.disclaimer.authorized_users')}
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-slate-300">
                    <li>{t('admin.sections.maintenance.disclaimer.authorized_bullet')}</li>
                    <li>{t('admin.sections.maintenance.disclaimer.authorized_bullet2')}</li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <p className="font-medium text-cyan-300 mb-3">
                    {t('admin.sections.maintenance.disclaimer.unauthorized_users')}
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-slate-300">
                    <li>
                      {t('admin.sections.maintenance.disclaimer.unauthorized_bullet')} 
                      <span className="font-semibold text-cyan-400 ml-1">
                        {t('admin.sections.maintenance.disclaimer.email')}
                      </span>
                    </li>
                    <li>{t('admin.sections.maintenance.disclaimer.unauthorized_bullet2')}</li>
                    <li>{t('admin.sections.maintenance.disclaimer.unauthorized_bullet3')}</li>
                  </ul>
                </div>
                
                <p className="mt-6 italic">{t('admin.sections.maintenance.disclaimer.closing')}</p>
                <p className="text-right font-semibold text-cyan-400">
                  {t('admin.sections.maintenance.disclaimer.signature')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  {t('admin.sections.maintenance.full_name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none transition-colors text-base"
                  placeholder={t('admin.sections.maintenance.full_name_placeholder')}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  {t('admin.sections.maintenance.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none transition-colors text-base"
                  placeholder={t('admin.sections.maintenance.email_placeholder')}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-5 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base"
              >
                {isLoading ? t('admin.sections.maintenance.verifying') : t('admin.sections.maintenance.verify_access')}
              </button>
            </form>

            {/* Resultado de la verificación */}
            {verificationResult && (
              <div className={`mt-8 p-6 rounded-lg border ${
                verificationResult.allowed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-3">
                  {verificationResult.allowed ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className={`font-medium text-base ${
                      verificationResult.allowed ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {verificationResult.allowed ? t('admin.sections.maintenance.access_granted') : t('admin.sections.maintenance.access_denied')}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>
                
                {!verificationResult.allowed && (
                  <button
                    onClick={resetForm}
                    className="mt-4 w-full px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                  >
                    {t('admin.sections.maintenance.try_again')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500">
              {t('admin.sections.maintenance.contact_admin')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Página de mantenimiento normal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        {/* Header con logo y toggle de idioma */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-3">
            <Image
              src="/img/LogoDesigner.png"
              alt="ELECTA Logo"
              width={64}
              height={64}
              className="w-16 h-16"
            />
            <div>
              <h1 className="text-4xl font-bold text-blue-100">ELECTA</h1>
              <p className="text-blue-200 text-sm">Dashboard Electoral</p>
            </div>
          </div>
          <LanguageSwitcher small={true} />
        </div>
        
        {/* Mensaje Principal */}
        <h1 className="text-4xl font-bold mb-6 text-blue-50">
          {t('admin.sections.maintenance.maintenance_title')}
        </h1>
        
        {/* Mensaje Secundario */}
        <div className="space-y-3">
          <p className="text-xl text-blue-100 leading-relaxed">
            {t('admin.sections.maintenance.maintenance_message')}
          </p>
          <p className="text-lg text-blue-200">
            {t('admin.sections.maintenance.maintenance_subtitle')}
          </p>
        </div>
        
        {/* Indicador de Estado */}
        <div className="mt-8 p-3 bg-blue-800/50 rounded-lg border border-blue-600/30">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-200">{t('admin.sections.maintenance.maintenance_status')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
