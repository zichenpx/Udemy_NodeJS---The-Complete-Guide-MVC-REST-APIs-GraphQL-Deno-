//  to create my own middleware which I can 
// add on every route that should be protected.
// a typical middleware function where you get 
// request, response and next
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}