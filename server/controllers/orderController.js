import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, totalPrice, totalCost } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            totalPrice,
            totalCost
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'Delivered';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status; // Pending, Preparing, Delivered, Cancelled
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Cancel order (User or Admin)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        // Check if order belongs to user or user is admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to cancel this order' });
            return;
        }

        // Only allow cancel if not already delivered
        if (order.status === 'Delivered') {
            res.status(400).json({ message: 'Cannot cancel a delivered order' });
            return;
        }
        order.status = 'Cancelled';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {

        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Remove an item from order
// @route   PUT /api/orders/:id/remove-item
// @access  Private
const removeItemFromOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    const { itemId, priceReduction } = req.body;

    if (order) {
        // Check if order belongs to user who is requesting
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to modify this order' });
            return;
        }

        // Only allow remove if not already delivered or cancelled
        if (order.status === 'Delivered' || order.status === 'Cancelled') {
            res.status(400).json({ message: `Cannot remove item from a ${order.status.toLowerCase()} order` });
            return;
        }

        order.orderItems = order.orderItems.filter((item) => item._id.toString() !== itemId);

        if (order.orderItems.length === 0) {
            order.status = 'Cancelled';
            order.totalPrice = 0;
            order.totalCost = 0;
        } else {
            order.totalPrice -= priceReduction;
            // Calculate accurate total cost without assuming margin if possible, 
            // but here we estimate 40% cost reduction inline with order logic
            order.totalCost -= (priceReduction * 0.4);
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const deleteOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to delete this order' });
            return;
        }
        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

export { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderToDelivered, updateOrderStatus, cancelOrder, removeItemFromOrder, deleteOrder };

