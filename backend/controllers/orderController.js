const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, payment } = req.body;
    let subtotal = 0;

    // Validate items and compute prices
    const enrichedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product ${item.product} not found`);
      
      const sizeInfo = product.sizes.find(s => s.size === item.size);
      const printAreaInfo = product.printAreas?.find(p => p.name === item.customization?.printArea);
      const unitPrice = product.basePrice 
        + (sizeInfo?.additionalPrice || 0) 
        + (printAreaInfo?.additionalPrice || 0);
      
      // Bulk discount
      let discount = 0;
      const bulkTier = product.bulkPricing
        ?.filter(b => item.quantity >= b.minQty)
        .sort((a, b) => b.minQty - a.minQty)[0];
      if (bulkTier) discount = (unitPrice * bulkTier.discount) / 100;
      
      const finalUnitPrice = unitPrice - discount;
      const totalPrice = finalUnitPrice * item.quantity;
      subtotal += totalPrice;
      
      return { ...item, productName: product.name, unitPrice: finalUnitPrice, totalPrice };
    }));

    const shipping = subtotal >= 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      pricing: { subtotal, shipping, tax, total },
      payment: { method: payment?.method || 'stripe', status: 'pending' },
      statusHistory: [{ status: 'placed', note: 'Order placed by customer', updatedBy: req.user._id }]
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Customers can only view their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (!['placed', 'confirmed'].includes(order.status))
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer', updatedBy: req.user._id });
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin controllers
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}`, updatedBy: req.user._id });
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
