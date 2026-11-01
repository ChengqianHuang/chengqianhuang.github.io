export class MechanicalAudio {
  constructor(){this._enabled=true;this.ctx=null;this.last=-1;}
  get enabled(){return this._enabled;}
  set enabled(value){this._enabled=value;if(this.master)this.master.gain.setTargetAtTime(value?.65:0,this.ctx.currentTime,.015);}
  wake(){
    try{
      if(!this.ctx){
        const c=this.ctx=new (window.AudioContext||window.webkitAudioContext)();
        this.master=c.createGain();this.master.gain.value=this.enabled?.65:0;this.master.connect(c.destination);
        this.noise=c.createBuffer(1,c.sampleRate,c.sampleRate);const data=this.noise.getChannelData(0);let v=0;
        for(let i=0;i<data.length;i++){v=(v+(Math.random()*2-1)*.16)/1.02;data[i]=v;}
        const rolling=c.createBufferSource();rolling.buffer=this.noise;rolling.loop=true;
        this.rollFilter=c.createBiquadFilter();this.rollFilter.type='lowpass';this.rollFilter.frequency.value=450;
        this.rollGain=c.createGain();this.rollGain.gain.value=0;rolling.connect(this.rollFilter).connect(this.rollGain).connect(this.master);rolling.start();
      }
      if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
    }catch{}
  }
  tone(f,d=.1,type='sine',volume=.08,slide=1,delay=0,pan=0){
    const c=this.ctx;if(!this.enabled||!c||c.state!=='running')return;
    const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner();p.pan.value=pan;
    o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*slide,t+d);
    g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(volume,t+.003);g.gain.exponentialRampToValueAtTime(.001,t+d);
    o.connect(g).connect(p).connect(this.master);o.start(t);o.stop(t+d+.01);o.onended=()=>{o.disconnect();g.disconnect();p.disconnect();};
  }
  clack(volume=.04,pan=0){
    const c=this.ctx;if(!this.enabled||!c||c.state!=='running')return;
    const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),p=c.createStereoPanner();source.buffer=this.noise;
    filter.type='highpass';filter.frequency.value=1100;p.pan.value=pan;gain.gain.setValueAtTime(volume,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+.045);
    source.connect(filter).connect(gain).connect(p).connect(this.master);source.start();source.stop(c.currentTime+.06);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();p.disconnect();};
  }
  update(g){
    if(!this.rollGain)return;
    const balls=g.status==='playing'&&!g.paused?g.balls.filter(b=>!b.lane&&b.ramp===null):[];
    const speed=balls.length?Math.max(...balls.map(b=>Math.hypot(b.vx,b.vy))):0;
    this.rollGain.gain.setTargetAtTime(Math.min(.06,speed*.0018),this.ctx.currentTime,.025);
    this.rollFilter.frequency.setTargetAtTime(300+speed*25,this.ctx.currentTime,.04);
  }
  play(e){
    const pan=Math.max(-.7,Math.min(.7,(e.x-4.9)/6));
    if(e.type==='coil'){this.tone(e.value>0?145:105,.065,'triangle',e.value>0?.11:.055,.45,0,pan);this.clack(e.value>0?.12:.06,pan);}
    if(e.type==='rail'){if(e.time-this.last<.06)return;this.last=e.time;this.tone(880,.035,'triangle',.025,.7,0,pan);}
    if(e.type==='flipper'||e.type==='sling')this.tone(120,.075,'triangle',.12,.4,0,pan);
    if(e.type==='bumper'){this.tone(440+e.value*.55,.21,'sine',.13,.96,0,pan);this.clack(.07,pan);}
    if(e.type==='target'){this.tone(920,.32,'sine',.12,.98,0,pan);this.tone(1380,.12,'sine',.035,1,0,pan);this.clack(.09,pan);}
    if(e.type==='gear')this.tone(310,.13,'triangle',.05,.6,0,pan);
    if(e.type==='launch'){this.clack(.13,.7);this.tone(95,.16,'sawtooth',.025,5,0,.7);}
    if(e.type==='armed'||e.type==='multiball'||e.type==='ramp')[523,659,784,1046].forEach((f,i)=>this.tone(f,.35,'sine',.065,1,i*.075));
    if(e.type==='drain')this.tone(170,.3,'triangle',.07,.3);
    if(e.type==='save')this.tone(660,.25,'sine',.09,1.5);
    if(e.type==='tilt')this.tone(90,.5,'sawtooth',.035,.6);
  }
}
