import {
  GAME_WIDTH,
  GAME_HEIGHT,
  ENTITY_MOOD,
  ACTION_SET_NPCS
 } from '../CONSTANTS';
import { selectGameInstance, selectNpcStates, selectSusList } from '../SELECTORS';
import Enemy from '../entities/Enemy';
import { useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NpcLayer(props, ref)  {
  const { initNpcs, boundaryCollision, sceneryCollision, entityCollision, resetHash } = props;
  const gameInstance = useSelector(selectGameInstance);
  const npcStates = useSelector(selectNpcStates);
  const susList = useSelector(selectSusList);
  const dispatch = useDispatch();

  const setupNpcs = () => {
    dispatch({ type: ACTION_SET_NPCS, payload: (initNpcs.map((npc, idx) => {
      return {
        id: `npc_${idx}`,
        ...npc,
        damageTaken: 0,
        alive: true,
        mood: ENTITY_MOOD.OK,
        pos: npc.pos || npc.patrol[0].pos
      }
    }))})
  }

  useEffect(() => {
    setupNpcs();
  }, [])

  useEffect(() => {
    setupNpcs();
  }, [gameInstance])

  // TEMPLATE
  return (
    <div className='npc-layer' style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`
    }}>
      {
        npcStates.map((npc, idx) => {
          return npc.kind !== 'ghost' ? (
            <Enemy key={npc.id} npc={npc} damageTaken={npc.damageTaken} alive={npc.alive} mood={npc.mood} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} entityCollision={entityCollision} susList={susList}></Enemy>
          ) : null
        })
      }
    </div>
  );
}
