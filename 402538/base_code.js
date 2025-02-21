function chainRuleDerivative(a){
var b=a.replace(/^\(|\)$/g,""),c=b.split("x^"),d=1;c[0]&&c[0]!==""&&(d=parseFloat(c[0]));
var e=c[1].split(")^"),f=parseFloat(e[0]),g=parseFloat(e[1]);if(isNaN(d)||isNaN(f)||isNaN(g))
throw new Error("Invalid polynomial");
var h=g-1,i=d*f,j=f-1,

k=g+"("+d+"x^"+f+")^"+h+" ("+i+"x";j!==0&&(k+="^"+j),k+=")";

return"The derivative of the polynomial using chain rule is: "+k}
module.exports={chainRuleDerivative};