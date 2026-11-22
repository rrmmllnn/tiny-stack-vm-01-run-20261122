import{mkdirSync,readFileSync,readdirSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input';
const O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(p,inp){
const st=new Int32Array(257),cs=new Int32Array(64),mem=new Int32Array(256),out=[];
let sp=0,cp=0,pc=0,steps=0,ip=0;
for(;;){
if(steps>=1000000)return[10,out];
if(pc<0||pc>=p.length)return[9,out];
const op=p[pc];
let a,b,v,s,off;
switch(op){
case 0:return[0,out];
case 1:
if(pc+2>p.length)return[9,out];
if(sp>=256)return[3,out];
v=p[pc+1];st[sp++]=v<128?v:v-256;pc+=2;break;
case 2:
if(pc+5>p.length)return[9,out];
if(sp>=256)return[3,out];
st[sp++]=p[pc+1]|(p[pc+2]<<8)|(p[pc+3]<<16)|(p[pc+4]<<24);pc+=5;break;
case 3:
if(sp<1)return[2,out];
sp--;pc++;break;
case 4:
if(sp<1)return[2,out];
if(sp>=256)return[3,out];
st[sp]=st[sp-1];sp++;pc++;break;
case 5:
if(sp<2)return[2,out];
v=st[sp-1];st[sp-1]=st[sp-2];st[sp-2]=v;pc++;break;
case 6:
if(sp<2)return[2,out];
if(sp>=256)return[3,out];
st[sp]=st[sp-2];sp++;pc++;break;
case 7:
if(sp<3)return[2,out];
a=st[sp-3];st[sp-3]=st[sp-2];st[sp-2]=st[sp-1];st[sp-1]=a;pc++;break;
case 16:
if(sp<2)return[2,out];
st[sp-2]=(st[sp-2]+st[sp-1])|0;sp--;pc++;break;
case 17:
if(sp<2)return[2,out];
st[sp-2]=(st[sp-2]-st[sp-1])|0;sp--;pc++;break;
case 18:
if(sp<2)return[2,out];
st[sp-2]=Math.imul(st[sp-2],st[sp-1]);sp--;pc++;break;
case 19:
if(sp<2)return[2,out];
a=st[sp-2];b=st[sp-1];
if(b===0)return[4,out];
st[sp-2]=(a/b)|0;sp--;pc++;break;
case 20:
if(sp<2)return[2,out];
a=st[sp-2];b=st[sp-1];
if(b===0)return[4,out];
st[sp-2]=a%b;sp--;pc++;break;
case 21:
if(sp<2)return[2,out];
a=st[sp-2]>>>0;b=st[sp-1]>>>0;
if(b===0)return[4,out];
st[sp-2]=(a/b)|0;sp--;pc++;break;
case 22:
if(sp<2)return[2,out];
a=st[sp-2]>>>0;b=st[sp-1]>>>0;
if(b===0)return[4,out];
st[sp-2]=(a%b)|0;sp--;pc++;break;
case 23:
if(sp<1)return[2,out];
st[sp-1]=(-st[sp-1])|0;pc++;break;
case 24:
if(sp<2)return[2,out];
st[sp-2]=st[sp-2]&st[sp-1];sp--;pc++;break;
case 25:
if(sp<2)return[2,out];
st[sp-2]=st[sp-2]|st[sp-1];sp--;pc++;break;
case 26:
if(sp<2)return[2,out];
st[sp-2]=st[sp-2]^st[sp-1];sp--;pc++;break;
case 27:
if(sp<1)return[2,out];
st[sp-1]=~st[sp-1];pc++;break;
case 28:
if(sp<2)return[2,out];
st[sp-2]=st[sp-2]<<(st[sp-1]&31);sp--;pc++;break;
case 29:
if(sp<2)return[2,out];
st[sp-2]=st[sp-2]>>(st[sp-1]&31);sp--;pc++;break;
case 30:
if(sp<2)return[2,out];
st[sp-2]=(st[sp-2]>>>(st[sp-1]&31))|0;sp--;pc++;break;
case 32:
if(sp<2)return[2,out];
st[sp-2]=st[sp-2]===st[sp-1]?1:0;sp--;pc++;break;
case 33:
if(sp<2)return[2,out];
st[sp-2]=st[sp-2]<st[sp-1]?1:0;sp--;pc++;break;
case 34:
if(sp<2)return[2,out];
st[sp-2]=(st[sp-2]>>>0)<(st[sp-1]>>>0)?1:0;sp--;pc++;break;
case 48:
if(pc+3>p.length)return[9,out];
off=p[pc+1]|(p[pc+2]<<8);if(off>=32768)off-=65536;
pc=pc+3+off;break;
case 49:
if(pc+3>p.length)return[9,out];
if(sp<1)return[2,out];
off=p[pc+1]|(p[pc+2]<<8);if(off>=32768)off-=65536;
v=st[--sp];pc=v===0?pc+3+off:pc+3;break;
case 50:
if(pc+3>p.length)return[9,out];
if(sp<1)return[2,out];
off=p[pc+1]|(p[pc+2]<<8);if(off>=32768)off-=65536;
v=st[--sp];pc=v!==0?pc+3+off:pc+3;break;
case 51:
if(pc+3>p.length)return[9,out];
if(cp>=64)return[7,out];
cs[cp++]=pc+3;pc=p[pc+1]|(p[pc+2]<<8);break;
case 52:
if(cp===0)return[8,out];
pc=cs[--cp];break;
case 64:
if(sp<1)return[2,out];
a=st[sp-1];
if(a<0||a>255)return[6,out];
st[sp-1]=mem[a];pc++;break;
case 65:
if(sp<2)return[2,out];
a=st[sp-1];
if(a<0||a>255)return[6,out];
mem[a]=st[sp-2];sp-=2;pc++;break;
case 80:
if(sp<1)return[2,out];
v=st[--sp];s=String(v);
if(out.length+s.length>65536)return[11,out];
for(let i=0;i<s.length;i++)out.push(s.charCodeAt(i));
pc++;break;
case 81:
if(sp<1)return[2,out];
if(out.length>=65536)return[11,out];
out.push(st[--sp]&255);pc++;break;
case 82:
if(sp>=256)return[3,out];
st[sp++]=ip<inp.length?inp[ip++]:-1;pc++;break;
case 83:
if(sp<1)return[2,out];
return[st[--sp]&255,out];
default:return[5,out];
}
steps++;
}
}
for(const id of readdirSync(I).sort()){
let prog,inp;
try{prog=readFileSync(join(I,id,'program.bin'));}catch{prog=Buffer.alloc(0);}
try{inp=readFileSync(join(I,id,'input.bin'));}catch{inp=Buffer.alloc(0);}
const r=run(prog,inp);
mkdirSync(join(O,id),{recursive:true});
writeFileSync(join(O,id,'stdout.bin'),Buffer.from(r[1]));
writeFileSync(join(O,id,'exit.txt'),String(r[0])+'\n');
}
