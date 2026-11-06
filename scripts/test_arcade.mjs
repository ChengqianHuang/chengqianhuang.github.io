import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {homeGames,gameGroups,recentIds,rememberGame} from '../game-catalog.mjs';
import {createSafeStore} from '../game-storage.mjs';
const games=JSON.parse(readFileSync(new URL('../games.json',import.meta.url)));
assert.equal(new Set(games.map(g=>g.id)).size,games.length);
for(const g of games){for(const field of ['url','cover'])assert(existsSync(new URL('..'+g[field].split('?')[0],import.meta.url)),g[field]);
 const page=readFileSync(new URL('..'+g.url,import.meta.url),'utf8');assert(page.includes(`data-game-id="${g.id}"`),'history missing: '+g.id);}
const home=homeGames(games);assert.equal(home.length,4);assert.equal(new Set(home.map(g=>g.id)).size,4);
assert.deepEqual(home.slice(0,2).map(g=>g.id),['demolition','harbor-rush']);
const next={id:'future',title:'Future',category:'unknown'};
assert.equal(homeGames([next,...games])[2].id,'future','a new submission must reach the homepage');
assert.equal(homeGames([next,...games])[0].id,'demolition','new submissions must not displace featured games');
const grouped=gameGroups([next,...games]);assert.equal(grouped.flatMap(g=>g.games).length,games.length+1);assert.equal(grouped.at(-1).games[0],next);
assert.deepEqual(recentIds('{oops'),[]);assert.deepEqual(recentIds('{}'),[]);
assert.deepEqual(recentIds('["a","a",null,"b",1,"c","d","e"]'),['a','b','c','d']);
assert.deepEqual(rememberGame(['a','b','c','d'],'b'),['b','a','c','d']);
// Disabled storage and quota failure must not interrupt initialization, saving or same-page progress.
const denied=createSafeStore(()=>{throw Error('SecurityError');});assert.equal(denied.get('unlocked'),null);assert.equal(denied.set('unlocked',3),false);assert.equal(denied.get('unlocked'),'3');
const map=new Map([['best','9']]);const quota=createSafeStore(()=>({getItem:k=>map.get(k),setItem:()=>{throw Error('QuotaExceededError');}}));assert.equal(quota.get('best'),'9');quota.set('best',8);assert.equal(quota.get('best'),'8');
const live=createSafeStore(()=>({getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)}));live.set('recent','[]');map.set('recent','["a"]');assert.equal(live.get('recent'),'["a"]','back navigation must see fresh history, not stale memory');
console.log(`Arcade: ${games.length} entries, featured/new selection, future categories, history and unavailable storage passed.`);
