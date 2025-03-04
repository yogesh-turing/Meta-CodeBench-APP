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
        Object.keys(formValues).forEach(key => {
            const element = driver.findElement(By.id(key));
            element.sendKeys(formValues[key]);
        });

        await driver.findElement(By.css("button[type='submit']"));

        await driver.wait(until.elementLocated(By.id("status")), 10);
        
        let statusText = await driver.findElement(By.id("status")).getText();
        const json = JSON.parse(statusText.split("API Response: ")[1]);

        return json;

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    } finally {
        if (!isDriverProvided) {
            await driver.quit();
        }
    }
};


const htmlForm = `<html>
    <body>
        <h2>User Form</h2>
        <form id="mockForm">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <br><br>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <br><br>

            <label for="role">Role:</label>
            <select id="role" name="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <br><br>

            <label>Choose your favorite programming language:</label><br>
            <input type="radio" id="javascript" name="fav_language" value="JavaScript">
            <label for="javascript">JavaScript</label><br>
            <input type="radio" id="python" name="fav_language" value="Python">
            <label for="python">Python</label><br>
            <input type="radio" id="csharp" name="fav_language" value="C#">
            <label for="csharp">C#</label><br><br>

            <label>Select your interests:</label><br>
            <input type="checkbox" id="coding" name="interest" value="Coding">
            <label for="coding">Coding</label><br>
            <input type="checkbox" id="testing" name="interest" value="Testing">
            <label for="testing">Testing</label><br>
            <input type="checkbox" id="automation" name="interest" value="Automation">
            <label for="automation">Automation</label><br><br>

            <button type="submit">Submit</button>
        </form>
        <p id="status"></p>
        
        <script>
            document.getElementById("mockForm").addEventListener("submit", async function(event) {
                event.preventDefault();
                let name = document.getElementById("name").value;
                let email = document.getElementById("email").value;
                let role = document.getElementById("role").value;
                let fav_language = document.querySelector('input[name="fav_language"]:checked')?.value || '';
                let interests = Array.from(document.querySelectorAll('input[name="interest"]:checked')).map(cb => cb.value);

                // API Call using fetch()
                try {
                    let response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, role, fav_language, interests })
                    });
                    let result = await response.json();
                    document.getElementById("status").innerText = "API Response: " + JSON.stringify(result);
                } catch (error) {
                    document.getElementById("status").innerText = "API Error: " + error.message;
                }
            });
        </script>
    </body>
</html>`;


const main = async() => {
    const formValues = {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        fav_language: "Python",
        interests: ["Coding", "Automation"]
    };
    const driver = await new Builder().forBrowser("chrome").build();

    const response = await submitForm(driver, htmlForm, formValues);
    console.log(response);

    await driver.quit();
}

main();

module.exports = {
    submitForm
};