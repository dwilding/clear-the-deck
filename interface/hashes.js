var noHashChangeUntil = null;

function getHash() {
	var hash = location.hash;

	if (hash[0] == '#') {
		hash = hash.slice(1);
	}
	return decodeURIComponent(hash);
}

function setHash(hash) {
	if (hash != getHash()) {
		noHashChangeUntil = hash;
		location.hash = '#' + encodeURIComponent(hash);
	}
}

function hashChange() {
	var hash = getHash();

	if (noHashChangeUntil == null) {
		elDeal.val(hash);
		refreshSequence();
	}
	else if (hash == noHashChangeUntil) {
		noHashChangeUntil = null;
	}
}
