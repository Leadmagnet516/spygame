import './App.css';
import Menu from './components/menu.js';
import Switch from './components/switch.js'
import { useState } from 'react';
import { ThemeContext } from './contexts.js';
import { THEMES } from './CONSTANTS.js'
import useProfile from './hooks/useProfile.js';

function App() {
  const [ theme, setTheme ] = useState(THEMES.DARK);
  const user = useProfile();

  const logProfile = () => {
    console.log(user);
  }

  const menuItems = [
    {
      name: 'Home',
      onClick: () => {
        console.log('Home clicked');
      }
    },
    {
      name: 'Art',
      onClick: () => {
        console.log('Art clicked');
      }
    },
    {
      name: 'Music',
      onClick: () => {
        console.log('Music clicked');
      }
    },
    {
      name: 'Tech',
      onClick: () => {
        console.log('Tech clicked');
      }
    },
    {
      name: 'Contact',
      onClick: () => {
        console.log('Contact clicked');
      }
    },
    {
      name: 'Profile',
      onClick: logProfile
    }
  ];

  const toggleTheme = () => {
    switch(theme) {
      case THEMES.DARK :
        setTheme(THEMES.LIGHT);
        break;
      case THEMES.LIGHT :
        setTheme(THEMES.DARK);
        break;
    }
  }


  return (
    <ThemeContext.Provider value={theme}>
      <div className={`App ${theme}`}>
        <header className={`abl-header ${theme}`}>
          <h1>Andrew's React Sandbox</h1>
          <Menu items={menuItems} />
          <Switch onClick={toggleTheme} />
        </header>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
