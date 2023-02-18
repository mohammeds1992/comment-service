'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.config');

// Initialize the database connection
dbConfig.connect()
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch((err) => {
        console.error('Error connecting to the database', err);
        process.exit(1);
    });

const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// parse application/json
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/user')());
app.use('/comments', require('./routes/comment')());

// Default Route
app.use(function(req, res) {
    res.status(404).sendFile('404.html', {
        root: './views'
    });
});

// start server
const server = app.listen(port);
console.log('Express started. Listening on %s', port);

// Call closeDatabase when the app is restarted
process.on('SIGINT', async () => {
    try {
        await dbConfig.closeDatabase();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});