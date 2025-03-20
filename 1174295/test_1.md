For the following base code:

```javascript
// Action types
export const SET_DATA = 'SET_DATA';

// Action creator
export const setData = (data) => ({
  type: SET_DATA,
  payload: data
});
```
```javascript
//redux/reducer.js:

// Initial state
const initialState = {
  data: []
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
};

export default reducer;

```

```javascript
//store.js
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

export default store;
```

```javascript
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from './redux/actions';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  
    const fetchData = async () => {
      const data = await fetch('/data.json'); file
      const json = await data.json();
      dispatch(setData(json)); 
    };

    fetchData();
  }, [dispatch]);

  return (
    <div>
      <h1>App Component</h1>
      <ChildComponent />
    </div>
  );
};

export default App;
```

```javascript
//ChildComponent .js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ChildComponent = () => {
  const data = useSelector(state => state.data);

  useEffect(() => {
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name)); 
    const filteredData = sortedData.filter(item => item.age > 30); // Filtering (inefficient)

    
    const mappedData = filteredData.map(item => item.name.toUpperCase());

    console.log('Mapped Data:', mappedData);
  }, [data]);

  return (
    <div>
      <h2>Child Component</h2>
      <ul>
        {data.map(item = (
          <li key={item.id}>{item.name} - {item.age}</li>
        ))}
      </ul>
    </div>
  );
};

```

Team leader provided following code review comments:   

    ### Code Review

      1. **Resource Leaks in `fetchData`:**
        - In the `App` component, you use `useEffect` to fetch data, but there is no cleanup or error handling. If the fetch fails, it's not handled which might cause unhandled promise rejections. Consider adding error handling logic and proper cleanup if necessary.

      2. **Inefficient Sorting and Filtering:**
        - The `ChildComponent` does unnecessary sort and filter operations within the `useEffect` hook on every render. Sorting should only occur once when the data changes, and filtering should be part of data processing if relevant to the UI display.
        
      3. **Typo in Fetch URL:**
        - In the `App` component, there is a stray word "file" next to `await fetch('/data.json');`, which seems to be an error. This is a syntax issue and should be removed to ensure the fetch call operates correctly.

      4. **JSX Syntax Error:**
        - In `ChildComponent`, there is a missing arrow function arrow (`=>`) in the `map` function rendering the `li` elements. It should be `data.map(item => ( /* JSX */ ))`.

      5. **Missing `prop-types`:**
        - The components do not validate their props using `prop-types`. Although not mandatory, using `prop-types` would ensure that the components receive props of the appropriate types, improving maintainability and catching potential type-related bugs.

      6. **Hardcoded API Path:**
        - The data fetch in `App` component uses a hardcoded path (`'/data.json'`). In a real-world application, consider using environment variables or configuration files to maintain such URLs, which facilitates changes across different environments (development, production).

      By addressing these issues, the application will not only perform better but also be more robust and maintainable.

Following is the issue with the code review:
    Inefficient data processing in useEffect: The code review identifies that sorting and filtering are inefficient, but it doesn't specifically mention using useMemo to memoize the data processing or suggest moving the logic to the render function if it's for display purposes. Score: 1/2


Can you please elaborate on what mistake team leader make in code review with respect to base code. Do not return the code.
