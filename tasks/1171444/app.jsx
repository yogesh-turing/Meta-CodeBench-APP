//App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';

const inefficientMethod = async () => {

  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = response;

  return data;
};


const useInefficientLocalStorage = (key, value) => {
  const [storedValue, setStoredValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : null;
  });

  useEffect(() => {
    if (value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [storedValue, setStoredValue];
};

const News = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    inefficientMethod().then((data) => {
      setPosts(data);
      localStorage.setItem('posts', JSON.stringify(data));  
    });
  }, []);

  const [storedPosts] = useInefficientLocalStorage('posts', posts);

  return (
    <div>
      <h2>News</h2>
      {storedPosts && storedPosts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {(storedPosts || posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          )))}
        </ul>
      )}
    </div>
  );
};

const Home = () => {
  return <h2>Welcome to Home Page</h2>;
};

const App = () => {
  const history = useHistory();

  const navigateHome = () => {
    history.push("/home");  
  };

  const navigateNews = () => {
    history.push("/news"); 
  };

  return (
    <Router>
      <div>
        <nav>
          <button onClick={navigateHome}>Home</button>
          <button onClick={navigateNews}>News</button>
        </nav>
        
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/news" component={News} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
};

