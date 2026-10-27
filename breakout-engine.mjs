export const W = 720, H = 440, WALL = 24, R = 8;
export const STEP = 1 / 240;
export const COLORS = ['#f4ab73', '#eac66c', '#7ccbbb', '#87b5dc', '#d7d1ad', '#dc9674'];
export const POWERS = {
  wide: { label: '加长挡板', icon: '↔', color: '#7cdbc1' },
  multi: { label: '三球', icon: '3', color: '#f5c76a' },
  shield: { label: '护底', icon: '▰', color: '#8ec9ed' },
};
export const LEVELS = [
  {name:'启航港口', rule:'找准角度', hint:'用挡板边缘改变方向，把球送到砖阵上方。'},
  {name:'钢铁回廊', rule:'绕过钢墙', hint:'灰色钢墙不会碎。从两侧和墙间空隙，把球弹进上层。'},
  {name:'运输轨道', rule:'提前瞄准', hint:'四条传送带交错移动。瞄准砖块即将经过的位置。'},
  {name:'双塔断电', rule:'先拆开关', hint:'先击破左右两枚电源开关，才能打掉中央的护盾砖。'},
  {name:'潮汐闸门', rule:'抓住窗口', hint:'三道闸门轮流开启。虚线表示开放，实心闸板会反弹球。'},
  {name:'引爆矿脉', rule:'连锁爆破', hint:'厚矿石需要三次撞击。优先打橙色炸药，引爆整簇矿脉。'},
  {name:'下沉工厂', rule:'争分夺秒', hint:'砖阵每 18 秒下降一层。优先清掉底排，保留回球空间。'},
  {name:'核心熔炉', rule:'三阶段核心战', hint:'击破两侧供能器，攻击移动核心；每损失一段装甲，它会重新供能。'},
];
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function steer(ball, speed = Math.hypot(ball.vx, ball.vy)) {
  let vx = ball.vx, vy = ball.vy;
  if (Math.abs(vy) < speed * .28) vy = (vy < 0 ? -1 : 1) * speed * .28;
  if (Math.abs(vx) < speed * .1) vx = (vx < 0 ? -1 : 1) * speed * .1;
  const scale = speed / Math.hypot(vx, vy);
  ball.vx = vx * scale;
  ball.vy = vy * scale;
}

export class BreakoutGame {
  constructor({ random = Math.random, emit = () => {} } = {}) {
    this.random = random;
    this.emit = emit;
    this.reset();
  }

  reset(startLevel = 1) {
    this.score = 0;
    this.lives = 3;
    this.startLevel = clamp(Math.floor(Number(startLevel)) || 1, 1, LEVELS.length);
    this.level = this.startLevel;
    this.time = 0;
    this.paddle = { x: W / 2, target: W / 2, y: 398, w: 128, h: 12, vx: 0 };
    this.makeBricks();
    this.serve();
    this.mode = 'ready';
  }

  makeBricks() {
    this.stageTime = 0;
    this.bossPhase = 1;
    this.bricks = [];
    const width = (W - 2 * (WALL + 12) - 8 * 8) / 9;
    const add=(col,row,type='normal',hp=1,extra={})=>{
      const x=WALL+12+col*(width+8),y=48+row*29;
      const brick={x,y,baseX:x,baseY:y,w:width,h:21,hp,maxHp:hp,type,
        color:COLORS[(row+this.level-1)%COLORS.length],power:null,flash:0,...extra};
      this.bricks.push(brick);return brick;
    };
    if(this.level===1){
      for(let r=0;r<4;r++)for(let c=0;c<9;c++)add(c,r);
    }else if(this.level===2){
      for(let r=0;r<4;r++)for(let c=0;c<9;c++)if(c!==4||r<2)add(c,r,(r+c)%5===0?'armor':'normal',(r+c)%5===0?2:1);
      for(const x of [98,310,522])add(0,0,'steel',1,{x,baseX:x,y:206,baseY:206,w:100,h:15,target:false});
    }else if(this.level===3){
      for(let r=0;r<4;r++)for(let c=2;c<=6;c++)add(c,r,'normal',1,{motion:r%2? -1:1,baseY:54+r*39,y:54+r*39});
    }else if(this.level===4){
      for(let r=0;r<4;r++)for(let c=2;c<=6;c++)add(c,r,'armor',2,{protected:true});
      add(0,5,'switch',2,{color:'#75ddc6'});add(8,5,'switch',2,{color:'#75ddc6'});
    }else if(this.level===5){
      for(let r=0;r<4;r++)for(let c=1;c<=7;c++)add(c,r);
      [90,285,480].forEach((x,i)=>add(0,0,'gate',1,{x,baseX:x,y:206,baseY:206,w:150,h:16,target:false,gateIndex:i,open:i===0}));
    }else if(this.level===6){
      for(let r=0;r<5;r++)for(let c=0;c<9;c++)add(c,r,[1,4,7].includes(c)?'bomb':'armor',[1,4,7].includes(c)?1:3,{color:'#ba9e83'});
    }else if(this.level===7){
      for(let r=0;r<4;r++)for(let c=0;c<9;c++)if((r+c)%5!==0)add(c,r,r===3&&c%3===0?'bomb':'normal');
    }else{
      add(4,0,'core',9,{x:304,baseX:304,y:73,baseY:73,w:112,h:42,color:'#e9aa75'});
      this.addGenerators();
    }
    // Supplies always belong to breakable targets, never steel or gates.
    const targets=this.bricks.filter(b=>b.target!==false&&b.type!=='core');
    [targets.length-1,Math.floor(targets.length/2),0].forEach((index,i)=>{
      if(targets[index])targets[index].power=['wide','multi','shield'][(i+this.level-1)%3];
    });
    this.initialTargets=this.remaining;
    this.updateMechanisms(0);
  }

  addGenerators() {
    for(const x of [105,550]){
      this.bricks.push({x,y:164,baseX:x,baseY:164,w:65,h:29,hp:2,maxHp:2,type:'switch',
        color:'#78d3c5',power:x===105?(this.bossPhase===2?'wide':'multi'):'shield',flash:0,generator:true});
    }
  }

  updateMechanisms(dt) {
    this.stageTime+=dt;
    for(const b of this.bricks){
      if(b.motion)b.x=b.baseX+Math.sin(this.stageTime*.7)*104*b.motion;
      if(b.type==='gate'){
        const wantsOpen=(this.stageTime+b.gateIndex*2)%6<3.2;
        // A closing shutter waits for an overlapping ball to leave; never crush or teleport it.
        const occupied=(this.balls||[]).some(ball=>ball.x+R>b.x&&ball.x-R<b.x+b.w&&ball.y+R>b.y&&ball.y-R<b.y+b.h);
        b.open=wantsOpen||occupied;
      }
      if(this.level===7)b.y=b.baseY+Math.min(6,Math.floor(this.stageTime/18))*18;
      if(b.type==='core')b.x=b.baseX+Math.sin(this.stageTime*(.65+(this.bossPhase-1)*.2))*168;
    }
  }

  get switchesLeft(){return this.bricks.filter(b=>b.type==='switch'&&b.hp>0).length;}
  isProtected(b){return (b.protected||b.type==='core')&&this.switchesLeft>0;}
  get objective(){
    if(this.level===4)return this.switchesLeft?`电源开关 ${this.switchesLeft} / 2 · 中央护盾开启`:'护盾已关闭 · 清除中央砖阵';
    if(this.level===5)return `开放闸门 ${this.bricks.filter(b=>b.type==='gate'&&b.open).length} / 3 · 虚线可穿过`;
    if(this.level===7)return this.stageTime<108?`${Math.ceil(18-this.stageTime%18)} 秒后下降 · 已下降 ${Math.floor(this.stageTime/18)} / 6 层`:'砖阵已到最低层 · 清空剩余目标';
    if(this.level===8){const core=this.bricks.find(b=>b.type==='core');return `核心 ${core?.hp||0} / 9 · 阶段 ${this.bossPhase} / 3 · ${this.switchesLeft?'先拆供能器':'核心已暴露'}`;}
    return LEVELS[this.level-1].hint;
  }

  serve() {
    this.wideTime = 0;
    this.shield = 0;
    this.combo = 0;
    this.drops = [];
    this.paddle.w = 128;
    this.paddle.x = this.paddle.target = W / 2;
    const speed = 265 + (this.level - 1) * 13;
    const vx = speed * (.28 + this.random() * .16) * (this.random() < .5 ? -1 : 1);
    this.balls = [{ x: W / 2, y: this.paddle.y - R - 2, vx, vy: -Math.sqrt(speed ** 2 - vx ** 2), trail: [] }];
  }

  start() {
    if (['ready', 'lost', 'won'].includes(this.mode)) this.reset(this.startLevel);
    else if (this.mode === 'level') {
      this.level++;
      this.makeBricks();
      this.serve();
    }
    this.mode = 'playing';
  }

  get remaining() { return this.bricks.filter(brick => brick.hp > 0 && brick.target !== false).length; }

  activatePower(kind) {
    if (kind === 'wide') {
      this.wideTime = 14;
      this.paddle.w = 180;
      this.paddle.x = clamp(this.paddle.x, WALL + 90, W - WALL - 90);
      this.paddle.target = clamp(this.paddle.target, WALL + 90, W - WALL - 90);
    } else if (kind === 'shield') this.shield = 1;
    else if (kind === 'multi' && this.balls.length) {
      const source = this.balls[0];
      for (const angle of [-.45, .45]) {
        if (this.balls.length >= 3) break;
        const ball = { x: source.x, y: source.y, vx: source.vx * Math.cos(angle) - source.vy * Math.sin(angle),
          vy: source.vx * Math.sin(angle) + source.vy * Math.cos(angle), trail: [] };
        steer(ball);
        this.balls.push(ball);
      }
    }
    this.emit({ type: 'power', kind, x: this.paddle.x, y: this.paddle.y - 20 });
  }

  damageBrick(brick, damage = 1) {
    if (brick.hp <= 0) return;
    if(brick.target===false||this.isProtected(brick)){
      brick.flash=.09;this.emit({type:'armor',x:brick.x+brick.w/2,y:brick.y+brick.h/2,color:'#a7d7df'});return;
    }
    // Each core phase absorbs at most its remaining three-hit armor segment.
    if(brick.type==='core')damage=Math.min(damage,brick.hp%3||3);
    brick.hp = Math.max(0, brick.hp - damage);
    if(brick.type==='core'&&brick.hp>0&&brick.hp%3===0){
      this.bossPhase=4-brick.hp/3;
      this.addGenerators();
      this.emit({type:'phase',phase:this.bossPhase});
    }
    brick.flash = .09;
    const x = brick.x + brick.w / 2, y = brick.y + brick.h / 2;
    if (brick.hp > 0) {
      this.score += 5;
      this.emit({ type: 'armor', x, y, color: brick.color });
      return;
    }
    this.combo++;
    const multiplier = Math.min(5, 1 + Math.floor((this.combo - 1) / 3));
    const points = (15 + this.level * 5) * multiplier;
    this.score += points;
    this.emit({ type: 'brick', x, y, color: brick.color, points, combo: this.combo, multiplier });
    if (brick.power) this.drops.push({ x, y, kind: brick.power });
    if (brick.type === 'bomb') {
      this.emit({ type: 'explosion', x, y, color: '#f0ad73' });
      for (const neighbor of this.bricks) {
        if (neighbor.hp <= 0) continue;
        const dx = Math.abs(neighbor.x - brick.x), dy = Math.abs(neighbor.y - brick.y);
        if (this.level===6 ? Math.hypot(dx,dy)<88 : (dx < brick.w + 10 && dy < 3) || (dy < brick.h + 10 && dx < 3)) this.damageBrick(neighbor, 2);
      }
    }
  }

  collideBrick(ball, brick, nx, ny, penetration) {
    ball.x += nx * (penetration + .05);
    ball.y += ny * (penetration + .05);
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) { ball.vx -= 2 * dot * nx; ball.vy -= 2 * dot * ny; }
    steer(ball, Math.min(415 + this.level * 14, Math.hypot(ball.vx, ball.vy) + 2));
    this.damageBrick(brick);
  }

  step(dt, direction = 0) {
    if (this.mode !== 'playing') return;
    if(!Number.isFinite(dt)||dt<=0)return;
    // Match low/variable frame callers to the same collision and mechanism timestep.
    if(dt>STEP+1e-9){let left=Math.min(dt,.1);while(left>1e-9&&this.mode==='playing'){const part=Math.min(STEP,left);this.step(part,direction);left-=part;}return;}
    this.time += dt;
    this.updateMechanisms(dt);
    this.wideTime = Math.max(0, this.wideTime - dt);
    this.paddle.w = this.wideTime > 0 ? 180 : 128;
    const p = this.paddle;
    const oldPaddle = p.x;
    if (direction) p.target = p.x + direction * 650 * dt;
    p.target = clamp(p.target, WALL + p.w / 2, W - WALL - p.w / 2);
    p.x = clamp(direction ? p.target : p.x + (p.target - p.x) * Math.min(1, dt * 34), WALL + p.w / 2, W - WALL - p.w / 2);
    p.vx = (p.x - oldPaddle) / dt;
    for (const brick of this.bricks) brick.flash = Math.max(0, brick.flash - dt);

    for (const ball of this.balls) {
      const oldX = ball.x, oldY = ball.y;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.x < WALL + R) { ball.x = WALL + R; ball.vx = Math.abs(ball.vx); this.emit({type:'wall',x:WALL,y:ball.y}); }
      if (ball.x > W - WALL - R) { ball.x = W - WALL - R; ball.vx = -Math.abs(ball.vx); this.emit({type:'wall',x:W-WALL,y:ball.y}); }
      if (ball.y < WALL + R) { ball.y = WALL + R; ball.vy = Math.abs(ball.vy); this.emit({type:'wall',x:ball.x,y:WALL}); }

      // Interpolate the crossing of the paddle top, including fast or dropped frames.
      if (ball.vy > 0 && oldY + R <= p.y && ball.y + R >= p.y) {
        const t = (p.y - R - oldY) / (ball.y - oldY);
        const crossing = oldX + (ball.x - oldX) * t;
        if (crossing >= p.x - p.w / 2 - R && crossing <= p.x + p.w / 2 + R) {
          const speed = Math.hypot(ball.vx, ball.vy);
          const offset = clamp((crossing - p.x) / (p.w / 2), -1, 1);
          const angle = clamp(offset * 1.08 + clamp(p.vx / 650, -1, 1) * .1, -1.12, 1.12);
          const sign = ball.vx < 0 ? -1 : 1;
          ball.x = crossing;
          ball.y = p.y - R;
          ball.vx = Math.sin(angle) * speed;
          if (Math.abs(ball.vx) < speed * .12) ball.vx = sign * speed * .12;
          ball.vy = -Math.sqrt(speed ** 2 - ball.vx ** 2);
          this.combo = 0;
          this.emit({ type: 'paddle', x: crossing, y: p.y, color: '#7ccbbb' });
        }
      }
      if (this.shield && ball.vy > 0 && oldY + R <= H - 15 && ball.y + R >= H - 15) {
        this.shield = 0;
        ball.y = H - 15 - R;
        ball.vy = -Math.abs(ball.vy);
        this.emit({ type: 'save', x: ball.x, y: H - 15, color: '#8ec9ed' });
      }
      for (const brick of this.bricks) {
        if (brick.hp <= 0 || (brick.type==='gate'&&brick.open)) continue;
        const dx = ball.x - clamp(ball.x, brick.x, brick.x + brick.w);
        const dy = ball.y - clamp(ball.y, brick.y, brick.y + brick.h);
        const d2 = dx * dx + dy * dy;
        if (d2 >= R * R) continue;
        if (d2 > 0) {
          const distance = Math.sqrt(d2);
          this.collideBrick(ball, brick, dx / distance, dy / distance, R - distance);
        } else {
          const sides = [{ d: ball.x - brick.x, nx: -1, ny: 0 }, { d: brick.x + brick.w - ball.x, nx: 1, ny: 0 },
            { d: ball.y - brick.y, nx: 0, ny: -1 }, { d: brick.y + brick.h - ball.y, nx: 0, ny: 1 }];
          const side = sides.reduce((a, b) => a.d < b.d ? a : b);
          this.collideBrick(ball, brick, side.nx, side.ny, R + side.d);
        }
        break;
      }
    }
    if (!this.remaining) {
      this.score += this.level * 100;
      this.lives = Math.min(5, this.lives + 1);
      this.mode = this.level === LEVELS.length ? 'won' : 'level';
      this.emit({ type: 'clear' });
      return;
    }
    this.balls = this.balls.filter(ball => ball.y <= H + R);
    if (!this.balls.length) {
      this.lives--;
      if (this.lives <= 0) this.mode = 'lost';
      else { this.serve(); this.mode = 'life'; }
      this.emit({ type: 'miss' });
      return;
    }
    this.drops = this.drops.filter(drop => {
      const oldY = drop.y;
      drop.y += 98 * dt;
      if (oldY - 12 <= p.y + p.h && drop.y + 12 >= p.y && Math.abs(drop.x - p.x) <= p.w / 2 + 21) {
        this.activatePower(drop.kind);
        return false;
      }
      return drop.y < H + 24;
    });
  }
}
