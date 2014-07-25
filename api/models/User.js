/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	firstName : {
  		type : 'string',
  		required : true
  	},

    lastName : {
      type : 'string',
      required : true
    },

    companyName : {
      type : 'string',
      required : true
    },

  	email : {
  		type : 'string',
  		email : true,
  		required : true,
  		unique : true
  	},

    phone : {
      type : 'string',
      required : true
    },

  	encryptedPassword : {
  		type : 'string'
  	},

    admin : {
      type : 'boolean'
    },

    toJSON : function() {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj
    }    
  },

  beforeCreate : function (formParams, next) {
    formParams.admin = false;
    formParams.savedDelivery = [];
    formParams.savedPayment = [];
    // This is already checked by semantic-ui validator, can probably remove later
    if (!formParams.password || formParams.password != formParams.confirm) {
      return next({err: ["Password doesn't match password confirmation."]});
    }

    require('bcrypt').hash(formParams.password, 5, function encryptionFinishsed(err, encryptedPassword) {
      if (err) return next(err);

      formParams.encryptedPassword = encryptedPassword;
      next();
    });
  }

};
