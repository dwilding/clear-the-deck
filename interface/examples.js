var knownDeals = {
	'(1 or 2)^?': {
		title: null,
		info: '<span class="sample">(1 or 2)^?</span> means &quot;deal 1 card\
		or 2 cards as many times as you like&quot;, so if the deck contains 4\
		cards then there are 5 different ways you can carry out this deal and\
		be left with no cards. The number of different ways you can use this\
		deal to empty a deck of <b>n</b> &ge; 0 cards is the <b>n</b>th\
		<a href="http://en.wikipedia.org/wiki/Fibonacci_number">Fibonacci\
		number</a>. <a href="#(0%20or%201)%5E6">Another example</a>.'
	},
	'(0 or 1)^6': {
		title: null,
		info: '<span class="sample">(0 or 1)^6</span> means &quot;deal 0 cards\
		or 1 card 6 times&quot;. The number of different ways you can use this\
		deal to empty a deck of <b>n</b> &ge; 0 cards is the <a\
		href="http://en.wikipedia.org/wiki/Binomial_coefficient">binomial\
		coefficient</a> 6 choose <b>n</b>. <a href="#1...">Another example</a>.'
	},
	'1...': {
		title: null,
		info: '<span class="sample">1...</span> means &quot;deal 1 card then\
		deal as many cards as you like&quot;. If the deck contains 0 cards then\
		it is not possible to carry out this deal, but otherwise there is\
		exactly 1 way you can use this deal to empty a deck of <b>n</b> &ge; 1\
		cards. <a href="#2%20*%20...1...">Another example</a>.'
	}
};
