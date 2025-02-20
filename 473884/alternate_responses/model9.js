const { parse } = require('node-html-parser');

function seoCheck(html_content) {
  const root = parse(html_content);

  // Check for valid HTML structure
  const htmlTag = root.querySelector('html');
  if (!htmlTag) {
    return "Invalid HTML structure.";
  }

  const headTag = htmlTag.querySelector('head');
  const bodyTag = htmlTag.querySelector('body');
  if (!headTag || !bodyTag) {
    return "Invalid HTML structure.";
  }

  // Check if head and body tags are enclosed inside HTML tag
  if (htmlTag.querySelector('head') !== headTag || htmlTag.querySelector('body') !== bodyTag) {
    return "Head and Body tag must be enclosed inside HTML tag.";
  }

  // Check for required tags in head
  const requiredTags = [
    { selector: 'title', name: 'title' },
    { selector: 'link[rel="icon"]', name: 'favicon' },
    { selector: 'meta[name="description"]', name: 'meta description' },
    { selector: 'meta[name="viewport"]', name: 'viewport meta' },
    { selector: 'meta[charset]', name: 'charset meta' },
    { selector: 'meta[name="keywords"]', name: 'meta keyword' },
  ];

  const missingTags = requiredTags.filter(tag => !headTag.querySelector(tag.selector));

  if (missingTags.length > 0) {
    const missingTagNames = missingTags.map(tag => tag.name);
    return `${missingTagNames.join(', ')} tags are missing.`;
  }

  return "Your HTML is SEO optimized.";
}

module.exports = { seoCheck };