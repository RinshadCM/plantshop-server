const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

CartSchema.index({ userId: 1, productId: 1 }, { unique: true });

CartSchema.methods.getTotalPrice = function() {
  return this.price * this.quantity;
};

CartSchema.statics.getCartTotal = async function(userId) {
  const cartItems = await this.find({ userId });
  return cartItems.reduce((total, item) => total + item.getTotalPrice(), 0);
};

CartSchema.statics.getTotalCount = async function(userId) {
  const cartItems = await this.find({ userId });
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

CartSchema.virtual('totalPrice').get(function() {
  return this.price * this.quantity;
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;