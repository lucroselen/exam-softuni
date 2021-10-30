const Post = require("../models/Post");
const User = require("../models/User");

const create = (data) => Post.create(data);
const getAll = () => Post.find({}).lean();
const getOne = (id) =>
  Post.findById(id).populate("author").populate("votes").lean();
const update = (id, title, keyword, location, image, description, date) =>
  Post.updateOne(
    { _id: id },
    {
      title,
      keyword,
      location,
      image,
      description,
      date,
    },
    { runValidators: true }
  );

const deleteRecord = (id) => Post.deleteOne({ _id: id });

const updateCreatorPosts = async (userId) => {
  let allPosts = await Post.find({}).populate("author").lean();
  let ownedPosts = allPosts.filter((x) => x.author._id == userId);

  await User.updateOne({ _id: userId }, { myPosts: ownedPosts });
};

const getUserPosts = async (userId) => {
  let user = await User.findById(userId).populate("myPosts").lean();

  return user.myPosts;
};

const voteUp = async (postId, userId) => {
  let post = await Post.findById(postId);
  let user = await User.findById(userId);

  post.votes.push(user);
  post.rating += 1;

  post.save();
  return;
};

const voteDown = async (postId, userId) => {
  let post = await Post.findById(postId);
  let user = await User.findById(userId);

  post.votes.push(user);
  post.rating -= 1;

  post.save();
  return;
};

const postServices = {
  create,
  getAll,
  getOne,
  deleteRecord,
  update,
  updateCreatorPosts,
  getUserPosts,
  voteUp,
  voteDown,
};

module.exports = postServices;
