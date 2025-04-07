gsap.registerPlugin(ScrollTrigger);
gsap.to(".service-heading", {
    scrollTrigger: {
        trigger: ".services",
        start: "top 95%", // when section comes into view
        
    },
    y: 0,
    opacity: 1,
    ease: "power2.out",
    duration: 0.5
})
gsap.to(".events-heading", {
    scrollTrigger: {
        trigger: ".events",
        start: "top 95%", // when section comes into view
        
    },
    y: 0,
    opacity: 1,
    ease: "power2.out",
    duration: 0.5
})


ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
        gsap.to(".service-card", {
            scrollTrigger: {
              trigger: ".services",
              start: "top 80%", // when section comes into view
            },
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.3, // <- This causes the delay between each card
          });
          gsap.to(".event-card", {
            scrollTrigger: {
              trigger: ".events",
              start: "top 80%", // when section comes into view
            },
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.3, // <- This causes the delay between each card
          });
    },
    "(max-width: 767px)": function () {
        gsap.to(".service-card", {
            scrollTrigger: {
              trigger: ".service-card",
              start: "top 95%", // when section comes into view
              scrub: 1, // delay between each card
              
            },
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.3, // <- This causes the delay between each card
          });


        gsap.utils.toArray(".event-card").forEach((card, index) => {
            gsap.to(card, {
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "top 50%",     // when section comes into view
                toggleActions: "play none none none",
                scrub: 1, 
                // markers: true, // uncomment to debug
              },
              opacity: 1,
              y: 0,
              ease: "power2.out",
              
            });
          });
          
    },



    
})






