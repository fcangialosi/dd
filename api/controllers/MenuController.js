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
      Menu.find({"menu":"main"}).sort('index asc').exec(function (err, menu) {
        if (err) return next(err);
        res.view('menu',
        {
          menu: menu,
          menu_name: "David and Dad's Cafe"
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
          menu_name: "David and Dad's Cafe"
        });
      });
    },

    displayCateringMenu: function (req, res, next) {

      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"catering"}).sort('index asc').exec(function (err, menu) {
        if (err) return next(err);
        res.view('menu',
        {
          menu: menu,
          menu_name: "David and Dad's Catering"
        });
      });
    },

	displayExpressMenu: function (req, res, next) {

      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"express"}).sort('index asc').exec(function (err, menu) {
        if (err) return next(err);
        res.view('menu',
        {
          menu: menu,
          menu_name: "David and Dad's Express"
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
          menu_name: "David and Dad's Express"
        });
      });
    },

    displayOrderingMenu: function (req, res, next) {
      // Get an array of all  in the Menu collection(e.g. table)
      Menu.find({"menu":"catering"}).sort('index asc').exec(function (err, menu) {
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
      res.view('menu/new_menu', {layout : 'admin/layout', menu : req.param('menu')});
    },

    new_item : function(req, res, next) {
      res.view('menu/new_item',
      {
        menu_id : req.param('id'),
        layout : 'admin/layout'
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
        res.view('menu/index', { layout : 'admin/layout' });
    },

    adminMain : function(req, res, next) {
     Menu.find({"menu":"main"}).sort('index asc').exec(function (err, menu) {
        if (err) return next(err);
        res.view('menu/list_menus',
        {
          menus: menu,
          menu_type : 'main',
          menu_name : "David and Dad's Main Menu",
          layout: 'admin/layout'
        });
      });
    },

    adminCatering : function(req, res, next) {
      Menu.find({"menu":"catering"}).sort('index asc').exec(function (err, menu) {
        if (err) return next(err);
        res.view('menu/list_menus',
        {
          menus: menu,
          menu_type : 'catering',
          menu_name : "David and Dad's Catering Menu",
          layout: 'admin/layout'
        });
      });
    },

    adminExpress : function(req, res, next) {
      Menu.find({"menu":"express"}).sort('index asc').exec(function (err, menu) {
        if (err) return next(err);
        res.view('menu/list_menus',
        {
          menus: menu,
          menu_type : 'express',
          menu_name : "David and Dad's Express Menu",
          layout: 'admin/layout'
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
            menu_name : menu.name,
            item_index : req.param('index'),
            layout : 'admin/layout',
            item : item
          });
        } else {
          res.view('menu/menu_index',
          {
            menu : menu,
            layout : 'admin/layout'
          });
        }
      });
    },

    update: function(req, res, next) {
      Menu.findOne(req.param('id'), function foundMenu(err, menu) {
        if (err) return next(err);
        if (!menu) return next('Menu doesn\'t exist.');

        if (req.param('index') !== undefined) {
          var index = Number(req.param('index'));
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
          delete edited_menu._csrf;
          delete edited_menu.index;

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

    shift : function(req, res, next) {
      Menu.findOne(req.param('id'), function foundMenu(err, menu) {
          if(err) return next(err);
          if(!menu) return next("Menu doesn't exist.");

          direction = req.param('direction');
          curr = Number(req.param('index'));
          menu = req.param('menu');
          max = Number(req.param('max'));

          if(curr === 0 && direction === 'up') {
              req.session.flash = { err : 'Menu is already at the top!' }
              return res.redirect('/admin/' + menu);
          }
          if (curr === max && direction === 'down') {
              req.session.flash = { err : 'Menu is already at the bottom!'}
              return res.redirect('/admin/' + menu);
          }

          new_index = curr;
          if (direction === 'up') {
            console.log("up");
            new_index -= 1
          } else if (direction === 'down') {
            console.log("down");
            new_index += 1
          }

          Menu.update({index : new_index}, {index : curr}).exec(function(err, updated) {
            if (err) {
              req.session.flash = { err : 'Database error!'}
              return res.redirect('/admin/' + menu);
            }
            console.log(updated);
            Menu.update({id : req.param('id')}, {index : new_index}).exec(function(err, updated) {
              if (err) {
                req.session.flash = { err : 'Database error!'}
                return res.redirect('/admin/' + menu);
              }
              console.log(updated);
              req.session.flash = { success : 'Menu moved successfully!'}
              res.redirect('/admin/' + menu);
            });
          });

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
