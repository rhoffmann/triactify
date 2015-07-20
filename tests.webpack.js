// prepared for flux testing
var Immutable = require('immutable');

require('babel-core/polyfill') // for phantomJS ES5

// Create a Webpack require context so we can dynamically require our
// project's modules. Exclude test files in this context.
var projectContext = require.context('./src', true, /^((?!__tests__).)*.jsx?$/);
// Extract the module ids that Webpack uses to track modules.
var projectModuleIds = Immutable.Set(
    projectContext.keys().map(module => (
      String(projectContext.resolve(module))
    ))
  );

beforeEach(() => {
  /**
   * Clear the module cache before each test. Many of our modules, such as
   * Stores and Actions, are singletons that have state that we don't want to
   * carry over between tests. Clearing the cache makes `require(module)`
   * return a new instance of the singletons. Modules are still cached within
   * each test case.
   */
  var cache = require.cache;
  projectModuleIds.forEach(id => delete cache[id]);

  /**
   * Automatically mock the built in setTimeout and setInterval functions.
   */
  jasmine.clock().install();
});

afterEach(() => {
  jasmine.clock().uninstall();
});

/**
 * Load each test using webpack's dynamic require with contexts.
 */
var context = require.context('./src', true, /_spec\.js?$/);
context.keys().forEach(context);
