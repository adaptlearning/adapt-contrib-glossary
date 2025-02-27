import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';

describe('Glossary - v4.3.1 to v4.4.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v4.3.1..v4.4.0

  let course;

  whereFromPlugin('Glossary - from v4.3.1', { name: 'adapt-contrib-glossary', version: '<4.4.0' });

  whereContent('Glossary has items', async content => {
    course = getCourse();
    return course._glossary?._glossaryItems?.length;
  });

  mutateContent('Glossary - add item attribute termAriaLabel', async (content) => {
    course._glossary._glossaryItems.forEach(item => (item.termAriaLabel = ''));
    return true;
  });

  checkContent('Glossary - check item attribute termAriaLabel', async (content) => {
    const isValid = course._glossary._glossaryItems.every(item => item.termAriaLabel === '');
    if (!isValid) throw new Error('Glossary - item attribute termAriaLabel');
    return true;
  });

  updatePlugin('Glossary - update to v4.4.0', { name: 'adapt-contrib-glossary', version: '4.4.0', framework: '">=5.19.1' });

  testSuccessWhere('glossary with course._glossary._glossaryItems', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '4.3.1' }],
    content: [
      { _type: 'course', _glossary: { _glossaryItems: [ { term: 'glossary item' } ] } }
    ]
  });

  testStopWhere('glossary with course._glossary and empty glossaryItems', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '4.3.1' }],
    content: [
      { _type: 'course', _glossary: { _glossaryItems: [] } }
    ]
  });

  testStopWhere('glossary with course._glossary no items', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '4.3.1' }],
    content: [
      { _type: 'course', _glossary: {} }
    ]
  });

  testStopWhere('glossary with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '4.3.1' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '4.4.0' }]
  });
});
