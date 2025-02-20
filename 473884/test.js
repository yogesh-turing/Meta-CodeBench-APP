const { seoCheck } = require("./solution");

describe("SEO Checker Tests", () => {
  test("should validate correct HTML structure with all required tags", () => {
    const validHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page</title>
          <link rel="icon" type="image/x-icon" href="favicon.ico">
          <meta name="description" content="Test description">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta charset="UTF-8">
          <meta name="keywords" content="test, seo, keywords">
        </head>
        <body>
          <h1>Test Content</h1>
        </body>
      </html>
    `;
    expect(seoCheck(validHTML)).toBe("Your HTML is SEO optimized.");
  });

  test("should detect invalid HTML structure", () => {
    const invalidHTML = `
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Test Content</h1>
      </body>
    `;
    expect(seoCheck(invalidHTML)).toBe("Invalid HTML structure.");
  });

  test("should return error for empty content", () => {
    const invalidHTML = "";
    expect(seoCheck(invalidHTML)).toBe("Invalid HTML structure.");
  });

  test("should return error for body tag enclosed in head tag", () => {
    const invalidHTML = `
     <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page</title>
          <link rel="icon" type="image/x-icon" href="favicon.ico">
          <meta name="description" content="Test description">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta charset="UTF-8">
          <meta name="keywords" content="test, seo, keywords">
          <body>
            <h1>Test Content</h1>
          </body>
        </head>
      </html>`;
    expect(seoCheck(invalidHTML)).toBe("Invalid HTML structure.");
  });

  test("should return error for head tag enclosed in body tag", () => {
    const invalidHTML = `
     <!DOCTYPE html>
      <html>
        <body>
          <h1>Test Content</h1>

          <head>
            <title>Test Page</title>
            <link rel="icon" type="image/x-icon" href="favicon.ico">
            <meta name="description" content="Test description">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta charset="UTF-8">
            <meta name="keywords" content="test, seo, keywords">
          </head>
        </body>
      </html>`;
    expect(seoCheck(invalidHTML)).toBe("Invalid HTML structure.");
  });

  test("should detect head not within HTML tag", () => {
    const invalidHTML = `
      <!DOCTYPE html>
      <head>
        <title>Test Page</title>
      </head>
      <html>
        <body>
          <h1>Test Content</h1>
        </body>
      </html>
    `;
    expect(seoCheck(invalidHTML)).toBe(
      "Head and Body tag must be enclosed inside HTML tag."
    );
  });

  test("should detect body not within HTML tag", () => {
    const invalidHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page</title>
        </head>
      </html>
      <body>
        <h1>Test Content</h1>
      </body>
    `;
    expect(seoCheck(invalidHTML)).toBe(
      "Head and Body tag must be enclosed inside HTML tag."
    );
  });

  test("should detect head and body not within HTML tag", () => {
    const invalidHTML = `
      <!DOCTYPE html>
      <html>
      </html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Test Content</h1>
      </body>
    `;
    expect(seoCheck(invalidHTML)).toBe(
      "Head and Body tag must be enclosed inside HTML tag."
    );
  });

  test("should detect single missing tag", () => {
    const htmlWithMissingTitle = `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="icon" type="image/x-icon" href="favicon.ico">
          <meta name="description" content="Test description">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta charset="UTF-8">
          <meta name="keywords" content="test, seo, keywords">
        </head>
        <body>
          <h1>Test Content</h1>
        </body>
      </html>
    `;
    expect(seoCheck(htmlWithMissingTitle)).toBe("title tag is missing.");
  });

  test("should detect multiple missing tags", () => {
    const htmlWithMultipleMissingTags = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta charset="UTF-8">
          <meta name="description" content="Test description">
          <meta name="keywords" content="test, seo, keywords">
        </head>
        <body>
          <h1>Test Content</h1>
        </body>
      </html>
    `;
    expect(seoCheck(htmlWithMultipleMissingTags)).toBe(
      "title, favicon tags are missing."
    );
  });
});