const { Builder, By, until } = require("selenium-webdriver");

async function submitForm(driver, htmlContent, formValues) {
    // Validate input parameters
    if (!htmlContent || typeof htmlContent !== "string" || htmlContent.length === 0 || htmlContent.indexOf("<form") === -1 || htmlContent.indexOf("<button") === -1) {
        throw new Error("Invalid HTML content");
    }
    if (!formValues || typeof formValues !== "object" || Object.keys(formValues).length === 0) {
        throw new Error("Invalid form values");
    }

    let isDriverProvided = true;
    if (!driver) {
        driver = await new Builder().forBrowser("chrome").build();
        isDriverProvided = false;
    }

    try {
        // Load the HTML content into the WebDriver
        await driver.get('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

        // Fill text inputs
        const nameInput = await driver.findElement(By.id("name"));
        await nameInput.clear();
        if (nameInput.getAttribute("required") && !formValues.name) {
            throw new Error("Name is required but not provided");
        }
        await nameInput.sendKeys(formValues.name || '');

        const emailInput = await driver.findElement(By.id("email"));
        await emailInput.clear();
        if (emailInput.getAttribute("required") && !formValues.email) {
            throw new Error("Email is required but not provided");
        }
        await emailInput.sendKeys(formValues.email || '');

        // Fill select dropdown
        const roleSelect = await driver.findElement(By.id("role"));
        await roleSelect.sendKeys(formValues.role || 'user');

        // Select radio button
        if (formValues.fav_language) {
            const radioInput = await driver.findElement(By.css(`input[name="fav_language"][value="${formValues.fav_language}"]`));
            await radioInput.click();
        }

        // Select checkboxes
        if (formValues.interests && Array.isArray(formValues.interests)) {
            for (let interest of formValues.interests) {
                const checkbox = await driver.findElement(By.css(`input[name="interest"][value="${interest}"]`));
                const isChecked = await checkbox.isSelected();
                if (!isChecked) {
                    await checkbox.click();
                }
            }
        }

        // Submit the form
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();

        // Wait for the status paragraph to update with the API response
        await driver.wait(until.elementLocated(By.id("status")), 5000);
        const statusElement = await driver.findElement(By.id("status"));
        await driver.wait(until.elementTextContains(statusElement, "API Response:"), 5000);

        // Extract the JSON response
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
}

module.exports = {
    submitForm
};