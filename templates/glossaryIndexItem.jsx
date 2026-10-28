import Adapt from 'core/js/adapt';
import React from 'react';

export default function GlossaryIndexItem(props) {
  const _globals = Adapt.course.get('_globals');
  const {
    _key,
    onClick
  } = props;

  return (
    <div className="glossary__index-item" role="listitem">
      <a
        href={`#${_key}`}
        className="glossary__index-link js-glossary-index-link"
        aria-label={`${_globals._extensions._glossary.labelLink} ${_key}`}
        onClick={onClick}
      >
        {_key}
      </a>
    </div>
  );
}
