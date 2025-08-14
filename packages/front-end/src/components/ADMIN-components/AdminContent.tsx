'use client';

import React from 'react';
import SiteControlSection from './SiteControlSection';
import ComponentVisibilitySection from './ComponentVisibilitySection';
import ElectionConfigSection from './ElectionConfigSection';
import WhitelistManagement from '@/components/WhitelistManagement';
import AdminManagement from './AdminManagement';

interface AdminContentProps {
  activeSection: string;
  notifications: {
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
    showWarning: (title: string, message: string) => void;
  };
}

export default function AdminContent({ activeSection, notifications }: AdminContentProps) {
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'site-control':
        return <SiteControlSection notifications={notifications} />;

      case 'component-visibility':
        return <ComponentVisibilitySection />;

      case 'election-config':
        return <ElectionConfigSection notifications={notifications} />;

      case 'whitelist-management':
        return <WhitelistManagement notifications={notifications} />;
        
      case 'admin-management':
        return <AdminManagement notifications={notifications} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        {renderSectionContent()}
      </div>
    </div>
  );
}
