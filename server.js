const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/plantshop';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Database connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
