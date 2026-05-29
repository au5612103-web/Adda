# 🎙️ AddaSmriti ULTRA
## *Preserving Kolkata's Soul — One Story at a Time*

**Team:** Anushka Upadhyay & Vyom Dubey  
**Event:** Tradition Hacks 2026 — AI for Cultural Preservation  
**Status:** 🏆 Hackathon Submission

---

## ⚡ Run Instantly

1. Unzip `AddaSmriti_ULTRA.zip`
2. Open `index.html` in **Chrome** (recommended) or Edge
3. No server, no install, no dependencies — runs 100% in-browser

> For AI features (Companion Chat, Story Studio, Adda Room): ensure internet access

---

## 🌌 What's Inside — 16 Advanced Systems

### 1. 🎬 WebGL Shader Background
Real-time GLSL fragment shader — procedural starfield, mouse-reactive nebula glow, animated noise.

### 2. 🏙️ 3D Kolkata Canvas Engine
Animated cityscape: buildings with randomised lit windows, tram moving across the Howrah Bridge, moon glow, water shimmer, Bengali firefly particles.

### 3. 🎙️ Voice Recording Studio
- Oscilloscope waveform visualiser (real-time)
- Simulated Bengali + English transcription with typewriter animation  
- AI entity extraction (places, people, events, emotions)
- Emotion analysis dashboard (Nostalgia/Joy/Grief/Pride)
- AI insight stream with delay-sequenced observations

### 4. 🤖 AI Companion — Real Claude API
- **4 distinct personas:** Ramesh Dada, Kamala Dadi, Subir Da, Tagore Narrator
- Each has a unique system prompt with real Kolkata cultural memory
- Full conversation history maintained per session
- Adjustable model (Sonnet/Opus) and temperature
- Emotion radar chart, memory source relevance bars, life timeline
- Conversation depth meter

### 5. ✦ Memory Constellation (Canvas Graph)
- 16 nodes: people, places, events, cultural threads
- 32 edges with animated particles on hover
- Drag, zoom (4×), spin rotation mode
- Click-to-inspect with connection network
- Starfield background with twinkling animation
- Timeline mode, 2D/3D mode switchers

### 6. 🔮 AR Time Portal (WebGL-powered Canvas)
- Full atmospheric renderer: sky, buildings, tram, gas lamps, cobblestones
- Era-adaptive: 1940s gas lamps vs 2000s LED, tram tracks vanish post-1995
- Animated tram crosses the Howrah Bridge in each era
- Story pins with popup modals (real elder stories)
- Time slider 1940–2024 with live year display
- Building window animations per-era

### 7. ✍️ Generative Story Studio (Claude AI)
- 4 literary styles: Tagore lyrical, Satyajit Ray cinematic, oral tradition, verse sequence
- Persona selection links to real preserved memory context
- Typewriter output animation
- Copy / Save to archive
- 5 quick-seed themes

### 8. 🏠 Virtual Adda Room (Real-time AI chat)
- 4-participant grid (You + AI Dada + remote family members simulation)
- Live multi-turn chat with Claude AI as Ramesh Dada
- 4 active rooms to join (Shyambazar, Ballygunge, Coffee House, Puja Nights)
- Now-playing story audio bar

### 9. ✦ Floating Action Button Dock
5-button expandable dock: Story Studio, Adda Room, Ambient Sound, Keyboard Shortcuts, Tour

### 10. 🔍 Global Search (⌘K)
16-item indexed search: stories, people, places, screens, events — with type badges

### 11. ⌨️ Keyboard Shortcuts
1–6 for screens, M for music, Esc to close, ? for help, ⌘K for search

### 12. 🎵 Ambient Audio Engine
Web Audio API generative ambient soundscape — 3-layer harmonic oscillators

### 13. 🗺️ Onboarding Tour
5-step guided tour with progress bar, skip option

### 14. 📡 Live Metrics Ticker
Fixed top bar with scrolling live updates

### 15. 🎨 Micro-interactions
Custom cursor with CSS variables, ripple effects on all interactive elements, particle system

### 16. 📊 Impact Observatory
- 4 animated sparkline charts
- Multi-month area chart (story growth)
- Neighbourhood bar chart (animated)
- India scalability roadmap (6 cities)
- Team section

---

## 🎨 Design System

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#080610` | Deep background |
| `--gold` | `#c9a84c` | Primary accent |
| `--ember` | `#e8612a` | Gradient warm |
| `--jade` | `#2ab89a` | Success / online |
| `--lavender` | `#8b7fd4` | Events / cultural |
| Font Display | Cormorant Garamond | Headers |
| Font Body | Outfit | UI text |
| Font Bengali | Noto Serif Bengali | Bengali script |

---

## 🏗️ Architecture

```
index.html (single file)
├── CSS                    ~900 lines — design system, all screens
├── HTML                   ~400 lines — 6 screens, all components  
├── JavaScript Part 1      ~700 lines — WebGL, Canvas, Recording, AI, AR
└── JavaScript Part 2      ~600 lines — Studio, Adda, Search, FAB, Audio
```

**External calls:** Anthropic API (`/v1/messages`) — only for AI Companion, Story Studio, Adda Room

---

## 🌍 Impact Vision

| City | Oral Tradition | Status |
|------|----------------|--------|
| Kolkata | Adda culture | ✅ Live |
| Delhi | Mohalla stories | Q3 2026 |
| Mumbai | Chawl histories | Q4 2026 |
| Varanasi | Ghat traditions | 2027 |
| Chennai | Street histories | 2027 |
| Jaipur | Haveli culture | 2027 |

---

*"Innovation doesn't erase tradition. It listens to it and carries it forward."*

**— Anushka Upadhyay & Vyom Dubey · AddaSmriti · Tradition Hacks 2026**
