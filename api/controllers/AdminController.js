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

var gp = require('globalpayments-api');
var config = new gp.ServicesConfig();
config.secretApiKey = "skapi_prod_MX4IAwCjbCoA4Q6S6alFIuETLHJfJFbxJbN6GtRW-Q";
config.developerId = "002914";
config.versionNumber = "3270";
config.serviceUrl = "https://api2.heartlandportico.com";
gp.ServicesContainer.configure(config);

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
  },

  listTransactions: function(req, res, next) {
      var catcher = function(err) {
          console.log("catching...");
          res.view('virtualcafe/test', {
              resp: JSON.stringify(err),
              layout : 'admin/layout',
          });
      };
      const start = new Date(Date.now());
      start.setDate(start.getDate() - 3);
      const end = new Date(Date.now());
      gp.ReportingService.activity()
          .withStartDate(start)
          .withEndDate(end)
          .execute()
          .then(function(t) {
              res.view('admin/transactions', {
                  ts: t,
                  layout : 'admin/layout'
              });
          })
          .catch(catcher);
  },

  editTransaction: function(req, res, next) {
      var action = req.param('action');
      var handler = function(resp) {
          console.log("handling...");
          res.view('virtualcafe/test', {
              resp: JSON.stringify(resp),
              layout : 'admin/layout',
          });
      };
      var catcher = function(err) {
          console.log("catching...");
          res.view('virtualcafe/test', {
              resp: JSON.stringify(err),
              layout : 'admin/layout',
          });
      };
      if (action === "void") {
          var tid = req.body.tid;
          gp.Transaction.fromId(tid)
              .void()
              .execute()
              .then(handler)
              .catch(catcher);
      } else if (action === "refund") {
          var tid = req.body.tid;
          var amt = req.body.amt;
          console.log("refund", tid, amt);
          gp.Transaction.fromId(tid)
              .refund(amt)
              .withCurrency("USD")
              .execute()
              .then(handler)
              .catch(catcher);
        console.log("refund sent");
      } else if (action === "edit") {
          var tid = req.body.tid;
          var new_amt = req.body.new_amt;
          console.log("edit", tid, new_amt);
          gp.Transaction.fromId(tid)
              .edit()
              .withAmount(new_amt)
              .execute()
              .then(handler)
              .catch(catcher);
          console.log("edit sent");
      } else {
          catcher({"err" : "Unknown transaction action " + action});
      }
  }
};
