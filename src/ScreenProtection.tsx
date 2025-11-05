// /components/ScreenProtection.tsx
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const ScreenProtection: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert('Right-click is disabled!');
    };

    // Disable certain keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Print Screen
      if (e.key === 'PrintScreen') {
        alert('Screenshots are disabled!');
        navigator.clipboard.writeText(''); // Clear clipboard
        e.preventDefault();
      }
      // Prevent Ctrl+Shift+I (DevTools), Ctrl+U (View Source), Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && ['u', 's', 'i', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert('This action is disabled!');
      }
    };

    // Disable text selection to reduce screenshotting
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return <>{children}</>;
};

export default ScreenProtection;
