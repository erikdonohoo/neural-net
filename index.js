var utils = require('./commands');
var _ = require('lodash');

var runs = 10;

function feedForward(connections) {
	connections.forEach(function (connection) {
		var neuron = connection.neuron;
		neuron.output = neuron.parentValues.reduce(function (sum, cur) {
			return sum + cur;
		}, 0) / neuron.parentValues.length;
		neuron.output *= neuron.weight;
		neuron.next.forEach(function (connection) {
			connection.neuron.parentValues.push(neuron.output);
		});
	});

	if (connections[0].neuron.next.length) {
		feedForward(connections[0].neuron.next);
	} else {
		connections[0].neuron.next.forEach(function (connection) {
			connection.neuron.output = connection.neuron.parentValues.reduce(function (sum, cur) {
				return sum + cur;
			}, 0) / connection.neuron.parentValues.length;
		});
	}
}
function runNetwork(network, trainingSet) {
	//trainingSet.forEach(function (item) {
		network.roots.forEach(function (neuron) {
			// Find this neurons value
			var value = neuron.getValue(trainingSet[0]);
			var myWeightedValue = neuron.output = neuron.feedForward(value);
			neuron.next.forEach(function (connection) {
				connection.neuron.parentValues.push(myWeightedValue);
			});
		});
		feedForward(network.roots[0].next);
	//});
}

// Get command line options;
utils.readInput(function (options) {
	var network = utils.createNetwork(options);

	// Split into training portion
	var data = _.shuffle(options.data);
	var trainingCutIndex = Math.floor(options.train * options.data.length);
	var training = data.slice(0, trainingCutIndex);
	var testing = data.slice(trainingCutIndex);

	runNetwork(network, training);

	console.log(network.ends);
});
