/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton. Portions Copyright (c) 2018 Brad Traversey. 
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route		GET api/profile
// @desc		Get the current user's profile
// @access	Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    // Lookup the user's profile from the database
    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'No profile has been defined for this user';
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route		GET api/profile/handle/:handle
// @desc		Get a user's profile using their handle
// @access	Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  // Lookup the user's profile from the database
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No profile has been defined for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route		GET api/profile/user/:user_id
// @desc		Get a user's profile using their id
// @access	Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  // Lookup the user's profile from the database
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No profile has been defined for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profile: 'No profile has been defined for this user' })
    );
});

// @route		GET api/profile/all
// @desc		Get all user profiles
// @access	Public
router.get('/all', (req, res) => {
  const errors = {};

  // Lookup the user's profile from the database
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'No profiles have been defined';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

// @route		POST api/profile
// @desc		Create or update the current user's profile
// @access	Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Validate the request parameters are valid
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    // get the profile fields in the request
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // Skills: Need to split into an array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social Media
    profileFields.socialMedia = {};
    if (req.body.youtube) profileFields.socialMedia.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.socialMedia.twitter = req.body.twitter;
    if (req.body.facebook)
      profileFields.socialMedia.facebook = req.body.facebook;
    if (req.body.linkedIn)
      profileFields.socialMedia.linkedIn = req.body.linkedIn;
    if (req.body.instagram)
      profileFields.socialMedia.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update the existing profile entry
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Insert a new profile

        // Check that the specified handle does not already exist
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = `Handle ${
              profileFields.handle
            } has already been used`;
            res.status(400).json(errors);
          }

          // Save the profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route		POST api/profile/experience
// @desc		Add experience to a user profile
// @access	Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Validate the request parameters are valid
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        isCurrent: req.body.isCurrent,
        descripion: req.body.description
      };

      // Add the experience to the user profile
      profile.experience.unshift(newExp);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    });
  }
);

// @route		POST api/profile/education
// @desc		Add education to a user profile
// @access	Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Validate the request parameters are valid
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        isCurrent: req.body.isCurrent,
        descripion: req.body.description
      };

      // Add the experience to the user profile
      profile.education.unshift(newEdu);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    });
  }
);

// @route		DELETE api/profile/experience/:experience_id
// @desc		Delete experience from a user profile
// @access	Private
router.delete(
  '/experience/:experience_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.experience_id);

      // splice the entry out of the array of experiences
      profile.experience.splice(removeIndex, 1);

      // Save
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(500).json(err));
    });
  }
);

// @route		DELETE api/profile/education/:education_id
// @desc		Delete education to a user profile
// @access	Private
router.delete(
  '/education/:education_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.education_id);

      // splice the entry out of the array of education entries
      profile.education.splice(removeIndex, 1);

      // Save
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(500).json(err));
    });
  }
);

// @route		DELETE api/profile
// @desc		Delete a user & their profile
// @access	Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
