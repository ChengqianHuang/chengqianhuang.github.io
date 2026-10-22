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
      document.querySelectorAll('img[data-motion-index]').forEach(img => { const path=imagePath(entries[Number(img.dataset.motionIndex)]); if (img.getAttribute('src')!==path) img.src=path; });
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
      const href=`#result=${encodeURIComponent(item.id)}`;
      return `<a class="pelican-card" href="${esc(href)}" data-result-index="${index}" aria-label="查看 ${esc(item.model)} / ${esc(item.harness)}">
        <div class="pelican-picture"><img src="${esc(imagePath(item))}" ${item.animated ? `data-motion-index="${index}"` : ''} alt="${esc(item.model)} 生成的鹈鹕骑自行车" width="${item.width}" height="${item.height}" loading="lazy"></div>
        <div class="pelican-card-caption"><h3>${esc(item.model)}</h3><p>${esc(item.harness)}</p></div></a>`;
    }).join('');
    (home || gallery).innerHTML=cards || '<p class="pelican-empty">暂无结果。</p>';
    motionState();
    const dialog=document.getElementById('pelican-detail');
    let activeIndex=-1;
    let enlargedImage=null;
    let originalPicture=null;
    let closing=false;
    const detailImages=new Map();
    function restoreImage() {
      if (enlargedImage) {
        if (originalPicture) originalPicture.append(enlargedImage);
        else enlargedImage.remove();
      }
      enlargedImage=null;
      originalPicture=null;
    }
    function show(index,updateHash=true) {
      const item=entries[index]; if (!item) return;
      const wasOpen=dialog.open;
      if (activeIndex!==index) {
        restoreImage();
        // Reuse the preview's animation; load other results only when requested.
        const card=(home || gallery).querySelector(`[data-result-index="${index}"]`);
        let image=card?.querySelector('img') || detailImages.get(index);
        if (!image) {
          image=document.createElement('img');
          image.src=imagePath(item);
          image.alt=`${item.model} 生成的鹈鹕骑自行车`;
          image.width=item.width;
          image.height=item.height;
          if (item.animated) image.dataset.motionIndex=String(index);
          detailImages.set(index,image);
        }
        enlargedImage=image;
        originalPicture=image.parentElement;
        document.getElementById('pelican-detail-image').append(image);
      }
      activeIndex=index;
      document.getElementById('pelican-detail-title').textContent=item.model;
      document.getElementById('pelican-detail-harness').textContent=`Harness · ${item.harness}`;
      document.getElementById('pelican-detail-prompt').textContent=item.prompt;
      document.getElementById('pelican-detail-motion').hidden=!item.animated;
      document.getElementById('pelican-detail-nav').hidden=entries.length<2;
      motionState();
      if (!dialog.open) { dialog.showModal(); document.body.classList.add('pelican-modal-open'); }
      if (updateHash) {
        const url=`#result=${encodeURIComponent(item.id)}`;
        if (wasOpen) history.replaceState(history.state,'',url);
        else history.pushState({...history.state,pelicanDetail:true},'',url);
      }
    }
    function requestClose() {
      if (closing) return;
      if (history.state?.pelicanDetail) {
        closing=true;
        history.back();
      } else {
        // A directly opened result has no in-page history entry to return to.
        history.replaceState(history.state,'',location.pathname+location.search);
        dialog.close();
      }
    }
    function step(direction) { if (entries.length) show((activeIndex+direction+entries.length)%entries.length); }
    (home || gallery).addEventListener('click',event=>{
      const link=event.target.closest('[data-result-index]');
      if (!link || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault(); show(Number(link.dataset.resultIndex));
    });
    document.getElementById('pelican-close').addEventListener('click',requestClose);
    dialog.addEventListener('cancel',event=>{ event.preventDefault(); requestClose(); });
    document.getElementById('pelican-previous').addEventListener('click',()=>step(-1));
    document.getElementById('pelican-next').addEventListener('click',()=>step(1));
    dialog.addEventListener('keydown',event=>{
      if (event.key==='ArrowLeft' || event.key==='ArrowRight') { event.preventDefault(); step(event.key==='ArrowLeft' ? -1 : 1); }
    });
    dialog.addEventListener('click',event=>{
      if (event.target!==dialog) return;
      const r=dialog.getBoundingClientRect();
      if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) requestClose();
    });
    dialog.addEventListener('close',()=>{
      restoreImage();
      activeIndex=-1;
      document.body.classList.remove('pelican-modal-open');
    });
    function fromHash() {
      closing=false;
      const id=new URLSearchParams(location.hash.slice(1)).get('result');
      const index=entries.findIndex(item=>item.id===id);
      if (index>=0) show(index,false); else if (dialog.open) dialog.close();
    }
    fromHash(); addEventListener('popstate',fromHash); addEventListener('hashchange',fromHash);
  } catch (error) {
    (home || gallery).innerHTML='<p class="pelican-empty">加载失败，请刷新重试。</p>';
    console.error(error);
  } finally {
    (home || gallery).setAttribute('aria-busy','false');
  }
})();
