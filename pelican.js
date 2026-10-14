// 展示层只呈现模型、harness、提示词；完整提交记录与校验独立保存。
(async () => {
  const home = document.getElementById('pelican-home-grid');
  const gallery = document.getElementById('pelican-gallery');
  if (!home && !gallery) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeAsset = path => typeof path === 'string' && /^pelican-assets\/[A-Za-z0-9_./-]+\.svg$/.test(path) && !path.includes('..');
  try {
    const response = await fetch('pelican.json', {cache:'no-cache'});
    if (!response.ok) throw new Error('列表加载失败');
    const data = await response.json();
    if (!['1.0.0','1.1.0'].includes(data.schemaVersion)) throw new Error('不支持的数据版本');
    const entries = await Promise.all(data.results.map(async reference => {
      if (!/^pelican-results\/[a-z0-9][a-z0-9-]*\.json$/.test(reference)) throw new Error('无效的记录路径');
      const response = await fetch(reference, {cache:'no-cache'});
      if (!response.ok) throw new Error('记录加载失败');
      const record = await response.json();
      if (!['1.0.0','1.1.0'].includes(record.schemaVersion) || !safeAsset(record.artifact.path) || (record.poster && !safeAsset(record.poster.path))) throw new Error('无效的记录');
      return {id:record.id, model:record.model.name, harness:record.harness.name,
        prompt:record.run.prompt, svg:record.artifact.path, poster:record.poster?.path,
        animated:Boolean(record.animation), width:record.artifact.width, height:record.artifact.height};
    }));
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    const imagePath = item => paused && item.poster ? item.poster : item.svg;
    function motionState() {
      document.querySelectorAll('img[data-motion-index]').forEach(img => { img.src=imagePath(entries[Number(img.dataset.motionIndex)]); });
      for (const id of ['pelican-motion-toggle','pelican-detail-motion']) {
        const button=document.getElementById(id);
        if (!button) continue;
        button.textContent=paused ? '播放' : '暂停';
        button.disabled=reducedMotion.matches;
        button.setAttribute('aria-pressed',String(paused));
      }
    }
    for (const id of ['pelican-motion-toggle','pelican-detail-motion']) {
      document.getElementById(id)?.addEventListener('click',()=>{ paused=!paused; motionState(); });
    }
    const motionButton=document.getElementById('pelican-motion-toggle');
    motionButton.hidden=!entries.some(item=>item.animated);
    reducedMotion.addEventListener('change',event=>{ paused=event.matches; motionState(); });
    const cards=entries.slice(0,home ? 3 : entries.length).map((item,index)=>{
      const href=home ? `pelican.html?v=1.1.1#result=${encodeURIComponent(item.id)}` : `#result=${encodeURIComponent(item.id)}`;
      return `<a class="pelican-card" href="${esc(href)}" ${gallery ? `data-result-index="${index}"` : ''} aria-label="查看 ${esc(item.model)} / ${esc(item.harness)}">
        <div class="pelican-picture"><img src="${esc(imagePath(item))}" ${item.animated ? `data-motion-index="${index}"` : ''} alt="${esc(item.model)} 生成的鹈鹕骑自行车" width="${item.width}" height="${item.height}" loading="lazy"></div>
        <div class="pelican-card-caption"><h3>${esc(item.model)}</h3><p>${esc(item.harness)}</p></div></a>`;
    }).join('');
    (home || gallery).innerHTML=cards || '<p class="pelican-empty">暂无结果。</p>';
    motionState();
    if (home) return;
    const dialog=document.getElementById('pelican-detail');
    let activeIndex=-1;
    function show(index,updateHash=true) {
      const item=entries[index]; if (!item) return;
      activeIndex=index;
      document.getElementById('pelican-detail-title').textContent=item.model;
      document.getElementById('pelican-detail-harness').textContent=`Harness · ${item.harness}`;
      document.getElementById('pelican-detail-prompt').textContent=item.prompt;
      const image=document.getElementById('pelican-detail-image');
      image.src=imagePath(item); image.alt=`${item.model} 生成的鹈鹕骑自行车`;
      if (item.animated) image.dataset.motionIndex=index; else delete image.dataset.motionIndex;
      document.getElementById('pelican-detail-motion').hidden=!item.animated;
      document.getElementById('pelican-detail-nav').hidden=entries.length<2;
      motionState();
      if (!dialog.open) { dialog.showModal(); document.body.classList.add('pelican-modal-open'); }
      if (updateHash) history.replaceState(null,'',`#result=${encodeURIComponent(item.id)}`);
    }
    function step(direction) { if (entries.length) show((activeIndex+direction+entries.length)%entries.length); }
    gallery.addEventListener('click',event=>{
      const link=event.target.closest('[data-result-index]');
      if (!link || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault(); show(Number(link.dataset.resultIndex));
    });
    document.getElementById('pelican-close').addEventListener('click',()=>dialog.close());
    document.getElementById('pelican-previous').addEventListener('click',()=>step(-1));
    document.getElementById('pelican-next').addEventListener('click',()=>step(1));
    dialog.addEventListener('keydown',event=>{
      if (event.key==='ArrowLeft' || event.key==='ArrowRight') { event.preventDefault(); step(event.key==='ArrowLeft' ? -1 : 1); }
    });
    dialog.addEventListener('click',event=>{
      if (event.target!==dialog) return;
      const r=dialog.getBoundingClientRect();
      if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();
    });
    dialog.addEventListener('close',()=>{
      document.body.classList.remove('pelican-modal-open');
      history.replaceState(null,'',location.pathname+location.search);
    });
    function fromHash() {
      const id=new URLSearchParams(location.hash.slice(1)).get('result');
      const index=entries.findIndex(item=>item.id===id);
      if (index>=0) show(index,false); else if (dialog.open) dialog.close();
    }
    fromHash(); addEventListener('hashchange',fromHash);
  } catch (error) {
    (home || gallery).innerHTML='<p class="pelican-empty">加载失败，请刷新重试。</p>';
    console.error(error);
  }
})();
