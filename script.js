document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Interactive Mouse Glow Effect
    const handleOnMouseMove = e => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect(),
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;

        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-x", `${y}px`); // Fix: should be --mouse-y
    }

    const bentoBoxes = document.querySelectorAll('.bento-box');
    
    // Better mouse tracking approach for the whole grid
    document.getElementById("bento-grid-wrapper")?.addEventListener("mousemove", e => {
        for(const box of document.querySelectorAll(".bento-box")) {
            const rect = box.getBoundingClientRect(),
                  x = e.clientX - rect.left,
                  y = e.clientY - rect.top;
            
            box.style.setProperty("--mouse-x", `${x}px`);
            box.style.setProperty("--mouse-y", `${y}px`);
        }
    });
});
