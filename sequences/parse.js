/*
parseExpression() recursively creates an array representing a deal. No attempt
is made to understand the deal at this stage. The deal array looks like this:

[..., {
	coeff: Number,
	factors: [..., {
		term: Number | Array,
		from: Number,
		to: null | Number
	}, ...]
}, ...]

Note that raw is not a string; it is an object with properties str and i, where
i is the current parsing position in str.
*/
function parseExpression(raw, isSubExpression) {
	var i, j,
	expr = [{}];

	// the deal must not be empty
	if (raw.str.length == 0) {
		throw raw;
	}
	for (j = 0; j < expr.length; j++) {
		skipSpace(raw);
		// try to find a coefficient
		try {
			i = raw.i;
			// the coefficient should be a number
			expr[j].coeff = parseNumber(raw);
			skipSpace(raw);
			// if there's no asterisk
			if (raw.str[raw.i] != '*') {
				throw raw;
			}
			raw.i++;
			skipSpace(raw);
		}
		// if there's no coefficient
		catch (e) {
			raw.i = i;
			// implied coefficient is 1
			expr[j].coeff = 1;
		}
		// there must be at least one factor
		expr[j].factors = [parseFactor(raw)];
		skipSpace(raw);
		// while there still might be factors
		while (raw.i < raw.str.length) {
			// if we're in a sub-deal and there's a closing bracket
			if (isSubExpression && raw.str[raw.i] == ')') {
				raw.i++;
				// finished parsing for now
				return expr;
			}
			// if we find the keyword 'or'
			else if (raw.str.slice(raw.i, raw.i + 2).toLowerCase() == 'or') {
				raw.i += 2;
				// prepare to go round again
				expr.push({});
				// no more factors
				break;
			}
			else {
				// there ought to be another factor
				expr[j].factors.push(parseFactor(raw));
				skipSpace(raw);
			}
		}
	}
	// if we're in a sub-deal
	if (isSubExpression) {
		// we should have found a closing bracket by now
		throw raw;
	}
	return expr;
}

function parseFactor(raw) {
	var i,
	factor = {};

	// if we find an opening bracket
	if (raw.str[raw.i] == '(') {
		raw.i++;
		// recursively parse as a sub-deal
		factor.term = parseExpression(raw, true);
	}
	// if we find a dot
	else if (raw.str[raw.i] == '.') {
		// gobble up any more dots
		while (raw.str[raw.i] == '.') {
			raw.i++;
		}
		// implied (1*1^0-?)
		factor.term = [{
			coeff: 1,
			factors: [{
				term: 1,
				from: 0,
				to: null
			}]
		}];
	}
	else {
		// there ought to be a number
		factor.term = parseNumber(raw);
	}
	// if we find a power
	if (raw.str[raw.i] == '^') {
		raw.i++;
		// if we just find a question mark
		if (raw.str[raw.i] == '?') {
			raw.i++;
			// implied power is ^0-?
			factor.from = 0;
			factor.to = null;
		}
		else {
			// power ought to start with a number
			factor.from = parseNumber(raw);
			// if we find a dash
			if (raw.str[raw.i] == '-') {
				raw.i++;
				// if we find a question mark
				if (raw.str[raw.i] == '?') {
					raw.i++;
					// power is ^from-?
					factor.to = null;
				}
				else {
					i = raw.i;
					// power is ^from-to
					factor.to = parseNumber(raw);
					// if power is the wrong way round
					if (factor.to < factor.from) {
						raw.i = i;
						throw raw;
					}
				}
			}
			else {
				// implied power is ^from-from
				factor.to = factor.from;
			}
		}
	}
	else {
		// implied power is ^1-1
		factor.from = 1;
		factor.to = 1;
	}
	return factor;
}

function parseNumber(raw) {
	var i = raw.i;

	// while there still might be characters
	while (raw.i < raw.str.length) {
		// if we find a digit
		if (
			48 <= raw.str.charCodeAt(raw.i) &&
			raw.str.charCodeAt(raw.i) <= 57
		) {
			raw.i++;
		}
		else {
			// no more digits
			break;
		}
	}
	// if there's no number at position raw.i
	if (raw.i == i) {
		throw raw;
	}
	// there's a number at position raw.i
	return +raw.str.slice(i, raw.i);
}

function skipSpace(raw) {
	// find the first non-whitespace character after raw.i
	var i = raw.str.slice(raw.i).search(/[^\s]/);

	// if there's only whitespace
	if (i == -1) {
		raw.i = raw.str.length;
	}
	// if there's something after the whitespace
	else {
		// move past the whitespace
		raw.i += i;
	}
}
