const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function() {
  before(function(done) {
    mongoose
      .connect(
        "DB"
      )
      .then(result => {
        const user = new User({
          email: "test1@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "6D0g66b516bfok031b8164p"
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  afterEach(function() {});

  it("should add a created post to the posts of the creator", function(done) {
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post"
      },
      file: {
        path: "abc"
      },
      userId: "6D0g66b516bfok031b8164p"
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    FeedController.createPost(req, res, () => {}).then(savedUser => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
