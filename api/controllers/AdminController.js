/**
 * AdminController
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

var jobs_message = '';
var contact_message = '';

module.exports = {

  index: function (req, res, next) {
     res.view('admin/index', {layout: 'admin/layout'});
  },

  signin: function(req,res,next) {
    res.view('admin/signin', {layout: 'admin/empty-layout'});
  },

  create: function(req,res,next) {
    res.view('admin/create', {layout: 'admin/empty-layout'});
  },

  messages: function(req, res, next) {
    res.view('admin/messages', {layout: 'admin/layout'});
  },

  editJobs: function(req, res, next) {
    res.view('admin/edit-jobs', {layout: 'admin/layout'});
  },

  editNews: function(req, res, next) {
    res.view('admin/edit-news', {layout: 'admin/layout'});
  },

  editContact: function(req, res, next) {
    res.view('admin/edit-contact', {layout: 'admin/layout'});
  }

};
