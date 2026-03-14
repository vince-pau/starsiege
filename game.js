// ============================================================================
// STAR SIEGE - ARCADE SHOOTER
// ============================================================================

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;
const PX = 2; // Pixel size for retro look (1 logical pixel = 2x2 canvas pixels)

// ============================================================================
// INPUT HANDLER
// ============================================================================

class InputHandler {
  constructor() {
    this.keys = new Set();
    this.justPressed = new Set();
    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (!this.keys.has(key)) {
        this.justPressed.add(key);
      }
      this.keys.add(key);
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keys.delete(key);
      this.justPressed.delete(key);
    });
  }

  isPressed(key) {
    return this.keys.has(key.toLowerCase());
  }

  isJustPressed(key) {
    return this.justPressed.has(key.toLowerCase());
  }

  update() {
    // Clear justPressed at end of frame
    this.justPressed.clear();
  }
}

// ============================================================================
// STARFIELD
// ============================================================================

class Starfield {
  constructor() {
    this.stars = [];
    this.generateStars();
  }

  generateStars() {
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() < 0.8 ? 1 : 2,
        brightness: 0.3 + Math.random() * 0.7
      });
    }
  }

  draw(ctx) {
    this.stars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  }
}

// ============================================================================
// PLANET
// ============================================================================

class Planet {
  constructor(level) {
    this.level = level;
    this.rotation = 0;
    this.rotationSpeed = 0.5; // degrees per frame

    // Planet data: [name, color1, color2, size]
    const planetData = {
      1: { name: 'Neptune', color1: '#1a4d7a', color2: '#4da6ff', size: 90 },
      2: { name: 'Uranus', color1: '#5dade2', color2: '#aed6f1', size: 82 },
      3: { name: 'Saturn', color1: '#f9d56e', color2: '#d4a574', size: 97 },
      4: { name: 'Jupiter', color1: '#d9a574', color2: '#8b5a2b', size: 105 },
      5: { name: 'Mars', color1: '#cd5c5c', color2: '#8b3a3a', size: 67 },
      6: { name: 'Earth', color1: '#1a5a96', color2: '#2d9e2d', size: 75 },
      7: { name: 'Venus', color1: '#e6d4a3', color2: '#d4a574', size: 72 },
      8: { name: 'Mercury', color1: '#a9a9a9', color2: '#696969', size: 52 },
      9: { name: 'Sun', color1: '#ff9900', color2: '#ffdd00', size: 120 }
    };

    const data = planetData[this.level];
    this.name = data.name;
    this.color1 = data.color1;
    this.color2 = data.color2;
    this.planetSize = data.size;

    // Screen position
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 3;

    // Create planet canvas (larger for rings)
    this.planetCanvas = document.createElement('canvas');
    this.planetCanvas.width = this.planetSize * 3;
    this.planetCanvas.height = this.planetSize * 3;
    this.planetCtx = this.planetCanvas.getContext('2d');

    this.renderPlanet();
  }

  renderPlanet() {
    const ctx = this.planetCtx;
    const size = this.planetSize;
    const centerX = size * 1.5;
    const centerY = size * 1.5;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, size * 3, size * 3);

    if (this.level === 3) {
      // Saturn with rings
      ctx.strokeStyle = '#c4a674';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, size * 1.3, size * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Main body
      ctx.fillStyle = this.color1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Bands
      ctx.fillStyle = this.color2;
      ctx.fillRect(centerX - size * 0.6, centerY - size * 0.2, size * 1.2, size * 0.15);
      ctx.fillRect(centerX - size * 0.6, centerY + size * 0.1, size * 1.2, size * 0.1);
    } else if (this.level === 4) {
      // Jupiter with stripes
      ctx.fillStyle = this.color1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Stripes
      ctx.fillStyle = this.color2;
      ctx.fillRect(centerX - size * 0.7, centerY - size * 0.5, size * 1.4, size * 0.25);
      ctx.fillRect(centerX - size * 0.7, centerY - size * 0.05, size * 1.4, size * 0.2);
      ctx.fillRect(centerX - size * 0.7, centerY + size * 0.35, size * 1.4, size * 0.2);

      // Great Red Spot
      ctx.fillStyle = '#aa6644';
      ctx.beginPath();
      ctx.ellipse(centerX + size * 0.2, centerY + size * 0.3, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.level === 6) {
      // Earth with water and land
      ctx.fillStyle = '#1a5a96';
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Land masses
      ctx.fillStyle = '#2d9e2d';
      // North America
      ctx.beginPath();
      ctx.ellipse(centerX - size * 0.3, centerY - size * 0.2, size * 0.15, size * 0.2, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // Africa
      ctx.beginPath();
      ctx.ellipse(centerX + size * 0.1, centerY + size * 0.1, size * 0.12, size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cloud swirls (white)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.ellipse(centerX - size * 0.25, centerY - size * 0.4, size * 0.1, size * 0.08, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.level === 9) {
      // Sun with corona rays
      ctx.fillStyle = '#ff6600';
      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.72);
        ctx.lineTo(size * 0.08, -size * 0.95);
        ctx.lineTo(-size * 0.08, -size * 0.95);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      // Main body
      ctx.fillStyle = '#ff9900';
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      // Bright center highlight
      ctx.fillStyle = '#ffee44';
      ctx.beginPath();
      ctx.arc(centerX - size * 0.1, centerY - size * 0.1, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Simple two-color sphere for other planets
      // Gradient effect by drawing multiple circles
      ctx.fillStyle = this.color1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Lighter shade on one side
      ctx.fillStyle = this.color2;
      ctx.beginPath();
      ctx.arc(centerX + size * 0.15, centerY - size * 0.15, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  update(dt) {
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(this.planetCanvas, -this.planetSize * 1.5, -this.planetSize * 1.5);
    ctx.restore();
  }
}

// ============================================================================
// BULLET
// ============================================================================

class Bullet {
  constructor(x, y, owner) {
    this.x = x;
    this.y = y;
    this.owner = owner; // 'player' or 'enemy'
    this.active = true;

    if (owner === 'player') {
      this.width = 3;
      this.height = 10;
      this.vy = -240; // px/s, upward
      this.color = '#ff0';
    } else {
      this.width = 3;
      this.height = 8;
      this.vy = 180; // px/s, downward
      this.color = '#f44';
    }
  }

  update(dt) {
    this.y += this.vy * dt;

    // Deactivate if off-screen
    if (this.y < -this.height || this.y > CANVAS_HEIGHT) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Highlight for player bullets
    if (this.owner === 'player') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(this.x + 1, this.y + 2, 1, 6);
    }
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

// ============================================================================
// PLAYER
// ============================================================================

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 14 * PX;
    this.height = 12 * PX;

    this.speed = 200; // px/s
    this.shootCooldown = 0;
    this.shootRate = 1 / 0.35; // bullets per second (every 0.35s)

    this.lives = 3;
    this.isAlive = true;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.flashTimer = 0;

    this.activeEffects = new Map(); // effect name -> time remaining
    this.hasShield = false;
    this.shieldHits = 0;

    // Sprite grid: 14x12
    this.spriteGrid = [
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 2, 1, 2, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
      [1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0],
      [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  update(dt, input, gameWidth) {
    if (!this.isAlive) return;

    // Tick invincibility
    if (this.invincible) {
      this.invincibleTimer -= dt;
      this.flashTimer -= dt;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // Tick active effects
    this.tickEffects(dt);

    // Movement
    const currentSpeed = this.activeEffects.has('speedBoost') ? 340 : 200;
    if (input.isPressed('arrowleft')) {
      this.x -= currentSpeed * dt;
    }
    if (input.isPressed('arrowright')) {
      this.x += currentSpeed * dt;
    }

    // Clamp to screen bounds
    this.x = Math.max(0, Math.min(this.x, gameWidth - this.width));

    // Shooting
    this.shootCooldown -= dt;
  }

  tickEffects(dt) {
    for (let [effect, timer] of this.activeEffects) {
      timer -= dt;
      if (timer <= 0) {
        this.activeEffects.delete(effect);
        if (effect === 'shield') this.hasShield = false;
      } else {
        this.activeEffects.set(effect, timer);
      }
    }
  }

  shoot() {
    if (this.shootCooldown > 0) return [];

    const bulletSpeed = this.activeEffects.has('rapidFire') ? 0.12 : 0.35;
    this.shootCooldown = bulletSpeed;

    const bullets = [];
    const centerX = this.x + this.width / 2;
    const centerY = this.y;

    if (this.activeEffects.has('doubleShot')) {
      bullets.push(new Bullet(centerX - 6, centerY, 'player'));
      bullets.push(new Bullet(centerX + 6, centerY, 'player'));
    } else {
      bullets.push(new Bullet(centerX - 1.5, centerY, 'player'));
    }

    return bullets;
  }

  applyPowerUp(type) {
    const EFFECT_DURATION = 10;

    if (type === 'doubleShot') {
      this.activeEffects.set('doubleShot', EFFECT_DURATION);
    } else if (type === 'rapidFire') {
      this.activeEffects.set('rapidFire', EFFECT_DURATION);
    } else if (type === 'speedBoost') {
      this.activeEffects.set('speedBoost', EFFECT_DURATION);
    } else if (type === 'shield') {
      this.hasShield = true;
      this.shieldHits = 3;
      this.activeEffects.set('shield', EFFECT_DURATION);
    }
  }

  takeDamage() {
    if (this.invincible) return false;

    if (this.hasShield) {
      this.shieldHits--;
      if (this.shieldHits <= 0) {
        this.hasShield = false;
        this.activeEffects.delete('shield');
      }
      return false; // Survived via shield
    }

    this.isAlive = false;
    return true; // Killed
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.isAlive = true;
    this.invincible = true;
    this.invincibleTimer = 1.5;
    this.flashTimer = 1.5;
  }

  draw(ctx) {
    if (!this.isAlive) return;

    // Flashing effect during invincibility
    if (this.invincible && this.flashTimer > 0) {
      if (Math.sin(this.flashTimer * Math.PI * 4) < 0) {
        return; // Skip drawing for flashing effect
      }
    }

    this.drawSprite(ctx);

    // Draw shield if active
    if (this.hasShield) {
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;
      const radius = 22;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = this.shieldHits <= 1 ? '#ff0' : '#0f0'; // yellow on last hit
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawSprite(ctx) {
    const hullColor = '#88f';
    const accentColor = '#ff0';

    for (let row = 0; row < this.spriteGrid.length; row++) {
      for (let col = 0; col < this.spriteGrid[row].length; col++) {
        const pixel = this.spriteGrid[row][col];
        if (pixel === 0) continue;

        const px = this.x + col * PX;
        const py = this.y + row * PX;
        const color = pixel === 2 ? accentColor : hullColor;

        ctx.fillStyle = color;
        ctx.fillRect(px, py, PX, PX);
      }
    }
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

// ============================================================================
// EXPLOSION
// ============================================================================

class Explosion {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.particles = [];
    this.active = true;

    // Spawn 8-12 particles
    const particleCount = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 80 + Math.random() * 120;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.4 + Math.random() * 0.3,
        size: 2 + Math.random() * 3,
        color: Math.random() < 0.5 ? color : '#fff'
      });
    }
  }

  update(dt) {
    this.particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    });

    this.particles = this.particles.filter(p => p.life > 0);
    if (this.particles.length === 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    this.particles.forEach(p => {
      const opacity = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }
}

// ============================================================================
// ENEMY
// ============================================================================

class Enemy {
  constructor(row, col, homeX, homeY) {
    this.id = Math.random();
    this.row = row;
    this.col = col;
    this.homeX = homeX;
    this.homeY = homeY;
    this.x = homeX;
    this.y = homeY;

    this.width = 12 * PX;
    this.height = 10 * PX;

    // Determine type based on row
    if (row === 0) {
      this.type = 'flagship';
      this.color = '#f80';
      this.pointValue = 30;
      this.hp = 2;
    } else if (row <= 2) {
      this.type = 'cruiser';
      this.color = '#0ff';
      this.pointValue = 20;
      this.hp = 1;
    } else {
      this.type = 'grunt';
      this.color = '#f0f';
      this.pointValue = 10;
      this.hp = 1;
    }

    this.state = 'formation'; // formation, peeling, diving, returning, dead
    this.animFrame = 0;
    this.animTimer = 0.15;

    // Dive state machine
    this.divePhase = 0;
    this.diveTarget = { x: 0, y: 0 };
    this.diveStartX = 0;
    this.diveStartY = 0;
    this.diveLoopAngle = 0;
    this.diveLoopPhase = 'arc'; // arc, dive, return

    this.shootCooldown = Math.random() * 3;
    this.shootRate = 2.5; // seconds between shots (increased from 1.5)

    // Sprite grids (wing-flap animation)
    this.spriteGrids = this.getSpriteGrids();
  }

  getSpriteGrids() {
    // Grunt: 12x10
    const grunt = [
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 0, 1, 1, 2, 2, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const gruntWings = [
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    return [grunt, gruntWings];
  }

  update(dt, formationOffsetX, level = 1) {
    // Tick shooting cooldown
    this.shootCooldown -= dt;

    if (this.state === 'formation') {
      // Update position from formation offset
      this.x = this.homeX + formationOffsetX;
      this.y = this.homeY;

      // Animate wings
      this.animTimer -= dt;
      if (this.animTimer <= 0) {
        this.animFrame = (this.animFrame + 1) % 2;
        this.animTimer = 0.15;
      }
    } else if (this.state === 'peeling') {
      this.updatePeeling(dt);
    } else if (this.state === 'diving') {
      this.updateDiving(dt, level);
    } else if (this.state === 'returning') {
      this.updateReturning(dt);
    }
  }

  canShoot() {
    return this.shootCooldown <= 0 && (this.state === 'formation' || this.state === 'diving');
  }

  shoot(audio) {
    if (!this.canShoot()) return null;

    this.shootCooldown = this.shootRate + Math.random() * 1.0;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height;

    // Diving enemies make a dive sound
    if (this.state === 'diving' && audio) {
      audio.playEnemyDive();
    }

    return new Bullet(centerX - 1.5, centerY, 'enemy');
  }

  updatePeeling(dt) {
    // Arc outward for ~0.8 seconds
    const peelDuration = 0.8;
    const arcRadius = 40;
    const direction = this.col < 5 ? -1 : 1;

    this.divePhase += dt / peelDuration;

    if (this.divePhase >= 1) {
      // Transition to diving
      this.divePhase = 0;
      this.state = 'diving';
      this.diveStartX = this.x;
      this.diveStartY = this.y;
      return;
    }

    // Parametric arc: outward then forward
    const angle = this.divePhase * Math.PI;
    this.x = this.homeX + Math.sin(angle) * arcRadius * direction;
    this.y = this.homeY - (1 - Math.cos(angle)) * arcRadius;
  }

  updateDiving(dt, level) {
    const diveSpeed = 120 + (level - 1) * 10;  // Reduced from 180 base
    const sineAmplitude = 8;                     // Reduced from 30 → much narrower movement
    const sineFrequency = 2.0;                   // Reduced from 2.5

    this.divePhase += sineFrequency * dt;

    // Move toward target with sine-wave oscillation
    const dx = this.diveTarget.x - this.diveStartX;
    const dy = this.diveTarget.y - this.diveStartY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);

    this.x += Math.cos(angle) * diveSpeed * dt + Math.sin(this.divePhase) * sineAmplitude * perpX;
    this.y += Math.sin(angle) * diveSpeed * dt + Math.sin(this.divePhase) * sineAmplitude * perpY;

    // Clamp to screen bounds during dive
    this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));

    // Wrap to top if exiting bottom
    if (this.y > CANVAS_HEIGHT) {
      this.y = -this.height;
      this.state = 'returning';
    }
  }

  updateReturning(dt) {
    const returnSpeed = 160;
    const targetX = this.homeX;
    const targetY = this.homeY;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 4) {
      this.x = targetX;
      this.y = targetY;
      this.state = 'formation';
      return;
    }

    this.x += (dx / dist) * returnSpeed * dt;
    this.y += (dy / dist) * returnSpeed * dt;
  }

  startDive(targetX, targetY) {
    this.state = 'peeling';
    this.divePhase = 0;
    this.diveTarget = { x: targetX, y: targetY };
    this.diveStartX = this.x;
    this.diveStartY = this.y;
  }

  draw(ctx) {
    if (this.state === 'dead') return;

    const grid = this.spriteGrids[this.animFrame];
    const hullColor = this.color;
    const accentColor = '#ff0';

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const pixel = grid[row][col];
        if (pixel === 0) continue;

        const px = this.x + col * PX;
        const py = this.y + row * PX;
        const color = pixel === 2 ? accentColor : hullColor;

        ctx.fillStyle = color;
        ctx.fillRect(px, py, PX, PX);
      }
    }
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

// ============================================================================
// FORMATION
// ============================================================================

class Formation {
  constructor(level) {
    this.enemies = [];
    this.offsetX = 0;
    this.offsetY = 60 + (level - 1) * 8;
    this.driftSpeed = 40 + (level - 1) * 8;
    this.driftDir = 1;
    this.level = level;

    this.diveGroupCooldown = 0;
    this.diveGroupInterval = Math.max(2.5 - (level - 1) * 0.2, 1.0);  // More frequent attacks
    this.maxSimultaneousDivers = Math.min(3 + Math.floor(level / 2), 7);  // More concurrent divers
    this.currentDivers = 0;

    this.shootCooldown = 0;
    this.shootInterval = 0.4; // Only try to shoot every 0.4s (reduced bullet spawn rate)

    this.build();
  }

  build() {
    this.enemies = [];

    const cols = 10;
    const rows = 5;
    const spacingX = 44;
    const spacingY = 36;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const homeX = col * spacingX + 20;
        const homeY = this.offsetY + row * spacingY;
        const enemy = new Enemy(row, col, homeX, homeY);
        this.enemies.push(enemy);
      }
    }
  }

  update(dt, playerX, playerY) {
    // Drift left-right
    this.offsetX += this.driftSpeed * this.driftDir * dt;

    // Check bounds - keep formation fully on-screen
    // Formation: col 0 at 20px, col 9 at 20 + 9*44 = 416px
    // Enemy width is 12*PX = 24px
    // Rightmost edge: 416 + 24 = 440px (but canvas is only 480px wide)
    // Safe bounds: allow no more than ~20px margin on each side
    const minX = -15;  // Slight left drift allowed
    const maxX = 25;   // Slight right drift allowed (keeps rightmost edge at ~440px)

    if (this.offsetX < minX) {
      this.offsetX = minX;
      this.driftDir = 1;
    }
    if (this.offsetX > maxX) {
      this.offsetX = maxX;
      this.driftDir = -1;
    }

    // Update all enemies
    this.enemies.forEach(enemy => {
      enemy.update(dt, this.offsetX, this.level);
    });

    // Trigger dive groups - attack more frequently as enemies dwindle
    this.diveGroupCooldown -= dt;
    if (this.diveGroupCooldown <= 0 && this.currentDivers < this.maxSimultaneousDivers) {
      this.triggerDiveGroup(playerX, playerY);

      // Fewer enemies = more aggressive attacks
      const aliveCount = this.countAlive();
      const aggressionFactor = Math.max(0.3, aliveCount / 50); // Scales from 0.3 (few alive) to 1.0 (all alive)
      this.diveGroupCooldown = this.diveGroupInterval * aggressionFactor;
    }

    // Tick shoot cooldown
    this.shootCooldown -= dt;
  }

  getEnemyBullets(audio) {
    const bullets = [];

    // Only attempt to spawn bullets on cooldown (reduces fire rate)
    if (this.shootCooldown > 0) return bullets;

    this.shootCooldown = this.shootInterval;

    // Random enemy shoots
    const aliveEnemies = this.enemies.filter(e => e.state !== 'dead');
    if (aliveEnemies.length > 0) {
      const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      const bullet = shooter.shoot(audio);
      if (bullet) bullets.push(bullet);
    }
    return bullets;
  }

  triggerDiveGroup(playerX, playerY) {
    const aliveEnemies = this.enemies.filter(e => e.state === 'formation');
    if (aliveEnemies.length === 0) return;

    // Pick a random column
    const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    const col = randomEnemy.col;

    // Get all formation enemies in this column
    const columnEnemies = aliveEnemies.filter(e => e.col === col);
    if (columnEnemies.length === 0) return;

    // Pick 1-3 from bottom of column
    const groupSize = Math.min(Math.ceil(Math.random() * 3), columnEnemies.length, this.maxSimultaneousDivers - this.currentDivers);

    for (let i = 0; i < groupSize; i++) {
      const enemy = columnEnemies[columnEnemies.length - 1 - i];
      if (enemy && enemy.state === 'formation') {
        enemy.startDive(playerX, playerY);
        this.currentDivers++;
      }
    }
  }

  enemyDiveFinished() {
    this.currentDivers = Math.max(0, this.currentDivers - 1);
  }

  countAlive() {
    return this.enemies.filter(e => e.state !== 'dead').length;
  }

  draw(ctx) {
    this.enemies.forEach(enemy => {
      enemy.draw(ctx);
    });
  }
}

// ============================================================================
// AUDIO MANAGER
// ============================================================================

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.muted = false;
    this.noiseBuffer = null;
  }

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.3;

    // Resume on first user interaction (browser autoplay policy)
    document.addEventListener('keydown', () => this.resume(), { once: true });

    // Generate white noise buffer
    this.noiseBuffer = this.makeNoiseBuffer();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  makeNoiseBuffer() {
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.5, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  playShoot() {
    if (!this.ctx || this.muted) return;
    this._makeBeep(880, 440, 0.08, 'square', 0.3);
  }

  playEnemyShoot() {
    if (!this.ctx || this.muted) return;
    this._makeBeep(330, 220, 0.1, 'square', 0.25);
  }

  playExplosion(type) {
    if (!this.ctx || this.muted) return;

    if (type === 'small') {
      this._makeNoiseBurst(0.2, 0.5, 800);
    } else {
      this._makeNoiseBurst(0.5, 0.8, 400);
    }
  }

  playPowerUp() {
    if (!this.ctx || this.muted) return;

    const frequencies = [440, 550, 660];
    const now = this.ctx.currentTime;

    frequencies.forEach((freq, i) => {
      const time = now + i * 0.08;
      this._makeBeep(freq, freq, 0.08, 'sine', 0.4, time);
    });
  }

  playEnemyDive() {
    if (!this.ctx || this.muted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();

    osc.connect(gain);
    gain.connect(this.masterGain);
    lfo.connect(osc.frequency);

    osc.type = 'sawtooth';
    lfo.type = 'sine';
    lfo.frequency.value = 8;

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.6);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    lfo.start(now);
    osc.start(now);
    osc.stop(now + 0.61);
    lfo.stop(now + 0.61);
  }

  playLevelComplete() {
    if (!this.ctx || this.muted) return;

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const time = now + i * 0.15;
      this._makeBeep(freq, freq, 0.15, 'sine', 0.3, time);
    });
  }

  playGameOver() {
    if (!this.ctx || this.muted) return;

    const notes = [392, 330, 262]; // G4, E4, C4
    const now = this.ctx.currentTime;

    notes.forEach((freq) => {
      this._makeBeep(freq, freq, 0.4, 'sine', 0.4, now);
    });
  }

  toggle() {
    this.muted = !this.muted;
    this.masterGain.gain.value = this.muted ? 0 : 0.3;
  }

  _makeBeep(freq, endFreq, duration, type, gainVal, time = null) {
    if (!this.ctx) return;

    const now = time || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  _makeNoiseBurst(duration, gainVal, cutoff) {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    src.buffer = this.noiseBuffer;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    filter.type = 'lowpass';
    filter.frequency.value = cutoff;

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.start(now);
    src.stop(now + duration + 0.01);
  }
}

// ============================================================================
// POWER-UP
// ============================================================================

class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 16;
    this.height = 16;
    this.vy = 60; // Falling speed
    this.active = true;
    this.pulseTimer = 0;

    // Type-specific colors and labels
    const typeMap = {
      'doubleShot': { color: '#ff0', label: '2x' },
      'rapidFire': { color: '#f80', label: 'R' },
      'speedBoost': { color: '#0ff', label: 'V' },
      'shield': { color: '#0f0', label: 'S' }
    };

    const info = typeMap[type] || { color: '#fff', label: '?' };
    this.color = info.color;
    this.label = info.label;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.pulseTimer += dt;

    if (this.y > CANVAS_HEIGHT) {
      this.active = false;
    }
  }

  draw(ctx) {
    const opacity = 0.7 + 0.3 * Math.sin(this.pulseTimer * 4);
    ctx.globalAlpha = opacity;

    // Outer box
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Inner darker box
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

    // Letter
    ctx.fillStyle = this.color;
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);

    ctx.globalAlpha = 1;
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  changeType(newType) {
    const typeMap = {
      'doubleShot': { color: '#ff0', label: '2x' },
      'rapidFire': { color: '#f80', label: 'R' },
      'speedBoost': { color: '#0ff', label: 'V' },
      'shield': { color: '#0f0', label: 'S' }
    };
    this.type = newType;
    const info = typeMap[newType];
    this.color = info.color;
    this.label = info.label;
  }
}

// ============================================================================
// GAME CLASS
// ============================================================================

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.state = 'MENU'; // MENU, PLAYING, PAUSED, LEVEL_COMPLETE, GAME_OVER
    this.input = new InputHandler();
    this.starfield = new Starfield();
    this.planet = null;
    this.planetQueue = [];
    this.godMode = false;

    this.score = 0;
    this.highScore = localStorage.getItem('galaxianHighScore') || 0;
    this.lives = 3;
    this.level = 1;

    this.levelTransitionTimer = 0;
    this.levelBonus = 0;

    this.player = null;
    this.bullets = []; // Player bullets
    this.enemyBullets = [];
    this.explosions = [];
    this.powerUps = [];
    this.formation = null;
    this.enemies = []; // Flat array for collision checks

    this.audio = new AudioManager();

    this.lastTime = performance.now();
    this.fpsCounter = 0;
    this.fpsTime = 0;

    this.gameLoop = this.gameLoop.bind(this);
  }

  init() {
    this.audio.init();
    console.log('Game initialized. Press SPACE to start.');
    requestAnimationFrame(this.gameLoop);
  }

  gameLoop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    // FPS counter
    this.fpsCounter++;
    this.fpsTime += dt;
    if (this.fpsTime >= 1) {
      console.log(`FPS: ${this.fpsCounter}`);
      this.fpsCounter = 0;
      this.fpsTime = 0;
    }

    // Update based on state
    if (this.state === 'MENU') {
      this.updateMenu(dt);
    } else if (this.state === 'PLAYING') {
      this.update(dt);
    } else if (this.state === 'PAUSED') {
      if (this.input.isJustPressed('p')) {
        this.state = 'PLAYING';
      }
    } else if (this.state === 'LEVEL_COMPLETE') {
      this.updateLevelComplete(dt);
    } else if (this.state === 'GAME_OVER') {
      this.updateGameOver(dt);
    }

    this.draw();
    this.input.update();

    requestAnimationFrame(this.gameLoop);
  }

  updateMenu(dt) {
    if (this.input.isJustPressed(' ')) {
      this.startGame();
    }
  }

  startGame() {
    this.state = 'PLAYING';
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.startLevel();
  }

  getPlanetKey() {
    if (this.level <= 9) return this.level;
    // Refill queue if empty
    if (this.planetQueue.length === 0) {
      this.planetQueue = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
    }
    return this.planetQueue.shift();
  }

  startLevel() {
    this.player = new Player(CANVAS_WIDTH / 2 - 14, CANVAS_HEIGHT - 80);
    this.bullets = [];
    this.enemyBullets = [];
    this.explosions = [];
    this.powerUps = [];
    this.formation = new Formation(this.level);
    this.enemies = this.formation.enemies;
    this.planet = new Planet(this.getPlanetKey());
  }

  update(dt) {
    // Handle pause
    if (this.input.isJustPressed('p')) {
      this.state = 'PAUSED';
      return;
    }

    // God mode toggle
    if (this.input.isJustPressed('g')) {
      this.godMode = !this.godMode;
    }

    // Update planet
    if (this.planet) this.planet.update(dt);

    // Update player
    this.player.update(dt, this.input, CANVAS_WIDTH);

    // Handle player shooting
    if (this.input.isPressed(' ')) {
      const newBullets = this.player.shoot();
      if (newBullets.length > 0) {
        this.audio.playShoot();
      }
      this.bullets.push(...newBullets);
    }

    // Handle mute toggle
    if (this.input.isJustPressed('m')) {
      this.audio.toggle();
    }

    // Update formation
    this.formation.update(dt, this.player.x + this.player.width / 2, this.player.y);

    // Enemy shooting
    const newEnemyBullets = this.formation.getEnemyBullets(this.audio);
    this.enemyBullets.push(...newEnemyBullets);

    // Update bullets
    this.bullets.forEach(b => b.update(dt));
    this.bullets = this.bullets.filter(b => b.active);

    this.enemyBullets.forEach(b => b.update(dt));
    this.enemyBullets = this.enemyBullets.filter(b => b.active);

    // Power-ups
    this.powerUps.forEach(p => p.update(dt));
    this.powerUps = this.powerUps.filter(p => p.active);

    // Explosions
    this.explosions.forEach(e => e.update(dt));
    this.explosions = this.explosions.filter(e => e.active);

    // Check collisions
    this.checkCollisions();

    // Check level complete
    if (this.formation.countAlive() === 0) {
      this.levelBonus = this.lives * 500 + this.level * 100;
      this.score += this.levelBonus;
      this.levelTransitionTimer = 0;
      this.audio.playLevelComplete();
      this.state = 'LEVEL_COMPLETE';
    }

    // Check game over
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  checkCollisions() {
    // 1. Player bullets vs enemies
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      let hit = false;

      for (let enemy of this.enemies) {
        if (enemy.state === 'dead') continue;

        if (this.aabbOverlap(bullet.getBounds(), enemy.getBounds())) {
          bullet.active = false;
          hit = true;

          // Damage enemy
          if (this.godMode) {
            enemy.hp = 0;
          } else {
            enemy.hp--;
          }
          const awardPoints = enemy.pointValue * (enemy.state === 'diving' ? 2 : 1);
          this.score += awardPoints;

          if (enemy.hp <= 0) {
            const wasDiving = enemy.state === 'diving';
            enemy.state = 'dead';
            this.audio.playExplosion('small');
            this.spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
            if (wasDiving) {
              this.formation.enemyDiveFinished();
            }
            this.spawnPowerUp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.type);
          }

          break;
        }
      }

      if (hit) break;
    }

    // 1b. Player bullets vs power-ups (cycling)
    const types = ['doubleShot', 'rapidFire', 'speedBoost', 'shield'];
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (!bullet.active) continue;

      for (let powerUp of this.powerUps) {
        if (!powerUp.active) continue;

        if (this.aabbOverlap(bullet.getBounds(), powerUp.getBounds())) {
          bullet.active = false;
          // Pick a different type from the current one
          const otherTypes = types.filter(t => t !== powerUp.type);
          const newType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
          powerUp.changeType(newType);
          break;
        }
      }
    }

    // 2. Enemy bullets vs player
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];

      if (this.aabbOverlap(bullet.getBounds(), this.player.getBounds())) {
        bullet.active = false;

        if (!this.godMode && this.player.takeDamage()) {
          // Player killed
          this.lives--;
          this.audio.playExplosion('large');
          this.spawnExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#fff');

          if (this.lives > 0) {
            this.player.respawn(CANVAS_WIDTH / 2 - 14, CANVAS_HEIGHT - 80);
          }
        } else if (!this.godMode) {
          // Shield absorbed the hit
          this.audio.playExplosion('small');
          this.spawnExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#0f0');
        }
      }
    }

    this.enemyBullets = this.enemyBullets.filter(b => b.active);

    // 3. Enemy ships vs player (kamikaze)
    for (let enemy of this.enemies) {
      if (enemy.state === 'dead') continue;
      if (enemy.state !== 'diving') continue;

      if (this.aabbOverlap(enemy.getBounds(), this.player.getBounds())) {
        const wasDiving = enemy.state === 'diving';
        enemy.state = 'dead';
        this.audio.playExplosion('small');
        this.spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
        if (wasDiving) {
          this.formation.enemyDiveFinished();
        }

        if (!this.godMode && this.player.takeDamage()) {
          this.lives--;
          this.audio.playExplosion('large');
          this.spawnExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#fff');
          if (this.lives > 0) {
            this.player.respawn(CANVAS_WIDTH / 2 - 14, CANVAS_HEIGHT - 80);
          }
        } else if (!this.godMode) {
          this.audio.playExplosion('small');
          this.spawnExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#0f0');
        }
      }
    }

    // 4. Player vs power-ups
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];

      if (this.aabbOverlap(powerUp.getBounds(), this.player.getBounds())) {
        powerUp.active = false;
        this.audio.playPowerUp();
        this.player.applyPowerUp(powerUp.type);
        this.score += 50;
        break;
      }
    }
  }

  spawnExplosion(x, y, color) {
    this.explosions.push(new Explosion(x, y, color));
  }

  spawnPowerUp(x, y, enemyType) {
    // Determine drop chance based on enemy type
    let dropChance = 0;
    if (enemyType === 'grunt') dropChance = 0.12;
    else if (enemyType === 'cruiser') dropChance = 0.20;
    else if (enemyType === 'flagship') dropChance = 0.40;

    if (Math.random() > dropChance) return;

    // Pick a random power-up type (25% each)
    const types = ['doubleShot', 'rapidFire', 'speedBoost', 'shield'];
    const type = types[Math.floor(Math.random() * types.length)];

    this.powerUps.push(new PowerUp(x - 8, y, type));
  }

  aabbOverlap(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  updateLevelComplete(dt) {
    this.levelTransitionTimer += dt;

    // Auto-advance after 3 seconds or on spacebar
    if (this.levelTransitionTimer >= 3 || this.input.isJustPressed(' ')) {
      this.nextLevel();
    }
  }

  updateGameOver(dt) {
    if (this.input.isJustPressed(' ')) {
      this.state = 'MENU';
    }
  }

  nextLevel() {
    this.level++;
    this.startLevel();
    this.state = 'PLAYING';
  }

  gameOver() {
    this.state = 'GAME_OVER';
    this.audio.playGameOver();
    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('galaxianHighScore', this.highScore);
    }
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw starfield
    this.starfield.draw(this.ctx);

    // Draw planet (in front of starfield)
    if (this.planet && this.state !== 'MENU') {
      this.planet.draw(this.ctx);
    }

    // Draw state-specific UI
    if (this.state === 'MENU') {
      this.drawMenu();
    } else if (this.state === 'PLAYING') {
      this.drawGameplay();
      this.drawHUD();
    } else if (this.state === 'PAUSED') {
      this.drawGameplay();
      this.drawHUD();
      this.drawPaused();
    } else if (this.state === 'LEVEL_COMPLETE') {
      this.drawGameplay();
      this.drawLevelComplete();
    } else if (this.state === 'GAME_OVER') {
      this.drawGameplay();
      this.drawGameOverScreen();
    }
  }

  drawGameplay() {
    // Draw game entities
    if (this.formation) this.formation.draw(this.ctx);
    if (this.player) this.player.draw(this.ctx);
    this.bullets.forEach(b => b.draw(this.ctx));
    this.enemyBullets.forEach(b => b.draw(this.ctx));
    this.powerUps.forEach(p => p.draw(this.ctx));
    this.explosions.forEach(e => e.draw(this.ctx));
  }

  drawMenu() {
    // Draw title
    this.ctx.fillStyle = '#0ff';
    this.ctx.font = 'bold 48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('STAR SIEGE', CANVAS_WIDTH / 2, 120);

    // Draw gameplay description
    this.ctx.font = '14px monospace';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('Defend against alien invasions!', CANVAS_WIDTH / 2, 180);

    // Draw controls
    this.ctx.font = '12px monospace';
    this.ctx.fillStyle = '#ff0';
    const controlY = 240;
    const lineHeight = 22;
    this.ctx.fillText('← → Arrow Keys to Move', CANVAS_WIDTH / 2, controlY);
    this.ctx.fillText('SPACE to Shoot (Auto)', CANVAS_WIDTH / 2, controlY + lineHeight);
    this.ctx.fillText('P to Pause / Resume', CANVAS_WIDTH / 2, controlY + lineHeight * 2);
    this.ctx.fillText('M to Mute / Unmute', CANVAS_WIDTH / 2, controlY + lineHeight * 3);

    // Draw high score
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.fillText(`High Score: ${this.highScore}`, CANVAS_WIDTH / 2, 420);

    // Draw start prompt
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 18px monospace';
    const blinkFrame = Math.floor((Date.now() / 500) % 2);
    if (blinkFrame === 0) {
      this.ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, 500);
    }

    // Draw difficulty tease
    this.ctx.font = '10px monospace';
    this.ctx.fillStyle = '#888';
    this.ctx.fillText('Levels increase in difficulty • Enemies evolve • Stay alert!', CANVAS_WIDTH / 2, 580);
  }

  drawPaused() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.ctx.fillStyle = '#0ff';
    this.ctx.font = 'bold 32px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px monospace';
    this.ctx.fillText(`Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    this.ctx.fillText(`Level: ${this.level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);

    this.ctx.font = '12px monospace';
    this.ctx.fillStyle = '#0f0';
    this.ctx.fillText('Press P to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
  }

  drawLevelComplete() {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 24px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('LEVEL COMPLETE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

    this.ctx.font = '14px monospace';
    this.ctx.fillText(`Level Bonus: +${this.levelBonus}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
    this.ctx.fillText(`Total Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

    this.ctx.font = '12px monospace';
    const countdownSec = Math.ceil(Math.max(0, 3 - this.levelTransitionTimer));
    this.ctx.fillText(`Next level in ${countdownSec}s...`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = '#f00';
    this.ctx.font = 'bold 40px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 16px monospace';
    this.ctx.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    const isNewRecord = this.score === this.highScore && this.score > 0;
    if (isNewRecord) {
      this.ctx.fillStyle = '#ff0';
      this.ctx.font = '14px monospace';
      this.ctx.fillText('🎉 NEW RECORD! 🎉', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);
    }

    this.ctx.fillStyle = '#888';
    this.ctx.font = '12px monospace';
    this.ctx.fillText(`Level Reached: ${this.level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 65);

    const blinkFrame = Math.floor((Date.now() / 500) % 2);
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = '12px monospace';
    if (blinkFrame === 0) {
      this.ctx.fillText('Press SPACE to return to menu', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
    }
  }

  drawHUD() {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SCORE: ${this.score}`, 8, 20);

    this.ctx.textAlign = 'center';
    this.ctx.fillText(`HI: ${this.highScore}`, CANVAS_WIDTH / 2, 20);

    this.ctx.textAlign = 'right';
    this.ctx.fillText(`LVL ${this.level}`, CANVAS_WIDTH - 8, 20);

    // God mode indicator
    if (this.godMode) {
      this.ctx.fillStyle = '#f0f';
      this.ctx.textAlign = 'center';
      this.ctx.font = 'bold 12px monospace';
      this.ctx.fillText('★ GOD ★', CANVAS_WIDTH / 2, 38);
    }

    // Lives
    this.ctx.textAlign = 'left';
    this.ctx.font = '12px monospace';
    for (let i = 0; i < this.lives; i++) {
      this.ctx.fillText('♥', 8 + i * 20, CANVAS_HEIGHT - 8);
    }

    // Active power-ups
    let px = CANVAS_WIDTH - 8;
    for (let [effect, timer] of this.player.activeEffects) {
      const pct = timer / 10; // 10s max duration
      px -= 14;

      const colorMap = {
        'doubleShot': '#ff0',
        'rapidFire': '#f80',
        'speedBoost': '#0ff',
        'shield': this.player.shieldHits <= 1 ? '#ff0' : '#0f0'
      };

      this.ctx.fillStyle = colorMap[effect] || '#fff';
      this.ctx.fillRect(px, CANVAS_HEIGHT - 20, 12, 12);

      // Countdown bar beneath
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(px, CANVAS_HEIGHT - 6, 12, 4);
      this.ctx.fillStyle = colorMap[effect] || '#fff';
      this.ctx.fillRect(px, CANVAS_HEIGHT - 6, 12 * pct, 4);
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

window.addEventListener('load', () => {
  const game = new Game();
  game.init();
});
