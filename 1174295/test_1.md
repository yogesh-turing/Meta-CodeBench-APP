For the following base code:

```javascript
	// FetchDataComponent.vue
<template>
  <div>
    <DisplayDataComponent :fetchedData="fetchedData" />
  </div>
</template>

<script>


export default {
  components: {
    DisplayDataComponent 
  },
  data() {
    return {
      fetchedData: null,
      apiKey: 'yaskadsnkndc',
      url: `https://api.example.com/data?api_key=${apiKey}`
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch(this.url)
        .then((response) => {
          return response.json(); /
        })
        .then((data) => {
          this.fetchedData = data; 

        })

    }
  }
};
</script>
```
```javascript
<template>
  <div>
    <h1>Welcome to Home</h1>
    <!-- Wrapping FetchDataComponent here -->
    <FetchDataComponent />
  </div>
</template>

<script>

import moment from 'moment'; 

import FetchDataComponent from './FetchDataComponent.vue'; 

export default {
  components: {
    FetchDataComponent 
  },
  created() {
    const formattedDate = moment().format('YYYY-MM-DD'); 

    this.formattedDate = formattedDate; // Assigning to a reactive data property
  }
};
</script>

```

```javascript
<template>
  <div>
    <h1>Fetched Data</h1>
    <pre>{{ fetchedData }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    fetchedData: {
      type: Object, 
    }
  }
};
</script>
```

Team leader provided following code review comments:   
    Code Review Findings:

    1. **Hardcoded API Key and API URL Construction:**: 
      - In `FetchDataComponent.vue`, the API key is hardcoded directly within the component. It's better to store sensitive information like API keys in environment variables or a configuration file to enhance security and allow for different configurations across environments (development, staging, production).
      - The URL template literal in FetchDataComponent references apiKey before it's defined (in the same data object). This will cause undefined to be interpolated into the URL string, breaking the API call.

    2. **Improper Error Handling in Fetch**: The `fetchData` method does not handle potential errors from the `fetch` requests. Include error handling, such as `catch` blocks, to manage network or parsing errors and provide feedback to users or log errors appropriately.

    3. Missing Import for `DisplayDataComponent` in the `FetchDataComponent`.

    4. **Vue Reactive Properties Misuse**: In the second file, a property `formattedDate` is assigned within the `created` lifecycle hook but it's not declared within the `data` function. This can lead to a non-reactive property. Ensure that all reactive properties are declared in the `data` function.

    5. **Unused Import**: The `moment` library is imported in the second file but only used once for date formatting. Consider removing it if it's not needed anymore or using native JavaScript date functionalities if the need for external libraries is minimal, which reduces bundle size.

    6. **Comment Redundancy**: In the `FetchDataComponent.vue` file, there are unnecessary and incomplete comments, such as `return response.json(); /`. Cleaning up the comments will make the code cleaner and more professional. Additionally, consider using comments only where necessary to explain complex logic rather than obvious code, following best practices.

---    
Following are the point that should be addressed/pointed out in code review
  The review should highlight the most obvious and clearest points that would definitely be mentioned in a good code review. Here is what we are looking for:

      Does the code review highlight that the fetch operation lacks error handling (no .catch block) and loading states? Additionally, does the code review address that the DisplayDataComponent has incomplete prop validation? The type is defined, but it is missing required/default values and proper validation rules, which could lead to runtime errors.(0/2)

      Does the review point out that the apiKey is hardcoded within the component, and it should instead be stored in environment variables for security and maintainability? (0/2) 

      Does the code review highlight that the URL construction in data() incorrectly uses a template literal with ${apiKey} before the apiKey variable is defined? This will result in "undefined" being inserted into the URL. ?(0/2)

      Does the code review identify that the DisplayDataComponent is used in the FetchDataComponent template, but its import statement is missing? This could lead to a runtime error. (0/2)

      Does the code review point out the stray forward slash after response.json()? (0/2)

      Does the code review address that in the root component, formattedDate is assigned but never declared in the data() function, making it non-reactive? Additionally, does it note that using the full Moment.js library for simple date formatting is inefficient, as it is heavy, and that modern alternatives like Date-fns could be used instead?(0/2)

  Each of these is worth a maximum of 2 points, for a total of 12 points. Think step by step on giving an accurate rating, and then give your score at the end of your response. If any point is not reviewed, then it should have a 0 score.


Can you please help to check if team leader’s review has addressed the points.
Also provide the score for each point, so maximum score of 2 points should be given if point correctly address the issue.