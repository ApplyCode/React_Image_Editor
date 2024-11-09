/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'namespace-pixie-styles',
    Rule(rule, postcss) {
      if (!rule.selectors) {
        return rule;
      }

      rule.selectors = rule.selectors.map(function (selector) {
        if (selector.trim().length === 0) {
          return selector;
        }
        console.log('selector', selector)
        if (['html', 'body'].includes(selector)) {
          return null;
        }
        if('#editor-container#editor-container#editor-container' == selector) {
          return selector;
        }
        return `#editor-container#editor-container#editor-container ${selector}`;
      });
      return rule;
    },
  };
};

module.exports.postcss = true;
