const { Builder, By, until } = require("selenium-webdriver");

async function submitForm(driver, htmlContent, formValues) {
    if (!htmlContent || !formValues
        || typeof htmlContent !== "string" 
        || typeof formValues !== "object"
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
        
        // Handle text and select inputs
        const nameInput = await driver.findElement(By.id("name"));
        if (await nameInput.getAttribute("required")) {
            if (!formValues.name || formValues.name.trim() === "") {
                throw new Error("Name is required and cannot be empty");
            }
        }
        await nameInput.sendKeys(formValues.name);

        const emailInput = await driver.findElement(By.id("email"));
        if (await emailInput.getAttribute("required")) {
            if (!formValues.email || formValues.email.trim() === "") {
                throw new Error("Email is required and cannot be empty");
            }
        }
        await emailInput.clear(); // Clear any existing value before sending keys
        await emailInput.sendKeys(formValues.email);
        
        // Handle select dropdown
        const roleSelect = await driver.findElement(By.id("role"));
        if (await roleSelect.getAttribute("required")) {
            if (!formValues.role || formValues.role.trim() === "") {
                throw new Error("Role is required and cannot be empty");
            }
        }
        await roleSelect.findElement(By.css(`option[value="${formValues.role}"]`)).click();
        
        // Handle radio button
        if (formValues.fav_language) {
            const radioButton = await driver.findElement(By.css(`input[value="${formValues.fav_language}"]`));
            if (await radioButton.getAttribute("required")) {
                if (!formValues.fav_language || formValues.fav_language.trim() === "") {
                    throw new Error("Favorite programming language is required and cannot be empty");
                }
            }
            await radioButton.click();
        } else {
            const radioButtons = await driver.findElements(By.css("input[name='fav_language']"));
            for (const radioButton of radioButtons) {
                if (await radioButton.getAttribute("required")) {
                    throw new Error("Favorite programming language is required and cannot be empty");
                }
            }
        }
        
        // Handle checkboxes
        if (Array.isArray(formValues.interests)) {
            for (const interest of formValues.interests) {
                const checkbox = await driver.findElement(By.css(`input[value="${interest}"]`));
                await checkbox.click();
            }
        }

        // Submit the form
        const submitButton = await driver.findElement(By.css("button[type='submit']"));
        await submitButton.click();

        // Wait for the status element to be present and contain the API response
        const statusElement = await driver.wait(until.elementLocated(By.id("status")), 5000);
        await driver.wait(
            until.elementTextContains(statusElement, "API Response:"),
            5000
        );

        // Re-locate the status element to avoid stale element reference
        const updatedStatusElement = await driver.findElement(By.id("status"));
        const statusText = await updatedStatusElement.getText();
        const jsonResponse = JSON.parse(statusText.split("API Response: ")[1]);
        
        return jsonResponse;

    } catch (error) {
        // console.error("An error occurred:", error);
        throw error;
    } finally {
        if (!isDriverProvided) {
            await driver.quit();
        }
    }
}

module.exports = { submitForm };