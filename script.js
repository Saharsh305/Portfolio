document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealElements = document.querySelectorAll('.reveal');
    if (prefersReducedMotion) {
        revealElements.forEach((el) => el.classList.add('active'));
    } else {
        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach((el) => revealOnScroll.observe(el));
    }

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

    const copyEmailButton = document.getElementById('copy-email');
    const emailFeedback = document.getElementById('email-feedback');
    if (copyEmailButton && emailFeedback) {
        const emailText = copyEmailButton.dataset.emails || 'b24cs1105@iitj.ac.in, thakorsaharsh33@gmail.com';
        const setFeedback = (text) => {
            emailFeedback.textContent = text;
        };

        const fallbackCopy = (text) => {
            const helper = document.createElement('textarea');
            helper.value = text;
            helper.setAttribute('readonly', '');
            helper.style.position = 'absolute';
            helper.style.left = '-9999px';
            document.body.appendChild(helper);
            helper.select();
            document.execCommand('copy');
            document.body.removeChild(helper);
        };

        copyEmailButton.addEventListener('click', async () => {
            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(emailText);
                } else {
                    fallbackCopy(emailText);
                }
                setFeedback('Email copied. Paste it in any mail app.');
            } catch (error) {
                setFeedback('Copy failed. Use: b24cs1105@iitj.ac.in');
            }
        });
    }

    const skillsSection = document.querySelector('[data-skills-section]');
    const skillsWheel = document.querySelector('[data-skills-wheel]');
    const wheelSkills = Array.from(document.querySelectorAll('.wheel-skill'));
    const skillFeedItems = Array.from(document.querySelectorAll('.skill-feed-item'));
    const progressFill = document.querySelector('[data-progress-fill]');
    const progressValue = document.querySelector('[data-progress-value]');

    if (!skillsSection || !wheelSkills.length || !progressFill || !progressValue) return;

    const totalSkills = wheelSkills.length;
    skillsSection.style.setProperty('--skills-count', String(totalSkills));

    let ticking = false;
    const updateSkillReveal = () => {
        const rect = skillsSection.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const scrollDistance = Math.max(skillsSection.offsetHeight - window.innerHeight, 1);
        const rawProgress = (window.scrollY - sectionTop) / scrollDistance;
        const progress = prefersReducedMotion ? 1 : Math.min(1, Math.max(0, rawProgress));
        const revealedCount = prefersReducedMotion
            ? totalSkills
            : Math.max(1, Math.floor(progress * totalSkills) + 1);

        wheelSkills.forEach((item, index) => {
            item.classList.toggle('active', index < revealedCount);
        });

        skillFeedItems.forEach((item, index) => {
            item.classList.toggle('active', index < revealedCount);
        });

        const percent = Math.round((revealedCount / totalSkills) * 100);
        progressFill.style.width = `${percent}%`;
        progressValue.textContent = `${revealedCount}/${totalSkills}`;

        if (skillsWheel) {
            const rotation = prefersReducedMotion ? 0 : (progress * 140) - 70;
            skillsWheel.style.setProperty('--wheel-rotation', `${rotation}deg`);
        }
    };

    const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateSkillReveal();
            ticking = false;
        });
    };

    updateSkillReveal();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
});
