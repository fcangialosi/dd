module.exports = function(req, res, next) {
	if(req.session.User && req.session.User.admin) {
		return next();
	} else {
		var notAdminError = [{name : 'notAdminError', message : 'You must be an admin to view or edit this page.'}]
		req.session.flash = {
			err : notAdminError
		}
		res.redirect('/admin/signin');
		return;
	}
}