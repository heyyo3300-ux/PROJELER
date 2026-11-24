(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RVMEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const PHYSICS = Object.freeze({ speed: 285, acceleration: 2200, friction: 2400, jump: 600, gravity: 1500, maxFall: 950, coyote: 0.12, buffer: 0.13 });
  const ground = (x, w) => ({ x, y: 590, w, h: 200, type: 'ground' });
  const platform = (x, y, w) => ({ x, y, w, h: 24, type: 'platform' });
  const crate = (x, h = 60, w = 66) => ({ x, y: 590 - h, w, h, type: 'crate' });
  const moving = (id, baseX, baseY, w, axis = 'x', range = 90, period = 4.4, phase = 0) => ({ id, baseX, baseY, w, h: 24, type: 'moving', axis, range, period, phase });
  const drone = (id, minX, maxX, period = 4, phase = 0, baseY = 538) => ({ id, kind: 'drone', minX, maxX, baseY, w: 50, h: 40, period, phase });
  const barrier = (id, x, period = 4.8, activeDuration = 1.7, phase = 0) => ({ id, kind: 'barrier', x, y: 402, w: 26, h: 188, period, activeDuration, warningDuration: 0.7, phase });
  const pendulum = (id, anchorX, period = 4) => ({ id, kind: 'pendulum', anchorX, anchorY: 310, ropeLength: 200, amplitude: 0.62, period, phase: 0, w: 44, h: 44 });
  const item = (x, y, i) => ({ id: 'pack-' + i, x, y, type: ['plastic', 'glass', 'can'][i % 3] });
  function makeLevel(id, name, subtitle, width, targetTime, theme, terrain, upper, low, high, checkpoints) {
    return {
      id, name, subtitle, width, targetTime, theme,
      solids: terrain.concat(upper),
      items: low.concat(high).map((p, i) => item(p[0], p[1], i)),
      checkpoints: checkpoints.map(x => ({ x, y: 510 })),
      machine: { x: width - 240, y: 448, w: 110, h: 142 },
      signs: id === 0 ? [
        { x: 150, text: 'Yön tuşları / A · D ile yürü' },
        { x: 520, text: 'Boşluk: zıpla · Havada bir kez daha!' },
        { x: 1150, text: 'Yüksek yolu dene, daha çok ambalaj topla' },
        { x: width - 560, text: 'En az 8 ambalajla DOA’ya teslim et' }
      ] : [
        { x: 220, text: id === 1 ? 'İki yol, tek hedef: tertemiz bir sahil' : 'Hazırsın RVM! Şimdi döngüyü tamamla' },
        { x: width - 600, text: 'DOA seni bekliyor · En az 8 ambalaj' }
      ]
    };
  }
  const LEVELS = [
    makeLevel(0, 'Yeşil Park', 'Küçük adımlar, kocaman bir fark.', 3400, 80, 'park',
      [ground(0, 950), ground(1070, 1130), ground(2330, 1070), crate(590), crate(1540, 76), crate(2720, 62)],
      [platform(380, 460, 190), platform(720, 350, 190), platform(1230, 450, 210), platform(1800, 425, 230), platform(2440, 455, 210)],
      [[250, 544], [770, 544], [1150, 544], [1480, 544], [1750, 544], [2130, 544], [2470, 544], [2990, 544]],
      [[470, 414], [820, 304], [1330, 404], [1910, 379]], [100, 1110, 2370]),
    makeLevel(1, 'Temiz Sahil', 'Her ambalaj, denize bir iyilik.', 4200, 100, 'beach',
      [ground(0, 800), ground(940, 790), ground(1880, 940), ground(2970, 1230), crate(590, 68), crate(1370, 82), crate(2180, 62), crate(3410, 88)],
      [platform(420, 460, 200), platform(690, 345, 180), platform(1160, 455, 220), platform(1530, 350, 200), platform(2120, 455, 190), platform(2480, 345, 200), platform(3190, 445, 210)],
      [[250, 544], [1050, 544], [1460, 544], [2010, 544], [2380, 544], [3070, 544], [3550, 544], [3900, 544]],
      [[510, 414], [1260, 409], [2570, 299], [3280, 399]], [100, 980, 1920, 3010]),
    makeLevel(2, 'Geleceğin Şehri', 'Birlikte daha yeşil bir gelecek.', 5000, 125, 'city',
      [ground(0, 820), ground(980, 870), ground(2020, 870), ground(3060, 820), ground(4050, 950), crate(560, 80), crate(1230, 92), crate(2290, 84), crate(3450, 96), crate(4390, 75)],
      [platform(450, 460, 220), platform(760, 345, 190), platform(1310, 460, 190), platform(1560, 350, 210), platform(2190, 455, 220), platform(2550, 345, 210), platform(3190, 445, 220), platform(3590, 335, 220), platform(4180, 450, 190)],
      [[250, 544], [1080, 544], [1720, 544], [2120, 544], [2770, 544], [3160, 544], [4150, 544], [4680, 544]],
      [[550, 414], [1660, 304], [2660, 299], [3690, 289]], [100, 1020, 2060, 3100, 4090]),
    makeLevel(3, 'Rüzgâr Ormanı', 'Rüzgârla yol al, ormana nefes ol.', 5700, 145, 'forest',
      [ground(0, 950), ground(1200, 1150), ground(2600, 1250), ground(4090, 1610), crate(600, 80), crate(1600, 88), crate(3000, 90), crate(4450, 88)],
      [platform(450, 460, 220), platform(820, 350, 200), platform(1380, 450, 220), platform(1800, 340, 220), platform(2760, 450, 220), platform(3170, 340, 220), platform(3540, 430, 200), platform(4300, 450, 220), platform(4750, 340, 220), platform(5150, 450, 180)],
      [[250, 544], [1310, 544], [1710, 544], [2730, 544], [3400, 544], [4190, 544], [4670, 544], [5430, 544]],
      [[550, 414], [1900, 294], [3270, 294], [4850, 294]], [100, 1240, 2640, 4130]),
    makeLevel(4, 'Döngü Vadisi', 'Yükselen yollar, büyüyen cesaret.', 6500, 170, 'canyon',
      [ground(0, 1000), ground(1280, 1170), ground(2730, 1190), ground(4210, 1170), ground(5660, 840), crate(570, 92), crate(1600, 96), crate(3060, 100), crate(4490, 100), crate(5910, 90)],
      [platform(450, 450, 230), platform(820, 335, 200), platform(1440, 450, 220), platform(1830, 330, 220), platform(2840, 445, 230), platform(3260, 325, 220), platform(3630, 430, 200), platform(4300, 445, 220), platform(4780, 325, 220), platform(5720, 450, 200)],
      [[250, 544], [1380, 544], [2180, 544], [2820, 544], [3730, 544], [4320, 544], [5180, 544], [6190, 544]],
      [[550, 404], [1930, 284], [3370, 279], [4890, 279]], [100, 1320, 2770, 4250, 5700]),
    makeLevel(5, 'Yeşil Enerji Üssü', 'Döngünün gücüyle geleceği aydınlat.', 7300, 200, 'energy',
      [ground(0, 1050), ground(1340, 1190), ground(2820, 1230), ground(4350, 1230), ground(5880, 1420), crate(580, 96), crate(1600, 100), crate(3080, 104), crate(4650, 106), crate(6140, 100)],
      [platform(450, 450, 230), platform(850, 330, 210), platform(1450, 445, 220), platform(1860, 325, 230), platform(2950, 440, 230), platform(3370, 320, 230), platform(3780, 430, 210), platform(4460, 440, 220), platform(4880, 320, 230), platform(6040, 440, 220), platform(6500, 325, 230)],
      [[250, 544], [1450, 544], [2210, 544], [2920, 544], [3880, 544], [4480, 544], [5440, 544], [6980, 544]],
      [[550, 404], [1970, 279], [3480, 274], [6610, 279]], [100, 1380, 2860, 4390, 5920])
  ];
  const details = [
    ['İlk adımlarını at; güvenli parkta çift zıplamayı ve yüksek rotaları keşfet.', 'Başlangıç', 'Çift zıplama', 'Kasaları aşmak ve yüksek ambalajlara uzanmak için havada bir kez daha zıpla.'],
    ['Temizlik robotları sahilde devriye geziyor. Doğru anda üzerlerinden atla.', 'Kolay', 'Devriye robotu', 'Temizlik robotuna yol ver ya da üzerinden çift zıplayarak geç.'],
    ['Şehrin enerji kapıları ritimle açılıp kapanıyor. Işığı izle, geçişini zamanla.', 'Orta', 'Zamanlı enerji kapısı', 'Sarı ışık uyarıdır. Kapı yeşil ve açıkken geçebilir ya da yüksek yolu deneyebilirsin.'],
    ['Rüzgâr panelleri seni ormanın iki yakası arasında taşıyor.', 'İleri', 'Taşıyan platformlar', 'Platformun yaklaşmasını bekle. Üzerine inince RVM de onunla birlikte taşınır.'],
    ['Geniş vadilerde hareketli köprüler, devriyeler ve kapılar birleşiyor.', 'Zor', 'Rota ve ritim', 'Bir sonraki güvenli zemini gör; hareketli köprüyle yaklaş, sonra çift zıpla.'],
    ['En uzun parkurda öğrendiğin bütün becerilerle yeşil enerjiyi serbest bırak.', 'Usta', 'Döngü ustalığı', 'Kapıların ritmini, devriyeleri ve taşıyan platformları birlikte izle. Acele etmeden de başarabilirsin.']
  ];
  LEVELS.forEach((level, i) => {
    const [description, difficulty, mechanic, tip] = details[i];
    Object.assign(level, { description, difficulty, difficultyRating: i + 1, mechanic, tip, movingPlatforms: [], hazards: [] });
    level.solids.forEach((s, n) => { s.id = 'solid-' + n; });
  });
  LEVELS[1].hazards = [drone('beach-cleaner', 3600, 3740, 4.4)];
  LEVELS[2].hazards = [drone('city-cleaner', 3270, 3360, 3.8), barrier('city-gate', 4540, 4.8, 1.6, 0.5)];
  LEVELS[3].movingPlatforms = [moving('forest-bridge-1', 1060, 485, 150, 'x', 85, 4.6), moving('forest-bridge-2', 2460, 455, 160, 'x', 95, 4.3), moving('forest-bridge-3', 3970, 465, 150, 'x', 90, 4)];
  LEVELS[3].hazards = [drone('forest-cleaner', 2080, 2180, 4.1), barrier('forest-gate', 5070, 4.7, 1.7, 0.7)];
  LEVELS[4].movingPlatforms = [moving('canyon-bridge-1', 1130, 475, 150, 'x', 85, 3.9), moving('canyon-bridge-2', 2590, 455, 150, 'y', 35, 4), moving('canyon-bridge-3', 4050, 475, 150, 'x', 90, 4.2), moving('canyon-bridge-4', 5510, 465, 150, 'x', 85, 3.6)];
  LEVELS[4].hazards = [drone('canyon-cleaner-1', 2030, 2120, 3.6), drone('canyon-cleaner-2', 5000, 5090, 3.7), barrier('canyon-gate', 3520, 4.4, 1.8, 0.4)];
  LEVELS[5].movingPlatforms = [moving('energy-bridge-1', 1180, 475, 150, 'x', 90, 3.7), moving('energy-bridge-2', 2660, 460, 150, 'y', 40, 3.8), moving('energy-bridge-3', 4180, 465, 150, 'x', 100, 3.7), moving('energy-bridge-4', 5710, 455, 150, 'x', 95, 3.4)];
  LEVELS[5].hazards = [drone('energy-cleaner-1', 2040, 2140, 3.4), drone('energy-cleaner-2', 5100, 5200, 3.3), drone('energy-cleaner-3', 6760, 6850, 3.2), barrier('energy-gate-1', 3640, 4.1, 1.8, 0.5), barrier('energy-gate-2', 6380, 4, 1.8, 0.8)];
  LEVELS.slice(3).forEach(level => { level.signs[0].text = level.mechanic + ' · ' + level.tip; });
  // The original six journeys retain their identity and saved result index.
  // Stretch the actual obstacle course, not merely an empty finish corridor.
  LEVELS.forEach(level => {
    const scale = 1.22;
    for (const s of level.solids) { s.x *= scale; s.w *= scale; }
    for (const s of level.movingPlatforms) { s.baseX *= scale; s.w *= scale; if (s.axis === 'x') s.range *= scale; s.period *= 1.08; }
    for (const h of level.hazards) { if (h.kind === 'drone') { h.minX *= scale; h.maxX *= scale; h.period *= 1.1; } else h.x *= scale; }
    level.items.forEach(p => { p.x *= scale; }); level.checkpoints.slice(1).forEach(p => { p.x *= scale; });
    level.signs.forEach(s => { s.x *= scale; });
    level.width *= scale; level.targetTime = Math.round(level.targetTime * 1.22 + 25); level.vents = [];
  });
  const newWorlds = [
    ['Sulak Alan Macerası', 'Sıçrayan nilüferlerle suyun döngüsünü koru.', 'wetland', 10000, 'Nilüfer sıçrayışı', 'Esnek nilüfere basınca yükselirsin. Yüksek yolları keşfet, aşağıda güvenli zemin seni bekler.'],
    ['Buzul Işıltısı', 'Kaygan yolların ritmini bul.', 'ice', 10800, 'Eriyen buz platformları', 'Buzda durmak biraz daha uzun sürer. Titreyen platformdan zamanında zıpla; kısa süre sonra yeniden oluşur.'],
    ['Jeotermal Keşif', 'Doğanın sıcak nefesiyle yükseğe çık.', 'volcano', 11600, 'Basınçlı hava bacaları', 'Sarı uyarıdan sonra hava yükselir. Bu sıcak hava zararsızdır ve RVM’yi yüksek rotaya taşır.'],
    ['Döngü Bahçesi', 'Bütün yollar yeşil bir geleceğe çıkar.', 'garden', 12400, 'Yön değiştiren bantlar', 'Taşıma bantlarının yönüne bak; ters yönde koşarken hızını ayarla. Döngünün son sürprizi seni bekliyor.']
  ];
  for (let n = 0; n < newWorlds.length; n++) {
    const [name, subtitle, theme, width, mechanic, tip] = newWorlds[n];
    const terrain = [], upper = [], low = [], high = [], cps = [], movers = [], hazards = [], vents = [];
    const span = width / 8, gap = 220 + n * 15;
    for (let k = 0; k < 8; k++) {
      const start = k * span, land = k === 7 ? span : span - gap;
      terrain.push(ground(start, land), crate(start + 510, 88 + n * 4));
      const highX = start + Math.min(land - 290, 750);
      upper.push(platform(start + 250, 450, 240), platform(highX, 330, 230));
      low.push([start + (k ? 130 : 250), 544]);
      if (k % 2) high.push([highX + 110, 284]);
      cps.push(k ? start + 40 : 100);
      if (k < 7) movers.push(moving(theme + '-bridge-' + k, start + land + 45, 475, 155, k % 3 === 1 ? 'y' : 'x', k % 3 === 1 ? 30 : 75, 4.2 - n * 0.15));
      if (k === 2 || k === 5) hazards.push(drone(theme + '-cleaner-' + k, start + 650, start + 740, 3.8 - n * 0.1));
      if (k === 4 || k === 6) hazards.push(barrier(theme + '-gate-' + k, start + land - 390, 4.6 - n * 0.1, 1.6, k * 0.13));
      if (theme === 'wetland' && k < 7) terrain.push({ x: start + 670, y: 590, w: 84, h: 14, type: 'bounce', power: 740 });
      if (theme === 'ice' && k % 2 === 0) upper.push({ x: start + land - 60, y: 470, w: 180, h: 24, type: 'crumble', collapseAfter: 0.65, recoverAfter: 3.4 });
      if (theme === 'volcano' && k < 7) vents.push({ id: 'vent-' + k, x: start + 720, y: 350, w: 110, h: 240, period: 4.8, activeDuration: 1.5, warningDuration: 0.7, phase: k * 0.4 });
      if (theme === 'garden' && k < 7) terrain.push({ x: start + 700, y: 590, w: 210, h: 16, type: 'conveyor', beltSpeed: k % 2 ? -70 : 90 });
    }
    const level = makeLevel(n + 6, name, subtitle, width, 245 + n * 20, theme, terrain, upper, low, high, cps);
    Object.assign(level, { description: subtitle + ' ' + tip, difficulty: ['Uzman', 'Cesur', 'Kaşif', 'Döngü Ustası'][n], difficultyRating: n + 7, mechanic, tip, movingPlatforms: movers, hazards, vents });
    if (theme === 'ice') { level.friction = 1100; level.acceleration = 1700; }
    LEVELS.push(level);
  }
  const bossNames = ['Çöp Pofuduk', 'Kum Köpürtüsü', 'Teneke Tıkırtı', 'Yaprak Düğümü', 'Vadi Yuvarlağı', 'Enerji Yumağı', 'Nilüfer Bulutu', 'Buzul Pofuru', 'Buhar Tombulu', 'Döngü Girdabı'];
  LEVELS.forEach((level, index) => {
    const courseEnd = level.width;
    level.courseWidth = courseEnd; level.width = courseEnd + 900;
    level.solids.push(ground(courseEnd, 900));
    level.checkpoints.push({ x: courseEnd + 70, y: 510 });
    level.machine = { x: level.width - 190, y: 448, w: 110, h: 142 };
    level.bossConfig = { name: bossNames[index], x: level.width - 510, y: 434, w: 132, h: 156, maxHealth: 20 + index * 3, attackPeriod: Math.max(2.35, 3.6 - index * 0.12), projectileSpeed: 145 + index * 6, variant: index % 4, arena: { start: courseEnd + 20, end: level.width, checkpointX: courseEnd + 70 } };
    level.solids.forEach((s, i) => { s.id = 'solid-' + i; });
    level.signs.push({ x: courseEnd - 180, text: 'Çöp bossunu Döngü Köpüğüyle dağıt! F / Köpük düğmesini basılı tut.' });
  });
  LEVELS[0].solids.push({ id: 'park-spring', type: 'bounce', x: 390, y: 590, w: 78, h: 14, power: 690 });
  LEVELS[0].mechanic = 'Çift zıplama ve esnek zemin';
  LEVELS[1].solids.push({ id: 'beach-belt', type: 'conveyor', x: 1680, y: 590, w: 190, h: 16, beltSpeed: -55 });
  LEVELS[1].mechanic = 'Devriye ve taşıma bandı';
  LEVELS[2].solids.push({ id: 'city-crumble', type: 'crumble', x: 2350, y: 440, w: 170, h: 24, collapseAfter: 0.75, recoverAfter: 3.4 });
  LEVELS[2].mechanic = 'Enerji kapısı ve çöken platform';
  LEVELS[3].vents.push({ id: 'forest-draft', x: 3320, y: 350, w: 110, h: 240, period: 5, activeDuration: 1.3, warningDuration: 0.7, phase: 0.2 });
  LEVELS[3].mechanic = 'Hareketli platform ve rüzgâr';
  LEVELS[4].hazards.push(pendulum('canyon-swing', LEVELS[4].courseWidth - 550, 4.2));
  LEVELS[4].mechanic = 'Sallanan ambalaj topu';
  LEVELS[5].hazards.push(pendulum('energy-swing', LEVELS[5].courseWidth - 550, 3.8));
  LEVELS[5].mechanic = 'Kapı, köprü ve sarkaç';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const oneWay = s => ['platform', 'moving', 'bounce', 'conveyor', 'crumble'].includes(s.type);
  const circleHits = (ball, box) => (ball.x - clamp(ball.x, box.x, box.x + box.w)) ** 2 + (ball.y - clamp(ball.y, box.y, box.y + box.h)) ** 2 <= ball.r ** 2;
  class Game {
    constructor(levelIndex = 0) { this.reset(levelIndex); }
    reset(levelIndex = this.levelIndex) {
      this.levelIndex = clamp(Math.floor(levelIndex) || 0, 0, LEVELS.length - 1);
      this.level = LEVELS[this.levelIndex];
      this.items = this.level.items.map(p => ({ ...p, collected: false }));
      this.movingPlatforms = this.level.movingPlatforms.map(s => ({ ...s, x: s.baseX, y: s.baseY, dx: 0, dy: 0, vx: 0, vy: 0 }));
      this.staticSolids = this.level.solids.map(s => ({ ...s, standTime: 0, hidden: false, cooldown: 0 }));
      this.solids = this.staticSolids.concat(this.movingPlatforms);
      this.hazards = this.level.hazards.map(h => ({ ...h, active: false, warning: false }));
      this.vents = this.level.vents.map(v => ({ ...v, active: false, warning: false }));
      this.boss = { ...this.level.bossConfig, arena: { ...this.level.bossConfig.arena }, health: this.level.bossConfig.maxHealth, active: false, defeated: false, phase: 'waiting', telegraph: false, windup: 0, vulnerable: false, stage: 1, battleTime: 0, attackClock: 0, lastAttack: -1, defeatedAt: null, vanishProgress: 0 };
      this.projectiles = []; this.bossProjectiles = []; this.fireCooldown = 0; this.projectileId = 0;
      this.p = { x: 100, y: 510, w: 58, h: 80, vx: 0, vy: 0, grounded: true, jumps: 0, dir: 1, supportId: 'solid-0' };
      this.elapsed = 0; this.penalty = 0; this.collected = 0; this.score = 0;
      this.mode = 'playing'; this.deliveryProgress = 0; this.result = null;
      this.checkpoint = { ...this.level.checkpoints[0] };
      this.events = []; this.coyote = PHYSICS.coyote; this.jumpBuffer = 0;
      this.time = 0; this.falls = 0; this.hits = 0; this.invulnerable = 0;
      this.updateDynamics(0);
      return this;
    }
    get nearMachine() { return Math.abs(this.p.x + this.p.w / 2 - (this.level.machine.x + this.level.machine.w / 2)) < 170 && this.p.y + this.p.h > 480 && this.p.y < 640; }
    get bossProgress() { return clamp(1 - this.boss.health / this.boss.maxHealth, 0, 1); }
    drainEvents() { const result = this.events; this.events = []; return result; }
    emit(type, extra) { this.events.push({ type, x: this.p.x + this.p.w / 2, y: this.p.y + this.p.h / 2, ...extra }); }
    updateDynamics(dt) {
      const tau = Math.PI * 2;
      for (const s of this.movingPlatforms) {
        const oldX = s.x, oldY = s.y;
        const offset = Math.sin(this.time * tau / s.period + s.phase) * s.range;
        s.x = s.baseX + (s.axis === 'x' ? offset : 0);
        s.y = s.baseY + (s.axis === 'y' ? offset : 0);
        s.dx = dt ? s.x - oldX : 0; s.dy = dt ? s.y - oldY : 0;
        s.vx = dt ? s.dx / dt : 0; s.vy = dt ? s.dy / dt : 0;
      }
      for (const h of this.hazards) {
        if (h.kind === 'drone') {
          h.x = h.minX + (h.maxX - h.minX) * (1 - Math.cos(this.time * tau / h.period + h.phase)) / 2;
          h.y = h.baseY; h.active = true; h.warning = false; h.untilSwitch = 0;
        } else if (h.kind === 'pendulum') {
          h.angle = Math.sin(this.time * tau / h.period + h.phase) * h.amplitude;
          h.x = h.anchorX + Math.sin(h.angle) * h.ropeLength - h.w / 2;
          h.y = h.anchorY + Math.cos(h.angle) * h.ropeLength - h.h / 2;
          h.active = true; h.warning = false; h.untilSwitch = 0;
        } else {
          h.cycle = (this.time + h.phase) % h.period;
          const openFor = h.period - h.activeDuration;
          h.active = h.cycle >= openFor;
          h.warning = !h.active && h.cycle >= openFor - h.warningDuration;
          h.untilSwitch = h.active ? h.period - h.cycle : openFor - h.cycle;
        }
      }
      for (const v of this.vents) {
        const cycle = (this.time + v.phase) % v.period, openFor = v.period - v.activeDuration;
        v.active = cycle >= openFor; v.warning = !v.active && cycle >= openFor - v.warningDuration;
      }
      for (const s of this.staticSolids) if (s.type === 'crumble') {
        if (s.hidden) { s.cooldown = Math.max(0, s.cooldown - dt); if (!s.cooldown) { s.hidden = false; s.standTime = 0; } }
        else if (this.p.grounded && this.p.supportId === s.id) {
          s.standTime += dt;
          if (s.standTime >= s.collapseAfter) { s.hidden = true; s.cooldown = s.recoverAfter; this.emit('crumble', { x: s.x + s.w / 2, y: s.y }); }
        } else s.standTime = Math.max(0, s.standTime - dt);
      }
    }
    fireNow() {
      if (this.mode !== 'playing' || this.fireCooldown > 0) return false;
      const p = this.p, b = this.boss, direction = b.active && !b.defeated ? (b.x + b.w / 2 >= p.x + p.w / 2 ? 1 : -1) : p.dir;
      const x = p.x + p.w / 2 + direction * 35, y = p.y + 34;
      const dx = b.x + b.w / 2 - x;
      const aim = b.active && !b.defeated && Math.sign(dx) === direction ? clamp((b.y + b.h * 0.55 - y) / Math.max(80, Math.abs(dx)) * 650, -160, 160) : 0;
      this.projectiles.push({ id: ++this.projectileId, kind: 'foam', x, y, r: 10, vx: direction * 650, vy: aim, life: 1.7 });
      this.fireCooldown = 0.28; this.emit('foam', { x, y }); return true;
    }
    updateBoss(dt, input) {
      const b = this.boss, p = this.p;
      if (!b.active && !b.defeated && p.x + p.w >= b.arena.start) {
        b.active = true; b.phase = 'intro'; b.battleTime = 0;
        this.checkpoint = { x: b.arena.checkpointX, y: 510 };
        this.emit('bossActivated', { text: b.name + ' ortaya çıktı! Döngü Köpüğünü basılı tut.', name: b.name });
      }
      if (b.defeated) { b.vanishProgress = clamp((this.time - b.defeatedAt) / 1.1, 0, 1); b.phase = b.vanishProgress < 1 ? 'dissolving' : 'gone'; }
      else if (b.active) {
        b.battleTime += dt;
        b.vulnerable = b.battleTime >= 1;
        if (b.battleTime < 1) { b.phase = 'intro'; b.telegraph = false; }
        else {
          const stage = this.levelIndex >= 4 && b.health <= b.maxHealth / 2 ? 2 : 1;
          if (stage !== b.stage) { b.stage = stage; b.attackClock = 0; b.lastAttack = -1; this.emit('bossStage', { text: 'Ritim hızlandı! Uyarıyı izle, köpüğe devam et.' }); }
          const period = b.attackPeriod * (b.stage === 2 ? 0.82 : 1);
          b.attackClock += dt;
          const t = b.attackClock, cycle = t % period, attack = Math.floor(t / period);
          const warningStart = period - 0.95, attackStart = period - 0.15;
          b.phase = cycle < warningStart ? 'rest' : cycle < attackStart ? 'telegraph' : 'attack';
          b.telegraph = b.phase === 'telegraph'; b.windup = b.telegraph ? (cycle - warningStart) / 0.8 : 0;
          if (cycle >= attackStart && b.lastAttack !== attack) {
            b.lastAttack = attack;
            if (this.invulnerable <= 0) {
              const kind = b.variant === 1 || b.variant === 3 ? 'arc' : 'rolling';
              const speed = b.projectileSpeed * (b.stage === 2 ? 1.12 : 1);
              const aimDirection = p.x + p.w / 2 < b.x + b.w / 2 ? -1 : 1;
              const originX = aimDirection < 0 ? b.x - 18 : b.x + b.w + 18;
              this.bossProjectiles.push({ id: ++this.projectileId, kind, x: originX, y: kind === 'rolling' ? 574 : 500, r: 15 + this.levelIndex * 0.3, vx: aimDirection * speed, vy: kind === 'rolling' ? 0 : -250, gravity: kind === 'rolling' ? 0 : 500, life: 7 });
              if (b.variant >= 2 || b.stage === 2) this.bossProjectiles.push({ id: ++this.projectileId, kind: 'bubble', x: originX, y: 465, r: 13, vx: aimDirection * speed * 0.8, vy: 10, gravity: 0, life: 7 });
              this.emit('bossAttack', { kind, text: 'İşareti izle; zıpla ve köpükle döngüyü tamamla!' });
            }
          }
        }
      }
      this.fireCooldown = Math.max(0, this.fireCooldown - dt);
      if (input.fire) this.fireNow();
      for (const foam of this.projectiles) {
        foam.x += foam.vx * dt; foam.y += foam.vy * dt; foam.life -= dt;
        if (b.active && !b.defeated && circleHits(foam, b)) {
          foam.life = 0;
          if (!b.vulnerable) continue;
          b.health = Math.max(0, b.health - 1); this.emit('bossHit', { x: foam.x, y: foam.y, progress: this.bossProgress });
          if (!b.health) {
            b.defeated = true; b.defeatedAt = this.time; b.vanishProgress = 0; b.phase = 'dissolving'; b.telegraph = false;
            this.bossProjectiles = []; this.emit('bossDefeated', { x: b.x + b.w / 2, y: b.y + b.h / 2, text: 'Pırıl pırıl! Çöp bossu geri dönüşüm girdabında dağıldı. +100 puan' });
          }
        }
      }
      this.projectiles = this.projectiles.filter(p => p.life > 0);
      for (const ball of this.bossProjectiles) { ball.vy += ball.gravity * dt; ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.life -= dt; }
      this.bossProjectiles = this.bossProjectiles.filter(ball => ball.life > 0 && ball.y < 760 && ball.x + ball.r > b.arena.start - 100 && ball.x - ball.r < b.arena.end + 100);
    }
    jumpNow() {
      const p = this.p;
      if (p.grounded || this.coyote > 0) p.jumps = 0;
      if (p.jumps >= 2) return false;
      p.jumps += 1; p.vy = -PHYSICS.jump; p.grounded = false; p.supportId = null; this.coyote = 0; this.jumpBuffer = 0;
      this.emit('jump', { double: p.jumps === 2 }); return true;
    }
    step(seconds, input = {}) {
      const dt = clamp(Number(seconds) || 0, 0, 0.1);
      if (!dt || this.mode === 'complete') return;
      if (this.mode === 'delivering') {
        this.deliveryProgress = clamp(this.deliveryProgress + dt / 2.6, 0, 1);
        this.time += dt;
        this.invulnerable = Math.max(0, this.invulnerable - dt);
        if (this.deliveryProgress >= 1) this.complete();
        return;
      }
      if (input.jump) this.jumpBuffer = PHYSICS.buffer;
      // Small fixed substeps prevent tunnelling even on a slow browser frame.
      const slices = Math.ceil(dt / (1 / 120));
      for (let i = 0; i < slices; i++) this.tick(dt / slices, input);
    }
    tick(dt, input) {
      this.elapsed += dt; this.time += dt;
      const p = this.p;
      this.invulnerable = Math.max(0, this.invulnerable - dt);
      this.updateDynamics(dt);
      const carried = p.grounded && this.movingPlatforms.find(s => s.id === p.supportId);
      if (carried) { p.x += carried.dx; p.y += carried.dy; }
      const belt = p.grounded && this.staticSolids.find(s => s.id === p.supportId && s.type === 'conveyor');
      if (belt) p.x += belt.beltSpeed * dt;
      this.coyote = p.grounded ? PHYSICS.coyote : Math.max(0, this.coyote - dt);
      this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
      if (this.jumpBuffer > 0) this.jumpNow();
      const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      if (direction) { p.vx = clamp(p.vx + direction * (this.level.acceleration || PHYSICS.acceleration) * dt, -PHYSICS.speed, PHYSICS.speed); p.dir = direction; }
      else { const loss = (this.level.friction || PHYSICS.friction) * dt; p.vx = Math.sign(p.vx) * Math.max(0, Math.abs(p.vx) - loss); }
      p.x += p.vx * dt;
      p.x = clamp(p.x, 0, this.level.width - p.w);
      for (const s of this.solids) {
        // Raised platforms are one-way. Crates and ground edges are solid.
        if (oneWay(s) || s.hidden || !overlap(p, s)) continue;
        if (p.vx > 0) p.x = s.x - p.w;
        else if (p.vx < 0) p.x = s.x + s.w;
        p.vx = 0;
      }
      const oldBottom = p.y + p.h;
      p.vy = Math.min(PHYSICS.maxFall, p.vy + PHYSICS.gravity * dt);
      p.y += p.vy * dt;
      const wasGrounded = p.grounded;
      p.grounded = false; p.supportId = null;
      for (const s of this.solids) {
        if (s.hidden) continue;
        if (!(p.x + p.w > s.x + 0.001 && p.x < s.x + s.w - 0.001)) continue;
        if (p.vy >= 0 && oldBottom <= s.y + 0.1 && p.y + p.h >= s.y) {
          p.y = s.y - p.h; p.vy = 0; p.grounded = true; p.jumps = 0; p.supportId = s.id; this.coyote = PHYSICS.coyote;
        } else if (!oneWay(s) && p.vy < 0 && overlap(p, s)) {
          p.y = s.y + s.h; p.vy = 0;
        }
      }
      const spring = p.grounded && this.staticSolids.find(s => s.id === p.supportId && s.type === 'bounce');
      if (spring) { p.vy = -spring.power; p.grounded = false; p.supportId = null; p.jumps = 0; this.emit('bounce', { x: p.x + p.w / 2, y: p.y + p.h }); }
      for (const vent of this.vents) if (vent.active && overlap(p, vent)) { p.vy = Math.min(p.vy, -440); p.grounded = false; p.supportId = null; }
      if (!wasGrounded && p.grounded) this.emit('land');
      if (p.grounded) {
        for (const checkpoint of this.level.checkpoints) {
          if (checkpoint.x > this.checkpoint.x && p.x >= checkpoint.x && p.y >= 500 && p.x - checkpoint.x < 170) {
            this.checkpoint = { ...checkpoint };
            this.emit('checkpoint', { x: checkpoint.x, y: checkpoint.y, text: 'Güvenli nokta kaydedildi!' });
          }
        }
      }
      for (const pack of this.items) {
        if (pack.collected) continue;
        const nearestX = clamp(pack.x, p.x, p.x + p.w);
        const nearestY = clamp(pack.y, p.y, p.y + p.h);
        if ((pack.x - nearestX) ** 2 + (pack.y - nearestY) ** 2 <= 24 ** 2) {
          pack.collected = true; this.collected++; this.score = this.collected * 10;
          this.emit('collect', { x: pack.x, y: pack.y, kind: pack.type, count: this.collected, id: pack.id });
        }
      }
      this.updateBoss(dt, input);
      if (p.y > 900) this.respawn('fall');
      else if (this.invulnerable <= 0) {
        const hit = this.hazards.find(h => h.active && overlap(p, h));
        if (hit) this.respawn('hazard', hit.kind);
        else if (this.boss.active && !this.boss.defeated && (overlap(p, this.boss) || this.bossProjectiles.some(ball => circleHits(ball, p)))) this.respawn('boss', 'boss');
      }
    }
    respawn(reason = 'fall', kind = null) {
      this.penalty += 3; this.elapsed += 3; this.falls++;
      this.p.x = this.checkpoint.x; this.p.y = this.checkpoint.y;
      this.p.vx = 0; this.p.vy = 0; this.p.grounded = true; this.p.jumps = 0;
      this.p.supportId = this.level.solids.find(s => s.type === 'ground' && this.p.x >= s.x && this.p.x + this.p.w < s.x + s.w).id;
      this.invulnerable = 1.3;
      if (reason === 'hazard' || reason === 'boss') this.hits++;
      if (reason === 'boss') this.bossProjectiles = [];
      this.coyote = PHYSICS.coyote; this.jumpBuffer = 0;
      this.emit('fall', { penalty: 3, reason, kind, text: reason === 'boss' ? 'Köpüğün gücü sende! Temizlik ilerlemen korundu. +3 sn' : reason === 'hazard' ? (kind === 'barrier' ? 'Işığın ritmini izle, yeniden deneyebilirsin! +3 sn' : 'Temizlik robotuna yol ver, yeniden deneyebilirsin! +3 sn') : 'Yeniden dene, başarabilirsin! +3 sn' });
    }
    deliver() {
      if (this.mode !== 'playing' || !this.nearMachine) return false;
      if (this.collected < 8) { this.emit('needMore', { text: 'Biraz daha keşfet! En az 8 ambalaj gerekiyor.' }); return false; }
      if (!this.boss.defeated) { this.emit('bossRequired', { text: 'Önce çöp bossunu Döngü Köpüğüyle dağıt. F / Köpük düğmesini basılı tut!' }); return false; }
      this.mode = 'delivering'; this.deliveryProgress = 0; this.p.vx = 0; this.p.vy = 0;
      this.emit('delivery', { count: this.collected }); return true;
    }
    complete() {
      const count = this.collected;
      const stars = count === 12 ? 3 : count >= 10 ? 2 : 1;
      const base = count * 10;
      const timeBonus = Math.max(0, Math.floor(this.level.targetTime - this.elapsed)) * 5;
      const perfectBonus = count === 12 ? 100 : 0;
      const bossBonus = this.boss.defeated ? 100 : 0;
      this.result = { count, stars, base, timeBonus, perfectBonus, bossBonus, total: base + timeBonus + perfectBonus + bossBonus, time: this.elapsed, badge: count === 12, mistakes: this.falls, hits: this.hits };
      this.mode = 'complete'; this.deliveryProgress = 1;
      this.emit('complete', { result: this.result });
    }
  }
  return { Game, LEVELS, PHYSICS };
});
