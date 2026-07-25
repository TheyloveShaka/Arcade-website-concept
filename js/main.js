/* ============================================================
   BULUNGI TOWN — main.js
   Renders all data-driven sections from js/data.js, paints
   decorative pixel sprites, wires WhatsApp links, renders the
   game picker cards, and runs the local leaderboard.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- decorative pixel sprites (brand palette) ---------- */
  const C = {
    blue: "#1c60c8", blueDeep: "#14419e", blueLight: "#5f92e8",
    cyan: "#33b8e1", cyanDark: "#1e93bc", cyanLight: "#7fd4f0",
    yellow: "#fecc45", yellowDark: "#d9a81e",
    lime: "#3ee56b", limeD: "#1fae4d",
    ink: "#0a1030", white: "#ffffff",
    red: "#ff3b3b", skin: "#a06a3e", hair: "#1c1410", green: "#2e9e5b",
  };

  const DECOR = {
    coin: {
      colors: { y: C.yellowDark, Y: C.yellow, W: C.white },
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
    invader: {
      colors: { g: C.yellow, W: C.white },
      map: [
        "..g.....g..",
        "...g...g...",
        "..ggggggg..",
        ".gg.ggg.gg.",
        "ggggggggggg",
        "g.ggggggg.g",
        "g.g.....g.g",
        "...gg.gg...",
      ],
    },
    ghost: {
      colors: { p: C.cyan, W: C.white, b: C.ink },
      map: [
        "..pppppp..",
        ".pppppppp.",
        "pppppppppp",
        "pWWppppWWp",
        "pWbppppWbp",
        "pppppppppp",
        "pppppppppp",
        "pppppppppp",
        "p.pp.pp.pp",
      ],
    },
    star: {
      colors: { c: C.cyan, W: C.white },
      map: [
        "....c....",
        "...ccc...",
        "ccccWcccc",
        ".cccWccc.",
        "..cWWWc..",
        ".ccWcWcc.",
        ".cc...cc.",
      ],
    },
    cherry: {
      colors: { g: C.limeD, r: C.red, W: C.white },
      map: [
        "....gg...",
        "...g..g..",
        "..g....g.",
        ".rr...rr.",
        "rrrr.rrrr",
        "rWrr.rWrr",
        ".rr...rr.",
      ],
    },
    cake: {
      colors: { f: "#ff7a1a", c: C.cyan, C: C.cyanDark, w: C.white, y: C.yellow },
      map: [
        "....f....",
        "....y....",
        "..wwwww..",
        ".ccccccc.",
        ".cCcCcCc.",
        "ccccccccc",
        "ccccccccc",
        "CCCCCCCCC",
      ],
    },
    joystick: {
      colors: { r: C.red, s: "#666", k: C.ink, y: C.yellow },
      map: [
        "...rr...",
        "..rrrr..",
        "...ss...",
        "...ss...",
        ".kkkkkk.",
        "kkkkkkkk",
        "kykkkkyk",
        "kkkkkkkk",
      ],
    },
    slide: {
      colors: { c: C.cyan, y: C.yellow },
      map: [
        "cc......",
        "ccc.....",
        ".ccc....",
        "..ccc...",
        "...ccc..",
        "y...ccc.",
        "y....ccc",
        "yyyyyyyy",
      ],
    },
    coffee: {
      colors: { s: C.cyanLight, w: C.white, W: "#dbe6ff", b: C.blue },
      map: [
        "..s..s..",
        ".s..s...",
        "..s..s..",
        "wwwwwww.",
        "wWWWWWww",
        "wWWWWWww",
        ".wwwww..",
        "bbbbbbbb",
      ],
    },
    bowling: {
      colors: { b: C.blue, B: C.blueDeep, W: "#7fb2ff", w: C.white, r: C.red },
      map: [
        "......ww.",
        ".bbb.wwww",
        "bWbbbwrrw",
        "bbbBbwwww",
        "bbBbbwwww",
        ".bbb..ww.",
      ],
    },
    golf: {
      colors: { p: "#d9d9d9", y: C.yellow, g: C.green, w: C.white },
      map: [
        "..pyyyy..",
        "..pyyy...",
        "..py.....",
        "..p......",
        "..p...w..",
        "gggggggg.",
        ".gggggg..",
      ],
    },
    playerM: {
      colors: {
        k: C.hair, s: C.skin, e: C.ink, m: "#7c4e28",
        b: C.blue, B: C.blueDeep, p: C.blueDeep,
      },
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
  };

  function paintSprites() {
    document.querySelectorAll("canvas.pixel-sprite").forEach((cv) => {
      const spr = DECOR[cv.dataset.sprite];
      if (!spr || cv.dataset.painted) return;
      cv.dataset.painted = "1";
      const scale = Number(cv.dataset.scale || 3);
      const w = spr.map[0].length;
      const h = spr.map.length;
      cv.width = w * scale;
      cv.height = h * scale;
      cv.style.width = cv.width + "px";
      cv.style.height = cv.height + "px";
      const ctx = cv.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < spr.map[j].length; i++) {
          const ch = spr.map[j][i];
          if (ch === ".") continue;
          ctx.fillStyle = spr.colors[ch] || C.white;
          ctx.fillRect(i * scale, j * scale, scale, scale);
        }
      }
    });
  }

  /* ---------- WhatsApp links ---------- */
  function waLink(context) {
    const msg = `${SITE.whatsappGreeting} ${context}`;
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
  function wireWhatsApp() {
    document.querySelectorAll("a[data-wa]").forEach((a) => {
      a.href = waLink(a.dataset.wa || "General enquiry");
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ---------- ticker ---------- */
  function buildTicker() {
    const track = document.getElementById("ticker-track");
    if (!track) return;
    const seq = SITE.ticker
      .map((t) => `<span>${t}</span><span class="tick-star">★</span>`)
      .join("");
    track.innerHTML = seq + seq;
  }

  /* ---------- section renderers ---------- */
  const $ = (id) => document.getElementById(id);

  /* ---------- drop-in media slots ----------
     Tries assets/<base>.mp4 (muted loop), then .jpg/.png/.webp/.jpeg.
     The container stays hidden until something actually loads, so the
     site looks intentional with zero assets present.               */
  function fillMedia(container, base, onFound) {
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");
    video.src = `assets/${base}.mp4`;
    video.addEventListener("loadeddata", () => {
      container.appendChild(video);
      container.hidden = false;
      video.play().catch(() => {});
      if (onFound) onFound("video");
    });
    video.addEventListener("error", () => tryImages(["jpg", "png", "webp", "jpeg"]));

    function tryImages(exts) {
      if (!exts.length) return;
      const img = new Image();
      img.alt = "";
      img.src = `assets/${base}.${exts[0]}`;
      img.onload = () => {
        container.appendChild(img);
        container.hidden = false;
        if (onFound) onFound("image");
      };
      img.onerror = () => tryImages(exts.slice(1));
    }
  }

  function fillCardMedia(gridEl) {
    gridEl.querySelectorAll(".card-media[data-media]").forEach((el) =>
      fillMedia(el, el.dataset.media)
    );
  }

  function renderHero() {
    $("hero-badge").textContent = SITE.heroBadge;
    $("hero-tagline").textContent = SITE.tagline.toUpperCase();
  }

  function renderAttractions() {
    $("attractions-grid").innerHTML = SITE.attractions
      .map(
        (a) => `
        <div class="card reveal">
          <div class="card-media" data-media="${a.media}" hidden></div>
          <canvas class="pixel-sprite" data-sprite="${a.icon}" data-scale="5" aria-hidden="true"></canvas>
          <h3>${a.name}</h3>
          <p>${a.blurb}</p>
        </div>`
      )
      .join("");
    fillCardMedia($("attractions-grid"));
  }

  function renderDeals() {
    $("deals-row").innerHTML = SITE.deals
      .map(
        (d) => `
        <div class="deal reveal">
          <span class="deal-day">${d.day}</span>
          <div><h3>${d.name}</h3><p>${d.blurb}</p></div>
        </div>`
      )
      .join("");
  }

  function renderPricing() {
    $("pricing-grid").innerHTML = SITE.pricing
      .map(
        (p) => `
        <div class="price-card reveal${p.featured ? " featured" : ""}">
          ${p.badge ? `<span class="price-badge">${p.badge}</span>` : ""}
          <h3>${p.name}</h3>
          <span class="price-amount">${p.price}</span>
          <span class="price-credits">${p.credits}</span>
          <ul class="price-perks">${p.perks.map((k) => `<li>${k}</li>`).join("")}</ul>
          <a class="btn btn-whatsapp" data-wa="I want the ${p.name} (${p.price})" href="#">
            <span class="wa-icon" aria-hidden="true"></span> Get This Card
          </a>
        </div>`
      )
      .join("");
  }

  function renderParties() {
    $("parties-grid").innerHTML = SITE.parties
      .map(
        (p) => `
        <div class="card reveal">
          <div class="card-media" data-media="${p.media}" hidden></div>
          <h3>${p.name}</h3>
          <p>${p.blurb}</p>
          <span class="card-from">${p.from}</span>
        </div>`
      )
      .join("");
    fillCardMedia($("parties-grid"));
  }

  function renderQuotes() {
    $("quotes-row").innerHTML = SITE.testimonials
      .map(
        (q) => `
        <div class="quote reveal">
          <div class="quote-stars" aria-hidden="true">★★★★★</div>
          <p>“${q.quote}”</p>
          <div class="quote-name">${q.name}</div>
          <div class="quote-tag">${q.tag}</div>
        </div>`
      )
      .join("");
  }

  function renderVisit() {
    $("visit-where").textContent = `${SITE.brandName}, ${SITE.location.mall} — ${SITE.location.area}`;
    $("visit-maps").href = SITE.location.mapsUrl;
    $("hours-list").innerHTML = SITE.hours
      .map((h) => `<li><b>${h.days}</b><span>${h.time}</span></li>`)
      .join("");
  }

  function renderFooter() {
    $("footer-socials").innerHTML = Object.entries(SITE.socials)
      .map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name.toUpperCase()}</a>`)
      .join("");
    $("year").textContent = new Date().getFullYear();
  }

  /* ---------- game cards ---------- */
  function gameHiscore(id) {
    return Number(localStorage.getItem(`bulungi-hiscore-${id}`) || 0);
  }

  function renderGameCards() {
    $("game-cards").innerHTML = SITE.games
      .map(
        (g) => `
        <div class="game-card reveal" data-game="${g.id}">
          <canvas class="pixel-sprite" data-sprite="${g.icon}" data-scale="5" aria-hidden="true"></canvas>
          <h3>${g.name}</h3>
          <p>${g.tag}</p>
          <span class="gc-hi" data-hi="${g.id}">HI SCORE ${gameHiscore(g.id)}</span>
          <div class="gc-buttons">
            <button class="btn btn-yellow gc-play" data-game="${g.id}">▶ Play</button>
            <button class="btn btn-ghost-light gc-scores" data-game="${g.id}">Top 5</button>
          </div>
        </div>`
      )
      .join("");

    document.querySelectorAll(".gc-play").forEach((b) =>
      b.addEventListener("click", () => {
        window.ArcadeCabinet && window.ArcadeCabinet.load(b.dataset.game);
        $("cabinet").scrollIntoView({ behavior: "smooth", block: "center" });
      })
    );
    document.querySelectorAll(".gc-scores").forEach((b) =>
      b.addEventListener("click", () => {
        Leaderboard.setTab(b.dataset.game);
        $("leaderboard").scrollIntoView({ behavior: "smooth", block: "center" });
      })
    );
  }

  function refreshHiscores() {
    document.querySelectorAll("[data-hi]").forEach((el) => {
      el.textContent = `HI SCORE ${gameHiscore(el.dataset.hi)}`;
    });
  }

  /* ---------- leaderboard ---------- */
  const Leaderboard = {
    KEY: "bulungi-leaderboard",
    NAME_KEY: "bulungi-player-name",
    tab: "blast",
    expanded: false,
    lastSaved: null, // {game, ts}

    data() {
      try {
        const d = JSON.parse(localStorage.getItem(this.KEY)) || {};
        SITE.games.forEach((g) => { if (!Array.isArray(d[g.id])) d[g.id] = []; });
        return d;
      } catch (e) {
        return Object.fromEntries(SITE.games.map((g) => [g.id, []]));
      }
    },
    save(game, name, score) {
      const d = this.data();
      const entry = { name, score, ts: Date.now() };
      d[game].push(entry);
      d[game].sort((a, b) => b.score - a.score);
      d[game] = d[game].slice(0, 50);
      localStorage.setItem(this.KEY, JSON.stringify(d));
      localStorage.setItem(this.NAME_KEY, name);
      this.lastSaved = { game, ts: entry.ts };
      this.setTab(game);
    },
    setTab(game) {
      this.tab = game;
      this.expanded = false;
      this.render();
    },
    tabLabel(g) {
      const words = g.name.split(" ");
      return words[words.length - 1].toUpperCase();
    },
    render() {
      const tabs = $("lb-tabs");
      tabs.innerHTML = SITE.games
        .map(
          (g) => `<button class="lb-tab${g.id === this.tab ? " active" : ""}"
                    role="tab" aria-selected="${g.id === this.tab}"
                    data-game="${g.id}">${this.tabLabel(g)}</button>`
        )
        .join("");
      tabs.querySelectorAll(".lb-tab").forEach((b) =>
        b.addEventListener("click", () => this.setTab(b.dataset.game))
      );

      const rows = this.data()[this.tab];
      const list = $("lb-list");
      const empty = $("lb-empty");
      const toggle = $("lb-toggle");
      const shown = this.expanded ? rows : rows.slice(0, 5);

      list.innerHTML = shown
        .map((r, i) => {
          const isYou = this.lastSaved && this.lastSaved.game === this.tab && this.lastSaved.ts === r.ts;
          return `<li class="lb-row rank-${i + 1}${isYou ? " lb-you" : ""}">
            <span class="lb-rank">${i + 1}.</span>
            <span class="lb-name">${r.name}</span>
            <span class="lb-score">${r.score}</span>
          </li>`;
        })
        .join("");

      empty.hidden = rows.length > 0;
      toggle.hidden = rows.length <= 5;
      toggle.textContent = this.expanded ? "Show Top 5" : `Show All (${rows.length})`;
    },
    init() {
      $("lb-toggle").addEventListener("click", () => {
        this.expanded = !this.expanded;
        this.render();
      });
      this.render();
    },
  };

  /* ---------- hero media: promo video, else poster photo ---------- */
  function initVideo() {
    const video = $("promo-video");
    const placeholder = $("promo-placeholder");
    if (!video) return;

    // Poster photo (assets/hero.jpg/.png/.webp) upgrades the placeholder
    if (MEDIA.heroPoster) {
      const posterBox = document.createElement("div");
      posterBox.className = "hero-poster";
      posterBox.hidden = true;
      placeholder.prepend(posterBox);
      fillMedia(posterBox, MEDIA.heroPoster, () => {
        placeholder.classList.add("has-poster");
      });
    }

    // Real promo video wins over everything; try each source until one loads
    const sources = [].concat(MEDIA.promoVideo || []);
    let si = 0;
    function tryNextSource() {
      if (si >= sources.length) return; // none loaded — poster/placeholder stays
      video.src = sources[si++];
    }
    video.addEventListener("loadeddata", () => {
      video.hidden = false;
      placeholder.hidden = true;
      video.play().catch(() => {});
    });
    video.addEventListener("error", tryNextSource);
    tryNextSource();
  }

  /* ---------- nav burger ---------- */
  function initNav() {
    const burger = $("nav-burger");
    const links = $("nav-links");
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- arcade events (from js/game.js) ---------- */
  let pendingScore = null; // {game, name, score}

  function initArcadeHooks() {
    $("game-hook").textContent = SITE.gameReward.offer;

    document.addEventListener("arcade:load", (e) => {
      $("cabinet-game-name").textContent = e.detail.name.toUpperCase();
      $("game-reward").hidden = true;
      pendingScore = null;
    });

    document.addEventListener("arcade:gameover", (e) => {
      const { game, name, score, isNew } = e.detail;
      const meta = SITE.games.find((g) => g.id === game);
      const box = $("game-reward");
      const title = $("game-reward-title");
      const text = $("game-reward-text");
      const share = $("game-share");
      const form = $("lb-entry");
      const input = $("lb-name");

      box.hidden = false;
      pendingScore = { game, score };

      const threshold = meta ? meta.rewardThreshold : Infinity;
      if (score >= threshold) {
        title.textContent = isNew ? "NEW HI SCORE — REWARD UNLOCKED!" : "REWARD UNLOCKED!";
        text.textContent = SITE.gameReward.offer;
      } else {
        title.textContent = isNew ? "NEW HI SCORE!" : "NICE TRY!";
        text.textContent = `Score ${threshold}+ in ${name} to unlock a real reward at the counter. One more go?`;
      }

      form.hidden = false;
      form.querySelector("button").disabled = false;
      form.querySelector("button").textContent = "Save Score";
      input.value = localStorage.getItem(Leaderboard.NAME_KEY) || "";

      const brag = `I just scored ${score} in ${name.toUpperCase()} 🕹️🔥 Think you can beat me? Play on the Bulungi Town site, then come battle me at ${SITE.location.mall}!`;
      share.href = `https://wa.me/?text=${encodeURIComponent(brag)}`;
      share.target = "_blank";
      share.rel = "noopener";

      refreshHiscores();
    });

    $("lb-entry").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!pendingScore) return;
      const input = $("lb-name");
      const name = (input.value || "PLAYER").trim().toUpperCase().slice(0, 12) || "PLAYER";
      Leaderboard.save(pendingScore.game, name, pendingScore.score);
      pendingScore = null;
      const btn = e.target.querySelector("button");
      btn.disabled = true;
      btn.textContent = "Saved!";
      $("leaderboard").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHero();
    renderAttractions();
    renderDeals();
    renderPricing();
    renderParties();
    renderQuotes();
    renderVisit();
    renderFooter();
    renderGameCards();
    buildTicker();
    paintSprites();
    wireWhatsApp();
    initVideo();
    initNav();
    initReveal();
    initArcadeHooks();
    Leaderboard.init();
  });
})();
