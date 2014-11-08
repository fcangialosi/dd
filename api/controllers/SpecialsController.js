/**
 * SpecialsController
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

daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
module.exports = {

  index : function(req, res, next) {
     res.view('specials/index', {layout: 'admin/layout'});
  },

  update : function(req, res, next) {

    Specials.findOne(req.param('id'), function foundMenu(err, menu) {
      if (err) return next(err);
      if (!menu) return next('Menu doesn\'t exist.');

      var edited_item = JSON.parse(JSON.stringify(req.params.all()));
      index = Number(req.param('index'));
      cafe = req.param('cafe');
      delete edited_item._csrf;
      delete edited_item.cafe;
      delete edited_item.index;
      if ('description' in edited_item && (edited_item.description == 'EMPTY' || edited_item.description == "")) {
        delete edited_item.description;
      }

      menu['items'][index] = edited_item;

      Specials.update(req.param('id'), menu, function itemUpdated(err) {
        if (err) {
          req.session.flash = {
            err : err
          }
          return res.redirect('/admin/specials/' + cafe);
        }
        req.session.flash = {
          success : "Updated " + edited_item.name + " successfully."
        }
        res.redirect('/admin/specials/' + cafe);
      });
    });
  },

  delete : function(req, res, next) {
    Specials.findOne(req.param('id'), function foundMenu (err, menu) {
      if (err) return next(err);
      if (!menu) return next('Menu doesn\'t exist.');

      var index = Number(req.param('index'));
      var cafe = req.param('cafe');
      var name = menu['items'][index].name;
      var edited_menu = JSON.parse(JSON.stringify(menu));
      edited_menu['items'].splice(index, 1);
      Specials.update(req.param('id'), edited_menu, function itemUpdated(err) {
        if (err) {
          req.session.flash = {
            err: err
          }
          return res.redirect('/admin/specials/' + cafe);
        }
        req.session.flash = {
          success: "Removed " + name + " successfully."
        }
        res.redirect('/admin/specials/' + cafe);
      });
    });
  },

  deleteAll : function(req, res, next) {
    Specials.findOne(req.param('id'), function foundMenu (err, menu) {
      if (err) return next(err);
      if (!menu) return next('Menu doesn\'t exist.');

      var cafe = req.param('cafe');
      var edited_menu = JSON.parse(JSON.stringify(menu));
      edited_menu['items'] = [];
      Specials.update(req.param('id'), edited_menu, function itemUpdated(err) {
        if (err) {
          req.session.flash = {
            err: err
          }
          return res.redirect('/admin/specials/' + cafe);
        }
        req.session.flash = {
          success: "Removed all items from " + edited_menu.name + " successfully."
        }
        res.redirect('/admin/specials/' + cafe);
      });
    });
  },

  add : function(req, res, next){
    Specials.findOne(req.param('id'), function foundMenu (err, menu) {
      if (err) return next(err);
      if (!menu) return next('Menu doesn\'t exist.');

      var cafe = req.param('cafe');
      menu['items'].push({name : "EMPTY", price : "EMPTY", description: "EMPTY"});
      Specials.update(req.param('id'), menu, function itemUpdated(err) {
        if (err) {
          req.session.flash = {
            err: err
          }
          return res.redirect('/admin/specials/' + cafe);
        }
        req.session.flash = {
          success: "Added new blank item to " + menu.name + " successfully."
        }
        res.redirect('/admin/specials/' + cafe);
      });
    });
  },

  changeDay : function(req, res, next) {
    Specials.findOne(req.param('id'), function foundMenu (err, menu) {
      if (err) return next(err);
      if (!menu) return next('Menu doesn\'t exist.');

      var cafe = req.param('cafe');
      var day = req.param('day');
      menu['day'] = day
      Specials.update(req.param('id'), menu, function itemUpdated(err) {
        if (err) {
          req.session.flash = {
            err: err
          }
          return res.redirect('/admin/specials/' + cafe);
        }
        req.session.flash = {
          success: "Updated date for " + menu.name + " successfully."
        }
        res.redirect('/admin/specials/' + cafe);
      });
    });
  },

  charles : function(req, res, next) {
      Specials.find({'cafe' : 0}).sort('i asc').exec(function foundSpecials (err, menu) {
        if (err) return next(err);
        res.view('specials/list',
        {
          layout: 'admin/layout',
          cafe_name: 'Charles St. Cafe',
          cafe : 'charles',
          specials : menu
        });
      });
  },

  fayette : function(req, res, next) {
    Specials.find({'cafe' : 1}).sort('i asc').exec(function foundSpecials (err, menu) {
        if (err) return next(err);
        res.view('specials/list',
        {
          layout: 'admin/layout',
          cafe_name: 'David and Dad\'s Express',
          cafe : 'fayette',
          specials : menu
        });
      });
  },

  pratt : function(req, res, next) {
    Specials.find({'cafe' : 2}).sort('i asc').exec(function foundSpecials (err, menu) {
        if (err) return next(err);
        res.view('specials/list',
        {
          layout: 'admin/layout',
          cafe_name: 'Cafe Express',
          cafe : 'pratt',
          specials : menu
        });
      });
  },

  broadway : function(req, res, next) {
    Specials.find({'cafe' : 3}).sort('i asc').exec(function foundSpecials (err, menu) {
        if (err) return next(err);
        res.view('specials/list',
        {
          layout: 'admin/layout',
          cafe_name: 'Garden View Cafe',
          cafe : 'broadway',
          specials : menu
        });
      });
  },

  displayCharlesSpecials : function(req, res, next) {
    Specials.find({'cafe' : 0}).sort('i asc').exec(function foundSpecials (err, menu) {
      if (err) return next(err);

      res.view('specials', {
        cafe : 'Charles St. Cafe',
        specials : menu
      })
    });
  },

  displayFayetteSpecials : function(req, res, next) {
    Specials.find({'cafe' : 1}).sort('i asc').exec(function foundSpecials (err, menu) {
      if (err) return next(err);

      res.view('specials', {
        cafe : 'David and Dad\'s Express',
        specials : menu
      })
    });
  },

  displayPrattSpecials : function(req, res, next) {
    Specials.find({'cafe' : 2}).sort('i asc').exec(function foundSpecials (err, menu) {
      if (err) return next(err);

      res.view('specials', {
        cafe : 'Cafe Express',
        specials : menu
      })
    });
  },

  displayBroadwaySpecials : function(req, res, next) {
    Specials.find({'cafe' : 3}).sort('i asc').exec(function foundSpecials (err, menu) {
      if (err) return next(err);

      res.view('specials', {
        cafe : 'Garden View Cafe',
        specials : menu
      })
    });
  },

  todaysSpecials : function(req, res, next) {
    date = new Date();
    today = daysOfTheWeek[date.getDay()];
    if (today === 'Saturday' || today === 'Sunday') {
      var closed = [];
      for (var i=0; i < 8; i++) {
        closed.push({items: [{name : "Sorry, we're closed today!", price: " "}]});
      }
      res.view('express/index', {
          specials : closed
        }
      );
    } else {
      Specials.find().where({ or: [{'subhead': today},{'name' : 'Breakfast Specials'}]}).sort('cafe asc').sort('i asc').exec(function foundSpecials (err, menu) {
        res.view('express/index', {
          specials : menu
        });
      });
    }
  }
};
