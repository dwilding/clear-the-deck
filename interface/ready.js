var elDeal, elDealBorder, elStatus, elInfo, elList, elBottom;

$(document).ready(function () {
	// get the various page elements
	elDeal = $('#deal');
	elDealBorder = $('#deal-border');
	elStatus = $('#status');
	elInfo = $('#info');
	elList = $('#list');
	elBottom = $('#bottom');
	// the deal textbox border should look different when selected/unselected
	elDeal.focus(function () {
		elDealBorder.removeClass('unselected').addClass('selected');
	});
	elDeal.focusout(function () {
		elDealBorder.removeClass('selected').addClass('unselected');
	});
	// call refreshSequence when there's a change in the deal textbox
	elDeal.keyup(refreshSequence);
	elDeal.change(refreshSequence);
	// generate more of the sequence when the user scrolls to the bottom
	$(window).scroll(function () {
		if (elBottom.is(':in-viewport')) {
			listSequence();
		}
	});
	// detect when the URL hash changes
	$(window).bind('hashchange', hashChange);
	// go!
	hashChange();
});
