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

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
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
  try {
    const id = req.params.id;
    const tour = await tourService.getTourById(id);
    
    if (!tour) {
      return res.status(404).render('error', { message: 'Tour not found' });
    }
    res.render('tourpage', { tour });
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