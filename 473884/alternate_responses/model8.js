const { parse } = require('node-html-parser');

function seoCheck(html_content) {
    try {
        const root = parse(html_content);
        const htmlTag = root.querySelector('html');
        if (!htmlTag) {
            return "Invalid HTML structure.";
        }
        const headTag = htmlTag.querySelector('head');
        const bodyTag = htmlTag.querySelector('body');
        if (!headTag || !bodyTag) {
            return "Invalid HTML structure.";
        }
        if (headTag.parentNode !== htmlTag || bodyTag.parentNode !== htmlTag) {
            return "Head and Body tag must be enclosed inside HTML tag.";
        }
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
            if (missingTagNames.length === 1) {
                return `${missingTagNames[0]} tag is missing.`;
            } else {
                return `${missingTagNames.join(', ')} tags are missing.`;
            }
        }
        return "Your HTML is SEO optimized.";
    } catch (error) {
        return "Invalid HTML structure.";
    }
}

module.exports = { seoCheck }