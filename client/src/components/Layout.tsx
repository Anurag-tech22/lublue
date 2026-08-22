import React from 'react';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Single-column layout container with a social media footer.
 * Centers content with a max-width and responsive padding.
 */
export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <div className="layout">
      <div className="layout__content">
        {children}
      </div>
      <Footer />
    </div>
  );
}
