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