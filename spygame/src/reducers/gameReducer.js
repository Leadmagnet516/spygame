import {
  GAME_STATE,
  ACTION_CHANGE_GAME_STATE
} from '../CONSTANTS';

const initialGameState = {
  gameState: GAME_STATE.INACTIVE,
  prevGameState: null
}

export default function gameReducer(state = initialGameState, action) {
  console.log(`gameReducer ${state.gameState}, ${action.payload}`);
  switch (action.type) {
    case ACTION_CHANGE_GAME_STATE:
      const prevGameState = state.gameState;
      return { ...state, prevGameState, gameState: action.payload }
    default:
      return state
  }
}