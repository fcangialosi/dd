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

			var usernameRequiredError = [{name: 'Missing E-mail Error', message: 'Woops.. Looks like you forgot your e-mail address!', type : 'signin'}]

				// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
				// the key of usernamePasswordRequiredError
				req.session.flash = {
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
				var noAccountError = [{name: 'No Account ', message: "Sorry, we don't know of any " + req.param('email') + "'s!", type : 'signin'}]
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/catering/order/start');
				return;
			}
			// Log user in
			req.session.authenticated = true;
			req.session.User = user;

			if (req.session.User.admin){
				res.redirect('/admin');
				return;
			}

			res.redirect('/catering/order/delivery');
		});
	},

	destroy: function(req, res, next) {

		// Wipe out the session (log out)
		req.session.destroy();

		// Redirect the browser to the sign-in screen
		res.redirect('/catering/order/start');

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
			special : option.special
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
			cardNumber : option.number,
			cardName : option.name,
			cardExpiry : option.expiry,
			cardCvc : option.cvc
		}

		res.redirect('/catering/order/review');
	}

};
