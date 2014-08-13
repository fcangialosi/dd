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

    displayMainSpecials : function(req, res, next) {
      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"main-specials"}, function foundMenus (err, menu) {
        if (err) return next(err);
        res.view('specials',
        {
          menu: menu,
          cafe : 'Main Cafe'
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

    displayExpressSpecials : function(req, res, next) {
      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"express-specials"}, function foundMenus (err, menu) {
        if (err) return next(err);
        res.view('specials',
        {
          menu: menu,
          cafe : "David and Dad's Express"
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

    new : function(req, res, next) {
      res.view('menu/new_menu');
    },

    new_item : function(req, res, next) {
      res.view('menu/new_item',
      {
        menu_id : req.param('id')
      });
    },

    create : function(req, res, next) {
      var new_menu = req.params.all();
      if(new_menu.breakfast == 'breakfast') {
        new_menu.breakfast = true;
      } else {
        new_menu.breakfast = false;
      }
      delete new_menu._csrf;
      new_menu.items = [];

      Menu.create(new_menu, function menuCreated(err, menu) {
        if (err) {
          console.log(err);
          req.session.flash = {
            err : JSON.stringify(err, null, 4)
          }
          return res.redirect('/menu/new');
        }
        req.session.flash = {
          success : req.param('name') + " menu created successfully!"
        }
        res.redirect('/menu');
      });
    },

    create_item : function(req, res, next) {
      var item = JSON.parse(JSON.stringify(req.params.all()));
      delete item._csrf;
      delete item.id;

      Menu.findOne(req.param('id'), function foundMenu (err, menu) {
        if (err) return next(err);
        if (!menu) return next('Menu doesn\'t exist.');

        menu['items'].push(item);

        Menu.update(req.param('id'), menu, function itemUpdated(err) {
          if (err) {
            req.session.flash = {
              err: err
            }
            return res.redirect('/menu/edit/' + req.param('id'));
          }
          req.session.flash = {
            success: "Created " + item.name + " successfully."
          }
          res.redirect('/menu/edit/' + req.param('id'));
        });
      });
    },

    index: function (req, res, next) {

      // Get an array of all Menus in the Menu collection(e.g. table)
      Menu.find(function foundMenus (err, menus) {
        if (err) return next(err);

        var main = {
          'name' : 'Main Cafe Menu',
          'menus' : []
        };
        var catering = {
          'name' : 'Catering Menu',
          'menus' : []
        };
        var express = {
          'name' : 'Express Cafe Menu',
          'menus' : []
        };

        menus.forEach(function(menu) {
          if (menu['menu'] == 'main') {
            main['menus'].push(menu);
          } else if (menu['menu'] == 'catering') {
            catering['menus'].push(menu);
          } else if (menu['menu'] == 'express'){
            express['menus'].push(menu);
          }
        });

        categorized_menus = [main, catering, express];
        res.view('menu/list_menus',
        {
          menus : categorized_menus
        });
      });
    },

    edit: function (req, res, next) {

      Menu.findOne(req.param('id'), function foundMenu (err, menu) {
        if (err) return next(err);
        if (!menu) return next('Menu doesn\'t exist.');

        if(req.param('index')) {
          item = menu['items'][req.param('index')];
          res.view('menu/edit_item',
          {
            menu_id : menu.id,
            item_index : req.param('index'),
            item : item
          });
        } else {
          res.view('menu/menu_index',
          {
            menu : menu
          });
        }
      });
    },

    update: function(req, res, next) {
      Menu.findOne(req.param('id'), function foundMenu(err, menu) {
        if (err) return next(err);
        if (!menu) return next('Menu doesn\'t exist.');

        index = Number(req.param('index'));

        if (index) {
          var edited_item = JSON.parse(JSON.stringify(req.params.all()));
          delete edited_item._csrf;
          delete edited_item.id;
          delete edited_item.index;

          menu['items'][index] = edited_item;

          Menu.update(req.param('id'), menu, function itemUpdated(err) {
            if (err) {
              req.session.flash = {
                err: err
              }
              return res.redirect('/menu/edit/' + req.param('id'));
            }
            req.session.flash = {
              success: "Updated " + edited_item.name + " successfully."
            }
            res.redirect('/menu/edit/' + req.param('id'));
          });
        } else {
          var edited_menu = JSON.parse(JSON.stringify(req.params.all()));
          edited_menu['subhead'] = req.param('subhead');
          Menu.update(req.param('id'), edited_menu, function itemUpdated(err) {
            if (err) {
              req.session.flash = {
                err: err
              }
              return res.redirect('/menu/edit/' + req.param('id'));
            }
            req.session.flash = {
              success: "Updated menu subheading successfully."
            }
            res.redirect('/menu/edit/' + req.param('id'));
          });
        }
      });
    },

    destroy : function(req, res, next) {

      Menu.findOne(req.param('id'), function foundMenu (err, menu) {
        var index = Number(req.param('index'));
        if(index) { // delete individual item
          var name = menu['items'][index].name;
          var edited_menu = JSON.parse(JSON.stringify(menu));
          edited_menu['items'].splice(index, 1);
          Menu.update(req.param('id'), edited_menu, function itemUpdated(err) {
            if (err) {
              req.session.flash = {
                err: err
              }
              return res.redirect('/menu/edit/' + req.param('id'));
            }
            req.session.flash = {
              success: "Removed " + name + " successfully."
            }
            res.redirect('/menu/edit/' + req.param('id'));
          });
        } else { // delete entire section
          Menu.destroy(req.param('id'), function menuDestroyed(err) {
            if (err) {
              return next(err);
            }
            req.session.flash = {
              success : "Successfully deleted " + menu.name
            }
            res.redirect('/menu');
          });
        }

      });

    }

};
