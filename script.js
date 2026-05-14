/* ========================================
   SWEET EVENT - Interactive Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== NAVIGATION ===== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 100;
            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

                if (scrollPos >= top && scrollPos < bottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        });
    }

    /* ===== HERO CAROUSEL ===== */
    const slides = document.querySelectorAll('.carousel-slide');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && indicatorsContainer) {
        slides.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.classList.add('carousel-indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = document.querySelectorAll('.carousel-indicator');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            resetInterval();
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        slideInterval = setInterval(nextSlide, 5000);
    }

    /* ===== VIDEO SHOWCASE ===== */
    const showcaseVideo = document.getElementById('showcase-video');
    const videoPlayOverlay = document.getElementById('video-play-overlay');

    if (showcaseVideo && videoPlayOverlay) {
        // Click overlay to play - resume from current position
        videoPlayOverlay.addEventListener('click', () => {
            videoPlayOverlay.classList.add('hidden');
            const playPromise = showcaseVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // If autoplay fails, show overlay again
                    videoPlayOverlay.classList.remove('hidden');
                });
            }
        });

        // Hide overlay when video starts playing
        showcaseVideo.addEventListener('playing', () => {
            videoPlayOverlay.classList.add('hidden');
        });

        // Show overlay only when video ends (not on pause - native controls handle pause)
        showcaseVideo.addEventListener('ended', () => {
            videoPlayOverlay.classList.remove('hidden');
        });
    }

    /* ===== GALLERY LIGHTBOX ===== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentImageIndex = 0;

    if (galleryItems.length > 0 && lightbox && lightboxImg) {
        const galleryImages = Array.from(galleryItems).map(item => item.dataset.img);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImageIndex = index;
                lightboxImg.src = item.dataset.img;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function showImage(index) {
            if (index < 0) index = galleryImages.length - 1;
            if (index >= galleryImages.length) index = 0;
            currentImageIndex = index;
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = galleryImages[index];
                lightboxImg.style.opacity = '1';
            }, 200);
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentImageIndex - 1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentImageIndex + 1);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        });

        lightboxImg.style.transition = 'opacity 0.3s ease';
    }

    /* ===== CONTACT FORM TO WHATSAPP (SPANISH) ===== */
    const contactForm = document.getElementById('contact-form');
    const whatsappNumber = '16467493821';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const eventType = document.getElementById('event-type').value;
            const eventDate = document.getElementById('event-date').value;
            const message = document.getElementById('message').value.trim();

            // Build WhatsApp message in Spanish
            let waMessage = '*Nueva consulta desde el sitio web*\n\n';
            waMessage += '*Nombre:* ' + name + '\n';
            waMessage += '*Telefono:* ' + phone + '\n';
            waMessage += '*Tipo de evento:* ' + eventType + '\n';

            if (eventDate) {
                const dateObj = new Date(eventDate);
                const formattedDate = dateObj.toLocaleDateString('es-DO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                waMessage += '*Fecha del evento:* ' + formattedDate + '\n';
            }

            if (message) {
                waMessage += '\n*Detalles adicionales:*\n' + message;
            }

            const encodedMessage = encodeURIComponent(waMessage);
            const whatsappURL = 'https://wa.me/' + whatsappNumber + '?text=' + encodedMessage;

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Redirigiendo a WhatsApp...';
            submitBtn.style.background = 'linear-gradient(135deg, #1ebd5b 0%, #0e7a6c 100%)';

            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                submitBtn.innerHTML = originalContent;
                contactForm.reset();
            }, 800);
        });
    }

    /* ===== SCROLL ANIMATIONS ===== */
    const fadeElements = document.querySelectorAll(
        '.section-header, .service-card, .gallery-item, .about-text, .about-image, .contact-info, .contact-form-wrapper, .video-wrapper'
    );

    fadeElements.forEach(el => el.classList.add('fade-in'));

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    /* ===== SMOOTH SCROLL ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 70;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    /* ===== COUNTER ANIMATION ===== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasPercent = text.includes('%');
            const hasPlus = text.includes('+');
            const target = parseInt(text.replace(/[^0-9]/g, ''));
            let current = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                let display = Math.floor(current).toString();
                if (hasPlus) display = '+' + display;
                if (hasPercent) display = display + '%';
                stat.textContent = display;
            }, 16);
        });
        countersAnimated = true;
    }

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    console.log('Sweet Event - Disenadora de Eventos');
});
