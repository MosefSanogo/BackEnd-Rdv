import express from 'express';
import citoyenRoutes from '../routes/citoyen.router.js';
import timeSloteRoutes from '../routes/timesSlot.router.js';
import horaireTravailRoutes from '../routes/horaireTravail.router.js';
import serviceRoutes from '../routes/service.router.js';
import path from 'path';
import reservationRoutes from '../routes/reservation.router.js';
import ferieRoutes from '../routes/feries.router.js';

const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

// Citoyen
app.use('/api/citoyen', citoyenRoutes)

// Time-slots
app.use('/api/time-slot', timeSloteRoutes)

// horaires - travail
app.use('/api/horaire-travail',horaireTravailRoutes )

// Service
app.use('/api/service',serviceRoutes)

// Reservation
app.use('/api/reservation',reservationRoutes)

// Jours Feriés
app.use('/api/jour-ferie',ferieRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;