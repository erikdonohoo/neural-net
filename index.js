var utils = require('./commands');
var _ = require('lodash');

var runs = 10;

function feedForward(connections) {

	connections.forEach(function (connection) {
		var neuron = connection.lower;
		neuron.output = neuron.feedForward();
		if (neuron.next.length) {
			neuron.next.forEach(function (con) {
				con.value = neuron.output * con.weight;
			});
		}
	});

	if (connections[0].lower.next.length) {
		feedForward(connections[0].lower.next);
	}
}

function propBack(connections, options) {
	connections.forEach(function (connection) {
		var neuron = connection.upper;
		// Discover this neurons error
		neuron.error = neuron.propBack();
		if (neuron.prev.length) {
			neuron.prev.forEach(function (con) {
				con.weight = con.weight + (options.learning * neuron.error * connection.upper.output);
			});
		}
	});

	if (connections[0].upper.prev.length) {
		propBack(connections[0].upper.prev, options);
	}
}

function runNetwork(network, trainingSet, options) {
	trainingSet.forEach(function (item) {
		network.roots.forEach(function (neuron) {
			// Find this neurons value
			neuron.output = neuron.getValue(item);
			neuron.next.forEach(function (connection) {
				connection.value = neuron.output * connection.weight;
			});
		});
		feedForward(network.roots[0].next);

		var errs = [];
		network.ends.forEach(function (neuron) {
			var target = options.classes[item[options.class]] === neuron.value ? 1 : 0;
			errs.push(target - neuron.output);
			neuron.error = (target - neuron.output) * (1 - neuron.output) * neuron.output;
			neuron.prev.forEach(function (connection) {
				connection.weight = connection.weight + (options.learning * neuron.error * connection.upper.output);
			});
		});
		// console.log('\nerr: ', errs.reduce(function (prev, cur) { return prev + cur; }, 0)/errs.length, '%');
		propBack(network.ends[0].prev, options);
	});
}

function predict(network, item, options) {
	network.roots.forEach(function (neuron) {
		neuron.output = neuron.getValue(item);
		neuron.next.forEach(function (connection) {
			connection.value = neuron.output * connection.weight;
		});
	});
	feedForward(network.roots[0].next);

	// Which end has highest activation
	var neuron = _.max(network.ends, function (neuron) {
		return neuron.output;
	});

	return neuron.value === options.classes[item[options.class]];
}

// Get command line options;
utils.readInput(function (options) {
	var network = utils.createNetwork(options);

	// Split into training portion
	var data = _.shuffle(options.data);
	var trainingCutIndex = Math.floor(options.train * options.data.length);
	var training = data.slice(0, trainingCutIndex);
	var testing = data.slice(trainingCutIndex);

	// Run training x times
	for (var i = 0; i < 1000; i++) {
		runNetwork(network, training, options);
	}

	// Take guesses with testing
	var correct = 0;
	testing.forEach(function (item) {
		correct = predict(network, item, options) ? correct + 1 : correct;
	});

	console.log(correct/testing.length, '%');
});
