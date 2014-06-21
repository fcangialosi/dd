/**
 * Menu
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	
  	section : {
  		type : 'string',
  		required : true
  	},

    description : {
    	type : 'string',
    	required : true
    },

    items : {
    	type : 'array',
    	required : true
    },

    breakfast : { // if false, then lunch
    	type : 'boolean',
    	required : true
    },

    menu : { // main, catering, or express
    	type : 'string',
    	required : true
    }
  	
  }
};
