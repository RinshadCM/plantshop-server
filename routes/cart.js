const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart items for the current user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId; // Match query parameter
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const cart = await Cart.find({ userId });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get cart total for the current user
router.get('/total', async (req, res) => {
  try {
    const userId = req.query.userId; // Match query parameter
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const cartTotal = await Cart.getTotalCount(userId);
    res.json({ total: cartTotal });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add or update item in the cart
router.post('/', async (req, res) => {
  try {
    const { id: productId, name, price, image, quantity, userId } = req.body;

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({ userId, productId, name, price, image, quantity });
      await cartItem.save();
    }

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id: productId } = req.params;
    const { userId } = req.body;

    const cartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { id: productId } = req.params;
    const userId = req.query.userId;

    const result = await Cart.findOneAndDelete({ userId, productId });

    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
