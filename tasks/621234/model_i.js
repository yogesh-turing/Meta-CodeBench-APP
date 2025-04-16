const { Builder, By, Key, until } = require("selenium-webdriver");

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

    const requiredFields = {
        name: "Name",
        email: "Email",
    };

    for (const key in requiredFields) {
        if (!formValues[key]) {
            throw new Error(`${requiredFields[key]} is required but missing in formValues.`);
        }
    }

    let isDriverProvided = true;
    if (!driver) {
        driver = await new Builder().forBrowser("chrome").build();
        isDriverProvided = false;
    }

    try {
        // Load the HTML content
        await driver.get("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));
        
        // Fill text inputs
        await driver.findElement(By.id("name")).sendKeys(formValues.name);
        await driver.findElement(By.id("email")).sendKeys(formValues.email);

        // Select dropdown
        await driver.findElement(By.id("role")).sendKeys(formValues.role);

        // Select radio button
        await driver.findElement(By.css(`input[name="fav_language"][value="${formValues.fav_language}"]`)).click();

        // Check checkboxes for interests
        for (let interest of formValues.interests) {
            await driver.findElement(By.css(`input[name="interest"][value="${interest}"]`)).click();
        }

        // Submit the form
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for the API response
        await driver.wait(until.elementLocated(By.id("status")), 10000);
        const statusText = await driver.findElement(By.id("status")).getText();

        // Extract JSON response from the status text
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