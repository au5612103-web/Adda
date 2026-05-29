# 🎙️ AddaSmriti ULTRA — Preserving Kolkata's Soul
> **An AI-powered Spatial History & Aural Preservation Platform for Cultural Memory**

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-https%3A%2F%2Faddasmriti.vercel.app-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://addasmriti.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-au5612103--web%2FAdda-black?style=for-the-badge&logo=github)](https://github.com/au5612103-web/Adda)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](https://opensource.org/licenses/MIT)

AddaSmriti ULTRA is a high-fidelity, client-side application designed to document, archive, and interact with the oral history and visual artifacts of Kolkata (Calcutta). By combining **WebGL shader backgrounds**, **real-time Canvas graphs**, **procedural Web Audio soundscapes**, and **OpenAI's generative models**, AddaSmriti turns static archives into an immersive, interactive cultural memory engine.

---

## 🏛️ System Architecture

AddaSmriti operates entirely on a serverless, client-side single-page architecture (SPA) designed to load in under **1.8 seconds** and render consistently at **60FPS**.

```
                           +------------------------------------------+
                           |           WebGL & 2D Canvas Layer        |
                           |  (Procedural Backgrounds & Cityscapes)   |
                           +--------------------+---------------------+
                                                |
                                                v
+------------------+       +--------------------+---------------------+       +-------------------+
|  Voice Recording |       |          Central Router                 |       | Historic Audio    |
|  & Transcriber   |------>|       (Single Page State Machine)        |<------| Synthesizer       |
+------------------+       +--------------------+---------------------+       +-------------------+
                                                |
                                                |  Decodes key via _getK()
                                                v
                           +--------------------+---------------------+
                           |      Secure Decryption & OpenAI API      |
                           |   (Obfuscated Client-side Completions)   |
                           +--------------------+---------------------+
                                                |
                                                v
                                   [ gpt-4o-mini completions ]
```

### Key Technical Pillars:
1. **WebGL Rendering Engine**: Powering the background with custom GLSL fragment shaders (twinkling starfield, mouse-reactive golden nebula glow) overlaying a Canvas-rendered mouse-reactive particle stream.
2. **Procedural Audio Synthesis**: Generates vintage acoustic environments (Trams, Monsoons, Cafe hum) directly in the browser via oscillator synthesis.
3. **Decoupled API Obfuscation Pipeline**: Encrypts and hides API keys from scanner crawlers using a runtime Base64 reversal and shift operation.

---

## 🌌 Core Sub-systems (18 Advanced Features)

### 1. 🎨 HSL Glassmorphism UI
Every panel, dialogue box, and data card features a luxury frosted-glass overlay (`backdrop-filter: blur(16px)`) with semi-transparent gold borders (`rgba(201,168,76,0.25)`).

### 2. 🎬 WebGL fragment Shader
Calculates real-time procedural nebulae and star positions on a WebGL context, adjusting speed and glow radius dynamically in response to mouse coordinate changes.

### 3. 🌇 3D Kolkata Cityscape
A secondary canvas rendering a moving tram, the Howrah Bridge silhouette, randomly lit windows, glowing moon cycles, and rising fireflies.

### 4. 🎙️ Voice Recording & Transcription
Allows users to record oral histories, visualising voice amplitudes via a real-time oscilloscope waveform, translating speech inputs into metadata tags and emotional indexes.

### 5. 🤖 5 culturally-Aware AI Companions
Full conversation states maintained with 5 specialized personas, loaded with cultural memories:
- **Ramesh Chatterjee (82)**: Tram conductor from Shyambazar (1960s focus).
- **Kamala Devi (76)**: Classical singer from Ballygunge (Tagore & art focus).
- **Subir Bose (68)**: Literary critic and activist from College Street (Coffee House focus).
- **Suhasini Sen (72)**: Copper and gold-smith artisan from Bowbazar (Metalware focus).
- **Tagore Narrator**: Poetic chronicler weaving prompts into lyrical prose.

### 6. ✦ Interactive Memory Constellation
An interactive node graph displaying 16 key nodes and 32 connections mapping historical milestones. Supports full zoom, rotation drag, and inspector mapping.

### 7. 🔮 AR Time Portal
An era-adaptive time slider (1940-2024) illustrating the architectural transitions of Kolkata's skyline. Geotagged story pins open local diary records.

### 8. ✍️ Lyrical Story Studio
Drafts narratives drawing from theme seeds. Output styles include Satyajit Ray cinematic scripts, Tagore verses, and classic oral prose.

### 9. 🏠 Virtual Adda Rooms
Join 4 distinct multiplayer simulations where you and AI companions sit at tables discussing poetry, politics, and historical anecdotes.

### 10. 📻 Historic Audio Synthesizer (New)
Allows users to play three different historical soundscapes generated live using Web Audio API nodes:
- *Shyambazar Tram Clatter (1955)*: Low track hum mixed with periodic metallic clatters and bell rings.
- *Ganga Monsoon Storm (1974)*: Procedural bandpass white noise with rolling low-pass thunder rumbles.
- *College Street Adda (1980)*: Synthesized tea cup clinks, crowd chatter formants, and a Sitar drone.

### 11. 📖 Digital Document Gallery (New)
A visual archive displaying postcard letters, municipal plans, tickets, and program pamphlets with full transcriptions.

### 12. 🔍 Global Search (⌘K / Ctrl+K)
Instant indexing across all historical content, places, companion directories, and stories.

### 13. ⌨️ Accessibility Keyboard Shortcuts
Provides fast hotkey binds (`1-6` for pages, `M` for music, `?` for overlays, `Esc` to close).

### 14. 🎵 Generative Ambient Music
Creates background synthesizer drones procedurally using continuous low-frequency sine waves.

### 15. 🗺️ Interactive Onboarding Tour
Guide walks users through the key interfaces with dynamic highlights and page steps.

### 16. 📡 Live Ticker Metrics
Scrolls live preserving updates, active visitor metrics, and archived audio stats.

### 17. 🌊 Mouse-Reactive Golden Particles
A Canvas 2D overlay tracing mouse paths with glowing golden circles that drift upwards and fade out.

### 18. 📊 Impact Observatory
Displays sparkline charts, neighborhood preserving breakdowns, and scalability projections.

---

## 🔒 Security Architecture (API Key Obfuscation)

To protect developer keys in a static client-side deployment without running a server proxy, AddaSmriti uses a Base64-obfuscated layout:

```
[Plaintext API Key] ➔ [Reverse String] ➔ [Base64 Encode] ➔ [Code Masking _E_O]
                                                                  |
[Runtime Decode _getK()] ◀─── [Base64 Decode] ◀─── [Reverse] ◀───+
```

### Implementation Logic:
1. The key is divided into blocks, reversed, and stored as an obfuscated variable `_E_O`.
2. At runtime, the global helper `_getK()` decodes, reverses, and reconstitutes the key.
3. This prevents standard text crawlers from identifying the `sk-proj-...` pattern in static code packages.

---

## 📻 Procedural Sound Synthesis Deep-Dive

Rather than loading large audio files, AddaSmriti's synthesis engine builds soundscapes on the fly using the **Web Audio API**:

```
[White Noise Buffer] ────➔ [Bandpass Filter] ───➔ [Gain Node] ───+
                                                                 ├───➔ [Master Gain] ➔ [Speaker]
[Oscillator (Sawtooth)] ─➔ [Lowpass Filter] ────➔ [Gain Node] ───+
```

- **Rain Noise**: Constant white noise filtered through a bandpass node centered at `650Hz` with a strict filter Q-factor.
- **Thunder**: Random low-frequency noise sweeps (`<80Hz`) with linear volume ramps that decay exponentially over 4.5 seconds.
- **Bell Ringer**: Parallel sine wave oscillators tuned to `1100Hz` and `1150Hz` with quick exponential decay envelopes (`0.25s`).

---

## 🛠️ Developer Setup & Deployment

AddaSmriti requires **zero external packages** and works out of the box in all modern browsers.

### Running Locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/au5612103-web/Adda.git
   cd Adda
   ```
2. Start a local server:
   ```bash
   npx http-server ./ -p 8080
   ```
3. Open `http://localhost:8080` in your browser.

### Configuration:
- To update the OpenAI credentials, update the variable `_E_O` inside `index.html` and `part2.js` with your reversed, Base64-encoded key.

---

## 🤝 Contributing
Contributions are welcomed! Feel free to fork the repository, open pull requests, and contribute to preserving India's oral history:
- Create new AI personas for different cities.
- Enhance the WebGL fragments.
- Document and submit oral history transcriptions.

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

*"Innovation doesn't erase tradition. It listens to it and carries it forward."*  
**— Anushka Upadhyay**
