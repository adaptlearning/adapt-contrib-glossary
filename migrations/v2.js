import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Glossary - v2.0.3 to v2.1.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v2.0.3..v2.1.0

  let course;

  whereFromPlugin('Glossary - from v2.0.3', { name: 'adapt-contrib-glossary', version: '>=2.0.0 <2.1.0' });

  whereContent('Glossary - where configured', async (content) => {
    course = getCourse();
    return course._glossary;
  });

  mutateContent('Glossary - add course attribute _drawerOrder', async (content) => {
    course._glossary._drawerOrder = 0;
    return true;
  });

  checkContent('Glossary - check course attribute _drawerOrder', async (content) => {
    const isValid = course._glossary._drawerOrder === 0;
    if (!isValid) throw new Error('Glossary - course attribute _drawerOrder');
    return true;
  });

  updatePlugin('Glossary - update to v2.1.0', { name: 'adapt-contrib-glossary', version: '2.1.0', framework: '">=2.2.0' });

  testSuccessWhere('glossary with course._glossary', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.0.3' }],
    content: [
      { _type: 'course', _glossary: {} }
    ]
  });

  testStopWhere('glossary with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.0.3' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.0' }]
  });
});

describe('Glossary - v2.1.0 to v2.1.1', async () => {
  // https://github.com/adaptlearning/adapt-contrib-glossary/compare/v2.1.0..v2.1.1

  let course, courseGlossaryGlobals;

  whereFromPlugin('Glossary - from v2.1.0', { name: 'adapt-contrib-glossary', version: '<2.1.1' });

  whereContent('Glossary - where configured', async (content) => {
    course = getCourse();
    return course._glossary;
  });

  mutateContent('Glossary - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._glossary')) _.set(course, '_globals._extensions._glossary', {});
    courseGlossaryGlobals = course._globals._extensions._glossary;
    return true;
  });

  mutateContent('Glossary - add global attribute glossary', async (content) => {
    courseGlossaryGlobals.glossary = 'Glossary';
    return true;
  });

  mutateContent('Glossary - add course attribute clearSearch', async (content) => {
    course._glossary.clearSearch = '';
    return true;
  });

  mutateContent('Glossary - add course attribute searchItemsAlert', async (content) => {
    course._glossary.searchItemsAlert = '{{filteredItems.length}} found.';
    return true;
  });

  checkContent('Glossary - check global attribute glossary', async (content) => {
    const isValid = courseGlossaryGlobals.glossary === 'Glossary';
    if (!isValid) throw new Error('Glossary - global attribute glossary');
    return true;
  });

  checkContent('Glossary - check course attribute clearSearch', async (content) => {
    const isValid = course._glossary.clearSearch === '';
    if (!isValid) throw new Error('Glossary - course attribute clearSearch');
    return true;
  });

  checkContent('Glossary - check course attribute searchItemsAlert', async (content) => {
    const isValid = course._glossary.searchItemsAlert === '{{filteredItems.length}} found.';
    if (!isValid) throw new Error('Glossary - course attribute searchItemsAlert');
    return true;
  });

  updatePlugin('Glossary - update to v2.1.1', { name: 'adapt-contrib-glossary', version: '2.1.1', framework: '">=2.2.5' });

  testSuccessWhere('glossary with course._glossary no globals', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.0' }],
    content: [
      { _type: 'course', _glossary: {} }
    ]
  });

  testSuccessWhere('glossary with course._glossary and globals', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.0' }],
    content: [
      { _type: 'course', _glossary: {}, _globals: { _extensions: { _glossary: {} } } }
    ]
  });

  testStopWhere('glossary with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.0' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-glossary', version: '2.1.1' }]
  });
});
