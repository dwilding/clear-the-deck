var example = 0,
examples = [
	'1',
	'2',
	'1 2',
	'0 or 3',
	'1 or 3',
	'3 or 3',
	'8*1',
	'1^4',
	'1^2-4',
	'1^?',
	'...'
],
knownSequences = {
	'1,1,1,1,1,1,1,1,1,1,1,1': ['(1)^?']
},
knownDeals = {
	'(1)^?': 'You have found <a href="http://oeis.org/A000012">A000012</a>!'
};

function nextExample() {
	if (example == examples.length - 1) {
		elExample.remove();
	}
	elDeal.val(examples[example]);
	refreshSequence();
	elExample.html('Show me another example');
	example++;
}
