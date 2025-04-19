const { Builder } = require("selenium-webdriver");
const { submitForm } = require("./correct");
jest.setTimeout(10000); // Set timeout to 10 seconds
const getNameField = (isRequired = true) => {
    if (isRequired) {
        return `<label for="name">Name:</label>
                <input type="text" id="name" name="name" required>`;
    } 
    return `<label for="name">Name:</label>
            <input type="text" id="name" name="name">`;
};

const getEmailField = (isRequired = true) => {
    if (isRequired) {
        return `<label for="email">Email:</label>
                <input type="email" id="email" name="email" required>`;
    } 
    return `<label for="email">Email:</label>
            <input type="email" id="email" name="email">`;
}

const getRoleField = (isRequired = true) => {
    if (isRequired) {
        return `<label for="role">Role:</label>
                <select id="role" name="role" required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>`;
    } 
    return `<label for="role">Role:</label>
            <select id="role" name="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>`;
}

const getFavLanguageField = (isRequired = true) => {
    if (isRequired) {
        return `<label>Choose your favorite programming language:</label><br>
                <input type="radio" id="javascript" name="fav_language" value="JavaScript" required>
                <label for="javascript">JavaScript</label><br>
                <input type="radio" id="python" name="fav_language" value="Python" required>
                <label for="python">Python</label><br>
                <input type="radio" id="csharp" name="fav_language" value="C#" required>
                <label for="csharp">C#</label><br>`;
    }
    return `<label>Choose your favorite programming language:</label><br>
            <input type="radio" id="javascript" name="fav_language" value="JavaScript">
            <label for="javascript">JavaScript</label><br>
            <input type="radio" id="python" name="fav_language" value="Python">
            <label for="python">Python</label><br>
            <input type="radio" id="csharp" name="fav_language" value="C#">
            <label for="csharp">C#</label><br>`;
}

const getInterestsField = () => {
    return `<label>Select your interests:</label><br>
            <input type="checkbox" id="coding" name="interest" value="Coding">
            <label for="coding">Coding</label><br>
            <input type="checkbox" id="testing" name="interest" value="Testing">
            <label for="testing">Testing</label><br>
            <input type="checkbox" id="automation" name="interest" value="Automation">
            <label for="automation">Automation</label><br>`;
}

const getHTMLString = (fields, addForm=true, submitButton=true) => {
    return `<html>
    <body>
        <h2>User Form</h2>
        ${addForm ? `
            <form id="mockForm">
                ${getNameField(fields.isRequired.name)}
                <br><br>
                
                ${getEmailField(fields.isRequired.email)}
                <br><br>

                ${getRoleField(fields.isRequired.role)}
                <br><br>

                ${getFavLanguageField(fields.isRequired.fav_language)}
                <br><br>

                ${getInterestsField(fields.isRequired.interests)}
                <br><br>

                ${submitButton ? `<button type="submit">Submit</button>` : ''}
            </form>`
        : ''}
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
}

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

        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });

        const response = await submitForm(driver, htmlForm, formValues);
        expect(response.name).toBe(formValues.name);
        expect(response.email).toBe(formValues.email);
        expect(response.role).toBe(formValues.role);
        expect(response.fav_language).toBe(formValues.fav_language);
        expect(response.interests).toEqual(formValues.interests);
    });

    test("should submit the form and return the API response if driver is not provided", async () => {
        const formValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };

        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });

        const response = await submitForm(null, htmlForm, formValues);
        expect(response.name).toBe(formValues.name);
        expect(response.email).toBe(formValues.email);
        expect(response.role).toBe(formValues.role);
        expect(response.fav_language).toBe(formValues.fav_language);
        expect(response.interests).toEqual(formValues.interests);
    });

    test("should submit the form and return the API response if additional fields are added in formValues", async () => {
        const formValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"],
            extraText: "Extra text",
            extraNumber: 123,
            extraBoolean: true,
            extraArray: ["extra1", "extra2"],
            extraObject: { key: "value" }
        };

        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });

        const response = await submitForm(null, htmlForm, formValues);
        expect(response.name).toBe(formValues.name);
        expect(response.email).toBe(formValues.email);
        expect(response.role).toBe(formValues.role);
        expect(response.fav_language).toBe(formValues.fav_language);
        expect(response.interests).toEqual(formValues.interests);
    });

    // htmlContent is null
    test("Invalid input should throw an error if htmlContent is null", async () => {
        const formValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };
        await expect(submitForm(driver, null, formValues)).rejects.toThrow(Error);
    });

    // htmlContent is empty string
    test("Invalid input should throw an error if htmlContent is empty string", async () => {
        const formValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };
        await expect(submitForm(driver, "", formValues)).rejects.toThrow(Error);
    });

    // htmlContent is missing form tag
    test("Invalid input should throw an error if htmlContent is missing form tag", async () => {
        const formValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        }, false);
        await expect(submitForm(driver, htmlForm, formValues)).rejects.toThrow(Error);
    });

    // htmlContent is missing button tag
    test("Invalid input should throw an error if htmlContent is missing button tag", async () => {
        const formValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        }, true, false);
        await expect(submitForm(driver, htmlForm, formValues)).rejects.toThrow(Error);
    });

    // invalid inputs
    test("Invalid input should throw an error if formValues is undefined", async () => {
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });
        await expect(submitForm(driver, htmlForm, undefined)).rejects.toThrow(Error);
        await expect(submitForm(driver, htmlForm)).rejects.toThrow(Error);
    });

    test("Invalid input should throw an error if formValues is null", async () => {
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });
        await expect(submitForm(driver, htmlForm, null)).rejects.toThrow(Error);
    });

    test("Invalid input should throw an error if formValues is not an object", async () => {
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });
        await expect(submitForm(driver, htmlForm, "string")).rejects.toThrow(Error);
        await expect(submitForm(driver, htmlForm, 123)).rejects.toThrow(Error);
        await expect(submitForm(driver, htmlForm, [])).rejects.toThrow(Error);
        await expect(submitForm(driver, htmlForm, true)).rejects.toThrow(Error);
    });

    test("Invalid input should throw an error if formValues is an empty object", async () => {
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });

        await expect(submitForm(driver, htmlForm, {})).rejects.toThrow(Error);
    });

    test("Invalid input should throw an error if name field is required and name is empty or null or undefined", async () => {
        const invalidFormValues = {
            name: "",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };

        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();

        invalidFormValues.name = null;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();

        delete invalidFormValues.name;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();
    });

    test("Invalid input should throw an error if email field is required and email is empty or null or undefined", async () => {
        const invalidFormValues = {
            name: "John Doe",
            email: "",
            role: "admin",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };

        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();

        invalidFormValues.email = null;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();

        delete invalidFormValues.email;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();
    });


    test("Invalid input should throw an error if role field is required and role is empty or null or undefined", async () => {
        const invalidFormValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "",
            fav_language: "Python",
            interests: ["Coding", "Automation"]
        };
    
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });
    
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();

        invalidFormValues.role = null;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();

        delete invalidFormValues.role;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();
    });    


    test("Invalid input should throw an error if fav_language field is required and fav_language is empty, null, or undefined", async () => {
        const invalidFormValues = {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            fav_language: "",
            interests: ["Coding", "Automation"]
        };
    
        const htmlForm = getHTMLString({
            isRequired: {
                name: true,
                email: true,
                role: true,
                fav_language: true,
                interests: true
            }
        });
    
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();
    
        invalidFormValues.fav_language = null;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();
    
        delete invalidFormValues.fav_language;
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();

        invalidFormValues.fav_language = "english";
        await expect(submitForm(driver, htmlForm, invalidFormValues)).rejects.toThrow();
    });
            
 
});