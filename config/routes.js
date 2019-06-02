/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */



/**
 * (1) Core middleware
 *
 * Middleware included with `app.use` is run first, before the router
 */


/**
 * (2) Static routes
 *
 * This object routes static URLs to handler functions--
 * In most cases, these functions are actions inside of your controllers.
 * For convenience, you can also connect routes directly to views or external URLs.
 *
 */

module.exports.routes = {

  // By default, your root route (aka home page) points to a view
  // located at `views/home/index.ejs`
  //
  // (This would also work if you had a file at: `/views/home.ejs`)
  // '/': {
  //   view: 'home/index'
  // },

  // '/test' : 'MenuController.test',

  '/': 'HomeController.index',

	'/test' : 'HomeController.indexTest',

	'/virtualcafe' : 'VirtualCafeController.index',

  'get /virtualcafe/order' : 'VirtualCafeController.orderFormPublic',

  'get /virtualcafe/order/beta' : 'VirtualCafeController.orderFormBeta',

  '/virtualcafe/submit' : 'OrderController.submitVirtual',

	'get /virtualcafe/subscribe' : 'VirtualCafeController.subscribe',

	'get /virtualcafe/edit-cards' : 'VirtualCafeController.editCards',

  'post /admin/virtual/edit/:id' : 'MenuController.editCustom',

  'post /feedback' : 'HomeController.feedback',

	'post /bug' : 'HomeController.bug',

  '/news' : 'HomeController.news',

  '/contact' : 'HomeController.contact',

  '/policy' : 'HomeController.policy',

  '/jobs' : 'HomeController.jobs',

  '/press' : 'HomeController.press',

  '/main' : 'HomeController.main',

  '/main/menu' : 'MenuController.displayMainMenu',

  '/main/specials' : 'SpecialsController.displayCharlesSpecials',

  '/catering' : {
    view: 'catering/index'
  },

  '/catering/menu' : 'MenuController.displayCateringMenu',

  '/catering/menu/print' : 'MenuController.printCateringMenu',

  '/express' : 'SpecialsController.todaysSpecials',

  '/express/menu' : 'MenuController.displayExpressMenu',

  '/express/fayette/specials' : 'SpecialsController.displayFayetteSpecials',

  '/express/pratt/specials' : 'SpecialsController.displayPrattSpecials',

  '/express/broadway/specials' : 'SpecialsController.displayBroadwaySpecials',

  /*
  '/catering/order/*' : 'OrderController.maintenance',
  */

  '/catering/order/start' : 'OrderController.start',

  '/catering/order/reminder' : 'OrderController.reminder',

  '/catering/order/delivery' : 'OrderController.selectDelivery',

  'get /catering/order/delivery/new' : 'OrderController.newDelivery',

  'post /catering/order/delivery/save' : 'SessionController.saveDelivery',

  '/catering/order/menu' : 'MenuController.displayOrderingMenu',

  '/catering/order/payment' : 'OrderController.selectPayment',

  'get /catering/order/payment/continue' : 'OrderController.continue',

  'get /catering/order/payment/new' : 'OrderController.newCard',

  'post /catering/order/payment/save' : 'SessionController.saveCard',

  '/catering/order/review' : 'OrderController.review',

  'post /catering/order/submit' : 'OrderController.submit',

  'post /catering/order/saveSpecialRequest' : 'OrderController.saveSpecialRequest',

  '/admin/new' : 'AdminController.newAdmin',

  '/admin/menu' : 'MenuController.index',

  '/menu/reorderMenu' : 'MenuController.reorderMenu',

  '/menu/reorderSections' : 'MenuController.reorderSections',

  '/admin/main' : 'MenuController.adminMain',

  '/admin/catering' : 'MenuController.adminCatering',

  '/admin/express' : 'MenuController.adminExpress',

  '/admin/virtual' : 'MenuController.adminVirtual',

  '/admin/specials' : 'SpecialsController.index',

  '/admin/specials/charles' : 'SpecialsController.charles',

  '/admin/specials/fayette' : 'SpecialsController.fayette',

  '/admin/specials/pratt' : 'SpecialsController.pratt',

  '/admin/specials/broadway' : 'SpecialsController.broadway',

  '/admin/messages' : 'AdminController.messages',

  'get /admin/messages/home' : 'PageController.editHomeMessage',

  'get /admin/messages/jobs' : 'PageController.editJobs',

  'get /admin/messages/press' : 'PageController.editPress',

  'get /admin/messages/news' : 'PageController.editNews',

  'get /admin/messages/contact' : 'PageController.editContact',

  'get /admin/messages/policy' : 'PageController.editPolicy',

  'post /admin/messages/home' : 'PageController.setHomeMessage',

  'post /admin/messages/jobs' : 'PageController.setJobs',

  'post /admin/messages/press' : 'PageController.setPress',

  'post /admin/messages/news' : 'PageController.setNews',

  'post /admin/messages/contact' : 'PageController.setContact',

  'post /admin/messages/policy' : 'PageController.setPolicy',

  'get /admin/lookup' : 'AdminController.lookup',

  'get /admin/lookup/:id' : 'AdminController.search',

  'get /admin/transactions' : 'AdminController.listTransactions',

  'post /admin/transactions/:action' : 'AdminController.editTransaction'


  /*
  // But what if you want your home page to display
  // a signup form located at `views/user/signup.ejs`?
  '/': {
    view: 'user/signup'
  }


  // Let's say you're building an email client, like Gmail
  // You might want your home route to serve an interface using custom logic.
  // In this scenario, you have a custom controller `MessageController`
  // with an `inbox` action.
  '/': 'MessageController.inbox'


  // Alternatively, you can use the more verbose syntax:
  '/': {
    controller: 'MessageController',
    action: 'inbox'
  }


  // If you decided to call your action `index` instead of `inbox`,
  // since the `index` action is the default, you can shortcut even further to:
  '/': 'MessageController'


  // Up until now, we haven't specified a specific HTTP method/verb
  // The routes above will apply to ALL verbs!
  // If you want to set up a route only for one in particular
  // (GET, POST, PUT, DELETE, etc.), just specify the verb before the path.
  // For example, if you have a `UserController` with a `signup` action,
  // and somewhere else, you're serving a signup form looks like:
  //
  //		<form action="/signup">
  //			<input name="username" type="text"/>
  //			<input name="password" type="password"/>
  //			<input type="submit"/>
  //		</form>

  // You would want to define the following route to handle your form:
  'post /signup': 'UserController.signup'


  // What about the ever-popular "vanity URLs" aka URL slugs?
  // (you might remember doing this with `mod_rewrite` in Apache)
  //
  // This is where you want to set up root-relative dynamic routes like:
  // http://yourwebsite.com/twinkletoez
  //
  // NOTE:
  // You'll still want to allow requests through to the static assets,
  // so we need to set up this route to ignore URLs that have a trailing ".":
  // (e.g. your javascript, CSS, and image files)
  'get /*(^.*)': 'UserController.profile'

  */
};



/**
 * (3) Action blueprints
 * These routes can be disabled by setting (in `config/controllers.js`):
 * `module.exports.controllers.blueprints.actions = false`
 *
 * All of your controllers ' actions are automatically bound to a route.  For example:
 *   + If you have a controller, `FooController`:
 *     + its action `bar` is accessible at `/foo/bar`
 *     + its action `index` is accessible at `/foo/index`, and also `/foo`
 */


/**
 * (4) Shortcut CRUD blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *			`module.exports.controllers.blueprints.shortcuts = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *		/foo/find/:id?	->	search lampshades using specified criteria or with id=:id
 *
 *		/foo/create		->	create a lampshade using specified values
 *
 *		/foo/update/:id	->	update the lampshade with id=:id
 *
 *		/foo/destroy/:id	->	delete lampshade with id=:id
 *
 */

/**
 * (5) REST blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *		`module.exports.controllers.blueprints.rest = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *
 *		get /foo/:id?	->	search lampshades using specified criteria or with id=:id
 *
 *		post /foo		-> create a lampshade using specified values
 *
 *		put /foo/:id	->	update the lampshade with id=:id
 *
 *		delete /foo/:id	->	delete lampshade with id=:id
 *
 */

/**
 * (6) Static assets
 *
 * Flat files in your `assets` directory- (these are sometimes referred to as 'public')
 * If you have an image file at `/assets/images/foo.jpg`, it will be made available
 * automatically via the route:  `/images/foo.jpg`
 *
 */



/**
 * (7) 404 (not found) handler
 *
 * Finally, if nothing else matched, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 */

