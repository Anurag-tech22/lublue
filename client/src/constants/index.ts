/* ── API ── */

/** Endpoint for matching opportunities */
export const API_ENDPOINT = '/api/match';

/* ── Validation ── */

/** Minimum number of characters required for a bio submission */
export const MIN_BIO_LENGTH = 10;

/** Maximum number of characters allowed for a bio submission */
export const MAX_BIO_LENGTH = 5000;

/** Maximum number of characters allowed for interests field */
export const MAX_INTERESTS_LENGTH = 1000;

/* ── Design Tokens ── */

export const COLORS = {
  /** Deep ink navy — primary background */
  background: '#12172B',
  /** Warm parchment — card surfaces */
  card: '#F5F0E6',
  /** Signal orange — deadline badge outline and primary CTA only */
  accent: '#E85D2C',
  /** Primary text on dark backgrounds */
  textOnDark: '#EEEAE0',
  /** Secondary text on dark backgrounds */
  textOnDarkSecondary: 'rgba(238, 234, 224, 0.7)',
  /** Primary text on light (card) backgrounds */
  textOnLight: '#12172B',
  /** Secondary text on light backgrounds */
  textOnLightSecondary: '#4A4E5A',
} as const;

export const FONTS = {
  /** Serif font for headings and titles */
  heading: "'Fraunces', serif",
  /** Sans-serif font for body text and UI elements */
  body: "'Inter', sans-serif",
} as const;

export const FONT_SIZES = {
  /** Body text — minimum readable size */
  sm: '16px',
  /** Subheadings */
  md: '20px',
  /** Section headings */
  lg: '28px',
  /** Page titles */
  xl: '40px',
} as const;

export const SPACING = {
  '8': '8px',
  '16': '16px',
  '24': '24px',
  '32': '32px',
  '48': '48px',
  '64': '64px',
} as const;

export const BORDER_RADIUS = '8px';

export const SHADOWS = {
  /** Directional card shadow */
  card: '0 4px 16px rgba(18, 23, 43, 0.08)',
  /** Hover state shadow */
  cardHover: '0 8px 24px rgba(18, 23, 43, 0.12)',
} as const;

/* ── Copy ── */

export const APP_NAME = 'Lublue';
export const APP_TAGLINE = 'Your story, matched to opportunity.';

export const BIO_PLACEHOLDER =
  'Tell us about yourself — your field of study, research interests, career stage, and what kind of funding you\'re looking for. The more detail you share, the better we can match you.';

export const INTERESTS_PLACEHOLDER =
  'e.g., machine learning, public health, renewable energy, early-career researcher';

export const EMPTY_STATE_HEADING = 'No matches found';
export const EMPTY_STATE_MESSAGE =
  'Try adding more detail to your bio or broadening your interests. Mention your field, research topics, or career stage to help us find the right opportunities.';

export const ERROR_STATE_HEADING = 'Something went wrong';
export const ERROR_STATE_MESSAGE =
  'We couldn\'t fetch your matches right now. This is on our end — please try again in a moment.';

export const LOADING_CARD_COUNT = 4;
