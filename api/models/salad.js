const mongoose = require('mongoose');

const saladSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    ingredients: { type: Array, required: true },
    desc: { type: String, required: true },
    totalcalories: { type: Number, required: true }
});

module.exports = mongoose.model('Salad', saladSchema)
