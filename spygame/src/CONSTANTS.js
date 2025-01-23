export const GRID_SIZE = 48;
export const GRID_WIDTH = 28;
export const GRID_HEIGHT = 18;
export const GAME_WIDTH = GRID_SIZE * GRID_WIDTH;
export const GAME_HEIGHT = GRID_SIZE * GRID_HEIGHT;

export const EVENT_FIRE_WEAPON = 'FireWeapon';
export const EVENT_BULLET_COLLISION = 'BulletCollision';
export const EVENT_NPC_HIT = "HitByBullet";
export const EVENT_SHOW_MODAL = "ShowModal";
export const EVENT_NPC_DEAD = "NpcDead";

export const ENTITY_UPDATE = {
  MOVE: "Move",
  DEAD: "Dead",
  AIM: "Aim"
}


export const ENTITY_MOOD= {
  OK: "OK",
  SUS: "SUS",
  COMBAT: "COMBAT"
}