console.log("✨ ChairToBed Fashion Signup Portal");

// Fashion Signup Experience
class FashionSignup {
    constructor() {
        this.fileInput = document.getElementById('input-file');
        this.uploadName = document.querySelector('.upload-name');
        this.previewImage = document.querySelector('.preview-image');
        this.fileSize = document.querySelector('.file-size');
        this.passwordInput = document.querySelector('.member-password');
        this.confirmPasswordInput = document.querySelector('.confirm-password');
        this.strengthLine = document.querySelector('.strength-line');
        this.strengthLabel = document.querySelector('.strength-label');
        this.matchIndicator = document.querySelector('.match-indicator');
        this.matchLabel = document.querySelector('.match-label');
        
        this.init();
    }
    
    init() {
        this.setupFileUpload();
        this.setupPasswordValidation();
        this.setupFormAnimations();
        this.createParticleSystem();
        this.setupGlassEffects();
    }
    
    setupFileUpload() {
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e);
        });
        
        // Preview frame click
        const previewFrame = document.querySelector('.preview-frame');
        previewFrame.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        // Drag and drop functionality
        const uploadZone = document.querySelector('.glass-upload-zone');
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.background = 'rgba(255, 255, 255, 0.15)';
            uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            uploadZone.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.background = '';
            uploadZone.style.borderColor = '';
            uploadZone.style.transform = '';
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.background = '';
            uploadZone.style.borderColor = '';
            uploadZone.style.transform = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.fileInput.files = files;
                this.handleFileSelection({ target: { files: [files[0]] } });
            }
        });
    }
    
    handleFileSelection(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            this.showFashionAlert('📸 Please upload only JPEG, JPG, or PNG images!', 'error');
            return;
        }
        
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showFashionAlert('💾 File size must be less than 5MB!', 'error');
            return;
        }
        
        // Update file info
        this.uploadName.value = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        
        // Preview image with animation
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.style.opacity = '0';
            this.previewImage.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.previewImage.src = e.target.result;
                this.previewImage.style.opacity = '1';
                this.previewImage.style.transform = 'scale(1)';
                this.showUploadSuccess();
            }, 300);
        };
        reader.readAsDataURL(file);
        
        console.log(`📷 Fashion photo uploaded: ${file.name}`);
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    showUploadSuccess() {
        // Create success ripple effect
        const uploadZone = document.querySelector('.glass-upload-zone');
        const rect = uploadZone.getBoundingClientRect();
        
        this.createSuccessRipple(rect.left + rect.width/2, rect.top + rect.height/2);
        this.showFashionAlert('✨ Photo uploaded successfully!', 'success');
    }
    
    setupPasswordValidation() {
        // Password strength
        this.passwordInput.addEventListener('input', (e) => {
            this.validatePasswordStrength(e.target.value);
        });
        
        // Password match
        this.confirmPasswordInput.addEventListener('input', () => {
            this.validatePasswordMatch();
        });
        
        this.passwordInput.addEventListener('input', () => {
            if (this.confirmPasswordInput.value) {
                this.validatePasswordMatch();
            }
        });
    }
    
    validatePasswordStrength(password) {
        let strength = 0;
        let feedback = 'Very Weak';
        let color = '#f56565';
        
        // Calculate strength
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 10;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^A-Za-z0-9]/.test(password)) strength += 15;
        
        // Set feedback and color
        if (strength >= 90) {
            feedback = 'Excellent';
            color = '#48bb78';
        } else if (strength >= 70) {
            feedback = 'Strong';
            color = '#68d391';
        } else if (strength >= 50) {
            feedback = 'Good';
            color = '#f6e05e';
        } else if (strength >= 30) {
            feedback = 'Fair';
            color = '#ed8936';
        }
        
        // Update UI with animation
        if (this.strengthLine) {
            this.strengthLine.style.setProperty('--strength-width', `${strength}%`);
            this.strengthLine.style.setProperty('--strength-color', color);
            this.strengthLine.querySelector('::after').style.width = `${strength}%`;
        }
        
        if (this.strengthLabel) {
            this.strengthLabel.textContent = `Password Strength: ${feedback}`;
            this.strengthLabel.style.color = color;
        }
        
        // Add CSS custom property update
        document.documentElement.style.setProperty('--current-strength', `${strength}%`);
        document.documentElement.style.setProperty('--strength-color', color);
    }
    
    validatePasswordMatch() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            this.matchIndicator.textContent = '○';
            this.matchLabel.textContent = 'Passwords Match';
            this.matchIndicator.style.color = 'rgba(255, 255, 255, 0.6)';
            this.matchLabel.style.color = 'rgba(255, 255, 255, 0.8)';
            return;
        }
        
        if (password === confirmPassword) {
            this.matchIndicator.textContent = '✅';
            this.matchLabel.textContent = 'Perfect Match!';
            this.matchIndicator.style.color = '#48bb78';
            this.matchLabel.style.color = '#48bb78';
            
            // Add success animation
            this.matchIndicator.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.matchIndicator.style.transform = 'scale(1)';
            }, 200);
        } else {
            this.matchIndicator.textContent = '❌';
            this.matchLabel.textContent = 'Does Not Match';
            this.matchIndicator.style.color = '#f56565';
            this.matchLabel.style.color = '#f56565';
        }
    }
    
    setupFormAnimations() {
        // Input focus animations
        const glassInputs = document.querySelectorAll('.glass-input');
        
        glassInputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.addInputFocusEffect(input);
            });
            
            input.addEventListener('blur', () => {
                this.removeInputFocusEffect(input);
            });
            
            // Typing animation
            input.addEventListener('input', () => {
                this.addTypingEffect(input);
            });
        });
        
        // Section animations
        const formSections = document.querySelectorAll('.form-section');
        this.observeFormSections(formSections);
        
        // Button hover effects
        this.setupButtonEffects();
    }
    
    addInputFocusEffect(input) {
        const wrapper = input.closest('.glass-input-wrapper');
        
        // Add glow effect
        wrapper.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.3)';
        
        // Create focus ripple
        const rect = input.getBoundingClientRect();
        this.createFocusRipple(rect.left + rect.width/2, rect.top + rect.height/2);
    }
    
    removeInputFocusEffect(input) {
        const wrapper = input.closest('.glass-input-wrapper');
        wrapper.style.boxShadow = '';
    }
    
    addTypingEffect(input) {
        // Create typing particles
        if (Math.random() > 0.8) {
            const rect = input.getBoundingClientRect();
            this.createTypingParticle(
                rect.left + Math.random() * rect.width,
                rect.top + rect.height/2
            );
        }
    }
    
    setupButtonEffects() {
        const glassButtons = document.querySelectorAll('.glass-button');
        
        glassButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.addButtonHoverEffect(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.removeButtonHoverEffect(button);
            });
            
            button.addEventListener('click', (e) => {
                this.addButtonClickEffect(button, e);
            });
        });
    }
    
    addButtonHoverEffect(button) {
        // Create hover glow particles
        const rect = button.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createGlowParticle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 100);
        }
    }
    
    removeButtonHoverEffect(button) {
        // Reset any temporary effects
    }
    
    addButtonClickEffect(button, e) {
        // Create click wave effect
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.createClickWave(rect.left + x, rect.top + y);
    }
    
    observeFormSections(sections) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    
                    // Animate section indicator
                    const indicator = entry.target.querySelector('.indicator-dot');
                    if (indicator) {
                        indicator.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            indicator.style.transform = 'scale(1)';
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateX(20px)';
            section.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            observer.observe(section);
        });
    }
    
    createParticleSystem() {
        // Enhanced particle effects
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createFloatingParticle();
            }
        }, 2000);
        
        // Mouse trail particles
        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.95) {
                this.createMouseTrailParticle(e.clientX, e.clientY);
            }
        });
    }
    
    createFloatingParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight + 10}px;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleRise 8s linear forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }
    
    createMouseTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: rgba(102, 126, 234, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: trailParticle 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    createSuccessRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(72, 187, 120, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1001;
            animation: successRipple 1s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }
    
    createFocusRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 15px;
            height: 15px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1001;
            animation: focusRipple 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    createTypingParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
            animation: typingParticle 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
    
    createGlowParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: rgba(240, 147, 251, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
            animation: glowParticle 1.2s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1200);
    }
    
    createClickWave(x, y) {
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1001;
            animation: clickWave 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            wave.remove();
        }, 800);
    }
    
    setupGlassEffects() {
        // Add interactive glass effects
        const glassElements = document.querySelectorAll('.glass-signup-card, .glass-input-wrapper, .glass-button');
        
        glassElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.backdropFilter = 'blur(25px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.backdropFilter = '';
            });
        });
    }
    
    showFashionAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `fashion-alert alert-${type}`;
        
        const colors = {
            success: 'linear-gradient(135deg, #48bb78, #68d391)',
            error: 'linear-gradient(135deg, #f56565, #fc8181)',
            info: 'linear-gradient(135deg, #667eea, #764ba2)'
        };
        
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${colors[type]};
            color: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            z-index: 10000;
            font-weight: 600;
            max-width: 350px;
            animation: fashionAlertIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'fashionAlertOut 0.4s ease-in forwards';
            setTimeout(() => {
                alert.remove();
            }, 400);
        }, 4000);
    }
}

// Form Validation
function validateSignupForm() {
    const memberNick = document.querySelector('.member-nick').value.trim();
    const memberPhone = document.querySelector('.member-phone').value.trim();
    const memberPassword = document.querySelector('.member-password').value;
    const confirmPassword = document.querySelector('.confirm-password').value;
    const memberImage = document.getElementById('input-file').files[0];
    
    // Check required fields
    if (!memberNick || !memberPhone || !memberPassword || !confirmPassword) {
        showFashionAlert('✨ Please fill in all required fields to join!', 'error');
        return false;
    }
    
    // Validate business name
    if (memberNick.length < 3) {
        showFashionAlert('🏢 Business name must be at least 3 characters!', 'error');
        return false;
    }
    
    // Validate phone
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(memberPhone.replace(/[\s\-\(\)]/g, ''))) {
        showFashionAlert('📱 Please enter a valid phone number!', 'error');
        return false;
    }
    
    // Validate password
    if (memberPassword.length < 8) {
        showFashionAlert('🔐 Password must be at least 8 characters!', 'error');
        return false;
    }
    
    // Check password match
    if (memberPassword !== confirmPassword) {
        showFashionAlert('🔒 Passwords do not match!', 'error');
        return false;
    }
    
    // Validate image if provided
    if (memberImage) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(memberImage.type)) {
            showFashionAlert('📷 Please upload only JPEG, JPG, or PNG images!', 'error');
            return false;
        }
        
        if (memberImage.size > 5 * 1024 * 1024) {
            showFashionAlert('💾 Image size must be less than 5MB!', 'error');
            return false;
        }
    }
    
    // Show processing message
    showFashionAlert('🎉 Welcome to ChairToBed! Creating your business account...', 'success');
    
    // Add note about business account limitation
    setTimeout(() => {
        showFashionAlert('💡 Note: ChairToBed allows one main business account per furniture business.', 'info');
    }, 1000);
    
    console.log(`✨ Fashion signup: ${memberNick}`);
    return true;
}

function showFashionAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `fashion-alert alert-${type}`;
    
    const colors = {
        success: 'linear-gradient(135deg, #48bb78, #68d391)',
        error: 'linear-gradient(135deg, #f56565, #fc8181)',
        info: 'linear-gradient(135deg, #667eea, #764ba2)'
    };
    
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1.2rem 2rem;
        background: ${colors[type]};
        color: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.3);
        z-index: 10000;
        font-weight: 600;
        font-size: 0.95rem;
        max-width: 400px;
        animation: fashionAlertIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'fashionAlertOut 0.5s ease-in forwards';
        setTimeout(() => {
            alert.remove();
        }, 500);
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Fashion Signup Portal Initializing...');
    
    // Initialize fashion signup
    new FashionSignup();
    
    // Add custom animations CSS
    const fashionCSS = `
        .strength-line::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: var(--strength-color, linear-gradient(135deg, #f093fb, #f5576c));
            border-radius: 2px;
            width: var(--current-strength, 0%);
            transition: width 0.5s ease, background 0.3s ease;
        }
        
        @keyframes particleRise {
            0% { opacity: 0; transform: translateY(0) scale(1); }
            10% { opacity: 1; }
            90% { opacity: 0.5; }
            100% { opacity: 0; transform: translateY(-100vh) scale(0.5); }
        }
        
        @keyframes trailParticle {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(2) translateY(-20px); }
        }
        
        @keyframes successRipple {
            0% { width: 20px; height: 20px; opacity: 0.8; }
            100% { width: 100px; height: 100px; opacity: 0; }
        }
        
        @keyframes focusRipple {
            0% { width: 15px; height: 15px; opacity: 0.8; }
            100% { width: 60px; height: 60px; opacity: 0; }
        }
        
        @keyframes typingParticle {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-15px) scale(0.5); }
        }
        
        @keyframes glowParticle {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-25px) scale(2); }
        }
        
        @keyframes clickWave {
            0% { width: 10px; height: 10px; opacity: 1; }
            100% { width: 80px; height: 80px; opacity: 0; }
        }
        
        @keyframes fashionAlertIn {
            from { transform: translateX(100%) scale(0.8); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes fashionAlertOut {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(100%) scale(0.8); opacity: 0; }
        }
        
        .glass-input:focus {
            transform: translateY(-2px);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = fashionCSS;
    document.head.appendChild(styleSheet);
    
    console.log('💫 Fashion signup portal ready!');
});

// Console fashion art
console.log(`
%c
✨ ═══════════════════════════════════════════════════════════════ ✨
   ███████╗ █████╗ ███████╗██╗  ██╗██╗ ██████╗ ███╗   ██╗
   ██╔════╝██╔══██╗██╔════╝██║  ██║██║██╔═══██╗████╗  ██║
   █████╗  ███████║███████╗███████║██║██║   ██║██╔██╗ ██║
   ██╔══╝  ██╔══██║╚════██║██╔══██║██║██║   ██║██║╚██╗██║
   ██║     ██║  ██║███████║██║  ██║██║╚██████╔╝██║ ╚████║
   ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
💫 ═══════════════════════════════════════════════════════════════ 💫

%c   ✨ GLASSMORPHISM SIGNUP EXPERIENCE
   🌊 ANIMATED GRADIENT WAVES
   💎 INTERACTIVE PARTICLE SYSTEM
   🎨 MODERN FASHION AESTHETICS
   💫 REAL-TIME VISUAL FEEDBACK
   
   The most fashionable signup page ever created!

🎭 ═══════════════════════════════════════════════════════════════ 🎪
`, 
'color: #667eea; font-family: monospace; font-size: 8px; background: linear-gradient(135deg, #f093fb, #f5576c); padding: 10px; border-radius: 5px;',
'color: #764ba2; font-family: monospace; font-size: 11px; font-weight: bold;'
);

