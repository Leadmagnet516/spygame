import {
  GAME_WIDTH,
  GAME_HEIGHT,
  EVENT_OPEN_MODAL,
  EVENT_CHANGE_GAME_STATE,
  GAME_STATES
} from "../CONSTANTS";
import { GameContext } from "../screens/GameScreen";
import { useContext, useEffect } from "react";

export default function HudLayer(props) {
  const { gameStateActive } = useContext(GameContext);

  const handleInventoryClick = e => {
    dispatchEvent(new CustomEvent(EVENT_OPEN_MODAL, {detail: { modalPurpose: "inventory" }}));
  }

  const handlePauseClick = () => {
    dispatchPauseEvent();
  }

  const handleResumeClick = () => {
    dispatchResumeEvent();
  }

  const dispatchPauseEvent = () => {
    dispatchEvent(new CustomEvent(EVENT_CHANGE_GAME_STATE, {detail: { newState: GAME_STATES.PAUSED}}));
  }

  const dispatchResumeEvent = () => {
    dispatchEvent(new CustomEvent(EVENT_CHANGE_GAME_STATE, {detail: { newState: GAME_STATES.ACTIVE}}));
  }

  const handleKeyDown = e => {
    if (e.key === "Escape") {
      if(gameStateActive) {
        dispatchPauseEvent();
      } else {
        dispatchResumeEvent();
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  })

  return (
    <div className="hud-layer" style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
      position: 'absolute'
    }}>
      <div className="top left"></div>
      <div className="top right">
        <button type="button" onClick={handleInventoryClick}>Inventory</button>
        <button type="button" onClick={handlePauseClick} style={{ display: gameStateActive ? "block" : "none"}}>Pause</button>
        <button type="button" onClick={handleResumeClick} style={{ display: gameStateActive ? "none" : "block"}}>Resume</button>
      </div>
      <div className="bottom left"></div>
      <div className="bottom right"></div>
    </div>
  );
}
