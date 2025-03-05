import {
  GAME_STATE,
  ACTION_TOGGLE_PAUSE,
  ACTION_CHANGE_GAME_STATE,
  ACTION_RESET_GAME_INSTANCE,
  ACTION_UPDATE_HERO_STATE,
  ACTION_SET_NPCS,
  ACTION_RECORD_ENTITY_DAMAGE,
  ACTION_UPDATE_NPC_STATE,
  ACTION_SET_SCENERY_BLOCKS,
  ACTION_OBJECTIVE_COMPLETED,
  ACTION_TOGGLE_MODAL,
  SUS_LEVEL,
  MODAL_ID
} from '../CONSTANTS';

const initialGameState = {
  gameState: GAME_STATE.INACTIVE,
  prevGameState: null,
  gameInstance: 0,
  objectiveCompleted: false,
  hudInstructions: '',
  hudMarkers: [],
  sceneryBlocks: [],
  heroState: {
    pos: {
      x: 0,
      y: 0,
    },
    damageTaken: 0,
    hitPoints: 100,
    alive: true
  },
  npcStates: [],
  susList: [
    {
      id: "hero",
      susLevel: SUS_LEVEL.FOE,
      pos: {
        x: 0,
        y: 0
      }
    }
  ],
  activeModalId: null
}

const damagedEntity = (entity, damage) => {
  if (entity.damageTaken + damage >= entity.hitPoints) {

    return {
      ...entity,
      damageTaken: entity.damageTaken + damage,
      alive: false
    }
  }

  return {
    ...entity,
    damageTaken: entity.damageTaken + damage
  }
}

export default function gameReducer(state = initialGameState, action) {
  switch (action.type) {
    case ACTION_TOGGLE_PAUSE:
      return { ...state,
              prevGameState: state.gameState,
              gameState: state.gameState === GAME_STATE.PAUSED ? GAME_STATE.ACTIVE : GAME_STATE.PAUSED,
              activeModalId: state.gameState === GAME_STATE.PAUSED ? null : MODAL_ID.PAUSE
              }

    case ACTION_CHANGE_GAME_STATE:
      return { ...state, prevGameState: state.gameState, gameState: action.payload }
    
    case ACTION_RESET_GAME_INSTANCE:
      return { ...initialGameState, gameState: state.gameState, hudMarkers: state.hudMarkers, sceneryBlocks: state.sceneryBlocks, gameInstance: state.gameInstance + 1 }

    case ACTION_UPDATE_HERO_STATE :
      const updateSusList = state.susList.map(sus => {
        if(sus.id === 'hero' && action.payload.pos) {
          return {
            ...sus,
            pos: action.payload.pos
          }
        } else {
          return sus;
        }
      });
      return {
        ...state,
        heroState: {
          ...state.heroState,
          ...action.payload 
        },
        susList: updateSusList
      }

    case ACTION_SET_NPCS :
      return { ...state, npcStates: action.payload}

    case ACTION_RECORD_ENTITY_DAMAGE :
      if (action.payload.victimId === "hero") {
        return { ...state, heroState: damagedEntity(state.heroState, action.payload.damage)}
      } else {
        const susListAdditions = [];
        const newNpcStates = state.npcStates.map(npc => {
          if(npc.id === action.payload.victimId) {
            const damagedNpc = damagedEntity(npc, action.payload.damage);
            if (!damagedNpc.alive) susListAdditions.push({
              ...damagedNpc,
              susLevel: SUS_LEVEL.ANOMALY
            });
            return damagedNpc;
          } else {
            return npc;
          }
        })
        return { ...state, npcStates: newNpcStates, susList: [...state.susList, ...susListAdditions] }
      }

    case ACTION_UPDATE_NPC_STATE :
      const updateNpcState = state.npcStates.map(npc => {
        if(npc.id === action.payload.id) {
          return {
            ...npc,
            ...action.payload
          }
        } else {
          return npc;
        }
      });
      return { ...state, npcStates: updateNpcState };

    case ACTION_SET_SCENERY_BLOCKS :
      return { ...state, sceneryBlocks: action.payload }

    case ACTION_OBJECTIVE_COMPLETED :
      return { ...state, objectiveCompleted: action.payload}

    case ACTION_TOGGLE_MODAL :
      return { ...state, gameState: state.gameState === GAME_STATE.ACTIVE ? GAME_STATE.PAUSED : state.gameState, activeModalId: action.payload || null };

    default:
      return state
  }
}