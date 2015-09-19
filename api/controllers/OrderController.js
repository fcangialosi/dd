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

var swig = require('swig');
swig.setDefaults({ autoescape : false });
var triplesec = require('triplesec');
var fs = require('fs');
var exec = require('child_process').exec;

var getDateTime = function() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return "[" + year + "/" + month + "/" + day + " " + hour + ":" + min + "]";
};

var generateHtml = function(session, cart, rawNumber) {
  var tpl = swig.compileFile('./emails/invoice.txt');
  var subtotal_calc = 0;
  var cart_items = [];
  var longest_item = 0;
  for (var i=1; i <= cart['itemCount']; i++) {
    var item_length = cart['item_name_' + i].length;
    if (item_length > longest_item) {
      longest_item = item_length;
    }
  }
  var item_padding = longest_item + 6;
  var padded_item = "Item" + new Array(item_padding - 4).join(' ');
  var divider = new Array(item_padding + 28).join('=');
  for (var i=1; i <= cart['itemCount']; i++) {
    item = {}
    item['name'] = cart['item_name_' + i];
    item['name'] = item['name'] + new Array(item_padding - item['name'].length).join(' ')
    item['price'] = "$" + parseFloat(cart['item_price_' + i]).toFixed(2);
    item['price'] = item['price'] + new Array(11 - item['price'].length).join(' ')
    item['quantity'] = cart['item_quantity_' + i];
    item['quantity'] = item['quantity'] + new Array(8 - item['quantity'].length).join(' ')
    total = parseFloat(cart['item_price_' + i]) * parseFloat(cart['item_quantity_' + i]);
    item['total'] = "$" + total.toFixed(2);
    cart_items.push(item);
    subtotal_calc += total;
  }
  var payment_obj = {};
  payment_obj['method'] = session['paymentMethod'];
  payment_obj['info'] = '';
  if (session['paymentMethod'] === 'Credit') {
    // payment_obj['info'] = session['card']['cardName'] + "<br>" + rawNumber + "<br>" + session['card']['cardExpiry'] + "<br>" + session['card']['cardCvc'];
    payment_obj['info'] = ("XXXX-XXXX-XXXX-"+session['card']['lastFour']);
  }
  return tpl({
    order_contact : session['User'],
    delivery : session['delivery'],
    iscard : (session['paymentMethod'] === 'Credit'),
    payment : payment_obj,
    item_header : padded_item,
    divider : divider,
    items : cart_items,
    subtotal : ("$" + subtotal_calc.toFixed(2)),
    tax : ("$" + parseFloat(cart.tax).toFixed(2)),
    total : ("$" + (subtotal_calc + parseFloat(cart.tax)).toFixed(2))
  });
}

/*
var sendEmail = function(html, req, res) {
  var message_to_dd = {
    "html" : html,
    "subject": "Order Request",
    "from_email": req.session.User.email,
    "from_name": req.session.User.name,
    "to": [{
	    "email": "catering@davidanddads.com",
            "name": "David and Dad's",
            "type": "to"
        }]
  };

  mandrill_client.messages.send({"message": message_to_dd, "async": false}, function(result) {
      User.update(req.session.User.id, {specialRequest:''}).exec(function afterwards(err, updated) {
        delete req.session.foodComplete;
          delete req.session.paymentMethod;
          delete req.session.card;
          delete req.session.delivery;
          delete req.session.User.specialRequest;
          res.view('catering/confirm/success');
      });
  }, function(e) {
     console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
     res.view('catering/confirm/failure');
  });
}
*/

var sendEmailPostfix = function(html, req, res) {
  var email_file = "invoices/"+(req.session.User.email.split("@")[0]+".html")

  fs.writeFile(email_file, html, function(err) {
      if (err) {
          return console.log(err);
      }
  });

  //var cmd = "mailx -a 'Content-Type:text/html' -a 'From: " + req.session.User.name + " <" + req.session.User.email + ">' -s 'Order Request' 'catering@davidanddads.com' < " + email_file
  //var cmd = "mailx -a 'Reply-to: " + req.session.User.name + "<" + req.session.User.email + ">' -a 'From: Order Form <orders@davidanddads.com>' -s 'Order Request' 'catering@davidanddads.com' < " + email_file;
  var cmd = "mailx -a 'Reply-to: " + req.session.User.name + "<" + req.session.User.email + ">' -a 'From: Order Form <orders@davidanddads.com>' -s 'Order Request' 'catering@davidanddads.com' < " + email_file;

  exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.log("Failed sending email from customer: " + req.session.User.email);
            console.log(error);
            res.view('catering/confirm/failure');
        } else {
          console.log("mailx command returned successfully for email to " + req.session.User.email);
          var log_entry = getDateTime() + " - " + req.session.User.name + ", " + 
                          req.session.User.email + ", " + req.session.User.companyName + 
                          ", DELIVER ON " + req.session.delivery.date + " @ " + 
                          req.session.delivery.time + "\n";

          fs.appendFile('invoices/recent_orders.txt',log_entry,function(append_error) {
            if (append_error) {
              console.log("could not append order to log file:");
              console.log(append_error);
            } else { 
              delete req.session.foodComplete;
              delete req.session.paymentMethod;
              delete req.session.card;
              delete req.session.delivery;
              delete req.session.User.specialRequest;
              res.view('catering/confirm/success');
            }
          });
        }
    });
}

module.exports = {

  'start' : function(req, res) {
    if(req.session.authenticated) {
      res.redirect('/catering/order/reminder');
    } else {
      res.view('session/new');
    }
  },

  'reminder' : function(req, res) {
    if(req.session.authenticated) {
      res.view('catering/reminder')
    } else {
      res.view('session/new');
    }
  },

  // list a user's saved delivery options
  // and prompt for date/time for current order
  'selectDelivery' : function(req,res) {
    res.view('catering/delivery/select');
  },

  'newDelivery' : function(req,res) {
    res.view('catering/delivery/add');
  },

  'selectPayment' : function(req, res) {
    res.view('catering/payment/select');
  },

  'continue' : function(req, res) {
    req.session.paymentMethod = req.param('method');
    if(req.param('method') == 'Credit') {
      res.view('catering/payment/card');
    } else {
      res.redirect('catering/order/review');
    }
  },

  'saveSpecialRequest' : function(req, res) {
    req.session.User.specialRequest = req.body.request;
    req.session.foodComplete = true;
    return res.redirect('/catering/order/menu');
  },

  'newCard' : function(req,res) {
    res.view('catering/payment/add');
  },

  'review' : function(req,res) {
    res.view('catering/confirm/review');
  },

  'submit' : function(req,res) {
    var rawNumber = null;
    if ('card' in req.session && 'cardNumber' in req.session['card']) {
      fs.readFile('./ssl/key.pem', 'utf8', function (err, privKey) {
        if (err) {
          console.log(err);
        }
        triplesec.decrypt({
          data : new triplesec.Buffer(req.session['card']['cardNumber'], "hex"),
          key : new triplesec.Buffer(privKey),
          progress_hook : function(obj) {}
        }, function(err, buff) {
          if(err) {
            rawNumber = err;
          } else {
            rawNumber = buff.toString();
          }
          html = generateHtml(req.session, req.params.all(), rawNumber);
          sendEmailPostfix(html, req, res);
        });
      });
    } else {
      html = generateHtml(req.session, req.params.all(), rawNumber);
      sendEmailPostfix(html, req, res)
    }
  }

};
