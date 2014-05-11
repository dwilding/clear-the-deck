/*
We want to be able to recognise certain sequences (to provide useful information
about them), but it can be very expensive to call Sequence.identify(). By
storing the first defaultLength terms of each sequence we need only call
Sequence.identify() when absolutely necessary.
*/
var knownDeals = {
	'0,1,1,1,1,1,1,1,1,1,1,1': {
		'(1)^?1': {
			oeis: null,
			text: '<span class="sample">1...</span> means &quot;deal 1 card\
			then deal as many cards as you like&quot;. If the deck contains 0\
			cards then it is not possible to carry out this deal, but otherwise\
			there is exactly 1 way you can use this deal to empty a deck of\
			<b>n</b> &ge; 1 cards.<br><a href="#2%20*%20...1...">Show me\
			another example</a>'
		}
	},
	'1,1,2,3,5,8,13,21,34,55,89,144': {
		'(1or2)^?': {
			oeis: null,
			text: '<span class="sample">(1 or 2)^?</span> means &quot;deal 1\
			card or 2 cards as many times as you like&quot;, so if the deck\
			contains 4 cards then there are 5 different ways you can carry out\
			this deal and be left with no cards. The number of different ways\
			you can use this deal to empty a deck of <b>n</b> &ge; 0 cards is\
			the <b>n</b>th\
			<a href="http://en.wikipedia.org/wiki/Fibonacci_number">Fibonacci\
			number</a>.<br><a href="#(0%20or%201)%5E6">Show me another\
			example</a>'
		}
	},
	'1,6,15,20,15,6,1,0,0,0,0,0': {
		'0or15*2or15*4or20*3or6or6*1or6*5': {
			oeis: null,
			text: '<span class="sample">(0 or 1)^6</span> means &quot;deal 0\
			cards or 1 card 6 times&quot;. The number of different ways you can\
			use this deal to empty a deck of <b>n</b> &ge; 0 cards is the <a\
			href="http://en.wikipedia.org/wiki/Binomial_coefficient">binomial\
			coefficient</a> 6 choose <b>n</b>.<br><a href="#1...">Show me\
			another example</a>'
		}
	}
};

addDeal(
	'0,0,0,0,0,0,0,0,0,0,0,0',
	'0*0',
	'A000004'
);
addDeal(
	'1,0,0,0,0,0,0,0,0,0,0,0',
	'0',
	'A000007'
);
addDeal(
	'0,1,0,0,0,0,0,0,0,0,0,0',
	'1',
	'A063524'
);
addDeal(
	'0,0,1,0,0,0,0,0,0,0,0,0',
	'2',
	'A185012'
);
addDeal(
	'0,0,0,1,0,0,0,0,0,0,0,0',
	'3',
	'A185013'
);
addDeal(
	'0,0,0,0,1,0,0,0,0,0,0,0',
	'4',
	'A185014'
);
addDeal(
	'0,0,0,0,0,1,0,0,0,0,0,0',
	'5',
	'A185015'
);
addDeal(
	'0,0,0,0,0,0,1,0,0,0,0,0',
	'6',
	'A185016'
);
addDeal(
	'0,0,0,0,0,0,0,1,0,0,0,0',
	'7',
	'A185017'
);
addDeal(
	'1,1,1,1,1,1,1,1,1,1,1,1',
	'(1)^?',
	'A000012'
);
// natural numbers
addDeal(
	'1,2,3,4,5,6,7,8,9,10,11,12',
	'(1)^?(1)^?',
	'A000027'
);
addDeal(
	'1,2,3,4,5,6,7,8,9,10,11,12',
	'(1)^?or(1)^?(1)^?1',
	'A000027'
);
addDeal(
	'0,1,2,3,4,5,6,7,8,9,10,11',
	'(1)^?(1)^?1',
	'A001477'
);
addDeal(
	'0,1,2,3,4,5,6,7,8,9,10,11',
	'(1)^?(1)^?2or(1)^?1',
	'A001477'
);
// even numbers
addDeal(
	'0,2,4,6,8,10,12,14,16,18,20,22',
	'2*(1)^?(1)^?1',
	'A005843'
);
// odd numbers
addDeal(
	'1,3,5,7,9,11,13,15,17,19,21,23',
	'(1)^?or2*(1)^?(1)^?1',
	'A005408'
);
addDeal(
	'1,3,5,7,9,11,13,15,17,19,21,23',
	'(1)^?(1)^?or(1)^?(1)^?1',
	'A005408'
);
// square numbers
addDeal(
	'0,1,4,9,16,25,36,49,64,81,100,121',
	'(1)^?(1)^?1or2*(1)^?(1)^?(1)^?2',
	'A000290'
);
addDeal(
	'0,1,4,9,16,25,36,49,64,81,100,121',
	'(1)^?(1)^?(1)^?1or(1)^?(1)^?(1)^?2',
	'A000290'
);
// powers of 2
addDeal(
	'1,2,4,8,16,32,64,128,256,512,1024,2048',
	'(2*1)^?',
	'A000079'
);
addDeal(
	'1,2,4,8,16,32,64,128,256,512,1024,2048',
	'((1)^?1)^?(1)^?',
	'A000079'
);

function addDeal(initial, identity, oeis) {
	var data = {
		oeis: oeis,
		text: null
	};

	// if there are no known deals that look like this one
	if (!knownDeals.hasOwnProperty(initial)) {
		knownDeals[initial] = {};
	}
	knownDeals[initial][identity] = data;
}

function getDeal(initial, identity) {
	if (knownDeals[initial][identity].oeis != null) {
		document.title = knownDeals[initial][identity].oeis +
		' - ' + defaultTitle;
	}
	if (knownDeals[initial][identity].text != null) {
		return knownDeals[initial][identity].text;
	}
	else if (knownDeals[initial][identity].oeis != null) {
		return 'Congratulations! You have found sequence\
		<a href="http://oeis.org/' + knownDeals[initial][identity].oeis + '">' +
		knownDeals[initial][identity].oeis + '</a>.';
	}
	else {
		return '';
	}
}
