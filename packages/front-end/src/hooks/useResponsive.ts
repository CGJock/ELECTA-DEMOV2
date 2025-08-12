import { useState, useEffect } from 'react';

export interface ResponsiveConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

const defaultBreakpoints: ResponsiveConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

export const useResponsive = (breakpoints: Partial<ResponsiveConfig> = {}) => {
  const config = { ...defaultBreakpoints, ...breakpoints };
  
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      setIsMobile(width < config.mobile);
      setIsTablet(width >= config.mobile && width < config.tablet);
      setIsDesktop(width >= config.desktop);
    };

    // Verificar tamaño inicial
    checkScreenSize();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [config.mobile, config.tablet, config.desktop]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    breakpoints: config,
  };
};