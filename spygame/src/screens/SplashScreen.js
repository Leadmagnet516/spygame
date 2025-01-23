import { useContext, useEffect } from "react";

export default function SplashScreen(props) {
  const { splashToGame } = props;

  const handleAcceptClick = () => {
    splashToGame();
  }

  const handleOptionsClick = () => {

  }

/*   useEffect(() => {
    return () => {
      console.log("SplashScreen unmounted");
    }
  },[]) */

  return (
    <div className="splash-screen">
      <div className="title">
        <h2>Welcome to</h2>
        <h1>SpyGame</h1>
        <span>v0.0.7</span>
      </div>
      <ul className="menu">
        <li><button type="button" onClick={handleAcceptClick}>Accept Mission</button></li>
        <li><button type="button" onClick={handleOptionsClick}>Options</button></li>
      </ul>
      
    </div>
  )
}