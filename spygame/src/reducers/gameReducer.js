import {
  GAME_STATE,
  ACTION_CHANGE_GAME_STATE
} from "../CONSTANTS";

const initialGameState = {
  gameState: GAME_STATE.INACTIVE
}

export default function gameReducer(state = initialGameState, action) {
  switch (action.type) {
    case ACTION_CHANGE_GAME_STATE:
      return { ...state, gameState: action.payload }
    default:
      return state
  }
}