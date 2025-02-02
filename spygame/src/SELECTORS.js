import { GAME_STATE } from "./CONSTANTS";

// GAME
export const selectGameState = state => state.gameState;
export const selectGameStateActive = state => state.gameState === GAME_STATE.ACTIVE;