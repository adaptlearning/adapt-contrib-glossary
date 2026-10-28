import React from 'react';
import { classes, compile } from 'core/js/reactHelpers';

export default function GlossaryItem(props) {
  const {
    term,
    termAriaLabel,
    description,
    _isDescriptionOpen,
    onClick
  } = props;

  const ariaLabel = termAriaLabel || term;

  return (
    <>
      <button
        className={classes([
          'glossary__item-term drawer__item-btn js-glossary-item-term-click',
          _isDescriptionOpen && 'is-selected'
        ])}
        aria-expanded={Boolean(_isDescriptionOpen).toString()}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        <span className="glossary__item-term-title drawer__item-title">
          <span
            className="glossary__item-term-title-inner drawer__item-title-inner"
            dangerouslySetInnerHTML={{ __html: compile(term, props) }}
          />
        </span>
      </button>

      <div
        className="glossary__item-description js-glossary-item-description"
        role="region"
        aria-label={ariaLabel}
      >
        <div
          className="glossary__item-description-inner"
          dangerouslySetInnerHTML={{ __html: compile(description, props) }}
        />
      </div>
    </>
  );
}
