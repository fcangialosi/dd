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

      // Get an array of all  in the User collection(e.g. table)
      Menu.find({"menu":"main"}, function foundUsers (err, menu) {
        if (err) return next(err);
        res.view('main/menu',
        {
          menu: menu
        });
      });
    },

    displayCateringMenu: function (req, res, next) {

      // Get an array of all  in the User collection(e.g. table)
      Menu.find({"menu":"catering"}, function foundUsers (err, menu) {
        if (err) return next(err);
        res.view('catering/menu',
        {
          menu: menu
        });
      });
    },

	displayExpressMenu: function (req, res, next) {

      // Get an array of all  in the User collection(e.g. table)
      Menu.find({"menu":"express"}, function foundUsers (err, menu) {
        if (err) return next(err);
        res.view('express/menu',
        {
          menu: menu
        });
      });
    }
  
};
