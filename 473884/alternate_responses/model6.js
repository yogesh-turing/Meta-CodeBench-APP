const { parse } = require('node-html-parser');

function seoCheck(html_content) {
  const root = parse(html_content);
  const html = root.querySelector('html');
  if (!html) {
    return 'Invalid HTML structure.';
  }
  const head = html.querySelector('head');
  const body = html.querySelector('body');
  if (!head || !body) {
    return 'Invalid HTML structure.';
  }
  if (head.parentNode !== html || body.parentNode !== html) {
    return 'Head and Body tag must be enclosed inside HTML tag.';
  }
  const missingTags = [];
  if (!head.querySelector('title')) {
    missingTags.push('title');
  }
  if (!head.querySelector('link[rel="icon"]')) {
    missingTags.push('favicon');
  }
  if (!head.querySelector('meta[name="description"]')) {
    missingTags.push('meta description');
  }
  if (!head.querySelector('meta[name="viewport"]')) {
    missingTags.push('viewport meta');
  }
  if (!head.querySelector('meta[charset]')) {
    missingTags.push('charset meta');
  }
  if (!head.querySelector('meta[name="keywords"]')) {
    missingTags.push('meta keyword');
  }
  if (missingTags.length > 0) {
    return `${missingTags.join(', ')} tags are missing.`;
  }
  return 'Your HTML is SEO optimized.';
}

module.exports = { seoCheck };