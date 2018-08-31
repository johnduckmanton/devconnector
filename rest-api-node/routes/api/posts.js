/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton. Portions Copyright (c) 2018 Brad Traversey. 
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load the models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Load validation
const validatePostInput = require('../../validation/post');
const validatePostCommentInput = require('../../validation/post');

// @route		GET api/posts
// @desc		Get all posts
// @access	Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route		GET api/posts/:id
// @desc		Get a single post matching the specified id
// @access	Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res
        .status(404)
        .json({ nopostfound: `No post found with id ${req.params.id}` })
    );
});

// @route		POST api/posts
// @desc		Create a new post
// @access	Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Validate the request parameters are valid
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json({ post }));
  }
);

// @route		DELETE api/posts/:id
// @desc		Delete a post
// @access	Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return req
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete the post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res
            .status(404)
            .json({ postnotfound: `No post found with id ${req.params.id}` })
        );
    });
  }
);

// @route		POST api/posts/:id/like
// @desc		Like a post
// @access	Private
router.post(
  '/:id/like',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Test if the user has already liked this post previously
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: 'user has already liked this post' });
          }

          // Add user id to the likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res
            .status(404)
            .json({ postnotfound: `No post found with id ${req.params.id}` })
        );
    });
  }
);

// @route		POST api/posts/:id/unlike
// @desc		Unlike to a post
// @access	Private
router.post(
  '/:id/unlike',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Test if the user has liked this post previously
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'User has not yet liked this post' });
          }

          // Get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice the entry out of the likes array
          post.likes.splice(removeIndex, 1);

          // Save the update
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res
            .status(404)
            .json({ postnotfound: `No post found with id ${req.params.id}` })
        );
    });
  }
);

// @route		POST api/posts/:id/comments
// @desc		Add a comment to a post
// @access	Private
router.post(
  '/:id/comments',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Validate the request parameters are valid
    const { errors, isValid } = validatePostCommentInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add the new comment to the comments array
        post.comments.unshift(newComment);

        // Save the update
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          postnotfound: `No post found with id ${req.params.id}.`
        })
      );
  }
);

// @route		DELETE api/posts/:id/comments/:comment_id
// @desc		Delete a comment from a post
// @access	Private
router.delete(
  '/:id/comments/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check the comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice out of the comments array
        post.comments.splice(removeIndex, 1);

        // Save the update
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          postnotfound: `No post found with id ${req.params.id}`
        })
      );
  }
);

module.exports = router;
