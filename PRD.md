# Star Siege - Arcade Shooter - Product Requirements Document

## Overview
Build a browser-based 2D arcade shooter with Star Siege, an original arcade game. The player controls a ship at the bottom of the screen defending against alien formations at the top. Enemies break formation in groups to dive at the player in sine-wave attack patterns.

## Core Gameplay

### Player
- **Control**: Arrow keys (left/right) to move horizontally
- **Firing**: Spacebar for auto-fire (continuous bullets while held)
- **Position**: Bottom center of screen
- **Movement speed**: 200 px/s (boosted to 340 with speed power-up)
- **Shoot rate**: 1 bullet per 0.35s (0.12s with rapid fire)

### Enemies
- **Formation**: 5×10 grid at top of screen
  - Row 0: 2 Flagships (30 pts, 2 HP) at cols 4-5
  - Rows 1-2: 8 Cruisers (20 pts, 1 HP each)
  - Rows 3-4: 20 Grunts (10 pts, 1 HP each)

- **Formation behavior**:
  - Drifts left-right as a unit, bouncing at screen edges (bounds: -15 to +25 offsetX)
  - Entire formation stays visible on-screen at all times
  - Drift speed increases per level
  - Groups of 1-3 enemies peel off on a timer to attack

- **Attack pattern** (3-phase dive):
  1. **Peel arc**: 180° arc outward over ~0.8s (left formation peels left, right peels right)
  2. **Sine-wave dive**: Descends toward snapshotted player position with horizontal sine-wave oscillation; if exiting bottom, wraps to top to continue
  3. **Return**: Lerps back to formation slot

- **Dive mechanics**:
  - Groups peel off every 1.0-2.5 seconds (decreasing with level)
  - Max 3-7 simultaneous divers (increases with level)
  - **Aggression scaling**: Attack frequency increases as enemies are destroyed
    - All 50 alive: 2.5s interval (normal)
    - 25 alive: 1.25s interval (2x faster)
    - 10 alive: 0.5s interval (5x faster)
    - Minimum: 0.3x multiplier (remaining enemies attack frantically)
  - Formation enemies shoot downward at measured rate (2.5s cooldown per enemy, formation attempts spawn every 0.4s)
  - All enemy types (grunt, cruiser, flagship) participate in dive attacks
  - Points doubled for killing diving enemies

### Collision Detection
- **Player bullets vs enemies**: Kill enemy, award points, spawn power-up probabilistically
- **Enemy bullets vs player**: Damage player (shield absorbs up to 3 hits if active), kill on subsequent hit if no shield
- **Enemy ship vs player ship**: Kamikaze hit—damages player same as bullet
- **Player vs power-ups**: Collect, activate effect for 10 seconds

### Lives & Game Over
- Start with 3 lives
- Lose 1 life per hit (shield absorbs up to 3 hits before expiring)
- Game over when lives reach 0
- High score persisted to browser localStorage

## Power-Ups

Drop from killed enemies (probabilistically):
- **Grunt**: 12% drop chance
- **Cruiser**: 20% drop chance
- **Flagship**: 40% drop chance

When dropped, 4 equal-weight power-up types (25% each):

| Type | Effect | Duration |
|------|--------|----------|
| **Double Shot** | Fire 2 bullets side-by-side | 10s |
| **Rapid Fire** | shootCooldown 0.35s → 0.12s | 10s |
| **Speed Boost** | speed 200 → 340 px/s | 10s |
| **Shield** | Absorbs 3 incoming hits | 10s |

- Power-ups fall at 60 px/s downward
- Lost if they exit bottom of screen
- Applying same effect resets its timer (no stacking bonuses)
- Visual pulse animation + countdown timer display on HUD

### Shield Details
- Visual: Green circle around player, turns yellow after 2nd hit (when 1 hit remains)
- Durability: 3 hits before disappearing
  - After 1st hit: circle stays green
  - After 2nd hit: circle turns yellow, indicating last hit remaining
  - After 3rd hit: shield is consumed, player is vulnerable
- Shield can expire via timer (10s) without being hit, same as other power-ups
- HUD indicator updates color to match shield status

## Levels & Progression

### Level Scaling

Difficulty increases smoothly with each level:

| Parameter | Formula | Base → Level 5 |
|-----------|---------|-----------------|
| Formation drift speed | 40 + (level-1) × 8 | 40 → 72 px/s |
| Dive group interval | max(2.5 - (level-1)×0.2, 1.0) | 2.5 → 1.4s |
| Max simultaneous divers | min(3 + ⌊level/2⌋, 7) | 3 → 5 enemies |
| Dive speed | 120 + (level-1) × 10 | 120 → 160 px/s |
| Dive sine amplitude | 8 px | Narrow side-to-side wiggle |

**Enemy Shooting** (tuned for balanced difficulty):
- Per-enemy shoot cooldown: 2.5s base (with ±1.0s variation)
- Formation-wide spawn cooldown: 0.4s (limits bullet spam)
- Result: ~2.5 bullets/sec maximum from entire formation (v1.0 tuning)

**Dive Attack Pattern** (3-phase per enemy):
1. **Peel arc** (0.8s): Enemy exits formation with 180° arc (left formation peels left, right peels right)
2. **Sine-wave dive**: Enemy descends toward snapshotted player position with 8px horizontal oscillation
3. **Return** (variable): Enemy lerps back to formation slot once exiting bottom of screen

### Level Complete
- Triggered when all enemies in formation are destroyed
- 3-second transition screen
- Award bonus: `lives × 500 + level × 100`
- Next level starts with `level++`, formation rebuilt with new config

## User Interface

### HUD (Heads-Up Display)
- **Top-left**: `SCORE: [number]` (white text)
- **Top-center**: `HI: [highScore]` (persisted to localStorage)
- **Top-right**: `LVL [number]`
- **Top-center (below HI)**: `★ GOD ★` indicator (magenta, only when god mode is active)
- **Bottom-left**: Mini ship icons (one per life remaining)
- **Bottom-right**: Active power-up icons with countdown bars (4 colors: yellow/orange/cyan/green)

### States
- **MENU**: Title screen, "Press SPACE to Start" or similar
- **PLAYING**: Active gameplay
- **PAUSED**: Frozen frame with "PAUSED" overlay (P key toggles)
- **LEVEL_COMPLETE**: "LEVEL COMPLETE + score bonus" + 3s countdown
- **GAME_OVER**: "GAME OVER + final score" with option to restart

## Visual Style

### Retro Pixel Art (Canvas Drawing)
- **Pixel size**: `PX = 2` (each logical pixel = 2×2 canvas pixels)
- **Canvas dimensions**: 480×640 (width × height)
- **Background**: Solid black (#000) with 80 static white star dots scattered across screen
- **No external image assets**—all sprites drawn procedurally with `ctx.fillRect()` calls

### Sprite Designs
- **Player ship**: 14×12 logical pixels (~28×24 canvas pixels), hull color #88f (light blue), engine glow #ff0 (yellow)
- **Grunt enemy**: 12×10 pixels, color #f0f (magenta), 2-frame wing-flap animation
- **Cruiser enemy**: Larger, color #0ff (cyan), more elongated silhouette
- **Flagship enemy**: 14×12 pixels, color #f80 (orange), dome + cannons, flashes white when taking first hit (2 HP total)
- **Player bullet**: 3×10 pixels, color #ff0 (yellow) with white center highlight
- **Enemy bullet**: 3×8 pixels, color #f44 (red)
- **Power-ups**: 16×16 pixels, unique color + single-letter label, pulsing opacity animation
- **Explosions**: 8-12 colored particles bursting from kill point, shrinking over 0.4-0.7s

### Background Planets
- **Feature**: Rotating planet displayed in background (above center screen)
- **Level progression**:
  - **Levels 1–8**: Solar System planets in order (Neptune → Mercury)
    - Level 1: Neptune (dark blue, 90px)
    - Level 2: Uranus (cyan, 82px)
    - Level 3: Saturn (golden with rings, 97px)
    - Level 4: Jupiter (orange/tan with stripes & Great Red Spot, 105px)
    - Level 5: Mars (red, 67px)
    - Level 6: Earth (blue/green with continents & clouds, 75px)
    - Level 7: Venus (yellowish/beige, 72px)
    - Level 8: Mercury (gray, 52px)
  - **Level 9**: The Sun (orange/yellow with corona rays, 120px)
  - **Levels 10+**: All 8 planets cycle in randomized order, reshuffling after each complete cycle
- **Animation**: Continuous gentle rotation at 0.5°/frame; corona rays on Sun also rotate
- **Rendering**: Pixel art style, drawn in front of starfield but behind game entities
- **Implementation**: Custom off-screen canvas per planet with procedural pixel art rendering

## Audio

### Web Audio API (Synthesized, No Audio Files)
All sounds generated using OscillatorNodes and GainNodes. AudioContext resumption on first keydown (browser autoplay policy).

| Sound | Type | Frequency/Duration |
|-------|------|-------------------|
| **Player shoot** | Square wave | 880→440 Hz over 80ms |
| **Enemy shoot** | Square wave | 330→220 Hz over 100ms |
| **Small explosion** | White noise + lowpass | 200ms decay |
| **Large explosion** | White noise + lowpass | 500ms decay |
| **Power-up collect** | Arpeggio | 440, 550, 660 Hz (80ms each) |
| **Enemy dive** | Sawtooth + LFO | 440→220 Hz over 600ms |
| **Level complete** | Quarter notes | C5-E5-G5-C6 (150ms each) |
| **Game over** | Descending chord | G4-E4-C4 (400ms simultaneous) |

**Controls**:
- **M key**: Toggles mute on/off
- **G key**: Toggles god mode on/off (cheat for testing — invincibility + one-hit kills)

## Technical Implementation

### Tech Stack
- **HTML5 Canvas** (2D drawing API)
- **Vanilla JavaScript** (no frameworks or build tools)
- **Web Audio API** (synthesized sounds)
- **localStorage** (high score persistence)

### File Structure
```
star-siege/
├── index.html    # Canvas element, HUD container, loads game.js
├── game.js       # All game logic (~1200-1500 lines)
└── style.css     # Minimal styling: black bg, canvas centering, image-rendering: pixelated
```

### Key Classes
1. **Game** — State machine, game loop, collision orchestration
2. **InputHandler** — Keyboard state tracking (`keys` Set + `justPressed` Set)
3. **Player** — Ship movement, shooting, power-up effects, damage
4. **Formation** — 5×10 grid, drift, dive group triggers
5. **Enemy** — Per-enemy state machine (formation→peeling→diving→returning)
6. **Bullet** — Player and enemy projectiles (separate arrays)
7. **PowerUp** — Falling collectible with pulse animation
8. **Explosion** — Particle burst on kill
9. **AudioManager** — Web Audio API sound synthesis and playback
10. **Planet** — Background planet with pixel art rendering and rotation animation

### Game Loop
```
requestAnimationFrame(gameLoop):
  dt = (timestamp - lastTime) / 1000 (capped at 50ms)

  switch(state):
    PLAYING:        update(dt) → checkCollisions() → draw()
    PAUSED:         draw() (frozen frame + overlay)
    LEVEL_COMPLETE: updateTransition(dt) → draw()
    GAME_OVER:      updateGameOver(dt) → draw()
    MENU:           updateMenu(dt) → draw()
```

### Collision Detection
- **Method**: AABB (Axis-Aligned Bounding Boxes)
- **Hitbox inset**: 4px from sprite edge for fairer gameplay
- **Check order per frame**:
  1. Player bullets → enemies
  2. Enemy bullets → player
  3. Enemy ships → player ship
  4. Player → power-ups

## Acceptance Criteria

### Functional (v1.0 Complete)
- [x] Player moves left/right with arrow keys, fires with spacebar (auto-fire while held)
- [x] Enemy formation builds and drifts left-right, bouncing at edges
- [x] Groups of enemies (1-3) peel off on timer and dive with sine-wave motion, then return
- [x] All 4 collision types register and resolve correctly
- [x] Score updates on kills (doubled for diving enemies), +50 per power-up
- [x] Power-ups drop (12-40% by enemy type), fall, collect, and apply effects for 10s
- [x] Lives system (start with 3, lose 1 per hit, shield absorbs up to 3 hits)
- [x] Game over when lives reach 0; respawn with invincibility flashing
- [x] Level complete triggers on all enemies killed, 3s transition screen with bonus calculation
- [x] Level 2+ noticeably faster (drift, dive rate, enemy count scale with level)
- [x] High score persists to localStorage across page reloads
- [x] All 8 sounds play with Web Audio API; M key toggles mute
- [x] Pause (P key) freezes gameplay and displays current score/level
- [x] Enhanced menu with controls legend and blinking start prompt
- [x] Game over screen with new record detection and level reached display
- [x] Background planets display in order by level (Neptune→Mercury) with gentle rotation animation
- [x] Planets rendered in pixel art style, positioned above center screen, in front of starfield
- [x] Level 9 features the Sun with rotating corona rays (no win condition, game continues)
- [x] Levels 10+ randomize planet order from 8-planet cycle (reshuffles every 8 levels)
- [x] God mode cheat (G key): invincibility + one-hit kills, with HUD indicator

### Technical
- [ ] Single HTML file or minimal file set (index.html + game.js + style.css)
- [ ] No external dependencies or build tools
- [ ] Runs at 60 FPS (verified with DevTools)
- [ ] Frame-rate independent physics (delta time)
- [ ] All sprites drawn with Canvas API (no image files)
- [ ] Game playable directly from file:// URL (no server needed)

## Deployment
- Copy `index.html`, `game.js`, `style.css` to a web server or folder
- Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
- No build step or transpilation required
- **No server needed** — works as a local file (file:// URL)

## Game Balance (v1.0)

**Difficulty Tuning:**
- **Bullet frequency**: Reduced from original design to prevent bullet spam
  - Formation attempts to spawn bullets every 0.4s (down from every frame)
  - Per-enemy shoot cooldown: 2.5s (prevents overly aggressive shooting)
- **Result**: ~2.5 bullets/sec max from entire 50-enemy formation
- **Dive attacks**: More frequent and aggressive as enemies are eliminated
  - Early game: Moderate attack frequency (every 2.5s per level)
  - Mid game: Enemies attack more frequently (aggressionFactor scales with remaining count)
  - End game: Last enemies attack frantically (up to 5x faster)
  - This creates escalating tension as player approaches victory
- **Dive kinematics**: Slower, more dodgeable attacks
  - Dive speed: 120-160 px/s (manageable pace)
  - Sine amplitude: 8px (subtle wiggle, not erratic)
  - Enemies clamped to screen bounds during dives (no off-screen attacks)
- **Formation bounds**: Drift range -15 to +25 offsetX (keeps enemies fully visible)
- **Scaling**: Difficulty increases gradually each level via drift speed, dive rate, and enemy count
- **Player agency**: Power-ups provide meaningful advantages (double shot, rapid fire, speed, shield)

## Testing & Cheats

### God Mode (Development Cheat)
- **Toggle**: Press **G** during gameplay
- **Effect**:
  - Player takes no damage from enemy bullets or ships
  - All enemies die in 1 hit (no need for 2 hits on flagships)
  - Magenta **★ GOD ★** label displays on HUD when active
- **Use case**: Test all levels and planets without dying; verify level progression and planet rotation

## Future Enhancements (Out of Scope for v1)
- Boss encounters
- Win condition at level 9 (Sun) or configurable max level
- Difficulty modifiers (waves, formation variations)
- Leaderboard (server-side)
- Mobile touch controls
- Screenshake on impact
- Parallax starfield
- Enemy special attacks (bombs, lasers)
- Combo multipliers
- Enemy type variations (different sprite colors, behaviors)
