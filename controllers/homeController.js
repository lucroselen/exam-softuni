const express = require("express");
const { isAuth, isOwner } = require("../middlewares/authMiddleware");
const { errorHandler } = require("../middlewares/errorHandler");
const router = express.Router();
const postServices = require("../services/postServices");

let generalError =
  "We are experiencing technical difficulties and are working to resolve them. Thank you for your understanding!";

router.get("/", (req, res) => {
  try {
    res.render("home", { title: "Homepage" });
  } catch (error) {
    console.error(error);
    res.render("404", {
      title: "404",
      error: generalError,
    });
  }
});
router.get("/all-posts", async (req, res) => {
  try {
    let posts = await postServices.getAll();

    res.render("all-posts", { title: "All posts", posts });
  } catch (error) {
    console.error(error);
    res.render("all-posts", {
      title: "All posts",
      error: generalError,
    });
  }
});
router.get("/create", isAuth, async (req, res) => {
  try {
    res.render("create", { title: "Create Post" });
  } catch (error) {
    console.error(error);
    res.render("create", {
      title: "Create Post",
      error: generalError,
    });
  }
});

router.post("/create", isAuth, async (req, res) => {
  let { title, keyword, location, image, description, date } = req.body;

  try {
    await postServices.create({
      title,
      keyword,
      location,
      image,
      description,
      date,
      author: req.user._id,
    });
    await postServices.updateCreatorPosts(req.user._id);
    res.redirect("/all-posts");
  } catch (error) {
    res.render("create", { error: errorHandler(error) });
  }
});

router.get("/my-posts", isAuth, async (req, res) => {
  try {
    let posts = await postServices.getUserPosts(req.user._id);

    res.render("my-posts", { title: "My Posts", posts });
  } catch (error) {
    console.error(error);
    res.render("my-posts", {
      title: "My Posts",
      error: generalError,
    });
  }
});

router.get("/details/:id", async (req, res) => {
  let post = await postServices.getOne(req.params.id);
  let alreadyVoted = false;
  let voted = post.votes.map((x) => x.email).join(", ");

  if (req.user) {
    alreadyVoted = post.votes.find((x) => x._id == req.user._id);
  }

  let isOwnedBy = false;
  if (req.user) {
    isOwnedBy = post.author._id.toString() == req.user._id;
  }

  res.render("details", {
    title: "Details",
    ...post,
    isOwnedBy,
    alreadyVoted,
    voted,
    error: req.query.error,
  });
});

router.get("/delete/:id", isAuth, isOwner, async (req, res) => {
  await postServices.deleteRecord(req.params.id);
  await postServices.updateCreatorPosts(req.user._id);
  res.redirect("/all-posts");
});

router.get("/edit/:id", isAuth, isOwner, async (req, res) => {
  let post = await postServices.getOne(req.params.id);

  res.render("edit", {
    title: "Edit Post",
    ...post,
    error: req.query.error,
  });
});

router.post("/edit/:id", isAuth, isOwner, async (req, res) => {
  let { title, keyword, location, image, description, date } = req.body;
  let id = req.params.id;

  try {
    await postServices.update(
      id,
      title,
      keyword,
      location,
      image,
      description,
      date
    );

    res.redirect(`/details/${id}`);
  } catch (error) {
    res.redirect(`/edit/${id}?error=${errorHandler(error)}`);
  }
});

router.get("/vote-up/:id", isAuth, async (req, res) => {
  let postId = req.params.id;
  let post = await postServices.getOne(req.params.id);
  try {
    if (
      !(post.author._id.toString() == req.user._id) &&
      !post.votes.find((x) => x._id == req.user._id)
    ) {
      await postServices.voteUp(postId, req.user._id);

      res.redirect(`/details/${postId}`);
    } else {
      res.redirect(`/details/${postId}?error=URL injecting is not nice!`);
    }
  } catch (error) {
    res.redirect(
      `/details/${postId}?error=You have already voted on this post!`
    );
  }
});

router.get("/vote-down/:id", isAuth, async (req, res) => {
  let postId = req.params.id;
  let post = await postServices.getOne(req.params.id);
  try {
    if (
      !(post.author._id.toString() == req.user._id) &&
      !post.votes.find((x) => x._id == req.user._id)
    ) {
      await postServices.voteDown(postId, req.user._id);

      res.redirect(`/details/${postId}`);
    } else {
      res.redirect(`/details/${postId}?error=URL injecting is not nice!`);
    }
  } catch (error) {
    res.redirect(
      `/details/${postId}?error=You have already voted on this post!`
    );
  }
});

router.get("/404", (req, res) => {
  res.status(404).render("404", { title: "404" });
});

module.exports = router;
