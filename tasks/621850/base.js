const { Builder, By, until } = require("selenium-webdriver");

async function submitForm(driver, htmlContent, formValues) {
    if (!htmlContent || !formValues
        || typeof htmlContent !== "string" || typeof formValues !== "object"
        || Object.keys(formValues).length === 0
        || htmlContent.length === 0
        || htmlContent.indexOf("<form") === -1
        || htmlContent.indexOf("<button") === -1
    ) {
        throw new Error("Invalid input parameters");
    }

    let isDriverProvided = true;
    if (!driver) {
        driver = await new Builder().forBrowser("chrome").build();
        isDriverProvided = false;
    }

    try {
        // TODO: Complete the function
        // Load the HTML content into the Selenium WebDriver
        // Validate the HTML content and form values
        // Fill all form fields based on formValues
        // - text inputs by id
        // - select dropdown by id
        // - radio buttons by name
        // - checkboxes by name
        // - Submit the form by clicking the button[type="submit"]
        // - Wait until the response appears in the #status paragraph
        const statusText = await driver.findElement(By.id("status")).getText();
        const jsonResponse = JSON.parse(statusText.split("API Response: ")[1]);
        return jsonResponse;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    } finally {
        if (!isDriverProvided) {
            await driver.quit();
        }
    }
};

module.exports = {
    submitForm
};