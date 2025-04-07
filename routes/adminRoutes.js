import express from 'express';
import tourService from '../services/tourService.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(cookieParser());

// Mock admin credentials - In production, use a proper database and authentication system
const ADMIN_CREDENTIALS = {
    email: 'info.5starjourney@gmail.com',
    password: '5*Journey'
};

// JWT secret key - in production, use environment variable
const JWT_SECRET = 'your-jwt-secret-key';

// Middleware to check if user is authenticated using cookies and JWT
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.adminToken;
    
    if (!token) {
        return res.redirect('/admin/login');
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.redirect('/admin/login');
    }
};

// Admin login page
router.get('/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login | 5starjourney' });
});

// Admin login process
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Check credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Create JWT token
        const token = jwt.sign(
            { email: ADMIN_CREDENTIALS.email, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Set cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        // Redirect to dashboard
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { 
            title: 'Admin Login | 5starjourney',
            error: 'Invalid email or password' 
        });
    }
});

// Admin logout
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});

// Admin dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Get real data from Firebase
        const stats = await tourService.getTourStats();
        const tours = await tourService.getAllTours();
        
        res.render('admin/dashboard', {
            title: 'Admin Dashboard | 5starjourney',
            stats,
            tours
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).render('error', { 
            title: 'Error | 5starjourney',
            message: 'Failed to load dashboard data' 
        });
    }
});

// Get single tour
router.get('/tours/:id', isAuthenticated, async (req, res) => {
    try {
        const tour = await tourService.getTourById(req.params.id);
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }
        res.json(tour);
    } catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({ error: 'Failed to fetch tour' });
    }
});

// Create new tour
router.post('/tours', isAuthenticated, async (req, res) => {
    try {
        const tour = await tourService.addTour(req.body);
        res.status(201).json(tour);
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ error: 'Failed to create tour' });
    }
});

// Update tour
router.put('/tours/:id', isAuthenticated, async (req, res) => {
    try {
        const tour = await tourService.updateTour(req.params.id, req.body);
        res.json(tour);
    } catch (error) {
        console.error('Error updating tour:', error);
        res.status(500).json({ error: 'Failed to update tour' });
    }
});

// Delete tour
router.delete('/tours/:id', isAuthenticated, async (req, res) => {
    try {
        await tourService.deleteTour(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting tour:', error);
        res.status(500).json({ error: 'Failed to delete tour' });
    }
});

export default router;