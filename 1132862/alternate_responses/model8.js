const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
    // Remove leading and trailing whitespaces
    htmlCode = htmlCode.trim();

    // Check if htmlCode is enclosed in triple backticks with html markdown
    if (!htmlCode.startsWith('```html') || !htmlCode.endsWith('```')) {
        throw new Error('Invalid HTML Code');
    }

    // Remove triple backticks and html markdown
    htmlCode = htmlCode.replace('```html', '').replace('```', '');

    // Create a DOM parser
    const dom = new JSDOM(htmlCode);

    // Check if the HTML code has a valid DOM structure
    if (!dom.window.document.body) {
        throw new Error('Invalid Dom structure');
    }

    // Get all elements in the body
    const elements = dom.window.document.body.getElementsByTagName('*');

    // Check if all elements are valid
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.tagName !== 'SELECT' && element.tagName !== 'UL' && element.tagName !== 'LI' && element.tagName !== 'INPUT') {
            throw new Error('Invalid Dom structure');
        }
        if (element.tagName === 'INPUT' && element.type !== 'text') {
            throw new Error('Invalid Dom structure');
        }
    }

    // Check if target is a string
    if (typeof target !== 'string') {
        throw new Error('Invalid class name or id');
    }

    // Function to get children values of an element
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
    const element = dom.window.document.querySelector(`#${target}`) || dom.window.document.querySelector(`.${target}`);

    // Check if the target element exists
    if (!element) {
        throw new Error('Element not found');
    }

    // Get the children values of the target element
    const values = getChildrenValues(element);

    // Return the values sorted in ascending order
    return values.sort();
}

module.exports = {
    webScrapper
};