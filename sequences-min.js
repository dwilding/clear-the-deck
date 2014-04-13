function buildMachine(l){var e,d,c,f,g,a,h,b=zeroMachine;for(e=0;e<l.length;e++){f=charMachine(0);for(d=0;d<l[e].factors.length;d++){if(typeof l[e].factors[d].term=="object"){a=buildMachine(l[e].factors[d].term)}else{a=charMachine(l[e].factors[d].term)}g=charMachine(0);for(c=0;c<l[e].factors[d].from;c++){g=buildProduct(g,a)}if(l[e].factors[d].to==null){h=buildRepeat(a)}else{h=charMachine(0);for(;c<l[e].factors[d].to;c++){h=buildSum(buildProduct(h,a),charMachine(0))}}f=buildProduct(f,buildProduct(g,h))}b=buildSum(b,buildScale(l[e].coeff,f))}return b}function buildSum(c,a){var b;if(isZeroMachine(c)){b=a}else{if(isZeroMachine(a)){b=c}else{b=machineSum(c,a);b.expr=c.expr.concat(a.expr)}}return b}function buildProduct(c,a){var b;if(isZeroMachine(c)||isZeroMachine(a)){b=zeroMachine}else{if(isCharMachine0(c)){b=a}else{if(isCharMachine0(a)){b=c}else{b=machineProduct(c,a);b.expr=[{coeff:1,factors:[c.expr,a.expr]}]}}}return b}function buildRepeat(b){var a;if(isZeroMachine(b)){a=charMachine(0)}else{a=machineRepeat(b);a.expr=[{coeff:1,factors:[b.expr]}]}return a}function buildScale(d,b){var a,c;if(d==0){c=zeroMachine}else{c=b;if(d>1){c.output=matrixProduct(c.output,[[d]]);for(a=0;a<c.expr.length;a++){c.expr[a].coeff*=d}}}return c}function identifyExpression(g){var e,d,c,f=[],a=[],b=expandExpression(g);for(e=0;e<b.length;e++){f.push(identifyFactors(b[e].factors))}for(e=0;e<f.length;e++){if(f[e]!=null){c=b[e].coeff;for(d=e+1;d<f.length;d++){if(f[e]==f[d]){c+=b[d].coeff;f[d]=null}}if(c==1){a.push(f[e])}else{a.push(c.toString()+"*"+f[e])}}}a.sort();return a.join("or")}function identifyFactors(d){var a,b=0,c=[];for(a=0;a<d.length;a++){if(typeof d[a]=="object"){c.push("("+identifyExpression(d[a])+")^?")}else{b+=d[a]}}if(b>0||c.length==0){c.push(b.toString())}c.sort();return c.join("")}function expandExpression(g){var e,c,b,f,d,a=[];for(e=0;e<g.length;e++){if(g[e].factors.length==1){a.push(g[e])}else{f=expandExpression(g[e].factors[0]);d=expandExpression(g[e].factors[1]);for(c=0;c<f.length;c++){for(b=0;b<d.length;b++){a.push({coeff:g[e].coeff*f[c].coeff*d[b].coeff,factors:f[c].factors.concat(d[b].factors)})}}}}return a}function machineSum(c,a){var b={};b.states=c.states+a.states;b.input=matrixConcat(c.input,a.input);b.output=c.output.concat(a.output);b.jump=matrixConcat(c.jump.concat(zeroMatrix(a.states,c.states)),zeroMatrix(c.states,a.states).concat(a.jump));return b}function machineProduct(c,a){var b={};b.states=c.states+a.states;b.input=matrixConcat(c.input,zeroMatrix(1,a.states));b.output=matrixProduct(c.output,matrixProduct(a.input,a.output)).concat(a.output);b.jump=matrixConcat(c.jump.concat(zeroMatrix(a.states,c.states)),matrixProduct(c.output,matrixProduct(a.input,a.jump)).concat(a.jump));return b}function machineRepeat(c){var a,b=matrixProduct(c.input,c.output);machine={};if(b!=0){throw b}machine.states=c.states+1;machine.input=zeroMatrix(1,machine.states);machine.input[0][0]=1;machine.output=zeroMatrix(machine.states,1);machine.output[0][0]=1;a=matrixProduct(c.jump,c.output);machine.jump=matrixConcat(matrixProduct(c.input,a).concat(a),matrixProduct(c.input,c.jump).concat(c.jump));return machine}function charMachine(c){var a,b={};b.states=c+1;b.input=zeroMatrix(1,b.states);b.input[0][0]=1;b.output=zeroMatrix(b.states,1);b.output[c][0]=1;b.jump=zeroMatrix(b.states,b.states);for(a=0;a<c;a++){b.jump[a][a+1]=1}b.expr=[{coeff:1,factors:[c]}];return b}function isCharMachine0(a){return(a.expr.length==1&&a.expr[0].coeff==1&&a.expr[0].factors.length==1&&a.expr[0].factors[0]==0)}var zeroMachine={states:1,input:[[0]],output:[[0]],jump:[[0]],expr:[{coeff:0,factors:[0]}]};function isZeroMachine(a){return(a.expr.length==1&&a.expr[0].coeff==0)}function matrixProduct(f,e){var d,c,b,a=[];for(d=0;d<f.length;d++){a[d]=[];for(c=0;c<e[0].length;c++){a[d][c]=0;for(b=0;b<e.length;b++){a[d][c]+=f[d][b]*e[b][c]}}}return a}function matrixConcat(d,c){var b,a=[];for(b=0;b<d.length;b++){a[b]=d[b].concat(c[b])}return a}function zeroMatrix(d,e){var c,b,a=[];for(c=0;c<d;c++){a[c]=[];for(b=0;b<e;b++){a[c][b]=0}}return a}function parseExpression(b,d){var c,a,g=[{}];if(b.str.length==0){throw b}for(a=0;a<g.length;a++){skipSpace(b);try{c=b.i;g[a].coeff=parseNumber(b);skipSpace(b);if(b.str[b.i]!="*"){throw b}b.i++;skipSpace(b)}catch(f){b.i=c;g[a].coeff=1}g[a].factors=[parseFactor(b)];skipSpace(b);while(b.i<b.str.length){if(d&&b.str[b.i]==")"){b.i++;return g}else{if(b.str.slice(b.i,b.i+2).toLowerCase()=="or"){b.i+=2;g.push({});break}else{g[a].factors.push(parseFactor(b));skipSpace(b)}}}}if(d){throw b}return g}function parseFactor(a){var c,b={};if(a.str[a.i]=="("){a.i++;b.term=parseExpression(a,true)}else{if(a.str[a.i]=="."){while(a.str[a.i]=="."){a.i++}b.term=[{coeff:1,factors:[{term:1,from:0}]}]}else{b.term=parseNumber(a)}}if(a.str[a.i]=="^"){a.i++;if(a.str[a.i]=="?"){a.i++;b.from=0;b.to=null}else{b.from=parseNumber(a);if(a.str[a.i]=="-"){a.i++;if(a.str[a.i]=="?"){a.i++;b.to=null}else{c=a.i;b.to=parseNumber(a);if(b.to<b.from){a.i=c;throw a}}}else{b.to=b.from}}}else{b.from=1;b.to=1}return b}function parseNumber(a){var b=a.i;while(a.i<a.str.length){if(48<=a.str.charCodeAt(a.i)&&a.str.charCodeAt(a.i)<=57){a.i++}else{break}}if(a.i==b){throw a}return +a.str.slice(b,a.i)}function skipSpace(a){var b=a.str.slice(a.i).search(/[^\s]/);if(b==-1){a.i=a.str.length}else{a.i+=b}}function Sequence(a){this.expr=parseExpression({str:a,i:0},false)}Sequence.prototype.build=function(){this.machine=buildMachine(this.expr);this.reset()};Sequence.prototype.reset=function(){this.current=this.machine.input};Sequence.prototype.next=function(){var a=matrixProduct(this.current,this.machine.output);this.current=matrixProduct(this.current,this.machine.jump);return a};Sequence.prototype.identify=function(){return identifyExpression(this.machine.expr)};