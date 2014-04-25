/*
Implements the sum of two finite-state machines.
*/
function machineSum(left, right) {
	var machine = {};

	machine.states = checkSize(left.states + right.states);
	machine.input = matrixConcat(left.input, right.input);
	machine.output = left.output.concat(right.output);
	machine.jump = matrixConcat(
		left.jump.concat(zeroMatrix(right.states, left.states)),
		zeroMatrix(left.states, right.states).concat(right.jump)
	);
	return machine;
}

/*
Implements the product of two finite-state machines.
*/
function machineProduct(left, right) {
	var machine = {};

	machine.states = checkSize(left.states + right.states);
	machine.input = matrixConcat(
		left.input,
		zeroMatrix(1, right.states)
	);
	machine.output = matrixProduct(
		left.output,
		matrixProduct(right.input, right.output)
	).concat(right.output);
	machine.jump = matrixConcat(
		left.jump.concat(zeroMatrix(right.states, left.states)),
		matrixProduct(
			left.output,
			matrixProduct(right.input, right.jump)
		).concat(right.jump)
	);
	return machine;
}

/*
Implements the Kleene * of a finite-state machine.
*/
function machineRepeat(left) {
	var jumpOutput,
	inputOutput = matrixProduct(left.input, left.output);
	machine = {};

	// the machine's sequence must begin with 0 for the Kleene * to make sense
	if (inputOutput != 0) {
		throw {
			type: 'repeatError',
			number: inputOutput
		}
	}
	machine.states = checkSize(left.states + 1);
	machine.input = zeroMatrix(1, machine.states);
	machine.input[0][0] = 1;
	machine.output = zeroMatrix(machine.states, 1);
	machine.output[0][0] = 1;
	jumpOutput = matrixProduct(left.jump, left.output);
	machine.jump = matrixConcat(
		matrixProduct(left.input, jumpOutput).concat(jumpOutput),
		matrixProduct(left.input, left.jump).concat(left.jump)
	);
	return machine;
}

/*
Implements the characteristic machine whose sequence is zero except for 1 at the
given term.
*/
function charMachine(number) {
	var i,
	machine = {};

	machine.states = checkSize(number + 1);
	machine.input = zeroMatrix(1, machine.states);
	machine.input[0][0] = 1;
	machine.output = zeroMatrix(machine.states, 1);
	machine.output[number][0] = 1;
	machine.jump = zeroMatrix(machine.states, machine.states);
	for (i = 0; i < number; i++) {
		machine.jump[i][i + 1] = 1;
	}
	machine.expr = [{
		coeff: 1,
		factors: [number]
	}];
	return machine;
}

/*
Test whether a machine is the characteristic machine of 0.
*/
function isCharMachine0(machine) {
	return (
		machine.expr.length == 1 &&
		machine.expr[0].coeff == 1 &&
		machine.expr[0].factors.length == 1 &&
		machine.expr[0].factors[0] == 0
	);
}

/*
The zero machine's sequence is zero everywhere.
*/
var zeroMachine = {
	states: 1,
	input: [[0]],
	output: [[0]],
	jump: [[0]],
	expr: [{
		coeff: 0,
		factors: [0]
	}]
}

/*
Test whether a machine is the zero machine.
*/
function isZeroMachine(machine) {
	return (
		machine.expr.length == 1 &&
		machine.expr[0].coeff == 0
	);
}

/*
Through (limited) testing I've determined that machines with more than 200
states aren't really practical in the current implementation, so to prevent
browser crashes we'll throw an error if a machine is about to get too big.
This is not perfect (try 0*200 vs 0*199), but it's good enough for now.
*/
function checkSize(states) {
	if (states > 200) {
		throw {
			type: 'sizeError',
			number: states
		}
	}
	return states;
}
