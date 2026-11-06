// The homepage and collection share the catalog, but choose their own presentation.
(async () => {
  const catalogs=document.querySelectorAll('[data-game-catalog]');
  if(!catalogs.length)return;
  try{
    const [{homeGames,gameGroups,recentIds,RECENT_KEY},{gameStore},response]=await Promise.all([
      import('./game-catalog.mjs'),import('./game-storage.mjs'),fetch('/games.json',{cache:'no-cache'})
    ]);
    if(!response.ok)throw Error(`HTTP ${response.status}`);
    const games=await response.json();if(!Array.isArray(games))throw Error('Invalid game catalog');
    function card(game,label=''){
      const a=document.createElement('a');a.className='game-card';a.href=game.url;a.setAttribute('aria-label',`玩${game.title}`);
      const picture=document.createElement('div');picture.className='game-cover';
      const image=document.createElement('img');Object.assign(image,{src:game.cover,alt:'',width:720,height:440,loading:'lazy',decoding:'async'});picture.append(image);
      if(label){const badge=document.createElement('span');badge.className='game-badge';badge.textContent=label;picture.append(badge);}
      const body=document.createElement('div');body.className='game-card-body';
      const name=document.createElement('h3');name.textContent=game.title;
      const description=document.createElement('p');description.className='game-description';description.textContent=game.description;
      const controls=document.createElement('p');controls.className='game-controls';controls.textContent=game.controls;
      const play=document.createElement('span');play.className='game-play';play.textContent='开始玩 →';
      body.append(name,description,controls,play);a.append(picture,body);return a;
    }
    for(const catalog of catalogs){
      if(catalog.dataset.gameCatalog==='collection'){
        catalog.classList.remove('games-grid');const groups=gameGroups(games),nav=document.createElement('nav');nav.className='game-group-nav';nav.setAttribute('aria-label','游戏分类');
        const sections=groups.map(group=>{
          const section=document.createElement('section');section.className='game-group';section.id=`group-${group.id}`;
          const h=document.createElement('h2');h.textContent=group.title;section.setAttribute('aria-labelledby',h.id=`title-${group.id}`);
          const count=document.createElement('span');count.textContent=`${group.games.length} 款`;h.append(count);
          const grid=document.createElement('div');grid.className='games-grid';grid.append(...group.games.map(g=>card(g)));section.append(h,grid);
          const link=document.createElement('a');link.href=`#${section.id}`;link.textContent=group.title;nav.append(link);return section;
        });catalog.replaceChildren(nav,...sections);
      }else{
        const chosen=homeGames(games);catalog.replaceChildren(...chosen.map((g,i)=>card(g,i<2&&g.featured>0?'精选':'最新加入')));
      }
      catalog.setAttribute('aria-busy','false');
    }
    const recent=document.getElementById('recent-games');
    if(recent){
      function renderRecent(){
        const ids=recentIds(gameStore.get(RECENT_KEY)),list=document.getElementById('recent-links');
        const known=ids.map(id=>games.find(g=>g.id===id)).filter(Boolean);
        list.replaceChildren(...known.map(g=>{const a=document.createElement('a');a.href=g.url;a.textContent=`${g.title} ↗`;return a;}));recent.hidden=!known.length;
      }
      document.getElementById('clear-recent').onclick=()=>{gameStore.set(RECENT_KEY,'[]');renderRecent();};
      renderRecent();addEventListener('pageshow',renderRecent);addEventListener('storage',renderRecent);
    }
  }catch(error){
    for(const catalog of catalogs){const a=document.createElement('a');a.href='/games/breakout.html';a.textContent='游戏列表暂时加载失败，先玩打砖块 →';catalog.replaceChildren(a);catalog.setAttribute('aria-busy','false');}
    console.error('Game catalog:',error);
  }
})();
