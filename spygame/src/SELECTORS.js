import { GAME_STATE } from './CONSTANTS';

// GAME
export const selectGameState = state => state.gameState;
export const selectPrevGameState = state => state.prevGameState;
export const selectGameStateActive = state => state.gameState === GAME_STATE.ACTIVE;