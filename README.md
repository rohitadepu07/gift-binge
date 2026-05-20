# 🍿 Gift-Binge — Cinematic Memory Streaming Platform

> A premium, high-fidelity personal memory streaming platform modeled after a professional Netflix experience. Crafted with love, cinematic depth, and state-of-the-art responsive micro-interactions.

---

## 🌟 Key Experience Pillars

### 1. Cinematic Landing Page
A stunning, high-impact introductory page featuring a beautifully blurred, warm-toned cinematic background. Built with clean, minimalist Netflix styling, a play-button Call-To-Action, and a premium "No sign-in required" entry flow.

### 2. Multi-Profile Selector
Choose your personalized profile! Supports multiple celebrant profiles (Sarah, Best Friend, Family, and more) with customized animated avatar icons, hover-growth effects, and a custom "Add Profile" modal for welcoming new members.

### 3. High-Fidelity Streaming Dashboard
A highly polished dark-mode environment designed for dense, premium layout browsing:
- **Transparent Navigation Header:** Floats seamlessly over the hero content, integrating the "A Special Gift Presents" banner alongside Mixed-Case premium links.
- **Vibrant Hero Showcase:** Generates customized dynamic banners personalized to the logged-in profile. Features precise dot-separated plain metadata (e.g., `98% Match · 2025 · 1 Season · Personal`) and a bold, normal-weight responsive summary block.
- **Infinite Scrolling Sliders:** Mixed-case row categories ("Trending In Your Heart", "Top Picks For You", etc.) housing horizontal cards that always display titles and years on a gradient footer overlay, with interactive play button pulses on hover.

### 4. Custom Embedded Netflix Video Player
A fully customized native HTML5 media player overlay. Completely overrides default browser players to feature:
- A custom high-fidelity red timeline/scrubber.
- Action control bars with volume toggle, fullscreen mode, custom timestamp counters (`0:00 / 3:15`), and hover play overlays.
- Seamless fluid transition animations powered by Framer Motion.

---

## 🛠️ Technology Stack

- **Core:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (configured for ultra-clean, modern component structures)
- **Animations:** Framer Motion (delivering ultra-smooth cinematic transitions)
- **Icons:** Lucide React (modern, minimalist pixel-perfect designs)
- **Portability:** Fully optimized responsive mobile & desktop designs

---

## 🚀 Getting Started

### 1. Installation
Clone the project and install standard dependencies:
```bash
npm install
```

### 2. Running Locally (Development)
The development server is explicitly configured to run in an isolated environment on port **`4000`** with strict local resolution to prevent collisions with other local systems:
```bash
npm run dev
```
Once started, navigate your browser to:
👉 **[http://localhost:4000](http://localhost:4000)**

### 3. Production Build
To package the app into optimized static files:
```bash
npm run build
```

---

## ⚙️ Configuration Details
- **Port Assignment:** Explicitly locked to `localhost:4000` within `vite.config.ts` to guarantee a dedicated conflict-free development stream.
- **Asset Integration:** Utilizes high-quality, high-speed Unsplash CDN sources and optimized media embeds to ensure high-fidelity styling without heavy server loads.

---

*Made with 💖 and Emergent styling guidelines for a breathtaking personal experience.*
