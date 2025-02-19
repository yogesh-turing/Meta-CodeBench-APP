const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
    // Validate HTML code format
    if (typeof htmlCode !== 'string') {
        throw new Error('Invalid HTML Code');
    }

    // Remove leading/trailing whitespace
    const trimmedHtml = htmlCode.trim();

    // Check for triple backticks and html markdown
    if (!trimmedHtml.startsWith('```html') || !trimmedHtml.endsWith('```')) {
        throw new Error('Invalid HTML Code');
    }

    // Extract actual HTML content
    const actualHtml = trimmedHtml
        .substring(7, trimmedHtml.length - 3)
        .trim();

    // Validate target parameter
    if (typeof target !== 'string') {
        throw new Error('Invalid class name or id');
    }

    // Create DOM
    const dom = new JSDOM(actualHtml);
    const { document } = dom.window;

    // Check if body tag exists and is the root of valid elements
    const body = document.querySelector('body');
    if (!body || document.body !== body) {
        throw new Error('Invalid Dom structure');
    }

    // Validate DOM structure
    function validateDomStructure(node) {
        const validTags = ['BODY', 'SELECT', 'UL', 'LI', 'INPUT', 'OPTION'];
        
        // Check text nodes or document node
        if (node.nodeType === 3 || node.nodeType === 9) return true;
        
        // Check if current tag is valid
        if (!validTags.includes(node.tagName)) {
            return false;
        }

        // If it's an input, verify it's a text input
        if (node.tagName === 'INPUT' && node.getAttribute('type') !== 'text') {
            return false;
        }

        // Recursively check all child nodes
        for (const child of node.childNodes) {
            if (!validateDomStructure(child)) {
                return false;
            }
        }
        return true;
    }

    if (!validateDomStructure(body)) {
        throw new Error('Invalid Dom structure');
    }

    // Find target element
    const element = document.querySelector(`#${target}`) || document.querySelector(`.${target}`);
    if (!element) {
        throw new Error('Element not found');
    }

    function getChildrenValues(element) {
        let values = [];

        if (element.tagName === 'SELECT') {
            values = Array.from(element.querySelectorAll('option'))
                .map(opt => opt.value);
        } else if (element.tagName === 'UL') {
            values = Array.from(element.querySelectorAll('li'))
                .map(li => li.textContent.trim());
        } else if (element.tagName === 'INPUT' && element.type === 'text') {
            values = [element.placeholder || 'input'];
        } else {
            // For container elements, get values from all valid child elements
            element.querySelectorAll('*').forEach(child => {
                if (child.tagName === 'SELECT') {
                    values.push(...Array.from(child.querySelectorAll('option'))
                        .map(opt => opt.value));
                } else if (child.tagName === 'UL') {
                    values.push(...Array.from(child.querySelectorAll('li'))
                        .map(li => li.textContent.trim()));
                } else if (child.tagName === 'INPUT' && child.type === 'text') {
                    values.push(child.placeholder || 'input');
                }
            });
        }

        return values;
    }

    const values = getChildrenValues(element);
    return values.sort();
}

module.exports = { webScrapper };