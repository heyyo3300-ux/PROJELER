(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.RVMEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const PHYSICS=Object.freeze({speed:300,acceleration:2300,friction:2500,jump:600,gravity:1500,maxFall:950,coyote:0.12,buffer:0.13});
  const ground=(x,w)=>({x,y:590,w,h:200,type:'ground'});
  const pad=(x,y,w=210)=>({x,y,w,h:24,type:'platform'});
  const crate=(x,h=80)=>({x,y:590-h,w:66,h,type:'crate'});
  const mover=(id,baseX,baseY,axis='x',range=80,period=4.5,w=160)=>({id,type:'moving',baseX,baseY,axis,range,period,phase:0,w,h:24});
  const spring=x=>({x,y:590,w:80,h:14,type:'bounce',power:715});
  const belt=(x,beltSpeed=-50,w=200)=>({x,y:590,w,h:16,type:'conveyor',beltSpeed});
  const crumble=(x,y,collapseAfter=1,w=180)=>({x,y,w,h:24,type:'crumble',collapseAfter,recoverAfter:3.2});
  const gate=(id,x,period=5,activeDuration=1.5,phase=0,y=410)=>({id,kind:'barrier',x,y,w:26,h:590-y,period,activeDuration,warningDuration:0.9,phase});
  const swing=(id,anchorX,period=4.5)=>({id,kind:'pendulum',anchorX,anchorY:310,ropeLength:200,amplitude:0.6,period,phase:0,w:40,h:40});
  const wind=(id,x,phase=0)=>({id,x,y:350,w:105,h:240,period:5,activeDuration:1.3,warningDuration:0.8,phase});
  function level(name,theme,width,floors,boxes,platforms,low,high,checkpoints,focus,routeDescription){return{
    id:0,name,theme,width,courseWidth:width,subtitle:routeDescription,description:routeDescription,
    solids:floors.map(p=>ground(...p)).concat(boxes.map(p=>crate(...p)),platforms.map(p=>pad(...p))),
    items:low.map(x=>[x,544]).concat(high).map(([x,y],i)=>({id:'pack-'+i,x,y,type:['plastic','glass','can'][i%3]})),
    checkpoints:checkpoints.map(x=>({x,y:510})),machine:{x:width-180,y:448,w:110,h:142},movingPlatforms:[],hazards:[],vents:[],focus,mechanic:focus,routeDescription,tip:'',learningNotes:[],signs:[]
  };}
  const LEVELS=[
    level('Yeşil Park','park',3100,[[0,900],[1010,980],[2110,990]],[[500,52],[1500,65],[2450,65]],[[350,480,180],[1180,465,200],[1690,425,190],[2220,455,190]],[220,760,1100,1450,1810,2180,2610,2850],[[440,434],[1280,419],[1780,379],[2310,409]],[100,1050,2150],'Çift zıplamayı keşfet','Geniş güvenli zeminlerde koşmayı öğren; kısa çukurları aş, ilk yüksek rotanı dene.'),
    level('Temiz Sahil','beach',3700,[[0,1000],[1130,1240],[2510,1190]],[[650,70],[1680,74],[2940,80]],[[380,470,190],[1280,460,200],[1840,350,200],[2620,450,200],[3150,340,210]],[240,850,1210,1610,2260,2580,3100,3430],[[475,424],[1380,414],[1940,304],[3250,294]],[100,1170,2550],'Esnek zemin ve taşıma bandı','Sahilin esnek zemini seni yükseltir; kısa taşıma bandında hızını ayarlayarak ilerle.'),
    level('Geleceğin Şehri','city',4300,[[0,1060],[1210,1180],[2550,1750]],[[550,80],[1770,85],[3320,90]],[[350,460,210],[790,345,190],[1380,450,210],[2120,340,210],[2790,450,200],[3610,330,210]],[240,920,1340,1940,2280,2680,3490,4040],[[450,414],[1480,404],[2210,294],[3710,284]],[100,1250,2590],'Işığın ritmini izle','Sarı uyarıyı fark et, enerji geçidi açılınca ilerle. Yüksek yol sana başka bir seçenek sunar.'),
    level('Rüzgâr Ormanı','forest',4900,[[0,1050],[1230,1120],[2530,1140],[3860,1040]],[[600,80],[1630,88],[2940,90],[4260,85]],[[350,460,200],[820,345,180],[1390,450,210],[1870,340,220],[2670,450,210],[3180,330,210],[4050,440,210],[4460,330,220]],[240,940,1350,2190,2630,3530,3980,4630],[[450,414],[1980,294],[3280,284],[4570,284]],[100,1270,2570,3900],'Hareketli platformla yol al','Hareketli ahşap köprüye in, onunla taşın ve bir sonraki güvenli zemine zıpla.'),
    level('Döngü Vadisi','canyon',5500,[[0,1150],[1350,1170],[2720,1200],[4130,1370]],[[610,84],[1690,90],[3070,94],[4510,96]],[[400,460,210],[890,340,200],[1480,450,210],[1920,330,220],[2830,450,210],[3290,320,220],[4260,440,210],[4930,320,220]],[240,1040,1450,2300,2810,3740,4290,5240],[[500,414],[2020,284],[3390,274],[5030,274]],[100,1390,2760,4170],'Geniş çukurlar ve sallanan engel','Köprülerin ritmini ve mekanik sarkacın yönünü izle; yüksek geçişler daha fazla ambalaj kazandırır.'),
    level('Yeşil Enerji Üssü','energy',6100,[[0,1200],[1410,1270],[2900,1290],[4410,1690]],[[650,88],[1750,94],[3260,96],[4820,100]],[[380,455,220],[930,335,200],[1510,445,210],[2110,320,220],[3040,440,220],[3640,320,220],[4530,430,220],[5260,310,220]],[250,1080,1500,2370,3020,4050,4520,5820],[[490,409],[2210,274],[3740,274],[5370,264]],[100,1450,2940,4450,5880],'Köprü ve geçidi birlikte zamanla','Dikey köprü ve ışıklı geçitleri art arda kullan; dilersen kısa hız şeridini seç.'),
    level('Sulak Alan Macerası','wetland',6600,[[0,1300],[1520,1340],[3090,1380],[4700,1900]],[[610,90],[1860,92],[3460,96],[5100,94]],[[400,460,220],[1000,340,220],[1650,450,210],[2200,320,220],[3240,440,210],[3850,310,220],[4850,430,220],[5580,310,220]],[260,1190,1640,2640,3220,4240,4820,6310],[[510,414],[2310,274],[3960,264],[5690,264]],[100,1560,3130,4740,6370],'Nilüfer sıçrayışlarını birleştir','Esnek nilüfer zeminleri ve yüzen köprülerle sulak alanı aş; dört yüksek ambalaj için akışını koru.'),
    level('Buzul Işıltısı','ice',7100,[[0,1380],[1610,1430],[3280,1460],[4980,2120]],[[660,90],[1980,96],[3650,98],[5410,100]],[[430,455,230],[1050,330,220],[1740,445,220],[2350,310,220],[3400,430,220],[4100,300,220],[5130,420,220],[6020,300,220]],[260,1260,1730,2830,3410,4510,5120,6810],[[540,409],[2460,264],[4210,254],[6130,254]],[100,1650,3320,5020,6870],'Kaymayı ve çöken platformu yönet','Buzda daha erken yavaşla. Titreyen üst platformdan zamanında ayrıl; güvenli alt yol her zaman açık.'),
    level('Jeotermal Keşif','volcano',7600,[[0,1450],[1690,1520],[3460,1540],[5250,2350]],[[700,94],[2100,98],[3860,100],[5700,102]],[[450,450,230],[1120,325,220],[1820,440,220],[2500,300,220],[3600,430,220],[4300,300,220],[5420,420,220],[6450,300,230]],[260,1310,1820,2990,3590,4770,5400,7310],[[560,404],[2610,254],[4410,254],[6560,254]],[100,1730,3500,5290,7370],'Hava akımını yüksek rota için kullan','Zararsız hava bacalarının uyarısını izle; yükselen akımla üst platformlara yönel, kısa yoldan geri dön.'),
    level('Döngü Bahçesi','garden',8100,[[0,1500],[1750,1620],[3630,1630],[5520,2580]],[[740,96],[2190,100],[4030,102],[5990,106]],[[470,450,240],[1160,320,220],[1880,435,220],[2650,300,220],[3760,425,220],[4530,300,220],[5660,410,220],[6900,300,230]],[260,1370,1880,3120,3760,5020,5660,7790],[[590,404],[2760,254],[4640,254],[7010,254]],[100,1790,3670,5560,7100],'Kendi akışını bul','Hız şeritleri, ters bantlar, köprüler ve sarkaç bir arada. Sekiz ambalajla güvenli rotayı bitir ya da dördünü daha keşfet.')
  ];
  LEVELS[1].solids.push(spring(920),belt(1900,-45,210));
  LEVELS[2].hazards=[gate('city-gate',3050,5.2,1.3,0,416)];
  LEVELS[3].movingPlatforms=[mover('forest-1',1110,480,'x',80,4.8),mover('forest-2',2420,465,'y',30,4.7),mover('forest-3',3750,470,'x',80,4.6)];
  LEVELS[3].vents=[wind('forest-wind',2800,0.5)];
  LEVELS[4].movingPlatforms=[mover('canyon-1',1230,475,'x',80,4.5),mover('canyon-2',2600,465,'y',30,4.4),mover('canyon-3',4000,465,'x',85,4.3)];
  LEVELS[4].hazards=[swing('canyon-swing',4750,4.8)];
  LEVELS[5].movingPlatforms=[mover('energy-1',1300,475,'x',85,4.2),mover('energy-2',2780,455,'y',35,4.1),mover('energy-3',4290,465,'x',85,4)];
  LEVELS[5].hazards=[gate('energy-gate-1',2460,4.8,1.5),gate('energy-gate-2',5580,4.6,1.5,0.5)];
  LEVELS[5].solids.push({x:3650,y:590,w:220,h:14,type:'boost',boostSpeed:385});
  LEVELS[6].solids.push(spring(1120),spring(2740),spring(4360));
  LEVELS[6].movingPlatforms=[mover('wetland-1',1400,480,'x',75,4.1),mover('wetland-2',2970,470,'x',75,4),mover('wetland-3',4580,460,'y',35,3.9)];
  LEVELS[6].hazards=[swing('wetland-swing',6080,4.7)];
  LEVELS[7].friction=1500;LEVELS[7].acceleration=1900;
  LEVELS[7].solids.push(crumble(1280,465,1.1),crumble(2940,450,0.95,190),crumble(4630,440,0.9,190));
  LEVELS[7].movingPlatforms=[mover('ice-1',1480,475,'x',85,4),mover('ice-2',3160,465,'y',35,3.9),mover('ice-3',4860,455,'x',85,3.8)];
  LEVELS[7].hazards=[gate('ice-gate',6520,4.6,1.5)];
  LEVELS[8].movingPlatforms=[mover('thermal-1',1550,475,'x',80,3.9,170),mover('thermal-2',3330,460,'y',35,3.8,170),mover('thermal-3',5120,450,'x',85,3.7,170)];
  LEVELS[8].vents=[wind('thermal-wind-1',1240),wind('thermal-wind-2',2980,0.5),wind('thermal-wind-3',4760,1),wind('thermal-wind-4',6200,1.5)];
  LEVELS[8].solids.push(crumble(3180,455,0.85,170));LEVELS[8].hazards=[gate('thermal-gate',7000,4.3,1.4)];
  LEVELS[9].movingPlatforms=[mover('garden-1',1620,475,'x',85,3.7,170),mover('garden-2',3490,455,'y',40,3.6,170),mover('garden-3',5380,445,'x',90,3.5,170)];
  LEVELS[9].solids.push(belt(1080,65,220),belt(4780,-60,200),{x:2840,y:590,w:230,h:14,type:'boost',boostSpeed:410},crumble(3350,455,0.8),crumble(5210,440,0.7));
  LEVELS[9].hazards=[gate('garden-gate',6380,4.1,1.4,0,402),swing('garden-swing',7410,4.1)];
  // Optional stepping stones make the upper route readable instead of requiring
  // a nearly perfect jump from a distant crate.
  LEVELS[4].solids.push(pad(4690,450,170));
  LEVELS[5].solids.push(pad(5040,440,170));
  LEVELS[6].solids.push(pad(3640,440,160),pad(5360,440,170));
  LEVELS[7].solids.push(pad(3890,430,160),pad(5760,430,170));
  LEVELS[8].solids.push(pad(2290,430,160),pad(4070,425,160),pad(6100,430,170));
  LEVELS[9].solids.push(pad(2440,430,160),pad(4310,425,160),pad(6630,430,170));
  const names=['Başlangıç','Kolay','Ritim','Orta','İleri','Zor','Akıcı','Uzman','Kaşif','Döngü Ustası'],gaps=[120,140,160,190,210,220,230,240,250,260];
  LEVELS.forEach((l,i)=>{l.id=i;l.difficultyRating=i+1;l.difficulty=names[i];l.targetTime=[65,75,90,105,120,135,150,160,175,190][i];l.maxGap=gaps[i];l.tip=l.routeDescription;l.learningNotes=['Alt rotadaki 8 ambalaj bölümü tamamlamana yeter.','Yüksek rotadaki 4 ambalajı da topla: 3 yıldız ve +100 puan.','Çukurda ya da mekanik engelde güvenli noktaya dönersin; yalnızca +3 saniye eklenir.'];l.solids.forEach((s,n)=>{s.id='solid-'+n;});l.signs=[{x:150,text:i?l.focus:'Yön tuşları / A · D ile koş; boşlukla iki kez zıpla!'},{x:l.width-570,text:'DOA yakında! En az 8 ambalaj teslim et.'}];});
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  const oneWay=s=>['platform','moving','crumble','bounce','conveyor','boost'].includes(s.type);
  class Game{
    constructor(index=0){this.reset(index);}
    reset(index=this.levelIndex){
      this.levelIndex=clamp(Math.floor(index)||0,0,LEVELS.length-1);this.level=LEVELS[this.levelIndex];this.items=this.level.items.map(p=>({...p,collected:false}));
      this.staticSolids=this.level.solids.map(s=>({...s,hidden:false,standTime:0,cooldown:0}));this.movingPlatforms=this.level.movingPlatforms.map(s=>({...s,x:s.baseX,y:s.baseY,dx:0,dy:0,vx:0,vy:0}));this.solids=this.staticSolids.concat(this.movingPlatforms);
      this.hazards=this.level.hazards.map(h=>({...h,active:false,warning:false}));this.vents=this.level.vents.map(v=>({...v,active:false,warning:false}));
      this.p={x:100,y:510,w:58,h:80,vx:0,vy:0,grounded:true,jumps:0,dir:1,supportId:'solid-0'};
      this.time=0;this.elapsed=0;this.penalty=0;this.collected=0;this.score=0;this.falls=0;this.invulnerable=0;this.mode='playing';this.deliveryProgress=0;this.result=null;this.events=[];this.checkpoint={...this.level.checkpoints[0]};this.coyote=PHYSICS.coyote;this.jumpBuffer=0;this.updateDynamics(0);return this;
    }
    get nearMachine(){return Math.abs(this.p.x+this.p.w/2-this.level.machine.x-this.level.machine.w/2)<170&&this.p.y+this.p.h>480&&this.p.y<640;}
    drainEvents(){const events=this.events;this.events=[];return events;}
    emit(type,extra={}){this.events.push({type,x:this.p.x+this.p.w/2,y:this.p.y+this.p.h/2,...extra});}
    updateDynamics(dt){
      const tau=Math.PI*2;
      for(const s of this.movingPlatforms){const x=s.x,y=s.y,offset=Math.sin(this.time*tau/s.period+s.phase)*s.range;s.x=s.baseX+(s.axis==='x'?offset:0);s.y=s.baseY+(s.axis==='y'?offset:0);s.dx=dt?s.x-x:0;s.dy=dt?s.y-y:0;s.vx=dt?s.dx/dt:0;s.vy=dt?s.dy/dt:0;}
      for(const h of this.hazards){if(h.kind==='pendulum'){h.angle=Math.sin(this.time*tau/h.period+h.phase)*h.amplitude;h.x=h.anchorX+Math.sin(h.angle)*h.ropeLength-h.w/2;h.y=h.anchorY+Math.cos(h.angle)*h.ropeLength-h.h/2;h.active=true;h.warning=false;h.untilSwitch=0;}else{h.cycle=(this.time+h.phase)%h.period;const open=h.period-h.activeDuration;h.active=h.cycle>=open;h.warning=!h.active&&h.cycle>=open-h.warningDuration;h.untilSwitch=h.active?h.period-h.cycle:open-h.cycle;}}
      for(const v of this.vents){const cycle=(this.time+v.phase)%v.period,open=v.period-v.activeDuration;v.active=cycle>=open;v.warning=!v.active&&cycle>=open-v.warningDuration;}
      for(const s of this.staticSolids)if(s.type==='crumble'){if(s.hidden){s.cooldown=Math.max(0,s.cooldown-dt);if(!s.cooldown){s.hidden=false;s.standTime=0;}}else if(this.p.grounded&&this.p.supportId===s.id){s.standTime+=dt;if(s.standTime>=s.collapseAfter){s.hidden=true;s.cooldown=s.recoverAfter;this.emit('crumble',{x:s.x+s.w/2,y:s.y});}}else s.standTime=Math.max(0,s.standTime-dt);}
    }
    jumpNow(){const p=this.p;if(p.grounded||this.coyote>0)p.jumps=0;if(p.jumps>=2)return false;p.jumps++;p.vy=-PHYSICS.jump;p.grounded=false;p.supportId=null;this.coyote=0;this.jumpBuffer=0;this.emit('jump',{double:p.jumps===2});return true;}
    step(seconds,input={}){const dt=clamp(Number(seconds)||0,0,0.1);if(!dt||this.mode==='complete')return;if(this.mode==='delivering'){this.deliveryProgress=clamp(this.deliveryProgress+dt/2.6,0,1);this.time+=dt;if(this.deliveryProgress>=1)this.complete();return;}if(input.jump)this.jumpBuffer=PHYSICS.buffer;const n=Math.ceil(dt/(1/120));for(let i=0;i<n;i++)this.tick(dt/n,input);}
    tick(dt,input){
      this.time+=dt;this.elapsed+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);this.updateDynamics(dt);const p=this.p,carried=p.grounded&&this.movingPlatforms.find(s=>s.id===p.supportId);if(carried){p.x+=carried.dx;p.y+=carried.dy;}
      const surface=p.grounded&&this.staticSolids.find(s=>s.id===p.supportId);if(surface&&surface.type==='conveyor')p.x+=surface.beltSpeed*dt;
      this.coyote=p.grounded?PHYSICS.coyote:Math.max(0,this.coyote-dt);this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);if(this.jumpBuffer>0)this.jumpNow();
      const dir=(input.right?1:0)-(input.left?1:0),speed=surface&&surface.type==='boost'?surface.boostSpeed:PHYSICS.speed;
      if(dir){p.vx=clamp(p.vx+dir*(this.level.acceleration||PHYSICS.acceleration)*dt,-speed,speed);p.dir=dir;}else{const loss=(this.level.friction||PHYSICS.friction)*dt;p.vx=Math.sign(p.vx)*Math.max(0,Math.abs(p.vx)-loss);}
      p.x=clamp(p.x+p.vx*dt,0,this.level.width-p.w);for(const s of this.solids)if(!oneWay(s)&&!s.hidden&&overlap(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w;p.vx=0;}
      const oldBottom=p.y+p.h;p.vy=Math.min(PHYSICS.maxFall,p.vy+PHYSICS.gravity*dt);p.y+=p.vy*dt;const wasGrounded=p.grounded;p.grounded=false;p.supportId=null;
      for(const s of this.solids){if(s.hidden||p.x+p.w<=s.x+0.001||p.x>=s.x+s.w-0.001)continue;if(p.vy>=0&&oldBottom<=s.y+0.1&&p.y+p.h>=s.y){p.y=s.y-p.h;p.vy=0;p.grounded=true;p.jumps=0;p.supportId=s.id;this.coyote=PHYSICS.coyote;}else if(!oneWay(s)&&p.vy<0&&overlap(p,s)){p.y=s.y+s.h;p.vy=0;}}
      const launch=p.grounded&&this.staticSolids.find(s=>s.id===p.supportId&&s.type==='bounce');if(launch){p.vy=-launch.power;p.grounded=false;p.supportId=null;p.jumps=0;this.emit('bounce');}for(const v of this.vents)if(v.active&&overlap(p,v)){p.vy=Math.min(p.vy,-430);p.grounded=false;p.supportId=null;}
      if(!wasGrounded&&p.grounded)this.emit('land');if(p.grounded&&p.y>=500)for(const cp of this.level.checkpoints)if(cp.x>this.checkpoint.x&&p.x>=cp.x&&p.x-cp.x<180){this.checkpoint={...cp};this.emit('checkpoint',{x:cp.x,y:cp.y,text:'Güvenli nokta kaydedildi!'});}
      for(const item of this.items)if(!item.collected){const x=clamp(item.x,p.x,p.x+p.w),y=clamp(item.y,p.y,p.y+p.h);if((item.x-x)**2+(item.y-y)**2<=24**2){item.collected=true;this.collected++;this.score=this.collected*10;this.emit('collect',{x:item.x,y:item.y,kind:item.type,count:this.collected,id:item.id});}}
      if(p.y>900)this.respawn('fall');else if(!this.invulnerable){const h=this.hazards.find(h=>h.active&&overlap(p,h));if(h)this.respawn('hazard',h.kind);}
    }
    respawn(reason='fall',kind=null){this.penalty+=3;this.elapsed+=3;this.falls++;Object.assign(this.p,{x:this.checkpoint.x,y:this.checkpoint.y,vx:0,vy:0,grounded:true,jumps:0});this.p.supportId=this.staticSolids.find(s=>s.type==='ground'&&this.p.x>=s.x&&this.p.x+this.p.w<s.x+s.w).id;this.coyote=PHYSICS.coyote;this.jumpBuffer=0;this.invulnerable=1.3;this.emit('fall',{reason,kind,penalty:3,text:reason==='hazard'?'Engelin ritmini izle; yeniden deneyebilirsin! +3 sn':'Bir daha dene, başarabilirsin! +3 sn'});}
    deliver(){if(this.mode!=='playing'||!this.nearMachine)return false;if(this.collected<8){this.emit('needMore',{text:'Biraz daha keşfet! DOA için en az 8 ambalaj topla.'});return false;}this.mode='delivering';this.deliveryProgress=0;this.p.vx=0;this.p.vy=0;this.emit('delivery',{count:this.collected});return true;}
    complete(){const count=this.collected,stars=count===12?3:count>=10?2:1,base=count*10,timeBonus=Math.max(0,Math.floor(this.level.targetTime-this.elapsed))*5,perfectBonus=count===12?100:0;this.result={count,stars,base,timeBonus,perfectBonus,total:base+timeBonus+perfectBonus,time:this.elapsed,badge:count===12,mistakes:this.falls};this.mode='complete';this.deliveryProgress=1;this.emit('complete',{result:this.result});}
  }
  return{Game,LEVELS,PHYSICS};
});
