import React, { useState } from 'react';

/**
 * SVG social media icons — 20×20, stroke-based, matching the design system.
 * Minimal and clean, no filled backgrounds.
 */

function InstagramIcon(): React.JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon(): React.JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GmailIcon(): React.JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  );
}

function WhatsAppIcon(): React.JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

interface SocialLink {
  href: string;
  label: string;
  icon: React.JSX.Element;
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://instagram.com/lublue',
    label: 'Follow us on Instagram',
    icon: <InstagramIcon />,
  },
  {
    href: 'https://linkedin.com/company/lublue',
    label: 'Connect on LinkedIn',
    icon: <LinkedInIcon />,
  },
  {
    href: 'mailto:hello@lublue.com',
    label: 'Email us',
    icon: <GmailIcon />,
  },
  {
    href: 'https://wa.me/1234567890',
    label: 'Message on WhatsApp',
    icon: <WhatsAppIcon />,
  },
];

/**
 * Site footer with social media links & Bright Data Hackathon attribution badge.
 */
export function Footer(): React.JSX.Element {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <footer className="footer">
      <div className="footer__separator" aria-hidden="true" />
      
      {/* Bright Data Multi-Product Pipeline Attribution Badge */}
      <div className="footer__pipeline">
        <button
          type="button"
          className="footer__badge"
          onClick={() => setShowDetails(!showDetails)}
          title="Click to view Bright Data multi-product pipeline architecture"
        >
          <span className="footer__badge-pulse" />
          <span className="footer__badge-text">
            Powered by <strong>Bright Data</strong> — 5 Products Integrated
          </span>
          <span className="footer__badge-arrow">{showDetails ? '▲' : '▼'}</span>
        </button>

        {showDetails && (
          <div className="footer__pipeline-card animate-fade-in">
            <div className="footer__pipeline-header">
              <span className="footer__pipeline-title">Bright Data Multi-Product Architecture</span>
              <span className="footer__pipeline-status">Active</span>
            </div>
            <ul className="footer__pipeline-list">
              <li><strong>1. SERP API:</strong> Real-time scholarship discovery from search engines</li>
              <li><strong>2. Web Unlocker:</strong> Anti-bot bypass for grant portal access</li>
              <li><strong>3. Scraping Browser:</strong> Full JS rendering for dynamic pages</li>
              <li><strong>4. Data Collector API:</strong> Collector <code>c_mt5ob6r4mm7ggia0h</code></li>
              <li><strong>5. MCP Server (SSE):</strong> AI agent ↔ Bright Data orchestration</li>
              <li><strong>Self-Healing:</strong> <code>bdata scraper heal</code> — AI DOM selector regeneration</li>
            </ul>
          </div>
        )}
      </div>

      <nav className="footer__socials" aria-label="Social media links">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </nav>
      <p className="footer__copy">&copy; {new Date().getFullYear()} Lublue &bull; Built for the Bright Data Hackathon</p>
    </footer>
  );
}
