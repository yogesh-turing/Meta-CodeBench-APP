const { parse } = require('node-html-parser');

function seoCheck(html_content) {
    try {
        const root = parse(html_content);
        
        // Check for basic HTML structure
        const htmlTag = root.querySelector('html');
        if (!htmlTag) {
            return "Invalid HTML structure.";
        }

        const headTag = root.querySelector('head');
        const bodyTag = root.querySelector('body');
        
        if (!headTag || !bodyTag) {
            return "Invalid HTML structure.";
        }

        // Check if head and body are within HTML tag
        if (!htmlTag.querySelector('head') || !htmlTag.querySelector('body')) {
            return "Head and Body tag must be enclosed inside HTML tag.";
        }

        // Check for required tags in head
        const missingTags = [];

        // Check title
        if (!headTag.querySelector('title')) {
            missingTags.push('title');
        }

        // Check favicon
        if (!headTag.querySelector('link[rel="icon"]')) {
            missingTags.push('favicon');
        }

        // Check meta description
        if (!headTag.querySelector('meta[name="description"]')) {
            missingTags.push('meta description');
        }

        // Check viewport meta
        if (!headTag.querySelector('meta[name="viewport"]')) {
            missingTags.push('viewport meta');
        }

        // Check charset meta
        if (!headTag.querySelector('meta[charset]')) {
            missingTags.push('charset meta');
        }

        // Check keywords meta
        if (!headTag.querySelector('meta[name="keywords"]')) {
            missingTags.push('meta keyword');
        }

        // Generate appropriate message based on missing tags
        if (missingTags.length > 0) {
            if (missingTags.length === 1) {
                return `${missingTags[0]} tag is missing.`;
            } else {
                const lastTag = missingTags.pop();
                return `${missingTags.join(', ')}, ${lastTag} tags are missing.`;
            }
        }

        return "Your HTML is SEO optimized.";
    } catch (error) {
        return "Invalid HTML structure.";
    }
}

module.exports = { seoCheck };