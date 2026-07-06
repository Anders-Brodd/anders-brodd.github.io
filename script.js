document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Hero Text Scroll Animation
    const heroContent = document.getElementById('hero-content');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Adjust the speed and fade limits
        const maxScroll = 400; // pixels
        const opacity = Math.max(0, 1 - (scrollY / maxScroll));
        const translateY = Math.min(scrollY * 0.5, 200); // pixels moved up
        
        if (heroContent) {
            heroContent.style.opacity = opacity.toFixed(2);
            heroContent.style.transform = `translateY(-${translateY}px)`;
        }
    });

    // 2. Intersection Observer for Slide-in Animation
    const portfolioCard = document.getElementById('mountain-architect-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the card is visible
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once it's visible so it doesn't animate out
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (portfolioCard) {
        cardObserver.observe(portfolioCard);
    }

    // 3. Card Expand / Collapse Logic
    const closeBtn = document.getElementById('close-card-btn');
    
    // Click on the whole card expands it
    if (portfolioCard) {
        portfolioCard.addEventListener('click', function(e) {
            // Prevent opening if clicking on the close button or links inside expanded view
            if (e.target === closeBtn || e.target.tagName.toLowerCase() === 'a') {
                return;
            }
            if (!this.classList.contains('expanded')) {
                this.classList.add('expanded');
                // Optional: Scroll to the card smoothly
                this.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Click on close button collapses it
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Stop the event from reaching the card click listener
            if (portfolioCard.classList.contains('expanded')) {
                portfolioCard.classList.remove('expanded');
            }
        });
    }
});
