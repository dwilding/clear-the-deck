[Clear the deck][1] is an integer sequence explorer developed by
[Dave Wilding][2] and named by [Anthony Chiu][3].

# The format of a deal
The simplest deal is a single number. For example, `5` means "deal 5 cards" and
`10` means "deal 10 cards". The deal `5^2` means "deal 5 cards twice", so is
equivalent to `10`, and `5^2-4` means "deal 5 cards twice, three times or four
times". To deal some cards an unspecified number of times just use a question
mark instead of a number: `5^?` means "deal 5 cards as many times as you like"
and `5^1-?` means "deal 5 cards at least once".

To repeat a more complicated deal, such as `1^?`, first enclose the deal in
round brackets. For example, `(1^?)^2` means "deal as many cards as you like,
twice". Since `1^?` is an extremely useful deal, any number of consecutive dots
is interpreted as `(1^?)`, and therefore the previous example could also be
written as `...^2`.

Deals can be chained together by writing them one after the other. For example,
`5 10 1` means "deal 5 cards, then deal 10 cards, then deal 1 card", i.e., "deal
16 cards". The spaces are necessary in this case because otherwise the deal
would mean "deal 5101 cards" (which your browser would _not_ like!), but
sometimes you can get away without spaces: `...1...` means "deal as many cards
as you like, then deal 1 card, then deal as many cards as you like again". If
one of the deals in your chain is more complicated than the deals described
above, you will need to enclose it in round brackets.

Finally, the keyword 'or' turns chains of deals into different possibilities
within the same deal. For example, `1... or 2` means "deal 1 card, then deal as
many cards as you like; or just deal 2 cards". Perhaps surprisingly, `5 or 5`
doesn't simply mean "deal 5 cards". Rather, it means "deal 5 cards to a person
or deal 5 cards to a different person", or in other words, "deal 5 cards to one
of 2 people". A simpler way to specify that a chain of deals should be directed
at one of __m__ &ge; 0 people is to put an asterisk between __m__ and the chain:
`2 * 5` is equivalent to `5 or 5`.

# How it works
1. Your deal is first parsed to make sure that it is syntactically valid. If it
isn't valid, the status displayed will be <b>i</b>A for some __i__ &ge; 1,
meaning that the <b>i</b>th symbol in your deal is incorrect (or missing). For
example, `1^?^2` isn't a valid deal because `1^?` isn't enclosed in round
brackets.

2. Your deal is then transformed into a [finite-state machine][4] comprising an
integer [matrix][5] __M__, an integer [row vector][6] __u__ and an integer
[column vector][7] __v__. If the status displayed at this stage is <b>j</b>B for
some __j__ &ge; 1 then your deal has been abandoned because it (or a part of it)
means "deal 0 cards to one of __j__ people as many times as you like", and there
are infinitely many ways to do this. The syntactically valid (yet mathematically
meaningless) deals `0^?` and `...^?` both give status 1B.

3. If your deal is meaningful then its sequence is generated by computing the
[matrix product][8] __u__ &middot; __M__<sup>__n__</sup> &middot; __v__ for each
__n__ &ge; 0. The final status displayed will be <b>k</b>C where __k__ &ge; 1 is
the size of the matrix __M__, so a small value of __k__ indicates that your
deal's sequence is being generated quickly. Because of the way the deal parser
works, it is usually most efficient to write your deal in the simplest looking
way. For example, the deal `1^20` gives status 40C, whereas the equivalent (and
simpler) deal `20` only gives status 21C.

[1]: http://dpw.me/clear-the-deck/
[2]: https://github.com/dwilding
[3]: https://github.com/idno0001
[4]: http://en.wikipedia.org/wiki/Nondeterministic_finite_automaton
[5]: http://en.wikipedia.org/wiki/Matrix_%28mathematics%29
[6]: http://en.wikipedia.org/wiki/Row_vector
[7]: http://en.wikipedia.org/wiki/Column_vector
[8]: http://en.wikipedia.org/wiki/Matrix_multiplication
