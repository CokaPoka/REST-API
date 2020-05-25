const mongoose= require('mongoose');

const ingredientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    avatar: { type: String, required: true },
    tag: { type: String, required: true },
    calories: { type: Number, required: true}
});

module.exports = mongoose.model('Ingredient', ingredientSchema)
