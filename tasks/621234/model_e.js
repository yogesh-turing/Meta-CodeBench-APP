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
        await driver.executeScript(`document.body.innerHTML = '${htmlContent.replace(/'/g, "\\'")}';`);

        const requiredFields = await driver.executeScript(`
            return Array.from(document.querySelectorAll('[required]')).map(el => el.id);
        `);

        for (const field of requiredFields) {
            if (!formValues[field] || formValues[field].length === 0) {
                throw new Error(`Required field ${field} is missing or empty`);
            }
        }

        if (formValues.name) {
            await driver.findElement(By.id("name")).sendKeys(formValues.name);
        }

        if (formValues.email) {
            await driver.findElement(By.id("email")).sendKeys(formValues.email);
        }

        if (formValues.role) {
            const roleSelect = await driver.findElement(By.id("role"));
            await roleSelect.findElement(By.css(`option[value="${formValues.role}"]`)).click();
        }

        if (formValues.fav_language) {
            const radioButton = await driver.findElement(
                By.css(`input[name="fav_language"][value="${formValues.fav_language}"]`)
            );
            await driver.executeScript("arguments[0].click();", radioButton);
        }

        if (Array.isArray(formValues.interests) && formValues.interests.length > 0) {
            for (const interest of formValues.interests) {
                const checkbox = await driver.findElement(
                    By.css(`input[name="interest"][value="${interest}"]`)
                );
                await driver.executeScript("arguments[0].click();", checkbox);
            }
        }

        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await driver.executeScript("arguments[0].click();", submitButton);

        await driver.wait(until.elementLocated(By.id("status")), 5000);
        await driver.wait(
            until.elementTextContains(driver.findElement(By.id("status")), "API Response:"),
            5000
        );

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
}

module.exports = {
    submitForm
};