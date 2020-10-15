/**
 * VirtualCafeController
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

var fs = require('fs');

var daysOfTheWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

var months = [
  'January',
  'February',
  'March ',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


findCardType = function(cardNumber) {
  for (var i=0; i<types.length; i++) {
    if(types[i].pattern.test(cardNumber)) {
      return types[i].type;
    }
  } return null;
}


orderForm = function(req, res, next, page) {
    //var date = new Date(1447684212*1000);
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    var min = date.getMinutes();

    var isWeekend = day == 0 || day == 6;
    var isBeforeDeadline = (hour < 11); // || (hour == 10 && min <= 30);

    min = (min < 10 ? "0" : "") + min;
    hour = (hour < 10 ? "0" : "") + hour;

    var custom = {}, subheads = {}, extras = {};
    // Get an array of all  in the Menu collection(e.g. table)
    Menu.find({"menu":"virtual"}).sort('index asc').exec(function (err, menu) {
      if (err) return next(err);
      for (var i=0; i < menu.length; i++) {
        var selected = false;
        if (menu[i]['custom'] == true) {
          custom[menu[i]['short']] = menu[i]['items'];
          subheads[menu[i]['short']] = menu[i]['subhead'];
          selected = true;
        } else if (menu[i]['extras'] == true) {
          extras[menu[i]['short']] = {
            items : menu[i]['items'],
            name : menu[i]['side']
          };
          subheads[menu[i]['short']] = menu[i]['subhead'];
          selected = true;
        }
        if (selected) {
          menu.splice(i,1);
          i--;
        }
      }
			Specials.findOne({"subhead" : daysOfTheWeek[day],'cafe' : 0}).exec(function (err, specials) {
				if (err) return next(err);
				menu.push(specials);

				Locations.find({}).sort('_id ASC').exec(function foundLocations (err, all) {
					res.view(page, {
						menu: menu,
						custom : custom,
						extras : extras,
						subheads : subheads,
						locations: all,
						isWeekend : isWeekend,
						isBeforeDeadline : isBeforeDeadline,
						time : (hour > 12 ? hour-12 : hour) + ":" + min + (hour < 12 ? "AM" : "PM"),
						dayOfTheWeek : daysOfTheWeek[day],
						date : months[date.getMonth()] + " " + date.getDate()
					});
				});
      });
    });
  }

module.exports = {

	index: function (req, res, next) {
    Locations.find({}).sort('_id ASC').exec(function foundLocations (err, all) {
		  res.view('virtualcafe/index', {
        locations: all,
				message: null
      });
    });
	},

	editCards: function (req, res, next) {
		res.view('virtualcafe/edit-cards');
	},

    editDeliveryLocations: function(req, res, next) {
        res.view('virtualcafe/edit-delivery');
    },

	subscribe: function(req, res, next) {
		var email = req.session.User.email;
		fs.appendFileSync('virtualcafe-notify-list.txt',(email + "\n"));
    Locations.find({}, function foundLocations (err, all) {
		  res.view('virtualcafe/index', {
        locations: all,
				message : 'Thanks for your interest in David and Dad\'s Virtual Cafe! You will receieve an e-mail at ' + email + ' as soon as we\'re ready to start delivering!'
      });
    });
	},

    orderFormPublic: function(req, res, next) {
        orderForm(req, res, next, 'virtualcafe/order')
    },

    orderFormBeta: function(req, res, next) {
        orderForm(req, res, next, 'virtualcafe/order_beta')
    },


};
