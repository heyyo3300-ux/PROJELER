(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RVMProgress = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const KEY = 'rvm-doa-progress-v1';
  const COLORS = Object.freeze([
    Object.freeze({ id: 'mint', name: 'RVM yeşili', color: '#009c83', unlockAfter: -1 }),
    Object.freeze({ id: 'ocean', name: 'Okyanus mavisi', color: '#3a9bc4', unlockAfter: 0 }),
    Object.freeze({ id: 'sunset', name: 'Gün batımı', color: '#ed9970', unlockAfter: 1 })
  ]);
  const defaults = () => ({ version: 1, unlocked: 1, color: 'mint', sound: true, results: [null, null, null] });
  const number = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
  const integer = (value, min, max) => number(value, min, max) && Number.isInteger(value);
  const starsFor = count => count === 12 ? 3 : count >= 10 ? 2 : 1;
  function storedResult(value) {
    if (!value || typeof value !== 'object' || !number(value.bestTime, 0, 86400) || !integer(value.highScore, 0, 100000) || !integer(value.count, 8, 12)) return null;
    return {
      bestTime: value.bestTime,
      highScore: value.highScore,
      stars: integer(value.stars, 1, 3) ? Math.max(value.stars, starsFor(value.count)) : starsFor(value.count),
      badge: value.badge === true || value.count === 12,
      count: value.count
    };
  }
  function normalize(value) {
    const data = defaults();
    if (!value || typeof value !== 'object' || value.version !== 1) return data;
    if (Array.isArray(value.results)) {
      for (let i = 0; i < 3; i++) data.results[i] = storedResult(value.results[i]);
    }
    // A later result cannot open a course without the previous one being finished.
    if (!data.results[0]) { data.results[1] = null; data.results[2] = null; }
    else if (!data.results[1]) data.results[2] = null;
    data.unlocked = data.results[0] ? (data.results[1] ? 3 : 2) : 1;
    if (typeof value.sound === 'boolean') data.sound = value.sound;
    const selected = COLORS.find(c => c.id === value.color);
    if (selected && (selected.unlockAfter < 0 || data.results[selected.unlockAfter])) data.color = selected.id;
    return data;
  }
  function create(storage) {
    const store = {
      data: defaults(),
      available: true,
      save() {
        if (!store.available) return false;
        try { storage.setItem(KEY, JSON.stringify(store.data)); return true; }
        catch (_) { store.available = false; return false; }
      },
      record(levelIndex, result) {
        const none = { newBest: false, unlockedLevel: false, unlockedColor: null };
        if (!integer(levelIndex, 0, 2) || levelIndex >= store.data.unlocked || !result || !number(result.time, 0, 86400) || !integer(result.total, 0, 100000) || !integer(result.count, 8, 12)) return none;
        const previous = store.data.results[levelIndex];
        const newBest = !previous || result.time < previous.bestTime;
        const stars = starsFor(result.count);
        const score = {
          bestTime: previous ? Math.min(previous.bestTime, result.time) : result.time,
          highScore: previous ? Math.max(previous.highScore, result.total) : result.total,
          stars: previous ? Math.max(previous.stars, stars) : stars,
          badge: Boolean((previous && previous.badge) || result.count === 12),
          count: previous ? Math.max(previous.count, result.count) : result.count
        };
        store.data.results[levelIndex] = score;
        const previousUnlocked = store.data.unlocked;
        store.data.unlocked = Math.max(store.data.unlocked, Math.min(3, levelIndex + 2));
        const color = COLORS.find(c => c.unlockAfter === levelIndex);
        const unlockedColor = color && !previous ? color.id : null;
        store.save();
        return { newBest, unlockedLevel: store.data.unlocked > previousUnlocked, unlockedColor };
      },
      setColor(id) {
        const color = COLORS.find(c => c.id === id);
        if (!color || (color.unlockAfter >= 0 && !store.data.results[color.unlockAfter])) return false;
        store.data.color = id; store.save(); return true;
      },
      setSound(enabled) {
        if (typeof enabled !== 'boolean') return false;
        store.data.sound = enabled; store.save(); return true;
      }
    };
    try {
      if (arguments.length === 0) storage = globalThis.localStorage;
      if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') throw new Error('Storage unavailable');
      const raw = storage.getItem(KEY);
      if (raw) {
        try { store.data = normalize(JSON.parse(raw)); }
        catch (_) { store.data = defaults(); }
      }
      // Probe writes too: some private browser contexts permit reading only.
      store.save();
    } catch (_) { store.available = false; }
    return store;
  }
  return { KEY, COLORS, create };
});
