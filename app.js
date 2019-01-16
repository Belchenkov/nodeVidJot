const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://yksoft:12qwasZX@ds157834.mlab.com:57834/nodevidjot', {
    useMongoClient: true
})
.then(() => console.log('MongoDB Connected ...'))
.catch(err => console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process Form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text: 'Please add a title'});
    }

    if (!req.body.details) {
        errors.push({text: 'Please add some details'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        res.send('passed')
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
});