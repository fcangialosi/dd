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

var AWS = require('aws-sdk');
AWS.config.update({ region : 'us-east-1' });
var ses = new AWS.SES();

privKey = fs.readFileSync('./ssl/key.pem', 'utf8');

var gp = require('globalpayments-api');
var config = new gp.ServicesConfig();
config.secretApiKey = "skapi_prod_MX4IAwCjbCoA4Q6S6alFIuETLHJfJFbxJbN6GtRW-Q";
config.developerId = "002914";
config.versionNumber = "3270";
config.serviceUrl = "https://api2.heartlandportico.com";
gp.ServicesContainer.configure(config);



var getDateTime = function(clean) {

  clean = clean || false;

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

  if (clean) {
    return year + month + day + "-" + hour + min;
  } else {
    return "[" + year + "/" + month + "/" + day + " " + hour + ":" + min + "]";
  }
};

var parseVirtualData = function(body, parsedLoc, method) {
  obj = {
    name : body.name,
    phone : body.phone,
    email : body.email,
    card : (body.number.substring(body.number.length - 4)),
    date : body.date,
    location : parsedLoc
  }

  if (method == 1) {
    obj.order_description = body['order_description'];
  } else if (method == 2) {
    var subtotal_calc = 0;
    var cart_items = [];
    var longest_item = 0;
    for (var i=1; i <= body['itemCount']; i++) {
      var item_length = body['item_name_' + i].split("<br>")[0].length;
      if (item_length > longest_item) {
        longest_item = item_length;
      }
    }
    var item_padding = longest_item + 6;
    var padded_item = "Item" + new Array(item_padding - 4).join(' ');
    var divider = new Array(item_padding + 28).join('=');
    for (var i=1; i <= body['itemCount']; i++) {
      item = {}
      sp = body['item_name_' + i].split("<br>");
      item['name'] = sp[0].replace(/&amp;/g, "&");
      if (sp.length > 1) {
        item['add'] = sp.slice(1,sp.length).join("\n");
      }
      //item['name'] = body['item_name_' + i];
      item['name'] = item['name'] + new Array(item_padding - item['name'].length).join(' ')
      item['price'] = "$" + parseFloat(body['item_price_' + i]).toFixed(2);
      item['price'] = item['price'] + new Array(11 - item['price'].length).join(' ')
      item['quantity'] = body['item_quantity_' + i];
      item['quantity'] = item['quantity'] + new Array(8 - item['quantity'].length).join(' ')
      total = parseFloat(body['item_price_' + i]) * parseFloat(body['item_quantity_' + i]);
      item['total'] = "$" + total.toFixed(2);
      cart_items.push(item);
      subtotal_calc += total;
    }
    obj.item_header = padded_item;
    obj.divider = divider;
    obj.items = cart_items;
    obj.special_request = body['special_request'];
    obj.subtotal = ("$" + subtotal_calc.toFixed(2)),
    obj.tax = ("$" + parseFloat(body.tax).toFixed(2)),
    obj.shipping = ("$" + parseFloat(body.shipping).toFixed(2)),
    obj.total = ("$" + (subtotal_calc + parseFloat(body.tax) + parseFloat(body.shipping)).toFixed(2))
  }
  return obj;
}

var generateCateringHTML = function(session, cart, rawNumber) {
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
    item['name'] = cart['item_name_' + i].replace(/&amp;/g, "&");
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
  var delivery_fee = 12.00;
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
    gratuity : ("$" + parseFloat(cart.gratuity).toFixed(2)),
    delivery_fee : ("$" + delivery_fee.toFixed(2)),
    total : ("$" + (subtotal_calc + parseFloat(cart.tax) + parseFloat(cart.gratuity) + delivery_fee).toFixed(2))
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


var sendEmailVirtual = function(customer_txt, our_txt, req, res, is_test) {
  var body = req.body;
  var file_name = "virtual-invoices/" + (req.session.User.email.split("@")[0] + "-" + getDateTime(true)) + ".html";
  fs.writeFileSync(file_name, customer_txt);

  var pre = '';
  if (is_test) {
      pre = '***** TEST ORDER ***** '
  }

  console.log(req.session.User.email);

  var customer_email_params = {
    Destination: {
      ToAddresses: [
        req.session.User.email
      ]
    },
    Message: {
      Body: {
        /*
        Html: {
          Data: txt
        },
        */
        Text: {
          Data: customer_txt
        }
      },
      Subject: {
        Data: (pre + 'Your Virtual Cafe Order')
      }
    },
    Source: 'orders@davidanddads.com',
    ReplyToAddresses: [ 'catering@davidanddads.com' ]
  };
  var our_email_params = {
    Destination: {
      ToAddresses: [
        'catering@davidanddads.com',
      ]
    },
    Message: {
      Body: {
        /*
        Html: {
          Data: txt
        },
        */
        Text: {
          Data: our_txt
        }
      },
      Subject: {
        Data: (pre + 'Virtual Cafe Request from ' + req.session.User.name),
      }
    },
    Source: 'orders@davidanddads.com',
    ReplyToAddresses: [ req.session.User.email ]
  };

  ses.sendEmail(our_email_params, function(err, data) {
    if (err) {
      console.log(getDateTime() + " Failed to send virtual cafe email (to us) for " + req.session.User.email);
      console.log(err, err.stack);
      res.view('virtualcafe/failure', {
        type : 'email',
        err : err
      });
    } else {
      ses.sendEmail(customer_email_params, function(customer_err, data) {
        if (customer_err) {
          console.log(getDateTime() + " Failed to send virtual cafe email (to customer) for " + req.session.User.email + " (but we successfully sent the email to us!");
          console.log(customer_err, customer_err.stack);
          res.view('virtualcafe/failure', {
              type : 'email',
              err  : customer_err
          });
        } else {
          console.log(getDateTime() + " Successfully sent virtual cafe emails for "+ req.session.User.email);
          var log_entry = getDateTime() + " - " + body.name + ", " +
                        body.email + ", " + body.location + ", " + body.date + "\n";

          fs.appendFileSync('virtual-invoices/recent_virtual_orders.txt',log_entry);
          res.view('virtualcafe/success');
          delete req.session.foodComplete;
          delete req.session.paymentMethod;
          delete req.session.card;
          delete req.session.delivery;
          delete req.session.User.specialRequest;
        }
      });
    }
  });

}



var sendEmailCatering = function(txt, req, res) {

  var file_name = "invoices/" + (req.session.User.email.split("@")[0] + "-" + getDateTime(true)) + ".html"

  fs.writeFile(file_name, txt, function(err) {
      if (err) {
          return console.log(err);
      }
  });

  var params = {
    Destination: {
      ToAddresses: [
        'catering@davidanddads.com',
      ]
    },
    Message: {
      Body: {
        /*
        Html: {
          Data: txt
        },
        */
        Text: {
          Data: txt
        }
      },
      Subject: {
        Data: ('Order Request from ' + req.session.User.name),
      }
    },
    Source: 'orders@davidanddads.com',
    ReplyToAddresses: [ req.session.User.email ]
  };

  ses.sendEmail(params, function(err, data) {
    if (err) {
      console.log(getDateTime() + " Failed to send catering email for " + req.session.User.email);
      console.log(err, err.stack);
      res.view('catering/confirm/failure', {
          type : 'email',
          err: err
      });
    } else {
      console.log(getDateTime() + " Successfully sent catering email for "+ req.session.User.email);
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

var updateUser = function(req, token, shouldSaveCard) {
    user = req.session.User;
    body = req.body;

    if (!('phone' in user)) {
      user.phone = body.phone;
    }
    user.virtualName = body.name;
    user.virtualEmail = body.email;
    user.virtualPhone = body.phone;

    if (shouldSaveCard) {
        newCard = {
            lastFour : body.number.substring(body.number.length - 4),
            name : body.card_name,
            zip : body.zip,
            expiry : body.expiry,
            addr : body.address,
            brand : body.brand,
            token: token,
        }
        if ('savedPayment' in user) {
          var found = false;
          for (var i=0; i<user.savedPayment.length; i++) {
            if (newCard.lastFour === user.savedPayment[i].lastFour) {
              user.savedPayment[i] = newCard;
              found = true;
            }
          }
          if (!found) {
            user.savedPayment.push(newCard);
          }
        } else {
          user.savedPayment = [newCard];
        }
    }
    User.update(user.id, user, function userUpdate (err) {
      if (err) {
        console.log("Error updating user after submitting virtual order (new card).");
        console.log(err);
      }
    });
    return user;

}

/*
var updateUser = function(req, saveCard) {
  user = req.session.User;
  body = req.body;
  if (!('phone' in user)) {
    user.phone = body.phone;
  }
  user.virtualName = body.name;
  user.virtualEmail = body.email;
  user.virtualPhone = body.phone;

  newCard = {
    lastFour : body.number.substring(body.number.length - 4),
    number : null,
    name : body.card_name,
    expiry : body.expiry,
    cvc : body.cvc,
    zip : body.zip,
  }
  if (newCard) {
    if ('savedPayment' in user) {
      var found = false;
      for (var i=0; i<user.savedPayment.length; i++) {
        if (newCard.lastFour === user.savedPayment[i].lastFour) {
          found = true;
        }
      }
      if (!found) {
        user.savedPayment.push(newCard);
      }
    } else {
      user.savedPayment = [newCard];
    }
  }

  if (body.number.indexOf('•') < 0) {
    triplesec.encrypt({
      data  : new triplesec.Buffer(body.number),
      key : new triplesec.Buffer(privKey),
      progress_hook : function (obj) {}
    }, function(err, buff){
      if (! err) {
        var ciphertext = buff.toString('hex');
        user.savedPayment[user.savedPayment.length - 1].number = ciphertext;
        User.update(user.id, user, function userUpdate (err) {
          if (err) {
            console.log("Error updating user after submitting virtual order (new card).");
            console.log(err);
          }
        });
      } else {
        console.log("Error encrypting card for " + body.card_name);
      }
    });
  } else {
			User.update(user.id, user, function userUpdate (err) {
				if (err) {
					console.log("Error updating user after submitting virtual order (no new card).");
					console.log(err);
				}
			});
	}

  return user;
}
*/

var submitVirtualOrder = function(req, res, parsedLoc, delivery) {
    var catcher = function(err) {
        console.log(err);
        res.view('virtualcafe/failure', {
            type: 'unknown',
        });
    };

    if (delivery) {
        customer_template = swig.compileFile('./emails/delivery-customer-copy.txt');
        our_template = swig.compileFile('./emails/delivery-invoice.txt');
        method = 2;
    } else {
        if ('order_description' in req.body && req.body['order_description'] !== "") {
          customer_template = swig.compileFile('./emails/virtual-customer-copy-m1.txt')
          our_template = swig.compileFile('./emails/virtual-invoice-m1.txt');
          method = 1;
        } else {
          customer_template = swig.compileFile('./emails/virtual-customer-copy-m2.txt');
          our_template = swig.compileFile('./emails/virtual-invoice-m2.txt');
          method = 2;
        }

    }

    obj = parseVirtualData(req.body, parsedLoc, method);
    customer_html = customer_template(obj);
    our_html = our_template(obj);

    obj_total = obj.total.split("$")[1];
    charge_amt = parseFloat(obj_total);

    if ('hps_token' in req.body) {
        var card = new gp.CreditCardData();
        card.token = req.body.hps_token;
        var addr = new gp.Address();
        addr.postalCode = req.body.zip;
        if(req.body.zip === '00000') {
            console.log("TEST REQUEST");
            console.log(req);
            sendEmailVirtual(customer_html, our_html, req, res, true);
            return;
        }
        if ('address' in req.body) {
            addr.streetAddress1 = req.body.address;
        }
        var shouldSaveCard = ('save_card' in req.body && req.body.save_card === "on");
        var charge_resp = card.charge(charge_amt.toString())
            .withCurrency("USD")
            .withAddress(addr)
            .withRequestMultiUseToken(shouldSaveCard)
            .execute();
        charge_resp.then(function(resp) {
            chargeSuccess = (resp.responseCode === '00');
            updateUser(req, resp.token, shouldSaveCard && chargeSuccess);
            if (chargeSuccess) {
                console.log("Success!");
                sendEmailVirtual(customer_html, our_html, req, res, false);
            } else {
                console.log(resp.responseMessage);
                res.view('virtualcafe/failure', {
                    type : 'card',
                    err  : resp.responseMessage,
                    code : resp.responseCode,
                    cvn  : resp.cvnResponseCode,
                    ref  : resp.referenceNumber,
                    tid  : resp.transactionReference.transactionId
                });
            }
        })
        .catch(catcher);
    } else if ('_savedIndex' in req.body) {
        var saved_index = parseInt(req.body._savedIndex);
        var saved_card = req.session.User.savedPayment[saved_index];
        if (req.body.card_name != saved_card.name) {
            console.log("UH OH: card name doesn't match!");
        }
        if (req.body.zip != saved_card.zip) {
            console.log("UH OH: zip doesn't match!");
        }
        if(req.body.zip === '00000' || saved_card.zip === '00000') {
            sendEmailVirtual(customer_html, our_html, req, res, true);
            return;
        }
        if (req.body.expiry != saved_card.expiry) {
            console.log("UH OH: expiry doesn't match!");
        }
        if (req.body.number.slice(-4) != saved_card.lastFour) {
            console.log("UH OH: number doesn't match!");
        }
        var card = new gp.CreditCardData();
        card.token = saved_card.token;
        var addr = new gp.Address();
        addr.postalCode = saved_card.zip;
        if ('address' in req.body) {
            addr.streetAddress1 = req.body.address;
        }
        
        var charge_resp = card.charge(charge_amt.toString())
            .withCurrency("USD")
            .withAddress(addr)
            .execute();
        charge_resp.then(function(resp) {
            updated = updateUser(req, 0, false);
            req.session.User = updated;
            if (resp.responseCode === '00') {
                console.log("Success!")
                sendEmailVirtual(customer_html, our_html, req, res, false);
            } else {
                console.log(resp.responseMessage);
                res.view('virtualcafe/failure', {
                    type : 'card',
                    err  : resp.responseMessage,
                    code : resp.responseCode,
                    cvn  : resp.cvnResponseCode,
                    ref  : resp.referenceNumber,
                    tid  : resp.transactionReference.transactionId
                });
            }
        })
        .catch(catcher);
    } else {
        console.log("No new or saved card, cannot complete order");
        res.view('virtualcafe/failure', {
            type : 'unknown'
        });
    }


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

  'maintenance' : function(req, res) {
    res.view('catering/maintenance');
  },

  'submit' : function(req,res) {
    var rawNumber = null;

    if (req.body.isCatering === "true") { // sanity check
      html = generateCateringHTML(req.session, req.params.all(), rawNumber);
      sendEmailCatering(html, req, res);
    }
  },

  'submitVirtual' : function(req,res) {
    var catcher = function(err) {
        console.log(err);
        res.view('virtualcafe/failure', {
            type: 'unknown',
        });
    };

    try {
        if (req.body.isCatering === "false") { // sanity check

          updated_user = updateUser(req, (req.body.save_card != null && req.body.save_card === "on"));
          req.session.User = updated_user;

          if (req.body.location.indexOf('delivery') == 0) {
              destIdx = parseInt(req.body.location.split("-")[1]);
              dest = req.session.User.savedVirtualDelivery[destIdx];
              submitVirtualOrder(req, res, dest, true);
          } else if (req.body.location.indexOf('takeout') == 0) { 
              parsedLoc = {
                  takeout : true
              };
              submitVirtualOrder(req, res, parsedLoc, false);
          } else {
              Locations.findOne({'name' : req.body.location}, function foundLocation (err, loc) {
                  if(err) {
                      catcher(err);
                  } else {
                      parsedLoc = {
                        building_name : loc.name,
                        contact_name : loc.contact.name,
                        contact_email : loc.contact.email,
                        time : loc.time,
                        takeout : false,
                      };
                      submitVirtualOrder(req, res, parsedLoc, false);
                  }
              });
          }
        } else {
            catcher("submitVirtual got isCatering == true!");
        }
    } catch (err) {
        console.log("ERROR failed to submit order");
        console.log(err);
        console.log(req.body)
        res.view('virtualcafe/failure', {
            type : 'unknown'
        });
    }
  }
};
