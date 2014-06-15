/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

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

  	encryptedPassword: {
  		type : 'string',
      required : true
  	},

    toJSON : function(){
      var obj = this.toObject();
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj
    }
    
  }

};
