// Properties
// type: root, output, hidden
// output: what was sent to another neuron
// next/prev connections: list (other neuron, weight of connection)
// error: my error
// value: feature or class value (root/output nodes only)
// depth: how deep a neuron is
// weight: the weight the node under me uses
// parentValues: values from nodes attached to me upstream that are feeding forward

function Neuron (type, value) {

	this.type = type;
	this.value = value;
	this.next = [];
	this.prev = [];
	this.error = 0;
	this.depth = 0;
}

Neuron.prototype.getValue = function (item) {
	// Given a data item, what is this neurons value
	if (this.type === Neuron.types.ROOT) {
		return item[this.value];
	}

	throw new Error("cant get value from non-root neuron");
};

Neuron.prototype.feedForward = function () {
	var value = this.prev.reduce(function (prevValue, curConnection) {
		return prevValue + curConnection.value;
	}, 0);

	return 1 / (1 + Math.pow(Math.E, (-1 * value)));
};

Neuron.prototype.propBack = function () {
	var myBad = this.output * (1 - this.output);
	return myBad * this.next.reduce(function (valueSoFar, curConnection) {
		return valueSoFar + (curConnection.lower.error * curConnection.weight); // TODO Maybe need to use weight before change
	}, 0);
};

Neuron.types = {
	ROOT: 'root',
	OUTPUT: 'output',
	HIDDEN: 'hidden'
};

module.exports = Neuron;
