/*
identifyExpression() takes a machine expression and produces a deal in a
standard form. This brings us closer to being able to actually identify a
sequence, but it's not foolproof: although identifyExpression() takes some
equivalences into account, there are still equivalent machines that will have
different standard deals.
*/
function identifyExpression(expr) {
	var i, j, coeff,
	strs = [],
	reducedStrs = [],
	expanded = expandExpression(expr);

	// for each summand
	for (i = 0; i < expanded.length; i++) {
		// push the deal corresponding to the summand's factors
		strs.push(identifyFactors(expanded[i].factors));
	}
	// for each deal
	for (i = 0; i < strs.length; i++) {
		// if we've not already considered this deal
		if (strs[i] != null) {
			// find duplicate deals and sum up their coeffs
			coeff = expanded[i].coeff;
			for (j = i + 1; j < strs.length; j++) {
				if (strs[i] == strs[j]) {
					coeff += expanded[j].coeff;
					strs[j] = null;
				}
			}
			// include this deal as a summand in the reduced deal
			if (coeff == 1) {
				// a coeff of 1 is implied
				reducedStrs.push(strs[i]);
			}
			else {
				reducedStrs.push(coeff.toString() + '*' + strs[i]);
			}
		}
	}
	// sort the reduced summand deals and join them together
	reducedStrs.sort();
	return reducedStrs.join('or');
}

function identifyFactors(factors) {
	var i,
	number = 0,
	strs = [];

	// for each factor
	for (i = 0; i < factors.length; i++) {
		// if the factor came from buildRepeat()
		if (typeof factors[i] == 'object') {
			// push the deal corresponding to the factor
			strs.push('(' + identifyExpression(factors[i]) + ')^?');
		}
		// if the factor came from a characteristic machine
		else {
			number += factors[i];
		}
	}
	// push the deal corresponding to number only if it really needs to be there
	if (number > 0 || strs.length == 0) {
		strs.push(number.toString());
	}
	// sort the factor deals and join them together
	strs.sort();
	return strs.join('');
}

/*
expandExpression() takes a machine expression and produces an expanded version
of the expression that looks like this:

[..., {
	coeff: Number,
	factors: [..., Number | Array, ...]
}, ...]

In the factors array, Number represents a characteristic machine and Array
represents an application of buildRepeat().
*/
function expandExpression(expr) {
	var i, j, k, left, right,
	expanded = [];

	// for each summand
	for (i = 0; i < expr.length; i++) {
		// if its factor came from a characteristic machine or buildRepeat()
		if (expr[i].factors.length == 1) {
			// include this summand in the expanded expression
			expanded.push(expr[i]);
		}
		// if its factors came from buildProduct()
		else {
			// recursively expand the left and right factors
			left = expandExpression(expr[i].factors[0]);
			right = expandExpression(expr[i].factors[1]);
			// multiply the expanded factors and scale by this summand's coeff
			for (j = 0; j < left.length; j++) {
				for (k = 0; k < right.length; k++) {
					expanded.push({
						coeff: expr[i].coeff * left[j].coeff * right[k].coeff,
						factors: left[j].factors.concat(right[k].factors)
					});
				}
			}
		}
	}
	return expanded;
}
