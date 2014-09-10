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

daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
module.exports = {

  index : function(req, res, next) {
     res.view('specials/index', {layout: 'admin/layout'});
  },

  charles : function(req, res, next) {
     // Get an array of all  in the Menu collection(e.g. table)
      Specials.find({"cafe":0}, function foundSpecials (err, specials) {
        if (err) return next(err);
        res.view('specials/list',
        {
          layout: 'admin/layout',
          cafe_name: 'Charles St. Cafe',
          breakfast_specials : specials
        });
      });
  },

  fayette : function(req, res, next) {
    res.view('specials/list', {layout: 'admin/layout', cafe_name : 'David and Dad\'s Express'});
  },

  pratt : function(req, res, next) {
    res.view('specials/list', {layout: 'admin/layout', cafe_name : 'Cafe Express'});
  },

  broadway : function(req, res, next) {
    res.view('specials/list', {layout: 'admin/layout', cafe_name : 'Garden View Cafe'});
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
    Specials.find({'cafe' : 0}).sort('i asc').exec(function foundSpecials (err, menu) {
      if (err) return next(err);

      res.view('specials', {
        cafe : 'Cafe Express',
        specials : menu
      })
    });
  },

  displayBroadwaySpecials : function(req, res, next) {
    Specials.find({'cafe' : 0}).sort('i asc').exec(function foundSpecials (err, menu) {
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
    console.log(today);
    //Specials.find().where({ or: [{'day': today},{'name' : 'Breakfast Specials'}]}).sort('cafe asc').exec
    Specials.find().where({ or: [{'subhead': today},{'name' : 'Breakfast Specials'}]}).sort('cafe asc').sort('i asc').exec(function foundSpecials (err, menu) {
      console.log(menu);
      res.view('express/index', {
        specials : menu
      });
    });
  }

};
