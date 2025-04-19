"Farhad: (April 18 comment)

The task is fine but there are three test cases that can be added to make it comprehensive completely:
- HTML‑content validation, to check the HTML has all of the required tag or not like:
htmlContent === """"           // empty string  
htmlContent.indexOf(""<form"") === -1  // no `<form>` tag  
htmlContent.indexOf(""<button"") === -1 // no `<button>` tag  

- formValues shape validation - Like:
await expect(submitForm(driver, html, null)).rejects.toThrow();
await expect(submitForm(driver, html, ""notAnObject"")).rejects.toThrow();
await expect(submitForm(driver, html, {})).rejects.toThrow();

- Optional‑field scenarios. If there are some optional fields they should be omitted without any issue. 
"


```javascript

``