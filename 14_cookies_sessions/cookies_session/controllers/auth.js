const User = require('../models/user');

// Cookies Disadvantage:
// we can manipulate that from inside the browser

// Cookie -> Tracking user footprint
exports.getLogin = (req, res, next) => {
  // Cookies
  // console.log(req.get("Cookie"));
  // console.log(req.get("Cookie").split(";")[1].trim().split("=")[1]);
  // const isLoggedIn = req
  //   .get("Cookie")
  //   .split(";")[1]
  //   .trim()
  //   .split("=")[1];

  // Session
  // console.log(req.session);
  // console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
    // isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  // Cookie
  // res.setHeader("Set-Cookie", "loggedIn=true");
  // res.setHeader("Set-Cookie", "loggedIn=true; Expires=; Domain=; Secure; httpOnly");
  // res.redirect("/");

  // Session
  // 
  User.findById('ID')
    .then(user => {
      req.session.isLoggedIn = true; //log the user in, store that information in my request object,
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
