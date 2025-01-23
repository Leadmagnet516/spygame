import {
  GAME_WIDTH,
  GAME_HEIGHT,
  EVENT_SHOW_MODAL
 } from "../CONSTANTS";

export default function HudLayer(props) {

  const handleInventoryClick = e => {
    dispatchEvent(new CustomEvent(EVENT_SHOW_MODAL, {detail: { modalPurpose: 'inventory' }}));
  }

  return (
    <div className="hud-layer" style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
      position: 'absolute'
    }}>
      <div className="top left"></div>
      <div className="top right">
        <button type="button" onClick={handleInventoryClick}>Inventory</button>
      </div>
      <div className="bottom left"></div>
      <div className="bottom right"></div>
    </div>
  );
}
