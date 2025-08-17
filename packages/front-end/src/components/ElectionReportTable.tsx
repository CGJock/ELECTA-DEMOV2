'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Eye, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActas, type Acta } from '../hooks/useActas';

export default function ElectionReportTable() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalActa, setModalActa] = useState<Acta | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  
  const { actas, loading, error, totalPages, totalItems } = useActas(currentPage);

  // Cargar imagen de forma segura
  const loadImage = async (imageUrl: string) => {
    setIsLoadingImage(true);
    try {
      // Intentar fetch directo primero
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Error al cargar la imagen');
      
      const blob = await response.blob();
      setModalImageUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error:', error);
      // Fallback: mostrar la imagen directamente (puede tener problemas de CORS)
      setModalImageUrl(imageUrl);
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Mostrar modal
  const showModal = async (acta: Acta) => {
    setModalActa(acta);
    await loadImage(acta.imageUrl);
  };

  // Cerrar modal
  const closeModal = () => {
    if (modalImageUrl && modalImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(modalImageUrl);
    }
    setModalImageUrl(null);
    setModalActa(null);
  };

  // Descargar imagen
  const downloadImage = () => {
    if (!modalImageUrl || !modalActa) return;
    
    if (modalImageUrl.startsWith('blob:')) {
      // Si es blob, descargar normalmente
      const link = document.createElement('a');
      link.href = modalImageUrl;
      link.download = `Acta-${modalActa.id}.jpg`;
      link.click();
    } else {
      // Si es URL directa, abrir en nueva pestaña
      window.open(modalImageUrl, '_blank');
    }
  };

  
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
      <div>{t('electionReportTable.loading')}</div>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
      {t('electionReportTable.error', { error })}
    </div>
  );

  return (
    <div style={{ padding: '1rem', color: '#fff' }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        fontSize: '2rem',
        color: '#e5e7eb',
        fontWeight: '600'
      }}>
        {t('electionReportTable.title')}
      </h1>

      {/* Tabla */}
      <div style={{
        overflowX: 'auto', 
        background: 'rgba(30,41,59,0.9)', 
        borderRadius: '8px', 
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              background: 'rgba(51,65,85,0.8)'
            }}>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                {t('electionReportTable.table_headers.department')}
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'center', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                {t('electionReportTable.table_headers.image')}
              </th>
            </tr>
          </thead>
          <tbody>
            {actas.map((acta) => (
              <tr key={acta.id} style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background 0.2s ease'
              }}>
                <td style={{ 
                  padding: '16px', 
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {acta.departamento}
                </td>
                <td style={{ 
                  padding: '16px', 
                  textAlign: 'center' 
                }}>
                  <button
                    onClick={() => showModal(acta)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      margin: '0 auto',
                      fontWeight: '500',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#10b981';
                    }}
                  >
                    <Eye size={16} />
                    {t('electionReportTable.buttons.view_image')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación simple */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px', 
          marginTop: '2rem' 
        }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 18px',
              background: currentPage === 1 
                ? 'rgba(51,65,85,0.5)' 
                : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '0.95rem',
              transition: 'background 0.2s ease'
            }}
          >
            {t('electionReportTable.buttons.previous')}
          </button>
          
          <span style={{ 
            padding: '10px 18px', 
            color: '#fff',
            background: 'rgba(51,65,85,0.5)',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '0.95rem'
          }}>
            {t('electionReportTable.pagination.page_info', { current: currentPage, total: totalPages })}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 18px',
              background: currentPage === totalPages 
                ? 'rgba(51,65,85,0.5)' 
                : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '0.95rem',
              transition: 'background 0.2s ease'
            }}
          >
            {t('electionReportTable.buttons.next')}
          </button>
        </div>
      )}

      {/* Modal */}
      {modalActa && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              background: '#1e293b',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {isLoadingImage ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                <div>{t('electionReportTable.modal.loading_image')}</div>
              </div>
            ) : modalImageUrl ? (
              <>
                <img 
                  src={modalImageUrl} 
                  alt={`Acta ${modalActa.id}`}
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px', 
                    objectFit: 'contain', 
                    marginBottom: '1.5rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                  onError={(e) => {
                    console.log('Error loading image, trying fallback');
                    // Si la imagen falla, mostrar mensaje
                    e.currentTarget.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.style.textAlign = 'center';
                    errorDiv.style.color = '#ef4444';
                    errorDiv.textContent = t('electionReportTable.modal.image_load_error');
                    e.currentTarget.parentNode?.insertBefore(errorDiv, e.currentTarget.nextSibling);
                  }}
                />
                <div style={{
                  textAlign: 'center', 
                  marginBottom: '1.5rem',
                  background: 'rgba(51,65,85,0.5)',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    color: '#10b981',
                    marginBottom: '0.5rem'
                  }}>
                    {t('electionReportTable.modal.acta_info', { id: modalActa.id })}
                  </div>
                  <div style={{
                    fontSize: '1rem', 
                    color: '#e5e7eb' 
                  }}>
                    {modalActa.departamento}
                  </div>
                </div>
                <div style={{ 
                  textAlign: 'center', 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'center' 
                }}>
                  <button
                    onClick={downloadImage}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}
                  >
                    <Download size={16} />
                    {t('electionReportTable.modal.download')}
                  </button>
                  <button
                    onClick={() => window.open(modalActa.imageUrl, '_blank')}
                    style={{
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}
                  >
                    {t('electionReportTable.modal.open_new_tab')}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#ef4444' }}>
                {t('electionReportTable.modal.image_error')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 