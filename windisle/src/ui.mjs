// 风屿 - HUD 与界面绑定。只操作 DOM，不接触游戏规则。
import { UPGRADES } from './engine.mjs';

const $ = (id) => document.getElementById(id);

export class UI {
  constructor(state) {
    this.el = {
      loading: $('loading'), loadingStatus: $('loading-status'),
      menu: $('menu'), start: $('start'), best: $('best-record'),
      hud: $('hud'), hpFill: $('hp-fill'), hpText: $('hp-text'), energyFill: $('energy-fill'),
      dashPips: $('dash-pips'), waveLabel: $('wave-label'), score: $('score'),
      bossBar: $('boss-bar'), bossFill: $('boss-fill'), bossName: $('boss-name'),
      banner: $('banner'), pauseButton: $('pause-button'),
      upgrade: $('upgrade'), upgradeTitle: $('upgrade-title'), upgradeEyebrow: $('upgrade-eyebrow'), cards: $('upgrade-cards'),
      pause: $('pause'), resume: $('resume'), restart: $('restart'), menuButton: $('menu-button'),
      result: $('result'), resultLabel: $('result-label'), resultTitle: $('result-title'), resultNote: $('result-note'),
      resultScore: $('result-score'), resultWave: $('result-wave'), resultKills: $('result-kills'),
      again: $('again'), resultMenu: $('result-menu'),
      failure: $('failure'), failureMessage: $('failure-message'),
      sound: $('sound'), fullscreen: $('fullscreen'),
      touch: $('touch-controls'), burst: $('touch-burst'),
    };
    this.onUpgradePick = null;
    this.on = { start: null, resume: null, restart: null, menu: null, pause: null, sound: null, fullscreen: null };
    this.best = this.loadBest();

    this.el.start?.addEventListener('click', () => this.on.start?.());
    this.el.again.addEventListener('click', () => this.on.start?.());
    this.el.restart.addEventListener('click', () => this.on.restart?.());
    this.el.resume.addEventListener('click', () => this.on.resume?.());
    this.el.pauseButton.addEventListener('click', () => this.on.pause?.());
    this.el.menuButton.addEventListener('click', () => this.on.menu?.());
    this.el.resultMenu.addEventListener('click', () => this.on.menu?.());
    this.el.sound.addEventListener('click', () => this.on.sound?.());
    this.el.fullscreen.addEventListener('click', () => this.on.fullscreen?.());

    const coarse = matchMedia('(pointer: coarse)');
    this.touchMode = coarse.matches;
    coarse.addEventListener?.('change', (e) => { this.touchMode = e.matches; });
  }

  loadBest() {
    try { return JSON.parse(localStorage.getItem('windisle-best')) || { score: 0, wave: 0 }; }
    catch { return { score: 0, wave: 0 }; }
  }

  saveBest(b) {
    try { localStorage.setItem('windisle-best', JSON.stringify(b)); } catch { /* 忽略 */ }
    this.best = b;
  }

  showLoading(msg) { this.el.loading.hidden = false; if (msg) this.el.loadingStatus.textContent = msg; }
  hideLoading() { this.el.loading.hidden = true; }

  showMenu() {
    this.el.menu.hidden = false;
    this.el.hud.hidden = true;
    this.el.upgrade.hidden = true;
    this.el.pause.hidden = true;
    this.el.result.hidden = true;
    this.refreshBest();
  }

  refreshBest() {
    const b = this.best;
    this.el.best.textContent = b.score > 0 ? `最佳战绩 · ${b.score} 分 / 第 ${b.wave} 波` : '';
  }

  startRun() {
    this.el.menu.hidden = true;
    this.el.result.hidden = true;
    this.el.upgrade.hidden = true;
    this.el.pause.hidden = true;
    this.el.hud.hidden = false;
    this.el.touch.hidden = !this.touchMode;
  }

  updateHUD(state) {
    const p = state.player;
    const hpK = Math.max(0, p.hp / p.maxHp);
    this.el.hpFill.style.width = `${hpK * 100}%`;
    this.el.hpFill.classList.toggle('low', hpK < 0.3);
    this.el.hpText.textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;
    this.el.energyFill.style.width = `${p.energy}%`;
    this.el.energyFill.classList.toggle('full', p.energy >= 100);
    this.el.waveLabel.textContent = `第 ${state.wave} 波`;
    this.el.score.textContent = `${state.score}`;
    // 冲刺充能
    const want = p.stats.dashMax;
    while (this.el.dashPips.children.length < want) this.el.dashPips.appendChild(document.createElement('i'));
    while (this.el.dashPips.children.length > want) this.el.dashPips.lastChild.remove();
    [...this.el.dashPips.children].forEach((pip, i) => pip.classList.toggle('on', i < p.dashCharges));
    this.el.burst.classList.toggle('ready', p.energy >= 100);
    // Boss 血条
    const boss = state.enemies.find((e) => e.type === 'boss');
    if (boss) {
      this.el.bossBar.hidden = false;
      this.el.bossFill.style.width = `${Math.max(0, boss.hp / boss.maxHp) * 100}%`;
      this.el.bossName.textContent = `风暴之心 · ${['一', '二', '三'][boss.bossPhase - 1]}阶段`;
    } else this.el.bossBar.hidden = true;
  }

  banner(text) {
    const el = this.el.banner;
    el.hidden = false;
    el.textContent = text;
    el.style.animation = 'none';
    void el.offsetWidth; // 重启动画
    el.style.animation = '';
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => { el.hidden = true; }, 2000);
  }

  showUpgrade(waveN, offer, taken) {
    this.el.upgradeEyebrow.textContent = waveN % 3 === 0 ? 'BOSS DOWN / 风暴退散' : 'WAVE CLEAR / 波次肃清';
    this.el.upgradeTitle.textContent = waveN % 3 === 0 ? '风暴之心倒下了' : '第 ' + waveN + ' 波已肃清';
    this.el.cards.innerHTML = '';
    offer.forEach((id, i) => {
      const u = UPGRADES.find((x) => x.id === id);
      const card = document.createElement('button');
      card.className = 'upgrade-card';
      card.innerHTML = `<span class="u-key">${i + 1}</span><span class="u-name">${u.name}</span><span class="u-desc">${u.desc}</span><span class="u-count">已持有 ${taken[id] || 0} / ${u.max}</span>`;
      card.addEventListener('click', () => this.onUpgradePick?.(id));
      this.el.cards.appendChild(card);
    });
    this.el.upgrade.hidden = false;
  }

  hideUpgrade() { this.el.upgrade.hidden = true; }

  showPause() { this.el.pause.hidden = false; }
  hidePause() { this.el.pause.hidden = true; }

  showResult(state, isBest) {
    this.el.resultScore.textContent = state.score;
    this.el.resultWave.textContent = state.wave;
    this.el.resultKills.textContent = state.kills;
    if (isBest) this.el.resultNote.textContent = '新的最佳战绩！';
    else if (this.best.score > 0) this.el.resultNote.textContent = `最佳战绩 · ${this.best.score} 分 / 第 ${this.best.wave} 波`;
    else this.el.resultNote.textContent = '守住一波，战绩自会记录。';
    this.el.result.hidden = false;
    this.el.hud.hidden = true;
  }

  setSound(on) { this.el.sound.textContent = on ? '声音：开' : '声音：关'; this.el.sound.setAttribute('aria-pressed', String(on)); }

  fail(message) {
    this.el.loading.hidden = true;
    this.el.failureMessage.textContent = message;
    this.el.failure.hidden = false;
  }
}
