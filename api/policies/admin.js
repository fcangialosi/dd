checkPermissions = function (user, target) {
	if (!('permissions' in user)) {
		return false;
	}
	viableActions = user.permissions[target.controller];
	if (!viableActions || !viableActions.length) {
		return false;
	}
	if ((viableActions.indexOf('*') > -1) || (viableActions.indexOf(target.action) > -1)) {
		return true;
	}
	return false;
}

module.exports = function(req, res, next) {
	if(req.session.User && req.session.User.admin) {
		if (req.route.path == '/admin') {
			return next();
		}
		if (checkPermissions(req.session.User, req.options)) {
			return next();
		} else {
			var notAllowedError = {name : 'permissionsError', message : 'You do not have permission to view or edit ' + req.route.path};
			req.session.flash = {
				err : notAllowedError
			}
			res.redirect('/admin');
		}
	} else {
		var notAdminError = {name : 'notAdminError', message : 'You must be an admin to view or edit this page.'};
		req.session.flash = {
			err : notAdminError
		}
		res.redirect('/admin/signin');
		return;
	}
}

