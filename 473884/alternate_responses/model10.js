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
    if (headTag.parentNode.tagName !== 'HTML' || bodyTag.parentNode.tagName !== 'HTML') {
        return "Head and Body tag must be enclosed inside HTML tag.";
    }

    // Check for required tags in head
    const requiredTags = ['title', 'link[rel="icon"]', 'meta[name="description"]', 'meta[name="viewport"]', 'meta[charset]', 'meta[name="keywords"]'];
    const missingTags = [];

    requiredTags.forEach(tag => {
        if (!headTag.querySelector(tag)) {
            missingTags.push(tag.replace(/.*\[(.*)\]/, '$1').replace(/.*\="(.*)"/, '$1'));
        }
    });

    if (missingTags.length > 0) {
        return `${missingTags.join(', ')} tag${missingTags.length > 1 ? 's' : ''} is missing.`;
    }

    return "Your HTML is SEO optimized.";
}

module.exports = { seoCheck };