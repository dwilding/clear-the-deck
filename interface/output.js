var defaultTitle = 'Clear the deck',
defaultLength = 12,
curInput = null,
curSequence = null;

function refreshSequence() {
	if (curInput == elDeal.val()) {
		return;
	}
	curInput = elDeal.val();
	document.title = defaultTitle;
	elList.html('');
	elInfo.html('');
	try {
		curSequence = new Sequence(curInput);
	}
	catch (e) {
		elStatus.text((e.i + 1).toString() + 'A');
		curSequence = null;
		listSequence();
		return;
	}
	setHash(curInput);
	try {
		curSequence.build();
	}
	catch (e) {
		elStatus.html(e.toString() + 'B');
		curSequence = null;
		listSequence();
		return;
	}
	elStatus.html(curSequence.machine.states.toString() + 'C');
	identifySequence(listSequence());
}

function listSequence() {
	var i,
	items = [];

	for (i = 0; i < defaultLength || elBottom.is(':in-viewport'); i++) {
		if (curSequence == null) {
			elList.append('<li></li>');
		}
		else {
			items.push(curSequence.next().toString());
			elList.append('<li><span class="num">' + items[i] + '</span></li>');
		}
	}
	return items;
}

function identifySequence(items) {
	var initial, identity, info;

	initial = items.slice(0, defaultLength).join(',');
	if (knownDeals.hasOwnProperty(initial)) {
		identity = curSequence.identify();
		info = knownDeals[initial](identity);
	}
	if (typeof info != 'string') {
		info = 'Does this sequence <a href="http://oeis.org/search?q=' +
		encodeURIComponent('signed:' + initial) +
		'&fmt=short" title="Search the OEIS">look familiar</a>? Email\
		<a href="mailto:hi@dpw.me">hi@dpw.me</a> if you know what it is.';
	}
	elInfo.html(info);
}
