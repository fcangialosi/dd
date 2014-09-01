// Start sails and pass it command line arguments
// require('sails').lift(require('optimist').argv);

var config = sails.util.merge(require('optimist').argv,{
  hooks: {
    sockets: false,
    pubsub: false
  }
});
require('sails').lift(config);