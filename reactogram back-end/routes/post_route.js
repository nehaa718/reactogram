const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel");
const protectedRoute = require("../middleware/protectedResource");

// ✅ Get all posts
router.get("/allposts", async (req, res) => {
  try {
    const dbPosts = await PostModel.find()
      .populate("author", "_id fullName profileImg")
      .populate("comments.commentedBy", "_id fullName");
    res.status(200).json({ posts: dbPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Get posts from logged in user
router.get("/myallposts", protectedRoute, async (req, res) => {
  try {
    const dbPosts = await PostModel.find({ author: req.user._id })
      .populate("author", "_id fullName profileImg");
    res.status(200).json({ posts: dbPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Create post
router.post("/createpost", protectedRoute, async (req, res) => {
  const { description, location, image } = req.body;
  if (!description || !location || !image) {
    return res.status(400).json({ error: "One or more mandatory fields are empty" });
  }

  const postObj = new PostModel({
    description,
    location,
    image,
    author: req.user._id
  });

  try {
    const newPost = await postObj.save();
    res.status(201).json({ post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Delete post
router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
  try {
    const postFound = await PostModel.findById(req.params.postId).populate("author", "_id");

    if (!postFound) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("User ID:", req.user._id.toString());
    console.log("Post Author ID:", postFound.author._id.toString());

    if (postFound.author._id.toString() === req.user._id.toString()) {
      await postFound.deleteOne(); // or postFound.remove()
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(403).json({ error: "Unauthorized to delete this post" });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Server Error while deleting the post" });
  }
});

// ✅ Like post
router.put("/like", protectedRoute, async (req, res) => {
  try {
    const result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.user._id } },
      { new: true }
    ).populate("author", "_id fullName");

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Unlike post
router.put("/unlike", protectedRoute, async (req, res) => {
  try {
    const result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).populate("author", "_id fullName");

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Comment on post
router.put("/comment", protectedRoute, async (req, res) => {
  const comment = { commentText: req.body.commentText, commentedBy: req.user._id };

  try {
    const result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.commentedBy", "_id fullName")
      .populate("author", "_id fullName");

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
