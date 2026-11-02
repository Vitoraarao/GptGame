(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const canvas = $('#game'), ctx = canvas.getContext('2d');
  const questions = window.ChagasQuestions, total = questions.length;
  const groundY = 512, worldWidth = 7900;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const number = (v, fallback, a, b) => Number.isFinite(v) ? clamp(v, a, b) : fallback;
  const stationXs = [850, 1750, 2650, 3550, 4450, 5350, 6250, 7150];
  const platforms = [], gaps = [], notes = [];
  stationXs.forEach((x, i) => {
    platforms.push({x: x-510, y:410, w:140, h:16}, {x:x-285,y:344,w:150,h:16});
    if (i < 7) {
      gaps.push({x:x+330,w:85});
      platforms.push({x:x+280,y:424,w:185,h:16});
      notes.push({x:x-438,y:390,collected:false},{x:x-210,y:324,collected:false},{x:x+370,y:404,collected:false});
    }
  });
  let state, paused = false, keys = {}, last = 0, accumulator = 0, lastSave = 0;
  let nextShot = 0, invulnerableUntil = 0, toastUntil = 0, audioContext, soundOn = false;
  let newlySolved = false, lastInteractIndex = -2, startSaveWarned = false;
  const SAVE_KEY = 'missaoChagasSave';
  function initialState() {
    return {time:0,camera:0,groundY,worldWidth,solved:0,total,health:3,zone:'Casas na floresta',
      player:{x:95,y:groundY-46,width:28,height:46,facing:1,vx:0,vy:0,grounded:true},
      tank:{x:250,y:groundY,mounted:false,facing:1,vx:0},
      stations:stationXs.map((x,index)=>({x,index,gateX:x+170,solved:false})),
      platforms,gaps,notes:notes.map(n=>({...n})),bullets:[],
      enemies:stationXs.slice(0,7).map((x,i)=>({x:x+560,baseX:x+560,y:groundY-12,alive:true,phase:i})),
      boss:{x:7660,y:groundY-60,hp:18,maxHp:18,active:false,defeated:false},
      invulnerable:false,checkpoint:95};
  }
  function notify(message, duration=3500) { $('#toast').textContent=message;$('#toast').classList.add('visible');toastUntil=performance.now()+duration; }
  function save() {
    try {
      localStorage.setItem(SAVE_KEY,JSON.stringify({version:3,solved:state.solved,hp:state.health,playerX:state.player.x,tankX:state.tank.x,mounted:state.tank.mounted,bossHp:state.boss.hp,boss:state.boss.defeated,notes:state.notes.flatMap((n,i)=>n.collected?[i]:[])}));
    } catch { if(!startSaveWarned){notify('O navegador não permitiu salvar. Você pode continuar jogando nesta sessão.');startSaveWarned=true;} }
  }
  function load() {
    state=initialState();
    try {
      const raw=JSON.parse(localStorage.getItem(SAVE_KEY));
      if(!raw||typeof raw!=='object')return;
      const current=raw.version===3;
      state.solved=Math.trunc(number(raw.solved,0,0,current?total:Math.min(5,total)));
      state.health=Math.trunc(number(raw.hp,3,1,3));
      state.checkpoint=state.solved?stationXs[state.solved-1]-50:95;
      // Saves from the earlier short level retain discoveries, using this level's positions.
      const maxX=state.solved<total?stationXs[state.solved]+140:worldWidth-70;
      state.player.x=current?number(raw.playerX,state.checkpoint,30,maxX):state.checkpoint;
      state.tank.x=current?number(raw.tankX,250,40,maxX):250;
      state.tank.mounted=current&&raw.mounted===true;
      if(state.tank.mounted)state.player.x=state.tank.x;
      state.boss.defeated=current&&state.solved===total&&raw.boss===true;
      state.boss.hp=state.boss.defeated?0:current?number(raw.bossHp,18,1,18):18;
      if(current&&Array.isArray(raw.notes))raw.notes.forEach(i=>{if(Number.isInteger(i)&&state.notes[i])state.notes[i].collected=true;});
      settleAfterLoad();
    } catch { state=initialState(); }
  }
  function settleAfterLoad(){
    // Do not restore a ground-level player or vehicle over an open pit.
    const overGap=x=>gaps.some(g=>x>g.x-20&&x<g.x+g.w+20);
    if(overGap(state.player.x))state.player.x=state.checkpoint;
    if(overGap(state.tank.x))state.tank.x=state.checkpoint+65;
    if(state.tank.mounted)state.player.x=state.tank.x;
  }
  function updateHud() {
    state.stations.forEach(s=>s.solved=s.index<state.solved);
    state.boss.active=state.solved===total&&!state.boss.defeated;
    state.zone=state.player.x>6900?'Laboratório de descobertas':'Casas na floresta';
    $('#location').textContent=state.zone;$('#count').textContent=`${state.solved}/${total}`;
    $('#remaining').textContent=state.solved===total?'Oito descobertas registradas':`${total-state.solved} ${total-state.solved===1?'mistério':'mistérios'} pela frente`;
    $('#notes-count').textContent=`✦ Notas de exploração · ${state.notes.filter(n=>n.collected).length}/21`;
    $('#vehicle-status').textContent=state.tank.mounted?'Blindado MC-01 · F para sair · Espaço para saltar':'Blindado MC-01 · aproxime-se e pressione F';
    $('#touch-vehicle').textContent=state.tank.mounted?'SAIR':'VEÍCULO';
    $('#journey-list').replaceChildren(...questions.map((q,i)=>{const li=document.createElement('li');li.className=i<state.solved?'done':i===state.solved?'active':'';const n=document.createElement('span');n.className='number';n.textContent=i<state.solved?'✓':String(i+1).padStart(2,'0');const name=document.createElement('span');name.textContent=q.topic;li.append(n,name);return li;}));
  }
  const quiz = new window.QuizPanel({
    onSolved(index){if(index!==state.solved)return;state.solved++;state.checkpoint=stationXs[index]-50;newlySolved=true;updateHud();save();},
    onClose(){keys={};canvas.focus({preventScroll:true});if(newlySolved){newlySolved=false;notify(state.solved===total?'Oito descobertas! Siga ao laboratório para o desafio final.':`Descoberta ${state.solved}/${total} registrada! A passagem está liberada.`,5000);}}
  });
  function nearestStation(){return state.stations.find(s=>s.index<=state.solved&&Math.abs(state.player.x-s.x)<180);}
  function investigate(){if(paused||quiz.isOpen||$('#reset-dialog').open)return;const s=nearestStation();if(s){keys={};quiz.open(s.index,s.solved);}else notify('Os desafios estão nos marcos dourados. Aproxime-se e pressione E.');}
  function jump(){if(paused||quiz.isOpen||$('#reset-dialog').open)return;const p=state.player;if(p.grounded){p.vy=state.tank.mounted?-590:-680;p.grounded=false;tone('jump');}}
  function toggleVehicle(){
    if(paused||quiz.isOpen||$('#reset-dialog').open)return;
    const p=state.player,t=state.tank;
    if(!p.grounded){notify('Pouse no chão ou em uma plataforma antes de entrar ou sair.');return;}
    if(t.mounted){const exitX=clamp(t.x-70,25,worldWidth-60);if(gaps.some(g=>exitX+14>g.x&&exitX+14<g.x+g.w)){notify('Estacione em chão firme para sair.');return;}t.mounted=false;p.x=exitX;p.y=t.y-p.height;p.vy=0;p.grounded=false;notify('A pé novamente. F perto do blindado para entrar.');}
    else if(Math.abs(p.x-t.x)<110&&Math.abs(p.y+p.height-t.y)<55){t.mounted=true;p.x=t.x;p.y=t.y-p.height;p.vy=0;notify('Blindado MC-01: setas para dirigir, Espaço para saltar, J para disparar e F para sair.',5500);}
    else {notify('Aproxime-se do blindado MC-01 para entrar.');return;}
    keys={};updateHud();save();canvas.focus({preventScroll:true});
  }
  function tone(kind){if(!soundOn)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;osc.type=kind==='shoot'?'square':'triangle';const frequency={shoot:state.tank.mounted?85:155,jump:260,note:740,damage:105}[kind]||440;osc.frequency.setValueAtTime(frequency,now);osc.frequency.exponentialRampToValueAtTime(kind==='jump'?520:frequency/2,now+.13);gain.gain.setValueAtTime(.035,now);gain.gain.exponentialRampToValueAtTime(.001,now+.16);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(now+.17);}catch{}}
  function shoot(){const p=state.player,f=p.facing;state.bullets.push({x:p.x+(state.tank.mounted?f*77:f===1?43:-12),y:state.tank.mounted?state.tank.y-64:p.y+30,vx:f*(state.tank.mounted?790:650),vehicle:state.tank.mounted,life:2.3});tone('shoot');}
  function damage(fall=false){
    if(!fall&&state.time<invulnerableUntil)return;
    state.health--;tone('damage');invulnerableUntil=state.time+1800;
    if(state.health<=0){state.health=3;fall=true;notify('Vamos tentar outra vez! Suas descobertas continuam no caderno.',4200);}
    else notify(fall?'Cuidado com o caminho! Você voltou ao último marco.':'Cuidado com os insetos! Você perdeu um coração.');
    if(fall){state.player.x=state.checkpoint;state.player.y=groundY-state.player.height;state.player.vy=0;state.player.grounded=true;if(state.tank.mounted){state.tank.x=state.player.x;state.tank.y=groundY;}}
    else {state.player.vy=-260;state.player.grounded=false;}
    updateHud();save();
  }
  function step(dt){
    const p=state.player,t=state.tank;state.time+=dt*1000;state.invulnerable=state.time<invulnerableUntil;
    const direction=(keys.right?1:0)-(keys.left?1:0);p.vx=direction*(t.mounted?350:270);if(direction)p.facing=direction;
    const margin=t.mounted?47:14;let nextX=clamp(p.x+p.vx*dt,margin,worldWidth-65);
    const gate=state.stations.find(s=>!s.solved);
    if(gate&&nextX+margin>gate.gateX){nextX=gate.gateX-margin;if(p.vx>0&&state.time%1500<30)notify('Investigue o marco dourado para abrir a passagem.');}
    p.x=nextX;
    const previousBottom=p.y+p.height;p.vy+=1750*dt;p.y+=p.vy*dt;p.grounded=false;
    const footX=p.x+(t.mounted?0:p.width/2);
    if(p.vy>=0){
      const floorCandidates=platforms.filter(pl=>footX>pl.x-5&&footX<pl.x+pl.w+5&&previousBottom<=pl.y+2&&p.y+p.height>=pl.y).map(pl=>pl.y);
      const onGround=!gaps.some(g=>footX>g.x&&footX<g.x+g.w);
      if(onGround&&previousBottom<=groundY+2&&p.y+p.height>=groundY)floorCandidates.push(groundY);
      if(floorCandidates.length){p.y=Math.min(...floorCandidates)-p.height;p.vy=0;p.grounded=true;}
    }
    if(t.mounted){t.x=p.x;t.y=p.y+p.height;t.facing=p.facing;t.vx=p.vx;}
    if(p.y>700)damage(true);
    if(keys.shoot&&state.time>=nextShot){shoot();nextShot=state.time+(t.mounted?180:280);}
    state.notes.forEach(n=>{if(!n.collected&&Math.abs(n.x-p.x)<(t.mounted?55:32)&&Math.abs(n.y-(p.y+20))<42){n.collected=true;tone('note');updateHud();notify(`Nota de exploração encontrada · ${state.notes.filter(v=>v.collected).length}/21. Os desafios estão nos marcos dourados.`);save();}});
    state.enemies.forEach(e=>{if(!e.alive)return;e.x=e.baseX+Math.sin(state.time/900+e.phase)*42;if(Math.abs(e.x-p.x)<(t.mounted?45:25)&&Math.abs(e.y-(p.y+30))<30){if(t.mounted)e.alive=false;else damage();}});
    state.bullets.forEach(b=>{const oldX=b.x;b.x+=b.vx*dt;b.life-=dt;const hitsX=x=>x>=Math.min(oldX,b.x)-18&&x<=Math.max(oldX,b.x)+18;const blocked=state.stations.find(s=>!s.solved&&hitsX(s.gateX));if(blocked)b.life=0;state.enemies.forEach(e=>{if(e.alive&&b.life>0&&hitsX(e.x)&&Math.abs(b.y-e.y)<25){e.alive=false;b.life=0;}});const boss=state.boss;if(boss.active&&b.life>0&&hitsX(boss.x)&&Math.abs(b.y-boss.y)<65){b.life=0;boss.hp=Math.max(0,boss.hp-(b.vehicle?2:1));if(boss.hp===0){boss.defeated=true;boss.active=false;notify('Missão cumprida! Oito descobertas, um novo olhar sobre a saúde. Seu caderno está completo.',10000);updateHud();save();}}});
    state.bullets=state.bullets.filter(b=>b.life>0&&b.x>0&&b.x<worldWidth+200);
    const goal=clamp(p.x-420,0,worldWidth-1200);state.camera+=(goal-state.camera)*Math.min(1,dt*8);
    const zone=p.x>6900?'Laboratório de descobertas':'Casas na floresta';if(zone!==state.zone){state.zone=zone;$('#location').textContent=zone;}
    if(state.time-lastSave>2000){save();lastSave=state.time;}
  }
  function frame(now){const delta=last?Math.min((now-last)/1000,.1):0;last=now;if(!paused&&!quiz.isOpen&&!$('#reset-dialog').open){accumulator+=delta;while(accumulator>=1/60){step(1/60);accumulator-=1/60;}}else accumulator=0;window.GameRenderer.draw(ctx,state);if(now>toastUntil)$('#toast').classList.remove('visible');const near=nearestStation();const nearIndex=near?.index??-1;if(nearIndex!==lastInteractIndex){lastInteractIndex=nearIndex;$('#interact').hidden=!near;$('#interact span').textContent=near?.solved?'Rever descoberta':'Investigar descoberta';}requestAnimationFrame(frame);}
  function pause(value=!paused){if(quiz.isOpen||$('#reset-dialog').open)return;paused=value;keys={};$('#pause-overlay').hidden=!paused;$('#pause').setAttribute('aria-pressed',String(paused));$('#pause').setAttribute('aria-label',paused?'Continuar jogo':'Pausar jogo');$('#pause').textContent=paused?'▶':'Ⅱ';if(paused)save();else canvas.focus({preventScroll:true});}
  const keyMap={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump',KeyJ:'shoot',KeyX:'shoot'};
  window.addEventListener('keydown',e=>{if(quiz.isOpen||$('#reset-dialog').open)return;if(e.target.closest('button,a,input,textarea,select')&&['Space','Enter'].includes(e.code))return;const action=keyMap[e.code];if(action){e.preventDefault();keys[action]=true;if(action==='jump'&&!e.repeat)jump();}if(!e.repeat){if(e.code==='KeyE')investigate();if(e.code==='KeyF')toggleVehicle();if(e.code==='KeyP'||e.code==='Escape')pause();}});
  window.addEventListener('keyup',e=>{const action=keyMap[e.code];if(action)keys[action]=false;});
  window.addEventListener('blur',()=>{keys={};});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys={};save();}});window.addEventListener('pagehide',save);
  document.querySelectorAll('[data-action]').forEach(b=>{const action=b.dataset.action;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys[action]=true;if(action==='jump')jump();});['pointerup','pointercancel','lostpointercapture'].forEach(event=>b.addEventListener(event,()=>keys[action]=false));});
  $('#interact').onclick=investigate;$('#touch-investigate').onclick=investigate;$('#touch-vehicle').onclick=toggleVehicle;$('#pause').onclick=()=>pause();$('#continue').onclick=()=>pause(false);
  $('#sound').onclick=()=>{soundOn=!soundOn;$('#sound').textContent=soundOn?'♪ Som ligado':'♪ Som desligado';$('#sound').setAttribute('aria-pressed',String(soundOn));tone('note');};
  $('#ipad').onclick=()=>{const active=$('#touch-controls').classList.toggle('visible');$('#ipad').setAttribute('aria-pressed',String(active));};
  $('#fullscreen').onclick=async()=>{const shell=$('#game-shell');try{if(document.fullscreenElement)await document.exitFullscreen();else if(shell.requestFullscreen)await shell.requestFullscreen();else shell.classList.toggle('expanded');}catch{shell.classList.toggle('expanded');}$('#fullscreen').textContent=document.fullscreenElement||shell.classList.contains('expanded')?'⛶ Reduzir':'⛶ Ampliar';};
  document.addEventListener('fullscreenchange',()=>{$('#fullscreen').textContent=document.fullscreenElement?'⛶ Reduzir':'⛶ Ampliar';});
  $('#reset').onclick=()=>{keys={};$('#reset-dialog').showModal();};$('#reset-cancel').onclick=()=>$('#reset-dialog').close();$('#reset-confirm').onclick=()=>{state=initialState();nextShot=0;invulnerableUntil=0;lastSave=0;keys={};paused=false;$('#pause-overlay').hidden=true;$('#pause').setAttribute('aria-pressed','false');$('#pause').textContent='Ⅱ';$('#reset-dialog').close();save();updateHud();notify('Nova expedição! Vá até o marco dourado 01 para investigar.');canvas.focus({preventScroll:true});};
  load();updateHud();state.camera=clamp(state.player.x-420,0,worldWidth-1200);notify('Explore com as setas. Espaço para saltar, E para investigar e F para entrar no blindado.',6500);
  window.ChagasGame=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({player:state.player,tank:state.tank,solved:state.solved,health:state.health,boss:state.boss,notes:state.notes.filter(n=>n.collected).length,paused,quizOpen:quiz.isOpen,camera:state.camera}))});
  requestAnimationFrame(frame);
})();
