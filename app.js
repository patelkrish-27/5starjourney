const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('home', { 
        title: 'Adventure & Trekking Experiences'
    });
});

// Add the tour page route
app.get('/tours/:tourSlug', (req, res) => {
    // This is a simplified example - in a real app, you would fetch tour data from a database
    const tourData = {
        title: 'Bali Cultural Adventure',
        tourName: 'Bali Cultural Adventure',
        duration: 7,
        tourType: 'Cultural',
        difficulty: 'Easy',
        tourDescription: 'Immerse yourself in the enchanting beauty of Bali on this 7-day adventure. From ancient temples to pristine beaches, experience the perfect blend of culture, nature, and relaxation while enjoying authentic Balinese hospitality and cuisine.',
        groupSize: 12,
        startingPoint: 'Denpasar',
        highlights: [
            'Visit sacred temples including Tanah Lot',
            'Explore Ubud\'s rice terraces',
            'Traditional dance performances',
            'Stay in luxury beach resorts',
            'Sunset at Uluwatu Temple'
        ],
        itinerary: [
            { title: 'Day 1: Arrival in Denpasar', description: 'Welcome ceremony and beach dinner' },
            { title: 'Day 2-3: Ubud', description: 'Rice terraces and art galleries' },
            { title: 'Day 4-5: Seminyak', description: 'Beach activities and spa treatments' },
            { title: 'Day 6-7: Uluwatu', description: 'Temple visits and farewell dinner' },
            { title: 'Day 8: Departure', description: 'Transfer to airport' }
        ],
        attractions: [
            { name: 'Tanah Lot Temple', description: 'Ancient sea temple perched on a rocky cliff.', image: 'tanah-lot.jpg' },
            { name: 'Ubud Rice Terraces', description: 'Stunning landscapes of emerald green rice paddies.', image: 'rice-terraces.jpg' },
            { name: 'Uluwatu Temple', description: 'Clifftop temple famous for its sunset views.', image: 'uluwatu.jpg' },
            { name: 'Nusa Dua Beach', description: 'Pristine white sand beach with crystal clear waters.', image: 'nusa-dua.jpg' }
        ],
        faqs: [
            { 
                question: 'What\'s the best time to visit Bali?', 
                answer: 'The best time to visit Bali is during the dry season (April to October) when the weather is sunny and less humid. However, Bali is beautiful year-round.' 
            },
            { 
                question: 'Do I need a visa to enter Bali?', 
                answer: 'Many countries receive a free visa on arrival for 30 days. Check with your local embassy for specific requirements.' 
            },
            { 
                question: 'What\'s included in the tour packages?', 
                answer: 'Our packages typically include accommodation, transportation, guided tours, some meals, and entrance fees to attractions.' 
            },
            { 
                question: 'How fit do I need to be for the activities?', 
                answer: 'Most activities are suitable for average fitness levels. More strenuous activities like mountain trekking will be clearly marked.' 
            },
            { 
                question: 'What\'s the accommodation like?', 
                answer: 'We offer various accommodation options from luxury resorts to boutique hotels, all carefully selected for comfort and quality.' 
            },
            { 
                question: 'Can I customize my tour?', 
                answer: 'Yes, we offer customization options for private tours. Contact our team to discuss your specific requirements.' 
            }
        ],
        otherTours: [
            {
                name: 'Mount Batur Sunrise Trek',
                duration: 2,
                type: 'Adventure',
                description: 'Experience the magical sunrise from Mount Batur with professional guides.',
                price: 199,
                image: 'mount-batur.jpg',
                slug: 'mount-batur-trek'
            },
            {
                name: 'Nusa Penida Island Tour',
                duration: 3,
                type: 'Beach',
                description: 'Explore the stunning beaches and viewpoints of Nusa Penida Island.',
                price: 299,
                image: 'nusa-penida.jpg',
                slug: 'nusa-penida-tour'
            },
            {
                name: 'Ubud Spiritual Retreat',
                duration: 5,
                type: 'Wellness',
                description: 'Rejuvenate your mind and body with yoga, meditation, and spa treatments.',
                price: 499,
                image: 'ubud-retreat.jpg',
                slug: 'ubud-retreat'
            }
        ]
    };
    
    res.render('tourpage', tourData);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});