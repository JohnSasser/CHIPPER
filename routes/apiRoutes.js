const router = require("express").Router();
const db = require("../models");
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
// const isAuthenticated = require("../config/middleware/isAuthenticated");

const signToken = userID => {
  return JWT.sign({
    iss: "swonelord",
    sub: userID
  }, "swonebean9000", { expiresIn: "1h" });
}


// USER SIGN-UP ROUTE
router.post('/signup', (req, res) => {
  const { username, password, phone, email, street, city, state, zip, isAdmin, key } = req.body;
  db.User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    } else if (user) {
      res.status(400).json({ message: { msgBody: "Username already exists", msgError: true } });
    } else if (!isAdmin) {
      const newUser = new db.User({ username, password, phone, email, street, city, state, zip, isAdmin });
      newUser.save(err => {
        if (err) {
          res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        } else {
          res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
        }
      });
    } else {
      // console.log('given key: ', key);
      db.adminkeys.findOne({ key }, (err, key) => {
        if (err) {
          res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        } else if (!key) {
          res.status(400).json({ message: { msgBody: "Invalid key", msgError: true } });
        } else {
          // console.log('admin key matches');
          const newUser = new db.User({ username, password, phone, email, street, city, state, zip, isAdmin });
          newUser.save(err => {
            if (err) {
              res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
            } else {
              res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
            }
          });
        }
      });
    }
  });
});

// PASSPORT AUTHENTICATION ROUTE

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (user) {
      const { _id, username, isAdmin, pets, phone, email, street, city, state, zip } = user;
      const token = signToken(_id);
      res.cookie('access_token', token, { httpOnly: true, sameSite: true });
      res.status(200).json({ isAuthenticated: true, user: { username, isAdmin, pets, phone, email, street, city, state, zip } });
    } else if (err) {
      res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    } else if (info.type === "wronguser") {
      res.status(400).json({ message: { msgBody: "Username does not exist", msgError: true } });
    } else if (info.type === "wrongpassword") {
      res.status(400).json({ message: { msgBody: "Password is incorrect", msgError: true } });
    } else if (info.message === "Missing credentials") {
      res.status(400).json({ message: { msgBody: "Enter login information", msgError: true } });
    }
  })(req, res, next);
});

router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.clearCookie('access_token');
  res.json({ user: { username: "", role: "" }, success: true });
});

router.post("/api/UpdateUserPage", passport.authenticate('jwt', { session: false }), (req, res) => {
  // console.log('/api/UpdateUserPage req.body: ', req.body);
  const fieldToUpdate = req.body;
  db.User.findByIdAndUpdate(
    { _id: req.user._id },
    fieldToUpdate,
    { new: true }
  )
    .then((result) => {
      // console.log('result of findoneandupdate: ', result);
      res.status(200).json(result);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// custom authentication route
router.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
  // console.log('inside /authenticated');
  const { pets, username, phone, email, street, city, state, zip, isAdmin } = req.user;
  res.status(200).json({ isAuthenticated: true, user: { pets, username, phone, email, street, city, state, zip, isAdmin } });
});

module.exports = router;
