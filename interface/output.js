var defaultTitle = 'Clear the deck',
minTerms = 12,
curInput = null,
curSequence = null;

function refreshSequence() {
	if (curInput == elDeal.val()) {
		return;
	}
	curInput = elDeal.val();
	try {
		curSequence = new Sequence(curInput);
	}
	catch (e) {
		elStatus.text((e.i + 1).toString() + 'A');
		rejectSequence('');
		return;
	}
	setHash(curInput);
	try {
		curSequence.build();
	}
	catch (e) {
		elStatus.html(e.toString() + 'B');
		rejectSequence('Your deal <a href="#0%5E0-1">does</a> \
		<a href="#0%5E0-2">not</a> <a href="#0%5E0-3">make</a> \
		<a href="#0%5E0-4">sense</a>!');
		return;
	}
	elStatus.html(curSequence.machine.states.toString() + 'C');
	elList.html('');
	identifySequence(listSequence());
}

function rejectSequence(info) {
	curSequence = null;
	elList.html('');
	listSequence();
	document.title = defaultTitle;
	elInfo.html(info);
}

function identifySequence(initial) {
	var i, identity, info;

	initial = initial.slice(0, minTerms).join(',');
	if (knownDeals.hasOwnProperty(initial)) {
		identity = curSequence.identify();
		info = knownDeals[initial](identity);
	}
	if (typeof info != 'string') {
		document.title = defaultTitle;
		info = 'Does this sequence <a href="http://oeis.org/search?q=' +
		encodeURIComponent('signed:' + initial) +
		'&fmt=short" title="Search the OEIS">look familiar</a>? \
		Email <a href="mailto:hi@dpw.me">hi@dpw.me</a> if you know what it is.';
	}
	elInfo.html(info);
}

function listSequence() {
	var i,
	items = [];

	for (i = 0; i < minTerms || elBottom.is(':in-viewport'); i++) {
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
