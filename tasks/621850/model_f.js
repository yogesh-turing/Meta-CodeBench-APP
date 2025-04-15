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
        // Load the HTML content
        await driver.get(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
        
        // Validate and fill text inputs
        for (const [key, value] of Object.entries(formValues)) {
            const element = await driver.findElement(By.id(key));
            const isRequired = await element.getAttribute('required') !== null;
            if (isRequired && (!value || value.trim() === "")) {
                throw new Error(`${key} is required but missing in formValues.`);
            }
            if (element.getAttribute('type') === 'text' || element.getAttribute('type') === 'email') {
                await element.clear();
                await element.sendKeys(value);
            }
        }

        // Fill select dropdown
        const roleElement = await driver.findElement(By.id('role'));
        await roleElement.findElement(By.css(`option[value="${formValues.role}"]`)).click();

        // Fill radio buttons
        const favLangRadio = await driver.findElement(By.css(`input[name="fav_language"][value="${formValues.fav_language}"]`));
        await favLangRadio.click();

        // Fill checkboxes
        for (const interest of formValues.interests) {
            const checkbox = await driver.findElement(By.css(`input[name="interest"][value="${interest}"]`));
            if (!await checkbox.isSelected()) {
                await checkbox.click();
            }
        }

        // Submit the form
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();

        // Wait for the API response to appear in the #status paragraph
        await driver.wait(until.elementLocated(By.id('status')), 10000);
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