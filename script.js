// ==================== TG WS PROXY INTERACTIVE SCRIPT ====================

document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== WIDGETS ====================
    const WIDGETS = {
        ping: 48,
        users: 147,
        slots: 412,
        
        // Ping widget
        updatePing() {
            const pingEl = document.getElementById('w-ping');
            if (pingEl) {
                this.ping = Math.floor(Math.random() * 30) + 15;
                pingEl.textContent = this.ping;
            }
        },
        
        // Users widget
        updateUsers() {
            const usersEls = document.querySelectorAll('#w-users, #w-users-about');
            usersEls.forEach(el => {
                if (el) {
                    const change = Math.floor(Math.random() * 21) - 10;
                    this.users = Math.max(56, Math.min(326, this.users + change));
                    el.textContent = this.users;
                }
            });
        },
        
        // Slots widget
        updateSlots() {
            const slotsEl = document.getElementById('w-slots');
            const fillEl = document.getElementById('w-fill');
            
            if (slotsEl) {
                const change = Math.floor(Math.random() * 15) - 7;
                this.slots = Math.max(200, Math.min(658, this.slots + change));
                slotsEl.textContent = this.slots;
                
                if (fillEl) {
                    const percent = (this.slots / 658) * 100;
                    fillEl.style.width = `${percent}%`;
                }
            }
        },
        
        // Trigger manual sync
        triggerSync() {
            this.updatePing();
            const btn = document.getElementById('btn-ping-intro');
            if (btn) {
                btn.textContent = 'CHECKING...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.textContent = 'CHECK CONNECTION';
                    btn.disabled = false;
                }, 1500);
            }
        },
        
        // Start auto-updates
        startUpdates() {
            setInterval(() => this.updateUsers(), 10000);
            setInterval(() => this.updateSlots(), 12000);
        }
    };
    
    // Initialize widgets
    WIDGETS.updatePing();
    WIDGETS.updateUsers();
    WIDGETS.updateSlots();
    WIDGETS.startUpdates();
    
    // Make WIDGETS available globally
    window.WIDGETS = WIDGETS;
    
    // ==================== TERMINAL TYPEWRITER ====================
    const terminal = document.getElementById('win-typewriter');
    if (terminal) {
        const commands = [
            'Start-Proxy',
            'Test-Connection',
            'Get-Status',
            'Connect'
        ];
        
        let cmdIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeCommand() {
            const current = commands[cmdIndex];
            
            if (!isDeleting) {
                terminal.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(typeCommand, 2000);
                    return;
                }
            } else {
                terminal.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    cmdIndex = (cmdIndex + 1) % commands.length;
                    setTimeout(typeCommand, 500);
                    return;
                }
            }
            
            setTimeout(typeCommand, isDeleting ? 50 : 100);
        }
        
        typeCommand();
    }
    
    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ==================== SCROLL REVEAL ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.introduction, .about, .why-section, .how-section, .telegram-cta, .download').forEach(section => {
        observer.observe(section);
    });
    
    // ==================== PARALLAX EFFECT ====================
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function updateParallax() {
        const { innerWidth, innerHeight } = window;
        const xPercent = (mouseX / innerWidth - 0.5) * 2;
        const yPercent = (mouseY / innerHeight - 0.5) * 2;
        
        // Hero content parallax
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroContent) {
            heroContent.style.transform = `translate(${xPercent * 15}px, ${yPercent * 15}px)`;
        }
        
        if (heroVisual) {
            heroVisual.style.transform = `translate(${xPercent * -25}px, ${yPercent * -25}px)`;
        }
        
        // Orbs parallax
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 18;
            orb.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
        });
        
        // Widgets parallax
        const widgets = document.querySelectorAll('.widget-card');
        widgets.forEach((widget, i) => {
            const speed = 8 + (i * 2);
            widget.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
        });
    }
    
    // ==================== CUSTOM CURSOR (dot + ring + trail) ====================
    const cursorCross = document.querySelector('.cursor-cross');

    if (cursorCross && window.matchMedia('(pointer: fine)').matches) {
        let cursorX = innerWidth / 2;
        let cursorY = innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            cursorCross.style.left = `${cursorX}px`;
            cursorCross.style.top = `${cursorY}px`;
        });

        // ==================== ШЛЕЙФ-ЛЕНТА ЗА КУРСОРОМ ====================
        const trailCanvas = document.getElementById('cursor-trail-canvas');
        if (trailCanvas) {
            const ctx = trailCanvas.getContext('2d');
            const points = []; // история позиций ленты
            const MAX_POINTS = 28;
            let trailX = cursorX;
            let trailY = cursorY;

            function resizeCanvas() {
                trailCanvas.width = innerWidth * devicePixelRatio;
                trailCanvas.height = innerHeight * devicePixelRatio;
                ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            function drawTrail() {
                // лента мягко догоняет курсор (инерция)
                trailX += (cursorX - trailX) * 0.35;
                trailY += (cursorY - trailY) * 0.35;

                points.push({ x: trailX, y: trailY });
                if (points.length > MAX_POINTS) points.shift();

                // если курсор стоит на месте — хвост рассасывается
                const idle = Math.hypot(cursorX - trailX, cursorY - trailY) < 0.5;
                if (idle && points.length > 0) {
                    points.shift();
                    if (points.length > 0) points.shift();
                }

                ctx.clearRect(0, 0, innerWidth, innerHeight);
                if (points.length > 2) {
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    // рисуем сегментами: хвост тоньше и прозрачнее
                    for (let i = 1; i < points.length; i++) {
                        const t = i / (points.length - 1); // 0 = хвост, 1 = у курсора
                        ctx.strokeStyle = `rgba(228, 228, 231, ${t * t * 0.55})`;
                        ctx.lineWidth = t * 5 + 0.5;
                        ctx.shadowColor = 'rgba(228, 228, 231, 0.8)';
                        ctx.shadowBlur = t * 12;

                        ctx.beginPath();
                        ctx.moveTo(points[i - 1].x, points[i - 1].y);
                        ctx.lineTo(points[i].x, points[i].y);
                        ctx.stroke();
                    }
                    ctx.shadowBlur = 0;
                }

                requestAnimationFrame(drawTrail);
            }
            drawTrail();
        }

        // Реакция на нажатие
        document.addEventListener('mousedown', () => cursorCross.classList.add('cursor-down'));
        document.addEventListener('mouseup', () => cursorCross.classList.remove('cursor-down'));

        // Увеличение крестика на интерактивных элементах
        document.querySelectorAll('a, button, .btn, input, .win-btn, .tech-item, .step').forEach(el => {
            el.addEventListener('mouseenter', () => cursorCross.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorCross.classList.remove('cursor-hover'));
        });
    } else {
        document.body.style.cursor = 'auto';
    }

    // ==================== МАГНИТНЫЕ КНОПКИ ====================
    document.querySelectorAll('.btn, .send-btn, .action-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ==================== 3D-НАКЛОН И СВЕЧЕНИЕ КАРТОЧЕК ====================
    document.querySelectorAll('.feature-card, .widget-card, .download-card').forEach(card => {
        card.classList.add('spotlight-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;

            // позиция свечения
            card.style.setProperty('--mx', `${px * 100}%`);
            card.style.setProperty('--my', `${py * 100}%`);

            // 3D-наклон
            const rotateY = (px - 0.5) * 10;
            const rotateX = (0.5 - py) * 10;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        });
    });
    
    // ==================== ANIMATED PARTICLES ====================
    const particlesContainer = document.querySelector('.animated-particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(212, 212, 216, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
        
        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ==================== FEATURE CARDS ANIMATION ====================
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
    });
    
    // ==================== TERMINAL GLOW EFFECT ====================
    const terminalBody = document.querySelector('.win-terminal-body');
    if (terminalBody) {
        terminalBody.addEventListener('mouseenter', () => {
            terminalBody.style.boxShadow = '0 0 30px rgba(212, 212, 216, 0.2)';
        });
        
        terminalBody.addEventListener('mouseleave', () => {
            terminalBody.style.boxShadow = 'none';
        });
    }
    
    // ==================== CLICK RIPPLE EFFECT ====================
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 10px;
            height: 10px;
            background: rgba(212, 212, 216, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: ripple-animation 0.6s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-animation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ==================== FADE IN UP ANIMATION ====================
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .visible {
            animation: fadeInUp 0.8s ease both;
        }
    `;
    document.head.appendChild(fadeStyle);
});
