"use client";
import React, { useState, useEffect, useRef } from 'react';

interface FullscreenWrapperProps {
  children: React.ReactElement<{ isFullscreen?: boolean; enterFullscreen?: () => void }>;
}

const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const enterFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        await (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        await (containerRef.current as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
      setIsFullscreen(false);
      document.body.style.overflow = "";
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).msFullscreenElement) {
        setIsFullscreen(false);
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("msfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("msfullscreenchange", onFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="election-counter-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isFullscreen ? '3rem' : '2rem 1.5rem',
        marginTop: isFullscreen ? '0' : '0rem', // Removido el marginTop para alinear mejor
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: isFullscreen 
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' 
          : 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        borderRadius: isFullscreen ? '0' : '20px',
        boxShadow: isFullscreen ? 'none' : '0 16px 48px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        border: isFullscreen ? 'none' : '1px solid rgba(255,255,255,0.06)',
        color: '#FFFFFF',
        maxWidth: isFullscreen ? '100vw' : '460px',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        position: isFullscreen ? 'relative' : 'static',
        justifyContent: isFullscreen ? 'center' : 'flex-start',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(5, 150, 105, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Fullscreen Logo */}
      {isFullscreen && (
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 30,
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))'
        }}>
          <img
            src="/img/Logo-trans.png"
            alt="Logo"
            width={120}
            height={60}
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            width: '44px',
            height: '44px',
            color: '#FFFFFF',
            fontSize: '1.6rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            transition: 'all 0.25s ease',
            backdropFilter: 'blur(8px)',
            fontWeight: '300'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Cerrar pantalla completa"
        >
          ×
        </button>
      )}

      {/* Render children with fullscreen state */}
      {React.cloneElement(children, { isFullscreen, enterFullscreen })}
    </div>
  );
};

export default FullscreenWrapper; 