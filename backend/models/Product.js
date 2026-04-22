const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  category: {
    type: String,
    enum: ['round-neck', 'polo', 'v-neck', 'hoodie', 'tank-top'],
    required: true
  },
  colors: [{ name: String, hex: String, stock: { type: Number, default: 50 } }],
  sizes: [{ size: String, additionalPrice: { type: Number, default: 0 } }],
  images: [{ url: String, alt: String }],
  customizable: { type: Boolean, default: true },
  minQuantity: { type: Number, default: 1 },
  bulkPricing: [{
    minQty: Number,
    discount: Number  // percentage
  }],
  printAreas: [{
    name: { type: String, enum: ['front', 'back', 'left-sleeve', 'right-sleeve'] },
    additionalPrice: { type: Number, default: 0 }
  }],
  tags: [String],
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
