// 时滞行动 CHRONOSTASIS —— 确定性规则引擎。
// 核心规则：玩家静止时全世界静止（子弹悬停、敌人不动），只有玩家移动才推进世界时间。
// 玩家身体、开火冷却和投掷冷却走真实时间；其余一切（敌人、子弹、投掷物、拾取动画、
// 敌人反应计时）都走 worldDt = dt * timeScale。渲染层只读取状态，不修改规则。

export const STEP = 1 / 120;
export const WIDTH = 1280;
export const HEIGHT = 720;

const PLAYER_RADIUS = 14;
const PLAYER_SPEED = 250;
const BULLET_RADIUS = 4;
const THROW_RADIUS = 9;
const ENEMY_RADIUS = 14;
const RUSHER_RADIUS = 13;
const THROW_SPEED = 640;

const WEAPONS = {
  pistol: { name: '手枪', ammo: 8, cooldown: 0.34, auto: false, pellets: 1, spread: 0.02, speed: 480 },
  smg: { name: '冲锋枪', ammo: 16, cooldown: 0.1, auto: true, pellets: 1, spread: 0.07, speed: 440 },
  shotgun: { name: '霰弹枪', ammo: 5, cooldown: 0.8, auto: false, pellets: 5, spread: 0.2, speed: 420 },
};

const ENEMIES = {
  gunner: { radius: ENEMY_RADIUS, speed: 120, range: 640, cooldown: 1.5, turn: 3.6, bulletSpeed: 240, drops: 'pistol', dropAmmo: 5 },
  shotgunner: { radius: ENEMY_RADIUS, speed: 100, range: 400, cooldown: 2.3, turn: 3.0, bulletSpeed: 220, drops: 'shotgun', dropAmmo: 3 },
  rusher: { radius: RUSHER_RADIUS, speed: 285, range: 0, cooldown: 0, turn: 6, bulletSpeed: 0, drops: null, dropAmmo: 0 },
};

const REACTION_TIME = 0.4; // 开局敌人反应时间（世界时间）
const STUN_TIME = 1.8; // 被投掷武器击中后的眩晕（世界时间）
const RUSHER_REACH = 34; // 冲锋者近身判定距离
const BULLET_LIFE = 3;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const hypot = Math.hypot;

function angleDiff(a, b) {
  let d = (a - b) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// 线段与矩形相交（Liang-Barsky 裁剪），用于视线判定。
function segmentHitsRect(ax, ay, bx, by, r) {
  const x0 = r.x, y0 = r.y, x1 = r.x + r.w, y1 = r.y + r.h;
  let t0 = 0, t1 = 1;
  const dx = bx - ax, dy = by - ay;
  const edges = [
    [-dx, ax - x0], [dx, x1 - ax],
    [-dy, ay - y0], [dy, y1 - ay],
  ];
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) {
      if (t > t1) return false;
      if (t > t0) t0 = t;
    } else {
      if (t < t0) return false;
      if (t < t1) t1 = t;
    }
  }
  return true;
}

// 圆与矩形推挤：返回修正后的位置。
function resolveCircleRect(x, y, radius, r) {
  const cx = clamp(x, r.x, r.x + r.w);
  const cy = clamp(y, r.y, r.y + r.h);
  const dx = x - cx, dy = y - cy;
  const d2 = dx * dx + dy * dy;
  if (d2 > radius * radius) return null;
  if (d2 > 1e-9) {
    const d = Math.sqrt(d2);
    return { x: cx + (dx / d) * radius, y: cy + (dy / d) * radius };
  }
  // 圆心在矩形内部：沿最浅轴推出。
  const left = x - r.x, right = r.x + r.w - x, top = y - r.y, bottom = r.y + r.h - y;
  const m = Math.min(left, right, top, bottom);
  if (m === left) return { x: r.x - radius, y };
  if (m === right) return { x: r.x + r.w + radius, y };
  if (m === top) return { x, y: r.y - radius };
  return { x, y: r.y + r.h + radius };
}

function circleRectOverlap(x, y, radius, r) {
  const cx = clamp(x, r.x, r.x + r.w);
  const cy = clamp(y, r.y, r.y + r.h);
  const dx = x - cx, dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

// ---------- 关卡 ----------
// 坐标在 1280×720 的竞技场内；walls 为内部掩体，边界由引擎负责。
export const LEVELS = [
  {
    name: '第一次静止',
    hint: '站立不动，世界完全静止。移动的瞬间，时间才开始流动。',
    player: { x: 240, y: 360 },
    startWeapon: { kind: 'pistol', ammo: 8 },
    weapons: [],
    enemies: [{ kind: 'gunner', x: 1040, y: 360 }],
    walls: [],
  },
  {
    name: '交叉火力',
    hint: '利用掩体阻挡视线。你站定时，飞到一半的子弹会停在空中。',
    player: { x: 200, y: 360 },
    startWeapon: { kind: 'pistol', ammo: 8 },
    weapons: [],
    enemies: [
      { kind: 'gunner', x: 940, y: 160 },
      { kind: 'gunner', x: 940, y: 560 },
    ],
    walls: [
      { x: 600, y: 0, w: 36, h: 264 },
      { x: 600, y: 456, w: 36, h: 264 },
    ],
  },
  {
    name: '空手',
    hint: '赤手空拳：先去捡枪。没有武器时无法开火，也无法投掷。',
    player: { x: 170, y: 610 },
    weapons: [{ kind: 'pistol', x: 420, y: 380, ammo: 8 }],
    enemies: [
      { kind: 'gunner', x: 700, y: 130 },
      { kind: 'gunner', x: 1000, y: 540 },
    ],
    walls: [{ x: 520, y: 250, w: 220, h: 30 }],
  },
  {
    name: '冲锋者',
    hint: '红色三角会朝你冲刺，贴身即死。它们也受时间法则约束。',
    player: { x: 200, y: 360 },
    weapons: [{ kind: 'smg', x: 260, y: 560, ammo: 16 }],
    enemies: [
      { kind: 'gunner', x: 1080, y: 360 },
      { kind: 'rusher', x: 720, y: 180 },
      { kind: 'rusher', x: 720, y: 540 },
    ],
    walls: [{ x: 860, y: 300, w: 30, h: 120 }],
  },
  {
    name: '霰弹走廊',
    hint: '霰弹一次五发。贴近掩体卡视线，等枪口偏开再探头。',
    player: { x: 130, y: 360 },
    startWeapon: { kind: 'pistol', ammo: 8 },
    weapons: [],
    enemies: [
      { kind: 'shotgunner', x: 640, y: 360 },
      { kind: 'gunner', x: 1160, y: 360 },
    ],
    walls: [
      { x: 420, y: 0, w: 30, h: 280 },
      { x: 420, y: 440, w: 30, h: 280 },
      { x: 840, y: 220, w: 30, h: 280 },
    ],
  },
  {
    name: '投掷课',
    hint: '弹药有限时，把枪扔出去：击中敌人会缴械并眩晕它，掉落的枪可以捡。',
    player: { x: 200, y: 360 },
    startWeapon: { kind: 'pistol', ammo: 3 },
    weapons: [{ kind: 'smg', x: 640, y: 360, ammo: 16 }],
    enemies: [
      { kind: 'gunner', x: 860, y: 200 },
      { kind: 'gunner', x: 860, y: 520 },
    ],
    walls: [{ x: 520, y: 120, w: 30, h: 180 }, { x: 520, y: 420, w: 30, h: 180 }],
  },
  {
    name: '时间墙',
    hint: '三支枪口形成交叉。站定观察每条弹道，逐个引出、逐个解决。',
    player: { x: 170, y: 360 },
    weapons: [{ kind: 'pistol', x: 300, y: 620, ammo: 8 }],
    enemies: [
      { kind: 'gunner', x: 920, y: 150 },
      { kind: 'gunner', x: 1060, y: 360 },
      { kind: 'gunner', x: 920, y: 570 },
    ],
    walls: [
      { x: 560, y: 120, w: 200, h: 28 },
      { x: 560, y: 572, w: 200, h: 28 },
    ],
  },
  {
    name: '快递',
    hint: '冲锋枪火力压制，但注意侧翼的三角。别在开阔地停下太久——你已经不是静止的了。',
    player: { x: 150, y: 620 },
    weapons: [{ kind: 'smg', x: 220, y: 520, ammo: 16 }],
    enemies: [
      { kind: 'shotgunner', x: 1140, y: 140 },
      { kind: 'rusher', x: 620, y: 320 },
      { kind: 'rusher', x: 900, y: 600 },
      { kind: 'rusher', x: 460, y: 130 },
    ],
    walls: [
      { x: 380, y: 380, w: 300, h: 28 },
      { x: 820, y: 260, w: 28, h: 260 },
    ],
  },
  {
    name: '环阵',
    hint: '四面都是枪口。枪就在手边，捡起后沿切线走位，让敌人互相挡住彼此的子弹。',
    player: { x: 640, y: 360 },
    weapons: [{ kind: 'pistol', x: 720, y: 360, ammo: 8 }],
    enemies: [
      { kind: 'gunner', x: 640, y: 90 },
      { kind: 'gunner', x: 640, y: 630 },
      { kind: 'gunner', x: 150, y: 360 },
      { kind: 'gunner', x: 1130, y: 360 },
    ],
    walls: [],
  },
  {
    name: '裂隙核心',
    hint: '最后一关。所有法则同时生效——祝你好运。',
    player: { x: 150, y: 360 },
    startWeapon: { kind: 'pistol', ammo: 8 },
    weapons: [{ kind: 'smg', x: 320, y: 360, ammo: 16 }],
    enemies: [
      { kind: 'shotgunner', x: 1120, y: 150 },
      { kind: 'shotgunner', x: 1120, y: 570 },
      { kind: 'gunner', x: 760, y: 360 },
      { kind: 'rusher', x: 520, y: 120 },
      { kind: 'rusher', x: 520, y: 600 },
    ],
    walls: [
      { x: 560, y: 250, w: 28, h: 220 },
      { x: 900, y: 0, w: 28, h: 200 },
      { x: 900, y: 520, w: 28, h: 200 },
    ],
  },
];

export class ChronoGame {
  constructor({ random = Math.random } = {}) {
    this.random = random;
    this.state = 'menu'; // menu | playing | dead | clear | complete
    this.paused = false;
    this.levelIndex = 0;
    this.timeScale = 0; // 上一帧的世界时间流速，供渲染读取
    this.session = { deaths: 0, kills: 0, clears: 0 };
    this.stats = this.#emptyStats();
    this.events = [];
    // menu 状态下的空世界，供渲染层安全读取
    this.walls = [];
    this.enemies = [];
    this.bullets = [];
    this.projectiles = [];
    this.pickups = [];
    this.player = null;
    this.simTime = 0;
    this.levelTime = 0;
  }

  #emptyStats() {
    return { time: 0, shots: 0, throws: 0, kills: 0 };
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get levelName() {
    return this.level.name;
  }

  get enemiesLeft() {
    return this.enemies.filter((e) => e.alive).length;
  }

  get unlockedCoverHint() {
    return this.level.hint;
  }

  start(levelIndex = 0) {
    this.levelIndex = clamp(levelIndex, 0, LEVELS.length - 1);
    this.loadLevel(this.levelIndex);
  }

  loadLevel(index) {
    const level = LEVELS[clamp(index, 0, LEVELS.length - 1)];
    this.levelIndex = LEVELS.indexOf(level);
    this.walls = level.walls.map((w) => ({ ...w }));
    this.enemies = level.enemies.map((e) => this.#makeEnemy(e));
    this.bullets = [];
    this.projectiles = []; // 被投掷的武器
    this.pickups = level.weapons.map((w) => ({ kind: w.kind, x: w.x, y: w.y, ammo: w.ammo, t: 0 }));
    const spec = level.player;
    this.player = {
      x: spec.x, y: spec.y, vx: 0, vy: 0, speed: 0,
      aim: Math.atan2(360 - spec.y, 640 - spec.x),
      weapon: level.startWeapon ? { kind: level.startWeapon.kind, ammo: level.startWeapon.ammo } : null,
      fireCooldown: 0, throwCooldown: 0, fireHeld: false, throwHeld: false, alive: true,
    };
    this.state = 'playing';
    this.paused = false;
    this.timeScale = 0;
    this.stats = this.#emptyStats();
    this.simTime = 0; // 世界时间（受时间法则影响的时间）
    this.levelTime = 0; // 关卡真实时间
    this.events.length = 0;
    this.events.push({ type: 'level-start', index: this.levelIndex, name: level.name });
  }

  restart() {
    this.loadLevel(this.levelIndex);
  }

  nextLevel() {
    if (this.levelIndex + 1 >= LEVELS.length) {
      this.state = 'complete';
      this.events.push({ type: 'complete' });
      return false;
    }
    this.loadLevel(this.levelIndex + 1);
    return true;
  }

  #makeEnemy(spec) {
    const def = ENEMIES[spec.kind];
    return {
      kind: spec.kind, x: spec.x, y: spec.y, vx: 0, vy: 0,
      aim: Math.atan2(360 - spec.y, 640 - spec.x),
      alive: true, stun: 0, react: REACTION_TIME,
      cooldown: def.cooldown * (0.5 + this.random() * 0.5),
      strafe: this.random() < 0.5 ? 1 : -1,
      moving: false, moveTimer: 1.6 + this.random() * 2,
    };
  }

  losClear(ax, ay, bx, by) {
    for (const w of this.walls) {
      if (segmentHitsRect(ax, ay, bx, by, w)) return false;
    }
    return true;
  }

  // input: { moveX, moveY, aimX, aimY, fire, throw }
  step(dt, input = {}) {
    if (this.paused) return;
    if (this.state !== 'playing') return;
    let remaining = Math.min(dt, 0.1);
    while (remaining > 1e-6) {
      const h = Math.min(STEP, remaining);
      this.#stepFixed(h, input);
      remaining -= h;
      if (this.state !== 'playing') break;
    }
  }

  #stepFixed(h, input) {
    const p = this.player;

    // ---- 玩家（真实时间）----
    let mx = input.moveX || 0, my = input.moveY || 0;
    const mLen = hypot(mx, my);
    if (mLen > 1) { mx /= mLen; my /= mLen; }
    // 平滑加速，让“世界流速”跟随实际速度而非按键。
    const targetVx = mx * PLAYER_SPEED, targetVy = my * PLAYER_SPEED;
    const k = Math.min(1, h * 14);
    p.vx += (targetVx - p.vx) * k;
    p.vy += (targetVy - p.vy) * k;
    p.x += p.vx * h;
    p.y += p.vy * h;
    for (const w of this.walls) {
      const fix = resolveCircleRect(p.x, p.y, PLAYER_RADIUS, w);
      if (fix) { p.x = fix.x; p.y = fix.y; }
    }
    p.x = clamp(p.x, PLAYER_RADIUS, WIDTH - PLAYER_RADIUS);
    p.y = clamp(p.y, PLAYER_RADIUS, HEIGHT - PLAYER_RADIUS);
    p.speed = hypot(p.vx, p.vy);

    const aimLen = hypot(input.aimX || 0, input.aimY || 0);
    if (aimLen > 0.001) p.aim = Math.atan2(input.aimY, input.aimX);

    p.fireCooldown = Math.max(0, p.fireCooldown - h);
    p.throwCooldown = Math.max(0, p.throwCooldown - h);

    // 开火（手枪 / 霰弹为半自动，需松开再按；冲锋枪自动）。空枪无法开火，但可以扔。
    const fire = !!input.fire;
    const fireEdge = fire && !p.fireHeld;
    const weapon = p.weapon ? WEAPONS[p.weapon.kind] : null;
    const canFire = weapon && p.weapon.ammo > 0 && p.fireCooldown <= 0 && (weapon.auto ? fire : fireEdge);
    if (canFire) {
      p.fireCooldown = weapon.cooldown;
      p.weapon.ammo -= 1;
      this.stats.shots += 1;
      for (let i = 0; i < weapon.pellets; i++) {
        const spread = (this.random() - 0.5) * 2 * weapon.spread;
        const a = p.aim + spread;
        this.bullets.push({
          x: p.x + Math.cos(a) * (PLAYER_RADIUS + 6), y: p.y + Math.sin(a) * (PLAYER_RADIUS + 6),
          vx: Math.cos(a) * weapon.speed, vy: Math.sin(a) * weapon.speed,
          friendly: true, life: BULLET_LIFE,
        });
      }
      this.events.push({ type: 'shot', x: p.x, y: p.y, weapon: p.weapon.kind });
      if (p.weapon.ammo <= 0) this.events.push({ type: 'empty', x: p.x, y: p.y });
    }
    p.fireHeld = fire;

    // 投掷：把手中武器（含空枪）扔出去（世界时间飞行，静止时悬停在空中）。
    const throwDown = !!input.throw;
    const throwEdge = throwDown && !p.throwHeld;
    if (throwEdge && p.weapon && p.throwCooldown <= 0) {
      p.throwCooldown = 0.8;
      this.projectiles.push({
        x: p.x + Math.cos(p.aim) * (PLAYER_RADIUS + 6), y: p.y + Math.sin(p.aim) * (PLAYER_RADIUS + 6),
        vx: Math.cos(p.aim) * THROW_SPEED, vy: Math.sin(p.aim) * THROW_SPEED,
        weapon: p.weapon.kind, ammo: p.weapon.ammo, spin: 0,
      });
      p.weapon = null;
      this.stats.throws += 1;
      this.events.push({ type: 'throw', x: p.x, y: p.y });
    }
    p.throwHeld = throwDown;

    // 拾取：空手或手里是空枪时自动拾取；同时压到多把时优先捡有弹药的。
    if (!p.weapon || p.weapon.ammo <= 0) {
      let bestIdx = -1, bestLoaded = -1;
      for (let i = 0; i < this.pickups.length; i++) {
        const pk = this.pickups[i];
        if (hypot(pk.x - p.x, pk.y - p.y) < PLAYER_RADIUS + 16) {
          const loaded = pk.ammo > 0 ? 1 : 0;
          if (bestIdx === -1 || loaded > bestLoaded) { bestIdx = i; bestLoaded = loaded; }
        }
      }
      if (bestIdx >= 0) {
        const pk = this.pickups[bestIdx];
        p.weapon = { kind: pk.kind, ammo: pk.ammo };
        this.pickups.splice(bestIdx, 1);
        this.events.push({ type: 'pickup', x: pk.x, y: pk.y, weapon: pk.kind });
      }
    }

    // ---- 时间法则 ----
    const ts = clamp(p.speed / PLAYER_SPEED, 0, 1);
    this.timeScale = ts;
    const wdt = h * ts;
    this.simTime += wdt;
    this.levelTime += h;

    if (wdt > 0) {
      this.#stepWorld(wdt);
    }

    if (this.enemiesLeft === 0 && this.enemies.length > 0) {
      this.state = 'clear';
      this.session.clears += 1;
      this.events.push({ type: 'clear', time: this.levelTime, stats: { ...this.stats } });
    }
  }

  #stepWorld(wdt) {
    const p = this.player;

    // 子弹（世界时间）
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * wdt;
      b.y += b.vy * wdt;
      b.life -= wdt;
      let dead = b.life <= 0 || b.x < -20 || b.x > WIDTH + 20 || b.y < -20 || b.y > HEIGHT + 20;
      if (!dead) {
        for (const w of this.walls) {
          if (circleRectOverlap(b.x, b.y, BULLET_RADIUS, w)) {
            dead = true;
            this.events.push({ type: 'spark', x: b.x, y: b.y });
            break;
          }
        }
      }
      if (!dead && b.friendly) {
        for (const e of this.enemies) {
          if (!e.alive) continue;
          const r = ENEMIES[e.kind].radius;
          if (hypot(e.x - b.x, e.y - b.y) < r + BULLET_RADIUS) {
            dead = true;
            this.#killEnemy(e);
            break;
          }
        }
      } else if (!dead) {
        // 敌方子弹击中玩家
        if (hypot(p.x - b.x, p.y - b.y) < PLAYER_RADIUS + BULLET_RADIUS) {
          dead = true;
          this.#killPlayer('bullet');
        } else {
          // 友军火力误伤：敌方子弹也能击杀其他敌人
          for (const e of this.enemies) {
            if (!e.alive) continue;
            const r = ENEMIES[e.kind].radius;
            if (hypot(e.x - b.x, e.y - b.y) < r + BULLET_RADIUS) {
              dead = true;
              this.#killEnemy(e);
              break;
            }
          }
        }
      }
      if (dead) this.bullets.splice(i, 1);
      if (this.state !== 'playing') return;
    }

    // 投掷物（世界时间）
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.x += pr.vx * wdt;
      pr.y += pr.vy * wdt;
      pr.spin += wdt * 20;
      let landed = false;
      for (const w of this.walls) {
        if (circleRectOverlap(pr.x, pr.y, THROW_RADIUS, w)) {
          landed = true;
          break;
        }
      }
      if (!landed && (pr.x < 8 || pr.x > WIDTH - 8 || pr.y < 8 || pr.y > HEIGHT - 8)) landed = true;
      if (!landed) {
        for (const e of this.enemies) {
          if (!e.alive) continue;
          const r = ENEMIES[e.kind].radius;
          if (hypot(e.x - pr.x, e.y - pr.y) < r + THROW_RADIUS) {
            e.stun = STUN_TIME;
            this.#dropWeapon(e, e.x, e.y);
            landed = true;
            this.events.push({ type: 'disarm', x: e.x, y: e.y, kind: e.kind });
            break;
          }
        }
      }
      if (landed) {
        pr.x = clamp(pr.x, 24, WIDTH - 24);
        pr.y = clamp(pr.y, 24, HEIGHT - 24);
        this.pickups.push({ kind: pr.weapon, x: pr.x, y: pr.y, ammo: pr.ammo, t: 0 });
        this.projectiles.splice(i, 1);
        this.events.push({ type: 'clatter', x: pr.x, y: pr.y });
      }
    }

    // 敌人（世界时间）
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const def = ENEMIES[e.kind];
      if (e.stun > 0) {
        e.stun -= wdt;
        continue;
      }
      if (e.react > 0) {
        e.react -= wdt;
        continue;
      }
      const dx = p.x - e.x, dy = p.y - e.y;
      const dist = hypot(dx, dy);
      const toPlayer = Math.atan2(dy, dx);

      if (e.kind === 'rusher') {
        // 直冲玩家
        e.aim += clamp(angleDiff(toPlayer, e.aim), -def.turn * wdt, def.turn * wdt);
        e.vx = Math.cos(e.aim) * def.speed;
        e.vy = Math.sin(e.aim) * def.speed;
      } else {
        e.aim += clamp(angleDiff(toPlayer, e.aim), -def.turn * wdt, def.turn * wdt);
        // 走位：多数时间站定开火，偶尔换位；太远逼近，太近拉开。
        if (dist > 560) {
          e.moving = true;
          e.moveTimer = Math.max(e.moveTimer, 0.3);
          const a = toPlayer;
          e.vx = Math.cos(a) * def.speed;
          e.vy = Math.sin(a) * def.speed;
        } else if (dist < 230) {
          e.moving = true;
          const a = toPlayer + Math.PI;
          e.vx = Math.cos(a) * def.speed;
          e.vy = Math.sin(a) * def.speed;
        } else {
          e.moveTimer -= wdt;
          if (e.moveTimer <= 0) {
            if (e.moving) {
              e.moving = false;
              e.moveTimer = 1.8 + this.random() * 2.2;
            } else {
              e.moving = true;
              if (this.random() < 0.5) e.strafe *= -1;
              e.moveTimer = 0.5 + this.random() * 0.5;
            }
          }
          if (e.moving) {
            const a = toPlayer + (Math.PI / 2) * e.strafe;
            e.vx = Math.cos(a) * def.speed;
            e.vy = Math.sin(a) * def.speed;
          } else {
            e.vx = 0; e.vy = 0;
          }
        }
        // 开火
        e.cooldown -= wdt;
        const aimed = Math.abs(angleDiff(toPlayer, e.aim)) < 0.22;
        if (e.cooldown <= 0 && aimed && dist < def.range && this.losClear(e.x, e.y, p.x, p.y)) {
          e.cooldown = def.cooldown + this.random() * 0.5;
          const pellets = e.kind === 'shotgunner' ? 4 : 1;
          const spread = e.kind === 'shotgunner' ? 0.24 : 0.03;
          for (let i = 0; i < pellets; i++) {
            const a = e.aim + (this.random() - 0.5) * 2 * spread;
            this.bullets.push({
              x: e.x + Math.cos(a) * (def.radius + 6), y: e.y + Math.sin(a) * (def.radius + 6),
              vx: Math.cos(a) * def.bulletSpeed, vy: Math.sin(a) * def.bulletSpeed,
              friendly: false, life: BULLET_LIFE + 1,
            });
          }
          this.events.push({ type: 'enemy-shot', x: e.x, y: e.y, kind: e.kind });
        }
      }

      // 位移 + 墙体/边界
      e.x += e.vx * wdt;
      e.y += e.vy * wdt;
      for (const w of this.walls) {
        const r = def.radius;
        const fix = resolveCircleRect(e.x, e.y, r, w);
        if (fix) { e.x = fix.x; e.y = fix.y; }
      }
      e.x = clamp(e.x, def.radius, WIDTH - def.radius);
      e.y = clamp(e.y, def.radius, HEIGHT - def.radius);

      // 冲锋者近身
      if (e.kind === 'rusher' && dist < RUSHER_REACH + PLAYER_RADIUS) {
        this.#killPlayer('melee');
        return;
      }
    }

    // 敌人间简单分离
    const alive = this.enemies.filter((e) => e.alive);
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        const a = alive[i], b = alive[j];
        const min = ENEMIES[a.kind].radius + ENEMIES[b.kind].radius;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = hypot(dx, dy);
        if (d > 0 && d < min) {
          const push = (min - d) / 2;
          const nx = dx / d, ny = dy / d;
          a.x -= nx * push; a.y -= ny * push;
          b.x += nx * push; b.y += ny * push;
        }
      }
    }

    // 拾取动画计时（世界时间，仅视觉）
    for (const pk of this.pickups) pk.t += wdt;
  }

  #dropWeapon(enemy, x, y) {
    const def = ENEMIES[enemy.kind];
    if (!def.drops) return;
    this.pickups.push({ kind: def.drops, x: clamp(x, 24, WIDTH - 24), y: clamp(y, 24, HEIGHT - 24), ammo: def.dropAmmo, t: 0 });
  }

  #killEnemy(e) {
    e.alive = false;
    this.session.kills += 1;
    this.stats.kills += 1;
    this.#dropWeapon(e, e.x, e.y);
    this.events.push({ type: 'kill', x: e.x, y: e.y, kind: e.kind });
  }

  #killPlayer(cause) {
    if (!this.player.alive) return;
    this.player.alive = false;
    this.session.deaths += 1;
    this.state = 'dead';
    this.events.push({ type: 'death', x: this.player.x, y: this.player.y, cause });
  }
}
