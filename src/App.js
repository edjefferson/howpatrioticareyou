import Game from './Game.jsx'
import './App.css';

function App() {
  return (
    <div id="gamebackground">
        <h1>HOW PATRIOTIC ARE YOU?</h1>
        <h2>[UK EDITION]</h2>
      <div id="gamecontainer">
        <Game />
        <div id="credits">
      <a href="https://edjefferson.com">edjefferson.com</a>
    </div>
      </div>
    </div>
  );
}

export default App;
