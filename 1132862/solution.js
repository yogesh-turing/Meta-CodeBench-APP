const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
    // Validate and trim the HTML code
    if (typeof htmlCode !== 'string') {
        throw new Error('Invalid HTML Code');
    }
    
    const trimmedHtml = htmlCode.trim();
    
    // Ensure the code is wrapped with triple backticks and starts with "```html"
    if (!trimmedHtml.startsWith('```html') || !trimmedHtml.endsWith('```')) {
        throw new Error('Invalid HTML Code');
    }

    // Extract the actual HTML content
    const actualHtml = trimmedHtml.slice(7, -3).trim();

    // Validate target parameter (it should be a string)
    if (typeof target !== 'string') {
        throw new Error('Invalid class name or id');
    }

    // Create DOM from HTML
    const { document } = (new JSDOM(actualHtml)).window;

    // Ensure the HTML structure contains a <body> tag
    const body = document.querySelector('body');
    if (!body) {
        throw new Error('Invalid Dom structure');
    }

    // Define valid tags that can be present in the body
    const validTags = ['BODY', 'SELECT', 'UL', 'LI', 'INPUT', 'OPTION'];

    // Validate the DOM structure to only contain valid tags
    function validateDomStructure(node) {
        // If it's a text node or document node, we don't need to validate it
        if (node.nodeType === 3 || node.nodeType === 9) return true;

        // If it's an invalid tag, return false
        if (!validTags.includes(node.tagName)) {
            return false;
        }

        // If it's an input, ensure it's of type text
        if (node.tagName === 'INPUT' && node.getAttribute('type') !== 'text') {
            return false;
        }

        // Recursively check all child nodes
        return Array.from(node.childNodes).every(validateDomStructure);
    }

    // Validate the body for correct structure
    if (!validateDomStructure(body)) {
        throw new Error('Invalid Dom structure');
    }

    // Find the target element by id or class name
    const element = document.querySelector(`#${target}`) || document.querySelector(`.${target}`);
    if (!element) {
        throw new Error('Element not found');
    }

    // Function to extract values from the children of an element
    function getChildrenValues(element) {
        let values = [];

        // If the element is a <select>, extract all option values
        if (element.tagName === 'SELECT') {
            values = Array.from(element.querySelectorAll('option')).map(opt => opt.value);
        }
        // If the element is a <ul>, extract text from all <li> elements
        else if (element.tagName === 'UL') {
            values = Array.from(element.querySelectorAll('li')).map(li => li.textContent.trim());
        }
        // If the element is an <input> of type "text", extract the placeholder or default value
        else if (element.tagName === 'INPUT' && element.type === 'text') {
            values = element.placeholder ? [element.placeholder] : ['input'];
        }
        // For any other container element, extract values from nested valid child elements
        else {
            element.querySelectorAll('*').forEach(child => {
                if (child.tagName === 'SELECT') {
                    values.push(...Array.from(child.querySelectorAll('option')).map(opt => opt.value));
                } else if (child.tagName === 'UL') {
                    values.push(...Array.from(child.querySelectorAll('li')).map(li => li.textContent.trim()));
                } else if (child.tagName === 'INPUT' && child.type === 'text') {
                    values.push(child.placeholder || 'input');
                }
            });
        }

        return values;
    }

    // Extract and sort the values
    const values = getChildrenValues(element);
    return values.sort();
}

module.exports = { webScrapper };