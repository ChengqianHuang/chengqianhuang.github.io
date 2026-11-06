export const RECENT_KEY = 'arcade-recent-v1';
export const GROUPS = [
  ['action', '动作与射击'], ['physics', '物理与街机'],
  ['driving', '驾驶与飞行'], ['board', '益智与对战']
];
export function homeGames(games) {
  const featured = games.filter(g => Number.isInteger(g.featured) && g.featured > 0)
    .sort((a,b) => a.featured-b.featured).slice(0,2);
  const ids = new Set(featured.map(g => g.id));
  return [...featured, ...games.filter(g => !ids.has(g.id))].slice(0,4);
}
export function gameGroups(games) {
  const groups = GROUPS.map(([id,title]) => ({id,title,games:games.filter(g=>g.category===id)}));
  const known = new Set(GROUPS.map(g=>g[0]));
  const rest = games.filter(g=>!known.has(g.category));
  if(rest.length)groups.push({id:'more',title:'更多游戏',games:rest});
  return groups.filter(g=>g.games.length);
}
export function recentIds(raw) {
  try {const ids=JSON.parse(raw);return Array.isArray(ids)?[...new Set(ids.filter(id=>typeof id==='string'&&id.length<80))].slice(0,4):[];} catch {return [];}
}
export function rememberGame(ids,id) {return [id,...ids.filter(v=>v!==id)].slice(0,4);}
