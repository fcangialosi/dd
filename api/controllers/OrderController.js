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
    console.log(req.session);
    res.view('catering/confirm/success');
  }
  
};
