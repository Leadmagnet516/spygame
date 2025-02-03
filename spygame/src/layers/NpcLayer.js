import {
  GAME_WIDTH,
  GAME_HEIGHT,
  ENTITY_MOOD,
  ACTION_SET_NPCS
 } from '../CONSTANTS';
import { selectNpcStates, selectSusList } from '../SELECTORS';
import Enemy from '../entities/Enemy';
import { useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NpcLayer(props, ref)  {
  const { initNpcs, boundaryCollision, sceneryCollision, heroCollision, reset } = props;
  const npcStates = useSelector(selectNpcStates);
  const susList = useSelector(selectSusList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: ACTION_SET_NPCS, payload: (initNpcs.map((npc, idx) => {
      return {
        id: `npc_${idx}`,
        ...npc,
        damageTaken: 0,
        alive: true,
        mood: ENTITY_MOOD.OK
      }
    }))})
  }, [])

  // TEMPLATE
  return (
    <div className='npc-layer' style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`
    }}>
      {
        npcStates.map((npc, idx) => {
          return (
            <Enemy key={npc.id} npc={npc} damageTaken={npc.damageTaken} alive={npc.alive} mood={npc.mood} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} heroCollision={heroCollision} susList={susList}></Enemy>
          )
        })
      }
    </div>
  );
}
