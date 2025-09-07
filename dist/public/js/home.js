console.log("🚀 ChairToBed Cosmic Command Center");

// Cosmic Animation System
class CosmicAnimations {
    constructor() {
        this.particles = [];
        this.quantumFields = [];
        this.cosmicTime = 0;
        this.init();
    }
    
    init() {
        this.createParticleSystem();
        this.initQuantumFields();
        this.startCosmicCycle();
        this.setupInteractivity();
    }
    
    createParticleSystem() {
        // Create floating cosmic particles
        for (let i = 0; i < 50; i++) {
            this.createCosmicParticle();
        }
        
        // Create quantum dots
        for (let i = 0; i < 20; i++) {
            this.createQuantumDot();
        }
    }
    
    createCosmicParticle() {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const speed = Math.random() * 2 + 0.5;
        const hue = Math.random() * 360;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: hsl(${hue}, 80%, 60%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            box-shadow: 0 0 ${size * 3}px hsl(${hue}, 80%, 60%);
            animation: cosmicFloat${Math.floor(Math.random() * 3) + 1} ${speed + 8}s linear infinite;
        `;
        
        document.body.appendChild(particle);
        this.particles.push(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (speed + 8) * 1000);
    }
    
    createQuantumDot() {
        const dot = document.createElement('div');
        dot.className = 'quantum-dot';
        
        const size = Math.random() * 2 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        dot.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: #00d4ff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 2;
            animation: quantumBlink ${Math.random() * 3 + 2}s ease-in-out infinite;
        `;
        
        document.body.appendChild(dot);
        
        // Move quantum dot randomly
        setInterval(() => {
            const newX = Math.random() * window.innerWidth;
            const newY = Math.random() * window.innerHeight;
            dot.style.transform = `translate(${newX - x}px, ${newY - y}px)`;
        }, Math.random() * 5000 + 3000);
    }
    
    initQuantumFields() {
        // Create energy fields around interactive elements
        const navButtons = document.querySelectorAll('.nav-button');
        const cosmicButtons = document.querySelectorAll('.cosmic-button');
        const modules = document.querySelectorAll('.command-module');
        
        [...navButtons, ...cosmicButtons, ...modules].forEach(element => {
            this.createQuantumField(element);
        });
    }
    
    createQuantumField(element) {
        const field = document.createElement('div');
        field.className = 'quantum-field';
        field.style.cssText = `
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 16px;
            pointer-events: none;
            opacity: 0;
            transition: all 0.3s ease;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
        `;
        
        element.style.position = 'relative';
        element.appendChild(field);
        
        this.quantumFields.push({ element, field });
    }
    
    startCosmicCycle() {
        // Main animation loop
        const animate = () => {
            this.cosmicTime += 0.016; // 60fps
            
            // Update particle positions
            this.updateParticles();
            
            // Create new particles periodically
            if (Math.random() > 0.98) {
                this.createCosmicParticle();
            }
            
            // Update quantum fields
            this.updateQuantumFields();
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateParticles() {
        // Add cosmic drift to existing particles
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                const rect = particle.getBoundingClientRect();
                const drift = Math.sin(this.cosmicTime + parseFloat(particle.style.left)) * 0.5;
                particle.style.transform = `translateX(${drift}px)`;
            }
        });
    }
    
    updateQuantumFields() {
        this.quantumFields.forEach(({ element, field }) => {
            const rect = element.getBoundingClientRect();
            const mouseX = window.mouseX || 0;
            const mouseY = window.mouseY || 0;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - (rect.left + rect.width/2), 2) + 
                Math.pow(mouseY - (rect.top + rect.height/2), 2)
            );
            
            if (distance < 150) {
                field.style.opacity = Math.max(0, 1 - distance/150);
                field.style.transform = `scale(${1 + (150 - distance)/1000})`;
            } else {
                field.style.opacity = '0';
                field.style.transform = 'scale(1)';
            }
        });
    }
    
    setupInteractivity() {
        // Mouse tracking for quantum effects
        document.addEventListener('mousemove', (e) => {
            window.mouseX = e.clientX;
            window.mouseY = e.clientY;
            
            // Create mouse trail particles
            if (Math.random() > 0.9) {
                this.createMouseTrail(e.clientX, e.clientY);
            }
        });
        
        // Click effects
        document.addEventListener('click', (e) => {
            this.createClickExplosion(e.clientX, e.clientY);
        });
    }
    
    createMouseTrail(x, y) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: rgba(0, 212, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: trailFade 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    }
    
    createClickExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            const size = Math.random() * 4 + 2;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: #ff006e;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
            `;
            
            document.body.appendChild(particle);
            
            // Animate explosion
            let progress = 0;
            const animate = () => {
                progress += 0.02;
                
                const currentX = x + Math.cos(angle) * velocity * progress;
                const currentY = y + Math.sin(angle) * velocity * progress - (progress * progress * 200);
                
                particle.style.left = currentX + 'px';
                particle.style.top = currentY + 'px';
                particle.style.opacity = Math.max(0, 1 - progress);
                particle.style.transform = `scale(${1 - progress})`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}

// Business Statistics System
class BusinessStatsSystem {
    constructor() {
        this.stats = {
            products: 0,
            users: 0,
            orders: 0,
            totalProducts: 0,
            activeProducts: 0,
            totalUsers: 0
        };
        this.targetStats = {};
        this.init();
    }
    
    init() {
        this.loadStats();
        this.startCounterAnimations();
        this.setupLiveUpdates();
    }
    
    async loadStats() {
        try {
            // Simulate loading real data
            this.targetStats = {
                products: Math.floor(Math.random() * 500) + 100,
                users: Math.floor(Math.random() * 1000) + 250,
                orders: Math.floor(Math.random() * 200) + 50,
                totalProducts: Math.floor(Math.random() * 500) + 100,
                activeProducts: Math.floor(Math.random() * 400) + 80,
                totalUsers: Math.floor(Math.random() * 1000) + 250
            };
            
            console.log('📊 Cosmic stats loaded:', this.targetStats);
        } catch (error) {
            console.log('⚠️ Using demo stats');
            this.targetStats = {
                products: 156,
                users: 423,
                orders: 89,
                totalProducts: 156,
                activeProducts: 142,
                totalUsers: 423
            };
        }
    }
    
    startCounterAnimations() {
        // Animate all stat counters
        Object.keys(this.targetStats).forEach(statKey => {
            this.animateCounter(statKey, this.targetStats[statKey]);
        });
    }
    
    animateCounter(statKey, targetValue) {
        const elements = [
            document.getElementById(`cosmic-${statKey}`),
            document.getElementById(`total-${statKey}`),
            document.getElementById(`active-${statKey}`)
        ].filter(el => el);
        
        if (elements.length === 0) return;
        
        const duration = 3000; // 3 seconds
        const startTime = Date.now();
        const startValue = this.stats[statKey] || 0;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
            
            elements.forEach(element => {
                if (element) {
                    element.textContent = currentValue.toLocaleString();
                    
                    // Add pulsing effect during animation
                    if (progress < 1) {
                        element.style.textShadow = `0 0 ${10 + Math.sin(elapsed/100) * 5}px #00d4ff`;
                    } else {
                        element.style.textShadow = '0 0 10px #00d4ff';
                    }
                }
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.stats[statKey] = targetValue;
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    setupLiveUpdates() {
        // Simulate live data updates
        setInterval(() => {
            // Randomly update stats
            if (Math.random() > 0.7) {
                const statKeys = Object.keys(this.targetStats);
                const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
                const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
                
                this.targetStats[randomStat] = Math.max(0, this.targetStats[randomStat] + change);
                this.animateCounter(randomStat, this.targetStats[randomStat]);
                
                console.log(`📊 ${randomStat} updated to ${this.targetStats[randomStat]}`);
            }
        }, 10000); // Update every 10 seconds
    }
}

// Quantum Interface Effects
class QuantumInterface {
    constructor() {
        this.activeElements = new Set();
        this.init();
    }
    
    init() {
        this.setupHoverEffects();
        this.setupTransformationEngine();
        this.setupModuleInteractions();
    }
    
    setupHoverEffects() {
        // Nav buttons quantum effects
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createQuantumRipple(button);
                this.activateParticleField(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.deactivateParticleField(button);
            });
        });
        
        // Cosmic buttons
        const cosmicButtons = document.querySelectorAll('.cosmic-button');
        cosmicButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createEnergyField(button);
            });
        });
        
        // Stat orbs
        const statOrbs = document.querySelectorAll('.stat-orb');
        statOrbs.forEach(orb => {
            orb.addEventListener('mouseenter', () => {
                this.activateOrbEnergy(orb);
            });
            
            orb.addEventListener('mouseleave', () => {
                this.deactivateOrbEnergy(orb);
            });
        });
    }
    
    createQuantumRipple(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
            animation: quantumRipple 1s ease-out forwards;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }
    
    activateParticleField(element) {
        const particles = element.querySelector('.nav-particles');
        if (!particles) return;
        
        // Create floating particles around the button
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            const angle = (i / 5) * Math.PI * 2;
            const radius = 30;
            
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 3px;
                height: 3px;
                background: #00d4ff;
                border-radius: 50%;
                pointer-events: none;
                animation: particleOrbit 2s linear infinite;
                animation-delay: ${i * 0.4}s;
                transform-origin: ${radius}px 0px;
            `;
            
            particles.appendChild(particle);
        }
        
        this.activeElements.add(element);
    }
    
    deactivateParticleField(element) {
        const particles = element.querySelector('.nav-particles');
        if (particles) {
            particles.innerHTML = '';
        }
        this.activeElements.delete(element);
    }
    
    createEnergyField(element) {
        // Create energy waves around cosmic buttons
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                border: 2px solid rgba(0, 212, 255, 0.3);
                border-radius: 12px;
                pointer-events: none;
                animation: energyWave 1.5s ease-out infinite;
                animation-delay: ${i * 0.5}s;
            `;
            
            element.appendChild(wave);
            
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, 1500);
        }
    }
    
    activateOrbEnergy(orb) {
        const energyRing = orb.querySelector('.orb-energy');
        if (energyRing) {
            energyRing.style.opacity = '1';
            energyRing.style.animation = 'orbitRotate 1s linear infinite';
        }
    }
    
    deactivateOrbEnergy(orb) {
        const energyRing = orb.querySelector('.orb-energy');
        if (energyRing) {
            energyRing.style.opacity = '0';
        }
    }
    
    setupTransformationEngine() {
        // Transformation button effect
        const transformBtn = document.querySelector('.cosmic-button.primary');
        if (transformBtn) {
            transformBtn.addEventListener('click', () => {
                this.triggerTransformation();
            });
        }
    }
    
    triggerTransformation() {
        const chairItem = document.querySelector('.chair-form');
        const bedItem = document.querySelector('.bed-form');
        const beamContainer = document.querySelector('.transformation-beam-container');
        
        if (!chairItem || !bedItem || !beamContainer) return;
        
        // Highlight transformation items
        chairItem.style.borderColor = 'rgba(57, 255, 20, 1)';
        bedItem.style.borderColor = 'rgba(57, 255, 20, 1)';
        
        // Intensify beam effect
        beamContainer.style.background = 'rgba(0, 212, 255, 0.8)';
        beamContainer.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.8)';
        
        // Create transformation explosion
        this.createTransformationExplosion();
        
        // Reset after animation
        setTimeout(() => {
            chairItem.style.borderColor = '';
            bedItem.style.borderColor = '';
            beamContainer.style.background = '';
            beamContainer.style.boxShadow = '';
        }, 3000);
        
        console.log('⚡ Transformation initiated!');
    }
    
    createTransformationExplosion() {
        const beamContainer = document.querySelector('.transformation-beam-container');
        if (!beamContainer) return;
        
        const rect = beamContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create explosion particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            const angle = (i / 12) * Math.PI * 2;
            
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 6px;
                height: 6px;
                background: #39ff14;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 10px #39ff14;
            `;
            
            document.body.appendChild(particle);
            
            // Animate explosion
            let progress = 0;
            const animate = () => {
                progress += 0.03;
                
                const distance = progress * 200;
                const currentX = centerX + Math.cos(angle) * distance;
                const currentY = centerY + Math.sin(angle) * distance;
                
                particle.style.left = currentX + 'px';
                particle.style.top = currentY + 'px';
                particle.style.opacity = Math.max(0, 1 - progress);
                particle.style.transform = `scale(${Math.max(0.1, 1 - progress)})`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    setupModuleInteractions() {
        const modules = document.querySelectorAll('.command-module');
        modules.forEach(module => {
            module.addEventListener('mouseenter', () => {
                this.activateModule(module);
            });
            
            module.addEventListener('mouseleave', () => {
                this.deactivateModule(module);
            });
        });
    }
    
    activateModule(module) {
        // Add scanning effect
        const scanLine = module.querySelector('.scan-line');
        if (scanLine) {
            scanLine.style.animation = 'scanLine 1s linear infinite';
        }
        
        // Activate data streams
        const streamLines = module.querySelectorAll('.stream-line');
        streamLines.forEach((line, index) => {
            line.style.animationDuration = '0.8s';
            line.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    deactivateModule(module) {
        const scanLine = module.querySelector('.scan-line');
        if (scanLine) {
            scanLine.style.animation = 'scanLine 3s linear infinite';
        }
        
        const streamLines = module.querySelectorAll('.stream-line');
        streamLines.forEach((line, index) => {
            line.style.animationDuration = '2s';
            line.style.animationDelay = `${index * 0.7}s`;
        });
    }
}

// Global transformation function
function triggerTransformation() {
    if (window.quantumInterface) {
        window.quantumInterface.triggerTransformation();
    }
}

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Initializing Cosmic Command Center...');
    
    // Initialize all animation systems
    window.cosmicAnimations = new CosmicAnimations();
    window.businessStats = new BusinessStatsSystem();
    window.quantumInterface = new QuantumInterface();
    
    // Add custom CSS animations
    const cosmicCSS = `
        @keyframes cosmicFloat1 {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes cosmicFloat2 {
            0% { transform: translateY(100vh) rotate(0deg) scale(0.5); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translateY(-100px) rotate(-360deg) scale(1.5); opacity: 0; }
        }
        
        @keyframes cosmicFloat3 {
            0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(-100px) translateX(50px) rotate(180deg); opacity: 0; }
        }
        
        @keyframes quantumBlink {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes quantumRipple {
            0% { width: 20px; height: 20px; opacity: 0.8; }
            100% { width: 100px; height: 100px; opacity: 0; }
        }
        
        @keyframes trailFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.3); }
        }
        
        @keyframes particleOrbit {
            from { transform: rotate(0deg) translateX(30px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
        }
        
        @keyframes energyWave {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.5); opacity: 0; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = cosmicCSS;
    document.head.appendChild(styleSheet);
    
    console.log('✨ Cosmic Command Center Online!');
    console.log('🌟 All systems operational');
});

// Cosmic cursor trail
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 2px;
            height: 2px;
            background: rgba(0, 212, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: trailFade 2s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 2000);
    }
});

// Console cosmic art
console.log(`
%c
🌌 ═══════════════════════════════════════════════════════════ 🌌
   ██████╗ ██████╗ ███████╗███╗   ███╗██╗ ██████╗
   ██╔════╝██╔═══██╗██╔════╝████╗ ████║██║██╔════╝
   ██║     ██║   ██║███████╗██╔████╔██║██║██║     
   ██║     ██║   ██║╚════██║██║╚██╔╝██║██║██║     
   ╚██████╗╚██████╔╝███████║██║ ╚═╝ ██║██║╚██████╗
    ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝ ╚═════╝
🚀 ═══════════════════════════════════════════════════════════ 🚀

%c   ✨ QUANTUM PARTICLE SYSTEM
   🌟 COSMIC ANIMATION ENGINE  
   ⚡ TRANSFORMATION MATRIX
   🛸 INTERACTIVE SPACE FIELD
   🌌 REAL-TIME COSMIC DATA
   
   Welcome to the Furniture Universe Command Center!

🌠 ═══════════════════════════════════════════════════════════ 🌠
`, 
'color: #00d4ff; font-family: monospace; font-size: 8px; background: linear-gradient(135deg, #0a0a0f, #1a1a2e); padding: 10px; border-radius: 5px;',
'color: #ff006e; font-family: monospace; font-size: 11px; font-weight: bold;'
);