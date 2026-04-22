const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  quantity: { type: Number, required: true, min: 1 },
  size: String,
  color: String,
  customization: {
    designText: String,
    designImage: String,  // URL to uploaded design
    printArea: String,
    font: String,
    textColor: String,
    notes: String
  },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'India' }
  },
  pricing: {
    subtotal: Number,
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: Number
  },
  payment: {
    method: { type: String, enum: ['stripe', 'cod'], default: 'stripe' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    stripePaymentIntentId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'designing', 'printing', 'quality-check', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  trackingNumber: String,
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  estimatedDelivery: Date,
  notes: String
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `TSHIRT-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
