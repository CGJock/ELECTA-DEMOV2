import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

interface DisclaimerModalProps {
  open: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ open, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
        className="relative w-full max-w-2xl mx-4 p-8 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-lg border border-[#374151] shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-300 hover:text-white text-2xl font-bold bg-transparent border-none cursor-pointer transition-colors duration-200"
          type="button"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('disclaimer.title')}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#10B981] to-[#059669] mx-auto rounded-full"></div>
        </div>

        <div className="text-gray-200 leading-relaxed space-y-4 text-lg">
          <p>
            {t('disclaimer.paragraph1')}
          </p>
          <p>
            {t('disclaimer.paragraph2')}
          </p>
          <p className="font-semibold text-[#10B981]">
            {t('disclaimer.paragraph3')}
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold rounded-lg hover:from-[#059669] hover:to-[#047857] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('disclaimer.understood')}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, typeof window !== 'undefined' ? document.body : (null as any));
};

export default DisclaimerModal;
