import {
  GAME_STATE,
  ACTION_CHANGE_GAME_STATE,
  ACTION_UPDATE_HERO_STATE,
  ACTION_SET_NPCS,
  ACTION_RECORD_ENTITY_DAMAGE,
  ACTION_UPDATE_NPC_STATE,
  ACTION_SET_SCENERY_BLOCKS,
  SUS_KINDS
} from '../CONSTANTS';

const initialGameState = {
  gameState: GAME_STATE.INACTIVE,
  prevGameState: null,
  sceneryBlocks: [],
  heroState: {
    pos: {
      x: 0,
      y: 0,
      hitPoints: 100
    }
  },
  npcStates: [],
  susList: [
    {
      id: "hero",
      susKind: SUS_KINDS.FOE,
      pos: {
        x: 0,
        y: 0
      }
    }
  ]
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
    case ACTION_CHANGE_GAME_STATE:
      const prevGameState = state.gameState;
      return { ...state, prevGameState, gameState: action.payload }

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
        return { ...state, npcStates: state.npcStates.map(npc => {
          if(npc.id === action.payload.victimId) {
            return damagedEntity(npc, action.payload.damage);
          } else {
            return npc;
          }
        })}
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

    default:
      return state
  }
}