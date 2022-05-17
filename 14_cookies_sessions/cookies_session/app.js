const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// Now this actually gives you a function which should execute to which 
// you pass your session, so this session object you're importing from 
// express session is passed to a function which is yielded by required 
// connect mongodb session and the result of that function call is stored 
// in mongodb store.

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'DB_URL';

const app = express();
// execute mongoDBStore as a constructor because this function happens to yield a 
// constructor function which we store in mongodb store.
const store = new MongoDBStore({
  uri: MONGODB_URI, // connect string
  collection: 'sessions' //define the collection though and you need to to define the collection where your sessions will be stored
  // expire: // it can be cleaned up automatically by mongodb
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// execute session as a function, pass javascript object
app.use(
  session({
    secret: 'my secret',
    // This will be used for signing the hash which secretly stores our ID in the cookie. Long string!
    resave: false,
    // This means that the session will not be saved on every request that is done, so on every response 
    // that is sent but only if something 
    // saveUninitialized: false,
    // There is the save uninitialized value which you should set to false because this will also basically
    // ensure that no session gets saved for a request where it doesn't need to be saved because nothing was
    // changed about it
    // cookies: {"DATE"},
    // or add expire key
    // cookies: {{expires: }}
    store: store
    // session
    // cookies: {

    // }
    // You can add cookie related configurations here because this middleware automatically
    // sets a cookie for you and it automatically reads the cookie value for you too, so it 
    // does all the cookie parsing and setting for you.
  })
);

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
