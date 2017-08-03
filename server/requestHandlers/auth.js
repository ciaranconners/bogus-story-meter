const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const uuidv4 = require("uuid/v4");

const db = require("../db/index.js");
const config = require("./auth-config.js");

const router = express.Router();

const smtpTrans = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.gmailUser,
    pass: config.gmailPass
  }
});

const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
  db.User
    .find({
      where: {
        username: username
      }
    })
    .then(user => {
      if (user !== null) {
        if (user.verified) {
          res
            .status(401)
            .json("you already have a verified account; please sign in");
        } else if (user.token !== null) {
          res
            .status(401)
            .json(
              "you've already tried to sign up; check your email so we can verify your account"
            );
          return;
        }
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              console.error(err);
            } else {
              return user
                .update({
                  password: hash
                })
                .then(user => {
                  const token = uuidv4().toString();
                  const link = "http://localhost:8080/auth/verify?id=" + token;
                  mailOptions = {
                    to: username,
                    subject: "Confirm your Registration with Bogus Story Meter",
                    html:
                      "Hello,<br> Please click on the link to verify your email. The link will take you to our login page, where you will be able to sign in to your account.<br><a href=" +
                      link +
                      ">Click here to verify</a>"
                  };
                  user
                    .update({
                      token: token
                    })
                    .then(() => {
                      smtpTrans.sendMail(mailOptions, (error, response) => {
                        if (error) {
                          console.error(error);
                          res.sendStatus(500);
                        } else {
                          res
                            .sendStatus(200)
                            .json(
                              "check your email to verify your registration"
                            );
                        }
                      });
                    })
                    .catch(err => {
                      console.error(err);
                      res.sendStatus(500);
                    });
                })
                .catch(err => {
                  console.error(err);
                  res.status(500);
                });
            }
          });
        });
      } else {
        res.status(401).json("use our extension first to login to our site");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    });
});

router.get("/verify", (req, res) => {
  const token = req.query.id;
  db.User
    .findOne({ where: { token: token } })
    .then(user => {
      if (user !== null) {
        user
          .update({ verified: true })
          .then(() => {
            res.redirect("/login");
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        res.status(401).json("go to our site to sign up");
      }
    })
    .catch(err => {
      console.error(err);
    });
});

router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  db.User
    .findOne({
      where: {
        username: username
      }
    })
    .then(user => {
      if (user !== null && user.verified) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || result === false) {
            res
              .status(400)
              .json(
                "that password doesn't match our records; please try again"
              );
          } else {
            req.session.username = req.body.username;
            console.log("\x1b[33m%s\x1b[0m", "session created");
            res.status(200).json("all set");
          }
        });
      } else {
        res
          .status(400)
          .json(
            "user not found; try again; if you've already signed up make sure to complete your registration by clicking on the link we emailed you"
          );
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log("\x1b[33m%s\x1b[0m", "session destroyed");
      res.sendStatus(200);
    }
  });
});

router.get("/getStatus", (req, res) => {
  if (req.session.username) {
    db.User
      .findOne({
        where: {
          username: req.session.username
        }
      })
      .then(userEntry => {
        res.status(200).json({
          username: req.session.username,
          fullname: userEntry.fullname,
          profilepicture: userEntry.profilepicture
        });
      });
  } else {
    // THIS SHOULD CHANGE TO A STATUS CODE 401:
    res.sendStatus(200);
  }
});

module.exports = router;
