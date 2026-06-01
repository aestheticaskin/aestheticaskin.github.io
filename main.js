/**
 * Aesthetica Skin Clinic — Shared JavaScript
 * ============================================================
 * Contains: Nav scroll behavior, mobile menu, scroll reveal,
 *           accordion/FAQ, and booking form handler.
 *
 * HOW TO EXTEND:
 *   - Add new accordion sections by using class="accordion-item"
 *     with a button.accordion-trigger and div.accordion-body
 *   - Add .reveal class to any element to animate it on scroll
 *   - Form submission: Replace the console.log in handleFormSubmit()
 *     with your API/backend call
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────────
       1. Navigation: scroll shrink + active state
       ────────────────────────────────────────── */
    const nav = document.querySelector('.site-nav');
    const currentPath = window.location.pathname.split('/').pop();

    // Mark active nav link
    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        if (link.dataset.page === currentPath || (currentPath === '' && link.dataset.page === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Shrink nav on scroll
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ──────────────────────────────────────────
       2. Mobile Menu Toggle
       ────────────────────────────────────────── */
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.classList.toggle('open');
            mobileNav.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            menuBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('open');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ──────────────────────────────────────────
       3. Scroll Reveal Animation
       ────────────────────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // animate once
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ──────────────────────────────────────────
       4. Bento Card Stagger Animation
       ────────────────────────────────────────── */
    const bentoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.bento-card, .service-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 100);
                });
                bentoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.bento-grid, .service-grid, .cards-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.bento-card, .service-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        bentoObserver.observe(grid);
    });

    /* ──────────────────────────────────────────
       5. Accordion / FAQ
       ────────────────────────────────────────── */
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const isActive = item.classList.contains('active');

            // Close all items in the same group
            const group = item.closest('.accordion-group');
            if (group) {
                group.querySelectorAll('.accordion-item.active').forEach(open => {
                    if (open !== item) open.classList.remove('active');
                });
            }

            item.classList.toggle('active', !isActive);
        });
    });

    // Open first accordion by default if present
    const firstAccordion = document.querySelector('.accordion-item');
    if (firstAccordion && !firstAccordion.classList.contains('active')) {
        // Optional: auto-open first item
        // firstAccordion.classList.add('active');
    }

    /* ──────────────────────────────────────────
       6. Booking Form Handler
       Replace handleFormSubmit() body with your
       actual API call / form service (Formspree,
       EmailJS, custom backend, etc.)
       ────────────────────────────────────────── */
    const bookingForms = document.querySelectorAll('.booking-form');

    bookingForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('[type="submit"]');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = 'Sending…';

            const data = Object.fromEntries(new FormData(form).entries());

            // ──────────────────────────────────────
            // TODO: Replace this block with your real
            // form submission logic, e.g.:
            //
            // await fetch('https://formspree.io/f/YOUR_ID', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(data)
            // });
            // ──────────────────────────────────────
            console.log('Booking request:', data);
            await new Promise(r => setTimeout(r, 800)); // simulate latency

            btn.textContent = 'Request Sent ✓';
            btn.style.background = 'var(--color-secondary)';

            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    });

    /* ──────────────────────────────────────────
       7. Smooth scroll for anchor links
       ────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = nav ? nav.offsetHeight + 16 : 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});
