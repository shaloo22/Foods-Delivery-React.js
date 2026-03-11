import Promotion from '../models/Promotion.js';

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
export const getPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({ active: true });
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
export const createPromotion = async (req, res) => {
    const { title, subtitle, code, iconType, bg, border, text, image } = req.body;
    try {
        const promotion = new Promotion({
            title,
            subtitle,
            code,
            iconType,
            bg,
            border,
            text,
            image
        });
        const createdPromotion = await promotion.save();
        res.status(201).json(createdPromotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
export const updatePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (promotion) {
            promotion.title = req.body.title || promotion.title;
            promotion.subtitle = req.body.subtitle || promotion.subtitle;
            promotion.code = req.body.code || promotion.code;
            promotion.iconType = req.body.iconType || promotion.iconType;
            promotion.bg = req.body.bg || promotion.bg;
            promotion.border = req.body.border || promotion.border;
            promotion.text = req.body.text || promotion.text;
            promotion.image = req.body.image !== undefined ? req.body.image : promotion.image;
            promotion.active = req.body.active !== undefined ? req.body.active : promotion.active;

            const updatedPromotion = await promotion.save();
            res.json(updatedPromotion);
        } else {
            res.status(404).json({ message: 'Promotion not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
export const deletePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (promotion) {
            await promotion.deleteOne();
            res.json({ message: 'Promotion removed' });
        } else {
            res.status(404).json({ message: 'Promotion not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
