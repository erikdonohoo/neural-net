var utils = require('./commands');

var runs = 10;

// Get command line options;
utils.readInput(function (options) {
	var network = utils.createNetwork(options);
	console.log(network);
});
