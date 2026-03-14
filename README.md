# ⭐ Star Siege

A retro arcade shooter in your browser. Defend your ship against endless alien formations while collecting power-ups and chasing the high score.

## 🚀 Play Now

**No installation needed!** Just open `index.html` in any modern browser:

```bash
# Clone or download, then:
open starsiege/index.html
# Or drag index.html into your browser
```

Works offline—no server required.

## 🎮 How to Play

- **Move**: `←` `→` Arrow keys
- **Shoot**: `SPACE` (hold for auto-fire)
- **Pause**: `P`
- **Mute**: `M`

Destroy all enemies to advance to the next level. Dodge incoming fire and catch power-ups to survive!

## ✨ Features

- **🪐 Solar System Progression** — Each level features a different planet from the solar system (Neptune → Mercury, then the Sun, then randomized!)
- **👽 Dynamic Enemies** — 50 enemies in formation; groups peel off to dive at you in waves
- **💪 4 Power-Ups** — Double Shot, Rapid Fire, Speed Boost, Shield
- **📊 High Score Persistence** — Your best score saved to browser storage
- **🎵 Retro Sounds** — 8 synthesized arcade sounds (Web Audio API, no audio files)
- **∞ Infinite Levels** — Difficulty scales forever; no ceiling
- **🎨 Pure Pixel Art** — Procedurally drawn sprites, no image assets

## 💥 Power-Ups

| Icon | Effect | Duration |
|------|--------|----------|
| **R** | Rapid Fire | 10 seconds |
| **S** | Speed Boost | 10 seconds |
| **D** | Double Shot | 10 seconds |
| **H** | Shield (3 hits) | 10 seconds |

Catch falling power-ups from defeated enemies. Grab the same type again to reset the timer!

## 🛠️ Technical

**Built with:**
- **HTML5 Canvas** — All graphics drawn procedurally
- **Vanilla JavaScript** — Zero dependencies, no frameworks
- **Web Audio API** — Sounds generated in real-time
- **localStorage** — High score persistence

**File structure:**
```
starsiege/
├── index.html    # Game canvas and page structure
├── game.js       # All game logic (50+ KB, fully commented)
├── style.css     # Minimal styling
├── PRD.md        # Full product spec (for developers)
└── README.md     # This file
```

**Performance:**
- Runs at 60 FPS on modern browsers
- Frame-rate independent physics (delta-time based)
- ~480×640 pixel retro resolution

## 🎯 Game Design

**Difficulty Scaling:**
- Enemies drift faster each level
- Dive attacks become more frequent as you kill enemies
- Bullet frequency capped to prevent spam
- Balanced difficulty curve

**Visual Style:**
- 2×2 pixel rendering for authentic arcade feel
- Starfield background
- Rotating planets (with special animation for Saturn's rings and Jupiter's Great Red Spot)
- Colorful enemy sprites (orange Flagships, cyan Cruisers, magenta Grunts)

## 📚 Full Spec

See `PRD.md` for complete technical documentation including:
- Detailed enemy AI and dive mechanics
- Collision detection system
- Level scaling formulas
- Audio synthesis details
- Architecture notes

## 🚀 Deploy

Host on any static web server:

```bash
# GitHub Pages (free)
# Upload index.html, game.js, style.css to gh-pages branch

# Or any hosting:
scp *.{html,js,css} user@example.com:/var/www/starsiege/
```

No build step, no dependencies, no database needed.

## 🎉 Credits

Created with vanilla JavaScript and a love for retro arcade games.

---

**Ready to defend your ship?** Open `index.html` and press SPACE! 🚀
