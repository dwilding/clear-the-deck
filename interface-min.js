var example=0,examples=["1","2","1 2","0 or 3","1 or 3","3 or 3","8*1","1^4","1^2-4","1^?","..."],knownSequences={"1,1,1,1,1,1,1,1,1,1,1,1":["(1)^?"]},knownDeals={"(1)^?":'You have found <a href="http://oeis.org/A000012">A000012</a>!'};function nextExample(){if(example==examples.length-1){elExample.remove()}elDeal.val(examples[example]);refreshSequence();elExample.html("Show me another example");example++}var noHashChangeUntil=null;function getHash(){var a=location.hash;if(a[0]=="#"){a=a.slice(1)}return decodeURIComponent(a)}function setHash(a){if(a!=getHash()){noHashChangeUntil=a;location.hash="#"+encodeURIComponent(a)}}function hashChange(){var a=getHash();if(noHashChangeUntil==null){elDeal.val(a);refreshSequence()}else{if(a==noHashChangeUntil){noHashChangeUntil=null}}}var minTerms=12,curInput=null,curSequence=null;function refreshSequence(){if(curInput==elDeal.val()){return}curInput=elDeal.val();try{curSequence=new Sequence(curInput)}catch(a){elStatus.text("A"+(a.i+1).toString());rejectSequence("");return}setHash(curInput);try{curSequence.build()}catch(a){elStatus.html("B"+a.toString());rejectSequence('Your deal <a href="#0%5E0-1">does</a> <a href="#0%5E0-2">not</a> <a href="#0%5E0-3">make</a> <a href="#0%5E0-4">sense</a>!');return}elStatus.html("C"+curSequence.machine.states.toString());elList.html("");identifySequence(listSequence())}function rejectSequence(a){curSequence=null;elList.html("");listSequence();elInfo.html(a)}function identifySequence(b){var c,a;b=b.slice(0,minTerms).join(",");if(knownSequences.hasOwnProperty(b)){a=curSequence.identify();for(c=0;c<knownSequences[b].length;c++){if(knownSequences[b][c]==a){elInfo.html(knownDeals[a]);return}}}elInfo.html('Does this sequence <a href="http://oeis.org/search?q='+encodeURIComponent("signed:"+b)+'&fmt=short" title="Search the OEIS">look familiar</a>?')}function listSequence(){var b,a=[];for(b=0;b<minTerms||elBottom.is(":in-viewport");b++){if(curSequence==null){elList.append("<li></li>")}else{a.push(curSequence.next().toString());elList.append('<li><span class="num">'+a[b]+"</span></li>")}}return a}var elDeal,elDealBorder,elExample,elStatus,elInfo,elList,elBottom;$(document).ready(function(){elDeal=$("#deal");elDealBorder=$("#deal-border");elExample=$("#example");elStatus=$("#status");elInfo=$("#info");elList=$("#list");elBottom=$("#bottom");elDeal.focus(function(){elDealBorder.removeClass("unselected").addClass("selected")});elDeal.focusout(function(){elDealBorder.removeClass("selected").addClass("unselected")});elDeal.keyup(refreshSequence);elDeal.change(refreshSequence);elExample.click(nextExample);$(window).scroll(function(){if(elBottom.is(":in-viewport")){listSequence()}});$(window).bind("hashchange",hashChange);hashChange()});