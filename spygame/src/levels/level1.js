export const Level = {
  Scenery: [
    { pos: { x: 20, y: 10 } },
    { pos: { x: 20, y: 11 } },
    { pos: { x: 20, y: 12 } },
    { pos: { x: 20, y: 13 } },
    { pos: { x: 21, y: 10 } },
  ],
  Npcs: [
    {
      pos: {
        x: 8,
        y: 8
      },
      aim: 0,
      fov: {
        field: Math.PI / 3,
        range: 10
      }
    }/* ,
    {
      pos: {
        x: 20,
        y: 2
      },
      aim: 2,
      fov: {
        field: Math.PI / 3,
        range: 10
      }
    },
    {
      pos: {
        x: 4,
        y: 10
      },
      aim: -1,
      fov: {
        field: Math.PI / 3,
        range: 10
      }
    } */
  ],
  InitHero: {
    pos: {x: 3, y: 3}
  }
}