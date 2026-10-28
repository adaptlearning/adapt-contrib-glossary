import Adapt from 'core/js/adapt';
import React from 'react';
import { classes, templates } from 'core/js/reactHelpers';

export default function Glossary(props) {
  const _globals = Adapt.course.get('_globals');
  const {
    _isSearchEnabled,
    _isIndexEnabled,
    _hasSearchText,
    _isItemNotFoundVisible,
    _indexKeys,
    searchPlaceholder,
    clearSearch,
    searchWithInDescriptionLabel,
    itemNotFoundMessage,
    searchAlert,
    onSearchChange,
    onCancelClick,
    onIndexLinkClick
  } = props;

  return (
    <div className="glossary__inner js-glossary-inner">
      <div
        className="aria-label"
        dangerouslySetInnerHTML={{ __html: _globals._extensions._glossary.glossary }}
      />

      <div className="glossary__header">
        <div className="glossary__header-inner">

          {_isSearchEnabled &&
          <div className="glossary__search-container js-glossary-search-container">
            <div className="glossary__textbox-container">

              <input
                className="glossary__textbox js-glossary-textbox-change"
                id="glossarySearch"
                type="text"
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                onKeyUp={onSearchChange}
                onInput={onSearchChange}
                onPaste={onSearchChange}
              />

              <div
                className={classes([
                  'label-icon glossary__search-icon js-glossary-search-icon',
                  _hasSearchText && 'u-display-none'
                ])}
              >
                <div className="icon" aria-hidden="true" />
              </div>

              <button
                className={classes([
                  'btn-icon glossary__cancel-btn',
                  !_hasSearchText && 'u-display-none',
                  'js-glossary-cancel-btn-click'
                ])}
                tabIndex="0"
                aria-label={clearSearch}
                onClick={onCancelClick}
              >
                <span className="icon" aria-hidden="true" />
              </button>
            </div>

            <div className="glossary__checkbox-container">
              <input
                className="glossary__checkbox-input js-glossary-checkbox-change"
                id="glossaryCheckbox"
                type="checkbox"
                onChange={onSearchChange}
              />
              <label
                className="glossary__checkbox-label"
                htmlFor="glossaryCheckbox"
                dangerouslySetInnerHTML={{ __html: searchWithInDescriptionLabel }}
              />
            </div>

          </div>
          }

          {_isIndexEnabled &&
          <div
            className={classes([
              'glossary__index-container js-glossary-index-container',
              _hasSearchText && 'u-display-none'
            ])}
            role="navigation"
            aria-label={_globals._extensions._glossary.labelNavigation}
          >
            {_indexKeys.map(key =>
              <templates.glossaryIndexItem
                key={key}
                _key={key}
                onClick={onIndexLinkClick}
              />
            )}
          </div>
          }

        </div>
      </div>

      {/* Glossary item views are appended here by GlossaryView */}
      <div className="glossary__items-container js-glossary-items-container" role="list" />

      <div
        className={classes([
          'glossary__item-not-found js-glossary-item-not-found',
          !_isItemNotFoundVisible && 'u-display-none'
        ])}
      >
        <div
          className="glossary__item-not-found-inner"
          dangerouslySetInnerHTML={{ __html: itemNotFoundMessage }}
        />
      </div>

      <div
        className="glossary__alert js-glossary-alert aria-label"
        aria-live="polite"
        aria-atomic="true"
        dangerouslySetInnerHTML={{ __html: searchAlert }}
      />

    </div>
  );
}
