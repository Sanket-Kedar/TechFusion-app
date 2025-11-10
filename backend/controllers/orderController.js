import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify stock availability
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}` 
        });
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is authorized
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'processing';
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      
      if (req.body.status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel order (Hybrid: Direct for pending, Request for processing)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (order.status === 'cancel_requested') {
      return res.status(400).json({ message: 'Cancel request is already pending admin approval' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be cancelled' });
    }

    if (order.status === 'shipped') {
      return res.status(400).json({ message: 'Shipped orders cannot be cancelled. Please contact support.' });
    }

    const { reason } = req.body;

    // HYBRID APPROACH
    if (order.status === 'pending') {
      // Direct cancellation for pending orders
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }

      order.status = 'cancelled';
      order.cancelReason = reason || 'Cancelled by user';
      const updatedOrder = await order.save();

      return res.json({
        message: 'Order cancelled successfully',
        directCancel: true,
        order: updatedOrder
      });
    }

    if (order.status === 'processing') {
      // Request cancellation for processing orders (needs admin approval)
      order.status = 'cancel_requested';
      order.cancelReason = reason || 'Cancellation requested by user';
      order.cancelRequestedAt = Date.now();
      const updatedOrder = await order.save();

      return res.json({
        message: 'Cancellation request sent to admin for approval',
        directCancel: false,
        requiresApproval: true,
        order: updatedOrder
      });
    }

    res.status(400).json({ message: 'Order cannot be cancelled' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Approve cancel request
// @route   PUT /api/orders/:id/approve-cancel
// @access  Private/Admin
export const approveCancelRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'cancel_requested') {
      return res.status(400).json({ message: 'No cancel request pending for this order' });
    }

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    const updatedOrder = await order.save();

    res.json({
      message: 'Cancel request approved. Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reject cancel request
// @route   PUT /api/orders/:id/reject-cancel
// @access  Private/Admin
export const rejectCancelRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'cancel_requested') {
      return res.status(400).json({ message: 'No cancel request pending for this order' });
    }

    // Revert status back to processing
    order.status = 'processing';
    order.cancelReason = null;
    order.cancelRequestedAt = null;
    const updatedOrder = await order.save();

    res.json({
      message: 'Cancel request rejected. Order will continue processing',
      order: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
