import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    couponCode,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    couponCode,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  // Update sold count
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { soldCount: item.quantity, stock: -item.quantity },
    });
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only allow owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Pay order (update payment result)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = 'processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
  };
  order.statusHistory.push({ status: 'processing', note: 'Payment confirmed' });

  const updatedOrder = await order.save();
  res.json({ success: true, order: updatedOrder });
});

// ─── ADMIN ───────────────────────────────────────────────────────────────────

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin
export const getAdminOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const filter = status ? { status } : {};

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  order.statusHistory.push({ status, note: note || `Status updated to ${status}` });

  const updated = await order.save();
  res.json({ success: true, order: updated });
});

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalOrders,
    monthOrders,
    lastMonthOrders,
    totalRevenue,
    monthRevenue,
    pendingOrders,
    topProducts,
    recentOrders,
    salesByDay,
  ] = await Promise.all([
    Order.countDocuments({ isPaid: true }),
    Order.countDocuments({ isPaid: true, createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ isPaid: true, createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.countDocuments({ status: 'pending' }),
    Product.find().sort({ soldCount: -1 }).limit(5).select('name soldCount price images'),
    Order.find({ isPaid: true }).sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
    Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  res.json({
    success: true,
    analytics: {
      totalOrders,
      monthOrders,
      lastMonthOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      pendingOrders,
      topProducts,
      recentOrders,
      salesByDay,
    },
  });
});
