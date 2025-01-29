import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';

const getCourse = content => {
  const [course] = content.filter(({ _type }) => _type === 'course');
  return course;
};

const getGlobals = content => {
  return getCourse(content)?._globals?._extensions?._glossary;
};

describe('Glossary - v2.1.3 to v3.0.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v2.1.3..v3.0.0

  let course, courseGlossaryGlobals;

  whereFromPlugin('Glossary - from v2.1.3', { name: 'adapt-contrib-glossary', version: '<3.0.0' });

  mutateContent('Glossary - add globals if missing', async (content) => {
    course = getCourse(content);
    courseGlossaryGlobals = getGlobals(content);
    if (courseGlossaryGlobals) return true;
    course._globals._extensions = course._globals._extensions || {};
    courseGlossaryGlobals = course._globals._extensions._glossary = {};
    return true;
  });

  mutateContent('Glossary - add new globals', async (content) => {
    courseGlossaryGlobals.labelLink = 'Terms beginning with';
    courseGlossaryGlobals.labelNavigation = 'Glossary navigation';
    return true;
  });

  mutateContent('Glossary - change default title', async (content) => {
    if (course._glossary?.title !== '') return true;
    course._glossary.title = 'Glossary';
    return true;
  });

  mutateContent('Glossary - change default description', async (content) => {
    if (course._glossary?.description !== '') return true;
    course._glossary.description = 'Select here to view the glossary for this course';
    return true;
  });

  mutateContent('Glossary - change default clearSearch', async (content) => {
    if (course._glossary?.clearSearch !== '') return true;
    course._glossary.clearSearch = 'Clear search';
    return true;
  });

  mutateContent('Glossary - change default searchItemsAlert', async (content) => {
    if (course._glossary?.searchItemsAlert !== '{{filteredItems.length}} found.') return true;
    course._glossary.searchItemsAlert = '{{filteredItems.length}} found';
    return true;
  });

  mutateContent('Glossary - change default searchPlaceholder', async (content) => {
    if (course._glossary?.searchPlaceholder !== '') return true;
    course._glossary.searchPlaceholder = 'Search';
    return true;
  });

  mutateContent('Glossary - change default searchWithInDescriptionLabel', async (content) => {
    if (course._glossary?.searchWithInDescriptionLabel !== '') return true;
    course._glossary.searchWithInDescriptionLabel = 'Search within Description';
    return true;
  });

  mutateContent('Glossary - add attribute _isSearchEnabled', async (content) => {
    if (!course._glossary) return true;
    course._glossary._isSearchEnabled = true;
    return true;
  });

  mutateContent('Glossary - add attribute _isIndexEnabled', async (content) => {
    if (!course._glossary) return true;
    course._glossary._isIndexEnabled = false;
    return true;
  });

  mutateContent('Glossary - add attribute _isGroupHeadersEnabled', async (content) => {
    if (!course._glossary) return true;
    course._glossary._isGroupHeadersEnabled = false;
    return true;
  });

  checkContent('Glossary - check new globals', async (content) => {
    return (
      getGlobals(content).labelLink === 'Terms beginning with' &&
      getGlobals(content).labelNavigation === 'Glossary navigation'
    );
  });

  checkContent('Glossary - check default title', async (content) => {
    return course._glossary?.title !== '';
  });

  checkContent('Glossary - check default description', async (content) => {
    return course._glossary?.description !== '';
  });

  checkContent('Glossary - check default clearSearch', async (content) => {
    return course._glossary?.clearSearch !== '';
  });

  checkContent('Glossary - check default searchItemsAlert', async (content) => {
    return course._glossary?.searchItemsAlert !== '{{filteredItems.length}} found.';
  });

  checkContent('Glossary - check default searchPlaceholder', async (content) => {
    return course._glossary?.searchPlaceholder !== '';
  });

  checkContent('Glossary - check default searchWithInDescriptionLabel', async (content) => {
    return course._glossary?.searchWithInDescriptionLabel !== '';
  });

  checkContent('Glossary - check attribute _isSearchEnabled', async (content) => {
    return (
      !course._glossary ||
      course._glossary._isSearchEnabled === true
    );
  });

  checkContent('Glossary - check attribute _isIndexEnabled', async (content) => {
    return (
      !course._glossary ||
      course._glossary._isIndexEnabled === false
    );
  });

  checkContent('Glossary - check attribute _isGroupHeadersEnabled', async (content) => {
    return (
      !course._glossary ||
      course._glossary._isGroupHeadersEnabled === false
    );
  });

  updatePlugin('Glossary - update to v3.0.0', { name: 'adapt-contrib-glossary', version: '3.0.0', framework: '">=5' });
});
