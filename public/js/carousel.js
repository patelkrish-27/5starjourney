document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const slideContainer = carousel.querySelector('.flex');
    const slides = slideContainer.querySelectorAll('img');
    const prevButton = carousel.querySelector('.fa-chevron-left').parentElement;
    const nextButton = carousel.querySelector('.fa-chevron-right').parentElement;
    const indicators = carousel.querySelectorAll('.bottom-4 button');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Function to update the carousel position
    function updateCarousel() {
        const slideWidth = slides[0].clientWidth;
        slideContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('bg-white');
                indicator.classList.remove('bg-white/60');
            } else {
                indicator.classList.add('bg-white/60');
                indicator.classList.remove('bg-white');
            }
        });
    }
    
    // Event listeners for buttons
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
    });
    
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    });
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // Auto-advance the carousel every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    }, 5000);
    
    // Initialize
    updateCarousel();
});