const { webScrapper } = require('./alternate_responses/incorrect_solution');
// const { webScrapper } = require('./solution');

describe('webScrapper', () => {

  test('should return the values of <select> option elements when provided with valid html and id', () => {
    const validHtml = `
      \`\`\`html
      <body>
        <ul>
            <li>This is Salman</li>
            <li>
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
            </li>
        </ul>
        <input class="i" type="text" placeholder="salman">
      </body>
      \`\`\`
    `;
    const result = webScrapper(validHtml, 'test');
    expect(result).toEqual(['A', 'B']);
  });

  test('should return the placeholder values of <input> text fields', () => {
    const validHtml = `
      \`\`\`html
      <body>
        <ul>
            <li>This is Salman</li>
            <li>
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
            </li>
        </ul>
        <input class="i" type="text" placeholder="salman">
      </body>
      \`\`\`
    `;
    const result = webScrapper(validHtml, 'i');
    expect(result).toEqual(['salman']);
  });

  test('targeted element have enclosed many elements in it ', () => {
    const validHtml = `
      \`\`\`html
      <body>
        <ul>
            <li>This is Salman</li>
            <li class="second">
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
                <input class="j" type="text" placeholder="kaif">
            </li>
        </ul>
        <input class="i" type="text" placeholder="salman">
      </body>
      \`\`\`
    `;
    const result = webScrapper(validHtml, 'second');
    expect(result).toEqual(['A','B',"kaif"]);
  });
 
  test('targeted element is input but has no placeholder value so return default input string ', () => {
    const validHtml = `
      \`\`\`html
      <body>
        <ul>
            <li>This is Salman</li>
            <li class="second">
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
                <input class="j" type="text" placeholder="kaif">
            </li>
        </ul>
        <input class="i" type="text">
      </body>
      \`\`\`
    `;
    const result = webScrapper(validHtml, 'i');
    expect(result).toEqual(["input"]);
  });

 
  test('should throw an error if html code is not in valid markdown format', () => {
    const invalidHtml = `
      <body>
        <ul>
            <li>This is Salman</li>
            <li>
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
            </li>
        </ul>
        <input class="i" type="text" placeholder="salman">
      </body>
    `;
    expect(() => webScrapper(invalidHtml, 'test')).toThrow('Invalid HTML Code');
  });

  test('should throw an error if the dom contains invalid tags', () => {
    const invalidDomHtml = `
      \`\`\`html
      <body>
        <ul>
            <li>This is Salman</li>
            <li>
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
            </li>
        </ul>
        <span>This is span</span>
        <input class="i" type="text" placeholder="salman">
      </body>
      \`\`\`
    `;
    expect(() => webScrapper(invalidDomHtml, 'test')).toThrow('Invalid Dom structure');
  });


  test('should throw an error if the valid element are present outside of body tag', () => {
    const invalidDomHtml = `
      \`\`\`html
      <li>This is Salman</li>
      <body>
        <ul>
            <li>This is Salman</li>
            <li>
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
            </li>
        </ul>
        <span>This is span</span>
        <input class="i" type="text" placeholder="salman">
      </body>
      \`\`\`
    `;
    expect(() => webScrapper(invalidDomHtml, 'test')).toThrow('Invalid Dom structure');
  });

  test('should throw an error if the element with the given id/class does not exist', () => {
    const validHtml = `
      \`\`\`html
      <body>
        <ul>
            <li>This is Salman</li>
            <li>
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
            </li>
        </ul>
        <input class="i" type="text" placeholder="salman">
      </body>
      \`\`\`
    `;
    expect(() => webScrapper(validHtml, 'nonexistent')).toThrow('Element not found');
  });

  test('should throw an error if the class or id provided is not a string', () => {
    const validHtml = `
      \`\`\`html
      <body>
        <ul>
            <li>This is Salman</li>
            <li>
                <select id="test"> 
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
            </li>
        </ul>
        <input class="i" type="text" placeholder="salman">
      </body>
      \`\`\`
    `;
    expect(() => webScrapper(validHtml, 123)).toThrow('Invalid class name or id');
  });

});
