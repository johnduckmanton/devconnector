/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton. Portions Copyright (c) 2018 Brad Traversey. 
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route		POST api/users/register
// @desc		Register a user
// @access	Public
router.post('/register', (req, res) => {
  // Validate the request parameters are valid
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }

  // Search for an existing email address in the database
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json({ errors });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Image Size 200px
        r: 'pg', // content rating
        d: 'mm' // default if no gravatar found
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // Encrypt the user's password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(201).json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route		POST api/users/login
// @desc		Login the user and return a JWT Token
// @access	Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Validate the request parameters are valid
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }

  // Find the user using the email address
  User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check that the password (when hashed) matches the stored password hash
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // Generate the JWT token

          // First create the payload we want to include in the JWT
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };

          // Then sign the token
          jwt.sign(
            payload,
            process.env.JWT_SECRET_OR_KEY,
            { expiresIn: 3600 }, // One hour
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// @route		GET api/users/current
// @desc		Returns the current user
// @access	Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
