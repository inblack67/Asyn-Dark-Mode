import React, { useState, useEffect } from 'react';
import './App.css';
import { HelmetProvider, Helmet } from 'react-helmet-async'

const useLocalState = (key, defaultValue) => {

  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  useEffect(() => {
    const listener = (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        setValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key]);

  const setValueInLocalStorage = (newValue) => {
    setValue((currentValue) => {
      const res = typeof newValue === 'function' ? newValue(currentValue) : newValue;
      localStorage.setItem(key, JSON.stringify(res));
      return res;
    })
  }

  return [value, setValueInLocalStorage]
}

function App() {

  const [username, setUsername] = useLocalState('theme', '');
  const [theme, setTheme] = useLocalState('theme', 'dark');

  return (
    <div className="App">
      <HelmetProvider>
        <Helmet>
          <body data-theme={theme} />
        </Helmet>
      <button onClick={e => setTheme(curr => curr === 'light' ? 'dark': 'light')}>{theme}</button>
      <form>
        <div className="input-field">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
      </form>
      </HelmetProvider>
    </div>
  );
}

export default App;
