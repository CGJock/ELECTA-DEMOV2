import React, { useState, useRef, useEffect } from 'react';
import { subscriptionService } from '@/lib/subscriptionService';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';

interface SubscribeModalProps {
  open: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setEmail('');
      setError(null);
      setSuccess(false);
      setLoading(false);
      setTimeout(() => emailInputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (loading) return;
    
    const eMail = email.trim();
    
    if (!eMail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eMail)) {
      setError(t('subscription.invalid_email', { defaultValue: 'Email inválido' }));
      return;
    }
    
    setLoading(true);
    const res = await subscriptionService.subscribeUser(eMail);
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } else {
      setError(res.error || t('subscription.subscribe_error', { defaultValue: 'Error al suscribirse' }));
    }
  };

  if (!open) return null;

  const modalContent = (
    <div
      ref={modalRef}
      onClick={handleBackdrop}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        className="relative w-full max-w-md mx-2 p-6 min-h-[280px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-lg border border-[#374151] shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute right-3 top-2 text-gray-300 hover:text-white text-2xl font-bold bg-transparent border-none cursor-pointer"
          type="button"
        >
          ×
        </button>
        <h2 className="text-base font-bold text-white mb-3 text-center mt-6">
          {t('subscription.subscribe_modal_title', { defaultValue: 'Suscribirse a Alertas' })}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="subscribe-email" className="block text-xs font-medium text-gray-200 mb-1">
              {t('subscription.email_label', { defaultValue: 'Email' })}
            </label>
            <input
              ref={emailInputRef}
              id="subscribe-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t('subscription.email_placeholder', { defaultValue: 'tu@email.com' })}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full px-2 py-1 rounded bg-[#1E293B] border focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white text-sm ${error && error === t('subscription.invalid_email', { defaultValue: 'Email inválido' }) ? 'border-red-400' : 'border-[#374151]'}`}
              required
              aria-required="true"
              maxLength={80}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-1.5 rounded font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10B981] flex items-center justify-center gap-2 text-sm mt-2"
            aria-busy={loading}
          >
            {loading ? t('subscription.subscribe_loading', { defaultValue: 'Suscribiendo...' }) : t('subscription.subscribe_button', { defaultValue: 'Suscribirse' })}
          </button>
          {error && (
            <span className="text-red-400 text-xs mt-1 flex items-center gap-1 text-center" role="alert">{error}</span>
          )}
          {success && (
            <span className="text-green-400 text-xs mt-1 flex items-center gap-1 text-center" role="status">{t('subscription.subscribe_success', { defaultValue: '¡Suscripción exitosa!' })}</span>
          )}
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, typeof window !== 'undefined' ? document.body : (null as any));
};

export default SubscribeModal; 