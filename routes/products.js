const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Add a new product (For Admin)
router.post('/', async (req, res) => {
  const { name, description, price, image } = req.body;

  try {
    const product = await Product.create({ name, description, price, image });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error });
  }
});

module.exports = router;
