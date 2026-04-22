const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.pricing.total * 100), // paise
      currency: 'inr',
      metadata: { orderId: order._id.toString(), userId: req.user._id.toString() }
    });

    order.payment.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded')
      return res.status(400).json({ message: 'Payment not completed' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.payment.status = 'paid';
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed', updatedBy: req.user._id });
    await order.save();

    res.json({ order, message: 'Payment confirmed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const order = await Order.findById(pi.metadata.orderId);
    if (order && order.payment.status !== 'paid') {
      order.payment.status = 'paid';
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed via webhook' });
      await order.save();
    }
  }
  res.json({ received: true });
};
