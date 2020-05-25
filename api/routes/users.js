const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/user')

router.get('/', (req, res, next) => {
    User.find()
        .select('_id name surname username password email')
        .exec()
        .then(docs => {
            const response = {
                users: docs
            }
            res.status(200).json(response);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/register', (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Username exists!"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                            const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            surname: req.body.surname,
                            username: req.body.username,
                            password: hash,
                            email: req.body.email
                        });
                        user
                            .save()
                            .then(result => {
                                const response = {
                                    user: {
                                        _id: result._id,
                                        name: result.name,
                                        surname: result.surname,
                                        username: result.username,
                                        password: result.password,
                                        email: result.email
                                    }
                                }
                                res.status(201).json(response);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/login', (req,res,next) => {
    User.find({username: req.body.username})
    .exec()
    .then(user=> {
        if (user.length <1) {
            return res.status(401).json({
                message: 'Auth faild'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err,result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth faild'
                })
            }
            if (result) {
                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                )
                return res.status(200).json({
                    message:'Auth successful',
                    token: token
                })
            }
            res.status(401).json({
                message: 'Auth faild'
            })
        })
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
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