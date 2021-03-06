require("dotenv").config();
const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authChecker = require("../middleware/auth-checker");
const adminChecker = require("../middleware/admin-checker");
const User = require("../models/user");
const UserDetail = require("../models/user-detail");
const pagination_controller = require("../controllers/pagination.controller");

router.get("/admin/dashboard/all", adminChecker, (req, res) => {
  pagination_controller.getAll(req, res, UserDetail, "email sekolah");
});

// router.get("/admin/dashboard/:id", adminChecker, (req,res) => {
// });

// User
router.post("/user/register", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    console.log(req.body.password);
    if (err) {
      res.status(500).json({
        message: "Hashing error",
      });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: hash,
      });
      newUser
        .save()
        .then((result) => {
          res.status(200).json({
            message: "User saved!",
          });
        })
        .catch((err) => {
          console.log(err.code);
          if (err.code == "11000") {
            res.status(409).json({
              message: "User already exists!",
            });
          } else {
            res.status(500).json({
              error: err,
            });
          }
        });
    }
  });
});

router.post("/user/login", (req, res) => {
  User.find({ email: req.body.email }).then((user) => {
    if (user.length < 1) {
      res.status(404).json({
        message: "User not found!",
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (result == false) {
        res.status(401).json({
          message: "Password incorrect!",
        });
      }
      const token = jwt.sign(
        {
          userId: user[0]._id,
          role: user[0].role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "3d",
        }
      );
      res
        .cookie("token", token, {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60000),
          httpOnly: true,
          signed: true,
          sameSite: "none",
          secure: true,
        })
        .status(200)
        .json({
          message: "Login successful",
          role: user[0].role,
        });
    });
  });
});

router.post("/user/logout", authChecker, (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      signed: true,
    })
    .status(200)
    .json({
      message: "Logout successful",
    });
});

router.post("/user/detail", authChecker, (req, res) => {
  let user = {};
  user.email = req.body.email;
  user.name = req.body.name;
  user.sekolah = req.body.sekolah;
  user.telepon = req.body.telepon;
  user.mapel = req.body.mapel;

  UserDetail.findOneAndUpdate({ email: user.email }, user, { upsert: true })
    .then((result) => {
      res.status(200).json({
        message: "Details saved!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/user/detail", authChecker, (req, res) => {
  detail = {};
  User.findOne({ _id: req.user.userId }).then((user) => {
    detail.email = user.email;
    UserDetail.findOne({ email: detail.email })
      .then((userdetail) => {
        userdetail.sekolah
          ? (detail.sekolah = userdetail.sekolah)
          : (detail.sekolah = null);
        userdetail.telepon
          ? (detail.telepon = userdetail.telepon)
          : (detail.telepon = null);
        userdetail.mapel
          ? (detail.mapel = userdetail.mapel)
          : (detail.mapel = null);
        res.status(200).json(detail);
      })
      .catch((err) => {
        res.status(200).json(detail);
      });
  });
});

router.get("/user", authChecker, adminChecker, async (req, res) => {
  let emailList = await User.find({ role: "User" }, 'email').exec();
  let email = []
  await emailList.map((user)=>{
    email.push(user.email)
  })
  UserDetail.find()
    .where("email")
    .in(email)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
module.exports = router;
