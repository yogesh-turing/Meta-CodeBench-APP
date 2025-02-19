const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
    // Validate HTML code format
    if (typeof htmlCode !== 'string' || typeof target !== 'string') {
        throw new Error(typeof htmlCode !== 'string' ? 'Invalid HTML Code' : 'Invalid class name or id');
    }

    // Remove trailing whitespace and validate triple backticks format
    const trimmedHtml = htmlCode.trim();
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
    const body = document.querySelector('body');
    if (!body) {
        throw new Error('Invalid Dom structure');
    }

    // Check for elements outside body
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        const bodyIndex = Array.from(htmlElement.children).indexOf(body);
        for (let i = 0; i < bodyIndex; i++) {
            if (htmlElement.children[i].tagName.toLowerCase() !== 'head') {
                throw new Error('Invalid Dom structure');
            }
        }
    }

    // Validate tags
    const allElements = document.getElementsByTagName('*');
    const validTags = new Set(['BODY', 'SELECT', 'OPTION', 'UL', 'LI', 'INPUT']);
    
    for (const element of allElements) {
        if (!validTags.has(element.tagName)) {
            throw new Error('Invalid Dom structure');
        }
        if (element.tagName === 'INPUT' && element.getAttribute('type') !== 'text') {
            throw new Error('Invalid Dom structure');
        }
    }

    // Find target element
    const element = document.querySelector(`#${target}`) || document.querySelector(`.${target}`);
    if (!element) {
        throw new Error('Element not found');
    }

    function getChildrenValues(element) {
        let values = [];

        // Handle direct element values
        if (element.tagName === 'SELECT') {
            values = Array.from(element.querySelectorAll('option')).map(opt => opt.value);
        } else if (element.tagName === 'UL') {
            values = Array.from(element.querySelectorAll('li')).map(li => li.textContent.trim());
        } else if (element.tagName === 'INPUT' && element.type === 'text') {
            values = [element.placeholder || 'input'];
        }

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

        return values;
    }

    const values = getChildrenValues(element);
    return values.sort();
}

module.exports = { webScrapper };