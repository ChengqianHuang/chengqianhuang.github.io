// Both the homepage and collection read the same ordered game catalog.
(async () => {
  const catalogs = document.querySelectorAll('[data-game-catalog]');
  if (!catalogs.length) return;
  try {
    const response = await fetch('/games.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const games = await response.json();
    if (!Array.isArray(games)) throw new Error('Invalid game catalog');
    for (const catalog of catalogs) {
      const limit = Number(catalog.dataset.limit) || games.length;
      const cards = games.slice(0, limit).map(game => {
        const card = document.createElement('a');
        card.className = 'game-card';
        card.href = game.url;
        card.setAttribute('aria-label', `玩${game.title}`);
        const picture = document.createElement('div');
        picture.className = 'game-cover';
        const image = document.createElement('img');
        image.src = game.cover;
        image.alt = '';
        image.width = 720;
        image.height = 440;
        picture.append(image);
        const body = document.createElement('div');
        body.className = 'game-card-body';
        const name = document.createElement('h3');
        name.textContent = game.title;
        const description = document.createElement('p');
        description.className = 'game-description';
        description.textContent = game.description;
        const controls = document.createElement('p');
        controls.className = 'game-controls';
        controls.textContent = game.controls;
        const play = document.createElement('span');
        play.className = 'game-play';
        play.textContent = '开始玩 →';
        body.append(name, description, controls, play);
        card.append(picture, body);
        return card;
      });
      catalog.replaceChildren(...cards);
      if (!cards.length) catalog.textContent = '游戏还在准备中。';
      catalog.setAttribute('aria-busy', 'false');
    }
  } catch (error) {
    for (const catalog of catalogs) {
      const fallback = document.createElement('a');
      fallback.href = '/games/breakout.html';
      fallback.textContent = '游戏列表暂时加载失败，先玩打砖块 →';
      catalog.replaceChildren(fallback);
      catalog.setAttribute('aria-busy', 'false');
    }
    console.error('Game catalog:', error);
  }
})();
