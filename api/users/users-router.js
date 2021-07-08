const express = require('express');
const Users = require('./users-model'); //eslint-disable-line
const Posts = require('../posts/posts-model'); //eslint-disable-line
const {
  logger, //eslint-disable-line
  validateUserId, //eslint-disable-line
  validateUser, //eslint-disable-line
  validatePost //eslint-disable-line
} = require('../middleware/middleware');
const { restart } = require('nodemon');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  console.log('made it here.')
  console.log(req)
   Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({ message: err})
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then(createdPost => {
      res.status(201).json(createdPost)
    })
    .catch(err => {
      next(err)
    })
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then(updatedPost => {
      res.status(200).json(updatedPost)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.params.id)
    .then(removedUser => {
      console.log(req.user)
      res.status(200).json(req.user);
    })
    .catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert({user_id: req.params.id, text: req.body.text})
    .then(createdPost => {
      res.status(201).json(createdPost)
    })
    .catch(next) //eslint-disable-line
});


module.exports = router
// do not forget to export the router
