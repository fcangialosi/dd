/**
 * HomeController
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

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('A0FFxkmu5O8btl-vw4zlfA');
var AWS = require('aws-sdk');
AWS.config.update({ region : 'us-east-1' });
var ses = new AWS.SES();

module.exports = {

  index: function (req, res, next) {
     Page.findOne({"page":"home"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('home/home', {
            layout: 'home/home-layout',
            message : message
        });

      });
  },

	indexTest: function (req, res, next) {
     Page.findOne({"page":"home"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('home/test', {
            layout: 'home/home-layout',
            message : message
        });

      });
	},

  jobs: function(req, res, next) {
    Page.findOne({"page":"jobs"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('main/jobs', {
            content : message
        });

      });
  },

  contact: function(req, res, next) {
    Page.findOne({"page":"contact"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('main/contact', {
            content : message
        });

    });
  },

  policy: function(req, res, next) {
    Page.findOne({"page":"policy"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('main/policy', {
            content : message
        });

    });
  },

  press: function(req, res, next) {
    Page.findOne({"page":"press"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('main/press', {
            content : message
        });

    });
  },

  news: function(req, res, next) {
    Page.findOne({"page":"news"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('main/news', {
            content : message
        });

    });
  },

  main: function(req, res, next) {
    res.view('main/index');
  },

	bug: function(req, res, next) {
		console.log("BUG REPORT!");
		console.log(req.params.all());
		console.log(req.session.User);
		params = req.params.all();

		var report = {
			Destination: {
				ToAddresses: [
					'david@davidanddads.com',
					'fcangialosi94@gmail.com'
				]
			},
			Message: {
				Body: {
					Text: {
						Data:  "Name: " + req.session.User.name + "\n"
					       + "Email: " + req.session.User.email + "\n"
								 + "OS: " + params['bug-os'] + "\n"
								 + "Browser: " + params['bug-browser'] + "\n"
								 + "Message: " + params['description']
					}
				},
				Subject: {
					Data: "Virtual Cafe Bug Report",
				}
			},
			Source: 'orders@davidanddads.com',
			ReplyToAddresses: [ req.session.User.email ]
		};
		console.log(report);

		ses.sendEmail(report, function(err, data) {
			if (err) {
				console.log(err, err.stack);
				req.session.flash = {
						err : 'Something went wrong! ' + err
				};
			} else {
				req.session.flash = {
						success : 'Your bug report has been successfully submitted. Thanks for taking the time to let us know!'
				};
			}
			res.redirect('virtualcafe/order#report');
		});


	},

  feedback: function(req, res, next) {

    var feedback = {
      "subject" : "Someone left a comment on the website!",
      "from_email" : "feedback@davidanddads.com",
      "from_name" : "Feedback",
      "to" : [{
            "email": "david@davidanddads.com",
            "name": "David Cangialosi",
            "type": "to"
        },
        {
            "email": "davidcan@verizon.net",
            "name": "David Cangialosi",
            "type": "to"
        },
        {
            "email": "fcangialosi94@gmail.com",
            "name": "David Cangialosi",
            "type": "to"
        }],
        "text" : req.params.all()['description']
    }
    mandrill_client.messages.send({"message" : feedback, "async" : false}, function(result) {
      req.session.flash = {
            success : 'Your feedback has been successfully submitted. Thanks for taking the time to write to us!'
        }
        res.redirect('main#feedback');
    }, function (e) {
      req.session.flash = {
        failure : 'An error occured while trying to submit your feedback, please try again!'
      };
      res.redirect('main#feedback');
    });
  }


};
