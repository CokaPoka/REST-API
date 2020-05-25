const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Ingredient = require('../models/ingredient')

router.get('/', (req, res, next) => {
    Ingredient.find()
        .select('_id name avatar tag calories')
        .exec()
        .then(docs => {
            const response = {
                ingredients: docs
            }
            // if (docs.length >= 0) {
            res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: "No entries found"
            //     })
            // }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const ingredient = new Ingredient({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        avatar: req.body.avatar,
        tag: req.body.tag,
        calories: req.body.calories
    });
    ingredient.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created ingredient successfully",
            createdIngredient: {
                _id: result._id,
                name: result.name,
                avatar: result.avatar,
                tag: result.tag,
                calories: result.calories
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.get('/:ingredientId', (req, res, next) => {
    const id = req.params.ingredientId;
    Ingredient.findById(id)
    .select('_id name avatar tag calories')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                ingredient: doc
            });
        } else {
            res.status(404).json({ message: 'No valid enrty found for provided ID' })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.patch('/:ingredientId', (req, res, next) => {
    const id = req.params.ingredientId;
    Ingredient.update({ _id: id },
        {
            $set: {
                name: req.body.newName,
                avatar: req.body.newAvatar,
                tag: req.body.newTag,
                calories: req.body.newCalories
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "ingredient updated"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
});

router.delete('/:ingredientId', (req, res, next) => {
    const id = req.params.ingredientId;
    Ingredient.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Ingredient deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
})

module.exports = router;