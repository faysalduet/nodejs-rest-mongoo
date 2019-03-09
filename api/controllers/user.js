const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          success: false,
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          // Store hash in your password DB.
          if (err) {
            return res.status(500).json({
              success: false,
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              password: hash
            });

            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  success: true,
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  success: false,
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user);
      if (user.length < 1) {
        return res.status(401).json({
          message: "Login fail"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        console.log(result);
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            success: true,
            message: "Auth successfull",
            id: user[0]._id,
            token: token
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Login fail"
          });
        }
      });
    })
    .catch();
};
