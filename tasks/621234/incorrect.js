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
        // Load the HTML content into the WebDriver
        await driver.get(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

        // Validate required fields are present in formValues
        const requiredFields = ['name', 'email'];
        for (const field of requiredFields) {
            if (!formValues[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Fill text input fields
        await driver.findElement(By.id('name')).sendKeys(formValues.name);
        await driver.findElement(By.id('email')).sendKeys(formValues.email);

        // Select proper role
        await driver.findElement(By.id('role')).sendKeys(formValues.role);

        // Choose favorite programming language (radio buttons)
        const favLangElement = await driver.findElement(By.css(`input[name='fav_language'][value='${formValues.fav_language}']`));
        await favLangElement.click();

        // Select interests (checkboxes)
        for (let interest of formValues.interests) {
            const interestCheckbox = await driver.findElement(By.css(`input[name='interest'][value='${interest}']`));
            await interestCheckbox.click();
        }

        // Submit the form
        await driver.findElement(By.css("button[type='submit']")).click();

        // Wait for the response to appear in the status paragraph
        await driver.wait(until.elementLocated(By.id("status")), 10000);
        let statusText = await driver.findElement(By.id("status")).getText();
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