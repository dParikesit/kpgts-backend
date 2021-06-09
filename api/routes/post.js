require("dotenv").config();
const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authChecker = require("../middleware/auth-checker");
const Post = require("../models/post");

const isAdmin = function(req, res, next) {
  if (req.user.role == "Admin") {
    next;
  } else {
    return res.status(401).json({
      error: 'User not authenticated'
    });
  }
}

router.post("/post", authChecker, isAdmin, upload.single("image"), (req, res, next) => {
  let newPost = new Post({
    title: req.body.title,
    slug: req.body.slug,
    description: req.body.description,
    content: req.body.content,
    date: req.body.date,
  });

  if (req.file) {
    newPost["image"] = {
      data: req.file.buffer,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      ext: req.file.originalname.split(".")[1],
    };
  }

  newPost
    .save()
    .then((result) => {
      res.status(200).json({
        message: newPost.title,
      });
    })
    .catch((err) =>
      res.status(500).json({
        message: err,
      })
    );
});

router.get("/post", isAdmin, (req, res, next) => {
  let postsList;
  Post.find({})
    .sort({ date: -1 })
    .then((posts) => {
      postsList = posts.map((post) => {
        return {
          title: post.title,
          slug: post.slug,
          description: post.description,
          date: post.date,
        };
      });
      res.status(200).json(postsList);
    });
});

router.get("/post/:slug", isAdmin, (req, res) => {
  slug = req.params.slug;
});
module.exports = router;
