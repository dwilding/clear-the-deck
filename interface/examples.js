var knownDeals = {
	'1,1,2,3,5,8,13,21,34,55,89,144': function (identity) {
		if (identity == '(1or2)^?') {
			document.title = defaultTitle;
			return '<span class="sample">(1 or 2)^?</span> means \
			&quot;deal 1 or  2 cards as many times as you like&quot;, \
			so if the deck contains 4 cards then there are 5 different ways \
			you can carry out this deal and be left with no cards. The number \
			of different ways you can use this deal to empty a deck of \
			<b>n</b> &ge; 0 cards turns out to be the <b>n</b>th \
			<a href="http://en.wikipedia.org/wiki/Fibonacci_number">Fibonacci \
			number</a>.';
		}
	},
	'0,1,1,2,3,5,8,13,21,34,55,89': function (identity) {
		if (identity == '(1or2)^?1') {
			document.title = 'A000045 - ' + defaultTitle;
			return 'Congratulations! You have found sequence \
			<a href="http://oeis.org/A000045">A000045</a>.';
		}
	}
};
