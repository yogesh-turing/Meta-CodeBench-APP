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