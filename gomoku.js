import {GomokuGame,N,coordinate} from './gomoku-engine.mjs?v=1';
import {chooseMove} from './gomoku-ai.mjs?v=1';
const $=id=>document.getElementById(`gomoku-${id}`),game=new GomokuGame(),canvas=$('canvas'),ctx=canvas.getContext('2d'),machine=$('machine');
const mobile=()=>matchMedia('(max-width: 600px), (pointer: coarse)').matches;
const levels={casual:'休闲',standard:'标准',challenge:'挑战'};
let human=1,level='standard',busy=false,paused=false,worker=null,token=0,resultTimer=0,selected=null,hover=null,cursor=112,pointerStart=null;
const MARGIN=44,STEP=632/14;
function point(index){return[MARGIN+index%N*STEP,MARGIN+Math.floor(index/N)*STEP];}
function stone(x,y,side,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor='#3e321e55';ctx.shadowBlur=5;ctx.shadowOffsetY=3;const g=ctx.createRadialGradient(x-8,y-9,2,x,y,21);if(side===1){g.addColorStop(0,'#687177');g.addColorStop(.4,'#30393f');g.addColorStop(1,'#131b21');}else{g.addColorStop(0,'#fffef7');g.addColorStop(.65,'#f2f1e8');g.addColorStop(1,'#bdc3b5');}ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,19.6,0,Math.PI*2);ctx.fill();ctx.shadowColor='transparent';ctx.strokeStyle=side===1?'#0f1920':'#afb4a5';ctx.lineWidth=.8;ctx.stroke();ctx.restore();}
function paint(){
 const wood=ctx.createLinearGradient(0,0,720,720);wood.addColorStop(0,'#ead4a7');wood.addColorStop(.5,'#e0c391');wood.addColorStop(1,'#d9b983');ctx.fillStyle=wood;ctx.fillRect(0,0,720,720);
 for(let n=0;n<40;n++){ctx.strokeStyle=n%3===0?'#a67b4020':'#fff5d512';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,n*19+2);ctx.bezierCurveTo(200,n*19-7,470,n*19+11,720,n*19-2);ctx.stroke();}
 ctx.lineWidth=1.1;ctx.strokeStyle='#786345b3';for(let n=0;n<N;n++){const p=MARGIN+n*STEP;ctx.beginPath();ctx.moveTo(MARGIN,p);ctx.lineTo(676,p);ctx.moveTo(p,MARGIN);ctx.lineTo(p,676);ctx.stroke();}
 ctx.lineWidth=2;ctx.strokeRect(MARGIN,MARGIN,632,632);
 ctx.fillStyle='#746046';for(const y of [3,7,11])for(const x of [3,7,11]){ctx.beginPath();ctx.arc(MARGIN+x*STEP,MARGIN+y*STEP,x===7&&y===7?4.2:3.2,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle='#866e4b';ctx.font='14px ui-monospace,Menlo,monospace';ctx.textAlign='center';ctx.textBaseline='middle';for(let n=0;n<N;n++){ctx.fillText(String.fromCharCode(65+n),MARGIN+n*STEP,22);ctx.fillText(String.fromCharCode(65+n),MARGIN+n*STEP,698);ctx.fillText(String(N-n),21,MARGIN+n*STEP);ctx.fillText(String(N-n),699,MARGIN+n*STEP);}
 for(const move of game.history){const [x,y]=point(move.index);stone(x,y,move.side);}
 if(game.line){const [x,y]=point(game.line[0]),[ex,ey]=point(game.line.at(-1));ctx.strokeStyle='#dca357';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();for(const index of game.line){const [sx,sy]=point(index);ctx.strokeStyle='#f6d894';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy,22,0,Math.PI*2);ctx.stroke();}}
 const last=game.history.at(-1);if(last){const [x,y]=point(last.index);ctx.fillStyle=last.side===1?'#f0b46c':'#a35c37';ctx.fillRect(x-4,y-4,8,8);}
 const preview=selected??hover;if(preview!==null&&!game.board[preview]&&!busy&&!paused&&!game.winner&&!game.draw&&game.turn===human){const [x,y]=point(preview);stone(x,y,human,.32);ctx.strokeStyle='#436855';ctx.lineWidth=2.5;for(const [sx,sy]of [[-1,-1],[1,-1],[-1,1],[1,1]]){ctx.beginPath();ctx.moveTo(x+sx*24,y+sy*14);ctx.lineTo(x+sx*24,y+sy*24);ctx.lineTo(x+sx*14,y+sy*24);ctx.stroke();}}
}
function update(){
 const ended=game.winner||game.draw,text=paused?'对局已暂停':game.winner?game.winner===human?'你赢了！':'电脑获胜':game.draw?'棋盘已满，本局和棋':busy?'电脑正在思考…':'轮到你落子';
 $('status').textContent=text;$('status').classList.toggle('thinking',busy&&!paused);$('count').textContent=ended?`共 ${game.history.length} 手`:`第 ${game.history.length+1} 手`;
 $('last').textContent=game.history.length?`上一手：${game.history.at(-1).side===human?'你':'电脑'} ${coordinate(game.history.at(-1).index)}`:'空局，试试从天元 H8 开始';$('level-label').textContent=`${levels[level]} · 自由五子棋`;
 $('undo').disabled=game.history.length<=(human===2?1:0);$('pause').disabled=Boolean(ended)||(!game.history.length&&!busy);$('pause').textContent=paused?'继续':'暂停';$('pause-overlay').hidden=!paused;
 $('confirm').disabled=selected===null||Boolean(game.board[selected])||busy||paused||Boolean(ended)||game.turn!==human;$('confirm').textContent=selected===null?'落子':`落子 ${coordinate(selected)}`;$('selection').textContent=selected===null?'点选交叉点，再点落子':`已选 ${coordinate(selected)}`;
 $('input-help').textContent=mobile()?'手机先选点，再点“落子”确认；方向键和 Enter 也可落子。':'点击交叉点落子；也可用方向键选点，Enter 或 Space 落子。';
 $('human-stone').classList.toggle('white',human===2);$('ai-stone').classList.toggle('white',human===1);$('human-label').textContent=human===1?'黑棋 · 先手':'白棋 · 后手';$('ai-label').textContent=human===1?'白棋 · 后手':'黑棋 · 先手';
 $('result').hidden=!ended;if(ended){$('result').innerHTML=`<strong>${text}</strong>${game.winner?'五子连线已在棋盘上标出。可以悔棋复盘，或重新开局。':'可以悔棋继续，或重新开局。'}`;}
 $('history').innerHTML=game.history.length?game.history.slice(-6).map((m,i)=>`<li><span><span class="gomoku-stone ${m.side===2?'white':''}"></span>${m.side===human?'你':'电脑'}</span><code>${coordinate(m.index)}</code><span>${game.history.length-Math.min(6,game.history.length)+i+1}</span></li>`).join(''):'<li>尚未落子</li>';
 canvas.setAttribute('aria-label',`15 乘 15 五子棋棋盘。${text}。已落 ${game.history.length} 手。${game.history.length?'最后落子 '+coordinate(game.history.at(-1).index):''}`);paint();
}
function cancelAI(){token++;worker?.terminate();worker=null;clearTimeout(resultTimer);resultTimer=0;busy=false;}
function aiMove(){
 if(paused||game.winner||game.draw||game.turn===human)return;cancelAI();busy=true;update();const id=token,started=performance.now();
 const accept=index=>{if(id!==token||paused)return;resultTimer=setTimeout(()=>{if(id!==token||paused)return;worker?.terminate();worker=null;busy=false;if(!Number.isInteger(index)||game.board[index]||index<0||index>=225){index=chooseMove(game.board,game.turn,{difficulty:'casual',timeLimit:40}).index;}if(!game.play(index)){$('status').textContent='电脑暂时无法落子，请重新开局。';return;}selected=hover=null;update();},Math.max(0,260-(performance.now()-started)));};
 const fallback=()=>{if(id!==token)return;worker?.terminate();worker=null;accept(chooseMove(game.board,game.turn,{difficulty:level,timeLimit:80}).index);};
 try{worker=new Worker(new URL('./gomoku-worker.mjs?v=1',import.meta.url),{type:'module'});worker.onmessage=e=>{if(e.data.token===id)accept(e.data.index);};worker.onerror=e=>{e.preventDefault();fallback();};worker.postMessage({board:game.board,side:game.turn,difficulty:level,token:id});}catch{resultTimer=setTimeout(fallback,0);}
}
function play(index){if(busy||paused||game.turn!==human||game.winner||game.draw)return;if(game.play(index)){selected=hover=null;cursor=index;update();aiMove();}}
function focusBoard(){machine.scrollIntoView({block:'start',behavior:'instant'});canvas.focus({preventScroll:true});}
function newGame(event){cancelAI();human=Number($('side').value);level=$('level').value;paused=false;game.reset();selected=hover=null;cursor=112;$('new').textContent='重新开局';$('settings-note').textContent='选项在重新开局时生效';update();aiMove();if(event)focusBoard();}
function togglePause(){if(game.winner||game.draw)return;paused=!paused;if(paused)cancelAI();update();if(!paused){focusBoard();aiMove();}}
function indexAt(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*720/r.width,y=(e.clientY-r.top)*720/r.height;const col=Math.round((x-MARGIN)/STEP),row=Math.round((y-MARGIN)/STEP);return col>=0&&col<N&&row>=0&&row<N&&Math.abs(x-(MARGIN+col*STEP))<=STEP*.48&&Math.abs(y-(MARGIN+row*STEP))<=STEP*.48?row*N+col:null;}
canvas.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
canvas.addEventListener('pointerup',e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>12)return;pointerStart=null;if(busy||paused||game.turn!==human||game.winner||game.draw)return;const index=indexAt(e);if(index===null||game.board[index])return;cursor=index;canvas.focus({preventScroll:true});if(mobile()){selected=index;update();}else play(index);});
canvas.addEventListener('pointercancel',()=>{pointerStart=null;});canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||mobile())return;hover=indexAt(e);paint();});canvas.addEventListener('pointerleave',()=>{hover=null;paint();});
canvas.addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey)return;const dirs={ArrowUp:-15,ArrowDown:15,ArrowLeft:-1,ArrowRight:1};if(e.key in dirs){e.preventDefault();const col=cursor%15,row=Math.floor(cursor/15);if(e.key==='ArrowUp'&&row>0||e.key==='ArrowDown'&&row<14||e.key==='ArrowLeft'&&col>0||e.key==='ArrowRight'&&col<14)cursor+=dirs[e.key];selected=cursor;update();}else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)play(selected??cursor);}else if(e.key==='Escape'){e.preventDefault();if(!e.repeat)togglePause();}});
$('confirm').addEventListener('click',()=>play(selected));$('new').addEventListener('click',newGame);$('undo').addEventListener('click',()=>{cancelAI();game.undoToHuman(human);paused=false;selected=hover=null;update();focusBoard();});$('pause').addEventListener('click',togglePause);$('resume').addEventListener('click',togglePause);
for(const id of ['side','level'])$(id).addEventListener('change',()=>{const changed=Number($('side').value)!==human||$('level').value!==level;$('settings-note').textContent=changed?'新设置将在重新开局后启用':'选项在重新开局时生效';$('new').textContent=changed?'应用设置并开局':'重新开局';});
function resize(){const r=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);if(!r.width)return;canvas.width=Math.round(r.width*ratio);canvas.height=Math.round(r.width*ratio);ctx.setTransform(canvas.width/720,0,0,canvas.height/720,0,0);update();}
new ResizeObserver(resize).observe(canvas);document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused&&!game.winner&&!game.draw&&(game.history.length||busy)){paused=true;cancelAI();update();}});addEventListener('pagehide',cancelAI);newGame();
