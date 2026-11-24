(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const screens = ['home','levels','help','game','result'];
  const logo = new Image(); logo.src = 'images.png';
  let storage;
  try { storage = window.localStorage; } catch (_) { storage = null; }
  const store = RVMProgress.create(storage);
  const colors = RVMProgress.COLORS;
  const levels = RVMEngine.LEVELS, levelCount = levels.length;
  const canvas = $('game-canvas'), ctx = canvas.getContext('2d');
  const hero = $('hero-canvas'), heroCtx = hero.getContext('2d');
  let screen = 'home', previousScreen = 'home', paused = false, game = null, lastResult = null;
  let viewW = 1280, viewH = 720, camera = 0, accumulator = 0, lastFrame = 0;
  let particles = [], toastUntil = 0, runTime = 0, latestHud = '', currentLevel = 0;
  let jumpQueued = false, audio = null, lastCollectMessage = 0;
  let taughtTraps = new Set();
  const keys = new Set(), pointers = {left:new Set(),right:new Set(),jump:new Set(),fire:new Set()};
  const recyclingNotes = ['Her ambalajı döngüye geri kazandırmak, kaynaklarımızı daha verimli kullanmaya yardımcı olur.','Sahilde bıraktığımız temiz bir iz, doğa için güzel bir başlangıçtır.','Geri dönüşüm, günlük hayatımızdaki küçük seçimlerle başlar.','Ormanları ve diğer yaşam alanlarını korumak hepimizin elinde.','Ambalajları doğaya bırakmak yerine uygun toplama noktasına ulaştır.','Enerjiyi ve kaynakları dikkatli kullan; ambalajını toplama noktasına ulaştır.','Sulak alanlara çöp bırakma. Canlıların yuvasını birlikte koruyabiliriz.','Doğru ayrılan ambalajlar, geri dönüşüm sürecinin ilk adımıdır.','Kaynaklar sınırlıdır. Yeniden kullanmak ve geri dönüştürmek doğaya katkı sağlar.','Döngü burada bitmez: Öğrendiklerini arkadaşlarınla paylaş!'];
  const color = () => (colors.find(c=>c.id===store.data.color)||colors[0]).color;
  const formatTime = time => { const t=Math.max(0,Number(time)||0); return String(Math.floor(t/60)).padStart(2,'0')+':'+(t%60).toFixed(1).padStart(4,'0'); };
  const starsHTML = count => '★'.repeat(count)+'<span class="empty">'+'★'.repeat(3-count)+'</span>';
  function persistStatus(){ $('storage-note').hidden = store.available; }
  function unlockAudio(){if(!store.data.sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)(); if(audio.state==='suspended')audio.resume().catch(()=>{});}catch(_){}}
  function tone(freq,duration=.08,delay=0,type='sine',volume=.06){if(!store.data.sound||!audio)return;try{const o=audio.createOscillator(),g=audio.createGain(),at=audio.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,at);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(volume,at+.008);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g);g.connect(audio.destination);o.start(at);o.stop(at+duration+.02);}catch(_){}}
  function sound(kind){unlockAudio();if(kind==='collect'){tone(784);tone(1175,.12,.055);}else if(kind==='jump'){tone(350,.08,0,'triangle',.035);tone(520,.07,.04,'triangle',.025);}else if(kind==='complete'){[523,659,784,1047].forEach((f,i)=>tone(f,.25,i*.12));}else if(kind==='fall'){tone(260,.15,0,'triangle',.04);tone(330,.15,.12,'triangle',.04);}else tone(620,.07);}
  function showScreen(next){
    if(next!=='game'){clearControls(); paused=false; $('pause-overlay').hidden=true;}
    screen=next; for(const s of screens) $(s+'-screen').hidden=s!==next;
    document.body.dataset.screen=next; accumulator=0;
    if(next==='home') renderHome(); if(next==='levels')renderLevels();
    if(next==='game')resize();
    window.scrollTo(0,0);
  }
  function renderHome(){
    $('unlocked-count').textContent=store.data.unlocked+' / '+levelCount;
    $('world-count').textContent=levelCount;
    $('home-colors').innerHTML=colors.map(c=>{const locked=c.unlockAfter>=0&&!store.data.results[c.unlockAfter],required=c.unlockAfter+1;return '<button class="color-swatch" data-color="'+c.id+'" style="--swatch:'+c.color+'" aria-label="'+c.name+(locked?' — '+required+'. bölümü tamamla':'')+'" title="'+(locked?required+'. bölümü tamamlayınca açılır':c.name)+'" aria-pressed="'+(store.data.color===c.id)+'" '+(locked?'disabled':'')+'><span></span>'+(locked?'<svg><use href="#i-lock"/></svg>':'')+'</button>';}).join('');
    $('color-name').textContent=(colors.find(c=>c.id===store.data.color)||colors[0]).name;
    $('play-button').innerHTML='<svg><use href="#i-play"/></svg> '+(store.data.results.some(Boolean)?'Maceraya devam':'Oyuna başla');
    updateSound();persistStatus();
  }
  function difficultyHTML(level){
    const rating=level.difficultyRating||level.id+1;
    return '<div class="difficulty-meter"><span>'+ (level.difficulty||'Zorluk '+rating)+'</span><span class="difficulty-bars" aria-label="Zorluk '+rating+' / '+levelCount+'">'+Array.from({length:levelCount},(_,i)=>'<i class="'+(i<rating?'filled':'')+'"></i>').join('')+'</span></div>';
  }
  function renderLevels(){
    const totalStars=store.data.results.reduce((sum,r)=>sum+(r?r.stars:0),0),finished=store.data.results.filter(Boolean).length;
    $('journey-completed').textContent=finished+' / '+levelCount+' parkur tamamlandı';
    $('journey-stars').textContent=totalStars+' / '+levelCount*3;
    $('journey-map').innerHTML=levels.map((level,i)=>{const locked=i>=store.data.unlocked,rec=store.data.results[i],current=!locked&&!rec;return '<button class="journey-stop '+level.theme+' '+(locked?'locked':rec?'cleared':'current')+'" data-level="'+i+'" aria-label="'+level.name+(locked?' — önceki bölümü tamamla':' — '+(rec?'tamamlandı':'oyna'))+'" '+(locked?'disabled':'')+'><span class="journey-dot">'+(locked?'<svg><use href="#i-lock"/></svg>':rec?'<svg><use href="#i-check"/></svg>':String(i+1).padStart(2,'0'))+'</span><strong>'+level.name+'</strong><small>'+(current?'Sıradaki maceran':level.difficulty||'Parkur '+(i+1))+'</small></button>';}).join('');
    $('level-cards').innerHTML=levels.map((level,i)=>{
      const locked=i>=store.data.unlocked,rec=store.data.results[i];
      return '<article class="level-card '+(locked?'locked':'')+'"><div class="level-art '+level.theme+'"><span class="art-sun"></span><span class="art-cloud"></span><span class="art-tree"></span><span class="level-index">BÖLÜM '+String(i+1).padStart(2,'0')+'</span>'+(i>=6?'<span class="new-world">YENİ DÜNYA</span>':'')+(locked?'<span class="lock-bubble"><svg><use href="#i-lock"/></svg></span>':'')+'</div><div class="level-card-body">'+difficultyHTML(level)+'<h3>'+level.name+'</h3><p class="level-desc">'+(level.description||level.subtitle)+'</p><div class="mechanic-tag"><svg><use href="#i-spark"/></svg>'+(level.mechanic||'Koş ve çift zıpla')+'</div><div class="boss-card-label"><span>♻</span> '+(level.bossConfig?.name||'Çöp canavarı')+' · Bölüm sonu</div><div class="level-card-rewards"><div class="level-stars" aria-label="'+(rec?rec.stars:0)+' yıldız">'+starsHTML(rec?rec.stars:0)+'</div><span>12 ambalaj</span></div><div class="level-record">'+(locked?levels[i-1].name+' bölümünü tamamlayınca açılır.':rec?'En iyi süre <strong>'+formatTime(rec.bestTime)+'</strong><br>Yüksek puan <strong>'+rec.highScore+'</strong>'+(rec.badge?' · Döngü Kahramanı':''):'İlk kişisel rekorun seni bekliyor.')+'</div><button class="button '+(locked?'secondary':'primary')+'" data-level="'+i+'" '+(locked?'disabled':'')+'>'+(locked?'<svg><use href="#i-lock"/></svg> Henüz kilitli':rec?'Yeniden keşfet':'Bu parkurda koş')+'</button></div></article>';
    }).join('');
  }
  function updateSound(){const on=store.data.sound;$('sound-button').innerHTML='<svg><use href="#i-'+(on?'sound':'mute')+'"/></svg>';$('sound-button').setAttribute('aria-label',on?'Sesi kapat':'Sesi aç');$('sound-button').title=on?'Sesi kapat':'Sesi aç';$('sound-button').setAttribute('aria-pressed',String(on));}
  function clearControls(){keys.clear();jumpQueued=false;Object.values(pointers).forEach(s=>s.clear());document.querySelectorAll('[data-control]').forEach(b=>b.classList.remove('pressed'));}
  function startLevel(index){if(!Number.isInteger(index)||index<0||index>=store.data.unlocked||index>=levelCount)return;unlockAudio();currentLevel=index;game=new RVMEngine.Game(index);camera=0;particles=[];paused=false;runTime=0;latestHud='';lastCollectMessage=0;taughtTraps.clear();toastUntil=0;clearControls();$('toast').classList.remove('visible');$('pause-overlay').hidden=true;$('hud-level-num').textContent='BÖLÜM '+String(index+1).padStart(2,'0')+' / '+String(levelCount).padStart(2,'0');$('hud-level').textContent=game.level.name;$('hud-level').title=game.level.name;$('game-tip-text').textContent=game.level.tip||'Koş, çift zıpla; engelleri dikkatle aş!';$('hud-difficulty').textContent=(game.level.difficulty||'Zorluk '+(index+1))+' · En az 8 ambalaj';showScreen('game');updateHUD();}
  function pauseGame(automatic=false){if(screen!=='game'||paused||!game||game.mode==='complete')return;paused=true;clearControls();$('pause-overlay').hidden=false;$('resume-button').focus();if(automatic&&audio&&audio.state==='running')audio.suspend().catch(()=>{});}
  function resumeGame(){if(screen!=='game')return;paused=false;accumulator=0;lastFrame=performance.now();$('pause-overlay').hidden=true;clearControls();unlockAudio();}
  function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');toastUntil=performance.now()+2900;}
  function deliver(){if(screen!=='game'||paused||!game)return;unlockAudio();if(!game.deliver()){if(game.nearMachine)toast(game.boss&&!game.boss.defeated?'Önce Döngü Köpüğü ile çöp canavarını yok et.':'Çok az kaldı! DOA için en az 8 ambalaj topla.');}}
  function addParticles(x,y){for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2,s=35+Math.random()*120;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,life:.7,maxLife:.7,type:'spark',color:i%2?'#ffda6a':'#ffffff'});}particles.push({x,y:y-20,vx:0,vy:-38,life:1,maxLife:1,type:'text',text:'+10',color:'#08755e'});}
  function processEvents(){for(const e of game.drainEvents()){
    if(e.type==='collect'){sound('collect');addParticles(e.x,e.y);if(game.collected===8)toast('Teslime hazırsın! İstersen 12’sini de topla.');else if(game.collected===12)toast('Eksiksiz döngü! Şimdi DOA’ya koş.');else if(game.collected-lastCollectMessage>=4){toast('Harika gidiyorsun! Doğa sana teşekkür ediyor.');lastCollectMessage=game.collected;}}
    else if(e.type==='jump')sound('jump');
    else if(e.type==='fall'){sound('fall');camera=Math.max(0,game.p.x-viewW*.3);toast(e.text||'Bir daha dene, başarabilirsin! +3 saniye');}
    else if(e.type==='checkpoint'){tone(660,.12);tone(880,.14,.1);toast(e.text||'Güvenli nokta! Buradan devam edebilirsin.');}
    else if(e.type==='delivery'){sound('complete');toast('Döngü tamamlanıyor. Doğa canlanıyor!');}
    else if(e.type==='needMore')toast(e.text||'DOA için en az 8 ambalaj topla.');
    else if(e.type==='bossActivated'){tone(392,.18);tone(523,.2,.16);toast((game.boss?.name||'Çöp canavarı')+' geldi! Köpük düğmesini basılı tut.');}
    else if(e.type==='foam'){tone(450,.045,0,'sine',.012);}
    else if(e.type==='bossHit'){tone(880,.04,0,'sine',.02);}
    else if(e.type==='bossDefeated'){sound('complete');toast('Çöp canavarı yok oldu! +100 puan. Şimdi DOA’ya teslim et.');}
    else if(e.type==='bounce'&&!taughtTraps.has('bounce')){taughtTraps.add('bounce');tone(620,.12);toast('Esnek zemin seni yükseltir! Havada bir kez daha zıplayabilirsin.');}
    else if(e.type==='crumble'&&!taughtTraps.has('crumble')){taughtTraps.add('crumble');toast('Bu platform kısa süre sonra çöker. İleri zıpla; yeniden oluşacak!');}
    else if(e.type==='bossRequired')toast('Önce çöp canavarını Döngü Köpüğü ile yok et!');
    else if(e.type==='complete')finishLevel(e.result||game.result);
  }}
  function finishLevel(result){
    if(!result||screen==='result')return;lastResult=result;const info=store.record(currentLevel,result),rec=store.data.results[currentLevel];persistStatus();
    $('result-stars').innerHTML=starsHTML(result.stars);$('result-stars').setAttribute('aria-label',result.stars+' yıldız');
    $('result-title').textContent=result.count===12?'Bir Döngü Kahramanı!':'Harika iş, RVM!';
    $('result-description').textContent=result.count+' ambalajı '+game.level.name+' bölümünde yeni bir döngüye kattın.';
    $('hero-badge').hidden=!result.badge;$('result-base-label').textContent=result.count+' ambalaj × 10';$('result-base').textContent=result.base;$('result-time-bonus').textContent='+'+result.timeBonus;$('perfect-row').hidden=!result.perfectBonus;$('result-boss-bonus').textContent='+'+(result.bossBonus||0);$('boss-bonus-row').hidden=!result.bossBonus;$('result-total').textContent=result.total;
    $('result-time').textContent=formatTime(result.time);$('result-best').textContent=formatTime(rec.bestTime);$('result-high').textContent=rec.highScore;$('new-record').hidden=!info.newBest;
    const rewardText=info.unlockedColor?'Yeni robot rengi açıldı: '+(colors.find(c=>c.id===info.unlockedColor)||{}).name+'! ':'';
    $('unlock-message').textContent=rewardText+(currentLevel===levelCount-1?'Tüm dünyalara hayat verdin. Şimdi üç yıldızları tamamla!':info.unlockedLevel?levels[currentLevel+1].name+' açıldı!':'Bir sonraki parkur seni bekliyor!');
    $('result-lesson').textContent=recyclingNotes[currentLevel%recyclingNotes.length];
    $('result-run-detail').textContent=(game.falls?'Güvenli noktadan dönüş: '+game.falls+' · Ceza: +'+game.penalty+' sn':'Tertemiz koşu! Hiç güvenli noktaya dönmedin.')+' · Hedef süre: '+game.level.targetTime+' sn';
    $('next-button').textContent=currentLevel<levelCount-1?'Sonraki bölüm':'Bölümleri keşfet';sound('complete');showScreen('result');
  }
  function updateHUD(){if(!game)return;const signature=[formatTime(game.elapsed),game.collected,game.score].join('|');if(signature!==latestHud){$('hud-time').textContent=formatTime(game.elapsed);$('hud-count').innerHTML=game.collected+' <em>/ 12</em>';$('hud-score').textContent=game.score;latestHud=signature;}$('track-fill').style.width=Math.min(100,100*game.p.x/(game.level.width-200))+'%';
    const boss=game.boss,bossReady=!boss||boss.defeated;
    const near=game.nearMachine&&game.mode==='playing';$('delivery-panel').hidden=!near;$('deliver-button').disabled=game.collected<8||!bossReady;$('deliver-button').hidden=game.collected<8||!bossReady;$('delivery-message').textContent=!bossReady?'Önce çöp canavarını yok et. Köpük düğmesini basılı tut!':game.collected>=8?'DOA hazır. Döngüyü tamamla!':'DOA için '+(8-game.collected)+' ambalaj daha bul. Geri dönüp keşfedebilirsin!';
    const fighting=!!boss&&(boss.active||boss.defeated)&&game.mode==='playing';$('boss-panel').hidden=!fighting;document.body.classList.toggle('boss-active',fighting);
    if(fighting){const percent=Math.round(100*(1-boss.health/boss.maxHealth));$('boss-name').textContent=boss.name;$('boss-percent').textContent='%'+percent;$('boss-meter').style.width=percent+'%';$('boss-progress').setAttribute('aria-valuenow',String(percent));const warn=!!boss.telegraph&&!boss.defeated;$('boss-panel').classList.toggle('warning',warn);$('boss-status').textContent=boss.defeated?'Canavar yok oldu! Ambalajları DOA’ya teslim et.':boss.vulnerable===false?'Hazırlanıyor… Uyarısını izle, zıplamaya hazır ol!':warn?'Uyarı! Hareketi izle ve zıplayarak kaçın.':'KÖPÜK düğmesini basılı tut · Canavara bak.';}

  }
  function resize(){if(screen!=='game')return;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;viewH=rect.height>rect.width*1.25?900:rect.height<600?800:720;viewW=rect.width/rect.height*viewH;const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(canvas.width/viewW,0,0,canvas.height/viewH,0,0);}
  function frame(now){const dt=Math.min(.05,Math.max(0,(now-(lastFrame||now))/1000));lastFrame=now;
    if(screen==='game'&&game){if(!paused){accumulator+=dt;runTime+=dt;let guard=0;while(accumulator>=1/120&&guard++<8){const input={left:keys.has('ArrowLeft')||keys.has('KeyA')||pointers.left.size>0,right:keys.has('ArrowRight')||keys.has('KeyD')||pointers.right.size>0,jump:jumpQueued,fire:keys.has('KeyF')||pointers.fire.size>0};jumpQueued=false;game.step(1/120,input);accumulator-=1/120;processEvents();if(screen!=='game')break;}for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}particles=particles.filter(p=>p.life>0);const target=Math.max(0,Math.min(game.level.width-viewW,game.p.x-viewW*.32));camera+=(target-camera)*(1-Math.exp(-7*dt));updateHUD();}
      game.cameraX=camera;RVMRenderer.draw(ctx,game,{width:viewW,height:viewH,time:runTime,color:color(),logo,particles});
    }else if(screen==='home')drawHero(now/1000);
    if(toastUntil&&now>toastUntil){$('toast').classList.remove('visible');toastUntil=0;}requestAnimationFrame(frame);
  }
  function roundRect(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
  function drawHero(t){const c=heroCtx;c.clearRect(0,0,700,610);c.save();
    const sky=c.createRadialGradient(380,260,60,380,280,310);sky.addColorStop(0,'#d9f1d7');sky.addColorStop(1,'#d9f1d700');c.fillStyle=sky;c.fillRect(0,0,700,610);
    c.save();c.strokeStyle='#b8d7ae';c.lineWidth=1.5;c.setLineDash([4,9]);c.beginPath();c.ellipse(375,290,232,215,-.2,0,Math.PI*2);c.stroke();c.restore();
    c.fillStyle='#f9de79';c.beginPath();c.arc(515,132,40,0,Math.PI*2);c.fill();c.fillStyle='#fff7c9';c.beginPath();c.arc(515,132,26,0,Math.PI*2);c.fill();
    for(let i=0;i<3;i++){const x=130+i*180+Math.sin(t*.15+i)*8,y=120+i%2*69;c.fillStyle='#ffffffa0';roundRect(c,x,y,91,18,12,'#ffffffa0');c.beginPath();c.ellipse(x+43,y-2,22,15,0,0,7);c.fill();}
    c.fillStyle='#b2d6a7';c.beginPath();c.ellipse(352,421,253,86,0,0,7);c.fill();c.fillStyle='#89bd94';c.beginPath();c.ellipse(430,439,213,61,0,0,7);c.fill();
    c.fillStyle='#a7c38b';c.beginPath();c.ellipse(353,486,248,62,0,0,7);c.fill();c.fillStyle='#c5d39c';c.beginPath();c.ellipse(353,474,247,57,0,0,7);c.fill();c.fillStyle='#5b9d75';c.beginPath();c.ellipse(353,456,247,53,0,0,7);c.fill();c.fillStyle='#82bb78';c.beginPath();c.ellipse(353,447,246,48,0,0,7);c.fill();
    function tree(x,y,s){c.save();c.translate(x,y);c.scale(s,s);roundRect(c,-7,-82,14,91,7,'#719773');c.fillStyle='#368969';c.beginPath();c.ellipse(0,-108,44,60,-.12,0,7);c.fill();c.fillStyle='#58a875';c.beginPath();c.ellipse(17,-116,30,43,.2,0,7);c.fill();c.strokeStyle='#7bb884';c.lineWidth=2;c.beginPath();c.moveTo(0,-50);c.lineTo(0,-140);c.moveTo(0,-82);c.lineTo(-19,-104);c.stroke();c.restore();}tree(175,424,.85);tree(567,420,1.05);tree(112,401,.5);
    c.fillStyle='#285b4830';c.beginPath();c.ellipse(368,448,75,18,0,0,7);c.fill();RVMRenderer.robot(c,273,157+Math.sin(t*1.8)*3,3.55,{time:t,color:color(),logo,running:false,airborne:false,dir:1});
    c.save();c.translate(195,307+Math.sin(t*2)*7);c.rotate(-.17);roundRect(c,-12,-30,25,56,8,'#e7faf2','#7cb7a7');roundRect(c,-6,-41,13,13,3,'#009c83');roundRect(c,-11,-8,23,19,3,'#35b59d');c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(-3,-1);c.lineTo(5,-1);c.stroke();c.restore();
    c.save();c.translate(529,326+Math.sin(t*2+.8)*7);c.rotate(.18);roundRect(c,-15,-27,30,49,7,'#ffda6a','#c6a656');roundRect(c,-15,-29,30,7,4,'#eaf3df');c.strokeStyle='#b59735';c.lineWidth=2;c.beginPath();c.ellipse(0,-26,7,2,0,0,7);c.stroke();c.fillStyle='#fff7d5';c.fillRect(-7,-12,14,18);c.restore();
    for(let i=0;i<10;i++){let x=170+i*41,y=450+Math.sin(i*7)*16;c.strokeStyle='#387e56';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-12);c.stroke();c.fillStyle=i%2?'#ffe58c':'#eaf4c5';for(let a=0;a<5;a++){c.beginPath();c.arc(x+Math.cos(a*1.256)*4,y-12+Math.sin(a*1.256)*4,3,0,7);c.fill();}c.fillStyle='#deb440';c.beginPath();c.arc(x,y-12,2.2,0,7);c.fill();}
    c.fillStyle='#caad4b';for(const [x,y,s] of [[227,180,9],[585,265,7],[122,272,6]]){c.save();c.translate(x,y+Math.sin(t+x)*2);c.rotate(Math.PI/4);c.fillRect(-s/2,-s/2,s,s);c.restore();}c.restore();
  }
  $('play-button').addEventListener('click',()=>startLevel(Math.min(store.data.unlocked-1,levelCount-1)));
  $('levels-button').addEventListener('click',()=>showScreen('levels'));
  $('result-levels').addEventListener('click',()=>showScreen('levels'));
  $('brand-home').addEventListener('click',()=>showScreen('home'));
  document.querySelectorAll('[data-action="home"]').forEach(b=>b.addEventListener('click',()=>showScreen('home')));
  $('home-colors').addEventListener('click',e=>{const b=e.target.closest('[data-color]');if(!b||b.disabled)return;store.setColor(b.dataset.color);renderHome();sound('click');});
  const chooseLevel=e=>{const b=e.target.closest('[data-level]');if(b&&!b.disabled)startLevel(Number(b.dataset.level));};
  $('level-cards').addEventListener('click',chooseLevel);$('journey-map').addEventListener('click',chooseLevel);
  function openHelp(){previousScreen=screen;if(screen==='game')pauseGame();showScreen('help');}
  $('help-button').addEventListener('click',openHelp);$('how-button').addEventListener('click',openHelp);
  $('help-back').addEventListener('click',()=>{const wasGame=previousScreen==='game';showScreen(wasGame?'game':previousScreen==='result'?'result':'home');if(wasGame)pauseGame();});
  $('help-play').addEventListener('click',()=>{if(previousScreen==='game'&&game){showScreen('game');resumeGame();}else startLevel(Math.min(store.data.unlocked-1,levelCount-1));});
  $('sound-button').addEventListener('click',()=>{store.setSound(!store.data.sound);updateSound();persistStatus();if(store.data.sound){unlockAudio();tone(700);}else if(audio)audio.suspend().catch(()=>{});});
  $('pause-button').addEventListener('click',()=>pauseGame());$('resume-button').addEventListener('click',resumeGame);
  $('restart-button').addEventListener('click',()=>startLevel(currentLevel));$('retry-button').addEventListener('click',()=>startLevel(currentLevel));
  $('next-button').addEventListener('click',()=>currentLevel<levelCount-1?startLevel(currentLevel+1):showScreen('levels'));
  $('deliver-button').addEventListener('click',deliver);
  $('fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else {await $('game-screen').requestFullscreen({navigationUI:'hide'});try{await window.screen.orientation.lock('landscape');}catch(_){} }resize();}catch(_){toast('Yatay tutarak parkurun daha fazlasını görebilirsin.');}});
  let installPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install-button').hidden=false;});
  $('install-button').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;$('install-button').hidden=true;});
  if(!window.DOA_NATIVE&&!/^(localhost|127\.0\.0\.1)$/.test(window.location?.hostname||'')&&'serviceWorker' in (window.navigator||{})&&/^https?:$/.test(window.location?.protocol||'')){window.addEventListener('load',()=>{window.navigator.serviceWorker.register('sw.js',{scope:'./',updateViaCache:'none'}).catch(()=>{});});}
  window.visualViewport?.addEventListener('resize',resize);
  window.addEventListener('keydown',e=>{if(screen!=='game')return;const handled=['ArrowLeft','ArrowRight','KeyA','KeyD','Space','Escape','KeyP','KeyE','KeyF'];if(!handled.includes(e.code))return;e.preventDefault();if(e.code==='Escape'||e.code==='KeyP'){if(!e.repeat)paused?resumeGame():pauseGame();return;}if(paused)return;unlockAudio();if(e.code==='Space'&&!e.repeat)jumpQueued=true;if(e.code==='KeyE'&&!e.repeat)deliver();keys.add(e.code);});
  window.addEventListener('keyup',e=>keys.delete(e.code));
  document.querySelectorAll('[data-control]').forEach(button=>{
    const action=button.dataset.control;
    button.addEventListener('pointerdown',e=>{e.preventDefault();if(screen!=='game'||paused)return;unlockAudio();try{button.setPointerCapture(e.pointerId);}catch(_){}pointers[action].add(e.pointerId);button.classList.add('pressed');if(action==='jump')jumpQueued=true;});
    const release=e=>{pointers[action].delete(e.pointerId);if(!pointers[action].size)button.classList.remove('pressed');};
    button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);button.addEventListener('contextmenu',e=>e.preventDefault());
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame(true);});window.addEventListener('blur',()=>pauseGame(true));window.addEventListener('resize',resize);
  // Read-only state plus normal UI actions make local diagnostics and play testing possible.
  window.DOAGame={get game(){return game;},get state(){return {screen,paused,currentLevel,progress:JSON.parse(JSON.stringify(store.data)),input:{left:pointers.left.size,right:pointers.right.size,jump:pointers.jump.size,fire:pointers.fire.size}};},startLevel,formatTime};
  renderHome();showScreen('home');requestAnimationFrame(frame);
})();
