/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton.
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('morgan');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const diag = require('./routes/api/diag');

const cors = require('cors');
const app = express();

// Load configuration fom .env file if it exists
require('dotenv').config();

// Enable cors
app.use(cors());

// Initialize Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set morgan logging format
if (app.get('env') === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

// Connect to MongoDB database
const db = process.env.MONGO_URI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('## Connected to MongoDB Database'))
  .catch(err => {
    console.log(err.message);
    process.exit(-1);
  });

// Initialized Passport middleware
app.use(passport.initialize());

// Passport Config
require('./passport')(passport);

// Setup our Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/diag', diag);

const port = process.env.PORT || 5000;
var server = app.listen(port, function() {
  var port = server.address().port;
  console.log(`## Server running on ${port}`);
});
