import Order from '../models/Order.js';
import Food from '../models/Food.js';
import User from '../models/User.js';

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const orders = await Order.find({});

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const totalCost = orders.reduce((acc, order) => acc + (order.totalCost || 0), 0);
        const totalProfit = totalRevenue - totalCost;

        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalFoods = await Food.countDocuments({});

        // Calculate top selling items
        const foodPerformance = {};
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const foodId = item.food ? item.food.toString() : item.name;
                if (!foodPerformance[foodId]) {
                    foodPerformance[foodId] = { name: item.name, qty: 0 };
                }
                foodPerformance[foodId].qty += item.qty;
            });
        });

        const topSellingItems = Object.values(foodPerformance)
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);

        // Analytics based on range (default to 7 days)
        const range = req.query.range || '7d';
        const ago = new Date();

        if (range === '1m') ago.setMonth(ago.getMonth() - 1);
        else if (range === '3m') ago.setMonth(ago.getMonth() - 3);
        else if (range === '6m') ago.setMonth(ago.getMonth() - 6);
        else ago.setDate(ago.getDate() - 7); // Default 7 days

        const dailyStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: ago }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: range === '7d' ? "%Y-%m-%d" : "%Y-%m-%d", // Could group by month for 6m+
                            date: "$createdAt"
                        }
                    },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    revenue: 1,
                    orders: 1
                }
            }
        ]);

        res.json({
            totalOrders,
            totalRevenue,
            totalCost,
            totalProfit,
            totalUsers,
            totalFoods,
            topSellingItems,
            dailyStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getDashboardStats };
