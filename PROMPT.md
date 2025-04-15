Base Code:
```javascript
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

```

Prompt:

I am building a JavaScript Selenium script to automate the submission of a user form embedded in an HTML string. 
The form includes inputs of various types (text, select, radio, checkbox). 
Once submitted, the form makes an API call using fetch(), and displays the result in a paragraph with id="status".


Please help me to complete the script. 

Complete the submitForm function so that:
    - It loads the HTML form in the browser
    - It validates the HTML content and form values
    - It field is required, but if it is missing/null/empty in the formValues, it should throw an error.
    - It fills in all the form fields correctly (text, select, radio, checkboxes)
    - Submits the form
    - Waits for the API response to appear in the #status paragraph
    - Extracts the JSON object from the status paragraph
    - Returns that JSON object

`formValues` structure:
```javascript
    {
        name: <string>,
        email: <string>,
        role: <string>, // "user" or "admin"
        fav_language: <string>, // "JavaScript", "Python", "C#"
        interests: <array of strings> // ["Coding", "Testing", "Automation"]
    }
```
The solution should work with the following HTML. The required attribute may be present or absent on the HTML fields, so the script should be able to handle both cases.
The HTML form is a simple user form with the following fields:
- Name (text input)
- Email (email input)
- Role (select dropdown, options: "user", "admin")
- Favorite Programming Language (radio buttons, options: "JavaScript", "Python", "C#")
- Interests (checkboxes, options: "Coding", "Testing", "Automation")
- Submit button (button[type="submit"])
The fields may or may not have the required attribute.
If any of the HTML fields are required but is missing/null/empty in the `formValues`, it should throw an error.

```html
<html>
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
</html>
```

Complete the missing part in the submitForm function.