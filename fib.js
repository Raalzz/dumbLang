let i = 1;
let n = 25;
let fi = 1;
let fii = 1;
while (i <= n) {
  console.log(fi);
 let temp = fi + fii;
 fi = fii;
 fii = temp;
 i = i + 1; 
}