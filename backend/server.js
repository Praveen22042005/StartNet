const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/auth/passwordRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/password', passwordRoutes);

app.use('/api/profile', require('./routes/entrepreneur/profileRoutes'));
app.use('/api/entrepreneur/startups', require('./routes/entrepreneur/my-startup-routes')); // Updated path

// New: Startup logo upload route
app.use('/api/entrepreneur', require('./routes/entrepreneur/startupLogoRoutes'));

// Mount investor routes
app.use('/api/investor/profile', require('./routes/investor/profileRoutes'));
app.use('/api/investor/startups', require('./routes/investor/startupRoutes'));

// Mount investor settings routes
app.use('/api/investor/settings', require('./routes/investor/settingsRoutes'));

// Basic route with HTML response
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StartNet API</title>
        <style>
            body {
                font-family: 'Montserrat', sans-serif;
                background-color: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                background-color: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #000;
                margin-bottom: 1rem;
            }
            .status {
                color: #4a4a4a;
                font-size: 1.2rem;
            }
            .badge {
                background-color: #4CAF50;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                display: inline-block;
                margin-top: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>StartNet API</h1>
            <p class="status">Backend Service</p>
            <div class="badge">Running</div>
        </div>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});