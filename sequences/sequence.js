// parse a deal
function Sequence(str) {
	this.expr = parseExpression(
		{
			str: str,
			i: 0 // start at the beginning
		},
		false // this isn't a sub-deal
	);
}

// turn a parsed deal into a machine
Sequence.prototype.build = function () {
	this.machine = buildMachine(this.expr);
	this.reset();
}

// prepare to generate sequence terms
Sequence.prototype.reset = function () {
	this.current = this.machine.input;
}

// generate a single sequence term
Sequence.prototype.next = function () {
	var number = matrixProduct(this.current, this.machine.output)[0][0];

	this.current = matrixProduct(this.current, this.machine.jump);
	return number;
}

// turn a machine into a deal
Sequence.prototype.identify = function () {
	return identifyExpression(this.machine.expr);
}
