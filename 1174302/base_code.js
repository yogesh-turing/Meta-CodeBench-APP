import React, { useState, useEffect } from 'react';

// Custom Hook - Defined inefficiently
const useFetchData = (id) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDataFromIndexedDB = async () => {
      const db = await indexedDB.open('myDatabase', 1);
      const tx = db.transaction('myStore', 'readonly');
      const store = tx.objectStore('myStore');
      const request = store.get(id);

      request.onsuccess = (event) => {
        setData(event.target.result);
      };
    };

    fetchDataFromIndexedDB();
  }, [id]); 

  return data;
};

const StaleStateComponent = ({ id }) => {
  const data = useFetchData(id);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() = {
      setCounter(counter + 1); 
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div>
      <h1>Stale State Component</h1>
      <p>Data from IndexedDB: {JSON.stringify(data) }</p>
      <p>Counter: {counter}</p>
    </div>
  );
};

```
```javascript
import React, { useState } from 'react';

const App = () => {
  const [message] = useState('Hello World!');

  return (
    <div>
      <h1>App Component</h1>
      <p>{message}</p>
    </div>
  );
};

export default App;