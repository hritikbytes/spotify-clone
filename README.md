# Spotify Clone

A responsive web music player inspired by Spotify, built with vanilla HTML, CSS, and JavaScript. It uses the public iTunes Search API to fetch 30-second audio previews, track metadata, and high-resolution album artwork across 11 genre playlists without requiring authentication or API keys.

**Status:** Personal project / deployed demo  
**Live Demo:** [https://spotify-clone-delta-gules.vercel.app/](https://spotify-clone-delta-gules.vercel.app/)

---

## Preview

| Desktop Player | Mobile Responsive |
|---|---|
| ![Desktop View](./screenshots/home.png) | ![Mobile View](./screenshots/mobile.png) |

---

## Features

- **11 Curated Playlists:** Global Top 50, RapCaviar, Dance Hits, Indie, Country, Viral Hits, R&B Classics, K-Pop, Lo-Fi, Workout, and Jazz.
- **Audio Playback:** Built on the native HTML5 `Audio` API with custom play/pause, seekbar progress, 3-state repeat (off, repeat-all, repeat-one), shuffle, and previous/next navigation.
- **Dynamic Backdrop & Equalizer:** Ambient radial gradient backgrounds update to match each playlist's primary palette, and active tracks display CSS-animated equalizer bars that pause with playback.
- **Liked Songs:** Heart button allows saving favorite tracks directly to browser `localStorage` so they persist across sessions.
- **Search & Filtering:** Real-time client-side search across playlist cards and within loaded tracklists.
- **Keyboard Shortcuts:**
  - `Space` — Play / Pause
  - `←` / `→` — Previous / Next track
  - `S` — Toggle shuffle
  - `R` — Cycle repeat mode
  - `L` or `H` — Like / Unlike current track
  - `↑` / `↓` — Volume up / down (5% increments)
  - `M` — Mute / Unmute
- **Responsive Layout:** Two-pane interface on desktop; collapses into an off-canvas navigation drawer with a compact mini-player on screens below 768px.

---

## Technical Implementation Notes

1. **Audio State Synchronization:**  
   Instead of using third-party player libraries, the playback engine directly coordinates native `Audio` events (`timeupdate`, `ended`, `play`, `pause`) with the DOM. The seekbar calculates proportional width and updates `aria-valuenow` in real time. Pressing "Previous" restarts the current track if playback has progressed beyond 3 seconds, matching native music player UX.

2. **Artwork Resolution Swapping:**  
   The iTunes Search API returns standard 100×100 thumbnail URLs (`.../100x100bb.jpg`). The app rewrites the URL parameter to `400x400bb.jpg` on load, providing crisp album art on high-DPI displays without additional network overhead.

3. **CSS Flexbox Scrolling Architecture:**  
   To prevent vertical overflow issues common in fixed-viewport web apps, container elements use `min-height: 0` alongside `overflow-y: auto`. This ensures independent scrolling in the tracklist sidebar and playlist grid while keeping the bottom playbar pinned.

---

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES6 Modules), Semantic HTML5, Vanilla CSS3 (Flexbox, Grid, CSS Variables)
- **Audio & Data:** Native HTML5 Audio API, iTunes Search API (REST JSON)
- **Tooling & Hosting:** Vite, Vercel

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/hritikbytes/spotify-clone.git
   cd spotify-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Developer

**Hritik Sharma**  
- GitHub: [@hritikbytes](https://github.com/hritikbytes)  
- LinkedIn: [Hritik Sharma](https://www.linkedin.com/in/hritiksharma0608/)  
- Email: hritiksharma.0608@gmail.com
