import React from 'react';
import { APP_NAME, APP_TAGLINE } from '../constants';

/**
 * App header with the Lublue name, an orange accent separator,
 * and the tagline. Fraunces for the title, Inter for the tagline.
 */
export function Header(): React.JSX.Element {
  return (
    <header className="header">
      <h1 className="header__title">{APP_NAME}</h1>
      <span className="header__separator" aria-hidden="true" />
      <p className="header__tagline">{APP_TAGLINE}</p>
    </header>
  );
}
