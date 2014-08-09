/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

 module.exports = {

 	attributes: {

 		name : {
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

 		if('createAdmin' in formParams) {
			require('bcrypt').hash(formParams.password, 5, function encryptionFinishsed(err, encryptedPassword) {
				if (err) return next(err);
				formParams.encryptedPassword = encryptedPassword;
	    			next();
	    		});
		} else {
			next();
		}
  }

};
