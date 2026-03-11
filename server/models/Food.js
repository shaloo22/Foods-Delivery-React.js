import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No description provided'
    },
    price: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Food = mongoose.model('Food', foodSchema);

export default Food;
