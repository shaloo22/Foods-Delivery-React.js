import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    iconType: {
        type: String,
        enum: ['Gift', 'Fire', 'Tag'],
        default: 'Gift'
    },
    bg: {
        type: String,
        default: 'bg-pink-50'
    },
    border: {
        type: String,
        default: 'border-pink-100'
    },
    text: {
        type: String,
        default: 'text-pink-700'
    },
    image: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;
