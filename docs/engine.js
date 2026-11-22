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
      [[550, 414], [1660, 304], [2660, 299], [3690, 289]], [100, 1020, 2060, 3100, 4090])
  ];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  class Game {
    constructor(levelIndex = 0) { this.reset(levelIndex); }
    reset(levelIndex = this.levelIndex) {
      this.levelIndex = clamp(Math.floor(levelIndex) || 0, 0, LEVELS.length - 1);
      this.level = LEVELS[this.levelIndex];
      this.items = this.level.items.map(p => ({ ...p, collected: false }));
      this.p = { x: 100, y: 510, w: 58, h: 80, vx: 0, vy: 0, grounded: true, jumps: 0, dir: 1 };
      this.elapsed = 0; this.penalty = 0; this.collected = 0; this.score = 0;
      this.mode = 'playing'; this.deliveryProgress = 0; this.result = null;
      this.checkpoint = { ...this.level.checkpoints[0] };
      this.events = []; this.coyote = PHYSICS.coyote; this.jumpBuffer = 0;
      this.time = 0; this.falls = 0;
      return this;
    }
    get nearMachine() { return Math.abs(this.p.x + this.p.w / 2 - (this.level.machine.x + this.level.machine.w / 2)) < 170 && this.p.y + this.p.h > 480 && this.p.y < 640; }
    drainEvents() { const result = this.events; this.events = []; return result; }
    emit(type, extra) { this.events.push({ type, x: this.p.x + this.p.w / 2, y: this.p.y + this.p.h / 2, ...extra }); }
    jumpNow() {
      const p = this.p;
      if (p.grounded || this.coyote > 0) p.jumps = 0;
      if (p.jumps >= 2) return false;
      p.jumps += 1; p.vy = -PHYSICS.jump; p.grounded = false; this.coyote = 0; this.jumpBuffer = 0;
      this.emit('jump', { double: p.jumps === 2 }); return true;
    }
    step(seconds, input = {}) {
      const dt = clamp(Number(seconds) || 0, 0, 0.1);
      if (!dt || this.mode === 'complete') return;
      if (this.mode === 'delivering') {
        this.deliveryProgress = clamp(this.deliveryProgress + dt / 2.6, 0, 1);
        this.time += dt;
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
      this.coyote = p.grounded ? PHYSICS.coyote : Math.max(0, this.coyote - dt);
      this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
      if (this.jumpBuffer > 0) this.jumpNow();
      const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      if (direction) { p.vx = clamp(p.vx + direction * PHYSICS.acceleration * dt, -PHYSICS.speed, PHYSICS.speed); p.dir = direction; }
      else { const loss = PHYSICS.friction * dt; p.vx = Math.sign(p.vx) * Math.max(0, Math.abs(p.vx) - loss); }
      p.x += p.vx * dt;
      p.x = clamp(p.x, 0, this.level.width - p.w);
      for (const s of this.level.solids) {
        // Raised platforms are one-way. Crates and ground edges are solid.
        if (s.type === 'platform' || !overlap(p, s)) continue;
        if (p.vx > 0) p.x = s.x - p.w;
        else if (p.vx < 0) p.x = s.x + s.w;
        p.vx = 0;
      }
      const oldBottom = p.y + p.h;
      p.vy = Math.min(PHYSICS.maxFall, p.vy + PHYSICS.gravity * dt);
      p.y += p.vy * dt;
      const wasGrounded = p.grounded;
      p.grounded = false;
      for (const s of this.level.solids) {
        if (!(p.x + p.w > s.x + 0.001 && p.x < s.x + s.w - 0.001)) continue;
        if (p.vy >= 0 && oldBottom <= s.y + 0.1 && p.y + p.h >= s.y) {
          p.y = s.y - p.h; p.vy = 0; p.grounded = true; p.jumps = 0; this.coyote = PHYSICS.coyote;
        } else if (s.type !== 'platform' && p.vy < 0 && overlap(p, s)) {
          p.y = s.y + s.h; p.vy = 0;
        }
      }
      if (!wasGrounded && p.grounded) this.emit('land');
      if (p.grounded) {
        for (const checkpoint of this.level.checkpoints) {
          if (checkpoint.x > this.checkpoint.x && p.x >= checkpoint.x && p.y >= 500 && p.x - checkpoint.x < 170) this.checkpoint = { ...checkpoint };
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
      if (p.y > 900) this.respawn();
    }
    respawn() {
      this.penalty += 3; this.elapsed += 3; this.falls++;
      this.p.x = this.checkpoint.x; this.p.y = this.checkpoint.y;
      this.p.vx = 0; this.p.vy = 0; this.p.grounded = true; this.p.jumps = 0;
      this.coyote = PHYSICS.coyote; this.jumpBuffer = 0;
      this.emit('fall', { penalty: 3, text: 'Yeniden dene, başarabilirsin! +3 sn' });
    }
    deliver() {
      if (this.mode !== 'playing' || !this.nearMachine) return false;
      if (this.collected < 8) { this.emit('needMore', { text: 'Biraz daha keşfet! En az 8 ambalaj gerekiyor.' }); return false; }
      this.mode = 'delivering'; this.deliveryProgress = 0; this.p.vx = 0; this.p.vy = 0;
      this.emit('delivery', { count: this.collected }); return true;
    }
    complete() {
      const count = this.collected;
      const stars = count === 12 ? 3 : count >= 10 ? 2 : 1;
      const base = count * 10;
      const timeBonus = Math.max(0, Math.floor(this.level.targetTime - this.elapsed)) * 5;
      const perfectBonus = count === 12 ? 100 : 0;
      this.result = { count, stars, base, timeBonus, perfectBonus, total: base + timeBonus + perfectBonus, time: this.elapsed, badge: count === 12 };
      this.mode = 'complete'; this.deliveryProgress = 1;
      this.emit('complete', { result: this.result });
    }
  }
  return { Game, LEVELS, PHYSICS };
});
