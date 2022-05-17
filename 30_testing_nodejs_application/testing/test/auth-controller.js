const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller", function() {
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
  /* initialization work that it runs before every test case, before runs, 
  before all test case. So it's not repeated, it only runs once per test run 
  before each is repeated and runs more often per test run. It basically 
  runs before every IT function call. This therefore is useful if you need 
  to reset something before every test case or if you want to have some 
  initialization work, that absolutely has to run before every test case. */

  afterEach(function() {});
  /* there is some functionality which need to run after every test case, 
  so some clean up work which needs to be done after every test case. */

  it("should throw an error with code 500 if accessing the database fails", function(done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test1@test.com",
        password: "tester"
      }
    };

    AuthController.login(req, {}, () => {}).then(result => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an existing user", function(done) {
    const req = { userId: "6D0g66b516bfok031b8164p" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
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
