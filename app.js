// Start sails and pass it command line arguments
// require('sails').lift(require('optimist').argv);

require('sails').lift({
  hooks: {
    sockets: false,
    pubsub: false
  }
}, function doneLifting (err) { if (err) throw err; });
