/* Original Canvas artwork for DOA Döngü Koşusu. The company logo is an
   unmodified image asset; every other illustration is drawn in code. */
(function (root) {
  'use strict';
  const TAU = Math.PI * 2;
  function rr(c,x,y,w,h,r=10){c.beginPath();c.roundRect(x,y,w,h,r);}
  function fill(c,color){c.fillStyle=color;c.fill();}
  function stroke(c,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
  function ellipse(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);fill(c,color);}
  function line(c,x1,y1,x2,y2,color,width){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);stroke(c,color,width);}
  function text(c,str,x,y,size,color,weight=700,align='left'){c.font=`${weight} ${size}px "Trebuchet MS", Arial, sans-serif`;c.textAlign=align;c.fillStyle=color;c.fillText(str,x,y);}
  function gradient(c,y1,y2,stops){const g=c.createLinearGradient(0,y1,0,y2);stops.forEach(([p,col])=>g.addColorStop(p,col));return g;}
  const palettes={park:{sky:'#e2f6ec',skyTop:'#ccefe5',far:'#b4d9bc',hill:'#8dc8a5',front:'#60b18c',soil:'#f3d3a2',edge:'#26a978',grass:'#6dcc74'},beach:{sky:'#d9f4ef',skyTop:'#c2e9ed',far:'#b2dfd7',hill:'#61bdb6',front:'#189f9b',soil:'#f5dfa9',edge:'#dfb572',grass:'#88c999'},city:{sky:'#e1f2f0',skyTop:'#c6e7e5',far:'#b2d3cb',hill:'#7bb8b0',front:'#4c9b95',soil:'#d4e1d1',edge:'#6a9f86',grass:'#57b87e'},forest:{sky:'#e3edc7',skyTop:'#b1d9b7',far:'#acd2ad',hill:'#79b69c',front:'#3b8c70',soil:'#bb956f',edge:'#528f53',grass:'#83c253'},canyon:{sky:'#fff0d1',skyTop:'#f8d6b8',far:'#e6baa0',hill:'#d59b7c',front:'#b97a62',soil:'#dca27a',edge:'#b57555',grass:'#d5bd71'},energy:{sky:'#def8eb',skyTop:'#bcdfea',far:'#a9d0c4',hill:'#7eb8ac',front:'#4c9c83',soil:'#d8e5d0',edge:'#438f75',grass:'#69bd79'}};

  function cloud(c,x,y,s,opacity){c.save();c.globalAlpha=opacity;c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-52,15);c.bezierCurveTo(-85,15,-77,-19,-49,-17);c.bezierCurveTo(-48,-52,5,-57,18,-25);c.bezierCurveTo(50,-36,72,-12,65,5);c.bezierCurveTo(95,9,88,30,61,30);c.lineTo(-46,30);c.bezierCurveTo(-62,30,-65,20,-52,15);fill(c,'#ffffff');c.restore();}
  function hill(c,width,base,height,period,phase,color){c.beginPath();c.moveTo(0,base);for(let x=0;x<=width+40;x+=28){let y=base-Math.pow((Math.sin((x+phase)/period)+1)/2,1.8)*height;c.lineTo(x,y);}c.lineTo(width+40,720);c.lineTo(0,720);c.closePath();fill(c,color);}
  function bird(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-11,2);c.quadraticCurveTo(-5,-5,0,1);c.quadraticCurveTo(6,-5,12,1);stroke(c,'#739e96',2);c.restore();}
  function tree(c,x,y,s,t,bright){c.save();c.translate(x,y);c.scale(s,s);const sway=Math.sin(t*.8+x*.01)*2;c.lineCap='round';line(c,0,0,1,-96,'#886c4a',12);line(c,0,-52,-25,-73,'#886c4a',7);line(c,0,-37,24,-66,'#886c4a',7);ellipse(c,sway-27,-111,37,43,bright?'#16ad71':'#60b890');ellipse(c,sway+25,-117,42,43,bright?'#29bd7b':'#6fc19c');ellipse(c,sway,-145,41,42,bright?'#4ccb86':'#83cba8');ellipse(c,sway-11,-154,22,24,'#ffffff20');c.restore();}
  function palm(c,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-14,-65,9,-123);stroke(c,'#b99867',13);for(let i=0;i<5;i++){const a=-Math.PI+(i/4)*Math.PI;const xx=Math.cos(a)*62,yy=Math.sin(a)*35;c.beginPath();c.moveTo(9,-123);c.quadraticCurveTo(9+xx*.55,-158+Math.sin(t+i)*2,9+xx,-123+yy+25);c.quadraticCurveTo(9+xx*.5,-129,9,-123);fill(c,i%2?'#30b38e':'#54bd8e');}c.restore();}
  function building(c,x,y,w,h,color,t){rr(c,x,y-h,w,h,7);fill(c,color);rr(c,x+w*.18,y-h-8,w*.64,10,3);fill(c,color);for(let row=0;row<Math.floor((h-18)/25);row++){for(let col=0;col<Math.floor((w-12)/19);col++){rr(c,x+10+col*19,y-h+15+row*25,9,11,2);fill(c,(row+col)%4===0?'#ecf4c4':'#e8faf0a6');}}if(h>145){line(c,x+w/2,y-h-8,x+w/2,y-h-38,color,3);ellipse(c,x+w/2,y-h-41,3,3,'#ecce74');}}
  function flower(c,x,y,s,phase){c.save();c.translate(x,y);c.scale(s,s);line(c,0,0,Math.sin(phase)*2,-17,'#28935b',2);ellipse(c,-3,-8,5,2,'#3bb46d');for(let i=0;i<5;i++){const a=i*TAU/5;ellipse(c,Math.cos(a)*4,-19+Math.sin(a)*4,3,3,'#fff3bb');}ellipse(c,0,-19,3,3,'#efb543');c.restore();}

  function pine(c,x,y,s,t,color){c.save();c.translate(x,y);c.scale(s,s);line(c,0,0,0,-126,'#706e4a',12);for(let i=0;i<3;i++){const cy=-65-i*38,wide=53-i*10,sway=Math.sin(t*.65+x*.03)*2;c.beginPath();c.moveTo(-wide+sway,cy+28);c.quadraticCurveTo(-wide*.25,cy-10,sway,cy-57);c.quadraticCurveTo(wide*.35,cy-8,wide+sway,cy+28);c.quadraticCurveTo(0,cy+12,-wide+sway,cy+28);fill(c,color||['#327958','#418961','#5c9b69'][i]);}c.restore();}
  function mushroom(c,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);rr(c,-3,-13,6,16,3);fill(c,'#f2e2bd');c.beginPath();c.ellipse(0,-12,13,10,0,Math.PI,TAU);c.quadraticCurveTo(0,-7,-13,-12);fill(c,'#d89d5d');ellipse(c,-5,-17,2.3,1.6,'#fff2bf');ellipse(c,5,-16,2,2,'#fff2bf');c.restore();}
  function forestScene(c,w,cam,t){
    // Tall distant trunks and a soft canopy make this a woodland rather than
    // another hill palette. All trunks stay behind the playable geometry.
    for(let i=-1;i<w/155+2;i++){const x=i*155-(cam*.18%155);const shade=i%2?'#86b8a0':'#98c5a9';rr(c,x,132,19,433,9);fill(c,shade);line(c,x+9,249,x-21,205,shade,8);line(c,x+10,298,x+44,241,shade,7);ellipse(c,x+8,142,75,87,'#9cc8a480');}
    for(let i=-1;i<w/265+2;i++)pine(c,i*265+93-(cam*.31%265),565,.92,t,i%2?'#5c9d7e':'#6da98a');
    for(let i=-1;i<w/215+2;i++){const x=i*215-(cam*.12%215);ellipse(c,x,0,140,66,'#488c6888');ellipse(c,x+70,-8,96,95,'#4f977188');ellipse(c,x+30,13,76,48,'#71ac7b77');}
    c.save();c.globalAlpha=.2;for(let i=0;i<4;i++){const x=i*390+140-(cam*.08%390);c.beginPath();c.moveTo(x,-20);c.lineTo(x+17,-20);c.lineTo(x+225,570);c.lineTo(x+96,570);c.closePath();fill(c,'#fff7bc');}c.restore();
    for(let i=0;i<17;i++){const x=((i*101-cam*.26+t*(i%2?3:-2))%(w+90)+w+90)%(w+90)-45,y=290+(i*47)%245+Math.sin(t*.8+i)*14;ellipse(c,x,y,1.8,1.8,'#fff0a575');}
  }
  function mesa(c,x,base,w,h,color){c.beginPath();c.moveTo(x,base);c.lineTo(x+w*.09,base-h*.22);c.lineTo(x+w*.2,base-h*.3);c.lineTo(x+w*.24,base-h*.86);c.lineTo(x+w*.36,base-h*.86);c.lineTo(x+w*.39,base-h);c.lineTo(x+w*.71,base-h);c.lineTo(x+w*.76,base-h*.66);c.lineTo(x+w*.88,base-h*.61);c.lineTo(x+w,base);c.closePath();fill(c,color);c.save();c.clip();for(let i=0;i<5;i++){c.fillStyle=i%2?'#f7cfb52a':'#9e664b1a';c.fillRect(x,base-h+28+i*35,w,12);}c.restore();}
  function ropeBridge(c,x,y,w,t){c.save();c.globalAlpha=.52;for(const dy of[0,38]){c.beginPath();c.moveTo(x,y+dy);c.quadraticCurveTo(x+w/2,y+dy+42,x+w,y+dy);stroke(c,'#a16e51',3);}for(let xx=0;xx<=w;xx+=18){const drop=4*(xx/w)*(1-xx/w)*21;line(c,x+xx,y+drop,x+xx,y+drop+39,'#b68760',2);line(c,x+xx,y+drop+36,x+xx+15,y+drop+37,'#aa825b',7);}line(c,x,y-13,x,y+70,'#9b7654',5);line(c,x+w,y-13,x+w,y+70,'#9b7654',5);c.restore();}
  function canyonScene(c,w,cam,t){for(let i=-1;i<w/420+2;i++)mesa(c,i*420-(cam*.12%420),470,420,205+(i%3)*20,'#e2b39a');for(let i=-1;i<w/520+2;i++)mesa(c,i*520+65-(cam*.24%520),552,420,205+(i%2)*55,'#ce9679');
    for(let i=-1;i<w/800+2;i++)ropeBridge(c,i*800+245-(cam*.21%800),394,295,t);
    c.beginPath();c.moveTo(0,558);for(let x=0;x<=w+25;x+=25)c.lineTo(x,529+Math.sin((x+cam*.3)*.008)*12);c.lineTo(w,590);c.lineTo(0,590);fill(c,'#83b7a8');for(let i=0;i<5;i++){c.beginPath();for(let x=0;x<=w+20;x+=20)c.lineTo(x,542+i*9+Math.sin(x*.014+t*.7+i)*2);stroke(c,'#d6e6c166',1.5);}
  }
  function turbine(c,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-7,0);c.lineTo(-4,-143);c.lineTo(3,-143);c.lineTo(8,0);c.closePath();fill(c,'#f3f6e4');stroke(c,'#90b5aa',1.4);c.save();c.translate(0,-144);c.rotate(t*.5+x*.03);for(let i=0;i<3;i++){c.save();c.rotate(i*TAU/3);c.beginPath();c.moveTo(-4,0);c.quadraticCurveTo(-10,-32,-3,-77);c.quadraticCurveTo(3,-82,5,-72);c.lineTo(8,-16);c.lineTo(4,1);c.closePath();fill(c,'#f8f9e9');stroke(c,'#9abdb0',1);c.restore();}ellipse(c,0,0,7,7,'#539d8c');ellipse(c,-1,-1,3,3,'#d8eadb');c.restore();c.restore();}
  function solar(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);line(c,9,20,14,4,'#7e9e92',3);line(c,52,20,57,4,'#7e9e92',3);c.beginPath();c.moveTo(7,-20);c.lineTo(69,-20);c.lineTo(58,8);c.lineTo(-4,8);c.closePath();fill(c,'#528b9d');stroke(c,'#d6e7dc',2);for(let i=1;i<4;i++)line(c,7+i*15.5,-19,-4+i*15.5,7,'#a9d5da',1);line(c,2,-6,64,-6,'#a9d5da',1);c.restore();}
  function energyScene(c,w,cam,t){for(let i=-1;i<w/290+2;i++){const x=i*290-(cam*.19%290);turbine(c,x+110,489,.85,t);turbine(c,x+248,481,.63,t+.8);}for(let i=-1;i<w/310+2;i++){const x=i*310+50-(cam*.32%310);building(c,x,565,167,78,'#95bead',t);rr(c,x-5,481,178,9,3);fill(c,'#68a970');for(let j=0;j<4;j++)ellipse(c,x+20+j*39,478,18,7,'#75b87d');solar(c,x+37,473,.9);solar(c,x+109,473,.7);}for(let i=0;i<4;i++){const x=((i*260+cam*.1+t*22)%(w+160))-80;c.beginPath();c.moveTo(x,223+i*38);c.bezierCurveTo(x+16,219+i*38,x+42,225+i*38,x+65,218+i*38);stroke(c,'#ffffff77',2);}}

  function background(c,g,o,p){const w=o.width,h=o.height,cam=g.cameraX||0,t=o.time||0; c.fillStyle=gradient(c,0,h,[[0,p.skyTop],[.65,p.sky],[1,'#f3f5da']]);c.fillRect(0,0,w,h);ellipse(c,w*.82,108,43,43,'#fff2b9');ellipse(c,w*.82,108,58,58,'#fff6ce30');
    for(let i=0;i<6;i++){const x=((i*321+70-cam*.1+t*8)%(w+400)+w+400)%(w+400)-180;cloud(c,x,75+(i%3)*62,.6+(i%3)*.16,.65);}
    for(let i=0;i<3;i++)bird(c,((w*.4+i*83-cam*.08+t*9)%(w+100)),100+i*16,.7);
    if(g.level.theme==='city'){
      for(let i=-2;i<w/95+3;i++){const x=i*100-(cam*.13%100);building(c,x,420,60+(i%3+3)%3*12,80+((i*13)%5+5)%5*31,p.far,t);}
      for(let i=-1;i<w/180+2;i++){const x=i*180-(cam*.25%180);building(c,x,459,82,95+((i*7)%4+4)%4*28,p.hill,t);}
    }else if(g.level.theme!=='canyon'){
      hill(c,w,435,104,145,cam*.12,p.far);hill(c,w,487,112,210,cam*.27+200,p.hill);
    }
    if(g.level.theme==='beach'){
      c.fillStyle='#8cd9cd';c.fillRect(0,440,w,130);for(let j=0;j<5;j++){c.beginPath();for(let x=-30;x<w+30;x+=15)c.lineTo(x,458+j*23+Math.sin(x*.017+t*.8+j)*2);stroke(c,'#d6f5e588',2);}hill(c,w,590,55,132,cam*.38,'#eddfb5');
    }else if(g.level.theme!=='canyon')hill(c,w,565,45,180,cam*.4+600,p.front);
    if(g.level.theme==='forest')forestScene(c,w,cam,t);
    else if(g.level.theme==='canyon')canyonScene(c,w,cam,t);
    else if(g.level.theme==='energy')energyScene(c,w,cam,t);
    else for(let i=-1;i<w/300+2;i++){const wx=i*300+85-(cam*.43%300);if(g.level.theme==='beach')palm(c,wx,571,.63,t);else tree(c,wx,574,.62,t,g.mode!=='playing');}
    c.fillStyle=({beach:'#e8d09c',forest:'#729c6e',canyon:'#c28d6a',energy:'#a7cbb0'})[g.level.theme]||'#afd6a4';c.fillRect(0,574,w,146);
    if(g.level.theme==='forest')for(let i=-1;i<w/190+2;i++){const x=i*190+45-(cam*.48%190);mushroom(c,x,580,.65,t);mushroom(c,x+17,580,.45,t);}
    for(let i=0;i<12;i++){let x=(i*127-cam*.55)%(w+80);if(x<0)x+=w+80;ellipse(c,x,603+(i%4)*27,2,1,'#659d8055');}
  }

  function terrain(c,s,t,p,theme){const x=s.x,y=s.y,w=s.w,h=s.h;
    if(s.type==='crate'){
      c.save();rr(c,x,y,w,h,6);fill(c,'#ba8950');rr(c,x+3,y+3,w-6,h-6,4);fill(c,'#e5b66e');line(c,x+8,y+8,x+w-8,y+h-8,'#bd8c4d',7);line(c,x+w-8,y+8,x+8,y+h-8,'#bd8c4d',7);rr(c,x+5,y+5,w-10,h-10,2);stroke(c,'#8b6943',3);for(const xx of [x+8,x+w-8])for(const yy of[y+8,y+h-8])ellipse(c,xx,yy,1.7,1.7,'#ffe2a3');c.restore();return;
    }
    if(s.type==='moving'){
      ellipse(c,x+w/2,y+h+8,w*.4,5,'#285d6925');rr(c,x,y,w,h,7);fill(c,'#226b72');rr(c,x+2,y+2,w-4,h-7,5);fill(c,'#e0eee2');c.save();rr(c,x+2,y+2,w-4,7,3);c.clip();c.fillStyle='#f6d56a';c.fillRect(x,y,w,10);for(let xx=x-12;xx<x+w;xx+=20){c.beginPath();c.moveTo(xx,y+1);c.lineTo(xx+8,y+1);c.lineTo(xx+17,y+10);c.lineTo(xx+9,y+10);fill(c,'#579389');}c.restore();for(let xx=x+14;xx<x+w-8;xx+=31){ellipse(c,xx,y+h-8,2.8,2.8,'#5e9c99');ellipse(c,xx,y+h-8,1.2,1.2,'#dff8e5');}ellipse(c,x+7,y+h/2,2,2,'#a8f1c8');ellipse(c,x+w-7,y+h/2,2,2,'#a8f1c8');
    }else if(s.type==='platform'&&theme==='canyon'){
      // Suspension-style decks are the actual collision platforms. Thin ropes
      // behind them add context without suggesting a second standing surface.
      line(c,x+5,y+2,x+5,y-27,'#9d7352',4);line(c,x+w-5,y+2,x+w-5,y-27,'#9d7352',4);c.beginPath();c.moveTo(x+5,y-24);c.quadraticCurveTo(x+w/2,y-11,x+w-5,y-24);stroke(c,'#ba966a',2);rr(c,x,y,w,h,5);fill(c,'#9a7050');rr(c,x+1,y+1,w-2,7,3);fill(c,'#e5c18c');for(let xx=x+8;xx<x+w-4;xx+=23){line(c,xx,y+3,xx,y+h-2,'#cba174',3);ellipse(c,xx,y+6,1.5,1.5,'#6c6248');}
    }else if(s.type==='platform'){
      ellipse(c,x+w/2,y+h+8,w*.4,6,'#337a6520');rr(c,x,y,w,h,9);fill(c,'#367d69');rr(c,x,y,w,h-5,9);fill(c,theme==='beach'?'#f0dcaa':'#eff2d7');rr(c,x,y,w,10,8);fill(c,theme==='beach'?'#f6e8be':'#46b87d');line(c,x+12,y+16,x+w-12,y+16,'#a5c6a6',2);for(let xx=x+13;xx<x+w-6;xx+=27)ellipse(c,xx,y+h-10,2,2,'#d4dfb9');
    }else{
      c.fillStyle=p.soil;c.fillRect(x,y,w,h);c.fillStyle=p.edge;c.fillRect(x,y,w,14);c.fillStyle=p.grass;c.fillRect(x,y,w,6);c.fillStyle='#ffffff28';c.fillRect(x,y+17,w,4);for(let xx=x+22;xx<x+w;xx+=48){line(c,xx,y+33,xx+8,y+33,'#a7854930',3);ellipse(c,xx+15,y+60,2,2,'#8d8b4b30');}for(let xx=x+10;xx<x+w-7;xx+=41){c.beginPath();c.moveTo(xx-3,y+2);c.quadraticCurveTo(xx-5,y-8,xx-7,y-10);c.moveTo(xx,y+2);c.quadraticCurveTo(xx+1,y-9,xx+5,y-13);stroke(c,p.grass,2);}
      if(theme==='beach'){for(let xx=x+40;xx<x+w;xx+=163){ellipse(c,xx,y+42,6,3,'#fff1c4');line(c,xx-3,y+42,xx+3,y+42,'#d7b78b',1);}}
      if(theme==='canyon'){for(let yy=y+40;yy<y+h;yy+=32){line(c,x,yy,x+w,yy,'#f5cfad40',5);line(c,x,yy+9,x+w,yy+9,'#ad76572b',2);}}
      if(theme==='forest'){for(let xx=x+67;xx<x+w-8;xx+=157){mushroom(c,xx,y-1,.7,t);mushroom(c,xx+13,y-1,.45,t);}}
      if(theme==='energy'){for(let xx=x+50;xx<x+w-10;xx+=140){line(c,xx,y+39,xx+29,y+39,'#89b2a866',3);ellipse(c,xx+31,y+39,3,3,'#7ca596');}}
    }
  }

  function movingTrack(c,s,t){const x=(s.baseX??s.x)+s.w/2,y=(s.baseY??s.y)+s.h/2,r=s.range||0;const ends=s.axis==='y'?[[x,y-r],[x,y+r]]:[[x-r,y],[x+r,y]];c.save();c.setLineDash([3,7]);line(c,ends[0][0],ends[0][1],ends[1][0],ends[1][1],'#488c946e',2);c.setLineDash([]);for(let i=0;i<2;i++){const [xx,yy]=ends[i];ellipse(c,xx,yy,6,6,'#eff6dc');c.beginPath();c.arc(xx,yy,6,0,TAU);stroke(c,'#6a9c8e',1.5);ellipse(c,xx,yy,2.6,2.6,Math.sin(t*2+i)>0?'#e9c864':'#91c4a9');}c.restore();}
  function drone(c,h,t){const x=h.x,y=h.y,w=h.w,hh=h.h;const inactive=h.active===false;c.save();if(inactive)c.globalAlpha=.55;
    // The amber outline is the literal collision box. Rotors and face remain
    // inside it so the friendly drawing never understates an obstacle's size.
    rr(c,x,y,w,hh,Math.min(14,hh/3));fill(c,'#ffdc6d28');stroke(c,'#d19c39',2);rr(c,x+3,y+3,w-6,hh-6,Math.min(12,hh/3));fill(c,'#edf5dc');
    const cy=y+hh*.48;line(c,x+8,cy,x+w-8,cy,'#95b7a1',3);for(const xx of[x+w*.2,x+w*.8]){ellipse(c,xx,y+7,w*.13,3,'#7caa9b');line(c,xx-7*Math.sin(t*30),y+6,xx+7*Math.sin(t*30),y+6,'#d4eee3',2);}
    rr(c,x+w*.26,y+hh*.26,w*.48,hh*.48,6);fill(c,'#22605b');for(const xx of[x+w*.42,x+w*.6])ellipse(c,xx,y+hh*.45,1.8,2.4,'#a6f1d4');line(c,x+w*.46,y+hh*.62,x+w*.55,y+hh*.62,'#b1edcf',1.3);
    ellipse(c,x+7,y+hh-7,2,2,'#efbd4c');ellipse(c,x+w-7,y+hh-7,2,2,'#efbd4c');c.restore();
  }
  function barrier(c,h,t){const x=h.x,y=h.y,w=h.w,hh=h.h,active=h.active===true,warning=h.warning===true;const color=active?'#d99b37':warning?'#c6a134':'#37a57d';c.save();
    // Each state keeps the same clear boundary; only an inactive green opening
    // is traversable. Warning changes both the line pattern and the caption.
    if(active){rr(c,x,y,w,hh,8);fill(c,'#f4cc663d');for(let yy=y+12;yy<y+hh;yy+=24){c.beginPath();c.ellipse(x+w/2,yy+Math.sin(t*5+yy)*2,w*.4,4,0,0,TAU);stroke(c,'#e6b952',2);}rr(c,x,y,w,hh,8);stroke(c,color,2.5);}
    else{c.setLineDash(warning?[5,4]:[2,8]);rr(c,x,y,w,hh,7);stroke(c,warning?'#d3ad3f':'#58b88c80',warning?2.5:1.7);c.setLineDash([]);if(warning){c.save();c.globalAlpha=.1+Math.abs(Math.sin(t*11))*.2;rr(c,x,y,w,hh,7);fill(c,'#f9d868');c.restore();}}
    // Ground emitters sit within the collision bounds rather than extending
    // a hidden obstacle into the safe waiting space.
    rr(c,x+2,y+hh-8,w-4,8,3);fill(c,'#547e6b');for(let xx=x+7;xx<x+w-4;xx+=10)ellipse(c,xx,y+hh-5,1.6,1.6,active?'#ffdb74':warning?'#f4cf4b':'#97ebaf');
    const label=active?'BEKLE':warning?'HAZIRLAN':'GEÇ';const labelW=warning?88:64;rr(c,x+w/2-labelW/2,y-27,labelW,22,6);fill(c,active?'#fff0c8':warning?'#fff5ca':'#e3f7e6');text(c,label,x+w/2,y-11,13,color,900,'center');
    if(active||warning){c.setLineDash([3,4]);line(c,x-57,y+hh-2,x-13,y+hh-2,'#d8b453',3);c.setLineDash([]);ellipse(c,x-35,y+hh-8,3,3,'#e6c85e');}
    c.restore();
  }
  function hazards(c,g,t,cam,width){for(const h of(g.hazards||[])){if(h.x+h.w<cam-100||h.x>cam+width+100)continue;if(h.kind==='drone')drone(c,h,t);else if(h.kind==='barrier')barrier(c,h,t);}}
  function checkpointFlags(c,g,t,cam,width){for(const cp of(g.level.checkpoints||[])){if(cp.x<cam-60||cp.x>cam+width+30)continue;const reached=!!g.checkpoint&&cp.x<=g.checkpoint.x;const current=!!g.checkpoint&&cp.x===g.checkpoint.x;const groundY=(cp.y??510)+80;line(c,cp.x,groundY,cp.x,groundY-63,reached?'#4c8e77':'#a2b8a0',3);ellipse(c,cp.x,groundY-64,3,3,reached?'#f3cc67':'#c7d8bc');const wave=Math.sin(t*3+cp.x*.02)*3;c.beginPath();c.moveTo(cp.x+2,groundY-59);c.quadraticCurveTo(cp.x+17,groundY-63+wave,cp.x+36,groundY-56);c.lineTo(cp.x+31,groundY-40);c.quadraticCurveTo(cp.x+16,groundY-45+wave,cp.x+2,groundY-41);c.closePath();fill(c,reached?'#2fac7f':'#e7ead0');stroke(c,reached?'#268e6b':'#a4b79b',1.2);if(reached){c.beginPath();c.moveTo(cp.x+11,groundY-51);c.lineTo(cp.x+15,groundY-47);c.lineTo(cp.x+23,groundY-54);stroke(c,'#f4ffe8',2);}if(current){ellipse(c,cp.x,groundY+1,13,3,'#42af7c3d');}}
  }

  function packageArt(c,x,y,type,s=1,rotation=0){c.save();c.translate(x,y);c.rotate(rotation);c.scale(s,s);c.lineJoin='round';
    if(type==='can'){
      rr(c,-10,-17,20,34,5);fill(c,'#f7c653');stroke(c,'#bd903e',1.7);c.fillStyle='#ffe59c';c.fillRect(-6,-14,4,27);ellipse(c,0,-15,9,3,'#e4ebe2');ellipse(c,0,-15,4,1.7,'#86a49b');line(c,-6,13,7,13,'#e49d34',2);c.beginPath();c.moveTo(-4,-3);c.lineTo(4,-3);c.lineTo(1,3);c.closePath();stroke(c,'#fff7d9',2);
    }else if(type==='glass'){
      c.beginPath();c.moveTo(-4,-21);c.lineTo(4,-21);c.lineTo(4,-11);c.bezierCurveTo(5,-7,10,-7,10,-1);c.lineTo(10,17);c.quadraticCurveTo(10,20,7,20);c.lineTo(-7,20);c.quadraticCurveTo(-10,20,-10,17);c.lineTo(-10,-1);c.bezierCurveTo(-10,-7,-5,-7,-4,-11);c.closePath();fill(c,'#7dcc9c');stroke(c,'#389770',1.7);line(c,-5,-2,-5,13,'#d5f2c7',3);rr(c,-5,-23,10,5,1);fill(c,'#e9c45e');rr(c,-9,0,18,12,2);fill(c,'#e7f4ca');c.beginPath();c.moveTo(-3,6);c.lineTo(2,3);c.lineTo(4,8);stroke(c,'#43a274',1.5);
    }else{
      c.beginPath();c.moveTo(-4,-19);c.lineTo(4,-19);c.lineTo(4,-12);c.lineTo(10,-5);c.lineTo(10,17);c.quadraticCurveTo(6,21,0,18);c.quadraticCurveTo(-6,21,-10,17);c.lineTo(-10,-5);c.lineTo(-4,-12);c.closePath();fill(c,'#b9e7e3');stroke(c,'#58aaa6',1.7);rr(c,-5,-23,10,6,2);fill(c,'#4fabc1');line(c,-6,-5,-6,12,'#f5ffff',2.5);rr(c,-10,0,20,12,1);fill(c,'#54b8b2');line(c,-5,4,4,4,'#d8f7eb',2);line(c,-5,8,1,8,'#d8f7eb',2);
    }c.restore();
  }
  function collectible(c,item,t){const y=item.y+Math.sin(t*2.7+item.x*.035)*4;ellipse(c,item.x,y+26,12,3,'#35775a13');ellipse(c,item.x,y,27,27,'#ffffff59');ellipse(c,item.x,y,21,21,item.type==='can'?'#ffdf7938':'#c0ffe63d');packageArt(c,item.x,y,item.type,1,Math.sin(t*1.9+item.x)*.055);if((Math.sin(t*2+item.x)+1)>.95){line(c,item.x+18,y-23,item.x+18,y-15,'#fffef4',2);line(c,item.x+14,y-19,item.x+22,y-19,'#fffef4',2);}}

  function robot(c,x,y,scale=1,o={}){const t=o.time||0,col=o.color||'#009b7e',running=o.running||false,air=o.airborne||false,dir=o.dir||1;const swing=running?Math.sin(t*15):Math.sin(t*2)*.07;const bob=running?Math.abs(Math.sin(t*15))*1.8:Math.sin(t*2)*.7;c.save();c.translate(x+29*scale,y+40*scale);c.scale(scale,scale);c.translate(-29,-40+bob);c.lineCap='round';c.lineJoin='round';
    // Backpack and articulated arms.
    rr(c,dir>0?1:45,32,12,27,5);fill(c,'#6fcbb3');stroke(c,'#268b77',2);rr(c,dir>0?1:46,37,10,10,3);fill(c,'#bde5d3');
    const arm=(side)=>{const ax=side<0?9:49,ay=42;const a=(air?side*.65:side*swing*.65);c.save();c.translate(ax,ay);c.rotate(a);line(c,0,0,side*3,16,'#8ebcb0',8);line(c,0,0,side*3,15,'#f1fff5',5);ellipse(c,side*3,18,5.5,5.5,col);ellipse(c,side*3-1,17,2,2,'#baf2d8');c.restore();};arm(-1);arm(1);
    // Walking feet.
    for(const side of[-1,1]){const xx=side<0?20:38;c.save();c.translate(xx,64);c.rotate(air?-side*.3:side*swing*.45);line(c,0,0,0,8,'#82ada0',7);rr(c,-7,6,16,9,4);fill(c,col);rr(c,-6,6,14,4,2);fill(c,'#b3e9d3');c.restore();}
    if(air){for(const xx of[21,38]){c.beginPath();c.moveTo(xx-4,78);c.quadraticCurveTo(xx-5,85,xx,89+Math.sin(t*45)*3);c.quadraticCurveTo(xx+5,85,xx+4,78);fill(c,'#f6c04b');c.beginPath();c.moveTo(xx-2,78);c.lineTo(xx,85);c.lineTo(xx+2,78);fill(c,'#fff7b9');}}
    rr(c,9,31,40,34,11);fill(c,'#e9f8ed');stroke(c,'#5d9b8c',1.7);rr(c,13,36,32,24,6);fill(c,col);rr(c,15,40,28,14,3);fill(c,'#ffffff');
    // Preserve the supplied logo's natural 800:297 aspect on every skin.
    if(o.logo&&o.logo.complete&&o.logo.naturalWidth){const iw=26,ih=iw*o.logo.naturalHeight/o.logo.naturalWidth;c.drawImage(o.logo,16,47-ih/2,iw,ih);}else{text(c,'RVM',29,50,7,'#178a73',900,'center');}
    ellipse(c,29,60,2,2,'#def6a6');
    // Flexible aerial.
    const ant=Math.sin(t*(running?14:3))*(running?3:1.2);c.beginPath();c.moveTo(29,10);c.quadraticCurveTo(29+ant,3,30+ant,-2);stroke(c,'#4c9783',2.5);ellipse(c,30+ant,-3,4,4,'#ffcf54');ellipse(c,29+ant,-4,1.6,1.6,'#fff8c5');
    rr(c,5,10,48,28,12);fill(c,'#fbfffa');stroke(c,'#6ca89a',1.8);rr(c,11,15,36,17,7);fill(c,'#164d48');const blink=Math.sin(t*.83)> .998;for(const xx of[21,37]){if(blink)line(c,xx-2,23,xx+2,23,'#8af2d5',2.8);else{ellipse(c,xx,22,3.1,4,'#9cf5d8');ellipse(c,xx+.7,20.6,.9,1.2,'#ffffff');}}c.beginPath();c.arc(29,25,3,0,Math.PI);stroke(c,'#8ce8ca',1.3);ellipse(c,8,24,3,5,col);ellipse(c,50,24,3,5,col);rr(c,14,12,20,2,1);fill(c,'#ffffff');c.restore();}

  function recycle(c,x,y,s,color){c.save();c.translate(x,y);c.scale(s,s);for(let i=0;i<3;i++){c.save();c.rotate(i*TAU/3);c.beginPath();c.moveTo(-6,-13);c.lineTo(0,-23);c.lineTo(10,-7);c.lineTo(4,-9);c.lineTo(1,-3);c.lineTo(-6,-13);fill(c,color);c.restore();}c.restore();}
  function machine(c,g,t){const m=g.level.machine, x=m.x,y=m.y??448,active=g.mode==='delivering'||g.mode==='complete';c.save();c.translate(x,y);ellipse(c,56,145,70,12,'#285f5630');rr(c,-4,-5,120,151,16);fill(c,'#23675a');rr(c,0,-9,112,151,14);fill(c,'#f3fff0');rr(c,4,-5,104,34,10);fill(c,'#069d7b');c.fillStyle='#069d7b';c.fillRect(4,9,104,20);text(c,'DOA',56,21,25,'#ffffff',900,'center');rr(c,15,37,82,46,8);fill(c,'#174f49');rr(c,20,41,72,37,5);fill(c,'#26796c');recycle(c,56,61,.55,active?'#acffe4':'#a1e7cc');ellipse(c,85,44,2,2,active?'#e4e965':'#88d9b8');rr(c,19,93,74,24,5);fill(c,'#d9ede1');rr(c,28,97,56,6,3);fill(c,'#2c7061');rr(c,29,110,54,3,1);fill(c,'#afcdbc');for(let i=0;i<3;i++){rr(c,38+i*13,125,8,3,1);fill(c,active?'#2dbf87':'#95bbae');}rr(c,13,139,24,9,3);fill(c,'#245f50');rr(c,76,139,24,9,3);fill(c,'#245f50');
    // Tiny leaf badge makes the temporary machine friendly and readable.
    c.save();c.translate(97,117);c.rotate(-.4);ellipse(c,0,0,5,9,'#5abe7b');line(c,0,4,0,-3,'#f0f8cc',1);c.restore();c.restore();
    if(active){const progress=g.deliveryProgress||0;for(let i=0;i<6;i++){let u=(progress*2.4+i/6)%1;if(g.mode==='complete')continue;const sx=g.p.x+28,sy=g.p.y+44,ex=x+56,ey=y+60;let xx=sx+(ex-sx)*u, yy=sy+(ey-sy)*u-Math.sin(u*Math.PI)*115;packageArt(c,xx,yy,['plastic','glass','can'][i%3],.58,u*4);}}}

  function sign(c,x,y,label,sub){line(c,x,y,x,y-53,'#b28c55',7);rr(c,x-52,y-79,104,37,8);fill(c,'#fff9d8');stroke(c,'#ccae6e',2);text(c,label,x,y-57,12,'#427359',800,'center');if(sub)text(c,sub,x,y-23,11,'#4f7861',700,'center');}
  function tutorialSign(c,x,message){const max=244,words=message.split(' '),lines=[];let current='';c.font='700 14px "Trebuchet MS", Arial, sans-serif';for(const word of words){const next=current?current+' '+word:word;if(c.measureText(next).width>max&&current){lines.push(current);current=word;}else current=next;}if(current)lines.push(current);const h=22+lines.length*19;line(c,x,589,x,535-h,'#a17b4d',6);rr(c,x-134,531-h,268,h,8);fill(c,'#fffbe9');stroke(c,'#d5bb85',1.7);for(let i=0;i<lines.length;i++)text(c,lines[i],x,550-h+i*19,14,'#4a7860',700,'center');ellipse(c,x-124,540-h,2,2,'#c1a166');ellipse(c,x+124,540-h,2,2,'#c1a166');}
  function pits(c,g){const grounds=(g.solids||g.level.solids).filter(s=>s.type==='ground').sort((a,b)=>a.x-b.x);for(let i=1;i<grounds.length;i++){const x=grounds[i-1].x+grounds[i-1].w,w=grounds[i].x-x;if(w<=0)continue;const warm=g.level.theme==='canyon';c.fillStyle=gradient(c,590,720,[[0,warm?'#ae795e':'#286d62'],[1,warm?'#80594b':'#154c48']]);c.fillRect(x,590,w,140);c.fillStyle='#194f4740';c.fillRect(x,590,w,13);for(const xx of[x+6,x+w-6]){line(c,xx,590,xx,635,warm?'#d0a071':'#6da683',2);for(let y=602;y<630;y+=11)ellipse(c,xx+(y%2?3:-3),y,4,2,warm?'#e1b58c':'#8bba8d');}ellipse(c,x+w*.5,702,w*.3,6,warm?'#7db5ad50':'#5da29d28');}}
  function foreground(c,g,t){const m=g.level.machine, bright=g.mode==='complete'||g.mode==='delivering';if(bright){for(let i=0;i<9;i++){const progress=g.mode==='complete'?1:Math.min(1,g.deliveryProgress*2-i*.07);if(progress>0)flower(c,m.x-135+i*39,589,Math.max(.1,progress),t+i);}tree(c,m.x+190,590,.85,t,true);tree(c,m.x-180,590,.55,t,true);}else{for(let i=0;i<3;i++){const xx=m.x-100+i*32;line(c,xx,590,xx+3,581,'#729865',2);}}}
  function draw(c,g,o){if(!g||!g.level)return;const p=palettes[g.level.theme]||palettes.park,t=o.time||0,cam=g.cameraX||0;c.save();background(c,g,o,p);c.translate(-cam,0);pits(c,g);
    const solids=g.solids||g.level.solids;for(const s of solids){if(s.type==='moving')movingTrack(c,s,t);}for(const s of solids){if(s.x+s.w<cam-40||s.x>cam+o.width+40)continue;terrain(c,s,t,p,g.level.theme);}
    // Landmarks show scale without hiding any playable surfaces.
    checkpointFlags(c,g,t,cam,o.width);
    if(g.level.signs){for(const s of g.level.signs){if(s.x+140>cam&&s.x-140<cam+o.width)tutorialSign(c,s.x,s.text);}}
    for(const it of g.items){if(!it.collected&&it.x>cam-35&&it.x<cam+o.width+35)collectible(c,it,t);}
    foreground(c,g,t);machine(c,g,t);hazards(c,g,t,cam,o.width);
    const r=g.p;ellipse(c,r.x+r.w/2,Math.min(590,r.y+r.h+2),airShadow(r),4,'#23594c22');if(g.invulnerable>0){c.save();c.globalAlpha=.45+Math.sin(t*25)*.2;ellipse(c,r.x+r.w/2,r.y+r.h/2,39,52,'#b9eff442');c.beginPath();c.ellipse(r.x+r.w/2,r.y+r.h/2,39,52,0,0,TAU);stroke(c,'#80d7d9',2.5);c.restore();}robot(c,r.x,r.y,r.w/58,{time:t,color:o.color,logo:o.logo,running:Math.abs(r.vx)>10&&r.grounded,airborne:!r.grounded,dir:r.dir});
    for(const pt of(o.particles||[])){const a=Math.min(1,(pt.life??1)/(pt.maxLife||1));c.save();c.globalAlpha=a;if(pt.text||pt.type==='text'){text(c,pt.text||'+10',pt.x,pt.y,22,pt.color||'#008b6b',900,'center');}else if(pt.type==='ring'){c.beginPath();c.arc(pt.x,pt.y,(1-a)*27+5,0,TAU);stroke(c,pt.color||'#f7cc56',2);}else{const sz=(pt.size||3)*a;c.translate(pt.x,pt.y);c.rotate((1-a)*3);c.fillStyle=pt.color||'#fff1a2';c.fillRect(-sz,-sz,sz*2,sz*2);}c.restore();}
    c.restore();
  }
  function airShadow(r){return r.grounded?23:Math.max(8,24-(590-r.y-r.h)/20);}
  root.RVMRenderer={draw,robot,packageArt};
})(typeof window!=='undefined'?window:globalThis);
