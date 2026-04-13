import express from 'express';
import citoyenRoutes from '../routes/citoyen.router.js';
import timeSloteRoutes from '../routes/timesSlot.router.js';
import horaireTravailRoutes from '../routes/horaireTravail.router.js';
import serviceRoutes from '../routes/service.router.js';
import path from 'path';
import reservationRoutes from '../routes/reservation.router.js';
import ferieRoutes from '../routes/feries.router.js';
import rulesRoutes from '../routes/rules.router.js';
import cors from 'cors';
import securityMiddleware from '../middlewares/security.middleware.js';
import sanitizeMiddleware from '../middlewares/sanitize.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import loginRoutes from '../routes/login.router.js';
import pauses from '../routes/pause.router.js';
const app = express();
app.use(express.json({ limit: '10kb' }));  // Limite taille body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));      
// Helmet + mongoSanitize + hpp
app.use(sanitizeMiddleware);              // Sanitize les données d'entrée
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

// Règles
app.use('/api/rules', rulesRoutes);

// Pauses
app.use('/api/pauses',pauses)

//login
app.use('/api/auth', loginRoutes);

app.get('/api/me', authMiddleware(), (req, res) => {
    res.status(200).send({
      message: "Utilisateur connecté",
      user: req.user
    });
  });

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;