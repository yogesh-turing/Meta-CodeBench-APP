const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
    // Remove trailing white spaces and check for valid html code
    htmlCode = htmlCode.trim();
    if (!htmlCode.startsWith('```html') || !htmlCode.endsWith('```')) {
        throw new Error('Invalid HTML Code');
    }
    htmlCode = htmlCode.replace(/^```html/, '').replace(/```$/, '');

    // Check for valid class name or id
    if (typeof target !== 'string') {
        throw new Error('Invalid class name or id');
    }

    // Create a DOM parser
    const dom = new JSDOM(htmlCode);
    const document = dom.window.document;

    // Check for valid DOM structure
    if (!document.querySelector('body')) {
        throw new Error('Invalid Dom structure');
    }

    // Check for invalid tags
    const invalidTags = ['html', 'span', 'div'];
    invalidTags.forEach(tag => {
        if (document.querySelector(tag)) {
            throw new Error('Invalid Dom structure');
        }
    });

    // Function to get children values
    function getChildrenValues(element) {
        let values = [];
        if (element.tagName === 'SELECT') {
            values = Array.from(element.querySelectorAll('option')).map(opt => opt.value);
        } else if (element.tagName === 'UL') {
            values = Array.from(element.querySelectorAll('li')).map(li => li.textContent);
        } else if (element.tagName === 'INPUT' && element.type === 'text') {
            values = element.placeholder ? [element.placeholder] : ['input'];
        } else if (element.tagName === 'LI') {
            Array.from(element.getElementsByTagName('*')).forEach(child => {
                if (child.tagName === 'SELECT') {
                    values.push(...Array.from(child.querySelectorAll('option')).map(opt => opt.value));
                } else if (child.tagName === 'UL') {
                    values.push(...Array.from(child.querySelectorAll('li')).map(li => li.textContent));
                } else if (child.tagName === 'INPUT' && child.type === 'text') {
                    values.push(child.placeholder ? child.placeholder : 'input');
                }
            });
        }
        return values;
    }

    // Get the target element
    const element = document.querySelector(`#${target}`) || document.querySelector(`.${target}`);
    if (!element) {
        throw new Error('Element not found');
    }

    // Get the children values
    const values = getChildrenValues(element);

    // Return the values sorted in ascending order
    return values.sort();
}

module.exports = {
    webScrapper
};