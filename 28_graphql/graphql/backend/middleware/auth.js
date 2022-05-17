const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    // err.statusCode = 500;
    // throw err;
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    // const error = new Error("Not authenticated.");
    // error.statusCode = 401;
    // throw error;
    req.isAuth = false;
    return next();
  }
  req.userId = decodedToken.userId;
  req.isAuth = true; //new property
  next();
};
