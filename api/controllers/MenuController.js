/**
 * MenuController
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
   
    displayMainMenu: function (req, res, next) {

      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"main"}, function foundMenus (err, menu) {
        if (err) return next(err);
        res.view('menu',
        {
          menu: menu
        });
      });
    },

    displayCateringMenu: function (req, res, next) {

      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"catering"}, function foundMenus (err, menu) {
        if (err) return next(err);
        res.view('menu',
        {
          menu: menu
        });
      });
    },

	displayExpressMenu: function (req, res, next) {

      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"express"}, function foundMenus (err, menu) {
        if (err) return next(err);
        res.view('menu',
        {
          menu: menu
        });
      });
    },

    displayOrderingMenu: function (req, res, next) {
      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"catering"}, function foundMenus (err, menu) {
        if (err) return next(err);
        res.view('catering/order/menu',
        {
          menu: menu
        });
      });
    },


    printOrder: function (req, res, next) {
      console.log(req.query);
      res.redirect('/');
    },

    index: function (req, res, next) {

      // Get an array of all Menus in the Menu collection(e.g. table)
      Menu.find(function foundMenus (err, menus) {
        if (err) return next(err);
        // pass the array down to the /views/index.ejs page
        res.view({
          menus: menus
        });
      });
    },

    edit: function (req, res, next) {

      Menu.findOne(req.param('id'), function foundItem (err, menu) {
        if (err) return next(err);
        if (!menu) return next('Item doesn\'t exist.');

        res.view({
          item : item
        });
      });
    },

    update: function(req, res, next) {

      Menu.update(req.param('id'), req.params.all(), function itemUpdated(err) {
        if (err) {
          return res.redirect('/menu')
        }

        res.redirect('/menu')
      });
    }
  
};
