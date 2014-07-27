/**
 * OrderController
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

module.exports = {
    
  // list a user's saved delivery options
  // and prompt for date/time for current order
  'selectDelivery' : function(req,res) {
    // TODO what if User.savedDelivery doesnt exist?
    res.view('catering/delivery/select');
  },

  'newDelivery' : function(req,res) {
    res.view('catering/delivery/add');
  },

  'selectPayment' : function(req,res) {
    res.view('catering/payment/select');
  },

  'newPayment' : function(req,res) {
    res.view('catering/payment/add');
  },

  'review' : function(req,res) {
    res.view('catering/confirm/review');
  },

  'submit' : function(req,res) {
    var parsed = JSON.stringify(req.session) + JSON.stringify(req.params.all());
    var message_to_dd = {
      "text" : parsed,
      "subject": "ORDER REQUEST FROM " + req.session.user.companyName,
      "from_email": "orders@davidanddads.com",
      "from_name": "Order Manager",
      "to": [{
              "email": "fcangialosi94@gmail.com",
              "name": "David and Dad's",
              "type": "to"
          }]
    };
    var message_to_customer = {
      "text" : "Just letting you know that we have successfully recieved your order! Our team will review your order as soon as possible, and send you a final e-mail once your order has been verified. Please remember that your order is not final until you recieve that e-mail! If you havev any questions, comments, or concerns about your order, please send an email to catering@davidanddads.com.",
      "subject" : "David and Dad's Order Recieved",
      "from_email" : "catering@davidanddads.com",
      "to" : [{
        "email" : req.session.User.email,
        "name" : req.session.User.firstName + " " + req.session.User.lastName,
        "type" : "to"
      }]
    };
    mandrill_client.messages.send({"message": message_to_dd, "async": false}, function(result) {
      console.log(result);
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
    mandrill_client.messages.send({"message": message_to_customer, "async": false}, function(result) {
      console.log(result);
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
    res.view('catering/confirm/success');
  }
  
};
