var elDeal, elDealBorder, elExample, elStatus, elInfo, elList, elBottom;

$(document).ready(function () {
	elDeal = $('#deal');
	elDealBorder = $('#deal-border');
	elExample = $('#example');
	elStatus = $('#status');
	elInfo = $('#info');
	elList = $('#list');
	elBottom = $('#bottom');
	elDeal.focus(function () {
		elDealBorder.removeClass('unselected').addClass('selected');
	});
	elDeal.focusout(function () {
		elDealBorder.removeClass('selected').addClass('unselected');
	});
	elDeal.keyup(refreshSequence);
	elDeal.change(refreshSequence);
	elExample.click(nextExample);
	$(window).scroll(function () {
		if (elBottom.is(':in-viewport')) {
			listSequence();
		}
	});
	$(window).bind('hashchange', hashChange);
	hashChange();
});
