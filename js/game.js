/* ============================================================
   BULUNGI ARCADE — three playable 8-bit games in one cabinet
   - Bulungi Blast : token catcher (choose your player)
   - Pixel Bowling : 5 racks, knock 'em down
   - Mini Golf     : 3 holes, slingshot putting
   All sprites are in-code pixel maps, all audio is synthesized.
   API: window.ArcadeCabinet.load('blast'|'bowl'|'golf')
   Events (bubbling from the canvas):
     "arcade:load"     {game, name}
     "arcade:gameover" {game, name, score, hiscore, isNew}
   ============================================================ */

(function () {
  const canvas = document.getElementById("blast-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const W = 360, H = 480;

  function fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
  fitCanvas();
  window.addEventListener("resize", fitCanvas);

  /* ---------- brand palette ---------- */
  const PAL = {
    bgTop: "#0c1440", bgBottom: "#1a2b6e",
    blue: "#1c60c8", blueDeep: "#14419e",
    cyan: "#33b8e1", cyanDark: "#1e93bc",
    yellow: "#fecc45", yellowDark: "#d9a81e",
    white: "#ffffff", ink: "#0a1030",
    red: "#ff3b3b", lime: "#3ee56b", orange: "#ff7a1a",
    skin: "#a06a3e", skinShade: "#7c4e28", hair: "#1c1410",
    green: "#2e9e5b", greenDark: "#1f7040",
  };

  /* ---------- pixel sprites ---------- */
  const SCALE = 3;

  const CHAR_COLORS = {
    k: PAL.hair, s: PAL.skin, e: PAL.ink, m: PAL.skinShade,
    b: PAL.blue, B: PAL.blueDeep, c: PAL.cyan, C: PAL.cyanDark,
    y: PAL.yellow, Y: PAL.yellow, p: PAL.blueDeep,
  };

  const SPRITES = {
    playerM: {
      colors: CHAR_COLORS,
      map: [
        "....kkkkkk....",
        "...kkkkkkkk...",
        "...kkkkkkkk...",
        "....ssssss....",
        "...ssessess...",
        "...ssssssss...",
        "....ssmmss....",
        "..bbbbbbbbbb..",
        ".bBBBBBBBBBBb.",
        ".bbbbbbbbbbbb.",
        "..ss......ss..",
        "..pp......pp..",
        ".kk........kk.",
      ],
    },
    playerF: {
      colors: CHAR_COLORS,
      map: [
        "..kkk....kkk..",
        ".kkkkk..kkkkk.",
        ".kYkkk..kkkYk.",
        "..kksssssskk..",
        "...ssessess...",
        "...ssssssss...",
        "....ssmmss....",
        "..cccccccccc..",
        ".cCCCCCCCCCCc.",
        ".cccccccccccc.",
        "..yyyyyyyyyy..",
        "..ss......ss..",
        ".kk........kk.",
      ],
    },
    coin: {
      colors: { y: PAL.yellowDark, Y: PAL.yellow, W: PAL.white },
      map: [
        "..yyyy..",
        ".yYYYYy.",
        "yYWyYYYy",
        "yYyYYYYy",
        "yYyYYYYy",
        "yYYyyYYy",
        ".yYYYYy.",
        "..yyyy..",
      ],
    },
    gift: {
      colors: { p: PAL.cyan, P: PAL.cyanDark, y: PAL.yellow },
      map: [
        "...pp..pp...",
        "..p..pp..p..",
        "ppppyyyyyppp",
        "pPPPyyyyyPPp",
        "pPPPyyyyyPPp",
        "yyyyyyyyyyyy",
        "pPPPyyyyyPPp",
        "pPPPyyyyyPPp",
        "pPPPyyyyyPPp",
        "pppppppppppp",
      ],
    },
    bomb: {
      colors: { f: PAL.orange, s: "#8a8a8a", k: PAL.ink, K: "#2a3566" },
      map: [
        ".....ff..",
        "....f....",
        "...ss....",
        "..kkkkk..",
        ".kkkKkkk.",
        "kkkKKkkkk",
        "kkkkkkkkk",
        "kkkkkkkkk",
        ".kkkkkkk.",
        "..kkkkk..",
      ],
    },
    star: {
      colors: { c: PAL.cyan, C: PAL.white },
      map: [
        "....c....",
        "...ccc...",
        "ccccCcccc",
        ".ccCCCcc.",
        "..cCCCc..",
        ".ccCcCcc.",
        ".cc...cc.",
        ".c.....c.",
      ],
    },
    heart: {
      colors: { h: PAL.red },
      map: [
        ".hh.hh.",
        "hhhhhhh",
        "hhhhhhh",
        ".hhhhh.",
        "..hhh..",
        "...h...",
      ],
    },
    pin: {
      colors: { w: PAL.white, r: PAL.red, s: "#c9d4f0" },
      map: [
        ".ww.",
        "wwww",
        "wrrw",
        "wwww",
        "wwww",
        "swws",
      ],
    },
    ballBowl: {
      colors: { b: PAL.blue, B: PAL.blueDeep, W: "#7fb2ff" },
      map: [
        ".bbbb.",
        "bWbbbb",
        "bbbbBb",
        "bbbBbb",
        "bBbbbb",
        ".bbbb.",
      ],
    },
    flag: {
      colors: { p: "#d9d9d9", y: PAL.yellow, Y: PAL.yellowDark },
      map: [
        "pyyyy",
        "pyyYY",
        "pyYY.",
        "p....",
        "p....",
        "p....",
      ],
    },
  };

  function drawSprite(spr, x, y, scale = SCALE) {
    const rows = spr.map;
    for (let j = 0; j < rows.length; j++) {
      for (let i = 0; i < rows[j].length; i++) {
        const ch = rows[j][i];
        if (ch === ".") continue;
        ctx.fillStyle = spr.colors[ch] || PAL.white;
        ctx.fillRect(x + i * scale, y + j * scale, scale, scale);
      }
    }
  }
  const sprW = (s, sc = SCALE) => s.map[0].length * sc;
  const sprH = (s, sc = SCALE) => s.map.length * sc;

  function pixelText(text, x, y, size, color, align = "center") {
    ctx.fillStyle = color;
    ctx.font = `${size}px "Press Start 2P", monospace`;
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    ctx.fillText(text, x, y);
  }

  /* ---------- audio ---------- */
  let audioCtx = null;
  let muted = false;
  function beep(freq, dur = 0.08, type = "square", vol = 0.12, slideTo) {
    if (muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch (e) { /* silent fallback */ }
  }
  const sfx = {
    coin: () => beep(880, 0.07, "square", 0.1, 1320),
    gift: () => { beep(660, 0.09); setTimeout(() => beep(990, 0.12), 70); },
    star: () => { beep(523, 0.08); setTimeout(() => beep(784, 0.08), 60); setTimeout(() => beep(1046, 0.14), 120); },
    bomb: () => beep(150, 0.3, "sawtooth", 0.16, 55),
    over: () => { beep(392, 0.15); setTimeout(() => beep(330, 0.15), 140); setTimeout(() => beep(262, 0.3), 280); },
    start: () => { beep(523, 0.07); setTimeout(() => beep(659, 0.07), 60); setTimeout(() => beep(784, 0.1), 120); },
    select: () => beep(740, 0.06, "square", 0.1),
    throw: () => beep(220, 0.15, "triangle", 0.14, 440),
    pin: () => beep(180 + Math.random() * 120, 0.06, "square", 0.12),
    putt: () => beep(500, 0.05, "triangle", 0.12),
    bounce: () => beep(300, 0.04, "square", 0.08),
    sink: () => { beep(523, 0.07); setTimeout(() => beep(659, 0.07), 70); setTimeout(() => beep(880, 0.16), 140); },
  };

  const muteBtn = document.getElementById("blast-mute");
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      muted = !muted;
      muteBtn.textContent = muted ? "🔇" : "🔊";
      muteBtn.setAttribute("aria-label", muted ? "Unmute game sounds" : "Mute game sounds");
    });
  }

  /* ---------- shared FX ---------- */
  let particles = [];
  let shake = 0;
  function burst(x, y, color, n = 10) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 160,
        vy: -Math.random() * 140 - 30,
        life: 0.5 + Math.random() * 0.3,
        color,
      });
    }
  }
  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.vy += 380 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }
  function renderParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life * 2);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
    }
    ctx.globalAlpha = 1;
  }

  const stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    s: Math.random() < 0.3 ? 3 : 2, tw: Math.random() * Math.PI * 2,
  }));
  function drawSpace(t, topCol = PAL.bgTop, botCol = PAL.bgBottom) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, topCol);
    grad.addColorStop(1, botCol);
    ctx.fillStyle = grad;
    ctx.fillRect(-10, -10, W + 20, H + 20);
    for (const s of stars) {
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t / 400 + s.tw);
      ctx.fillStyle = PAL.white;
      ctx.fillRect(s.x, s.y, s.s, s.s);
    }
    ctx.globalAlpha = 1;
  }

  function drawGameOver(t, score, hiscore, sub) {
    ctx.fillStyle = "rgba(6, 10, 34, 0.85)";
    ctx.fillRect(-10, -10, W + 20, H + 20);
    pixelText("GAME OVER", W / 2, 140, 22, PAL.cyan);
    pixelText("SCORE", W / 2, 200, 10, PAL.white);
    pixelText(`${score}`, W / 2, 220, 26, PAL.yellow);
    if (score >= hiscore && score > 0) {
      if (Math.floor(t / 400) % 2 === 0) pixelText("NEW HI SCORE!", W / 2, 262, 10, PAL.lime);
    } else {
      pixelText(`HI SCORE ${hiscore}`, W / 2, 262, 9, PAL.cyan);
    }
    if (sub) pixelText(sub, W / 2, 292, 8, PAL.white);
    if (Math.floor(t / 500) % 2 === 0) {
      pixelText("TAP TO PLAY AGAIN", W / 2, 340, 10, PAL.yellow);
    }
    pixelText("ENTER YOUR NAME BELOW!", W / 2, 372, 7, PAL.cyan);
  }

  /* ---------- cabinet core ---------- */
  const Games = {};
  let current = null;
  const keys = {};

  const Cabinet = {
    load(id) {
      const g = Games[id];
      if (!g) return;
      current = g;
      particles = [];
      shake = 0;
      g.reset();
      canvas.dispatchEvent(new CustomEvent("arcade:load", {
        detail: { game: id, name: g.name }, bubbles: true,
      }));
    },
    hiscoreKey: (id) => `bulungi-hiscore-${id}`,
    getHiscore(id) { return Number(localStorage.getItem(Cabinet.hiscoreKey(id)) || 0); },
    gameOver(id, score) {
      const g = Games[id];
      let hi = Cabinet.getHiscore(id);
      const isNew = score > hi;
      if (isNew) {
        hi = score;
        localStorage.setItem(Cabinet.hiscoreKey(id), String(score));
      }
      sfx.over();
      canvas.dispatchEvent(new CustomEvent("arcade:gameover", {
        detail: { game: id, name: g.name, score, hiscore: hi, isNew }, bubbles: true,
      }));
    },
  };
  window.ArcadeCabinet = { load: (id) => Cabinet.load(id) };

  /* ============================================================
     GAME 1 — BULUNGI BLAST
     ============================================================ */
  const Blast = {
    name: "Bulungi Blast",
    state: "title",
    charKey: "bulungi-character",
    char: localStorage.getItem("bulungi-character") || "m",
    score: 0, lives: 3, items: [], spawnTimer: 0, elapsed: 0, frenzy: 0,
    player: { x: W / 2, targetX: null },

    reset() {
      this.state = "title";
      this.score = 0; this.lives = 3; this.items = [];
      this.spawnTimer = 0; this.elapsed = 0; this.frenzy = 0;
      this.player.x = W / 2; this.player.targetX = null;
    },
    startRun() {
      this.state = "playing";
      this.score = 0; this.lives = 3; this.items = [];
      this.spawnTimer = 0; this.elapsed = 0; this.frenzy = 0;
      this.player.x = W / 2; this.player.targetX = null;
      localStorage.setItem(this.charKey, this.char);
      sfx.start();
    },
    sprite() { return this.char === "f" ? SPRITES.playerF : SPRITES.playerM; },

    spawnItem() {
      const r = Math.random();
      let type;
      if (this.elapsed < 8) type = r < 0.85 ? "coin" : "gift";
      else if (r < 0.68) type = "coin";
      else if (r < 0.79) type = "gift";
      else if (r < 0.95) type = "bomb";
      else type = "star";
      const spr = SPRITES[type];
      const w = sprW(spr);
      this.items.push({
        type, x: 10 + Math.random() * (W - w - 20), y: -30, w, h: sprH(spr),
        vy: 90 + Math.min(this.elapsed * 3.2, 160) + Math.random() * 40,
        wob: Math.random() * Math.PI * 2,
      });
    },

    update(dt) {
      if (this.state !== "playing") return;
      this.elapsed += dt;
      if (this.frenzy > 0) this.frenzy = Math.max(0, this.frenzy - dt);

      const p = this.player;
      const spr = this.sprite();
      const pw = sprW(spr), ph = sprH(spr);
      const kv = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0);
      if (kv !== 0) { p.targetX = null; p.x += kv * 260 * dt; }
      if (p.targetX != null) p.x += (p.targetX - p.x) * Math.min(1, dt * 14);
      p.x = Math.max(pw / 2, Math.min(W - pw / 2, p.x));

      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnItem();
        this.spawnTimer = Math.max(0.34, 0.95 - this.elapsed * 0.012);
      }

      const px = p.x - pw / 2, py = H - 24 - ph;
      for (let i = this.items.length - 1; i >= 0; i--) {
        const it = this.items[i];
        it.y += it.vy * dt;
        it.wob += dt * 5;
        if (it.y + it.h > py + 6 && it.y < py + ph && it.x + it.w > px + 3 && it.x < px + pw - 3) {
          this.items.splice(i, 1);
          const mult = this.frenzy > 0 ? 2 : 1;
          if (it.type === "coin") { this.score += 10 * mult; sfx.coin(); burst(it.x + it.w / 2, it.y, PAL.yellow, 8); }
          else if (it.type === "gift") { this.score += 50 * mult; sfx.gift(); burst(it.x + it.w / 2, it.y, PAL.cyan, 14); }
          else if (it.type === "star") { this.frenzy = 6; sfx.star(); burst(it.x + it.w / 2, it.y, PAL.white, 18); }
          else if (it.type === "bomb") {
            this.lives -= 1; shake = 10; sfx.bomb();
            burst(it.x + it.w / 2, it.y, PAL.orange, 20);
            if (this.lives <= 0) { this.state = "over"; Cabinet.gameOver("blast", this.score); return; }
          }
          continue;
        }
        if (it.y > H + 40) this.items.splice(i, 1);
      }
    },

    render(t) {
      if (this.frenzy > 0 && this.state === "playing") {
        const hue = (t / 8) % 360;
        drawSpace(t, `hsl(${hue}, 60%, 14%)`, `hsl(${(hue + 60) % 360}, 60%, 24%)`);
      } else {
        drawSpace(t);
      }
      ctx.fillStyle = PAL.ink;
      ctx.fillRect(-10, H - 18, W + 20, 18);
      ctx.fillStyle = PAL.blue;
      for (let x = 0; x < W + 20; x += 12) ctx.fillRect(x - 10, H - 18, 6, 4);

      const spr = this.sprite();
      const pw = sprW(spr), ph = sprH(spr);

      if (this.state === "title") {
        pixelText("BULUNGI", W / 2, 60, 26, PAL.cyan);
        pixelText("BLAST", W / 2, 94, 26, PAL.yellow);
        pixelText("CHOOSE YOUR PLAYER", W / 2, 150, 9, PAL.white);

        const boxW = 96, boxH = 96, gap = 28;
        const mx = W / 2 - boxW - gap / 2, fx = W / 2 + gap / 2, by = 180;
        for (const [bx, key, spr2, label] of [
          [mx, "m", SPRITES.playerM, "KATO"],
          [fx, "f", SPRITES.playerF, "NALA"],
        ]) {
          const sel = this.char === key;
          ctx.fillStyle = sel ? "rgba(51,184,225,0.25)" : "rgba(255,255,255,0.06)";
          ctx.fillRect(bx, by, boxW, boxH);
          ctx.lineWidth = 3;
          ctx.strokeStyle = sel ? PAL.cyan : "rgba(255,255,255,0.25)";
          ctx.strokeRect(bx + 1.5, by + 1.5, boxW - 3, boxH - 3);
          drawSprite(spr2, bx + (boxW - sprW(spr2, 4)) / 2, by + 10, 4);
          pixelText(label, bx + boxW / 2, by + boxH - 16, 8, sel ? PAL.yellow : PAL.white);
        }
        pixelText("TAP A PLAYER TO PICK", W / 2, 300, 8, PAL.white);
        if (Math.floor(t / 500) % 2 === 0) {
          pixelText("TAP AGAIN / SPACE TO GO!", W / 2, 330, 9, PAL.yellow);
        }
        pixelText(`HI SCORE ${Cabinet.getHiscore("blast")}`, W / 2, 380, 9, PAL.lime);
        drawSprite(spr, W / 2 - pw / 2, H - 24 - ph);
        return;
      }

      for (const it of this.items) {
        const wobX = it.type === "star" ? Math.sin(it.wob) * 6 : 0;
        drawSprite(SPRITES[it.type], it.x + wobX, it.y);
      }
      drawSprite(spr, this.player.x - pw / 2, H - 24 - ph);
      renderParticles();

      pixelText(`${this.score}`, 12, 14, 16, PAL.yellow, "left");
      pixelText(`HI ${Cabinet.getHiscore("blast")}`, 12, 38, 8, PAL.cyan, "left");
      for (let i = 0; i < this.lives; i++) drawSprite(SPRITES.heart, W - 26 - i * 26, 14);
      if (this.frenzy > 0) {
        pixelText("FRENZY x2!", W / 2, 14, 10, PAL.white);
        ctx.fillStyle = PAL.cyan;
        ctx.fillRect(W / 2 - 45, 30, 90 * (this.frenzy / 6), 5);
      }

      if (this.state === "over") drawGameOver(t, this.score, Cabinet.getHiscore("blast"));
    },

    pointer(type, x, y) {
      if (this.state === "title") {
        if (type !== "down") return;
        const boxW = 96, boxH = 96, gap = 28, by = 180;
        const mx = W / 2 - boxW - gap / 2, fx = W / 2 + gap / 2;
        if (y >= by && y <= by + boxH) {
          if (x >= mx && x <= mx + boxW) {
            if (this.char === "m") { this.startRun(); } else { this.char = "m"; sfx.select(); }
            return;
          }
          if (x >= fx && x <= fx + boxW) {
            if (this.char === "f") { this.startRun(); } else { this.char = "f"; sfx.select(); }
            return;
          }
        }
        this.startRun(); // tap anywhere else starts with current pick
        return;
      }
      if (this.state === "over") { if (type === "down") this.reset(); return; }
      if (type === "down" || type === "move") this.player.targetX = x;
    },

    keydown(key) {
      if (this.state === "title") {
        if (key === "ArrowLeft" || key === "a") { this.char = "m"; sfx.select(); }
        if (key === "ArrowRight" || key === "d") { this.char = "f"; sfx.select(); }
        if (key === " " || key === "Enter") this.startRun();
        return;
      }
      if (this.state === "over" && (key === " " || key === "Enter")) this.reset();
    },
  };
  Games.blast = Blast;

  /* ============================================================
     GAME 2 — PIXEL BOWLING
     ============================================================ */
  const LANE_L = 70, LANE_R = W - 70;
  const Bowl = {
    name: "Pixel Bowling",
    state: "title",
    score: 0, rack: 1, roll: 1, racks: 5,
    phase: "aim", aimX: W / 2, aimDir: 1,
    ball: null, pins: [], settleTimer: 0, msg: "", msgTimer: 0,
    knockedThisRack: 0,

    reset() {
      this.state = "title";
      this.score = 0; this.rack = 1; this.roll = 1;
      this.setupRack();
    },
    setupRack() {
      this.pins = [];
      const rows = [[0], [-1, 1], [-2, 0, 2], [-3, -1, 1, 3]];
      const px = W / 2, py = 150, dx = 26, dy = 24;
      rows.forEach((row, ri) => {
        row.forEach((off) => {
          this.pins.push({
            x: px + off * dx / 2 * 2, y: py - ri * dy,
            vx: 0, vy: 0, up: true, fade: 1,
          });
        });
      });
      this.phase = "aim";
      this.aimX = W / 2; this.aimDir = 1;
      this.ball = null;
      this.knockedThisRack = 0;
    },
    startRun() {
      this.state = "playing";
      this.score = 0; this.rack = 1; this.roll = 1;
      this.setupRack();
      sfx.start();
    },
    throwBall() {
      if (this.phase !== "aim") return;
      this.phase = "rolling";
      this.ball = { x: this.aimX, y: H - 60, vy: -520, vx: 0 };
      this.settleTimer = 0;
      sfx.throw();
    },

    update(dt) {
      if (this.state !== "playing") return;
      if (this.msgTimer > 0) this.msgTimer -= dt;

      if (this.phase === "aim") {
        this.aimX += this.aimDir * 190 * dt;
        if (this.aimX > LANE_R - 12) { this.aimX = LANE_R - 12; this.aimDir = -1; }
        if (this.aimX < LANE_L + 12) { this.aimX = LANE_L + 12; this.aimDir = 1; }
        const kv = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0);
        if (kv !== 0) this.aimX = Math.max(LANE_L + 12, Math.min(LANE_R - 12, this.aimX + kv * 220 * dt));
      }

      if (this.phase === "rolling") {
        const b = this.ball;
        b.x += b.vx * dt; b.y += b.vy * dt;

        for (const pin of this.pins) {
          if (!pin.up && Math.abs(pin.vx) < 5 && Math.abs(pin.vy) < 5) continue;
          const dx = pin.x - b.x, dy = pin.y - b.y;
          const d = Math.hypot(dx, dy);
          if (pin.up && d < 17) {
            pin.up = false;
            const push = 260 + Math.random() * 120;
            pin.vx = (dx / (d || 1)) * push + b.vx * 0.3;
            pin.vy = (dy / (d || 1)) * push - 80;
            b.vx += (-dx / (d || 1)) * 30;
            sfx.pin();
            burst(pin.x, pin.y, PAL.white, 6);
          }
        }
        // pin-pin chain reactions
        for (const a of this.pins) {
          if (a.up || (Math.abs(a.vx) < 20 && Math.abs(a.vy) < 20)) continue;
          for (const p2 of this.pins) {
            if (!p2.up) continue;
            const dx = p2.x - a.x, dy = p2.y - a.y;
            const d = Math.hypot(dx, dy);
            if (d < 16) {
              p2.up = false;
              p2.vx = (dx / (d || 1)) * Math.hypot(a.vx, a.vy) * 0.7;
              p2.vy = (dy / (d || 1)) * Math.hypot(a.vx, a.vy) * 0.7 - 40;
              a.vx *= 0.55; a.vy *= 0.55;
              sfx.pin();
            }
          }
        }
        for (const pin of this.pins) {
          if (pin.up) continue;
          pin.x += pin.vx * dt; pin.y += pin.vy * dt;
          pin.vx *= 1 - 1.8 * dt; pin.vy *= 1 - 1.8 * dt;
          pin.fade = Math.max(0, pin.fade - dt * 0.8);
        }
        if (b.y < 60) {
          this.phase = "settling";
          this.settleTimer = 1.0;
        }
      }

      if (this.phase === "settling") {
        for (const pin of this.pins) {
          if (pin.up) continue;
          pin.x += pin.vx * dt; pin.y += pin.vy * dt;
          pin.vx *= 1 - 2 * dt; pin.vy *= 1 - 2 * dt;
          pin.fade = Math.max(0, pin.fade - dt * 0.8);
        }
        this.settleTimer -= dt;
        if (this.settleTimer <= 0) this.resolveRoll();
      }
    },

    resolveRoll() {
      const standing = this.pins.filter((p) => p.up).length;
      const down = 10 - standing - this.knockedThisRack;
      this.score += down * 10;
      this.knockedThisRack += down;

      if (this.knockedThisRack === 10 && this.roll === 1) {
        this.score += 50;
        this.msg = "STRIKE! +50"; this.msgTimer = 1.4;
        sfx.star();
        this.nextRack();
        return;
      }
      if (this.knockedThisRack === 10 && this.roll === 2) {
        this.score += 25;
        this.msg = "SPARE! +25"; this.msgTimer = 1.4;
        sfx.gift();
        this.nextRack();
        return;
      }
      if (this.roll === 1) {
        this.roll = 2;
        this.pins = this.pins.filter((p) => p.up);
        this.phase = "aim"; this.ball = null;
      } else {
        this.nextRack();
      }
    },
    nextRack() {
      if (this.rack >= this.racks) {
        this.state = "over";
        Cabinet.gameOver("bowl", this.score);
        return;
      }
      this.rack += 1; this.roll = 1;
      this.knockedThisRack = 0;
      this.setupRack();
    },

    render(t) {
      drawSpace(t);
      // lane
      ctx.fillStyle = "#0a1030";
      ctx.fillRect(LANE_L - 26, 40, LANE_R - LANE_L + 52, H - 90);
      ctx.fillStyle = "#dce6fb";
      ctx.fillRect(LANE_L, 40, LANE_R - LANE_L, H - 90);
      ctx.fillStyle = "#c3d2f5";
      for (let y = 48; y < H - 60; y += 26) ctx.fillRect(LANE_L, y, LANE_R - LANE_L, 3);
      ctx.fillStyle = PAL.blueDeep;
      ctx.fillRect(LANE_L - 26, 40, 26, H - 90);
      ctx.fillRect(LANE_R, 40, 26, H - 90);

      if (this.state === "title") {
        ctx.fillStyle = "rgba(6, 10, 34, 0.72)";
        ctx.fillRect(-10, -10, W + 20, H + 20);
        drawSprite(SPRITES.ballBowl, W / 2 - 60, 120, 6);
        drawSprite(SPRITES.pin, W / 2 + 24, 112, 7);
        pixelText("PIXEL", W / 2, 210, 26, PAL.cyan);
        pixelText("BOWLING", W / 2, 244, 26, PAL.yellow);
        pixelText("5 racks. 2 rolls each.", W / 2, 296, 8, PAL.white);
        pixelText("strike = +50  spare = +25", W / 2, 314, 8, PAL.white);
        if (Math.floor(t / 500) % 2 === 0) pixelText("TAP OR SPACE TO START", W / 2, 350, 10, PAL.yellow);
        pixelText(`HI SCORE ${Cabinet.getHiscore("bowl")}`, W / 2, 390, 9, PAL.lime);
        return;
      }

      for (const pin of this.pins) {
        if (pin.fade <= 0) continue;
        ctx.globalAlpha = pin.up ? 1 : pin.fade;
        drawSprite(SPRITES.pin, pin.x - sprW(SPRITES.pin) / 2, pin.y - sprH(SPRITES.pin) / 2);
        ctx.globalAlpha = 1;
      }

      if (this.phase === "aim") {
        drawSprite(SPRITES.ballBowl, this.aimX - 9, H - 69);
        ctx.fillStyle = PAL.yellow;
        const ay = H - 84;
        ctx.fillRect(this.aimX - 1.5, ay - 26, 3, 22);
        ctx.fillRect(this.aimX - 7, ay - 12, 14, 3);
        if (Math.floor(t / 400) % 2 === 0) {
          pixelText("TAP TO ROLL", W / 2, H - 36, 9, PAL.white);
        }
      } else if (this.ball) {
        drawSprite(SPRITES.ballBowl, this.ball.x - 9, this.ball.y - 9);
      }

      renderParticles();

      pixelText(`${this.score}`, 12, 14, 16, PAL.yellow, "left");
      pixelText(`HI ${Cabinet.getHiscore("bowl")}`, 12, 38, 8, PAL.cyan, "left");
      pixelText(`RACK ${this.rack}/${this.racks}`, W - 12, 14, 9, PAL.white, "right");
      pixelText(`ROLL ${this.roll}`, W - 12, 32, 9, PAL.cyan, "right");
      if (this.msgTimer > 0) pixelText(this.msg, W / 2, 60, 14, PAL.yellow);

      if (this.state === "over") drawGameOver(t, this.score, Cabinet.getHiscore("bowl"));
    },

    pointer(type, x) {
      if (this.state === "title") { if (type === "down") this.startRun(); return; }
      if (this.state === "over") { if (type === "down") this.reset(); return; }
      if (type === "down") {
        if (this.phase === "aim") this.throwBall();
      }
    },
    keydown(key) {
      if (this.state === "title" && (key === " " || key === "Enter")) { this.startRun(); return; }
      if (this.state === "over" && (key === " " || key === "Enter")) { this.reset(); return; }
      if ((key === " " || key === "Enter") && this.phase === "aim") this.throwBall();
    },
  };
  Games.bowl = Bowl;

  /* ============================================================
     GAME 3 — MINI GOLF
     ============================================================ */
  const HOLES = [
    {
      par: 2,
      tee: { x: W / 2, y: 400 },
      hole: { x: W / 2, y: 110 },
      walls: [
        { x: 120, y: 220, w: 120, h: 18 },
      ],
    },
    {
      par: 3,
      tee: { x: 70, y: 410 },
      hole: { x: 290, y: 100 },
      walls: [
        { x: 0, y: 300, w: 240, h: 18 },
        { x: 140, y: 170, w: 220, h: 18 },
      ],
    },
    {
      par: 3,
      tee: { x: W / 2, y: 415 },
      hole: { x: W / 2, y: 90 },
      walls: [
        { x: 60, y: 320, w: 90, h: 18 },
        { x: 210, y: 320, w: 90, h: 18 },
      ],
      mover: { y: 200, w: 70, h: 18, cx: W / 2, range: 100, speed: 1.6 },
    },
  ];
  const STROKE_POINTS = [200, 120, 70, 40];

  const Golf = {
    name: "Mini Golf",
    state: "title",
    holeIdx: 0, strokes: 0, score: 0,
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    aiming: false, aimStart: null, aimNow: null,
    kbAngle: -Math.PI / 2, kbPower: 220,
    banner: "", bannerTimer: 0, sunk: false, sinkTimer: 0,
    moverX: 0,

    reset() {
      this.state = "title";
      this.score = 0; this.holeIdx = 0;
    },
    startRun() {
      this.state = "playing";
      this.score = 0;
      this.loadHole(0);
      sfx.start();
    },
    loadHole(i) {
      this.holeIdx = i;
      const h = HOLES[i];
      this.strokes = 0;
      this.ball = { x: h.tee.x, y: h.tee.y, vx: 0, vy: 0 };
      this.aiming = false; this.sunk = false;
      this.banner = `HOLE ${i + 1} - PAR ${h.par}`;
      this.bannerTimer = 1.6;
      this.kbAngle = -Math.PI / 2;
    },
    hole() { return HOLES[this.holeIdx]; },
    ballStopped() {
      return Math.hypot(this.ball.vx, this.ball.vy) < 8;
    },
    shoot(angle, power) {
      this.ball.vx = Math.cos(angle) * power;
      this.ball.vy = Math.sin(angle) * power;
      this.strokes += 1;
      sfx.putt();
    },
    wallsNow() {
      const h = this.hole();
      const walls = h.walls.slice();
      if (h.mover) {
        walls.push({ x: this.moverX - h.mover.w / 2, y: h.mover.y, w: h.mover.w, h: h.mover.h });
      }
      return walls;
    },

    update(dt, t) {
      if (this.state !== "playing") return;
      if (this.bannerTimer > 0) this.bannerTimer -= dt;
      const h = this.hole();
      if (h.mover) this.moverX = h.mover.cx + Math.sin((t / 1000) * h.mover.speed) * h.mover.range;

      if (this.sunk) {
        this.sinkTimer -= dt;
        if (this.sinkTimer <= 0) {
          if (this.holeIdx >= HOLES.length - 1) {
            this.state = "over";
            Cabinet.gameOver("golf", this.score);
          } else {
            this.loadHole(this.holeIdx + 1);
          }
        }
        return;
      }

      const b = this.ball;
      if (!this.ballStopped()) {
        const steps = 3; // sub-steps keep fast balls out of walls
        for (let s = 0; s < steps; s++) {
          b.x += (b.vx * dt) / steps;
          b.y += (b.vy * dt) / steps;
          if (b.x < 30) { b.x = 30; b.vx = Math.abs(b.vx) * 0.8; sfx.bounce(); }
          if (b.x > W - 30) { b.x = W - 30; b.vx = -Math.abs(b.vx) * 0.8; sfx.bounce(); }
          if (b.y < 50) { b.y = 50; b.vy = Math.abs(b.vy) * 0.8; sfx.bounce(); }
          if (b.y > H - 30) { b.y = H - 30; b.vy = -Math.abs(b.vy) * 0.8; sfx.bounce(); }
          for (const wl of this.wallsNow()) {
            if (b.x > wl.x - 5 && b.x < wl.x + wl.w + 5 && b.y > wl.y - 5 && b.y < wl.y + wl.h + 5) {
              const overL = b.x - (wl.x - 5), overR = (wl.x + wl.w + 5) - b.x;
              const overT = b.y - (wl.y - 5), overB = (wl.y + wl.h + 5) - b.y;
              const m = Math.min(overL, overR, overT, overB);
              if (m === overL) { b.x = wl.x - 5; b.vx = -Math.abs(b.vx) * 0.8; }
              else if (m === overR) { b.x = wl.x + wl.w + 5; b.vx = Math.abs(b.vx) * 0.8; }
              else if (m === overT) { b.y = wl.y - 5; b.vy = -Math.abs(b.vy) * 0.8; }
              else { b.y = wl.y + wl.h + 5; b.vy = Math.abs(b.vy) * 0.8; }
              sfx.bounce();
            }
          }
        }
        const fr = Math.max(0, 1 - 1.1 * dt);
        b.vx *= fr; b.vy *= fr;
        if (Math.hypot(b.vx, b.vy) < 8) { b.vx = 0; b.vy = 0; }

        const d = Math.hypot(b.x - h.hole.x, b.y - h.hole.y);
        if (d < 11 && Math.hypot(b.vx, b.vy) < 170) {
          this.sunk = true;
          this.sinkTimer = 1.4;
          const pts = STROKE_POINTS[Math.min(this.strokes - 1, STROKE_POINTS.length - 1)];
          this.score += pts;
          this.banner = this.strokes === 1 ? `HOLE IN ONE! +${pts}` : `IN! +${pts}`;
          this.bannerTimer = 1.4;
          burst(h.hole.x, h.hole.y, PAL.yellow, 18);
          sfx.sink();
        }
      }
    },

    render(t) {
      drawSpace(t);
      // green
      ctx.fillStyle = PAL.greenDark;
      ctx.fillRect(16, 36, W - 32, H - 60);
      ctx.fillStyle = PAL.green;
      ctx.fillRect(24, 44, W - 48, H - 76);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let y = 44; y < H - 32; y += 24) ctx.fillRect(24, y, W - 48, 12);

      if (this.state === "title") {
        ctx.fillStyle = "rgba(6, 10, 34, 0.72)";
        ctx.fillRect(-10, -10, W + 20, H + 20);
        drawSprite(SPRITES.flag, W / 2 - 12, 120, 8);
        pixelText("MINI", W / 2, 200, 26, PAL.cyan);
        pixelText("GOLF", W / 2, 234, 26, PAL.yellow);
        pixelText("drag back & release to putt", W / 2, 286, 8, PAL.white);
        pixelText("3 holes - fewer putts = more points", W / 2, 304, 7, PAL.white);
        if (Math.floor(t / 500) % 2 === 0) pixelText("TAP OR SPACE TO START", W / 2, 344, 10, PAL.yellow);
        pixelText(`HI SCORE ${Cabinet.getHiscore("golf")}`, W / 2, 384, 9, PAL.lime);
        return;
      }

      const h = this.hole();
      // walls with depth
      for (const wl of this.wallsNow()) {
        ctx.fillStyle = PAL.blueDeep;
        ctx.fillRect(wl.x, wl.y + 4, wl.w, wl.h);
        ctx.fillStyle = PAL.blue;
        ctx.fillRect(wl.x, wl.y, wl.w, wl.h - 4);
        ctx.fillStyle = "#5f92e8";
        ctx.fillRect(wl.x, wl.y, wl.w, 4);
      }
      // hole + flag
      ctx.fillStyle = PAL.ink;
      ctx.beginPath();
      ctx.ellipse(h.hole.x, h.hole.y, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      drawSprite(SPRITES.flag, h.hole.x + 2, h.hole.y - 40, 4);

      // ball
      if (!this.sunk) {
        ctx.fillStyle = PAL.white;
        ctx.fillRect(this.ball.x - 4, this.ball.y - 4, 8, 8);
        ctx.fillStyle = "#c9d4f0";
        ctx.fillRect(this.ball.x, this.ball.y, 4, 4);
      }

      // aim indicators
      if (this.state === "playing" && !this.sunk && this.ballStopped()) {
        let angle = this.kbAngle, power = this.kbPower, show = false;
        if (this.aiming && this.aimStart && this.aimNow) {
          const dx = this.aimStart.x - this.aimNow.x;
          const dy = this.aimStart.y - this.aimNow.y;
          if (Math.hypot(dx, dy) > 8) {
            angle = Math.atan2(dy, dx);
            power = Math.min(Math.hypot(dx, dy) * 2.4, 460);
            show = true;
          }
        } else if (keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp || keys.ArrowDown || keys[" "]) {
          show = true;
        }
        if (show || !this.aiming) {
          const len = 18 + (power / 460) * 52;
          ctx.strokeStyle = PAL.yellow;
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 5]);
          ctx.beginPath();
          ctx.moveTo(this.ball.x, this.ball.y);
          ctx.lineTo(this.ball.x + Math.cos(angle) * len, this.ball.y + Math.sin(angle) * len);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      renderParticles();

      pixelText(`${this.score}`, 12, 10, 16, PAL.yellow, "left");
      pixelText(`HI ${Cabinet.getHiscore("golf")}`, 12, 34, 8, PAL.cyan, "left");
      pixelText(`HOLE ${this.holeIdx + 1}/3`, W - 12, 10, 9, PAL.white, "right");
      pixelText(`PUTTS ${this.strokes}`, W - 12, 28, 9, PAL.cyan, "right");
      if (this.bannerTimer > 0) pixelText(this.banner, W / 2, 60, 12, PAL.yellow);

      if (this.state === "over") drawGameOver(t, this.score, Cabinet.getHiscore("golf"));
    },

    pointer(type, x, y) {
      if (this.state === "title") { if (type === "down") this.startRun(); return; }
      if (this.state === "over") { if (type === "down") this.reset(); return; }
      if (this.sunk) return;
      if (type === "down" && this.ballStopped()) {
        this.aiming = true;
        this.aimStart = { x, y };
        this.aimNow = { x, y };
      } else if (type === "move" && this.aiming) {
        this.aimNow = { x, y };
      } else if (type === "up" && this.aiming) {
        this.aiming = false;
        const dx = this.aimStart.x - this.aimNow.x;
        const dy = this.aimStart.y - this.aimNow.y;
        if (Math.hypot(dx, dy) > 8) {
          this.shoot(Math.atan2(dy, dx), Math.min(Math.hypot(dx, dy) * 2.4, 460));
        }
        this.aimStart = this.aimNow = null;
      }
    },
    keydown(key) {
      if (this.state === "title" && (key === " " || key === "Enter")) { this.startRun(); return; }
      if (this.state === "over" && (key === " " || key === "Enter")) { this.reset(); return; }
      if (!this.ballStopped() || this.sunk) return;
      if (key === "ArrowLeft" || key === "a") this.kbAngle -= 0.15;
      if (key === "ArrowRight" || key === "d") this.kbAngle += 0.15;
      if (key === "ArrowUp" || key === "w") this.kbPower = Math.min(460, this.kbPower + 30);
      if (key === "ArrowDown" || key === "s") this.kbPower = Math.max(80, this.kbPower - 30);
      if (key === " " || key === "Enter") this.shoot(this.kbAngle, this.kbPower);
    },
  };
  Games.golf = Golf;

  /* ---------- input routing ---------- */
  function canvasPos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  }
  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    const p = canvasPos(e);
    current && current.pointer("down", p.x, p.y);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!current) return;
    if (e.buttons > 0 || e.pointerType === "touch") {
      const p = canvasPos(e);
      current.pointer("move", p.x, p.y);
    }
  });
  canvas.addEventListener("pointerup", (e) => {
    const p = canvasPos(e);
    current && current.pointer("up", p.x, p.y);
  });

  window.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    keys[k] = true;
    if (!current) return;
    // Only steal keys when the cabinet is on screen and no form field is focused
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const r = canvas.getBoundingClientRect();
    const visible = r.top < window.innerHeight && r.bottom > 0;
    if (!visible) return;
    if ([" ", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
    current.keydown(k, e);
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    keys[k] = false;
  });

  /* ---------- main loop ---------- */
  let lastTime = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) lastTime = 0;
  });
  function loop(t) {
    if (!lastTime) lastTime = t;
    const dt = Math.min((t - lastTime) / 1000, 0.05);
    lastTime = t;
    if (shake > 0) shake = Math.max(0, shake - dt * 40);
    updateParticles(dt);
    if (current) {
      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      current.update(dt, t);
      current.render(t);
      ctx.restore();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  Cabinet.load("blast");
})();
