const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// csrf token
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  "DB_URL";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
// initialize csrf by executing csrf as a function
// here, we use default setting
const csrfProtection = csrf();
// So with that, we get this csrf protection middleware here 
// and we now just have to use that as a middleware.

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
// So here after we initialized the session↑, that's important 
// because csrf the package will use that session now. After 
// we initialized the session, then add app.use("csrfProtection"), 
// so basically // the constant which holds the created middleware 
// here (const csrfProtection = csrf();). 
app.use(csrfProtection);
// So now with that, csrfProtection is generally enabled but we 
// still need to add something to our views to really use it.
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Max",
    //       email: "max@gmail.com",
    //       cart: {
    //         items:[]
    //       }
    //     });
    //     user.save();
    //   }
    // })
  // });
  // .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
