const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Salad = require('../models/salad')

router.get('/', (req, res, next) => {
    Salad.find()
        .select('_id name ingredients desc totalcalories')
        .exec()
        .then(docs => {
            const response = {
                salads: docs
            }
            res.status(200).json(response);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const salad = new Salad({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        ingredients: req.body.ingredients,
        desc: req.body.desc,
        totalcalories: req.body.totalcalories
    });
    salad.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created salad successfully",
            createdSalad: {
                _id: result._id,
                name: result.name,
                ingredients: result.ingredients,
                desc: result.desc,
                totalcalories: result.totalcalories
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })   
    });
});

router.get('/:saladId', (req, res, next) => {
    const id = req.params.saladId;
    Salad.findById(id)
        .select('_id name ingredients desc totalcalories')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    salad: doc
                });
            } else {
                res.status(404).json({ message: 'No valid enrty found for provided ID' })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:saladId', (req, res, next) => {
    const id = req.params.saladId;
    Salad.update({ _id: id },
        {
            $set: {
                name: req.body.newName,
                ingredients: req.body.newIngredients,
                desc: req.body.newDesc,
                totalcalories: req.body.newTotalcalories
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "salad updated"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
});

router.delete('/:saladId', (req, res, next) => {
    const id = req.params.saladId;
    Salad.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "salad deleted"
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