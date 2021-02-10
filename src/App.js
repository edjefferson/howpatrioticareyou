import Game from './components/Game.jsx'
import './App.css';
import ReactGA from 'react-ga';

const { REACT_APP_GA_TRACKING_ID } = process.env;

ReactGA.initialize(REACT_APP_GA_TRACKING_ID, { testMode: process.env.NODE_ENV === 'test' });


function App() {
  ReactGA.pageview("/howpatrioticareyou/")
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
