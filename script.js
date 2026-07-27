;(() => {
    'use strict';

    // ==================== PARTICLE CANVAS ====================

    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() * 60 + 260;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                const force = (200 - dist) / 200 * 0.3;
                this.x -= dx / dist * force;
                this.y -= dy / dist * force;
            }

            if (this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        resizeCanvas();
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(270, 60%, 70%, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        animId = requestAnimationFrame(animateParticles);
    }

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    initParticles();
    animateParticles();

    // ==================== TYPEWRITER ====================

    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        const words = ['Kajtexio', 'Server Specialist', 'Infrastructure Expert', 'DevOps Engineer'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function type() {
            if (isPaused) return;

            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentWord.length) {
                speed = 2000;
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    typeLoop();
                }, speed);
                return;
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                speed = 500;
            }

            setTimeout(typeLoop, speed);
        }

        function typeLoop() {
            if (!typingElement) return;
            type();
        }

        typeLoop();
    }

    // ==================== NAVBAR SCROLL ====================

    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==================== HAMBURGER MENU ====================

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link, .contact-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ==================== SCROLL ANIMATIONS ====================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.server-card, .stat-card, .detail-item, .code-window, .section-header, .contact-card').forEach(el => {
        el.classList.add('fade-in');
        scrollObserver.observe(el);
    });

    // stagger cards
    document.querySelectorAll('.server-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.05}s`;
    });

    // ==================== FILTER BUTTONS ====================

    const filterBtns = document.querySelectorAll('.filter-btn');
    const serverCards = document.querySelectorAll('.server-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            serverCards.forEach(card => {
                const role = card.dataset.role;
                if (filter === 'all' || role === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            });
        });
    });

    // ==================== COUNTER ANIMATION ====================

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    function animateCounter(el, target) {
        let current = 0;
        const increment = Math.ceil(target / 60);
        const duration = 2000;
        const stepTime = Math.floor(duration / 60);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            if (target === 100) {
                el.textContent = current + '%';
            } else {
                el.textContent = current + '+';
            }
        }, stepTime);
    }

    document.querySelectorAll('.stat-number').forEach(el => {
        counterObserver.observe(el);
    });

    // ==================== CARD TILT EFFECT ====================

    document.querySelectorAll('.server-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            card.style.setProperty('--mx', `${x}px`);
            card.style.setProperty('--my', `${y}px`);
            card.style.transform = `perspective(800px) rotateY(${deltaX * 3}deg) rotateX(${-deltaY * 3}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
        });
    });

    // ==================== SMOOTH ANCHOR SCROLL ====================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
