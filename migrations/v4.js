import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';

const getCourse = content => {
  const [course] = content.filter(({ _type }) => _type === 'course');
  return course;
};

describe('Glossary - v4.3.1 to v4.4.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v4.3.1..v4.4.0

  let course;

  whereFromPlugin('Glossary - from v4.3.1', { name: 'adapt-contrib-glossary', version: '<4.4.0' });

  whereContent('Glossary has items', async content => {
    course = getCourse(content);
    return course._glossary?._items?.length > 0;
  });

  mutateContent('Glossary - add attribute termAriaLabel', async (content) => {
    course._glossary._items.forEach(item => (item.termAriaLabel = ''));
    return true;
  });

  checkContent('Glossary - check attribute termAriaLabel', async (content) => {
    return course._glossary._items.every(item => item.termAriaLabel === '');
  });

  updatePlugin('Glossary - update to v4.4.0', { name: 'adapt-contrib-glossary', version: '4.4.0', framework: '">=5.19.1' });
});
