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
    
	'new' : function(req,res) {
		res.view('session/new');
	},

 	create : function(req, res, next){
	  	// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email') || !req.param('password')) {
			 // return next({err: ["Password doesn't match password confirmation."]});

			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}]

				// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
				// the key of usernamePasswordRequiredError
				req.session.flash = {
					err: usernamePasswordRequiredError
			}

			res.redirect('/session/new');
			return;
		}

		// Try to find the user by there email address. 
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {
		User.findOneByEmail(req.param('email'), function foundUser (err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found.'}]
				req.session.flash = {
					err: noAccountError	
				}
				res.redirect('/session/new');
				return;
			}

			// Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				// If the password from the form doesn't match the password from the database...
				if (!valid) {
					var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username and password combination.'}]
					req.session.flash = {
						err: usernamePasswordMismatchError
					}
					res.redirect('/session/new');
					return;
				}

				// Log user in
				req.session.authenticated = true;
				req.session.User = user;

				if (req.session.User.admin){
					res.redirect('/user');
					return;
				}
				//Redirect to their profile page (e.g. /views/user/show.ejs)
				res.redirect('/catering/menu');				
			});
		});
	},

	destroy: function(req, res, next) {

		// Wipe out the session (log out)
		req.session.destroy();

		// Redirect the browser to the sign-in screen
		res.redirect('/session/new');

	},

	'saveDelivery' : function(req,res,next) {
		// TODO handle any errors that form validation might not catch

		option = req.session.User.savedDelivery[parseInt(req.body.deliveryIndex)];

		req.session.delivery = {
			time : req.body.time,
			date : req.body.date,
			contactName : option.contactName,
			contactPhone : option.contactPhone,
			address : option.address,
			city : option.city,
			special : option.special
		}

		res.redirect('/catering/payment/select');
	},

	'savePayment' : function(req,res,next) {

		option = req.session.User.savedPayment[parseInt(req.body.paymentIndex)];

		req.session.payment = {
			cardNumber : option.number,
			cardName : option.name,
			cardExpiry : option.expiry,
			cardCvc : option.cvc
		}

		console.log(req.session);

		res.redirect('/catering/order/review');
	}

};
