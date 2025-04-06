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

// Home page - now using Firebase data
app.get('/', async (req, res) => {
    try {
        const tours = await tourService.getActiveTours();
        res.render('home', { 
            title: '5starjourney',
            tours: tours
        });
    } catch (error) {
        console.error('Error fetching tours:', error);
        res.render('home', { 
            title: '5starjourney',
            tours: []
        });
    }
});

// Tour detail page route - now using Firebase data
app.get('/tours/:tourSlug', async (req, res) => {
    try {
        const tour = await tourService.getTourBySlug(req.params.tourSlug);
        if (!tour) {
            return res.status(404).render('error', { 
                title: 'Not Found | 5starjourney',
                message: 'Tour not found' 
            });
        }

        const tourData = {
            ...tour,
            title: `${tour.name} | 5starjourney`,
            tourName: tour.name,
            tourType: tour.type,
            tourDescription: tour.description
        };
        
        res.render('tourpage', tourData);
    } catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).render('error', { 
            title: 'Error | 5starjourney',
            message: 'Failed to load tour details' 
        });
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