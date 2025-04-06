import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';
import tourService from './services/tourService.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Update session configuration for better Vercel compatibility
app.use(session({
  secret: 'weber', // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Add this middleware to set a default title for all routes
app.use((req, res, next) => {
  res.locals.title = '5starjourney';
  next();
});

// Home route
app.get('/', async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    res.render('home', { 
      tours: tours,
      stats: {
        totalTours: tours.length,
        internationalTours: tours.filter(tour => tour.category === 'International').length,
        domesticTours: tours.filter(tour => tour.category === 'Domestic').length
      }
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.render('home', { tours: [], stats: { totalTours: 0, internationalTours: 0, domesticTours: 0 } });
  }
});

// Tour detail page route
app.get('/tours/:id', async (req, res) => {
   const faqs = [
        {
            question: 'What are the best seasons for international travel?',
            answer: 'The best time varies by destination. Generally, shoulder seasons (spring/fall) offer good weather and fewer crowds. We can advise specific timing for your chosen destination.'
        },
        {
            question: 'What travel documents do I need for international tours?',
            answer: 'Requirements vary by destination. Generally, you\'ll need a valid passport with at least 6 months validity. Visa requirements differ by country and nationality.'
        },
        {
            question: 'What\'s included in your tour packages?',
            answer: 'Our packages typically include accommodation, transportation, guided tours, some meals, and entrance fees to attractions. Specific inclusions are listed with each tour.'
        },
        {
            question: 'How physically demanding are the tours?',
            answer: 'Activity levels vary by tour. Most are suitable for average fitness levels. Each tour description includes a difficulty rating and physical requirements.'
        },
        {
            question: 'What types of accommodation do you offer?',
            answer: 'We partner with carefully vetted properties ranging from luxury resorts to boutique hotels. All accommodations meet our high standards for comfort, cleanliness, and service.'
        },
        {
            question: 'Is it possible to customize tours?',
            answer: 'Yes, we specialize in creating customized experiences. Our team can modify existing tours or create completely personalized itineraries to match your preferences.'
        }
    ]
  try {
    const id = req.params.id;
    const tour = await tourService.getTourById(id);
    
    if (!tour) {
      return res.status(404).render('error', { message: 'Tour not found' });
    }
    res.render('tourpage', { tour,faqs });
  } catch (error) {
    console.error('Error fetching tour details:', error);
    res.status(500).render('error', { message: 'Failed to load tour details' });
  }
});

// Admin routes
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error | 5starjourney',
        message: 'Something went wrong!' 
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});