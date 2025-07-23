console.log("Home frontend javascript file");
function fitElementToParent(el, padding) {
    let timeout = null;
  
    function resize() {
      if (timeout) clearTimeout(timeout);
      anime.set(el, { scale: 1 });
      let pad = padding || 0;
      let parentEl = el.parentNode;
      let elOffsetWidth = el.offsetWidth - pad;
      let parentOffsetWidth = parentEl.offsetWidth;
      let ratio = parentOffsetWidth / elOffsetWidth;
      timeout = setTimeout(anime.set(el, { scale: ratio }), 10);
    }
  
    resize();
    window.addEventListener("resize", resize);
  }
  
  (function () {
    const sphereEl = document.querySelector(".sphere-animation");
    const spherePathEls = sphereEl.querySelectorAll(".sphere path");
    const pathLength = spherePathEls.length;
    const animations = [];
  
    fitElementToParent(sphereEl);
  
    const breathAnimation = anime({
      begin: function () {
        for (let i = 0; i < pathLength; i++) {
          animations.push(
            anime({
              targets: spherePathEls[i],
              stroke: {
                value: ["rgba(255,75,75,1)", "rgba(80,80,80,.35)"],
                duration: 500,
              },
              translateX: [2, -4],
              translateY: [2, -4],
              easing: "easeOutQuad",
              autoplay: false,
            })
          );
        }
      },
      update: function (ins) {
        animations.forEach(function (animation, i) {
          let percent = (1 - Math.sin(i * 0.35 + 0.0022 * ins.currentTime)) / 2;
          animation.seek(animation.duration * percent);
        });
      },
      duration: Infinity,
      autoplay: false,
    });
  
    const introAnimation = anime
      .timeline({
        autoplay: false,
      })
      .add(
        {
          targets: spherePathEls,
          strokeDashoffset: {
            value: [anime.setDashoffset, 0],
            duration: 3900,
            easing: "easeInOutCirc",
            delay: anime.stagger(190, { direction: "reverse" }),
          },
          duration: 2000,
          delay: anime.stagger(60, { direction: "reverse" }),
          easing: "linear",
        },
        0
      );
  
    const shadowAnimation = anime(
      {
        targets: "#sphereGradient",
        x1: "25%",
        x2: "25%",
        y1: "0%",
        y2: "75%",
        duration: 30000,
        easing: "easeOutQuint",
        autoplay: false,
      },
      0
    );
  
    function init() {
      introAnimation.play();
      breathAnimation.play();
      shadowAnimation.play();
    }
  
    init();
  })();

// Matrix Digital Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 14;
        this.columns = [];
        this.drops = [];
        
        this.init();
        this.animate();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        const numColumns = Math.floor(this.canvas.width / this.fontSize);
        
        for (let i = 0; i < numColumns; i++) {
            this.columns[i] = 1;
            this.drops[i] = Math.random() * -100;
        }
    }
    
    draw() {
        // Create fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Vary opacity for depth effect
            const opacity = Math.random();
            this.ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
            this.ctx.fillText(text, x, y);
            
            // Reset drop when it falls off screen
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.init();
    }
}

// Connection Lines Animation
class ConnectionLines {
    constructor() {
        this.svg = document.querySelector('.connection-lines');
        this.path = document.querySelector('.connection-path');
        this.nodes = document.querySelectorAll('.nav-node');
        
        this.init();
    }
    
    init() {
        if (!this.svg || !this.path || this.nodes.length === 0) return;
        
        this.updatePath();
        this.addNodeEvents();
    }
    
    updatePath() {
        const nodePositions = Array.from(this.nodes).map(node => {
            const rect = node.getBoundingClientRect();
            const svgRect = this.svg.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2 - svgRect.left,
                y: rect.top + rect.height / 2 - svgRect.top
            };
        });
        
        if (nodePositions.length < 2) return;
        
        let pathData = `M ${nodePositions[0].x} ${nodePositions[0].y}`;
        
        for (let i = 1; i < nodePositions.length; i++) {
            const prev = nodePositions[i - 1];
            const curr = nodePositions[i];
            const next = nodePositions[i + 1];
            
            if (next) {
                const controlX = curr.x;
                const controlY = curr.y;
                pathData += ` Q ${controlX} ${controlY} ${(curr.x + next.x) / 2} ${(curr.y + next.y) / 2}`;
            } else {
                pathData += ` L ${curr.x} ${curr.y}`;
            }
        }
        
        this.path.setAttribute('d', pathData);
    }
    
    addNodeEvents() {
        this.nodes.forEach((node, index) => {
            node.addEventListener('mouseenter', () => {
                this.highlightConnection(index);
            });
            
            node.addEventListener('mouseleave', () => {
                this.resetConnection();
            });
        });
    }
    
    highlightConnection(nodeIndex) {
        this.path.style.stroke = '#00ffff';
        this.path.style.strokeWidth = '3';
        this.path.style.filter = 'drop-shadow(0 0 10px #00ffff)';
    }
    
    resetConnection() {
        this.path.style.stroke = 'url(#lineGradient)';
        this.path.style.strokeWidth = '2';
        this.path.style.filter = 'none';
    }
}

// Stat Cards Animation
class StatCards {
    constructor() {
        this.cards = document.querySelectorAll('.stat-card');
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            this.animateStatValue(card, index);
        });
    }
    
    animateStatValue(card, index) {
        const statNumber = card.querySelector('.stat-number');
        const statFill = card.querySelector('.stat-fill');
        
        if (!statNumber || !statFill) return;
        
        const targetValue = parseInt(statNumber.textContent);
        const targetWidth = parseInt(statFill.style.width);
        
        let currentValue = 0;
        let currentWidth = 0;
        
        const duration = 2000 + (index * 500); // Stagger animation
        const startTime = Date.now() + (index * 200); // Delay start
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress > 0) {
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                
                currentValue = Math.floor(targetValue * easeOutQuart);
                currentWidth = Math.floor(targetWidth * easeOutQuart);
                
                statNumber.textContent = currentValue;
                statFill.style.width = `${currentWidth}%`;
                
                // Add glow effect during animation
                if (progress < 1) {
                    statNumber.style.textShadow = `0 0 ${20 + Math.sin(elapsed * 0.01) * 10}px #00ff88`;
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Glitch Text Effect
class GlitchText {
    constructor() {
        this.glitchElements = document.querySelectorAll('.cyber-title, .user-name');
        this.init();
    }
    
    init() {
        this.glitchElements.forEach(element => {
            this.addGlitchEffect(element);
        });
    }
    
    addGlitchEffect(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
        
        element.addEventListener('mouseenter', () => {
            let iteration = 0;
            const maxIterations = 10;
            
            const glitch = setInterval(() => {
                element.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) return originalText[index];
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    })
                    .join('');
                
                iteration++;
                
                if (iteration > maxIterations) {
                    clearInterval(glitch);
                    element.textContent = originalText;
                }
            }, 30);
        });
    }
}

// Morphing Shapes Controller
class MorphingShapes {
    constructor() {
        this.container = document.querySelector('.morph-container');
        this.shapes = document.querySelectorAll('.morph-shape');
        this.isHovered = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.accelerateShapes();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.normalizeShapes();
        });
        
        this.container.addEventListener('click', () => {
            this.explodeShapes();
        });
    }
    
    accelerateShapes() {
        this.shapes.forEach((shape, index) => {
            shape.style.animationDuration = `${2 + index}s`;
            shape.style.filter = 'brightness(1.5) drop-shadow(0 0 20px currentColor)';
        });
    }
    
    normalizeShapes() {
        this.shapes.forEach((shape, index) => {
            const originalDurations = ['8s', '12s', '16s', '6s'];
            shape.style.animationDuration = originalDurations[index] || '10s';
            shape.style.filter = 'none';
        });
    }
    
    explodeShapes() {
        this.shapes.forEach((shape, index) => {
            shape.style.transform += ` scale(${1.5 + index * 0.2})`;
            shape.style.opacity = '0.3';
            
            setTimeout(() => {
                shape.style.transform = shape.style.transform.replace(/ scale\([^)]*\)/, '');
                shape.style.opacity = '1';
            }, 500);
        });
    }
}

// System Status Updater
class SystemStatus {
    constructor() {
        this.statusItems = document.querySelectorAll('.status-dot');
        this.init();
    }
    
    init() {
        setInterval(() => {
            this.updateStatus();
        }, 5000);
    }
    
    updateStatus() {
        this.statusItems.forEach(dot => {
            if (!dot.classList.contains('online')) {
                // Simulate system fluctuations
                const shouldBlink = Math.random() > 0.7;
                if (shouldBlink) {
                    dot.style.animation = 'none';
                    setTimeout(() => {
                        dot.style.animation = 'statusBlink 2s ease-in-out infinite';
                    }, 100);
                }
            }
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix Rain
    const matrixRain = new MatrixRain();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        matrixRain.resize();
    });
    
    // Initialize other components
    setTimeout(() => {
        new ConnectionLines();
        new StatCards();
        new GlitchText();
        new MorphingShapes();
        new SystemStatus();
    }, 100);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            // Toggle Matrix effect
            const canvas = document.getElementById('matrix-canvas');
            canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    // Add mouse trail effect
    let mouseTrail = [];
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });
        
        // Keep only recent points
        mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
        
        // Create trail effect (optional - can be enabled for more cyberpunk feel)
        if (mouseTrail.length > 1 && Math.random() > 0.95) {
            createSparkle(e.clientX, e.clientY);
        }
    });
    
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#00ff88';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.boxShadow = '0 0 10px #00ff88';
        sparkle.style.animation = 'sparkleAnimation 1s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
    
    // Add sparkle animation CSS
    const sparkleCSS = `
        @keyframes sparkleAnimation {
            0% { 
                opacity: 1; 
                transform: scale(0); 
            }
            50% { 
                opacity: 1; 
                transform: scale(1); 
            }
            100% { 
                opacity: 0; 
                transform: scale(0.5) translateY(-20px); 
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = sparkleCSS;
    document.head.appendChild(styleSheet);
});

// Console easter egg
console.log(`
%c
██████╗██╗  ██╗ █████╗ ██╗██████╗ ████████╗ ██████╗ ██████╗ ███████╗██████╗ 
██╔════╝██║  ██║██╔══██╗██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗
██║     ███████║███████║██║██████╔╝   ██║   ██║   ██║██████╔╝█████╗  ██║  ██║
██║     ██╔══██║██╔══██║██║██╔══██╗   ██║   ██║   ██║██╔══██╗██╔══╝  ██║  ██║
╚██████╗██║  ██║██║  ██║██║██║  ██║   ██║   ╚██████╔╝██████╔╝███████╗██████╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝╚═════╝ 
%c
NEURAL INTERFACE LOADED
SYSTEM STATUS: ONLINE
ADMIN ACCESS: GRANTED

Press Ctrl+Shift+M to toggle Matrix effect
`, 
'color: #00ff88; font-family: monospace; font-size: 10px;',
'color: #00ffff; font-family: monospace; font-size: 12px;'
);

// Furniture Theme Animations
class FurnitureAnimations {
    constructor() {
        this.floatingFurniture = document.querySelectorAll('.floating-furniture');
        this.transformation = document.querySelector('.furniture-transformation');
        this.chairStructure = document.querySelector('.chair-structure');
        this.bedStructure = document.querySelector('.bed-structure');
        
        this.init();
    }
    
    init() {
        this.animateFloatingFurniture();
        this.setupTransformationEffect();
        this.addInteractivity();
    }
    
    animateFloatingFurniture() {
        this.floatingFurniture.forEach((item, index) => {
            // Add random movement variations
            const randomDelay = Math.random() * 5;
            const randomDuration = 12 + Math.random() * 8;
            
            item.style.animationDelay = `${randomDelay}s`;
            item.style.animationDuration = `${randomDuration}s`;
            
            // Add hover effect
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.2)';
                item.style.opacity = '0.3';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
                item.style.opacity = '0.1';
            });
        });
    }
    
    setupTransformationEffect() {
        if (!this.transformation) return;
        
        let isTransformed = false;
        
        this.transformation.addEventListener('click', () => {
            this.toggleTransformation(isTransformed);
            isTransformed = !isTransformed;
        });
        
        // Auto transformation every 10 seconds
        setInterval(() => {
            this.toggleTransformation(isTransformed);
            isTransformed = !isTransformed;
        }, 10000);
    }
    
    toggleTransformation(to床) {
        if (toチェア) {
            // Transform to chair
            if (this.chairStructure) {
                this.chairStructure.style.transform = 'scale(1) rotateY(0deg)';
                this.chairStructure.style.opacity = '1';
            }
            if (this.bedStructure) {
                this.bedStructure.style.transform = 'scale(0.8) rotateY(90deg)';
                this.bedStructure.style.opacity = '0.3';
            }
        } else {
            // Transform to bed
            if (this.chairStructure) {
                this.chairStructure.style.transform = 'scale(0.8) rotateY(-90deg)';
                this.chairStructure.style.opacity = '0.3';
            }
            if (this.bedStructure) {
                this.bedStructure.style.transform = 'scale(1) rotateY(0deg)';
                this.bedStructure.style.opacity = '1';
            }
        }
    }
    
    addInteractivity() {
        // Add 3D furniture item effects
        const furnitureItems = document.querySelectorAll('.furniture-item');
        
        furnitureItems.forEach(item => {
            const item3d = item.querySelector('.item-3d');
            
            item.addEventListener('mouseenter', () => {
                if (item3d) {
                    item3d.style.transform = 'rotateY(25deg) rotateX(10deg) translateZ(10px)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (item3d) {
                    item3d.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
                }
            });
        });
    }
}

// Business Stats Animation
class BusinessStats {
    constructor() {
        this.statCards = document.querySelectorAll('.stat-showcase');
        this.init();
    }
    
    init() {
        this.animateStats();
    }
    
    animateStats() {
        this.statCards.forEach((card, index) => {
            this.animateStatValue(card, index);
        });
    }
    
    animateStatValue(card, index) {
        const statNumber = card.querySelector('.stat-number');
        const statFill = card.querySelector('.stat-fill');
        
        if (!statNumber || !statFill) return;
        
        const targetValue = parseInt(statNumber.textContent.replace(',', ''));
        const targetWidth = parseInt(statFill.style.width);
        
        let currentValue = 0;
        let currentWidth = 0;
        
        const duration = 3000 + (index * 500);
        const startTime = Date.now() + (index * 300);
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress > 0) {
                // Smooth easing
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                currentValue = Math.floor(targetValue * easeOut);
                currentWidth = Math.floor(targetWidth * easeOut);
                
                // Format number with commas for large numbers
                if (currentValue >= 1000) {
                    statNumber.textContent = currentValue.toLocaleString();
                } else {
                    statNumber.textContent = currentValue;
                }
                
                statFill.style.width = `${currentWidth}%`;
                
                // Add warm glow effect during animation
                if (progress < 1) {
                    statNumber.style.textShadow = `2px 2px 4px rgba(139, 69, 19, ${0.3 + Math.sin(elapsed * 0.005) * 0.2})`;
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Room Atmosphere Effects
class RoomAtmosphere {
    constructor() {
        this.windowLight = document.querySelector('.window-light');
        this.blueprintGrid = document.querySelector('.grid-dots');
        this.woodTexture = document.querySelector('.wood-texture-bg');
        
        this.init();
    }
    
    init() {
        this.animateWindowLight();
        this.createWoodParticles();
        this.addSeasonalEffects();
    }
    
    animateWindowLight() {
        if (!this.windowLight) return;
        
        // Simulate sunlight moving throughout the day
        let lightIntensity = 0.3;
        let increasing = true;
        
        setInterval(() => {
            if (increasing) {
                lightIntensity += 0.02;
                if (lightIntensity >= 0.8) increasing = false;
            } else {
                lightIntensity -= 0.02;
                if (lightIntensity <= 0.3) increasing = true;
            }
            
            this.windowLight.style.opacity = lightIntensity;
        }, 200);
    }
    
    createWoodParticles() {
        // Create subtle floating wood dust particles
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createWoodParticle();
            }
        }, 2000);
    }
    
    createWoodParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = '#DEB887';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0.3';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '0';
        
        // Random starting position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-10px';
        
        // Animation
        particle.style.animation = 'woodParticleFloat 8s linear forwards';
        
        document.body.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }
    
    addSeasonalEffects() {
        // Add subtle seasonal ambiance
        const hour = new Date().getHours();
        const body = document.body;
        
        if (hour >= 6 && hour < 12) {
            // Morning - fresh wood
            body.style.filter = 'sepia(0.1) brightness(1.1)';
        } else if (hour >= 12 && hour < 18) {
            // Afternoon - warm wood
            body.style.filter = 'sepia(0.2) saturate(1.1)';
        } else {
            // Evening - cozy wood
            body.style.filter = 'sepia(0.3) contrast(0.9)';
        }
    }
}

// Craft Workshop Effects
class WorkshopEffects {
    constructor() {
        this.tools = document.querySelectorAll('.tool');
        this.craftMessage = document.querySelector('.craft-message');
        
        this.init();
    }
    
    init() {
        this.animateTools();
        this.addToolSounds();
    }
    
    animateTools() {
        this.tools.forEach((tool, index) => {
            tool.addEventListener('click', () => {
                this.useTools(tool, index);
            });
            
            // Random tool movement
            setInterval(() => {
                if (Math.random() > 0.8) {
                    tool.style.transform = `translateY(-8px) rotate(${Math.random() * 10 - 5}deg)`;
                    setTimeout(() => {
                        tool.style.transform = 'translateY(0px) rotate(0deg)';
                    }, 300);
                }
            }, 3000 + index * 1000);
        });
    }
    
    useTools(tool, index) {
        // Visual feedback for tool use
        tool.style.transform = 'scale(1.2) rotate(15deg)';
        tool.style.filter = 'drop-shadow(0 0 10px #DAA520)';
        
        setTimeout(() => {
            tool.style.transform = 'scale(1) rotate(0deg)';
            tool.style.filter = 'drop-shadow(0 0 5px rgba(139, 69, 19, 0.2))';
        }, 200);
        
        // Create sawdust effect
        this.createSawdust(tool);
    }
    
    createSawdust(tool) {
        const rect = tool.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const dust = document.createElement('div');
            dust.style.position = 'fixed';
            dust.style.left = (rect.left + Math.random() * 20) + 'px';
            dust.style.top = (rect.top + Math.random() * 20) + 'px';
            dust.style.width = '3px';
            dust.style.height = '3px';
            dust.style.background = '#DEB887';
            dust.style.borderRadius = '50%';
            dust.style.pointerEvents = 'none';
            dust.style.zIndex = '9999';
            dust.style.animation = 'sawdustFall 1s ease-out forwards';
            
            document.body.appendChild(dust);
            
            setTimeout(() => {
                dust.remove();
            }, 1000);
        }
    }
    
    addToolSounds() {
        // Visual sound effects (since we can't play actual sounds)
        this.tools.forEach(tool => {
            tool.addEventListener('click', () => {
                this.showSoundWave(tool);
            });
        });
    }
    
    showSoundWave(tool) {
        const wave = document.createElement('div');
        const rect = tool.getBoundingClientRect();
        
        wave.style.position = 'fixed';
        wave.style.left = (rect.left + rect.width / 2) + 'px';
        wave.style.top = (rect.top + rect.height / 2) + 'px';
        wave.style.width = '20px';
        wave.style.height = '20px';
        wave.style.border = '2px solid #DAA520';
        wave.style.borderRadius = '50%';
        wave.style.transform = 'translate(-50%, -50%)';
        wave.style.opacity = '0.8';
        wave.style.pointerEvents = 'none';
        wave.style.zIndex = '9999';
        wave.style.animation = 'soundWave 0.8s ease-out forwards';
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            wave.remove();
        }, 800);
    }
}

// Initialize all furniture theme components
document.addEventListener('DOMContentLoaded', () => {
    // Wait for elements to be ready
    setTimeout(() => {
        new FurnitureAnimations();
        new BusinessStats();
        new RoomAtmosphere();
        new WorkshopEffects();
    }, 100);
    
    // Add custom CSS animations
    const furnitureCSS = `
        @keyframes woodParticleFloat {
            0% { 
                transform: translateY(0) translateX(0) rotate(0deg); 
                opacity: 0.3; 
            }
            50% { 
                transform: translateY(50vh) translateX(20px) rotate(180deg); 
                opacity: 0.1; 
            }
            100% { 
                transform: translateY(100vh) translateX(-10px) rotate(360deg); 
                opacity: 0; 
            }
        }
        
        @keyframes sawdustFall {
            0% { 
                transform: translateY(0) scale(1); 
                opacity: 0.8; 
            }
            100% { 
                transform: translateY(30px) scale(0.5); 
                opacity: 0; 
            }
        }
        
        @keyframes soundWave {
            0% { 
                transform: translate(-50%, -50%) scale(1); 
                opacity: 0.8; 
            }
            100% { 
                transform: translate(-50%, -50%) scale(3); 
                opacity: 0; 
            }
        }
        
        .furniture-item .item-3d {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .chair-structure, .bed-structure {
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .floating-furniture {
            transition: all 0.3s ease;
            cursor: pointer;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = furnitureCSS;
    document.head.appendChild(styleSheet);
    
    // Add subtle cursor trail effect for furniture theme
    let trailElements = [];
    
    document.addEventListener('mousemove', (e) => {
        // Create subtle furniture-themed cursor trail
        if (Math.random() > 0.95) {
            const trail = document.createElement('div');
            trail.textContent = ['🪑', '🛏️', '🛋️'][Math.floor(Math.random() * 3)];
            trail.style.position = 'fixed';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.fontSize = '12px';
            trail.style.opacity = '0.3';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '9999';
            trail.style.transform = 'translate(-50%, -50%)';
            trail.style.animation = 'furnitureTrail 2s ease-out forwards';
            
            document.body.appendChild(trail);
            trailElements.push(trail);
            
            // Clean up old trail elements
            if (trailElements.length > 5) {
                const oldTrail = trailElements.shift();
                oldTrail.remove();
            }
            
            setTimeout(() => {
                trail.remove();
                const index = trailElements.indexOf(trail);
                if (index > -1) trailElements.splice(index, 1);
            }, 2000);
        }
    });
    
    // Add furniture trail animation
    const trailCSS = `
        @keyframes furnitureTrail {
            0% { 
                opacity: 0.3; 
                transform: translate(-50%, -50%) scale(1); 
            }
            50% { 
                opacity: 0.1; 
                transform: translate(-50%, -50%) scale(1.2); 
            }
            100% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.8) translateY(-20px); 
            }
        }
    `;
    
    const trailStyleSheet = document.createElement('style');
    trailStyleSheet.textContent = trailCSS;
    document.head.appendChild(trailStyleSheet);
});

// Console furniture art
console.log(`
%c
🏠 ═══════════════════════════════════════════════════════════════ 🏠
   ██████╗██╗  ██╗ █████╗ ██╗██████╗ ████████╗ ██████╗ ██████╗ ███████╗██████╗ 
   ██╔════╝██║  ██║██╔══██╗██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗
   ██║     ███████║███████║██║██████╔╝   ██║   ██║   ██║██████╔╝█████╗  ██║  ██║
   ██║     ██╔══██║██╔══██║██║██╔══██╗   ██║   ██║   ██║██╔══██╗██╔══╝  ██║  ██║
   ╚██████╗██║  ██║██║  ██║██║██║  ██║   ██║   ╚██████╔╝██████╔╝███████╗██████╔╝
    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝╚═════╝ 
🛋️ ═══════════════════════════════════════════════════════════════ 🛏️

%c   🪑 FURNITURE ADMIN PANEL LOADED
   🏠 SHOWROOM STATUS: READY  
   🛋️ TRANSFORMATION SYSTEM: ONLINE
   🔨 CRAFTED WITH LOVE FOR COMFORTABLE HOMES

   Click on furniture items to interact!
   🪑 → 🛏️ Transformation available every 10 seconds

🪴 ═══════════════════════════════════════════════════════════════ 🪔
`, 
'color: #8B4513; font-family: monospace; font-size: 8px; background: #F5F5DC; padding: 10px; border-radius: 5px;',
'color: #A0522D; font-family: monospace; font-size: 11px; font-weight: bold;'
);