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

var triplesec = require('triplesec');
var fs = require('fs');
var request = require('request');

// view region: https://display-kml.appspot.com/
var deliveryRegion = [
    [-76.615105, 39.291195],
    [-76.622733, 39.281530],
    [-76.623699, 39.293620],
    [-76.622583, 39.310556],
    [-76.619965, 39.317529],
    [-76.607949, 39.318193],
    [-76.591469, 39.312084],
    [-76.589238, 39.295746],
    [-76.593590, 39.284224],
    [-76.601640, 39.283788],
    [-76.612197, 39.286778],
    [-76.612369, 39.280865],
    [-76.599494, 39.272494],
    [-76.600181, 39.271165],
    [-76.603958, 39.269238],
    [-76.615133, 39.270537],
    [-76.624900, 39.276812],
    [-76.622497, 39.281662],
    [-76.615105, 39.291195]
];

var geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=MYKEY&address=';

var destIsInRegion = function(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

module.exports = {

    'new' : function(req, res){
    	res.view();
    },

    create : function(req, res, next) {

      redirect = '/catering/order/start';
      skip_to = '/catering/order/delivery';
			req.session.virtual = false;
      if (req.param('_type') == 'virtual') {
				req.session.virtual = true;
        redirect = '/virtualcafe';
        skip_to = '/virtualcafe/order';
      } else if (req.param('_type') == 'admin') {
        redirect = '/admin/new';
        skip_to = '/admin';
      }

    	User.create(req.params.all(), function userCreated(err,user) {
    		if(err){
          if ('code' in err && err['code'] == 11000) {
            req.session.flash = {
              err: {'name' : 'E-Mail Already Exists', 'err' : 'Looks like you already have an account with us! Just enter your e-mail in the box on the right to log-in.'},
              type: 'signup'
            }
          } else {
            req.session.flash = {
              err: err,
              type: 'signup'
            }
          }
    			return res.redirect(redirect);
    		}

        if (req.param('_type') == 'admin') {
          req.session.flash = {
            err : {
              'name' : "Success",
              'err' : "User " + user.name + " created successfully, but has no permissions."
            },
            type : 'success'
          }
        } else {
          // automatically log them in now
          req.session.authenticated = true;
          req.session.User = user;
        }

    	  res.redirect(skip_to);

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
          users: users,
          layout : 'admin/layout'
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
        user: user,
        layout : 'admin/layout'
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

  addVirtualDelivery : function(req, res, next) {
      new_delivery = {
          address : req.body.address,
          city : req.body.city,
          zip : req.body.zip,
          special: req.body.instructions
      };

      var queryAddr = req.body.address + ", " + req.body.city + " " + req.body.zip;
      var urlSafeAddr = queryAddr.replace(/ /g, '+');

      request(geocodingUrl + urlSafeAddr, function(err, resp, body) {
          if (err) {
              req.session.flash = {
                  err: err,
              };
              res.redirect('/virtualcafe/delivery-locations');
          } else if (resp && resp.statusCode == 200) {
              var bodyJson = JSON.parse(body);
              var loc = bodyJson.results[0].geometry.location;
              var dest = [loc.lng, loc.lat];
              if (destIsInRegion(dest, deliveryRegion)) {
                  if('savedVirtualDelivery' in req.session.User) {
                      req.session.User.savedVirtualDelivery.push(new_delivery);
                  } else {
                      req.session.User.savedVirtualDelivery = [new_delivery];
                  }
                  User.update(req.session.User.id, req.session.User, function userUpdated(err,user) {
                      if(err) {
                          req.session.flash = {
                              err: err
                          };
                      } else {
                          req.session.flash = {
                              success : 'Your address has been added successfully.'
                          }
                      }
                      res.redirect('/virtualcafe/delivery-locations');
                  });
              } else {
                  req.session.flash = {
                      err: 'Sorry, we don\'t deliver to your address yet!',
                  };
                  res.redirect('/virtualcafe/delivery-locations');
              }
          } else {
              req.session.flash = {
                  err: 'No response recieved from geocoding api',
              };
              res.redirect('/virtualcafe/delivery-locations');
          }
      });

  },

  addDelivery : function(req, res, next) {
    new_delivery = {
        contactName : req.body.name,
        contactPhone : req.body.phone,
        address : req.body.address,
        city : req.body.city,
        special : req.body.instructions
    };
    if (!req.body.name || req.body.name.trim() == "") {
      new_delivery.contactName = req.session.User.name;
    }
    if (!req.body.phone || req.body.phone.trim() == " ") {
      new_delivery.contactPhone = req.session.User.phone;
    }
    req.session.User.savedDelivery.push(new_delivery);

    req.session.delivery = new_delivery;
    req.session.delivery.index = req.session.User.savedDelivery.length-1;

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
      if (err) {
        return res.redirect('/catering/order/delivery/new');
      }
      res.redirect('/catering/order/delivery');
    });
  },

  removeDelivery : function(req, res, next) {

    req.session.User.savedDelivery.splice(req.param('id'), 1);

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
      if (err) {
        return res.redirect('/catering/order/delivery');
      }
      res.redirect('/catering/order/delivery');
    });
  },

  removeVirtualDelivery : function(req, res, next) {

    req.session.User.savedVirtualDelivery.splice(req.param('id'), 1);

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
        if (err) {
            return next(err);
        }
        res.redirect('/virtualcafe/delivery-locations');
    });
  },

  addPayment : function(req, res, next) {

    fs.readFile('./ssl/key.pem', 'utf8', function (err, privKey) {
      if (!err) {
        triplesec.encrypt({
          data  : new triplesec.Buffer(req.body.number),
          key : new triplesec.Buffer(privKey),
          progress_hook : function (obj) {}
        }, function(err, buff){
          if (! err) {
            var ciphertext = buff.toString('hex');
            newCard = {
              lastFour : req.body.number.substring(req.body.number.length - 4),
              number : ciphertext,
              name : req.body.name,
              expiry : req.body.expiry,
              cvc : req.body.cvc,
							zip : req.body.zip
            }
            req.session.User.savedPayment.push(newCard);
            req.session.card = newCard;
            req.session.card.index = req.session.User.savedPayment.length-1;

            User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
              if (! err) {
                res.redirect('/catering/order/payment/continue?method=Credit');
              } else {
                req.session.flash = {
                  failure : "Sorry, we had some trouble saving your card, please try again."
                }
                res.redirect('/catering/order/payment/continue?method=Credit');
              }
            });
          } else {
            req.session.flash = {
              failure : "Sorry, we had some trouble saving your card, please try again."
            }
            res.redirect('/catering/order/payment/continue?method=Credit');
          }
        });
      } else {
        req.session.flash = {
          failure : "Sorry, we had some trouble saving your card, please try again."
        }
        res.redirect('/catering/order/payment/continue?method=Credit');
      }
    });
  },

  removePayment : function(req, res, next) {
    req.session.User.savedPayment.splice(req.param('id'), 1);

    User.update(req.session.User.id, req.session.User, function userUpdated (err, user) {
      if (err) {
        req.session.flash = {
          failure : "Error deleting card, please try again."
        }
        return res.redirect('/catering/order/payment/continue?method=Credit');
      }
      req.session.flash = {
        success : "Card removed successfully."
      }
      res.redirect('/catering/order/payment/continue?method=Credit');
    });
  }

};
