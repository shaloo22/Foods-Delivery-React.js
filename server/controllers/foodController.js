import Food from '../models/Food.js';

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const foods = await Food.find({ ...keyword, ...category });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (food) {
        res.json(food);
    } else {
        res.status(404).json({ message: 'Food not found' });
    }
};

// @desc    Create a food
// @route   POST /api/foods
// @access  Private/Admin
const createFood = async (req, res) => {
    const { name, price, costPrice, description = 'Tasty dish prepared with love.', image, category } = req.body;

    const food = new Food({
        name,
        price,
        costPrice,
        user: req.user._id,
        image,
        category,
        description
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
};

// @desc    Update a food
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
    const { name, price, costPrice, description = 'Tasty dish prepared with love.', image, category } = req.body;

    const food = await Food.findById(req.params.id);

    if (food) {
        food.name = name;
        food.price = price;
        food.costPrice = costPrice;
        food.description = description;
        food.image = image;
        food.category = category;

        const updatedFood = await food.save();
        res.json(updatedFood);
    } else {
        res.status(404).json({ message: 'Food not found' });
    }
};

// @desc    Delete a food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (food) {
        await food.deleteOne();
        res.json({ message: 'Food removed' });
    } else {
        res.status(404).json({ message: 'Food not found' });
    }
};

export { getFoods, getFoodById, createFood, updateFood, deleteFood };
