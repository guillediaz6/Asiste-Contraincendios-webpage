function toggleMenu() {
    const drawer = document.getElementById('nav-drawer');
    const panel = document.getElementById('nav-drawer-panel');
    
    if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            drawer.classList.remove('fade-out');
            panel.classList.remove('hidden-panel');
        });
    } else {
        drawer.classList.add('fade-out');
        panel.classList.add('hidden-panel');
        
        setTimeout(() => {
            drawer.classList.add('hidden');
            drawer.classList.remove('fade-out');
            document.body.style.overflow = 'auto';
        }, 500);
    }
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('top-bar');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- Services Carousel ---
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('services-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!carousel) return;

    const cards = carousel.querySelectorAll('.service-card');

    function getCardWidth() {
        const track = carousel.querySelector('.services-track');
        const card = track && track.querySelector('.service-card');
        if (!card) return 444;
        const gap = 24;
        return card.getBoundingClientRect().width + gap;
    }

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });
    }

    // Dot click — jump to card
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            carousel.scrollTo({ left: i * getCardWidth(), behavior: 'smooth' });
        });
    });

    // Intersection Observer to highlight ALL currently visible cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = Array.from(cards).indexOf(entry.target);
            if (index !== -1) {
                if (entry.isIntersecting) {
                    dots[index].classList.add('active');
                } else {
                    dots[index].classList.remove('active');
                }
            }
        });
    }, {
        root: carousel,
        threshold: 0.5 // Card must be at least 50% visible to light up its dot
    });

    cards.forEach(card => observer.observe(card));

    // Drag to scroll for Services
    let isDragging = false;
    let startX, scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        carousel.style.scrollBehavior = 'auto';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
        carousel.style.scrollBehavior = 'smooth';
    });
    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        carousel.style.scrollBehavior = 'smooth';
    });
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // --- Reviews Carousel Drag to Scroll ---
    const reviewsCarousel = document.getElementById('reviews-carousel');
    if (reviewsCarousel) {
        let rIsDragging = false;
        let rStartX, rScrollLeft;

        reviewsCarousel.addEventListener('mousedown', (e) => {
            rIsDragging = true;
            reviewsCarousel.style.scrollBehavior = 'auto';
            rStartX = e.pageX - reviewsCarousel.offsetLeft;
            rScrollLeft = reviewsCarousel.scrollLeft;
        });
        reviewsCarousel.addEventListener('mouseleave', () => {
            rIsDragging = false;
            reviewsCarousel.style.scrollBehavior = 'smooth';
        });
        reviewsCarousel.addEventListener('mouseup', () => {
            rIsDragging = false;
            reviewsCarousel.style.scrollBehavior = 'smooth';
        });
        reviewsCarousel.addEventListener('mousemove', (e) => {
            if (!rIsDragging) return;
            e.preventDefault();
            const x = e.pageX - reviewsCarousel.offsetLeft;
            const walk = (x - rStartX) * 1.5;
            reviewsCarousel.scrollLeft = rScrollLeft - walk;
        });
    }

    // --- Cookie & Map Banner Logic ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const acceptMapBtns = document.querySelectorAll('.accept-map-cookies');

    function loadMaps() {
        const lazyMaps = document.querySelectorAll('.lazy-map');
        lazyMaps.forEach(mapDiv => {
            const src = mapDiv.getAttribute('data-src');
            const style = mapDiv.getAttribute('data-style');
            if (src) {
                const iframe = document.createElement('iframe');
                iframe.src = src;
                if (style) iframe.style.cssText = style;
                iframe.allowFullscreen = true;
                iframe.loading = 'lazy';
                iframe.referrerPolicy = 'no-referrer-when-downgrade';
                
                // Remove placeholder and append iframe
                const container = mapDiv.parentElement;
                const placeholder = container.querySelector('.map-placeholder');
                if (placeholder) placeholder.remove();
                
                container.appendChild(iframe);
                mapDiv.remove(); // Remove the lazy-map div
            }
        });
    }

    function acceptCookies() {
        localStorage.setItem('cookiesAccepted', 'true');
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.classList.add('hidden'), 400); // Wait for transition
        }
        loadMaps();
    }

    // Check on load
    if (localStorage.getItem('cookiesAccepted')) {
        loadMaps();
    } else {
        if (cookieBanner) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.remove('hidden');
                setTimeout(() => cookieBanner.classList.add('show'), 50);
            }, 1000);
        }
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', acceptCookies);
    }
    
    acceptMapBtns.forEach(btn => {
        btn.addEventListener('click', acceptCookies);
    });
});
