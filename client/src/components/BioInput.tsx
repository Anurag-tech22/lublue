import React, { useState, useCallback } from 'react';
import {
  MIN_BIO_LENGTH,
  MAX_BIO_LENGTH,
  MAX_INTERESTS_LENGTH,
  BIO_PLACEHOLDER,
  INTERESTS_PLACEHOLDER,
} from '../constants';

interface BioInputProps {
  onSubmit: (bio: string, interests: string) => void;
}

/**
 * Bio input form with textarea, interests field, live character counter,
 * and submit button. The submit button is disabled until the bio
 * meets the minimum length requirement. Counter brightens as user types.
 */
export function BioInput({ onSubmit }: BioInputProps): React.JSX.Element {
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');

  const trimmedBio = bio.trim();
  const isValid = trimmedBio.length >= MIN_BIO_LENGTH;
  const charsRemaining = MAX_BIO_LENGTH - bio.length;
  const hasContent = bio.length > 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValid) {
        onSubmit(trimmedBio, interests.trim());
      }
    },
    [isValid, trimmedBio, interests, onSubmit],
  );

  const handleBioChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_BIO_LENGTH) {
      setBio(value);
    }
  }, []);

  const handleInterestsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_INTERESTS_LENGTH) {
      setInterests(value);
    }
  }, []);

  return (
    <form className="bio-form" onSubmit={handleSubmit}>
      <div className="bio-form__group">
        <label className="bio-form__label" htmlFor="bio-input">
          Tell us about yourself
        </label>
        <textarea
          id="bio-input"
          className="bio-form__textarea"
          placeholder={BIO_PLACEHOLDER}
          value={bio}
          onChange={handleBioChange}
          aria-describedby="bio-char-count"
          autoFocus
        />
      </div>

      <div className="bio-form__group">
        <label className="bio-form__label" htmlFor="interests-input">
          Areas of interest
        </label>
        <textarea
          id="interests-input"
          className="bio-form__interests"
          placeholder={INTERESTS_PLACEHOLDER}
          value={interests}
          onChange={handleInterestsChange}
        />
      </div>

      <div className="bio-form__footer">
        <span
          id="bio-char-count"
          className={`bio-form__char-count${hasContent ? ' bio-form__char-count--active' : ''}`}
          aria-live="polite"
        >
          {charsRemaining.toLocaleString()} characters remaining
        </span>
        <button
          type="submit"
          className="bio-form__submit"
          disabled={!isValid}
          aria-label={isValid ? 'Find matching opportunities' : `Enter at least ${MIN_BIO_LENGTH} characters to continue`}
        >
          Find opportunities
        </button>
      </div>
    </form>
  );
}
