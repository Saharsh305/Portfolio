document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealOnScroll.observe(el));

    const projectCards = document.querySelectorAll('.interactive-card[data-href]');

    const openCardLink = (card) => {
        const href = card.dataset.href;
        if (!href) return;
        window.open(href, '_blank', 'noopener,noreferrer');
    };

    projectCards.forEach((card) => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            openCardLink(card);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openCardLink(card);
        });
    });

    const skillsStrip = document.querySelector('.skills-strip');
    if (!skillsStrip) return;

    skillsStrip.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        const maxScrollLeft = skillsStrip.scrollWidth - skillsStrip.clientWidth;
        if (maxScrollLeft <= 0) return;

        event.preventDefault();
        skillsStrip.scrollBy({
            left: event.deltaY,
            behavior: 'smooth'
        });
    }, { passive: false });

    skillsStrip.addEventListener('keydown', (event) => {
        const step = 120;
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            skillsStrip.scrollBy({ left: step, behavior: 'smooth' });
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            skillsStrip.scrollBy({ left: -step, behavior: 'smooth' });
        }
    });
});
