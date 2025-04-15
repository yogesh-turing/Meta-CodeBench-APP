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
        await driver.manage().setTimeouts({ implicit: 5000 });
        
        // Create a data URL from the HTML content
        const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
        await driver.get(dataUrl);

        // Check for required fields in the form
        const requiredElements = await driver.findElements(By.css('[required]'));
        for (const element of requiredElements) {
            const elementId = await element.getAttribute('id');
            const elementName = await element.getAttribute('name');
            
            if (elementId && (!formValues[elementName] || formValues[elementName].length === 0)) {
                throw new Error(`Required field ${elementName} is missing or empty in formValues`);
            }
        }

        // Fill text and email inputs
        if (formValues.name) {
            await driver.findElement(By.id('name')).sendKeys(formValues.name);
        }
        if (formValues.email) {
            await driver.findElement(By.id('email')).sendKeys(formValues.email);
        }

        // Select role from dropdown
        if (formValues.role) {
            const roleSelect = await driver.findElement(By.id('role'));
            await roleSelect.findElement(By.css(`option[value="${formValues.role}"]`)).click();
        }

        // Select favorite programming language (radio button)
        if (formValues.fav_language) {
            const radioButton = await driver.findElement(
                By.css(`input[name="fav_language"][value="${formValues.fav_language}"]`)
            );
            await radioButton.click();
        }

        // Select interests (checkboxes)
        if (Array.isArray(formValues.interests)) {
            for (const interest of formValues.interests) {
                const checkbox = await driver.findElement(
                    By.css(`input[name="interest"][value="${interest}"]`)
                );
                await checkbox.click();
            }
        }

        // Submit the form
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();

        // Wait for and get the API response
        await driver.wait(until.elementLocated(By.id('status')), 10000);
        await driver.wait(
            until.elementTextContains(driver.findElement(By.id('status')), 'API Response:'),
            10000
        );

        const statusText = await driver.findElement(By.id('status')).getText();
        const jsonResponse = JSON.parse(statusText.split('API Response: ')[1]);
        return jsonResponse;

    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    } finally {
        if (!isDriverProvided) {
            await driver.quit();
        }
    }
}

module.exports = {
    submitForm
};