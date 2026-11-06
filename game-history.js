import {gameStore} from './game-storage.mjs';
import {RECENT_KEY,recentIds,rememberGame} from './game-catalog.mjs';
const id=document.querySelector('script[data-game-id]')?.dataset.gameId;
if(id){
  const remember=()=>gameStore.set(RECENT_KEY,JSON.stringify(rememberGame(recentIds(gameStore.get(RECENT_KEY)),id)));
  remember();addEventListener('pageshow',e=>{if(e.persisted)remember();});
}
