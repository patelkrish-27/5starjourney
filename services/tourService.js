import { database } from '../config/firebase.js';
import { ref, set, get, push, remove, update, query, orderByChild, equalTo } from 'firebase/database';

const toursRef = ref(database, 'tours');

const tourService = {
  // Add a new tour
  async addTour(tourData) {
    const newTourRef = push(toursRef);
    const tour = {
      ...tourData,
      id: newTourRef.key,
      slug: tourData.title.toLowerCase().replace(/\s+/g, '-'),
      category: tourData.category || 'International',
      createdAt: Date.now()
    };
    await set(newTourRef, tour);
    return tour;
  },

  // Get all tours
  async getAllTours() {
    const snapshot = await get(toursRef);
    if (!snapshot.exists()) return [];
    
    const tours = [];
    snapshot.forEach((childSnapshot) => {
      tours.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    return tours;
  },

  // Get active tours
  async getActiveTours() {
    const activeToursQuery = query(toursRef, orderByChild('status'), equalTo('Active'));
    const snapshot = await get(activeToursQuery);
    if (!snapshot.exists()) return [];

    const tours = [];
    snapshot.forEach((childSnapshot) => {
      tours.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    return tours;
  },

  // Get a single tour by ID
  async getTourById(tourId) {
    const tourRef = ref(database, `tours/${tourId}`);
    const snapshot = await get(tourRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.key, ...snapshot.val() };
  },

  // Get a single tour by slug
  async getTourBySlug(slug) {
    const snapshot = await get(toursRef);
    if (!snapshot.exists()) return null;

    let foundTour = null;
    snapshot.forEach((childSnapshot) => {
      const tour = childSnapshot.val();
      if (tour.slug === slug) {
        foundTour = { id: childSnapshot.key, ...tour };
      }
    });
    return foundTour;
  },

  // Update a tour
  async updateTour(tourId, tourData) {
    const tourRef = ref(database, `tours/${tourId}`);
    await update(tourRef, tourData);
    return { id: tourId, ...tourData };
  },

  // Delete a tour
  async deleteTour(tourId) {
    const tourRef = ref(database, `tours/${tourId}`);
    await remove(tourRef);
  },

  // Get tour statistics
  async getTourStats() {
    const snapshot = await get(toursRef);
    if (!snapshot.exists()) {
      return {
        totalTours: 0,
        internationalTours: 0,
        domesticTours: 0
      };
    }
  
    let stats = {
      totalTours: 0,
      internationalTours: 0,
      domesticTours: 0
    };
  
    snapshot.forEach((childSnapshot) => {
      stats.totalTours++;
      const tour = childSnapshot.val();
      if (tour.category === 'International') stats.internationalTours++;
      if (tour.category === 'Domestic') stats.domesticTours++;
    });
  
    return stats;
  }
};

export default tourService;