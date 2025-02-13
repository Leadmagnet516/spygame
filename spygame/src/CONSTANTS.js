// STATES
export const APP_STATE = {
  SPLASH: 'SplashScreenState',
  GAME: 'GameScreenState',
  MODAL: 'ModalState'
}
export const GAME_STATE = {
  INACTIVE: 'InactiveState',
  ACTIVE: 'ActiveState',
  PAUSED: 'PausedState',
  LEAVING: 'LeavingState'
}

// SCREEN
export const GRID_SIZE = 48;
export const GRID_WIDTH = 24;
export const GRID_HEIGHT = 16;
export const GAME_WIDTH = GRID_SIZE * GRID_WIDTH;
export const GAME_HEIGHT = GRID_SIZE * GRID_HEIGHT;

// ENTITIES
export const TICK_MS = 16;
export const HERO_MOVE_MS = 125;
export const ENTITY_MOOD = {
  OK: 0,
  ALERTED: 1,
  AGGRESSIVE: 2
}
export const ENTITY_TASK = {
  IDLE: "Idle",
  MOVE: 'Move',
  SCAN: 'Scan',
  SEARCH: 'Search',
  COMBAT: 'Combat'
}
export const SUS_LEVEL = {
  ANOMALY: 1,
  FOE: 2
}

// GAME EVENTS
export const EVENT_FIRE_WEAPON = 'FireWeapon';
export const EVENT_BULLET_COLLISION = 'BulletCollision';
export const EVENT_NPC_HIT = 'HitByBullet';
export const EVENT_NPC_DEAD = 'NpcDead';
export const EVENT_CHANGE_GAME_STATE = 'ChangeGamestate';
export const EVENT_HERO_INTERACT = 'HeroInteract';

// REDUX ACTIONS
export const ACTION_CHANGE_GAME_STATE = 'game/changeState';
export const ACTION_UPDATE_HERO_STATE = 'game/changeHeroState';
export const ACTION_UPDATE_NPC_STATE = 'game/changeNpcState';
export const ACTION_RECORD_ENTITY_DAMAGE = 'game/recordEntityDamage';
export const ACTION_SET_NPCS = 'game/setNpcs';
export const ACTION_SET_SCENERY_BLOCKS = 'game/setSceneryBlocks';
export const ACTION_OBJECTIVE_COMPLETED ='game/objectiveCompleted';

// UI EVENTS
export const EVENT_OPEN_MODAL = 'OpenModal';
export const EVENT_CLOSE_MODAL = 'CloseModal';

