var knownDeals={"(1 or 2)^?":{title:null,info:'<span class="sample">(1 or 2)^?</span> means &quot;deal 1 card		or 2 cards as many times as you like&quot;, so if the deck contains 4		cards then there are 5 different ways you can carry out this deal and		be left with no cards. The number of different ways you can use this		deal to empty a deck of <b>n</b> &ge; 0 cards is the <b>n</b>th		<a href="http://en.wikipedia.org/wiki/Fibonacci_number">Fibonacci		number</a>. Show another <a href="#(0%20or%201)%5E6">example</a>.'},"(0 or 1)^6":{title:null,info:'<span class="sample">(0 or 1)^6</span> means &quot;deal 0 cards		or 1 card 6 times&quot;. The number of different ways you can use this		deal to empty a deck of <b>n</b> &ge; 0 cards is the <a		href="http://en.wikipedia.org/wiki/Binomial_coefficient">binomial		coefficient</a> 6 choose <b>n</b>. Show another		<a href="#1...">example</a>.'},"1...":{title:null,info:'<span class="sample">1...</span> means &quot;deal 1 card then		deal as many cards as you like&quot;. If the deck contains 0 cards then		it is not possible to carry out this deal, but otherwise there is		exactly 1 way you can use this deal to empty a deck of <b>n</b> &ge; 1		cards. Show another <a href="#2%20*%20...1...">example</a>.'}};var noHashChangeUntil=null;function getHash(){var a=location.hash;if(a[0]=="#"){a=a.slice(1)}return decodeURIComponent(a)}function setHash(a){if(a!=getHash()){noHashChangeUntil=a;location.hash="#"+encodeURIComponent(a)}}function hashChange(){var a=getHash();if(noHashChangeUntil==null){elDeal.val(a);refreshSequence()}else{if(a==noHashChangeUntil){noHashChangeUntil=null}}}var defaultTitle="Clear the Deck",defaultLength=12,maxNumber=Math.pow(2,53)-1,curInput=null,curSequence=null;function refreshSequence(){if(curInput==elDeal.val()){return}curInput=elDeal.val();document.title=defaultTitle;elList.html("");elInfo.html("");try{curSequence=new Sequence(curInput)}catch(a){elStatus.text((a.i+1).toString()+"A");curSequence=null;listSequence();return}setHash(curInput);try{curSequence.build()}catch(a){if(a.type=="repeatError"){elStatus.html(a.number.toString()+"B")}else{if(a.type=="sizeError"){elStatus.html(a.number.toString()+"D")}}curSequence=null;listSequence();return}elStatus.html(curSequence.machine.states.toString()+"C");identifySequence(listSequence())}function listSequence(){var b,c,a=[];for(b=0;b<defaultLength||elBottom.is(":in-viewport");b++){if(curSequence==null){elList.append("<li></li>")}else{c=curSequence.next();if(c>maxNumber){a.push(null);elList.append('<li><span class="item">&ge; '+(maxNumber+1).toString()+"<span></li>")}else{a.push(c.toString());elList.append('<li><span class="item num">'+a[b]+"</span></li>")}}}return a}function identifySequence(b){var a=curInput;if(knownDeals.hasOwnProperty(a)){getKnown(a);return}elInfo.html("Searching for this sequence&hellip;");b=encodeURIComponent(b.slice(0,defaultLength).join(", "));$.getJSON("oeis.php?q="+b,function(g){var f,d,l,h,c;if(curInput!=a){return}for(f=0;f<g.length;f++){if(g[f].identity!=null){if(g[f].identity==curSequence.identify()){knownDeals[a]={title:g[f].title,info:g[f].info};getKnown(a);return}}else{if(g[f].deal!=null){try{l=new Sequence(g[f].deal);l.build()}catch(k){continue}if(l.identify()==curSequence.identify()){knownDeals[a]={title:g[f].title,info:g[f].info};getKnown(a);return}if(g[f].offset>0){h=buildProduct(charMachine(g[f].offset),curSequence.machine);c=identifyExpression(h.expr);if(l.identify()==c){knownDeals[a]={title:null,info:g[f].info_offset};getKnown(a);return}}}else{knownDeals[a]={title:null,info:g[f].info+' Please <a href="submit/'+encodeURIComponent(a)+'">submit it</a> if you find it there.'};getKnown(a)}}}})}function getKnown(a){if(knownDeals[a].title!=null){document.title=knownDeals[a].title+" - "+defaultTitle}elInfo.html(knownDeals[a].info)}var elDeal,elDealBorder,elStatus,elInfo,elList,elBottom;$(document).ready(function(){elDeal=$("#deal");elDealBorder=$("#deal-border");elStatus=$("#status");elInfo=$("#info");elList=$("#list");elBottom=$("#bottom");elDeal.focus(function(){elDealBorder.removeClass("unselected").addClass("selected")});elDeal.focusout(function(){elDealBorder.removeClass("selected").addClass("unselected")});elDeal.keyup(refreshSequence);elDeal.change(refreshSequence);$(window).scroll(function(){if(elBottom.is(":in-viewport")){listSequence()}});$(window).bind("hashchange",hashChange);hashChange()});