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
  Object.assign(palettes,{wetland:{sky:'#e5f6db',skyTop:'#b7ddd0',far:'#b3d2a6',hill:'#81b8a3',front:'#4c988f',soil:'#b6c499',edge:'#4b9983',grass:'#a7c76e'},ice:{sky:'#e9f5fb',skyTop:'#ccdcec',far:'#c2d7e8',hill:'#a1bdd8',front:'#7ea8c8',soil:'#c6e1e5',edge:'#86bacb',grass:'#f5fffa'},volcano:{sky:'#fbe7d9',skyTop:'#e5d0dd',far:'#c7afc0',hill:'#a88c9b',front:'#8e817a',soil:'#b99a87',edge:'#897a69',grass:'#c5ac73'},garden:{sky:'#f2f6d5',skyTop:'#d0ebd2',far:'#c3dca3',hill:'#9aca98',front:'#6eae8b',soil:'#e0d5a5',edge:'#5fa780',grass:'#a2cf77'}});
  Object.assign(palettes.park,{skyTop:'#bdeadd',hill:'#76c69b',front:'#3aa77e',grass:'#75cc59'});
  Object.assign(palettes.beach,{skyTop:'#b5e8e9',hill:'#48bbb6',front:'#179f9e',soil:'#f8dda1'});
  Object.assign(palettes.forest,{hill:'#62b187',front:'#278c68',grass:'#91ca4f'});
  Object.assign(palettes.garden,{hill:'#85c88c',front:'#4da97b',grass:'#a7d568'});

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

  function reed(c,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);const sway=Math.sin(t*1.2+x)*5;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*3,0);c.quadraticCurveTo(i*8,-26,i*7+sway,-62+i*6);stroke(c,'#638e60',2);rr(c,i*7+sway-3,-75+i*6,6,19,3);fill(c,'#a1895a');}c.restore();}
  function wetlandScene(c,w,cam,t){c.fillStyle='#84bdb0';c.fillRect(0,445,w,138);for(let j=0;j<5;j++){c.beginPath();for(let x=0;x<=w+20;x+=20)c.lineTo(x,461+j*23+Math.sin(x*.014+t*.6+j)*2);stroke(c,'#c9e6cb77',1.6);}for(let i=-1;i<w/280+2;i++){const x=i*280+71-(cam*.27%280);tree(c,x,493,.75,t,false);for(let j=-1;j<=1;j++){c.beginPath();c.moveTo(x,481);c.quadraticCurveTo(x+j*23,495,x+j*36,515);stroke(c,'#739474',4);}ellipse(c,x+108,543,28,7,'#a5c98a');ellipse(c,x+108,541,23,4,'#bad79e');flower(c,x+108,541,.7,t);}for(let i=-1;i<w/140+2;i++)reed(c,i*140+36-(cam*.4%140),579,.75,t);for(let i=0;i<4;i++){const x=((i*233+cam*.14+t*10)%(w+80))-40,y=312+i%2*77+Math.sin(t+i)*12;ellipse(c,x,y,4,1.7,'#758f60');ellipse(c,x-2,y-3,5,1.5,'#fbf8c5aa');ellipse(c,x+2,y+3,5,1.5,'#fbf8c5aa');}}
  function iceCrystal(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-15,0);c.lineTo(-10,-41);c.lineTo(0,-56);c.lineTo(11,-38);c.lineTo(17,0);c.closePath();fill(c,'#bddfe4');stroke(c,'#e8fbf8',2);c.beginPath();c.moveTo(0,-56);c.lineTo(-2,0);c.lineTo(17,0);c.lineTo(11,-38);fill(c,'#90bacf');line(c,0,-51,-2,-4,'#effffc',1.5);c.restore();}
  function iceScene(c,w,cam,t){for(let i=-1;i<w/470+2;i++){const x=i*470-(cam*.18%470);c.beginPath();c.moveTo(x,501);c.lineTo(x+182,238);c.lineTo(x+383,501);c.closePath();fill(c,'#aec7de');c.beginPath();c.moveTo(x+119,331);c.lineTo(x+182,238);c.lineTo(x+251,329);c.lineTo(x+213,313);c.lineTo(x+184,337);c.lineTo(x+156,313);c.closePath();fill(c,'#f1f8f2');}c.fillStyle='#b9d9e3';c.fillRect(0,510,w,65);for(let i=0;i<6;i++)line(c,(i*190-cam*.25)%w,526+i*6,(i*190-cam*.25)%w+80,526+i*6,'#e9f8ed88',2);for(let i=-1;i<w/210+2;i++){const x=i*210-(cam*.35%210);pine(c,x,569,.65,t,'#8fb7bd');iceCrystal(c,x+94,577,.65);}for(let i=0;i<25;i++){const x=((i*89-cam*.08+t*5)%(w+30)+w+30)%(w+30),y=(i*71+t*(8+i%4))%560;ellipse(c,x,y,1.6+i%2,1.6+i%2,'#ffffffa8');}}
  function volcanoScene(c,w,cam,t){for(let i=-1;i<w/560+2;i++){const x=i*560-(cam*.14%560);c.beginPath();c.moveTo(x,536);c.lineTo(x+162,279);c.lineTo(x+231,303);c.lineTo(x+278,285);c.lineTo(x+455,536);c.closePath();fill(c,'#a893a5');c.beginPath();c.moveTo(x+162,279);c.quadraticCurveTo(x+216,298,x+278,285);c.lineTo(x+291,305);c.quadraticCurveTo(x+211,316,x+148,300);c.closePath();fill(c,'#dbc4be');for(let j=0;j<3;j++){c.save();c.globalAlpha=.14+(1-j/3)*.15;cloud(c,x+219+Math.sin(t*.3+j)*9,267-j*33, .23+j*.09,1);c.restore();}}for(let i=-1;i<w/300+2;i++){const x=i*300-(cam*.29%300);ellipse(c,x+80,554,130,34,'#ad9b8a');ellipse(c,x+118,548,50,9,'#a2bcb0');ellipse(c,x+118,548,39,5,'#d4dbbb');for(let j=0;j<2;j++){c.beginPath();c.moveTo(x+111+j*12,535);c.bezierCurveTo(x+100+j*12,521,x+121+j*12,516,x+110+j*12,500);stroke(c,'#f8e8d477',2);}}}
  function greenhouse(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-100,0);c.lineTo(-100,-75);c.quadraticCurveTo(-92,-146,0,-148);c.quadraticCurveTo(92,-146,100,-75);c.lineTo(100,0);c.closePath();fill(c,'#d6ecd17a');stroke(c,'#82ad98',3);for(const xx of[-66,-33,0,33,66]){c.beginPath();c.moveTo(xx,0);c.lineTo(xx,-78);c.quadraticCurveTo(xx*.85,-126,xx*.55,-142);stroke(c,'#94b9a1',2);}line(c,-99,-68,99,-68,'#94b9a1',2);line(c,-79,-116,79,-116,'#94b9a1',2);rr(c,-102,-4,204,10,3);fill(c,'#93b283');c.restore();}
  function gardenScene(c,w,cam,t){for(let i=-1;i<w/510+2;i++){const x=i*510+180-(cam*.22%510);greenhouse(c,x,521,.85);tree(c,x+167,552,.66,t,true);}for(let i=-1;i<w/130+2;i++){const x=i*130+29-(cam*.38%130);ellipse(c,x,568,53,17,i%2?'#7faf87':'#8cb987');for(let j=0;j<3;j++)flower(c,x-20+j*20,562,.7+j%2*.25,t+j);}for(let i=0;i<5;i++){const x=((i*229+cam*.2+t*9)%(w+80))-40,y=272+Math.sin(t+i)*26+i%2*66;c.save();c.translate(x,y);ellipse(c,-4,0,5,3+Math.abs(Math.sin(t*8))*3,'#e3bb6f');ellipse(c,4,0,5,3+Math.abs(Math.sin(t*8))*3,'#f0ce8b');ellipse(c,0,0,1,5,'#699472');c.restore();}}

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
    else if(g.level.theme==='wetland')wetlandScene(c,w,cam,t);
    else if(g.level.theme==='ice')iceScene(c,w,cam,t);
    else if(g.level.theme==='volcano')volcanoScene(c,w,cam,t);
    else if(g.level.theme==='garden')gardenScene(c,w,cam,t);
    else for(let i=-1;i<w/300+2;i++){const wx=i*300+85-(cam*.43%300);if(g.level.theme==='beach')palm(c,wx,571,.63,t);else tree(c,wx,574,.62,t,g.mode!=='playing');}
    c.fillStyle=({beach:'#e8d09c',forest:'#729c6e',canyon:'#c28d6a',energy:'#a7cbb0',wetland:'#8fbea1',ice:'#c6e0e6',volcano:'#b29c89',garden:'#c1d19e'})[g.level.theme]||'#afd6a4';c.fillRect(0,574,w,Math.max(146,h-574));
    if(g.level.theme==='forest')for(let i=-1;i<w/190+2;i++){const x=i*190+45-(cam*.48%190);mushroom(c,x,580,.65,t);mushroom(c,x+17,580,.45,t);}
    for(let i=0;i<12;i++){let x=(i*127-cam*.55)%(w+80);if(x<0)x+=w+80;ellipse(c,x,603+(i%4)*27,2,1,'#659d8055');}
  }

  function terrain(c,s,t,p,theme){const x=s.x,y=s.y,w=s.w,h=s.h;
    if(s.type==='boost'){
      rr(c,x,y,w,h,5);fill(c,'#278f8d');rr(c,x+2,y+1,w-4,Math.max(5,h-5),4);fill(c,'#6cd6b7');c.save();rr(c,x+2,y+1,w-4,Math.max(5,h-5),4);c.clip();const direction=(s.boostSpeed||1)>0?1:-1,shift=(t*60)%35;for(let xx=x-35+direction*shift;xx<x+w+35;xx+=35){c.beginPath();c.moveTo(xx-direction*5,y+3);c.lineTo(xx+direction*3,y+h/2-1);c.lineTo(xx-direction*5,y+h-5);stroke(c,'#fff0a1',3);}c.restore();return;
    }
    if(s.type==='crumble'&&s.hidden){c.save();c.setLineDash([3,7]);rr(c,x,y,w,h,5);stroke(c,'#a2b7c16b',1);c.restore();return;}
    if(s.type==='bounce'){
      if(theme==='wetland'){rr(c,x,y,w,Math.max(4,h*.4),4);fill(c,'#83bf71');ellipse(c,x+w/2,y+h/2,w*.49,h*.48,'#9bd37e');line(c,x+w*.12,y+h*.6,x+w*.84,y+h*.6,'#5ca376',1.4);for(let i=0;i<5;i++){const a=i*TAU/5;ellipse(c,x+w*.55+Math.cos(a)*4,y+h*.46+Math.sin(a)*3,3,2,'#fff2b6');}ellipse(c,x+w*.55,y+h*.46,2,2,'#e6c655');return;}
      rr(c,x,y,w,h,5);fill(c,'#497d79');rr(c,x+2,y,w-4,8,4);fill(c,'#b3e8ae');for(let xx=x+12;xx<x+w-4;xx+=20){c.beginPath();c.moveTo(xx,y+h-3);c.lineTo(xx-4,y+h-8);c.lineTo(xx+4,y+h-13);c.lineTo(xx,y+7);stroke(c,'#f2e49d',2);}ellipse(c,x+w/2,y+4,5,2,'#f7ffe9');return;
    }
    if(s.type==='conveyor'){
      rr(c,x,y,w,h,5);fill(c,'#497b78');c.save();rr(c,x+2,y+1,w-4,8,3);c.clip();c.fillStyle='#b4d7ae';c.fillRect(x,y,w,10);const off=((t*(s.beltSpeed||90)*.4)%22+22)%22;for(let xx=x-23+off;xx<x+w+22;xx+=22){c.beginPath();c.moveTo(xx,y);c.lineTo(xx+9,y);c.lineTo(xx+16,y+10);c.lineTo(xx+7,y+10);fill(c,'#699c92');}c.restore();for(let xx=x+12;xx<x+w;xx+=27)ellipse(c,xx,y+h-6,3,3,'#d6e7c6');const d=(s.beltSpeed||90)>0?1:-1,cy=y+Math.max(8,h*.55);for(let xx=x+20;xx<x+w-15;xx+=48){c.beginPath();c.moveTo(xx-d*3,cy-3);c.lineTo(xx+d*3,cy);c.lineTo(xx-d*3,cy+3);stroke(c,'#e4f0d2',2);}return;
    }
    if(s.type==='crumble'){
      const shake=Math.min(1,(s.standTime||0)/(s.collapseAfter||.65));c.save();c.translate(Math.sin(t*42)*shake*1.5,0);rr(c,x,y,w,h,6);fill(c,shake>.5?'#e3c6a0':'#d3e4e5');stroke(c,shake>.5?'#bc9361':'#93b8c5',1.5);c.fillStyle='#edf8ee';c.fillRect(x+3,y+1,w-6,5);for(let xx=x+25;xx<x+w;xx+=44){c.beginPath();c.moveTo(xx,y+6);c.lineTo(xx-5,y+h*.5);c.lineTo(xx+4,y+h*.65);c.lineTo(xx-1,y+h);stroke(c,shake>.5?'#b39472':'#a0bac0',1+shake);}c.restore();return;
    }
    if(s.type==='crate'){
      c.save();rr(c,x,y,w,h,6);fill(c,'#ba8950');rr(c,x+3,y+3,w-6,h-6,4);fill(c,'#e5b66e');line(c,x+8,y+8,x+w-8,y+h-8,'#bd8c4d',7);line(c,x+w-8,y+8,x+8,y+h-8,'#bd8c4d',7);rr(c,x+5,y+5,w-10,h-10,2);stroke(c,'#8b6943',3);for(const xx of [x+8,x+w-8])for(const yy of[y+8,y+h-8])ellipse(c,xx,yy,1.7,1.7,'#ffe2a3');c.restore();return;
    }
    if(s.type==='moving'){
      const wood=['forest','canyon','wetland'].includes(theme);ellipse(c,x+w/2,y+h+8,w*.4,5,'#285d6925');rr(c,x,y,w,h,7);fill(c,wood?'#98734f':'#226b72');rr(c,x+2,y+2,w-4,h-7,5);fill(c,wood?'#dfbf86':'#e0eee2');c.save();rr(c,x+2,y+2,w-4,7,3);c.clip();c.fillStyle='#f6d56a';c.fillRect(x,y,w,10);for(let xx=x-12;xx<x+w;xx+=20){c.beginPath();c.moveTo(xx,y+1);c.lineTo(xx+8,y+1);c.lineTo(xx+17,y+10);c.lineTo(xx+9,y+10);fill(c,wood?'#a58c55':'#579389');}c.restore();for(let xx=x+14;xx<x+w-8;xx+=31){ellipse(c,xx,y+h-8,2.8,2.8,wood?'#9a8059':'#5e9c99');ellipse(c,xx,y+h-8,1.2,1.2,'#eaf1cc');}ellipse(c,x+7,y+h/2,2,2,'#a8f1c8');ellipse(c,x+w-7,y+h/2,2,2,'#a8f1c8');
    }else if(s.type==='platform'&&theme==='canyon'){
      // Suspension-style decks are the actual collision platforms. Thin ropes
      // behind them add context without suggesting a second standing surface.
      line(c,x+5,y+2,x+5,y-27,'#9d7352',4);line(c,x+w-5,y+2,x+w-5,y-27,'#9d7352',4);c.beginPath();c.moveTo(x+5,y-24);c.quadraticCurveTo(x+w/2,y-11,x+w-5,y-24);stroke(c,'#ba966a',2);rr(c,x,y,w,h,5);fill(c,'#9a7050');rr(c,x+1,y+1,w-2,7,3);fill(c,'#e5c18c');for(let xx=x+8;xx<x+w-4;xx+=23){line(c,xx,y+3,xx,y+h-2,'#cba174',3);ellipse(c,xx,y+6,1.5,1.5,'#6c6248');}
    }else if(s.type==='platform'){
      ellipse(c,x+w/2,y+h+8,w*.4,6,'#337a6520');rr(c,x,y,w,h,9);fill(c,'#367d69');rr(c,x,y,w,h-5,9);fill(c,theme==='beach'?'#f0dcaa':'#eff2d7');rr(c,x,y,w,10,8);fill(c,theme==='beach'?'#f6e8be':'#46b87d');line(c,x+12,y+16,x+w-12,y+16,'#a5c6a6',2);for(let xx=x+13;xx<x+w-6;xx+=27)ellipse(c,xx,y+h-10,2,2,'#d4dfb9');
    }else{
      c.fillStyle=p.soil;c.fillRect(x,y,w,Math.max(h,1200-y));c.fillStyle=p.edge;c.fillRect(x,y,w,14);c.fillStyle=p.grass;c.fillRect(x,y,w,6);c.fillStyle='#ffffff28';c.fillRect(x,y+17,w,4);for(let xx=x+22;xx<x+w;xx+=48){line(c,xx,y+33,xx+8,y+33,'#a7854930',3);ellipse(c,xx+15,y+60,2,2,'#8d8b4b30');}for(let xx=x+10;xx<x+w-7;xx+=41){c.beginPath();c.moveTo(xx-3,y+2);c.quadraticCurveTo(xx-5,y-8,xx-7,y-10);c.moveTo(xx,y+2);c.quadraticCurveTo(xx+1,y-9,xx+5,y-13);stroke(c,p.grass,2);}
      if(theme==='beach'){for(let xx=x+40;xx<x+w;xx+=163){ellipse(c,xx,y+42,6,3,'#fff1c4');line(c,xx-3,y+42,xx+3,y+42,'#d7b78b',1);}}
      if(theme==='canyon'){for(let yy=y+40;yy<y+h;yy+=32){line(c,x,yy,x+w,yy,'#f5cfad40',5);line(c,x,yy+9,x+w,yy+9,'#ad76572b',2);}}
      if(theme==='forest'){for(let xx=x+67;xx<x+w-8;xx+=157){mushroom(c,xx,y-1,.7,t);mushroom(c,xx+13,y-1,.45,t);}}
      if(theme==='energy'){for(let xx=x+50;xx<x+w-10;xx+=140){line(c,xx,y+39,xx+29,y+39,'#89b2a866',3);ellipse(c,xx+31,y+39,3,3,'#7ca596');}}
      if(theme==='ice'){for(let xx=x+20;xx<x+w-7;xx+=54){c.beginPath();c.moveTo(xx,y+9);c.lineTo(xx+7,y+25);c.lineTo(xx+10,y+9);fill(c,'#a8d5df');}line(c,x+4,y+3,x+w-4,y+3,'#ffffff',2);}
    }
  }

  function movingTrack(c,s,t){const x=(s.baseX??s.x)+s.w/2,y=(s.baseY??s.y)+s.h/2,r=s.range||0,vertical=s.axis==='y';const ends=vertical?[[x,y-r],[x,y+r]]:[[x-r,y],[x+r,y]];c.save();c.setLineDash([3,7]);line(c,ends[0][0],ends[0][1],ends[1][0],ends[1][1],'#447f888c',2);c.setLineDash([]);for(let i=0;i<2;i++){const [xx,yy]=ends[i];ellipse(c,xx,yy,6,6,'#eff6dc');c.beginPath();c.arc(xx,yy,6,0,TAU);stroke(c,'#6a9c8e',1.5);ellipse(c,xx,yy,2.6,2.6,Math.sin(t*2+i)>0?'#e9c864':'#91c4a9');}const direction=(vertical?s.vy:s.vx)>=0?1:-1;if(r>25){for(const sign of[-1,1]){const xx=x+(vertical?0:sign*r*.62),yy=y+(vertical?sign*r*.62:0);if(vertical){line(c,xx-4,yy-direction*3,xx,yy+direction*3,'#49857f',1.6);line(c,xx,yy+direction*3,xx+4,yy-direction*3,'#49857f',1.6);}else{line(c,xx-direction*3,yy-4,xx+direction*3,yy,'#49857f',1.6);line(c,xx+direction*3,yy,xx-direction*3,yy+4,'#49857f',1.6);}}}c.restore();}
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
  function pendulum(c,h,t){const cx=h.x+h.w/2,cy=h.y+h.h/2;line(c,h.anchorX,h.anchorY,cx,cy,'#84977c',3);ellipse(c,h.anchorX,h.anchorY,7,7,'#d4d4a4');ellipse(c,h.anchorX,h.anchorY,3,3,'#879b80');rr(c,h.x,h.y,h.w,h.h,12);fill(c,'#e2c792');stroke(c,'#b69459',2);line(c,h.x+7,h.y+15,h.x+h.w-7,h.y+29,'#bcad7b',3);line(c,h.x+15,h.y+5,h.x+29,h.y+h.h-5,'#f5dfb0',3);rr(c,cx-8,cy-7,16,14,3);fill(c,'#e9d7a8');line(c,cx-5,cy-3,cx+5,cy+3,'#b89b68',2);}
  function hazards(c,g,t,cam,width){for(const h of(g.hazards||[])){if(h.x+h.w<cam-100||h.x>cam+width+100)continue;if(h.kind==='barrier')barrier(c,h,t);else if(h.kind==='pendulum')pendulum(c,h,t);}}
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
    if(o.logo&&o.logo.complete&&o.logo.naturalWidth){const iw=26,ih=iw*o.logo.naturalHeight/o.logo.naturalWidth;c.drawImage(o.logo,16,47-ih/2,iw,ih);}
    ellipse(c,29,60,2,2,'#def6a6');
    // Flexible aerial.
    const ant=Math.sin(t*(running?14:3))*(running?3:1.2);c.beginPath();c.moveTo(29,10);c.quadraticCurveTo(29+ant,3,30+ant,-2);stroke(c,'#4c9783',2.5);ellipse(c,30+ant,-3,4,4,'#ffcf54');ellipse(c,29+ant,-4,1.6,1.6,'#fff8c5');
    rr(c,5,10,48,28,12);fill(c,'#fbfffa');stroke(c,'#6ca89a',1.8);rr(c,11,15,36,17,7);fill(c,'#164d48');const blink=Math.sin(t*.83)> .998;for(const xx of[21,37]){if(blink)line(c,xx-2,23,xx+2,23,'#8af2d5',2.8);else{ellipse(c,xx,22,3.1,4,'#9cf5d8');ellipse(c,xx+.7,20.6,.9,1.2,'#ffffff');}}c.beginPath();c.arc(29,25,3,0,Math.PI);stroke(c,'#8ce8ca',1.3);ellipse(c,8,24,3,5,col);ellipse(c,50,24,3,5,col);rr(c,14,12,20,2,1);fill(c,'#ffffff');
    c.restore();}

  function updrafts(c,g,t,cam,width){for(const v of(g.vents||[])){if(v.x+v.w<cam-20||v.x>cam+width+20)continue;c.save();rr(c,v.x,v.y+v.h-8,v.w,8,3);fill(c,'#819e8c');for(let xx=v.x+8;xx<v.x+v.w-3;xx+=13)line(c,xx,v.y+v.h-6,xx+4,v.y+v.h-3,'#d1e2c5',1.5);if(v.active||v.warning){c.globalAlpha=v.active?.7:.32;for(let i=0;i<4;i++){const xx=v.x+v.w*(i+.5)/4,yy=v.y+v.h-17-(t*(v.active?80:20)+i*27)%(v.h-22);c.beginPath();c.moveTo(xx,yy+16);c.bezierCurveTo(xx-6,yy+8,xx+6,yy+2,xx,yy-7);stroke(c,v.warning?'#d4bc63':'#e7f6cf',2);}c.setLineDash([3,6]);rr(c,v.x,v.y,v.w,v.h,6);stroke(c,v.active?'#83b49b88':'#d2bd7455',1);c.setLineDash([]);}c.restore();}}
  function recycle(c,x,y,s,color){c.save();c.translate(x,y);c.scale(s,s);for(let i=0;i<3;i++){c.save();c.rotate(i*TAU/3);c.beginPath();c.moveTo(-6,-13);c.lineTo(0,-23);c.lineTo(10,-7);c.lineTo(4,-9);c.lineTo(1,-3);c.lineTo(-6,-13);fill(c,color);c.restore();}c.restore();}
  function machine(c,g,t){const m=g.level.machine, x=m.x,y=m.y??448,active=g.mode==='delivering'||g.mode==='complete';c.save();c.translate(x,y);ellipse(c,56,145,70,12,'#285f5630');rr(c,-4,-5,120,151,16);fill(c,'#23675a');rr(c,0,-9,112,151,14);fill(c,'#f3fff0');rr(c,4,-5,104,34,10);fill(c,'#069d7b');c.fillStyle='#069d7b';c.fillRect(4,9,104,20);text(c,'DOA',56,21,25,'#ffffff',900,'center');rr(c,15,37,82,46,8);fill(c,'#174f49');rr(c,20,41,72,37,5);fill(c,'#26796c');recycle(c,56,61,.55,active?'#acffe4':'#a1e7cc');ellipse(c,85,44,2,2,active?'#e4e965':'#88d9b8');rr(c,19,93,74,24,5);fill(c,'#d9ede1');rr(c,28,97,56,6,3);fill(c,'#2c7061');rr(c,29,110,54,3,1);fill(c,'#afcdbc');for(let i=0;i<3;i++){rr(c,38+i*13,125,8,3,1);fill(c,active?'#2dbf87':'#95bbae');}rr(c,13,139,24,9,3);fill(c,'#245f50');rr(c,76,139,24,9,3);fill(c,'#245f50');
    // Tiny leaf badge makes the temporary machine friendly and readable.
    c.save();c.translate(97,117);c.rotate(-.4);ellipse(c,0,0,5,9,'#5abe7b');line(c,0,4,0,-3,'#f0f8cc',1);c.restore();c.restore();
    if(active){const progress=g.deliveryProgress||0;for(let i=0;i<6;i++){let u=(progress*2.4+i/6)%1;if(g.mode==='complete')continue;const sx=g.p.x+28,sy=g.p.y+44,ex=x+56,ey=y+60;let xx=sx+(ex-sx)*u, yy=sy+(ey-sy)*u-Math.sin(u*Math.PI)*115;packageArt(c,xx,yy,['plastic','glass','can'][i%3],.58,u*4);}}}

  function sign(c,x,y,label,sub){line(c,x,y,x,y-53,'#b28c55',7);rr(c,x-52,y-79,104,37,8);fill(c,'#fff9d8');stroke(c,'#ccae6e',2);text(c,label,x,y-57,12,'#427359',800,'center');if(sub)text(c,sub,x,y-23,11,'#4f7861',700,'center');}
  function tutorialSign(c,x,message){const max=244,words=message.split(' '),lines=[];let current='';c.font='700 14px "Trebuchet MS", Arial, sans-serif';for(const word of words){const next=current?current+' '+word:word;if(c.measureText(next).width>max&&current){lines.push(current);current=word;}else current=next;}if(current)lines.push(current);const h=22+lines.length*19;line(c,x,589,x,535-h,'#a17b4d',6);rr(c,x-134,531-h,268,h,8);fill(c,'#fffbe9');stroke(c,'#d5bb85',1.7);for(let i=0;i<lines.length;i++)text(c,lines[i],x,550-h+i*19,14,'#4a7860',700,'center');ellipse(c,x-124,540-h,2,2,'#c1a166');ellipse(c,x+124,540-h,2,2,'#c1a166');}
  function pits(c,g){const grounds=(g.solids||g.level.solids).filter(s=>s.type==='ground').sort((a,b)=>a.x-b.x);for(let i=1;i<grounds.length;i++){const x=grounds[i-1].x+grounds[i-1].w,w=grounds[i].x-x;if(w<=0)continue;const warm=g.level.theme==='canyon'||g.level.theme==='volcano';c.fillStyle=gradient(c,590,720,[[0,warm?'#ae795e':'#286d62'],[1,warm?'#80594b':'#154c48']]);c.fillRect(x,590,w,610);c.fillStyle='#194f4740';c.fillRect(x,590,w,13);for(const xx of[x+6,x+w-6]){line(c,xx,590,xx,635,warm?'#d0a071':'#6da683',2);for(let y=602;y<630;y+=11)ellipse(c,xx+(y%2?3:-3),y,4,2,warm?'#e1b58c':'#8bba8d');}ellipse(c,x+w*.5,702,w*.3,6,warm?'#7db5ad50':'#5da29d28');}}
  function foreground(c,g,t){const m=g.level.machine, bright=g.mode==='complete'||g.mode==='delivering';if(bright){for(let i=0;i<9;i++){const progress=g.mode==='complete'?1:Math.min(1,g.deliveryProgress*2-i*.07);if(progress>0)flower(c,m.x-135+i*39,589,Math.max(.1,progress),t+i);}tree(c,m.x+190,590,.85,t,true);tree(c,m.x-180,590,.55,t,true);}else{for(let i=0;i<3;i++){const xx=m.x-100+i*32;line(c,xx,590,xx+3,581,'#729865',2);}}}
  function draw(c,g,o){
    if(!g||!g.level)return;const palette=palettes[g.level.theme]||palettes.park,time=o.time||0,cam=g.cameraX||0;
    c.save();background(c,g,o,palette);c.translate(-cam+(o.shakeX||0),o.shakeY||0);pits(c,g);
    const solids=g.solids||g.level.solids;
    for(const s of solids)if(s.type==='moving'&&s.baseX+(s.range||0)+s.w>cam-30&&s.baseX-(s.range||0)<cam+o.width+30)movingTrack(c,s,time);
    for(const s of solids){if(s.x+s.w<cam-40||s.x>cam+o.width+40)continue;terrain(c,s,time,palette,g.level.theme);}
    updrafts(c,g,time,cam,o.width);checkpointFlags(c,g,time,cam,o.width);
    for(const s of(g.level.signs||[]))if(s.x+140>cam&&s.x-140<cam+o.width)tutorialSign(c,s.x,s.text);
    for(const item of g.items)if(!item.collected&&item.x>cam-35&&item.x<cam+o.width+35)collectible(c,item,time);
    if(g.level.machine.x+230>cam&&g.level.machine.x-240<cam+o.width){foreground(c,g,time);machine(c,g,time);}
    hazards(c,g,time,cam,o.width);
    const player=g.p,center=player.x+player.w/2,landingSurface=solids.filter(s=>!s.hidden&&center>s.x&&center<s.x+s.w&&s.y>=player.y+player.h-4).sort((a,b)=>a.y-b.y)[0];
    if(landingSurface)ellipse(c,center,landingSurface.y+1,Math.max(8,23-Math.max(0,landingSurface.y-player.y-player.h)/20),4,'#23594c22');
    robot(c,player.x,player.y,player.w/58,{time,color:o.color,logo:o.logo,running:Math.abs(player.vx)>10&&player.grounded,airborne:!player.grounded,dir:player.dir});
    for(const particle of(o.particles||[])){const alpha=Math.min(1,(particle.life??1)/(particle.maxLife||1));c.save();c.globalAlpha=alpha;if(particle.text||particle.type==='text')text(c,particle.text||'+10',particle.x,particle.y,22,particle.color||'#008b6b',900,'center');else if(particle.type==='ring'){c.beginPath();c.arc(particle.x,particle.y,(1-alpha)*27+5,0,TAU);stroke(c,particle.color||'#f7cc56',2);}else{const size=(particle.size||3)*alpha;c.translate(particle.x,particle.y);c.rotate((1-alpha)*3);c.fillStyle=particle.color||'#fff1a2';c.fillRect(-size,-size,size*2,size*2);}c.restore();}
    c.restore();
  }
  root.RVMRenderer={draw,robot,packageArt};
})(typeof window!=='undefined'?window:globalThis);
