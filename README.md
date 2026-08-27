# 🎧 Spotify Clone Audio Engine

> An independently developed frontend project exploring browser-based audio playback, asynchronous API integration, playlist state management, and responsive music-player interactions using vanilla JavaScript.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![iTunes API](https://img.shields.io/badge/API-iTunes_Search_API-FA243C?style=for-the-badge&logo=apple&logoColor=white)](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)

**Live Demo:** Add your deployed URL here if this project is currently hosted.

---

## Overview

Spotify Clone Audio Engine is an independently developed frontend project built with semantic HTML, modern CSS, and vanilla JavaScript.

Rather than only recreating a Spotify-inspired interface, the project focuses on building the underlying interaction layer for a browser-based music player.

It integrates the iTunes Search API to retrieve track metadata, artwork, and preview audio, then connects that data to a custom playback interface built around the native HTML5 Audio API.

The project was built as a personal exercise in asynchronous JavaScript, browser audio APIs, state management, DOM manipulation, and responsive interface development.

> **Note:** This project is an independent educational project inspired by modern music-streaming interfaces. It is not affiliated with or endorsed by Spotify.

---

## 📸 Preview

| Desktop Experience | Mobile Responsive |
|:---:|:---:|
| ![Spotify Clone desktop interface](./screenshots/home.png) | ![Spotify Clone mobile interface](./screenshots/mobile.png) |

---

## ✨ Core Features

### 🎵 Audio Playback Engine

- Play and pause controls
- Track seeking through a custom progress bar
- Volume control
- Track duration and current-time tracking
- Automatic handling of track completion
- Previous/next track navigation
- Native browser `HTMLAudioElement` integration

### 🔀 Playlist Controls

- Shuffle playback
- Repeat modes
- Next and previous track handling
- Active-track state
- Queue progression
- Dynamic playback controls

### 🔎 Music Discovery

The application integrates the iTunes Search API to retrieve:

- Track metadata
- Artist information
- Album artwork
- Preview audio URLs
- Search results across music content

No Spotify authentication is required for the demo.

### ❤️ Local User State

The application maintains client-side interaction state for features such as:

- Liked songs
- Active track
- Playback state
- Shuffle state
- Repeat mode
- Search state

---

## 🧠 Audio Engine Architecture

The central part of the project is the browser-side audio state management.

```text
                         ┌─────────────────────┐
                         │      User Input     │
                         │ Play / Seek / Volume│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Audio State      │
                         │                     │
                         │ Current Track      │
                         │ Playing State      │
                         │ Current Time       │
                         │ Volume             │
                         │ Shuffle / Repeat   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  HTML5 Audio API    │
                         │                     │
                         │ play()             │
                         │ pause()            │
                         │ currentTime        │
                         │ volume             │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   UI Synchronizer   │
                         │                     │
                         │ Progress Bar       │
                         │ Track Information   │
                         │ Equalizer           │
                         │ Playback Controls   │
                         └─────────────────────┘
```

The interface reacts to native audio events such as:

```text
loadedmetadata
timeupdate
play
pause
ended
```

These events keep the visual playback state synchronized with the underlying audio element.

---

## 🔄 Data Flow

```text
User Search
     │
     ▼
iTunes Search API
     │
     ▼
JSON Response
     │
     ▼
Track Data Normalization
     │
     ▼
Application State
     │
     ├───────────────┐
     ▼               ▼
Track UI        Audio Engine
                     │
                     ▼
              HTML5 Audio
                     │
                     ▼
              Playback Events
                     │
                     ▼
                UI Updates
```

This separates remote music metadata from the local playback state handled by the browser.

---

## 🎛️ Playback State

The player maintains several interacting pieces of client-side state:

```text
Current Track
     │
     ├── Playing / Paused
     ├── Current Time
     ├── Duration
     ├── Volume
     ├── Shuffle Mode
     ├── Repeat Mode
     └── Queue Position
```

Managing these states together was one of the main engineering challenges of the project.

For example, when a track reaches its end, the application must determine whether to:

1. Repeat the current track
2. Select another track through shuffle
3. Advance to the next track
4. Stop playback

---

## 🎨 UI & Interaction

The interface combines a Spotify-inspired visual language with custom browser interactions.

### Interface

- Responsive desktop/mobile layouts
- Custom music-player controls
- Album artwork presentation
- Dynamic track information
- Search interface
- Playlist and track views
- Ambient background effects

### Animation

- Equalizer animation for the active track
- Playback transitions
- Hover states
- Interactive controls
- Loading feedback
- Dynamic background changes based on active content

---

## 🛠️ Tech Stack

### Frontend

- **HTML5** — semantic structure
- **CSS3** — Flexbox, Grid, custom properties, responsive layouts, animations
- **JavaScript (ES6+)** — application logic and state management
- **HTML5 Audio API** — browser-native audio playback

### API

- **iTunes Search API** — track metadata, artwork, and preview audio

### Development

- **Git**
- **GitHub**
- **VS Code**

---

## 📁 Project Structure

```text
SpotifyClone/
│
├── screenshots/
│   ├── home.png
│   └── mobile.png
│
├── index.html
├── style.css
├── script.js
├── LICENSE
└── README.md
```

> Adjust this structure if your repository contains additional directories or files.

---

## 🚀 Getting Started

### Prerequisites

No framework or backend is required.

You only need:

- A modern web browser
- Git
- A local development environment capable of serving static files

### 1. Clone the repository

```bash
git clone https://github.com/hritikbytes/SpotifyClone.git
cd SpotifyClone
```

### 2. Run locally

Because this is a client-side project, you can open `index.html` directly in a browser.

For a better development experience, serve the project with a local static server.

For example, with VS Code, the **Live Server** extension can be used to launch the application locally.

---

## 💡 Technical Challenges & Learning

### 1. Synchronizing the Audio API with the UI

The most challenging part of the project was keeping the custom interface synchronized with the browser's native audio state.

The `HTMLAudioElement` exposes asynchronous events such as `timeupdate`, `play`, `pause`, and `ended`. These events need to update the progress bar, playback controls, active-track state, and animations without creating conflicting UI states.

This provided practical experience with event-driven browser APIs and state synchronization.

### 2. Shuffle & Repeat Logic

Playback controls required more than simple next/previous navigation.

The player needs to account for:

- Sequential playback
- Randomized track selection
- Repeat-current-track behaviour
- Repeat-queue behaviour
- End-of-track transitions

Implementing these interactions helped separate playback state from UI event handlers.

### 3. Asynchronous API Integration

The application retrieves music data asynchronously from the iTunes Search API.

The UI therefore needs to handle:

```text
Request
  ↓
Loading
  ↓
Response
  ├── Success → Render Results
  └── Failure → Error Feedback
```

This provided practical experience with `fetch()`, promises, asynchronous state changes, and API error handling.

### 4. Responsive Audio Interface

A music player has many interactive controls that compete for limited horizontal space on mobile devices.

The interface was therefore adapted using responsive CSS layouts rather than simply scaling the desktop interface down.

---

## 🔐 Technical Notes

### Audio Sources

The application uses audio preview URLs returned by the iTunes Search API.

These previews are not equivalent to full Spotify catalogue playback.

### Authentication

No user authentication is implemented.

### Persistence

User interaction state such as liked tracks is handled on the client side rather than through a backend account system.

---

## 🛣️ Future Improvements

- [ ] Replace iTunes Search API with an appropriate official music service API where permitted
- [ ] Add user authentication
- [ ] Persist liked songs and playlists
- [ ] Add playlist creation and editing
- [ ] Improve queue management
- [ ] Add keyboard accessibility across all player controls
- [ ] Add automated frontend tests
- [ ] Add PWA support
- [ ] Improve performance for large search results
- [ ] Add more robust error and empty states

---

## 📊 Project Status

**Status:** Personal project / deployed demo

Spotify Clone Audio Engine is an independently developed project created to explore frontend engineering, browser audio APIs, asynchronous JavaScript, API integration, state management, and responsive UI development.

It is not affiliated with Spotify and does not provide access to Spotify's full music catalogue or authenticated Spotify playback.

---

## 👨‍💻 Developer

**Hritik Sharma**

Web Developer focused on React, Next.js, TypeScript, and modern full-stack web development.

- **GitHub:** [@hritikbytes](https://github.com/hritikbytes)
- **LinkedIn:** [linkedin.com/in/hritiksharma0608](https://linkedin.com/in/hritiksharma0608/)
- **Email:** [hritiksharma.0608@gmail.com](mailto:hritiksharma.0608@gmail.com)

---

<div align="center">

**Built independently by Hritik Sharma**

</div>
