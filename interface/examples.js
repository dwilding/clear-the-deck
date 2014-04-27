/*
We want to be able to recognise certain sequences (to provide useful information
about them), but it can be very expensive to call Sequence.identify(). By
storing the first defaultLength terms of each sequence we need only call
Sequence.identify() when absolutely necessary.
*/
var knownDeals = {
	// repeated 0s
	'0,0,0,0,0,0,0,0,0,0,0,0': function (identity) {
		if (identity == '0*0') {
			return knownSequence('A000004');
		}
	},
	// characteristic sequences
	'1,0,0,0,0,0,0,0,0,0,0,0': function (identity) {
		if (identity == '0') {
			return knownSequence('A000007');
		}
	},
	'0,1,0,0,0,0,0,0,0,0,0,0': function (identity) {
		if (identity == '1') {
			return knownSequence('A063524');
		}
	},
	'0,0,1,0,0,0,0,0,0,0,0,0': function (identity) {
		if (identity == '2') {
			return knownSequence('A185012');
		}
	},
	'0,0,0,1,0,0,0,0,0,0,0,0': function (identity) {
		if (identity == '3') {
			return knownSequence('A185013');
		}
	},
	'0,0,0,0,1,0,0,0,0,0,0,0': function (identity) {
		if (identity == '4') {
			return knownSequence('A185014');
		}
	},
	'0,0,0,0,0,1,0,0,0,0,0,0': function (identity) {
		if (identity == '5') {
			return knownSequence('A185015');
		}
	},
	'0,0,0,0,0,0,1,0,0,0,0,0': function (identity) {
		if (identity == '6') {
			return knownSequence('A185016');
		}
	},
	'0,0,0,0,0,0,0,1,0,0,0,0': function (identity) {
		if (identity == '7') {
			return knownSequence('A185017');
		}
	},
	// Fibonacci numbers
	'1,1,2,3,5,8,13,21,34,55,89,144': function (identity) {
		if (identity == '(1or2)^?') {
			return '<span class="sample">(1 or 2)^?</span> means &quot;deal 1\
			card or 2 cards as many times as you like&quot;, so if the deck\
			contains 4 cards then there are 5 different ways you can carry out\
			this deal and be left with no cards. The number of different ways\
			you can use this deal to empty a deck of <b>n</b> &ge; 0 cards is\
			the <b>n</b>th\
			<a href="http://en.wikipedia.org/wiki/Fibonacci_number">Fibonacci\
			number</a>.<br><a href="#(0%20or%201)%5E6">Show me another\
			example</a>';
		}
	},
	'0,1,1,2,3,5,8,13,21,34,55,89': function (identity) {
		if (identity == '(1or2)^?1') {
			return knownSequence('A000045');
		}
	},
	// 6 choose n
	'1,6,15,20,15,6,1,0,0,0,0,0': function (identity) {
		if (identity == '0or15*2or15*4or20*3or6or6*1or6*5') {
			return '<span class="sample">(0 or 1)^6</span> means &quot;deal 0\
			cards or 1 card 6 times&quot;. The number of different ways you can\
			use this deal to empty a deck of <b>n</b> &ge; 0 cards is the <a\
			href="http://en.wikipedia.org/wiki/Binomial_coefficient">binomial\
			coefficient</a> 6 choose <b>n</b>.<br><a href="#1...">Show me\
			another example</a>';
		}
	},
	// repeated 1s
	'1,1,1,1,1,1,1,1,1,1,1,1': function (identity) {
		if (identity == '(1)^?') {
			return knownSequence('A000012');
		}
	},
	'0,1,1,1,1,1,1,1,1,1,1,1': function (identity) {
		if (identity == '(1)^?1') {
			return '<span class="sample">1...</span> means &quot;deal 1 card\
			then deal as many cards as you like&quot;. If the deck contains 0\
			cards then it is not possible to carry out this deal, but otherwise\
			there is exactly 1 way you can use this deal to empty a deck of\
			<b>n</b> &ge; 1 cards.<br><a href="#2%20*%20...1...">Show me\
			another example</a>';
		}
	},
	// natural numbers
	'1,2,3,4,5,6,7,8,9,10,11,12': function (identity) {
		if (identity == '(1)^?(1)^?') {
			return knownSequence('A000027');
		}
	},
	'0,1,2,3,4,5,6,7,8,9,10,11': function (identity) {
		if (identity == '(1)^?(1)^?1') {
			return knownSequence('A001477');
		}
	},
	// even numbers
	'0,2,4,6,8,10,12,14,16,18,20,22': function (identity) {
		if (identity == '2*(1)^?(1)^?1') {
			return knownSequence('A005843');
		}
	},
	// powers of 2
	'1,2,4,8,16,32,64,128,256,512,1024,2048': function (identity) {
		if (identity == '(2*1)^?') {
			return knownSequence('A000079');
		}
	}
};

/*
The OEIS (http://oeis.org/) knows about loads of integer sequences, so return a
congratulatory message whenever one we know about is found.
*/
function knownSequence(oeis) {
	document.title = oeis + ' - ' + defaultTitle;
	return 'Congratulations! You have found sequence\
	<a href="http://oeis.org/' + oeis + '">' + oeis + '</a>.';
}
