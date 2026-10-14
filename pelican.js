// 正式结果优先显示；没有结果时显示明确标记的页面示例。
(async () => {
  const home = document.getElementById('pelican-home-grid');
  const gallery = document.getElementById('pelican-gallery');
  if (!home && !gallery) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeAsset = path => typeof path === 'string' && /^pelican-assets\/[A-Za-z0-9_./-]+\.svg$/.test(path) && !path.includes('..');
  try {
    const response = await fetch('pelican.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('加载失败');
    const data = await response.json();
    if (!['1.0.0','1.1.0'].includes(data.schemaVersion)) throw new Error('不支持的测试数据版本');
    const formal = await Promise.all((data.results || []).map(async reference => {
      if (!/^pelican-results\/[a-z0-9][a-z0-9-]*\.json$/.test(reference)) throw new Error('无效的记录路径');
      const response = await fetch(reference, {cache:'no-cache'});
      if (!response.ok) throw new Error('测试记录加载失败');
      const result = await response.json();
      if (!['1.0.0','1.1.0'].includes(result.schemaVersion) || !safeAsset(result.artifact.path) || (result.source && !safeAsset(result.source.path)) || (result.poster && !safeAsset(result.poster.path))) throw new Error('无效的测试记录');
      return {
        id:result.id, title:result.model.name, model:result.model.name, provider:result.model.provider,
        modelId:result.model.id, harness:result.harness, run:result.run,
        svg:result.artifact.path, source:result.source?.path || result.artifact.path,
        width:result.artifact.width, height:result.artifact.height, reference,
        animation:result.animation, poster:result.poster?.path, identitySource:result.model.identitySource,
        date:result.run.generatedAt.slice(0,10), prompt:result.run.prompt, notes:result.run.notes,
        attempt:result.run.attempt, settings:JSON.stringify(result.run.parameters)
      };
    }));
    const examples = (data.examples || []).filter(item => safeAsset(item.svg)).map(item => ({...item, example:true}));
    const entries = formal.length ? formal.map(item => ({...item, example:false})) : examples;
    const notice = document.getElementById(home ? 'pelican-home-notice' : 'pelican-notice');
    if (!formal.length) {
      notice.hidden = false;
      notice.textContent = '版式预览：目前尚未录入正式测试结果，以下图片是页面示例，不代表任何模型的测试表现。';
    }
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    const imagePath = item => paused && item.poster ? item.poster : item.svg;
    function motionState() {
      document.querySelectorAll('img[data-motion-index]').forEach(img => {
        img.src = imagePath(entries[Number(img.dataset.motionIndex)]);
      });
      for (const id of ['pelican-motion-toggle','pelican-detail-motion']) {
        const button = document.getElementById(id);
        if (!button) continue;
        button.textContent = reducedMotion.matches ? '系统减少动态效果' : paused ? '播放动画' : '暂停动画';
        button.disabled = reducedMotion.matches;
        button.setAttribute('aria-pressed', String(paused));
      }
    }
    for (const id of ['pelican-motion-toggle','pelican-detail-motion']) {
      document.getElementById(id)?.addEventListener('click', () => { paused = !paused; motionState(); });
    }
    const motionButton = document.getElementById('pelican-motion-toggle');
    if (motionButton) motionButton.hidden = !entries.some(item => item.animation);
    reducedMotion.addEventListener('change', event => { paused = event.matches; motionState(); });
    motionState();
    const card = (item, index, detail) => {
      const href = detail ? `#result=${encodeURIComponent(item.id)}` : `pelican.html#result=${encodeURIComponent(item.id)}`;
      return `<a class="pelican-card" href="${esc(href)}" ${detail ? `data-result-index="${index}"` : ''} aria-label="查看${esc(item.title || item.model)}${item.example ? '（版式示例）' : ''}">
        <div class="pelican-picture"><img src="${esc(imagePath(item))}" ${item.animation ? `data-motion-index="${index}"` : ''} alt="${esc(item.title || item.model)}：鹈鹕骑自行车${item.example ? '，版式示例' : ''}" loading="lazy" width="${item.width || 640}" height="${item.height || 480}"><span class="pelican-tag ${item.example ? '' : 'result'}">${item.example ? '版式示例' : esc(item.provider || '测试结果')}</span>${item.example ? '' : `<span class="pelican-motion-badge">${item.animation ? '动画' : '静态'}</span>`}</div>
        <div class="pelican-card-caption"><h3>${esc(item.title || item.model)}</h3>${item.harness ? `<div class="pelican-card-harness">${esc(item.harness.name)} · ${item.harness.context === 'fresh' ? '全新对话' : '当前对话'}</div>` : ''}<p><span>${esc(item.example ? '非模型测试结果' : item.date || '日期未记录')}</span><span>查看 ${detail ? '↗' : '→'}</span></p></div></a>`;
    };
    if (home) {
      home.innerHTML = entries.slice(0,3).map((item,index) => card(item,index,false)).join('') || '<p class="pelican-empty">暂无测试结果。</p>';
      return;
    }
    const protocolResponse = await fetch('pelican-test-animated.json');
    if (!protocolResponse.ok) throw new Error('动画协议加载失败');
    document.getElementById('pelican-animated-prompt').textContent = (await protocolResponse.json()).prompt;
    const count = document.getElementById('pelican-count');
    count.textContent = formal.length ? `${formal.length} 个结果` : `0 个正式结果 · ${examples.length} 张示例`;
    document.getElementById('pelican-prompt-label').textContent = formal.length ? '静态测试提示词' : '预设提示词';
    document.getElementById('pelican-prompt-text').textContent = data.prompt;
    const copy = document.getElementById('pelican-copy');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(data.prompt); copy.textContent = '已复制'; }
      catch { copy.textContent = '复制失败，请选中文字复制'; }
      setTimeout(() => { copy.textContent = '复制提示词'; }, 2200);
    });
    const filters = document.getElementById('pelican-filters');
    const groups = [...new Set(entries.map(item => item.example ? item.group : item.provider || '其他'))];
    let selectedGroup = '', selectedKind = '', activeIndex = -1;
    const kinds = document.getElementById('pelican-kinds');
    const visibleIndexes = () => entries.map((item,index) => ({item,index})).filter(({item}) => (!selectedGroup || (item.example ? item.group : item.provider || '其他') === selectedGroup) && (!selectedKind || (item.animation ? 'animated' : 'static') === selectedKind)).map(({index}) => index);
    const render = () => {
      kinds.innerHTML = [['','全部测试'],['static','静态'],['animated','动画']].map(([kind,label]) => `<button type="button" data-kind="${kind}" aria-pressed="${selectedKind === kind}">${label}</button>`).join('');
      filters.innerHTML = ['', ...groups].map(group => `<button type="button" data-group="${esc(group)}" aria-pressed="${selectedGroup === group}">${esc(group || '全部')}</button>`).join('');
      gallery.innerHTML = visibleIndexes().map(index => card(entries[index],index,true)).join('') || '<p class="pelican-empty">没有符合筛选条件的结果。</p>';
    };
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-group]');
      if (!button) return;
      selectedGroup = button.dataset.group; render();
      filters.querySelector('[aria-pressed="true"]').focus();
    });
    kinds.addEventListener('click', event => {
      const button=event.target.closest('[data-kind]'); if (!button) return;
      selectedKind=button.dataset.kind; render(); kinds.querySelector('[aria-pressed="true"]').focus();
    });
    const dialog = document.getElementById('pelican-detail');
    const sourceCode = document.getElementById('pelican-source-code');
    let sourceRequest = 0;
    async function show(index, updateHash = true) {
      const item = entries[index];
      if (!item) return;
      activeIndex = index;
      document.getElementById('pelican-detail-title').textContent = item.title || item.model;
      const tag = document.getElementById('pelican-detail-tag');
      tag.textContent = item.example ? '版式示例 · 非正式测试' : `${item.provider} · ${item.animation ? '动画' : '静态'}测试`;
      tag.classList.toggle('result', !item.example);
      const image = document.getElementById('pelican-detail-image');
      image.src = imagePath(item);
      if (item.animation) image.dataset.motionIndex=index; else delete image.dataset.motionIndex;
      document.getElementById('pelican-detail-motion').hidden = !item.animation;
      motionState(); image.alt = `${item.title || item.model}：鹈鹕骑自行车`;
      const selections = {first:'首次结果', 'best-of-n':'多次择优', all:'全部保留'};
      const processing = {none:'无', 'formatting-only':'仅格式整理', edited:'已修改绘图内容'};
      const metadata = item.example ? [['模型','未绑定模型'],['类型','版式示例']] : [
        ['模型',item.model], ['模型 ID',item.modelId || '未提供'],
        ['型号来源',({'user-reported':'用户提供','system-reported':'系统声明','api-reported':'API 返回'})[item.identitySource] || '未记录'],
        ['测试类型',item.animation ? '动画 SVG' : '静态 SVG'],
        ['Harness',`${item.harness.name} · ${item.harness.version || '版本未提供'}`],
        ['运行模式',item.harness.mode],
        ['上下文',item.harness.context === 'fresh' ? '全新对话' : '当前对话（含历史上下文）'],
        ['工具',item.harness.tools.join('、') || '无'],
        ['生成时间',item.run.generatedAt],
        ['次数',`${item.run.attempt} / ${item.run.totalAttempts} · ${selections[item.run.selection]}`],
        ['后处理',processing[item.run.postProcessing]],
        ['参数',Object.keys(item.run.parameters).length ? JSON.stringify(item.run.parameters) : '未提供']
      ];
      document.getElementById('pelican-metadata').innerHTML = metadata
        .map(([label,value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join('');
      document.getElementById('pelican-detail-note').textContent = item.notes || '';
      document.getElementById('pelican-detail-prompt').textContent = item.example ? '示例图片为页面排版制作，未执行正式模型测试。' : item.prompt || data.prompt;
      const download = document.getElementById('pelican-download');
      download.href = item.source || item.svg; download.setAttribute('download', (item.source || item.svg).split('/').pop());
      const recordLink = document.getElementById('pelican-record-download');
      recordLink.hidden = !item.reference;
      if (item.reference) { recordLink.href = item.reference; recordLink.setAttribute('download', item.reference.split('/').pop()); }
      const indexes = visibleIndexes();
      document.getElementById('pelican-position').textContent = `${indexes.indexOf(index) + 1} / ${indexes.length}`;
      document.getElementById('pelican-previous').disabled = indexes.length < 2;
      document.getElementById('pelican-next').disabled = indexes.length < 2;
      if (!dialog.open) {
        dialog.showModal();
        document.body.classList.add('pelican-modal-open');
      }
      if (updateHash) history.replaceState(null,'',`#result=${encodeURIComponent(item.id)}`);
      document.querySelector('.pelican-source').open = false;
      sourceCode.textContent = '加载中…';
      const request = ++sourceRequest;
      try {
        const response = await fetch(item.source || item.svg);
        if (!response.ok) throw new Error('加载失败');
        const svg = await response.text();
        if (request === sourceRequest) sourceCode.textContent = svg;
      } catch { if (request === sourceRequest) sourceCode.textContent = '源码加载失败，可尝试下载 SVG。'; }
    }
    const step = direction => {
      const indexes = visibleIndexes();
      if (!indexes.length) return;
      show(indexes[(indexes.indexOf(activeIndex) + direction + indexes.length) % indexes.length]);
    };
    gallery.addEventListener('click', event => {
      const link = event.target.closest('[data-result-index]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); show(Number(link.dataset.resultIndex));
    });
    document.getElementById('pelican-close').addEventListener('click', () => dialog.close());
    document.getElementById('pelican-previous').addEventListener('click', () => step(-1));
    document.getElementById('pelican-next').addEventListener('click', () => step(1));
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });
    dialog.addEventListener('keydown', event => { if (event.key==='ArrowLeft' || event.key==='ArrowRight') { event.preventDefault(); step(event.key==='ArrowLeft' ? -1 : 1); } });
    dialog.addEventListener('close', () => {
      ++sourceRequest;
      document.body.classList.remove('pelican-modal-open');
      history.replaceState(null,'',location.pathname + location.search);
    });
    function fromHash() {
      const id = new URLSearchParams(location.hash.slice(1)).get('result');
      const index = entries.findIndex(item => item.id === id);
      if (index >= 0) { selectedGroup=''; selectedKind=''; render(); show(index,false); }
      else if (dialog.open) dialog.close();
    }
    render(); fromHash(); addEventListener('hashchange', fromHash);
  } catch (error) {
    (home || gallery).innerHTML = '<p class="pelican-empty">测试列表加载失败，请刷新重试。</p>';
    console.error(error);
  }
})();
