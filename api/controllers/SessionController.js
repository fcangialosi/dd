/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

 	create : function(req, res, next){
	  	// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email')) {
			 // return next({err: ["Password doesn't match password confirmation."]});

			var usernameRequiredError = [{name: 'Missing E-mail Error', message: 'Woops.. Looks like you forgot your e-mail address!'}]

				// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
				// the key of usernamePasswordRequiredError
				req.session.flash = {
					type: 'signin',
					err: usernameRequiredError
			}

			res.redirect('/catering/order/start');
			return;
		}

		// Try to find the user by there email address.
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {
		User.findOneByEmail(req.param('email'), function foundUser (err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				var noAccountError = [{name: 'No Account ', message: "Sorry, we don't know of any " + req.param('email') + "'s!"}]
				req.session.flash = {
					type: 'signin',
					err: noAccountError
				}
				res.redirect('/catering/order/start');
				return;
			}
			if(user.admin) {
				var isAdminError = [{name : 'Password Required', message : "Admin accounts require a password. Please sign in on the admin page."}]
				req.session.flash = {
					type : 'signin',
					err : isAdminError
				}
				res.redirect('/catering/order/start');
				return;
			}
			// Log user in
			req.session.authenticated = true;
			req.session.User = user;

			res.redirect('/catering/order/reminder');

		});
	},

 	admin : function(req, res, next){
	  	// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email') || !req.param('password')) {
			 // return next({err: ["Password doesn't match password confirmation."]});

			var authenticationError = [{name: 'Authentication Error', message: 'Username or password is incorrect.'}]

			// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
			// the key of usernamePasswordRequiredError
			req.session.flash = {
				type: 'signin',
				err: authenticationError
			}

			res.redirect('/admin/signin');
			return;
		}

		// Try to find the user by there email address.
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {
		User.findOneByEmail(req.param('email'), function foundUser (err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user || !user.admin) {
				var noAccountError = [{name: 'Not Admin', message: req.param('email') + " is not an admin."}]
				req.session.flash = {
					type: 'signin',
					err: noAccountError
				}
				res.redirect('/admin/signin');
				return;
			}
			// Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				// If the password from the form doesn't match the password from the database...
				if (!valid) {
					var usernamePasswordMismatchError = [{name: 'Authentication Error', message: 'Username or password is incorrect.'}]
					req.session.flash = {
						type: 'signin',
						err: usernamePasswordMismatchError
					}
					res.redirect('/admin/signin');
					return;
				}

				// Log user in
				req.session.authenticated = true;
				req.session.User = user;

				res.redirect('/admin');
			});
		});
	},

	destroy: function(req, res, next) {

		wasAdmin = req.session.User.admin;

		// Wipe out the session (log out)
		req.session.destroy();

		if(wasAdmin) {
			res.redirect('/admin/signin')
		} else {
			res.redirect('/catering/order/start');
		}

	},

	'saveDelivery' : function(req,res,next) {
		// TODO handle any errors that form validation might not catch

		option = req.session.User.savedDelivery[parseInt(req.body.deliveryIndex)];

		if(!option) {
			var missingDeliveryError = [{name: "Missing Delivery Option", message: "Please select a current delivery method, or create a new one."}]
			req.session.flash = {
				err: missingDeliveryError
			}
			return res.redirect('/catering/delivery/select');
		}

		req.session.delivery = {
			time : req.body.time,
			date : req.body.date,
			contactName : option.contactName,
			contactPhone : option.contactPhone,
			address : option.address,
			city : option.city,
			special : option.special,
			index : parseInt(req.body.deliveryIndex)
		}

		res.redirect('/catering/order/menu');
	},

	'saveCard' : function(req,res,next) {

		option = req.session.User.savedPayment[parseInt(req.body.paymentIndex)];

		if(!option) {
			var missingPaymentError = [{name: "Missing Payment Option", message: "Please select a current payment method, or create a new one."}]
			req.session.flash = {
				err: missingPaymentError
			}
			return res.redirect('/catering/order/payment/select');
		}

		req.session.card = {
			lastFour : option.lastFour,
			cardNumber : option.number,
			cardName : option.name,
			cardExpiry : option.expiry,
			cardCvc : option.cvc,
			index : parseInt(req.body.paymentIndex)
		}

		res.redirect('/catering/order/review');
	}

};
