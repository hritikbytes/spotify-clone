console.info("🎵 Spotify Clone Audio Engine v2 Initialized");

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let currentSong = new Audio();
let currentSongsArray = []; // all tracks for active playlist
let filteredSongs = []; // after sidebar search filter
let currentSongIndex = 0;
let isShuffled = false;
let repeatMode = 0; // 0 = off, 1 = repeat all, 2 = repeat one
let likedSongs = new Set(); // track IDs that are liked
let activePlaylistId = null;

/* ─────────────────────────────────────────
   PLAYLIST DEFINITIONS
───────────────────────────────────────── */
const PLAYLISTS = [
  {
    id: "pop",
    title: "Global Top 50",
    desc: "The biggest hits right now.",
    query: "pop hits",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    color: "#8B4513",
  },
  {
    id: "hiphop",
    title: "RapCaviar",
    desc: "New music from the biggest artists.",
    query: "rap",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    color: "#2D1B69",
  },
  {
    id: "electronic",
    title: "Mint",
    desc: "The world's biggest dance hits.",
    query: "electronic dance",
    cover:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
    color: "#1a5276",
  },
  {
    id: "indie",
    title: "Ultimate Indie",
    desc: "The best indie tracks right now.",
    query: "indie rock",
    cover:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop",
    color: "#4A235A",
  },
  {
    id: "country",
    title: "Hot Country",
    desc: "Today's top country hits.",
    query: "country",
    cover:
      "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=400&h=400&fit=crop",
    color: "#7E5109",
  },
  {
    id: "viral",
    title: "Viral Hits",
    desc: "The trends starting right here.",
    query: "viral pop",
    cover:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop",
    color: "#641E16",
  },
  {
    id: "rnb",
    title: "R&B Classics",
    desc: "Smooth vibes and timeless vocals.",
    query: "r&b",
    cover:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop",
    color: "#1B4F72",
  },
  {
    id: "kpop",
    title: "K-Pop Daebak",
    desc: "The center of the Hallyu wave.",
    query: "k-pop",
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    color: "#512E5F",
  },
  {
    id: "lofi",
    title: "Lofi Beats",
    desc: "Beats to relax and study to.",
    query: "lofi hip hop",
    cover:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop",
    color: "#0E6655",
  },
  {
    id: "workout",
    title: "Workout Motivation",
    desc: "High energy tracks for the gym.",
    query: "workout music",
    cover:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    color: "#78281F",
  },
  {
    id: "jazz",
    title: "Jazz Vibes",
    desc: "Classic and modern jazz cuts.",
    query: "jazz vibes",
    cover:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=400&fit=crop",
    color: "#1C2833",
  },
];

/* ─────────────────────────────────────────
   DOM REFS
───────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const dom = {
  cardContainer: $("cardContainer"),
  songUL: $("songUL"),
  loadingSpinner: $("loadingSpinner"),
  emptyState: $("emptyState"),
  songCount: $("songCount"),
  sidebarSearch: $("sidebarSearch"),
  playIcon: $("playIcon"),
  playBtn: $("play"),
  prevBtn: $("previous"),
  nextBtn: $("next"),
  shuffleBtn: $("shuffleBtn"),
  repeatBtn: $("repeatBtn"),
  heartBtn: $("heartBtn"),
  seekbar: $("seekbar"),
  seekbarProg: $("seekbarProgress"),
  seekCircle: $("seekCircle"),
  currentTime: $("currentTime"),
  duration: $("songDuration"),
  songTitle: $("songTitle"),
  songArtist: $("songArtist"),
  albumCover: $("current-album-cover"),
  volIcon: $("volIcon"),
  volIconBtn: $("volIconBtn"),
  volRange: $("volumeRange"),
  volFill: $("volFill"),
  toastContainer: $("toast-container"),
  colorBackdrop: $("colorBackdrop"),
  leftSidebar: $("leftSidebar"),
  sidebarOverlay: $("sidebarOverlay"),
  hamburgerBtn: $("hamburgerBtn"),
  closeSidebar: $("closeSidebar"),
  globalSearch: $("globalSearch"),
};

/* ─────────────────────────────────────────
   UTILS
───────────────────────────────────────── */
function fmtTime(s) {
  if (isNaN(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function hdArt(url100) {
  return url100?.replace("100x100bb", "400x400bb") || "img/music.svg";
}

function trackId(track) {
  // stable id from iTunes
  return String(track.trackId || track.previewUrl);
}

/* ─────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────── */
function showToast(msg, duration = 2200) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  dom.toastContainer.appendChild(t);
  setTimeout(() => {
    t.classList.add("out");
    t.addEventListener("animationend", () => t.remove());
  }, duration);
}

/* ─────────────────────────────────────────
   BACKDROP COLOR
───────────────────────────────────────── */
function setBackdropColor(hexColor) {
  dom.colorBackdrop.style.background = `radial-gradient(ellipse at top left, ${hexColor}55 0%, transparent 65%)`;
}

/* ─────────────────────────────────────────
   RENDER PLAYLISTS (Cards)
───────────────────────────────────────── */
function renderPlaylists() {
  dom.cardContainer.innerHTML = "";
  PLAYLISTS.forEach((pl, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card-${pl.id}`;
    card.style.animationDelay = `${i * 40}ms`;
    card.innerHTML = `
            <div class="card-play">
                <svg viewBox="0 0 24 24" fill="#000"><path d="M5 20V4l14 8-14 8z"/></svg>
            </div>
            <img src="${pl.cover}" alt="${pl.title}" loading="lazy">
            <h2>${pl.title}</h2>
            <p>${pl.desc}</p>`;
    card.addEventListener("click", () => loadPlaylist(pl));
    dom.cardContainer.appendChild(card);
  });
}

/* ─────────────────────────────────────────
   LOAD PLAYLIST (fetch + render sidebar)
───────────────────────────────────────── */
async function loadPlaylist(playlist) {
  if (activePlaylistId === playlist.id) return; // already loaded
  activePlaylistId = playlist.id;

  // Visual feedback on card
  document
    .querySelectorAll(".card")
    .forEach((c) => c.classList.remove("active-card"));
  const activeCard = $(`card-${playlist.id}`);
  if (activeCard) activeCard.classList.add("active-card");

  // Update backdrop
  setBackdropColor(playlist.color);

  // Show spinner, hide list
  dom.songUL.innerHTML = "";
  dom.emptyState.classList.add("hidden");
  dom.loadingSpinner.classList.remove("hidden");
  dom.songCount.textContent = "";
  dom.sidebarSearch.value = "";

  // On mobile: open sidebar
  openSidebar();

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(playlist.query)}&limit=30&media=music`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    currentSongsArray = data.results.filter((t) => t.previewUrl);
    filteredSongs = [...currentSongsArray];
    dom.loadingSpinner.classList.add("hidden");

    if (currentSongsArray.length === 0) {
      dom.emptyState.classList.remove("hidden");
      return;
    }

    renderSidebarList(filteredSongs);
    dom.songCount.textContent = currentSongsArray.length;
    showToast(
      `🎶 ${playlist.title} loaded — ${currentSongsArray.length} tracks`,
    );

    // Auto-load first track without playing
    currentSongIndex = 0;
    loadTrackIntoPlaybar(currentSongsArray[0]);
  } catch (err) {
    dom.loadingSpinner.classList.add("hidden");
    dom.emptyState.classList.remove("hidden");
    showToast("⚠️ Could not load tracks. Try again.");
    console.error("Fetch error:", err);
  }
}

/* ─────────────────────────────────────────
   RENDER SIDEBAR LIST
───────────────────────────────────────── */
function renderSidebarList(songs) {
  dom.songUL.innerHTML = "";
  songs.forEach((track, idx) => {
    const realIdx = currentSongsArray.indexOf(track);
    const li = document.createElement("li");
    li.dataset.index = realIdx;
    li.style.animationDelay = `${idx * 25}ms`;
    li.innerHTML = `
            <div class="track-num" data-num="${realIdx + 1}">${realIdx + 1}</div>
            <img class="track-art" src="${hdArt(track.artworkUrl100)}" alt="art">
            <div class="info">
                <div>${escapeHTML(track.trackName)}</div>
                <div>${escapeHTML(track.artistName)}</div>
            </div>
            <div class="equalizer hidden">
                <span></span><span></span><span></span>
            </div>`;
    li.addEventListener("click", () => {
      currentSongIndex = realIdx;
      playTrack(currentSongsArray[realIdx]);
    });
    dom.songUL.appendChild(li);
  });

  refreshActiveTrackUI();
}

/* ─────────────────────────────────────────
   ACTIVE TRACK HIGHLIGHT + EQUALIZER
───────────────────────────────────────── */
function refreshActiveTrackUI() {
  const items = dom.songUL.querySelectorAll("li");
  items.forEach((li) => {
    const idx = parseInt(li.dataset.index);
    const eq = li.querySelector(".equalizer");
    const num = li.querySelector(".track-num");
    const isActive = idx === currentSongIndex;

    li.classList.toggle("active", isActive);

    if (isActive) {
      eq.classList.remove("hidden");
      num.classList.add("hidden");
      eq.classList.toggle("paused", currentSong.paused);
    } else {
      eq.classList.add("hidden");
      num.classList.remove("hidden");
    }
  });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─────────────────────────────────────────
   LOAD TRACK INTO PLAYBAR (no auto-play)
───────────────────────────────────────── */
function loadTrackIntoPlaybar(track) {
  currentSong.src = track.previewUrl;
  updatePlaybarUI(track);
}

/* ─────────────────────────────────────────
   PLAY TRACK
───────────────────────────────────────── */
function playTrack(track) {
  currentSong.src = track.previewUrl;
  currentSong.play().catch((e) => console.warn("Playback error:", e));
  dom.playIcon.src = "img/pause.svg";
  dom.playBtn.setAttribute("aria-label", "Pause");
  updatePlaybarUI(track);
  refreshActiveTrackUI();
}

/* ─────────────────────────────────────────
   UPDATE PLAYBAR UI
───────────────────────────────────────── */
function updatePlaybarUI(track) {
  dom.songTitle.textContent = track.trackName;
  dom.songArtist.textContent = track.artistName;
  dom.albumCover.src = hdArt(track.artworkUrl100);
  dom.currentTime.textContent = "0:00";
  dom.duration.textContent = "0:30"; // iTunes previews are 30s
  dom.seekbarProg.style.width = "0%";
  dom.seekCircle.style.left = "0%";

  // Update heart state
  const liked = likedSongs.has(trackId(track));
  dom.heartBtn.classList.toggle("liked", liked);
  dom.heartBtn.setAttribute("aria-pressed", liked);
}

/* ─────────────────────────────────────────
   SHUFFLE LOGIC
───────────────────────────────────────── */
function toggleShuffle() {
  isShuffled = !isShuffled;
  dom.shuffleBtn.classList.toggle("active", isShuffled);
  showToast(isShuffled ? "🔀 Shuffle on" : "🔀 Shuffle off");
}

function getNextIndex() {
  if (isShuffled) {
    let r;
    do {
      r = Math.floor(Math.random() * currentSongsArray.length);
    } while (r === currentSongIndex && currentSongsArray.length > 1);
    return r;
  }
  return (currentSongIndex + 1) % currentSongsArray.length;
}

function getPrevIndex() {
  if (isShuffled) return Math.floor(Math.random() * currentSongsArray.length);
  return (
    (currentSongIndex - 1 + currentSongsArray.length) % currentSongsArray.length
  );
}

/* ─────────────────────────────────────────
   REPEAT LOGIC
───────────────────────────────────────── */
const REPEAT_LABELS = ["🔁 Repeat off", "🔁 Repeat all", "🔂 Repeat one"];
function cycleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  dom.repeatBtn.classList.toggle("active", repeatMode > 0);
  showToast(REPEAT_LABELS[repeatMode]);
}

/* ─────────────────────────────────────────
   LIKE / HEART
───────────────────────────────────────── */
const currentTrack = () => currentSongsArray[currentSongIndex] || null;

function toggleLike() {
  const track = currentTrack();
  if (!track) return;
  const id = trackId(track);
  if (likedSongs.has(id)) {
    likedSongs.delete(id);
    dom.heartBtn.classList.remove("liked");
    dom.heartBtn.setAttribute("aria-pressed", "false");
    showToast("💔 Removed from Liked Songs");
  } else {
    likedSongs.add(id);
    dom.heartBtn.classList.add("liked");
    dom.heartBtn.setAttribute("aria-pressed", "true");
    showToast("💚 Added to Liked Songs");
  }
  // animate
  dom.heartBtn.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.35)" },
      { transform: "scale(1)" },
    ],
    { duration: 300, easing: "ease-out" },
  );
}

/* ─────────────────────────────────────────
   SIDEBAR SEARCH FILTER
───────────────────────────────────────── */
function filterSidebar(query) {
  const q = query.trim().toLowerCase();
  filteredSongs = q
    ? currentSongsArray.filter(
        (t) =>
          t.trackName.toLowerCase().includes(q) ||
          t.artistName.toLowerCase().includes(q),
      )
    : [...currentSongsArray];
  renderSidebarList(filteredSongs);
  dom.songCount.textContent = filteredSongs.length;
}

/* ─────────────────────────────────────────
   MOBILE SIDEBAR
───────────────────────────────────────── */
function openSidebar() {
  if (window.innerWidth <= 768) {
    dom.leftSidebar.classList.add("open");
    dom.sidebarOverlay.classList.add("active");
    document.body.classList.add("sidebar-open");
  }
}
function closeSidebar() {
  dom.leftSidebar.classList.remove("open");
  dom.sidebarOverlay.classList.remove("active");
  document.body.classList.remove("sidebar-open");
}

/* ─────────────────────────────────────────
   VOLUME FILL UPDATE
───────────────────────────────────────── */
function updateVolFill(val) {
  dom.volFill.style.width = `${val}%`;
}

/* ─────────────────────────────────────────
   EVENT LISTENERS
───────────────────────────────────────── */
function setupEventListeners() {
  /* ── Play / Pause ── */
  dom.playBtn.addEventListener("click", () => {
    if (!currentSong.src) return;
    if (currentSong.paused) {
      currentSong.play();
      dom.playIcon.src = "img/pause.svg";
      dom.playBtn.setAttribute("aria-label", "Pause");
    } else {
      currentSong.pause();
      dom.playIcon.src = "img/play.svg";
      dom.playBtn.setAttribute("aria-label", "Play");
    }
    refreshActiveTrackUI();
  });

  /* ── Time Update / Seekbar ── */
  currentSong.addEventListener("timeupdate", () => {
    const pct = (currentSong.currentTime / currentSong.duration) * 100 || 0;
    dom.currentTime.textContent = fmtTime(currentSong.currentTime);
    dom.duration.textContent = fmtTime(currentSong.duration);
    dom.seekbarProg.style.width = pct + "%";
    dom.seekCircle.style.left = pct + "%";
  });

  /* ── Seek Click ── */
  dom.seekbar.addEventListener("click", (e) => {
    if (!currentSong.duration) return;
    const rect = dom.seekbar.getBoundingClientRect();
    if (!rect.width) return;
    const pct = e.clientX / rect.width - rect.left / rect.width;
    currentSong.currentTime =
      currentSong.duration * Math.max(0, Math.min(1, pct));
  });

  /* ── Previous ── */
  dom.prevBtn.addEventListener("click", () => {
    if (currentSongsArray.length === 0) return;
    // If > 3s played, restart current track
    if (currentSong.currentTime > 3) {
      currentSong.currentTime = 0;
      return;
    }
    currentSongIndex = getPrevIndex();
    playTrack(currentSongsArray[currentSongIndex]);
  });

  /* ── Next ── */
  dom.nextBtn.addEventListener("click", () => {
    if (currentSongsArray.length === 0) return;
    currentSongIndex = getNextIndex();
    playTrack(currentSongsArray[currentSongIndex]);
  });

  /* ── Track End ── */
  currentSong.addEventListener("ended", () => {
    if (repeatMode === 2) {
      currentSong.currentTime = 0;
      currentSong.play();
      return;
    }
    if (repeatMode === 1 || currentSongIndex < currentSongsArray.length - 1) {
      currentSongIndex = getNextIndex();
      playTrack(currentSongsArray[currentSongIndex]);
    } else {
      // End of list, reset UI
      dom.playIcon.src = "img/play.svg";
      dom.playBtn.setAttribute("aria-label", "Play");
      refreshActiveTrackUI();
    }
  });

  /* ── Shuffle ── */
  dom.shuffleBtn.addEventListener("click", toggleShuffle);

  /* ── Repeat ── */
  dom.repeatBtn.addEventListener("click", cycleRepeat);

  /* ── Like ── */
  dom.heartBtn.addEventListener("click", toggleLike);

  /* ── Volume Range ── */
  dom.volRange.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    currentSong.volume = val / 100;
    updateVolFill(val);
    dom.volIcon.src = val === 0 ? "img/mute.svg" : "img/volume.svg";
  });

  /* ── Volume Mute Toggle ── */
  dom.volIconBtn.addEventListener("click", () => {
    if (currentSong.volume > 0) {
      currentSong.dataset.lastVol = currentSong.volume;
      currentSong.volume = 0;
      dom.volRange.value = 0;
      updateVolFill(0);
      dom.volIcon.src = "img/mute.svg";
    } else {
      const restore = parseFloat(currentSong.dataset.lastVol) || 0.5;
      currentSong.volume = restore;
      dom.volRange.value = restore * 100;
      updateVolFill(restore * 100);
      dom.volIcon.src = "img/volume.svg";
    }
  });

  /* ── Sidebar Search ── */
  dom.sidebarSearch.addEventListener("input", (e) =>
    filterSidebar(e.target.value),
  );

  /* ── Global Search (filter playlists) ── */
  dom.globalSearch.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    dom.cardContainer.querySelectorAll(".card").forEach((card) => {
      const title = card.querySelector("h2").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();
      card.style.display =
        !q || title.includes(q) || desc.includes(q) ? "" : "none";
    });
  });

  /* ── Mobile Sidebar ── */
  dom.hamburgerBtn.addEventListener("click", openSidebar);
  dom.closeSidebar.addEventListener("click", closeSidebar);
  dom.sidebarOverlay.addEventListener("click", closeSidebar);

  /* ── Keyboard Shortcuts ── */
  document.addEventListener("keydown", (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "input") return; // don't fire inside inputs

    switch (e.code) {
      case "Space":
        e.preventDefault();
        dom.playBtn.click();
        break;
      case "ArrowRight":
        dom.nextBtn.click();
        break;
      case "ArrowLeft":
        dom.prevBtn.click();
        break;
      case "KeyS":
        toggleShuffle();
        break;
      case "KeyR":
        cycleRepeat();
        break;
      case "KeyL":
      case "KeyH":
        toggleLike();
        break;
      case "ArrowUp":
        e.preventDefault();
        dom.volRange.value = Math.min(100, parseInt(dom.volRange.value) + 5);
        dom.volRange.dispatchEvent(new Event("input"));
        break;
      case "ArrowDown":
        e.preventDefault();
        dom.volRange.value = Math.max(0, parseInt(dom.volRange.value) - 5);
        dom.volRange.dispatchEvent(new Event("input"));
        break;
      case "KeyM":
        dom.volIconBtn.click();
        break;
    }
  });

  /* ── Init volume fill ── */
  updateVolFill(parseInt(dom.volRange.value));
}

/* ─────────────────────────────────────────
   GREETING BASED ON TIME
───────────────────────────────────────── */
function setGreeting() {
  const h = new Date().getHours();
  const greet =
    h < 12
      ? "Good morning 🌅"
      : h < 17
        ? "Good afternoon ☀️"
        : h < 21
          ? "Good evening 🌆"
          : "Good night 🌙";
  const el = document.querySelector(".spotifyPlaylists h1");
  if (el) el.textContent = greet;
}

/* ─────────────────────────────────────────
   BOOT
───────────────────────────────────────── */
function init() {
  setupEventListeners();
  renderPlaylists();
  setGreeting();

  // Show keyboard shortcut tip after a short delay
  setTimeout(() => {
    showToast("💡 Tip: Use Space / ← → / S R L keys to control playback");
  }, 1800);
}

init();
