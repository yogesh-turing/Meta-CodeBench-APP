const { parse } = require('node-html-parser');

function seoCheck(html_content) {
  const root = parse(html_content);

  // Check for valid HTML structure
  if (!root.querySelector('html') || !root.querySelector('head') || !root.querySelector('body')) {
    return 'Invalid HTML structure.';
  }

  if (!root.querySelector('html').querySelector('head') || !root.querySelector('html').querySelector('body')) {
    return 'Head and Body tag must be enclosed inside HTML tag.';
  }

  // Check for required tags in head
  const head = root.querySelector('head');
  const requiredTags = ['title', 'link[rel="icon"]', 'meta[name="description"]', 'meta[name="viewport"]', 'meta[charset]', 'meta[name="keywords"]'];
  const missingTags = requiredTags.filter(tag => !head.querySelector(tag));

  if (missingTags.length > 0) {
    const missingTagsString = missingTags.map(tag => {
      switch (tag) {
        case 'link[rel="icon"]':
          return 'favicon';
        case 'meta[name="description"]':
          return 'meta description';
        case 'meta[name="viewport"]':
          return 'viewport meta';
        case 'meta[charset]':
          return 'charset meta';
        case 'meta[name="keywords"]':
          return 'meta keyword';
        default:
          return tag;
      }
    }).join(', ');

    return `${missingTagsString} tag${missingTags.length > 1 ? 's' : ''} is missing.`;
  }

  return 'Your HTML is SEO optimized.';
}

module.exports = { seoCheck };