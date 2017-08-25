/**
 * PageController
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

    editHomeMessage: function(req, res, next) {
      Page.findOne({"page":"home"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('admin/edit-home', {
            layout: 'admin/layout',
            message : message
        });

      });
    },

    setHomeMessage: function(req, res, next) {
      Page.findOne({"page":"home"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            var new_page = {page:"home",message:req.body.message};
            Page.create(new_page, function pageCreated(err, page) {
                if (err) {
                    req.session.flash = {
                        err : err
                    };
                    return res.redirect('/admin/messages/home');
                }
                req.session.flash = {
                    success : 'Home page message saved successfully.'
                };
                return res.redirect('/admin/messages/home');
            });
        } else {

            page.message = req.body.message;
            Page.update({"page":"home"}, page, function pageUpdated(err) {
                if (err) {
                    req.session.flash = {
                        err : err
                    }
                    return res.redirect('/admin/messages/home');
                }
                 req.session.flash = {
                    success : 'Home page message saved successfully.'
                }
                return res.redirect('/admin/messages/home');
            });
        }
      });
    },

    editJobs: function(req, res, next) {
      Page.findOne({"page":"jobs"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('admin/edit-jobs', {
            layout: 'admin/layout',
            content : message
        });

      });
    },

    setJobs: function(req, res, next) {
      Page.findOne({"page":"jobs"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            var new_page = {page:"jobs",message:req.body.message};
            Page.create(new_page, function pageCreated(err, page) {
                if (err) {
                    req.session.flash = {
                        err : err
                    };
                    return res.redirect('/admin/messages/jobs');
                }
                req.session.flash = {
                    success : 'Jobs page content saved successfully.'
                };
                return res.redirect('/admin/messages/jobs');
            });
        } else {

            page.message = req.body.message;
            Page.update({"page":"jobs"}, page, function pageUpdated(err) {
                if (err) {
                    req.session.flash = {
                        err : err
                    }
                    return res.redirect('/admin/messages/jobs');
                }
                 req.session.flash = {
                    success : 'Jobs page content saved successfully.'
                }
                return res.redirect('/admin/messages/jobs');
            });
        }
      });
    },

    editContact: function(req, res, next) {
      Page.findOne({"page":"contact"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('admin/edit-contact', {
            layout: 'admin/layout',
            content : message
        });

      });
    },

    setContact: function(req, res, next) {
      Page.findOne({"page":"contact"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            var new_page = {page:"contact",message:req.body.message};
            Page.create(new_page, function pageCreated(err, page) {
                if (err) {
                    req.session.flash = {
                        err : err
                    };
                    return res.redirect('/admin/messages/contact');
                }
                req.session.flash = {
                    success : 'Contaact page content saved successfully.'
                };
                return res.redirect('/admin/messages/contact');
            });
        } else {

            page.message = req.body.message;
            Page.update({"page":"contact"}, page, function pageUpdated(err) {
                if (err) {
                    req.session.flash = {
                        err : err
                    }
                    return res.redirect('/admin/messages/contact');
                }
                 req.session.flash = {
                    success : 'Contaact page content saved successfully.'
                }
                return res.redirect('/admin/messages/contact');
            });
        }
      });
    },

    editpolicy: function(req, res, next) {
      Page.findOne({"page":"policy"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('admin/edit-policy', {
            layout: 'admin/layout',
            content : message
        });

      });
    },

    setpolicy: function(req, res, next) {
      Page.findOne({"page":"policy"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            var new_page = {page:"policy",message:req.body.message};
            Page.create(new_page, function pageCreated(err, page) {
                if (err) {
                    req.session.flash = {
                        err : err
                    };
                    return res.redirect('/admin/messages/policy');
                }
                req.session.flash = {
                    success : 'Policy page content saved successfully.'
                };
                return res.redirect('/admin/messages/policy');
            });
        } else {

            page.message = req.body.message;
            Page.update({"page":"policy"}, page, function pageUpdated(err) {
                if (err) {
                    req.session.flash = {
                        err : err
                    }
                    return res.redirect('/admin/messages/policy');
                }
                 req.session.flash = {
                    success : 'Policy page content saved successfully.'
                }
                return res.redirect('/admin/messages/policy');
            });
        }
      });
    },

    editPress: function(req, res, next) {
      Page.findOne({"page":"press"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('admin/edit-press', {
            layout: 'admin/layout',
            content : message
        });

      });
    },

    setPress: function(req, res, next) {
      Page.findOne({"page":"press"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            var new_page = {page:"press",message:req.body.message};
            Page.create(new_page, function pageCreated(err, page) {
                if (err) {
                    req.session.flash = {
                        err : err
                    };
                    return res.redirect('/admin/messages/press');
                }
                req.session.flash = {
                    success : 'Press page content saved successfully.'
                };
                return res.redirect('/admin/messages/press');
            });
        } else {

            page.message = req.body.message;
            Page.update({"page":"press"}, page, function pageUpdated(err) {
                if (err) {
                    req.session.flash = {
                        err : err
                    }
                    return res.redirect('/admin/messages/press');
                }
                 req.session.flash = {
                    success : 'Press page content saved successfully.'
                }
                return res.redirect('/admin/messages/press');
            });
        }
      });
    },

    editNews: function(req, res, next) {
      Page.findOne({"page":"news"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            message = '';
        } else {
            message = page.message;
        }

        res.view('admin/edit-news', {
            layout: 'admin/layout',
            content : message
        });

      });
    },

    setNews: function(req, res, next) {
      Page.findOne({"page":"news"}, function (err, page) {
        if (err) return next(err);
        if (!page) {
            var new_page = {page:"news",message:req.body.message};
            Page.create(new_page, function pageCreated(err, page) {
                if (err) {
                    req.session.flash = {
                        err : err
                    };
                    return res.redirect('/admin/messages/news');
                }
                req.session.flash = {
                    success : 'News page content saved successfully.'
                };
                return res.redirect('/admin/messages/news');
            });
        } else {

            page.message = req.body.message;
            Page.update({"page":"news"}, page, function pageUpdated(err) {
                if (err) {
                    req.session.flash = {
                        err : err
                    }
                    return res.redirect('/admin/messages/news');
                }
                 req.session.flash = {
                    success : 'News page content saved successfully.'
                }
                return res.redirect('/admin/messages/news');
            });
        }
      });
    }
};
