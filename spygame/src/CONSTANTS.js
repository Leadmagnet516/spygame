export const GRID_SIZE = 48;
export const GRID_WIDTH = 24;
export const GRID_HEIGHT = 16;
export const GAME_WIDTH = GRID_SIZE * GRID_WIDTH;
export const GAME_HEIGHT = GRID_SIZE * GRID_HEIGHT;
export const TICK_MS = 80;

// GAME EVENTS
export const EVENT_FIRE_WEAPON = 'FireWeapon';
export const EVENT_BULLET_COLLISION = 'BulletCollision';
export const EVENT_NPC_HIT = "HitByBullet";
export const EVENT_NPC_DEAD = "NpcDead";
export const EVENT_CHANGE_GAME_STATE = "ChangeGamestate";

// REDUX ACTIONS
export const ACTION_CHANGE_GAME_STATE = "game/changeState";

// UI EVENTS
export const EVENT_OPEN_MODAL = "OpenModal";
export const EVENT_CLOSE_MODAL = "CloseModal";

export const ENTITY_UPDATE = {
  MOVE: "Move",
  DEAD: "Dead",
  AIM: "Aim"
}

export const ENTITY_MOOD = {
  OK: "OK",
  SUS: "SUS",
  COMBAT: "COMBAT"
}

export const APP_STATE = {
  SPLASH: "SplashScreenState",
  GAME: "GameScreenState",
  MODAL: "ModalState",
  NULL: "NullState"
}

export const GAME_STATE = {
  INACTIVE: "InactiveState",
  ACTIVE: "ActiveState",
  PAUSED: "PausedState",
  NULL: "NullState"
}