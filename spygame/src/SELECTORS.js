import { GAME_STATE } from './CONSTANTS';

// GAME
export const selectGameState = state => state.gameState;
export const selectPrevGameState = state => state.prevGameState;
export const selectGameStateActive = state => state.gameState === GAME_STATE.ACTIVE;
export const selectHeroState = state => state.heroState;
export const selectNpcStates = state => state.npcStates;
export const selectSceneryBlocks = state => state.sceneryBlocks;
export const selectSusList = state => state.susList;
export const selectObjectiveCompleted = state => state.objectiveCompleted;