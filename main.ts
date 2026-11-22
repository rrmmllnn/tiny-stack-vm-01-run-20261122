import{readFileSync as f,writeFileSync as w,mkdirSync as m}from"fs"
let F=["a+b","a-b","Math.imul(a,b)","a/b","a%b","u/v","u%v",0,"a&b","a|b","a^b",0,"a<<b","a>>b","a>>>b",0,"a==b","a<b","u<v"].map(s=>s&&Function("a","b","u","v","return "+s+"|0")),o="",V=process.env,A=V.MAKEFUN_INPUT_DIR||"/input",B=V.MAKEFUN_OUTPUT_DIR||"/output"
let R=(P,I)=>{
let S=[],K=[],M=[],p=0,j=0,n=0,a,b
o=""
while(n++<1e6){
if(p<0|p>=P.length)return 9
let c=P[p++],L=c<3?[0,1,4][c]:c>47&c<52?2:0
if(p+L>P.length)return 9
if(c<3){
if(!c)return 0
if(S.length==256)return 3
S.push(c<2?P.readInt8(p++):P.readInt32LE(p)),c<2||(p+=4)
}else if(c<8){
if(S.length<"11223"[c-3])return 2
if(c==3)S.pop()
else if(c==4){if(S.length==256)return 3;S.push(S[S.length-1])}
else if(c==5){a=S.pop();b=S.pop();S.push(a,b)}
else if(c==6){if(S.length==256)return 3;S.push(S[S.length-2])}
else S.push(S.splice(S.length-3,1)[0])
}else if(c>15&c<35){
let g=F[c-16]
if(g){if(S.length<2)return 2;b=S.pop();a=S.pop();if(c>18&c<23&!b)return 4;S.push(g(a,b,a>>>0,b>>>0))}
else if(c==23|c==27){if(!S.length)return 2;a=S.pop();S.push(c==23?-a|0:~a)}
else return 5
}else if(c>47&c<54){
let q=P[p]|P[p+1]<<8
if(c==52){if(!K[0])return 8;p=K.pop()}
else if(c==51){if(K[63])return 7;K.push(p+2);p=q}
else{q=(q<<16)>>16;if(c==48)p+=2+q;else{if(!S.length)return 2;a=S.pop();p+=2;if(!a^(c==50))p+=q}}
}else if(c==64|c==65){
if(S.length<2-(c==64))return 2
a=S.pop()
if(a>>>0>255)return 6
if(c==64)S.push(M[a]|0)
else{b=S.pop();M[a]=b}
}else if(c>79&c<84){
if(c==82){if(S.length==256)return 3;S.push(I[j++]??-1)}
else{if(!S.length)return 2;a=S.pop()
if(c==80){if(o[65536-`${a}`.length])return 11;o+=a}
else if(c==81){if(o[65535])return 11;o+=String.fromCharCode(a&255)}
else return a&255}
}else return 5
}
return 10
}
for(let k=41;--k;){
let d="i0"+("0"+k).slice(-2),y="/"+d+"/",u=A+y,v=B+y,x=R(f(u+"program.bin"),f(u+"input.bin"))
m(v,{recursive:!0})
w(v+"stdout.bin",o,"latin1")
w(v+"exit.txt",x+"")
}
