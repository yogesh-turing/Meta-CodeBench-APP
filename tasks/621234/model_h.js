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
        await driver.get("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));

        // Validate and fill text inputs
        const nameInput = await driver.findElement(By.id("name"));
        const emailInput = await driver.findElement(By.id("email"));
        if (!formValues.name || !formValues.email) {
            throw new Error("Name and Email are required fields.");
        }
        await nameInput.sendKeys(formValues.name);
        await emailInput.sendKeys(formValues.email);

        // Validate and fill select dropdown
        const roleSelect = await driver.findElement(By.id("role"));
        await roleSelect.sendKeys(formValues.role);

        // Validate and select radio button
        if (!formValues.fav_language) {
            throw new Error("Favorite programming language is required.");
        }
        const radioInput = await driver.findElement(By.css(`input[name="fav_language"][value="${formValues.fav_language}"]`));
        await radioInput.click();

        // Validate and check checkboxes
        const interests = formValues.interests || [];
        for (let interest of interests) {
            const checkbox = await driver.findElement(By.css(`input[name="interest"][value="${interest}"]`));
            await checkbox.click();
        }

        // Submit the form
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();

        // Wait for the response to appear in the #status paragraph
        const statusElement = await driver.wait(until.elementLocated(By.id("status")), 10000);
        const statusText = await statusElement.getText();
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