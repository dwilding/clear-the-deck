/*
buildMachine() takes a parsed deal array and produces a finite-state machine
object. The machine object looks like this:

{
	states: Number,
	input: Matrix,
	output: Matrix,
	jump: Matrix,
	expr: [..., {
		coeff: Number,
		factors: [Number] | [Array, Array] | [Array]
	}, ...]
}

expr represents the way the machine was built so that it can be identified
later. In factors, [Number] represents a characteristic machine, [Array, Array]
represents an application of buildProduct() and [Array] represents an
application of buildRepeat().
*/
function buildMachine(expr) {
	var i, j, k, factors, factor, term, optional,
	// the empty sum is the zero machine
	machine = zeroMachine;

	// for each summand
	for (i = 0; i < expr.length; i++) {
		// the empty product is the characteristic machine of 0
		factors = charMachine(0);
		// for each factor
		for (j = 0; j < expr[i].factors.length; j++) {
			// if the term is a sub-deal
			if (typeof expr[i].factors[j].term == 'object') {
				// recursively build
				term = buildMachine(expr[i].factors[j].term);
			}
			// if the term is a number
			else {
				term = charMachine(expr[i].factors[j].term);
			}
			// the 0th power of term is the characteristic machine of 0
			factor = charMachine(0);
			// start with the (from)th power of term
			for (k = 0; k < expr[i].factors[j].from; k++) {
				factor = buildProduct(factor, term);
			}
			if (expr[i].factors[j].to == null) {
				// then carry on to the ?th power of term
				optional = buildRepeat(term);
			}
			else {
				// or carry on to the (to)th power of term
				optional = charMachine(0);
				for (; k < expr[i].factors[j].to; k++) {
					optional = buildSum(
						buildProduct(optional, term),
						charMachine(0)
					);
				}
			}
			// include this factor in the product
			factors = buildProduct(
				factors,
				buildProduct(factor, optional)
			);
		}
		// include these factors in the sum
		machine = buildSum(
			machine,
			buildScale(expr[i].coeff, factors)
		);
	}
	return machine;
}

function buildSum(left, right) {
	var machine;

	if (isZeroMachine(left)) {
		// any sum with the zero machine does nothing
		machine = right;
	}
	else if (isZeroMachine(right)) {
		// any sum with the zero machine does nothing
		machine = left;
	}
	else {
		machine = machineSum(left, right);
		machine.expr = left.expr.concat(right.expr);
	}
	return machine;
}

function buildProduct(left, right) {
	var machine;

	if (isZeroMachine(left) || isZeroMachine(right)) {
		// any product with the zero machine produces the zero machine
		machine = zeroMachine;
	}
	else if (isCharMachine0(left)) {
		// any product with the characteristic machine of 0 does nothing
		machine = right;
	}
	else if (isCharMachine0(right)) {
		// any product with the characteristic machine of 0 does nothing
		machine = left;
	}
	else {
		machine = machineProduct(left, right);
		machine.expr = [{
			coeff: 1,
			factors: [left.expr, right.expr]
		}];
	}
	return machine;
}

function buildRepeat(left) {
	var machine;

	if (isZeroMachine(left)) {
		// repeating the zero machine produces the characteristic machine of 0
		machine = charMachine(0);
	}
	else {
		machine = machineRepeat(left);
		machine.expr = [{
			coeff: 1,
			factors: [left.expr]
		}];
	}
	return machine;
}

function buildScale(number, right) {
	var i, machine;

	if (number == 0) {
		// scaling by 0 produces the zero machine
		machine = zeroMachine;
	}
	else {
		machine = right;
		// scale the machine if necessary
		if (number > 1) {
			machine.output = matrixProduct(machine.output, [[number]]);
			for (i = 0; i < machine.expr.length; i++) {
				machine.expr[i].coeff *= number;
			}
		}
	}
	return machine;
}
