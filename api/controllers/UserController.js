/**
 * UserController
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

module.exports = {

    'new' : function(req, res){
    	res.view();
    },

    create : function(req, res, next) {
    	User.create(req.params.all(), function userCreated(err,user) {
    		if(err){
    			console.log(err);
    			req.session.flash = {
    				err: err
    			}

    			return res.redirect('/session/new');
    		}

          // automatically log them in now
          req.session.authenticated = true;
          req.session.User = user;
    	    res.redirect('/catering/order/delivery');

    	});
    },

    show: function(req, res, next) {
    	User.findOne(req.param('id'), function foundUser (err, user) {
    		if(err) return next(err);
    		if(!user) return next();
    		res.view({
    			user : user
    		});
    	});
    },

  	index: function (req, res, next) {

      // Get an array of all users in the User collection(e.g. table)
      User.find(function foundUsers (err, users) {
        if (err) return next(err);
        // pass the array down to the /views/index.ejs page
        res.view({
          users: users
        });
      });
    },

  // render the edit view (e.g. /views/edit.ejs)
  edit: function (req, res, next) {
    // TODO handle case where there is no id (someone goes to /user/edit/)

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  // process the info from edit view
  update: function (req, res, next) {

    User.update(req.param('id'), req.params.all(), function userUpdated (err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function (req, res, next) {

    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

      });

      res.redirect('/user');

    });
  },

  addDelivery : function(req, res, next) {

    req.session.User.savedDelivery.push({
        contactName : req.body.name,
        contactPhone : req.body.phone,
        address : req.body.address,
        city : req.body.city,
        special : req.body.instructions
    });

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
      if (err) {
        return res.redirect('/catering/order/delivery/new');
      }
      res.redirect('/catering/order/delivery');
    });
  },

  removeDelivery : function(req, res, next) {

    req.session.User.savedDelivery.splice(req.param('id'));

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
      if (err) {
        return res.redirect('/catering/order/delivery');
      }
      res.redirect('/catering/order/delivery');
    });
  },

  addPayment : function(req, res, next) {

    req.session.User.savedPayment.push({
      number : req.body.number,
      name : req.body.name,
      expiry : req.body.expiry,
      cvc : req.body.cvc
    });

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
      if (err) {
        return res.redirect('/catering/order/payment/new');
      }
      res.redirect('/catering/order/payment/continue?method=card');
    });
  },

  removePayment : function(req, res, next) {
    req.session.User.savedPayment.splice(req.param('id'));

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
      if (err) {
        return res.redirect('/catering/order/payment');
      }
      res.redirect('/catering/order/payment/continue?method=card');
    });
  }

};
