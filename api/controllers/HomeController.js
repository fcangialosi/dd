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

 var nodemailer = require('nodemailer');
 var transporter = nodemailer.createTransport({
    service : 'Gmail',
    auth: {
        user: 'fcangialosi94@gmail.com',
        pass :'ENTER PASSWORD HERE'
    }
 });

module.exports = {

  index: function (req, res, next) {
     res.view('home/home', {layout: 'home/home-layout'});
  },

  main: function(req, res, next) {
    res.view('main/index');
  },

  feedback: function(req, res, next) {
    var mailOptions = {
        from : 'Feedback <feedback@davidanddads.com>',
        to: 'david@davidanddads.com, fcangialosi94@gmail.com',
        subject : 'Someone left a comment on the website!',
        text : req.params.all()['description']
    }
    transporter.sendMail(mailOptions, function(err, info) {
        if (err){
            req.session.flash = {
                failure : 'An error occured while trying to submit your feedback, please try again!'
            }
        }
        req.session.flash = {
            success : 'Your feedback has been successfully submitted. Thanks for taking the time to write to us!'
        }
        res.redirect('main#feedback');
    });

  }


};
