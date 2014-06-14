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

  	password: {
  		type : 'string',
  		required : true
  	}
    
  }

};
