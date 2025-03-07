import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Glossary - v2.1.3 to v3.0.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v2.1.3..v3.0.0

  let course, courseGlossaryGlobals;

  whereFromPlugin('Glossary - from v2.1.3', { name: 'adapt-contrib-glossary', version: '<3.0.0' });

  whereContent('Glossary - where configured', async (content) => {
    course = getCourse();
    return course._glossary;
  });

  mutateContent('Glossary - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._glossary')) _.set(course, '_globals._extensions._glossary', {});
    courseGlossaryGlobals = course._globals._extensions._glossary;
    return true;
  });

  mutateContent('Glossary - add global attribute labelLink', async (content) => {
    courseGlossaryGlobals.labelLink = 'Terms beginning with';
    return true;
  });

  mutateContent('Glossary - add global attribute labelNavigation', async (content) => {
    courseGlossaryGlobals.labelNavigation = 'Glossary navigation';
    return true;
  });

  mutateContent('Glossary - change default title', async (content) => {
    if (course._glossary.title !== '') return true;
    course._glossary.title = 'Glossary';
    return true;
  });

  mutateContent('Glossary - change default description', async (content) => {
    if (course._glossary.description === '') course._glossary.description = 'Select here to view the glossary for this course';
    return true;
  });

  mutateContent('Glossary - change default clearSearch', async (content) => {
    if (course._glossary.clearSearch !== '') return true;
    course._glossary.clearSearch = 'Clear search';
    return true;
  });

  mutateContent('Glossary - change default searchItemsAlert', async (content) => {
    if (course._glossary.searchItemsAlert !== '{{filteredItems.length}} found.') return true;
    course._glossary.searchItemsAlert = '{{filteredItems.length}} found';
    return true;
  });

  mutateContent('Glossary - change default searchPlaceholder', async (content) => {
    if (course._glossary.searchPlaceholder !== '') return true;
    course._glossary.searchPlaceholder = 'Search';
    return true;
  });

  mutateContent('Glossary - change default searchWithInDescriptionLabel', async (content) => {
    if (course._glossary.searchWithInDescriptionLabel !== '') return true;
    course._glossary.searchWithInDescriptionLabel = 'Search within Description';
    return true;
  });

  mutateContent('Glossary - add attribute _isSearchEnabled', async (content) => {
    course._glossary._isSearchEnabled = true;
    return true;
  });

  mutateContent('Glossary - add attribute _isIndexEnabled', async (content) => {
    course._glossary._isIndexEnabled = false;
    return true;
  });

  mutateContent('Glossary - add attribute _isGroupHeadersEnabled', async (content) => {
    course._glossary._isGroupHeadersEnabled = false;
    return true;
  });

  checkContent('Glossary - check global attribute labelLink', async (content) => {
    const isValid = courseGlossaryGlobals.labelLink === 'Terms beginning with';
    if (!isValid) throw new Error('Glossary - global attribute labelLink');
    return true;
  });

  checkContent('Glossary - check global attribute labelNavigation', async (content) => {
    const isValid = courseGlossaryGlobals.labelNavigation === 'Glossary navigation';
    if (!isValid) throw new Error('Glossary - global attribute labelNavigation');
    return true;
  });

  checkContent('Glossary - check course attribute title', async (content) => {
    const isValid = course._glossary.title !== '';
    if (!isValid) throw new Error('Glossary - course attribute title');
    return true;
  });

  checkContent('Glossary - check course attribute description', async (content) => {
    const isValid = course._glossary.description !== '';
    if (!isValid) throw new Error('Glossary - course attribute description');
    return true;
  });

  checkContent('Glossary - check default clearSearch', async (content) => {
    const isValid = course._glossary.clearSearch !== '';
    if (!isValid) throw new Error('Glossary - course attribute clearSearch');
    return true;
  });

  checkContent('Glossary - check default searchItemsAlert', async (content) => {
    const isValid = course._glossary.searchItemsAlert !== '{{filteredItems.length}} found.';
    if (!isValid) throw new Error('Glossary - course attribute searchItemsAlert');
    return true;
  });

  checkContent('Glossary - check default searchPlaceholder', async (content) => {
    const isValid = course._glossary.searchPlaceholder !== '';
    if (!isValid) throw new Error('Glossary - course attribute searchPlaceholder');
    return true;
  });

  checkContent('Glossary - check default searchWithInDescriptionLabel', async (content) => {
    const isValid = course._glossary.searchWithInDescriptionLabel !== '';
    if (!isValid) throw new Error('Glossary - course attribute searchWithInDescriptionLabel');
    return true;
  });

  checkContent('Glossary - check attribute _isSearchEnabled', async (content) => {
    const isValid = course._glossary._isSearchEnabled === true;
    if (!isValid) throw new Error('Glossary - course attribute _isSearchEnabled');
    return true;
  });

  checkContent('Glossary - check attribute _isIndexEnabled', async (content) => {
    const isValid = course._glossary._isIndexEnabled === false;
    if (!isValid) throw new Error('Glossary - course attribute _isIndexEnabled');
    return true;
  });

  checkContent('Glossary - check attribute _isGroupHeadersEnabled', async (content) => {
    const isValid = course._glossary._isGroupHeadersEnabled === false;
    if (!isValid) throw new Error('Glossary - course attribute _isGroupHeadersEnabled');
    return true;
  });

  updatePlugin('Glossary - update to v3.0.0', { name: 'adapt-contrib-glossary', version: '3.0.0', framework: '">=5' });

  testSuccessWhere('glossary with empty course._glossary no globals', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.3' }],
    content: [
      { _type: 'course', _glossary: {} }
    ]
  });

  testSuccessWhere('glossary with empty course._glossary with globals', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.3' }],
    content: [
      { _type: 'course', _glossary: {}, _globals: { _extensions: { _glossary: {} } } }
    ]
  });

  testSuccessWhere('glossary with default course._glossary no globals', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.3' }],
    content: [
      {
        _type: 'course',
        _glossary: {
          title: '',
          description: '',
          clearSearch: '',
          searchItemsAlert: '{{filteredItems.length}} found.',
          searchPlaceholder: '',
          searchWithInDescriptionLabel: ''
        }
      }
    ]
  });

  testSuccessWhere('glossary with custom course._glossary no globals', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.3' }],
    content: [
      {
        _type: 'course',
        _glossary: {
          title: 'custom title',
          description: 'custom description',
          clearSearch: 'custom clearSearch',
          searchItemsAlert: 'custom searchItemsAlert',
          searchPlaceholder: 'custom searchPlaceholder',
          searchWithInDescriptionLabel: 'custom searchWithInDescriptionLabel'
        }
      }
    ]
  });

  testStopWhere('glossary with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.3' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '3.0.0' }]
  });
});
