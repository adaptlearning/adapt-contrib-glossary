import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';

const getCourse = content => {
  const [course] = content.filter(({ _type }) => _type === 'course');
  return course;
};

const getGlobals = content => {
  return getCourse(content)?._globals?._extensions?._glossary;
};

describe('Glossary - v2.0.3 to v2.1.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v2.0.3..v2.1.0

  let course;

  whereFromPlugin('Glossary - from v2.0.3', { name: 'adapt-contrib-glossary', version: '<2.1.0' });

  whereContent('Glossary - where configured', async (content) => {
    course = getCourse(content);
    if (course._glossary) return true;
  });

  mutateContent('Glossary - add _drawerOrder attribute', async (content) => {
    course._glossary._drawerOrder = 0;
    return true;
  });

  checkContent('Glossary - check _drawerOrder attribute', async (content) => {
    return course._glossary._drawerOrder === 0;
  });

  updatePlugin('Glossary - update to v2.1.0', { name: 'adapt-contrib-glossary', version: '2.1.0', framework: '">=2.2.0' });
});

describe('Glossary - v2.1.0 to v2.1.1', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v2.1.0..v2.1.1

  let course, courseGlossaryGlobals;

  whereFromPlugin('Glossary - from v2.1.0', { name: 'adapt-contrib-glossary', version: '<2.1.1' });

  mutateContent('Glossary - add globals if missing', async (content) => {
    course = getCourse(content);
    courseGlossaryGlobals = getGlobals(content);
    if (courseGlossaryGlobals) return true;
    course._globals._extensions = course._globals._extensions || {};
    courseGlossaryGlobals = course._globals._extensions._glossary = {};
    return true;
  });

  mutateContent('Glossary - add new globals', async (content) => {
    courseGlossaryGlobals.glossary = 'Glossary';
    return true;
  });

  mutateContent('Glossary - add attribute clearSearch', async (content) => {
    if (!course._glossary) return true;
    course._glossary.clearSearch = '';
    return true;
  });

  mutateContent('Glossary - add attribute searchItemsAlert', async (content) => {
    if (!course._glossary) return true;
    course._glossary.searchItemsAlert = '{{filteredItems.length}} found.';
    return true;
  });

  checkContent('Glossary - check new globals', async (content) => {
    return getGlobals(content).glossary === 'Glossary';
  });

  checkContent('Glossary - check attribute clearSearch', async (content) => {
    if (!course._glossary) return true;
    return course._glossary.clearSearch === '';
  });

  checkContent('Glossary - check attribute searchItemsAlert', async (content) => {
    if (!course._glossary) return true;
    return course._glossary.searchItemsAlert === '';
  });

  updatePlugin('Glossary - update to v2.1.1', { name: 'adapt-contrib-glossary', version: '2.1.1', framework: '">=2.2.5' });
});
