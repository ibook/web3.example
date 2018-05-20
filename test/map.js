
var set = new Set();  
set.add("a").add("b").add("d").add("c");  
var map = new Map();  
map.set("a",1).set("b",2).set(999,3);  
for (let v of set) {  
    console.log(v);  
}  
console.log("--------------------");  
for(let [k,v] of map) {  
    console.log(k,v);  
}  
