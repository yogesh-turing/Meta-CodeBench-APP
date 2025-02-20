const { parse } = require('node-html-parser');

function seoCheck(html_content) {
    try {
        const root = parse(html_content);
        
        // Check for HTML tag
        const htmlTag = root.querySelector('html');
        if (!htmlTag) {
            return "Invalid HTML structure.";
        }

        // Check for head and body tags
        const headTag = root.querySelector('head');
        const bodyTag = root.querySelector('body');
        
        if (!headTag || !bodyTag) {
            return "Invalid HTML structure.";
        }

        // Check if head and body are within HTML tag
        if (!htmlTag.querySelector('head') || !htmlTag.querySelector('body')) {
            return "Head and Body tag must be enclosed inside HTML tag.";
        }

        // Required tags to check in head
        const requiredTags = {
            'title': 'title',
            'favicon': 'link[rel="icon"]',
            'meta description': 'meta[name="description"]',
            'viewport meta': 'meta[name="viewport"]',
            'charset meta': 'meta[charset]',
            'meta keyword': 'meta[name="keywords"]'
        };

        const missingTags = [];

        // Check for each required tag
        for (const [tagName, selector] of Object.entries(requiredTags)) {
            const element = headTag.querySelector(selector);
            if (!element) {
                missingTags.push(tagName);
            }
        }

        // Return appropriate message based on missing tags
        if (missingTags.length > 0) {
            if (missingTags.length === 1) {
                return `${missingTags[0]} tag is missing.`;
            } else {
                return `${missingTags.join(', ')} tags are missing.`;
            }
        }

        return "Your HTML is SEO optimized.";
        
    } catch (error) {
        return "Invalid HTML structure.";
    }
}

module.exports = { seoCheck };