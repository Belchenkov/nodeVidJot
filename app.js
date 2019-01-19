const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://yksoft:12qwasZX@ds157834.mlab.com:57834/nodevidjot', {
    useMongoClient: true
}).then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Method override
app.use(methodOverride('_method'));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome to VidJot!';
    res.render('index', { title });
});

// About Page
app.get('/about', (req, res) => {
    res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
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
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
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
app.post('/ideas', (req, res) => {
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
                res.redirect('/ideas');
            })
    }
});

// Edit Form Process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(() => res.redirect('/ideas'))
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err))
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
});