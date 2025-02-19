const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
    // Validate HTML code format
    if (typeof htmlCode !== 'string' || typeof target !== 'string') {
        throw new Error(typeof htmlCode !== 'string' ? 'Invalid HTML Code' : 'Invalid class name or id');
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

    // Create DOM
    const dom = new JSDOM(actualHtml);
    const { document } = dom.window;

    // Validate DOM structure
    function validateDomStructure() {
        // Check if content is wrapped in body tag
        const body = document.querySelector('body');
        if (!body || document.body !== body) {
            throw new Error('Invalid Dom structure');
        }

        // Get all elements
        const allElements = document.getElementsByTagName('*');
        const validTags = new Set(['BODY', 'SELECT', 'OPTION', 'UL', 'LI', 'INPUT']);

        // Check for invalid tags
        for (const element of allElements) {
            if (!validTags.has(element.tagName)) {
                throw new Error('Invalid Dom structure');
            }
            // Validate input type
            if (element.tagName === 'INPUT' && element.getAttribute('type') !== 'text') {
                throw new Error('Invalid Dom structure');
            }
        }

        // Check for elements outside body
        const htmlContent = document.documentElement.innerHTML;
        const bodyContent = body.outerHTML;
        const cleanHtml = htmlContent.replace(bodyContent, '').trim();
        if (cleanHtml) {
            throw new Error('Invalid Dom structure');
        }
    }

    // Validate DOM structure
    validateDomStructure();

    function getChildrenValues(element) {
        let values = [];

        // Handle direct element types
        if (element.tagName === 'SELECT') {
            values = Array.from(element.querySelectorAll('option')).map(opt => opt.value);
        } else if (element.tagName === 'UL') {
            values = Array.from(element.querySelectorAll('li')).map(li => li.textContent.trim());
        } else if (element.tagName === 'INPUT' && element.type === 'text') {
            values = [element.placeholder || 'input'];
        } else {
            // Handle nested elements
            const children = element.getElementsByTagName('*');
            for (const child of children) {
                if (child.tagName === 'SELECT') {
                    values.push(...Array.from(child.querySelectorAll('option')).map(opt => opt.value));
                } else if (child.tagName === 'UL') {
                    values.push(...Array.from(child.querySelectorAll('li')).map(li => li.textContent.trim()));
                } else if (child.tagName === 'INPUT' && child.type === 'text') {
                    values.push(child.placeholder || 'input');
                }
            }
        }

        return values;
    }

    // Find target element
    const element = document.querySelector(`#${target}`) || document.querySelector(`.${target}`);
    if (!element) {
        throw new Error('Element not found');
    }

    // Get and sort values
    const values = getChildrenValues(element);
    return values.sort();
}

module.exports = { webScrapper };