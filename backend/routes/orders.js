const express = require('express');
const Order = require('../models/order');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - shippingAddress
 *               - items
 *               - total
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { email, items, total, shippingAddress, name } = req.body;

    // Validate required fields
    if (!email || !items || !total || !name || !shippingAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, name, shippingAddress, items, and total are required' 
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }

    // Generate unique order number
    const orderNumber = `FE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate estimated delivery (7-10 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 4) + 7);

    // Create new order - matches schema requirements
    const order = new Order({
      orderNumber,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      shippingAddress: typeof shippingAddress === 'string' 
        ? shippingAddress 
        : JSON.stringify(shippingAddress),
      items,
      total,
      estimatedDelivery,
      statusIndex: 0,
      statusHistory: []
    });

    // Initialize status
    order.ensureInitialStatus();

    // Save to MongoDB
    await order.save();

    console.log('Order created successfully:', orderNumber);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderNumber: order.orderNumber,
      order: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /api/orders/track:
 *   post:
 *     summary: Get the current status of an order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - email
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 example: FE-123456
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Order status payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderNumber:
 *                   type: string
 *                 currentStatus:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     label:
 *                       type: string
 *                     description:
 *                       type: string
 *                     enteredAt:
 *                       type: string
 *                       format: date-time
 *                 statusHistory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderStatus'
 *                 statusFlow:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderStatus'
 *       404:
 *         description: Order not found
 *       400:
 *         description: Validation error
 */
router.post('/track', async (req, res) => {
  try {
    const { orderNumber, email } = req.body || {};

    if (!orderNumber || !email) {
      return res.status(400).json({ error: 'Order number and email are required.' });
    }

    const normalizedOrderNumber = String(orderNumber).trim().toUpperCase();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!normalizedOrderNumber.startsWith('FE-')) {
      return res.status(400).json({ error: 'Invalid order number format.' });
    }

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const order = await Order.findOne({ orderNumber: normalizedOrderNumber, email: normalizedEmail });

    if (!order) {
      return res.status(404).json({ error: 'Order not found. Double-check your email and order number.' });
    }

    order.ensureInitialStatus();

    let advanced = false;
    if (order.statusIndex < Order.STATUS_FLOW.length - 1) {
      const shouldAdvance = order.statusHistory.length > 1 ? Math.random() < 0.75 : Math.random() < 0.35;
      if (shouldAdvance) {
        advanced = order.advanceStatus();
      }
    }

    if (advanced) {
      order.markModified('statusHistory');
    }

    await order.save();

    const responsePayload = {
      orderNumber: order.orderNumber,
      email: order.email,
      currentStatus: order.statusHistory[order.statusHistory.length - 1],
      statusHistory: order.statusHistory,
      statusFlow: Order.STATUS_FLOW,
      total: order.total,
      items: order.items,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.json(responsePayload);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: 'Unable to fetch order status right now.' });
  }
});

module.exports = router;