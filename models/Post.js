const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [6, "The title should be at least 6 characters!"],
  },
  keyword: {
    type: String,
    required: true,
    minlength: [6, "The keyword should be at least 6 characters!"],
  },
  location: {
    type: String,
    required: true,
    maxlength: [10, "The Location should be a maximum of 10 characters long."],
  },
  date: {
    type: String,
    required: true,
    maxlength: [10, "The Date should be exactly 10 characters - 02.02.2021"],
    match: [
      /^[0-9]{2}.[0-9]{2}.[0-9]{4}$/,
      "Please fill a valid date format - DD.MM.YYYY",
    ],
  },
  image: {
    type: String,
    required: true,
    validate: [
      /^https?:\/\//i,
      "The Wildlife Image should start with http:// or https://",
    ],
  },
  description: {
    type: String,
    required: true,
    minlength: [8, "The Description should be a minimum of 8 characters long"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  votes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  author: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
