/**
 * AdminController
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

var jobs_message = '';
var contact_message = '';
var fs = require('fs');
var triplesec = require('triplesec');

var decrypt = function(index, user, key, res) {
	if (typeof user.savedPayment[index].number !== 'string') {
    if (index == user.savedPayment.length-1) {
      res.view('admin/view-cards', {
        user: user,
        cards: user.savedPayment,
        layout : 'admin/layout'
      });
			return;
    } else {
      return decrypt(index+1, user, key, res);
    }
  }
	if (!user.savedPayment[index].number || user.savedPayment[index].number == null) {
    user.savedPayment[index].number = "empty"; 
    if (index == user.savedPayment.length-1) {
      res.view('admin/view-cards', {
        user: user,
        cards: user.savedPayment,
        layout : 'admin/layout'
      });
			return;
    } else {
      return decrypt(index+1, user, key, res);
    }
	}
  triplesec.decrypt({
    data : new triplesec.Buffer(user.savedPayment[index].number, "hex"),
    key : new triplesec.Buffer(key),
    progress_hook : function(obj) {}
  }, function(err, buff) {
    if(err) {
      rawNumber = err;
    } else {
      rawNumber = buff.toString();
    }
    user.savedPayment[index].number = rawNumber; 
    if (index == user.savedPayment.length-1) {
      res.view('admin/view-cards', {
        user: user,
        cards: user.savedPayment,
        layout : 'admin/layout'
      });
			return;
    } else {
      return decrypt(index+1, user, key, res);
    }
  });
}

module.exports = {

  index: function (req, res, next) {
     res.view('admin/index', {layout: 'admin/layout'});
  },

  signin: function(req,res,next) {
    res.view('admin/signin', {layout: 'admin/empty-layout'});
  },

  create: function(req,res,next) {
    res.view('admin/create', {layout: 'admin/empty-layout'});
  },

  messages: function(req, res, next) {
    res.view('admin/messages', {layout: 'admin/layout'});
  },

  editJobs: function(req, res, next) {
    res.view('admin/edit-jobs', {layout: 'admin/layout'});
  },

  editNews: function(req, res, next) {
    res.view('admin/edit-news', {layout: 'admin/layout'});
  },

  editContact: function(req, res, next) {
    res.view('admin/edit-contact', {layout: 'admin/layout'});
  },

  newAdmin: function(req, res, next) {
    res.view('admin/new-admin', {layout : 'admin/layout'});
  },

  lookup: function(req, res, next) {
    User.find({ sort: 'name' }, function foundUsers (err, users) {
      if (err) return next(err);
      res.view('admin/lookup', {
        users: users,
        layout : 'admin/layout'
      });
    });
  },

  search: function(req, res, next) {
    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser (err, user) {

      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      fs.readFile('./ssl/key.pem', 'utf8', function (err, privKey) {
        if (err) {
          console.log(err);
        }
        if (user.savedPayment.length <= 0) {
            res.view('admin/view-cards', {
                user: user,
                cards: [],
                layout : 'admin/layout'
            });
        } else {
            decrypt(0, user, privKey, res);
        }

      });

    });
  }

};
