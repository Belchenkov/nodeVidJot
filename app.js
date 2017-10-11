const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

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

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
});