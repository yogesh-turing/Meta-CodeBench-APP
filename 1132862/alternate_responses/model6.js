const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
    // Check if the input HTML code is valid
    if (!htmlCode.startsWith('```html') || !htmlCode.endsWith('```')) {
        throw new Error('Invalid HTML Code');
    }

    // Remove the triple backticks and markdown from the HTML code
    htmlCode = htmlCode.replace(/^```html/, '').replace(/```$/, '');

    // Check if the HTML code is enclosed in a body tag
    if (!htmlCode.startsWith('<body>') || !htmlCode.endsWith('</body>')) {
        throw new Error('Invalid DOM structure');
    }

    // Create a JSDOM instance from the HTML code
    const { document } = (new JSDOM(htmlCode)).window;

    // Check if the target is a string
    if (typeof target !== 'string') {
        throw new Error('Invalid class name or id');
    }

    // Function to get children values of an element
    function getChildrenValues(element) {
        let values = [];

        // If the element is a select tag, get its option values
        if (element.tagName === 'SELECT') {
            values = Array.from(element.querySelectorAll('option')).map(opt => opt.value);
        }
        // If the element is a ul tag, get its li text values
        else if (element.tagName === 'UL') {
            values = Array.from(element.querySelectorAll('li')).map(li => li.textContent);
        }
        // If the element is an input tag with type text, get its placeholder value
        else if (element.tagName === 'INPUT' && element.type === 'text') {
            values = element.placeholder ? [element.placeholder] : ['input'];
        }
        // If the element is a div tag, recursively get its children values
        else if (element.tagName === 'DIV') {
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