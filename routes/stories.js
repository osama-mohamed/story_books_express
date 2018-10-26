const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");


// stories of a user
router.get("/user/:userId", (req, res) => {
  Story.find({ user: req.params.userId, status: 'public' })
    .populate("user")
    .then(stories => {
      if (stories) {
        res.render("stories/index", { stories: stories });
      }
    });
});

// stories for logged in user
router.get("/my", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate("user")
    .then(stories => {
      if (stories) {
        res.render("stories/index", { stories: stories });
      }
    });
});


// get all public stories
router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .populate("user")
    .sort({date: 'desc'})
    .then(stories => {
      res.render("stories/index", { stories: stories });
    });
});

// get single story
router.get("/show/:id", (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      if (story) {
        res.render("stories/show", { story: story });
        // } else {
        //   res.render('stories/show', {story: story});
      }
    });
});

// load add new story form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

// save new story
router.post("/", ensureAuthenticated, (req, res) => {
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };
  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story._id}`);
  });
});

// load edit story form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render("stories/edit", { story: story });
    }
  });
});

// save edited story
router.put("/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    if (story) {
      let allowComments;
      if (req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }

      story.title= req.body.title;
      story.body= req.body.body;
      story.status= req.body.status;
      story.allowComments= allowComments;
      story.save().then(story => {
        res.redirect(`/stories/show/${story._id}`);
      });
    }
  });
});

// delete story
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Story.deleteOne({ _id: req.params.id }).then(story => {
    if (story) {
      res.redirect("/dashboard");
    }
  });
});

// comment on a story
router.post("/comment/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    if (story) {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
      story.comments.unshift(newComment);
      story.save().then(story => {
        if (story) {
          res.redirect(`/stories/show/${story._id}`);
        }
      });
    }
  });
});

module.exports = router;
