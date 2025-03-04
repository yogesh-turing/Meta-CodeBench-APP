const { Builder, By, until } = require("selenium-webdriver");
const { submitForm } = require("./solution");

const validHtmlForm = `<html>
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

describe("submitForm", () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test("should submit the form and return the API response", async () => {
        const formValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };

        const response = await submitForm(driver, validHtmlForm, formValues);
        expect(response.name).toBe(formValues.name);
        expect(response.email).toBe(formValues.email);
        expect(response.role).toBe(formValues.role);
        expect(response.fav_language).toBe(formValues.fav_language);
        expect(response.interests).toEqual(formValues.interests);
    });

    // invalid inputs
    test("should throw an error if the inputs are invalid", async () => {

        const formValues = {
            name: "John Doe",
            email: "test@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };

        await expect(submitForm(driver, validHtmlForm, formValues)).rejects.toThrow("API Error: Bad Request");
    });
       

});