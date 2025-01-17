import './App.css';
import GameState from './ui/GameState'

function App() {
  console.log('Mounting App');

  return (
    <div className="App">
      <header className="App-header">
        Welcome to SpyGame!
      </header>
      <GameState></GameState>
    </div>
  );
}

export default App;
