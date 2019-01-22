const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', (req, res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas
            });
        })
        .catch(err => console.log(err));
});

// Add Idea Form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea
            });
        })
        .catch(err => console.log(err));
});

// Process Form
router.post('/', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text: 'Please add a title!'});
    }

    if (!req.body.details) {
        errors.push({text: 'Please add some details!'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details
        };

        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Success Add!');
                res.redirect('/ideas');
            })
    }
});

// Edit Form Process
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(() => {
                    req.flash('success_msg', 'Success Update!');
                    res.redirect('/ideas');
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err))
});

// Delete Idea
router.delete('/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
        .then(() => {
            req.flash('success_msg', 'Success Remove!');
            res.redirect('/ideas');
        })
        .catch(err => console.error(err))
});

module.exports = router;