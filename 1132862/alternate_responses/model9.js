const { JSDOM } = require('jsdom');

function webScrapper(htmlCode, target) {
  // Remove trailing white spaces at start and at end before and after the triple backticks if any
  htmlCode = htmlCode.trim();

  // Check if the html code is enclosed in triple backticks with html markdown
  if (!htmlCode.startsWith('```html') || !htmlCode.endsWith('```')) {
    throw new Error('Invalid HTML Code');
  }

  // Remove the triple backticks and html markdown
  htmlCode = htmlCode.replace(/^```html/, '').replace(/```$/, '');

  // Create a JSDOM instance
  const { document } = (new JSDOM(htmlCode)).window;

  // Check if the html code has a valid DOM structure
  if (!document.body) {
    throw new Error('Invalid Dom structure');
  }

  // Check if the target is a string
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
    } else if (element.tagName === 'DIV') {
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