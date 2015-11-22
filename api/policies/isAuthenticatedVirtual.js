
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  var notLoggedIn = [{name : 'Authorization Error', message : 'Sorry, you must be logged in to do that!'}]
  req.session.flash = {
    err : notLoggedIn
  }
  res.redirect('/virtualcafe');

};
