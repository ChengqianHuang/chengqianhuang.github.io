var Kc=0,Rl=1,Qc=2;var or=1,Oa=2,ps=3,Bn=0,Ft=1,Rt=2,fn=0,ms=1,jt=2,Cl=3,Pl=4,jc=5;var Ci=100,eh=101,th=102,nh=103,ih=104,sh=200,rh=201,ah=202,oh=203,Il=204,Ll=205,lh=206,ch=207,hh=208,uh=209,dh=210,fh=211,ph=212,mh=213,gh=214,oa=0,la=1,ca=2,is=3,ha=4,ua=5,da=6,fa=7,Dl=0,xh=1,_h=2,Tn=0,lr=1,cr=2,hr=3,Pi=4,ur=5,dr=6,fr=7;var Ul=300,mi=301,Ii=302,za=303,ka=304,pr=306,pa=1e3,In=1001,ma=1002,At=1003,vh=1004;var mr=1005;var Ht=1006,Ha=1007;var gi=1008;var en=1009,Nl=1010,Fl=1011,gs=1012,Ga=1013,wn=1014,pn=1015,Vt=1016,Va=1017,Wa=1018,xs=1020,Bl=35902,Ol=35899,zl=1021,kl=1022,mn=1023,Ln=1026,xi=1027,_i=1028,Xa=1029,vi=1030,qa=1031;var Ya=1033,gr=33776,xr=33777,_r=33778,vr=33779,Za=35840,Ja=35841,$a=35842,Ka=35843,Qa=36196,ja=37492,eo=37496,to=37488,no=37489,yr=37490,io=37491,so=37808,ro=37809,ao=37810,oo=37811,lo=37812,co=37813,ho=37814,uo=37815,fo=37816,po=37817,mo=37818,go=37819,xo=37820,_o=37821,vo=36492,yo=36494,Mo=36495,So=36283,bo=36284,Mr=36285,Eo=36286;var zs=2300,ga=2301,ra=2302,Ml=2303,Sl=2400,bl=2401,El=2402;var yh=3200;var To=0,Mh=1,Kn="",kt="srgb",ks="srgb-linear",Hs="linear",ct="srgb";var aa=7680;var Sh=519,bh=512,Eh=513,Th=514,wo=515,wh=516,Ah=517,Ao=518,Rh=519,Hl=35044;var Gl="300 es",Mn=2e3,ss=2001;function Lu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Du(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Gs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ch(){let i=Gs("canvas");return i.style.display="block",i}var wc={},rs=null;function Vs(...i){let e="THREE."+i.shift();rs?rs("log",e,...i):console.log(e,...i)}function Ph(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ge(...i){i=Ph(i);let e="THREE."+i.shift();if(rs)rs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function He(...i){i=Ph(i);let e="THREE."+i.shift();if(rs)rs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ai(...i){let e=i.join(" ");e in wc||(wc[e]=!0,Ge(...i))}function Ih(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Lh={[oa]:la,[ca]:da,[ha]:fa,[is]:ua,[la]:oa,[da]:ca,[fa]:ha,[ua]:is},Dn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ko=Math.PI/180,xa=180/Math.PI;function oi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xt[i&255]+Xt[i>>8&255]+Xt[i>>16&255]+Xt[i>>24&255]+"-"+Xt[e&255]+Xt[e>>8&255]+"-"+Xt[e>>16&15|64]+Xt[e>>24&255]+"-"+Xt[t&63|128]+Xt[t>>8&255]+"-"+Xt[t>>16&255]+Xt[t>>24&255]+Xt[n&255]+Xt[n>>8&255]+Xt[n>>16&255]+Xt[n>>24&255]).toLowerCase()}function rt(i,e,t){return Math.max(e,Math.min(t,i))}function Uu(i,e){return(i%e+e)%e}function Qo(i,e,t){return(1-t)*i+t*e}function Pn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function xt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Pe=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},dn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],p=r[a+1],g=r[a+2],S=r[a+3];if(d!==S||l!==u||c!==p||h!==g){let m=l*u+c*p+h*g+d*S;m<0&&(u=-u,p=-p,g=-g,S=-S,m=-m);let f=1-o;if(m<.9995){let M=Math.acos(m),A=Math.sin(M);f=Math.sin(f*M)/A,o=Math.sin(o*M)/A,l=l*f+u*o,c=c*f+p*o,h=h*f+g*o,d=d*f+S*o}else{l=l*f+u*o,c=c*f+p*o,h=h*f+g*o,d=d*f+S*o;let M=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=M,c*=M,h*=M,d*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+h*d+l*p-c*u,e[t+1]=l*g+h*u+c*d-o*p,e[t+2]=c*g+h*p+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:Ge("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(rt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ac.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ac.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return jo.copy(this).projectOnVector(e),this.sub(jo)}reflect(e){return this.sub(jo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},jo=new L,Ac=new dn,We=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],S=s[0],m=s[3],f=s[6],M=s[1],A=s[4],v=s[7],b=s[2],T=s[5],C=s[8];return r[0]=a*S+o*M+l*b,r[3]=a*m+o*A+l*T,r[6]=a*f+o*v+l*C,r[1]=c*S+h*M+d*b,r[4]=c*m+h*A+d*T,r[7]=c*f+h*v+d*C,r[2]=u*S+p*M+g*b,r[5]=u*m+p*A+g*T,r[8]=u*f+p*v+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,p=c*r-a*l,g=t*d+n*u+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/g;return e[0]=d*S,e[1]=(s*c-h*n)*S,e[2]=(o*n-s*a)*S,e[3]=u*S,e[4]=(h*t-s*l)*S,e[5]=(s*r-o*t)*S,e[6]=p*S,e[7]=(n*l-c*t)*S,e[8]=(a*t-n*r)*S,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ai("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(el.makeScale(e,t)),this}rotate(e){return Ai("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(el.makeRotation(-e)),this}translate(e,t){return Ai("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(el.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},el=new We,Rc=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Cc=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nu(){let i={enabled:!0,workingColorSpace:ks,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ct&&(s.r=qn(s.r),s.g=qn(s.g),s.b=qn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ct&&(s.r=ns(s.r),s.g=ns(s.g),s.b=ns(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Kn?Hs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ai("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ai("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ks]:{primaries:e,whitePoint:n,transfer:Hs,toXYZ:Rc,fromXYZ:Cc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:kt},outputColorSpaceConfig:{drawingBufferColorSpace:kt}},[kt]:{primaries:e,whitePoint:n,transfer:ct,toXYZ:Rc,fromXYZ:Cc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:kt}}}),i}var tt=Nu();function qn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ns(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Oi,_a=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Oi===void 0&&(Oi=Gs("canvas")),Oi.width=e.width,Oi.height=e.height;let s=Oi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Oi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Gs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=qn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(qn(t[n]/255)*255):t[n]=qn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ge("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Fu=0,as=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=oi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(tl(s[a].image)):r.push(tl(s[a]))}else r=tl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function tl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?_a.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ge("Texture: Unable to serialize Texture."),{})}var Bu=0,nl=new L,Kt=class i extends Dn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=In,s=In,r=Ht,a=gi,o=mn,l=en,c=i.DEFAULT_ANISOTROPY,h=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bu++}),this.uuid=oi(),this.name="",this.source=new as(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(nl).x}get height(){return this.source.getSize(nl).y}get depth(){return this.source.getSize(nl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ge(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ge(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ul)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case pa:e.x=e.x-Math.floor(e.x);break;case In:e.x=e.x<0?0:1;break;case ma:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case pa:e.y=e.y-Math.floor(e.y);break;case In:e.y=e.y<0?0:1;break;case ma:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Kt.DEFAULT_IMAGE=null;Kt.DEFAULT_MAPPING=Ul;Kt.DEFAULT_ANISOTROPY=1;var Et=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],S=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-S)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+S)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let A=(c+1)/2,v=(p+1)/2,b=(f+1)/2,T=(h+u)/4,C=(d+S)/4,_=(g+m)/4;return A>v&&A>b?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=T/n,r=C/n):v>b?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=_/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=C/r,s=_/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(d-S)*(d-S)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(d-S)/M,this.z=(u-h)/M,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this.w=rt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this.w=rt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},va=class extends Dn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ht,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Et(0,0,e,t),this.scissorTest=!1,this.viewport=new Et(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Kt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ht,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new as(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Dt=class extends va{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ws=class extends Kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=At,this.minFilter=At,this.wrapR=In,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ya=class extends Kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=At,this.minFilter=At,this.wrapR=In,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var pt=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,l,c,h,d,u,p,g,S,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,u,p,g,S,m)}set(e,t,n,s,r,a,o,l,c,h,d,u,p,g,S,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=S,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/zi.setFromMatrixColumn(e,0).length(),r=1/zi.setFromMatrixColumn(e,1).length(),a=1/zi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=a*h,p=a*d,g=o*h,S=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=u-S*c,t[9]=-o*l,t[2]=S-u*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,p=l*d,g=c*h,S=c*d;t[0]=u+S*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=S+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,p=l*d,g=c*h,S=c*d;t[0]=u-S*o,t[4]=-a*d,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=S-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,p=a*d,g=o*h,S=o*d;t[0]=l*h,t[4]=g*c-p,t[8]=u*c+S,t[1]=l*d,t[5]=S*c+u,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,p=a*c,g=o*l,S=o*c;t[0]=l*h,t[4]=S-u*d,t[8]=g*d+p,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*d+g,t[10]=u-S*d}else if(e.order==="XZY"){let u=a*l,p=a*c,g=o*l,S=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+S,t[5]=a*h,t[9]=p*d-g,t[2]=g*d-p,t[6]=o*h,t[10]=S*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ou,e,zu)}lookAt(e,t,n){let s=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),ni.crossVectors(n,sn),ni.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),ni.crossVectors(n,sn)),ni.normalize(),Fr.crossVectors(sn,ni),s[0]=ni.x,s[4]=Fr.x,s[8]=sn.x,s[1]=ni.y,s[5]=Fr.y,s[9]=sn.y,s[2]=ni.z,s[6]=Fr.z,s[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],S=n[6],m=n[10],f=n[14],M=n[3],A=n[7],v=n[11],b=n[15],T=s[0],C=s[4],_=s[8],E=s[12],R=s[1],D=s[5],U=s[9],H=s[13],I=s[2],k=s[6],W=s[10],Y=s[14],ie=s[3],B=s[7],O=s[11],J=s[15];return r[0]=a*T+o*R+l*I+c*ie,r[4]=a*C+o*D+l*k+c*B,r[8]=a*_+o*U+l*W+c*O,r[12]=a*E+o*H+l*Y+c*J,r[1]=h*T+d*R+u*I+p*ie,r[5]=h*C+d*D+u*k+p*B,r[9]=h*_+d*U+u*W+p*O,r[13]=h*E+d*H+u*Y+p*J,r[2]=g*T+S*R+m*I+f*ie,r[6]=g*C+S*D+m*k+f*B,r[10]=g*_+S*U+m*W+f*O,r[14]=g*E+S*H+m*Y+f*J,r[3]=M*T+A*R+v*I+b*ie,r[7]=M*C+A*D+v*k+b*B,r[11]=M*_+A*U+v*W+b*O,r[15]=M*E+A*H+v*Y+b*J,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14],g=e[3],S=e[7],m=e[11],f=e[15],M=l*p-c*u,A=o*p-c*d,v=o*u-l*d,b=a*p-c*h,T=a*u-l*h,C=a*d-o*h;return t*(S*M-m*A+f*v)-n*(g*M-m*b+f*T)+s*(g*A-S*b+f*C)-r*(g*v-S*T+m*C)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],g=e[12],S=e[13],m=e[14],f=e[15],M=t*o-n*a,A=t*l-s*a,v=t*c-r*a,b=n*l-s*o,T=n*c-r*o,C=s*c-r*l,_=h*S-d*g,E=h*m-u*g,R=h*f-p*g,D=d*m-u*S,U=d*f-p*S,H=u*f-p*m,I=M*H-A*U+v*D+b*R-T*E+C*_;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/I;return e[0]=(o*H-l*U+c*D)*k,e[1]=(s*U-n*H-r*D)*k,e[2]=(S*C-m*T+f*b)*k,e[3]=(u*T-d*C-p*b)*k,e[4]=(l*R-a*H-c*E)*k,e[5]=(t*H-s*R+r*E)*k,e[6]=(m*v-g*C-f*A)*k,e[7]=(h*C-u*v+p*A)*k,e[8]=(a*U-o*R+c*_)*k,e[9]=(n*R-t*U-r*_)*k,e[10]=(g*T-S*v+f*M)*k,e[11]=(d*v-h*T-p*M)*k,e[12]=(o*E-a*D-l*_)*k,e[13]=(t*D-n*E+s*_)*k,e[14]=(S*A-g*b-m*M)*k,e[15]=(h*b-d*A+u*M)*k,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,p=r*h,g=r*d,S=a*h,m=a*d,f=o*d,M=l*c,A=l*h,v=l*d,b=n.x,T=n.y,C=n.z;return s[0]=(1-(S+f))*b,s[1]=(p+v)*b,s[2]=(g-A)*b,s[3]=0,s[4]=(p-v)*T,s[5]=(1-(u+f))*T,s[6]=(m+M)*T,s[7]=0,s[8]=(g+A)*C,s[9]=(m-M)*C,s[10]=(1-(u+S))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=zi.set(s[0],s[1],s[2]).length(),o=zi.set(s[4],s[5],s[6]).length(),l=zi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),xn.copy(this);let c=1/a,h=1/o,d=1/l;return xn.elements[0]*=c,xn.elements[1]*=c,xn.elements[2]*=c,xn.elements[4]*=h,xn.elements[5]*=h,xn.elements[6]*=h,xn.elements[8]*=d,xn.elements[9]*=d,xn.elements[10]*=d,t.setFromRotationMatrix(xn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Mn,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),p=(n+s)/(n-s),g,S;if(l)g=r/(a-r),S=a*r/(a-r);else if(o===Mn)g=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===ss)g=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Mn,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),p=-(n+s)/(n-s),g,S;if(l)g=1/(a-r),S=a/(a-r);else if(o===Mn)g=-2/(a-r),S=-(a+r)/(a-r);else if(o===ss)g=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},zi=new L,xn=new pt,Ou=new L(0,0,0),zu=new L(1,1,1),ni=new L,Fr=new L,sn=new L,Pc=new pt,Ic=new dn,li=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-rt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(rt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-rt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(rt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Ge("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Pc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ic.setFromEuler(this),this.setFromQuaternion(Ic,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};li.DEFAULT_ORDER="XYZ";var Xs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},ku=0,Lc=new L,ki=new dn,kn=new pt,Br=new L,Ps=new L,Hu=new L,Gu=new dn,Dc=new L(1,0,0),Uc=new L(0,1,0),Nc=new L(0,0,1),Fc={type:"added"},Vu={type:"removed"},Hi={type:"childadded",child:null},il={type:"childremoved",child:null},Pt=class i extends Dn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new li,n=new dn,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pt},normalMatrix:{value:new We}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ki.setFromAxisAngle(e,t),this.quaternion.multiply(ki),this}rotateOnWorldAxis(e,t){return ki.setFromAxisAngle(e,t),this.quaternion.premultiply(ki),this}rotateX(e){return this.rotateOnAxis(Dc,e)}rotateY(e){return this.rotateOnAxis(Uc,e)}rotateZ(e){return this.rotateOnAxis(Nc,e)}translateOnAxis(e,t){return Lc.copy(e).applyQuaternion(this.quaternion),this.position.add(Lc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Dc,e)}translateY(e){return this.translateOnAxis(Uc,e)}translateZ(e){return this.translateOnAxis(Nc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(kn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Br.copy(e):Br.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kn.lookAt(Ps,Br,this.up):kn.lookAt(Br,Ps,this.up),this.quaternion.setFromRotationMatrix(kn),s&&(kn.extractRotation(s.matrixWorld),ki.setFromRotationMatrix(kn),this.quaternion.premultiply(ki.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(He("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fc),Hi.child=e,this.dispatchEvent(Hi),Hi.child=null):He("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Vu),il.child=e,this.dispatchEvent(il),il.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(kn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fc),Hi.child=e,this.dispatchEvent(Hi),Hi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,e,Hu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,Gu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Pt.DEFAULT_UP=new L(0,1,0);Pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var lt=class extends Pt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Wu={type:"move"},os=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let S of e.hand.values()){let m=t.getJointPose(S,n),f=this._getHandJoint(c,S);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new lt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Dh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ii={h:0,s:0,l:0},Or={h:0,s:0,l:0};function sl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Be=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=Uu(e,1),t=rt(t,0,1),n=rt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=sl(a,r,e+1/3),this.g=sl(a,r,e),this.b=sl(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=kt){function n(r){r!==void 0&&parseFloat(r)<1&&Ge("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ge("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ge("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){let n=Dh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ge("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=qn(e.r),this.g=qn(e.g),this.b=qn(e.b),this}copyLinearToSRGB(e){return this.r=ns(e.r),this.g=ns(e.g),this.b=ns(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return tt.workingToColorSpace(qt.copy(this),e),Math.round(rt(qt.r*255,0,255))*65536+Math.round(rt(qt.g*255,0,255))*256+Math.round(rt(qt.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(qt.copy(this),t);let n=qt.r,s=qt.g,r=qt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(qt.copy(this),t),e.r=qt.r,e.g=qt.g,e.b=qt.b,e}getStyle(e=kt){tt.workingToColorSpace(qt.copy(this),e);let t=qt.r,n=qt.g,s=qt.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ii),this.setHSL(ii.h+e,ii.s+t,ii.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ii),e.getHSL(Or);let n=Qo(ii.h,Or.h,t),s=Qo(ii.s,Or.s,t),r=Qo(ii.l,Or.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qt=new Be;Be.NAMES=Dh;var qs=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Be(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ys=class extends Pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new li,this.environmentIntensity=1,this.environmentRotation=new li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},_n=new L,Hn=new L,rl=new L,Gn=new L,Gi=new L,Vi=new L,Bc=new L,al=new L,ol=new L,ll=new L,cl=new Et,hl=new Et,ul=new Et,Xn=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),_n.subVectors(e,t),s.cross(_n);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){_n.subVectors(s,t),Hn.subVectors(n,t),rl.subVectors(e,t);let a=_n.dot(_n),o=_n.dot(Hn),l=_n.dot(rl),c=Hn.dot(Hn),h=Hn.dot(rl),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,p=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Gn.x),l.addScaledVector(a,Gn.y),l.addScaledVector(o,Gn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return cl.setScalar(0),hl.setScalar(0),ul.setScalar(0),cl.fromBufferAttribute(e,t),hl.fromBufferAttribute(e,n),ul.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(cl,r.x),a.addScaledVector(hl,r.y),a.addScaledVector(ul,r.z),a}static isFrontFacing(e,t,n,s){return _n.subVectors(n,t),Hn.subVectors(e,t),_n.cross(Hn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _n.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),_n.cross(Hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Gi.subVectors(s,n),Vi.subVectors(r,n),al.subVectors(e,n);let l=Gi.dot(al),c=Vi.dot(al);if(l<=0&&c<=0)return t.copy(n);ol.subVectors(e,s);let h=Gi.dot(ol),d=Vi.dot(ol);if(h>=0&&d<=h)return t.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Gi,a);ll.subVectors(e,r);let p=Gi.dot(ll),g=Vi.dot(ll);if(g>=0&&p<=g)return t.copy(r);let S=p*c-l*g;if(S<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Vi,o);let m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return Bc.subVectors(r,s),o=(d-h)/(d-h+(p-g)),t.copy(s).addScaledVector(Bc,o);let f=1/(m+S+u);return a=S*f,o=u*f,t.copy(n).addScaledVector(Gi,a).addScaledVector(Vi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Un=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,vn):vn.fromBufferAttribute(r,a),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zr.copy(n.boundingBox)),zr.applyMatrix4(e.matrixWorld),this.union(zr)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Is),kr.subVectors(this.max,Is),Wi.subVectors(e.a,Is),Xi.subVectors(e.b,Is),qi.subVectors(e.c,Is),si.subVectors(Xi,Wi),ri.subVectors(qi,Xi),bi.subVectors(Wi,qi);let t=[0,-si.z,si.y,0,-ri.z,ri.y,0,-bi.z,bi.y,si.z,0,-si.x,ri.z,0,-ri.x,bi.z,0,-bi.x,-si.y,si.x,0,-ri.y,ri.x,0,-bi.y,bi.x,0];return!dl(t,Wi,Xi,qi,kr)||(t=[1,0,0,0,1,0,0,0,1],!dl(t,Wi,Xi,qi,kr))?!1:(Hr.crossVectors(si,ri),t=[Hr.x,Hr.y,Hr.z],dl(t,Wi,Xi,qi,kr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Vn=[new L,new L,new L,new L,new L,new L,new L,new L],vn=new L,zr=new Un,Wi=new L,Xi=new L,qi=new L,si=new L,ri=new L,bi=new L,Is=new L,kr=new L,Hr=new L,Ei=new L;function dl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ei.fromArray(i,r);let o=s.x*Math.abs(Ei.x)+s.y*Math.abs(Ei.y)+s.z*Math.abs(Ei.z),l=e.dot(Ei),c=t.dot(Ei),h=n.dot(Ei);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Lt=new L,Gr=new Pe,Xu=0,Nt=class extends Dn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Hl,this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Gr.fromBufferAttribute(this,t),Gr.applyMatrix3(e),this.setXY(t,Gr.x,Gr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix3(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array),r=xt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Zs=class extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Js=class extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var it=class extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}},qu=new Un,Ls=new L,fl=new L,ci=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):qu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ls.subVectors(e,this.center);let t=Ls.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ls,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ls.copy(e.center).add(fl)),this.expandByPoint(Ls.copy(e.center).sub(fl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Yu=0,un=new pt,pl=new Pt,Yi=new L,rn=new Un,Ds=new Un,zt=new L,Tt=class i extends Dn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lu(e)?Js:Zs)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new We().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return un.makeRotationFromQuaternion(e),this.applyMatrix4(un),this}rotateX(e){return un.makeRotationX(e),this.applyMatrix4(un),this}rotateY(e){return un.makeRotationY(e),this.applyMatrix4(un),this}rotateZ(e){return un.makeRotationZ(e),this.applyMatrix4(un),this}translate(e,t,n){return un.makeTranslation(e,t,n),this.applyMatrix4(un),this}scale(e,t,n){return un.makeScale(e,t,n),this.applyMatrix4(un),this}lookAt(e){return pl.lookAt(e),pl.updateMatrix(),this.applyMatrix4(pl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yi).negate(),this.translate(Yi.x,Yi.y,Yi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new it(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ge("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Un);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(zt.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(zt),zt.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(zt)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&He('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ci);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ds.setFromBufferAttribute(o),this.morphTargetsRelative?(zt.addVectors(rn.min,Ds.min),rn.expandByPoint(zt),zt.addVectors(rn.max,Ds.max),rn.expandByPoint(zt)):(rn.expandByPoint(Ds.min),rn.expandByPoint(Ds.max))}rn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)zt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(zt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)zt.fromBufferAttribute(o,c),l&&(Yi.fromBufferAttribute(e,c),zt.add(Yi)),s=Math.max(s,n.distanceToSquared(zt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&He('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){He("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Nt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new L,l[_]=new L;let c=new L,h=new L,d=new L,u=new Pe,p=new Pe,g=new Pe,S=new L,m=new L;function f(_,E,R){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,R),u.fromBufferAttribute(r,_),p.fromBufferAttribute(r,E),g.fromBufferAttribute(r,R),h.sub(c),d.sub(c),p.sub(u),g.sub(u);let D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(S.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(D),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(D),o[_].add(S),o[E].add(S),o[R].add(S),l[_].add(m),l[E].add(m),l[R].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let _=0,E=M.length;_<E;++_){let R=M[_],D=R.start,U=R.count;for(let H=D,I=D+U;H<I;H+=3)f(e.getX(H+0),e.getX(H+1),e.getX(H+2))}let A=new L,v=new L,b=new L,T=new L;function C(_){b.fromBufferAttribute(s,_),T.copy(b);let E=o[_];A.copy(E),A.sub(b.multiplyScalar(b.dot(E))).normalize(),v.crossVectors(T,E);let D=v.dot(l[_])<0?-1:1;a.setXYZW(_,A.x,A.y,A.z,D)}for(let _=0,E=M.length;_<E;++_){let R=M[_],D=R.start,U=R.count;for(let H=D,I=D+U;H<I;H+=3)C(e.getX(H+0)),C(e.getX(H+1)),C(e.getX(H+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);let s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,d=new L;if(e)for(let u=0,p=e.count;u<p;u+=3){let g=e.getX(u+0),S=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,S),a.fromBufferAttribute(t,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)zt.fromBufferAttribute(e,t),zt.normalize(),e.setXYZ(t,zt.x,zt.y,zt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),p=0,g=0;for(let S=0,m=l.length;S<m;S++){o.isInterleavedBufferAttribute?p=l[S]*o.data.stride+o.offset:p=l[S]*h;for(let f=0;f<h;f++)u[g++]=c[p++]}return new Nt(u,h,d)}if(this.index===null)return Ge("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],p=e(u,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},$s=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Hl,this.updateRanges=[],this.version=0,this.uuid=oi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=oi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=oi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},$t=new L,ls=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array),r=xt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Vs("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Vs("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ml=new L,Zu=new L,Ju=new We,yn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=ml.subVectors(n,t).cross(Zu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(ml),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ju.getNormalMatrix(e),s=this.coplanarPoint(ml).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},$u=0,Yn=class extends Dn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=oi(),this.name="",this.type="Material",this.blending=ms,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Il,this.blendDst=Ll,this.blendEquation=Ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Be(0,0,0),this.blendAlpha=0,this.depthFunc=is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=aa,this.stencilZFail=aa,this.stencilZPass=aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ge(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ge(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Be().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new yn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Pe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Pe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Sn=class extends Yn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Be(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Zi,Us=new L,Ji=new L,$i=new L,Ki=new Pe,Ns=new Pe,Uh=new pt,Vr=new L,Fs=new L,Wr=new L,Oc=new Pe,gl=new Pe,zc=new Pe,Nn=class extends Pt{constructor(e=new Sn){if(super(),this.isSprite=!0,this.type="Sprite",Zi===void 0){Zi=new Tt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $s(t,5);Zi.setIndex([0,1,2,0,2,3]),Zi.setAttribute("position",new ls(n,3,0,!1)),Zi.setAttribute("uv",new ls(n,2,3,!1))}this.geometry=Zi,this.material=e,this.center=new Pe(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&He('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ji.setFromMatrixScale(this.matrixWorld),Uh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),$i.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ji.multiplyScalar(-$i.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;Xr(Vr.set(-.5,-.5,0),$i,a,Ji,s,r),Xr(Fs.set(.5,-.5,0),$i,a,Ji,s,r),Xr(Wr.set(.5,.5,0),$i,a,Ji,s,r),Oc.set(0,0),gl.set(1,0),zc.set(1,1);let o=e.ray.intersectTriangle(Vr,Fs,Wr,!1,Us);if(o===null&&(Xr(Fs.set(-.5,.5,0),$i,a,Ji,s,r),gl.set(0,1),o=e.ray.intersectTriangle(Vr,Wr,Fs,!1,Us),o===null))return;let l=e.ray.origin.distanceTo(Us);l<e.near||l>e.far||t.push({distance:l,point:Us.clone(),uv:Xn.getInterpolation(Us,Vr,Fs,Wr,Oc,gl,zc,new Pe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Xr(i,e,t,n,s,r){Ki.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ns.x=r*Ki.x-s*Ki.y,Ns.y=s*Ki.x+r*Ki.y):Ns.copy(Ki),i.copy(e),i.x+=Ns.x,i.y+=Ns.y,i.applyMatrix4(Uh)}var Wn=new L,xl=new L,qr=new L,Yr=new L,Ma=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Wn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Wn.copy(this.origin).addScaledVector(this.direction,t),Wn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){xl.copy(e).add(t).multiplyScalar(.5),qr.copy(t).sub(e).normalize(),Yr.copy(this.origin).sub(xl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(qr),o=Yr.dot(this.direction),l=-Yr.dot(qr),c=Yr.lengthSq(),h=Math.abs(1-a*a),d,u,p,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let S=1/h;d*=S,u*=S,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(xl).addScaledVector(qr,u),p}intersectSphere(e,t){if(e.radius<0)return null;Wn.subVectors(e.center,this.origin);let n=Wn.dot(this.direction),s=Wn.dot(Wn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Wn)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,p=e.z-a.z,g=t.x-a.x,S=t.y-a.y,m=t.z-a.z,f=n.x-a.x,M=n.y-a.y,A=n.z-a.z,v=Math.abs(l),b=Math.abs(c),T=Math.abs(h),C,_,E,R,D,U,H,I,k,W,Y,ie;if(v>=b&&v>=T?(E=l,U=d,k=g,ie=f,l>=0?(C=c,_=h,R=u,D=p,H=S,I=m,W=M,Y=A):(C=h,_=c,R=p,D=u,H=m,I=S,W=A,Y=M)):b>=T?(E=c,U=u,k=S,ie=M,c>=0?(C=h,_=l,R=p,D=d,H=m,I=g,W=A,Y=f):(C=l,_=h,R=d,D=p,H=g,I=m,W=f,Y=A)):(E=h,U=p,k=m,ie=A,h>=0?(C=l,_=c,R=d,D=u,H=g,I=S,W=f,Y=M):(C=c,_=l,R=u,D=d,H=S,I=g,W=M,Y=f)),E===0)return null;let B=C/E,O=_/E,J=1/E,ce=R-B*U,Ee=D-O*U,Ye=H-B*k,je=I-O*k,st=W-B*ie,$=Y-O*ie,j=st*je-$*Ye,he=ce*$-Ee*st,ke=Ye*Ee-je*ce;if(s){if(j<0||he<0||ke<0)return null}else if((j<0||he<0||ke<0)&&(j>0||he>0||ke>0))return null;let ye=j+he+ke;if(ye===0)return null;let Oe=J*(j*U+he*k+ke*ie);return(ye>0?Oe<0:Oe>0)?null:this.at(Oe/ye,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},at=class extends Yn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=Dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},kc=new pt,Ti=new Ma,Zr=new ci,Hc=new L,Jr=new L,$r=new L,Kr=new L,_l=new L,Qr=new L,Gc=new L,jr=new L,re=class extends Pt{constructor(e=new Tt,t=new at){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Qr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(_l.fromBufferAttribute(d,e),a?Qr.addScaledVector(_l,h):Qr.addScaledVector(_l.sub(t),h))}t.add(Qr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(r),Ti.copy(e.ray).recast(e.near),!(Zr.containsPoint(Ti.origin)===!1&&(Ti.intersectSphere(Zr,Hc)===null||Ti.origin.distanceToSquared(Hc)>(e.far-e.near)**2))&&(kc.copy(r).invert(),Ti.copy(e.ray).applyMatrix4(kc),!(n.boundingBox!==null&&Ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ti)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){let m=u[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),A=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=M,b=A;v<b;v+=3){let T=o.getX(v),C=o.getX(v+1),_=o.getX(v+2);s=ea(this,f,e,n,c,h,d,T,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),S=Math.min(o.count,p.start+p.count);for(let m=g,f=S;m<f;m+=3){let M=o.getX(m),A=o.getX(m+1),v=o.getX(m+2);s=ea(this,a,e,n,c,h,d,M,A,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){let m=u[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),A=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=M,b=A;v<b;v+=3){let T=v,C=v+1,_=v+2;s=ea(this,f,e,n,c,h,d,T,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),S=Math.min(l.count,p.start+p.count);for(let m=g,f=S;m<f;m+=3){let M=m,A=m+1,v=m+2;s=ea(this,a,e,n,c,h,d,M,A,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Ku(i,e,t,n,s,r,a,o){let l;if(e.side===Ft?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Bn,o),l===null)return null;jr.copy(o),jr.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(jr);return c<t.near||c>t.far?null:{distance:c,point:jr.clone(),object:i}}function ea(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Jr),i.getVertexPosition(l,$r),i.getVertexPosition(c,Kr);let h=Ku(i,e,t,n,Jr,$r,Kr,Gc);if(h){let d=new L;Xn.getBarycoord(Gc,Jr,$r,Kr,d),s&&(h.uv=Xn.getInterpolatedAttribute(s,o,l,c,d,new Pe)),r&&(h.uv1=Xn.getInterpolatedAttribute(r,o,l,c,d,new Pe)),a&&(h.normal=Xn.getInterpolatedAttribute(a,o,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new L,materialIndex:0};Xn.getNormal(Jr,$r,Kr,u.normal),h.face=u,h.barycoord=d}return h}var Zn=class extends Kt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=At,h=At,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var cs=class extends Nt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Qi=new pt,Vc=new pt,ta=[],Wc=new Un,Qu=new pt,Bs=new re,Os=new ci,Jn=class extends re{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new cs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Qu)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Un),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),Wc.copy(e.boundingBox).applyMatrix4(Qi),this.boundingBox.union(Wc)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ci),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),Os.copy(e.boundingSphere).applyMatrix4(Qi),this.boundingSphere.union(Os)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Bs.geometry=this.geometry,Bs.material=this.material,Bs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Os.copy(this.boundingSphere),Os.applyMatrix4(n),e.ray.intersectsSphere(Os)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Qi),Vc.multiplyMatrices(n,Qi),Bs.matrixWorld=Vc,Bs.raycast(e,ta);for(let a=0,o=ta.length;a<o;a++){let l=ta[a];l.instanceId=r,l.object=this,t.push(l)}ta.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new cs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zn(new Float32Array(s*this.count),s,this.count,_i,pn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},wi=new ci,ju=new Pe(.5,.5),na=new L,hs=class{constructor(e=new yn,t=new yn,n=new yn,s=new yn,r=new yn,a=new yn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Mn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],p=r[7],g=r[8],S=r[9],m=r[10],f=r[11],M=r[12],A=r[13],v=r[14],b=r[15];if(s[0].setComponents(c-a,p-h,f-g,b-M).normalize(),s[1].setComponents(c+a,p+h,f+g,b+M).normalize(),s[2].setComponents(c+o,p+d,f+S,b+A).normalize(),s[3].setComponents(c-o,p-d,f-S,b-A).normalize(),n)s[4].setComponents(l,u,m,v).normalize(),s[5].setComponents(c-l,p-u,f-m,b-v).normalize();else if(s[4].setComponents(c-l,p-u,f-m,b-v).normalize(),t===Mn)s[5].setComponents(c+l,p+u,f+m,b+v).normalize();else if(t===ss)s[5].setComponents(l,u,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),wi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wi)}intersectsSprite(e){wi.center.set(0,0,0);let t=ju.distanceTo(e.center);return wi.radius=.7071067811865476+t,wi.applyMatrix4(e.matrixWorld),this.intersectsSphere(wi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(na.x=s.normal.x>0?e.max.x:e.min.x,na.y=s.normal.y>0?e.max.y:e.min.y,na.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(na)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ks=class extends Kt{constructor(e=[],t=mi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},us=class extends Kt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var hi=class extends Kt{constructor(e,t,n=wn,s,r,a,o=At,l=At,c,h=Ln,d=1){if(h!==Ln&&h!==xi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new as(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Sa=class extends hi{constructor(e,t=wn,n=mi,s,r,a=At,o=At,l,c=Ln){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Qs=class extends Kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ut=class i extends Tt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(d,2));function g(S,m,f,M,A,v,b,T,C,_,E){let R=v/C,D=b/_,U=v/2,H=b/2,I=T/2,k=C+1,W=_+1,Y=0,ie=0,B=new L;for(let O=0;O<W;O++){let J=O*D-H;for(let ce=0;ce<k;ce++){let Ee=ce*R-U;B[S]=Ee*M,B[m]=J*A,B[f]=I,c.push(B.x,B.y,B.z),B[S]=0,B[m]=0,B[f]=T>0?1:-1,h.push(B.x,B.y,B.z),d.push(ce/C),d.push(1-O/_),Y+=1}}for(let O=0;O<_;O++)for(let J=0;J<C;J++){let ce=u+J+k*O,Ee=u+J+k*(O+1),Ye=u+(J+1)+k*(O+1),je=u+(J+1)+k*O;l.push(ce,Ee,je),l.push(Ee,Ye,je),ie+=6}o.addGroup(p,ie,E),p+=ie,u+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},ds=class i extends Tt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],h=t/2,d=Math.PI/2*e,u=t,p=2*d+u,g=n*2+r,S=s+1,m=new L,f=new L;for(let M=0;M<=g;M++){let A=0,v=0,b=0,T=0;if(M<=n){let E=M/n,R=E*Math.PI/2;v=-h-e*Math.cos(R),b=e*Math.sin(R),T=-e*Math.cos(R),A=E*d}else if(M<=n+r){let E=(M-n)/r;v=-h+E*t,b=e,T=0,A=d+E*u}else{let E=(M-n-r)/n,R=E*Math.PI/2;v=h+e*Math.sin(R),b=e*Math.cos(R),T=e*Math.sin(R),A=d+u+E*d}let C=Math.max(0,Math.min(1,A/p)),_=0;M===0?_=.5/s:M===g&&(_=-.5/s);for(let E=0;E<=s;E++){let R=E/s,D=R*Math.PI*2,U=Math.sin(D),H=Math.cos(D);f.x=-b*H,f.y=v,f.z=b*U,o.push(f.x,f.y,f.z),m.set(-b*H,T,b*U),m.normalize(),l.push(m.x,m.y,m.z),c.push(R+_,C)}if(M>0){let E=(M-1)*S;for(let R=0;R<s;R++){let D=E+R,U=E+R+1,H=M*S+R,I=M*S+R+1;a.push(D,U,H),a.push(U,I,H)}}}this.setIndex(a),this.setAttribute("position",new it(o,3)),this.setAttribute("normal",new it(l,3)),this.setAttribute("uv",new it(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},Gt=class i extends Tt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],l=[],c=new L,h=new Pe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){let p=n+d/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new it(a,3)),this.setAttribute("normal",new it(o,3)),this.setAttribute("uv",new it(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Qt=class i extends Tt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],p=[],g=0,S=[],m=n/2,f=0;M(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new it(d,3)),this.setAttribute("normal",new it(u,3)),this.setAttribute("uv",new it(p,2));function M(){let v=new L,b=new L,T=0,C=(t-e)/n;for(let _=0;_<=r;_++){let E=[],R=_/r,D=R*(t-e)+e;for(let U=0;U<=s;U++){let H=U/s,I=H*l+o,k=Math.sin(I),W=Math.cos(I);b.x=D*k,b.y=-R*n+m,b.z=D*W,d.push(b.x,b.y,b.z),v.set(k,C,W).normalize(),u.push(v.x,v.y,v.z),p.push(H,1-R),E.push(g++)}S.push(E)}for(let _=0;_<s;_++)for(let E=0;E<r;E++){let R=S[E][_],D=S[E+1][_],U=S[E+1][_+1],H=S[E][_+1];(e>0||E!==0)&&(h.push(R,D,H),T+=3),(t>0||E!==r-1)&&(h.push(D,U,H),T+=3)}c.addGroup(f,T,0),f+=T}function A(v){let b=g,T=new Pe,C=new L,_=0,E=v===!0?e:t,R=v===!0?1:-1;for(let U=1;U<=s;U++)d.push(0,m*R,0),u.push(0,R,0),p.push(.5,.5),g++;let D=g;for(let U=0;U<=s;U++){let I=U/s*l+o,k=Math.cos(I),W=Math.sin(I);C.x=E*W,C.y=m*R,C.z=E*k,d.push(C.x,C.y,C.z),u.push(0,R,0),T.x=k*.5+.5,T.y=W*.5*R+.5,p.push(T.x,T.y),g++}for(let U=0;U<s;U++){let H=b+U,I=D+U;v===!0?h.push(I,I+1,H):h.push(I+1,I,H),_+=3}c.addGroup(f,_,v===!0?1:2),f+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Fn=class i extends Qt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},js=class i extends Tt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new it(r,3)),this.setAttribute("normal",new it(r.slice(),3)),this.setAttribute("uv",new it(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(M){let A=new L,v=new L,b=new L;for(let T=0;T<t.length;T+=3)p(t[T+0],A),p(t[T+1],v),p(t[T+2],b),l(A,v,b,M)}function l(M,A,v,b){let T=b+1,C=[];for(let _=0;_<=T;_++){C[_]=[];let E=M.clone().lerp(v,_/T),R=A.clone().lerp(v,_/T),D=T-_;for(let U=0;U<=D;U++)U===0&&_===T?C[_][U]=E:C[_][U]=E.clone().lerp(R,U/D)}for(let _=0;_<T;_++)for(let E=0;E<2*(T-_)-1;E++){let R=Math.floor(E/2);E%2===0?(u(C[_][R+1]),u(C[_+1][R]),u(C[_][R])):(u(C[_][R+1]),u(C[_+1][R+1]),u(C[_+1][R]))}}function c(M){let A=new L;for(let v=0;v<r.length;v+=3)A.x=r[v+0],A.y=r[v+1],A.z=r[v+2],A.normalize().multiplyScalar(M),r[v+0]=A.x,r[v+1]=A.y,r[v+2]=A.z}function h(){let M=new L;for(let A=0;A<r.length;A+=3){M.x=r[A+0],M.y=r[A+1],M.z=r[A+2];let v=m(M)/2/Math.PI+.5,b=f(M)/Math.PI+.5;a.push(v,1-b)}g(),d()}function d(){for(let M=0;M<a.length;M+=6){let A=a[M+0],v=a[M+2],b=a[M+4],T=Math.max(A,v,b),C=Math.min(A,v,b);T>.9&&C<.1&&(A<.2&&(a[M+0]+=1),v<.2&&(a[M+2]+=1),b<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function p(M,A){let v=M*3;A.x=e[v+0],A.y=e[v+1],A.z=e[v+2]}function g(){let M=new L,A=new L,v=new L,b=new L,T=new Pe,C=new Pe,_=new Pe;for(let E=0,R=0;E<r.length;E+=9,R+=6){M.set(r[E+0],r[E+1],r[E+2]),A.set(r[E+3],r[E+4],r[E+5]),v.set(r[E+6],r[E+7],r[E+8]),T.set(a[R+0],a[R+1]),C.set(a[R+2],a[R+3]),_.set(a[R+4],a[R+5]),b.copy(M).add(A).add(v).divideScalar(3);let D=m(b);S(T,R+0,M,D),S(C,R+2,A,D),S(_,R+4,v,D)}}function S(M,A,v,b){b<0&&M.x===1&&(a[A]=M.x-1),v.x===0&&v.z===0&&(a[A]=b/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function f(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var $n=class i extends js{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var er=class i extends js{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},an=class i extends Tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,p=[],g=[],S=[],m=[];for(let f=0;f<h;f++){let M=f*u-a;for(let A=0;A<c;A++){let v=A*d-r;g.push(v,-M,0),S.push(0,0,1),m.push(A/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let M=0;M<o;M++){let A=M+c*f,v=M+c*(f+1),b=M+1+c*(f+1),T=M+1+c*f;p.push(A,v,T),p.push(v,b,T)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(S,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},bn=class i extends Tt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],h=[],d=e,u=(t-e)/s,p=new L,g=new Pe;for(let S=0;S<=s;S++){for(let m=0;m<=n;m++){let f=r+m/n*a;p.x=d*Math.cos(f),p.y=d*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let S=0;S<s;S++){let m=S*(n+1);for(let f=0;f<n;f++){let M=f+m,A=M,v=M+n+1,b=M+n+2,T=M+1;o.push(A,v,T),o.push(v,b,T)}}this.setIndex(o),this.setAttribute("position",new it(l,3)),this.setAttribute("normal",new it(c,3)),this.setAttribute("uv",new it(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var ht=class i extends Tt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new L,u=new L,p=[],g=[],S=[],m=[];for(let f=0;f<=n;f++){let M=[],A=f/n,v=a+A*o,b=e*Math.cos(v),T=Math.sqrt(e*e-b*b),C=0;f===0&&a===0?C=.5/t:f===n&&l===Math.PI&&(C=-.5/t);for(let _=0;_<=t;_++){let E=_/t,R=s+E*r;d.x=-T*Math.cos(R),d.y=b,d.z=T*Math.sin(R),g.push(d.x,d.y,d.z),u.copy(d).normalize(),S.push(u.x,u.y,u.z),m.push(E+C,1-A),M.push(c++)}h.push(M)}for(let f=0;f<n;f++)for(let M=0;M<t;M++){let A=h[f][M+1],v=h[f][M],b=h[f+1][M],T=h[f+1][M+1];(f!==0||a>0)&&p.push(A,v,T),(f!==n-1||l<Math.PI)&&p.push(v,b,T)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(S,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var En=class i extends Tt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new L,p=new L,g=new L;for(let S=0;S<=n;S++){let m=a+S/n*o;for(let f=0;f<=s;f++){let M=f/s*r;p.x=(e+t*Math.cos(m))*Math.cos(M),p.y=(e+t*Math.cos(m))*Math.sin(M),p.z=t*Math.sin(m),c.push(p.x,p.y,p.z),u.x=e*Math.cos(M),u.y=e*Math.sin(M),g.subVectors(p,u).normalize(),h.push(g.x,g.y,g.z),d.push(f/s),d.push(S/n)}}for(let S=1;S<=n;S++)for(let m=1;m<=s;m++){let f=(s+1)*S+m-1,M=(s+1)*(S-1)+m-1,A=(s+1)*(S-1)+m,v=(s+1)*S+m;l.push(f,M,v),l.push(M,A,v)}this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function Li(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Xc(s))s.isRenderTargetTexture?(Ge("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Xc(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Zt(i){let e={};for(let t=0;t<i.length;t++){let n=Li(i[t]);for(let s in n)e[s]=n[s]}return e}function Xc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function ed(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Vl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var Qn={clone:Li,merge:Zt},td=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,nd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vt=class extends Yn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=td,this.fragmentShader=nd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Li(e.uniforms),this.uniformsGroups=ed(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Be().setHex(s.value);break;case"v2":this.uniforms[n].value=new Pe().fromArray(s.value);break;case"v3":this.uniforms[n].value=new L().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Et().fromArray(s.value);break;case"m3":this.uniforms[n].value=new We().fromArray(s.value);break;case"m4":this.uniforms[n].value=new pt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},fs=class extends vt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Ri=class extends Yn{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Be(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=To,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var ba=class extends Yn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ea=class extends Yn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ji(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function vl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var ui=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ta=class extends ui{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Sl,endingEnd:Sl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case bl:r=e,o=2*t-n;break;case El:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case bl:a=e,l=2*n-t;break;case El:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,g=(n-t)/(s-t),S=g*g,m=S*g,f=-u*m+2*u*S-u*g,M=(1+u)*m+(-1.5-2*u)*S+(-.5+u)*g+1,A=(-1-p)*m+(1.5+p)*S+.5*g,v=p*m-p*S;for(let b=0;b!==o;++b)r[b]=f*a[h+b]+M*a[c+b]+A*a[l+b]+v*a[d+b];return r}},wa=class extends ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},Aa=class extends ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Ra=class extends ui{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-t)/(s-t),S=1-g;for(let m=0;m!==o;++m)r[m]=a[c+m]*S+a[l+m]*g;return r}let u=o*2,p=e-1;for(let g=0;g!==o;++g){let S=a[c+g],m=a[l+g],f=p*u+g*2,M=d[f],A=d[f+1],v=e*u+g*2,b=h[v],T=h[v+1],C=sd(n,t,M,b,s);r[g]=Nh(C,S,A,T,m)}return r}};function Nh(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function id(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function sd(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Nh(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=id(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var on=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ji(t,this.TimeBufferType),this.values=ji(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ji(e.times,Array),values:ji(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),vl(e.settings)&&(n.settings={inTangents:ji(e.settings.inTangents,Array),outTangents:ji(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Aa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new wa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ta(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ra(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case zs:t=this.InterpolantFactoryMethodDiscrete;break;case ga:t=this.InterpolantFactoryMethodLinear;break;case ra:t=this.InterpolantFactoryMethodSmooth;break;case Ml:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ge("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zs;case this.InterpolantFactoryMethodLinear:return ga;case this.InterpolantFactoryMethodSmooth:return ra;case this.InterpolantFactoryMethodBezier:return Ml}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;vl(this.settings)&&(qc(this.settings.inTangents,e),qc(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(He("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(He("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){He("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){He("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Du(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){He("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ra,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*n,u=d-n,p=d+n;for(let g=0;g!==n;++g){let S=t[d+g];if(S!==t[u+g]||S!==t[p+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,u=a*n;for(let p=0;p!==n;++p)t[u+p]=t[d+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,vl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function qc(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}on.prototype.ValueTypeName="";on.prototype.TimeBufferType=Float32Array;on.prototype.ValueBufferType=Float32Array;on.prototype.DefaultInterpolation=ga;var di=class extends on{constructor(e,t,n){super(e,t,n)}};di.prototype.ValueTypeName="bool";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=zs;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;var Ca=class extends on{constructor(e,t,n,s){super(e,t,n,s)}};Ca.prototype.ValueTypeName="color";var Pa=class extends on{constructor(e,t,n,s){super(e,t,n,s)}};Pa.prototype.ValueTypeName="number";var Ia=class extends ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)dn.slerpFlat(r,0,a,c-o,a,c,l);return r}},tr=class extends on{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Ia(this.times,this.values,this.getValueSize(),e)}};tr.prototype.ValueTypeName="quaternion";tr.prototype.InterpolantFactoryMethodSmooth=void 0;var fi=class extends on{constructor(e,t,n){super(e,t,n)}};fi.prototype.ValueTypeName="string";fi.prototype.ValueBufferType=Array;fi.prototype.DefaultInterpolation=zs;fi.prototype.InterpolantFactoryMethodLinear=void 0;fi.prototype.InterpolantFactoryMethodSmooth=void 0;var La=class extends on{constructor(e,t,n,s){super(e,t,n,s)}};La.prototype.ValueTypeName="vector";var Da=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Fh=new Da,Ua=class{constructor(e){this.manager=e!==void 0?e:Fh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ua.DEFAULT_MATERIAL_NAME="__DEFAULT";var nr=class extends Pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Be(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ir=class extends nr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Be(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},yl=new pt,Yc=new L,Zc=new L,Na=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pe(512,512),this.mapType=en,this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hs,this._frameExtents=new Pe(1,1),this._viewportCount=1,this._viewports=[new Et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Yc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yc),Zc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){yl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(yl,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===ss||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(yl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ia=new L,sa=new dn,Cn=new L,sr=class extends Pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=Mn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ia,sa,Cn),Cn.x===1&&Cn.y===1&&Cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,Cn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ia,sa,Cn),Cn.x===1&&Cn.y===1&&Cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,Cn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ai=new L,Jc=new Pe,$c=new Pe,Yt=class extends sr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=xa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ko*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return xa*2*Math.atan(Math.tan(Ko*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ai.x,ai.y).multiplyScalar(-e/ai.z),ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ai.x,ai.y).multiplyScalar(-e/ai.z)}getViewSize(e,t){return this.getViewBounds(e,Jc,$c),t.subVectors($c,Jc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ko*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var pi=class extends sr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Tl=class extends Na{constructor(){super(new pi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},rr=class extends nr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.shadow=new Tl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var es=-90,ts=1,Fa=class extends Pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Yt(es,ts,e,t);s.layers=this.layers,this.add(s);let r=new Yt(es,ts,e,t);r.layers=this.layers,this.add(r);let a=new Yt(es,ts,e,t);a.layers=this.layers,this.add(a);let o=new Yt(es,ts,e,t);o.layers=this.layers,this.add(o);let l=new Yt(es,ts,e,t);l.layers=this.layers,this.add(l);let c=new Yt(es,ts,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Mn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ss)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=S,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ba=class extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ar=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=rd.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function rd(){this._document.hidden===!1&&this.reset()}var Wl="\\[\\]\\.:\\/",ad=new RegExp("["+Wl+"]","g"),Xl="[^"+Wl+"]",od="[^"+Wl.replace("\\.","")+"]",ld=/((?:WC+[\/:])*)/.source.replace("WC",Xl),cd=/(WCOD+)?/.source.replace("WCOD",od),hd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Xl),ud=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Xl),dd=new RegExp("^"+ld+cd+hd+ud+"$"),fd=["material","materials","bones","map"],wl=class{constructor(e,t,n){let s=n||bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},bt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ad,"")}static parseTrackName(e){let t=dd.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);fd.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ge("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){He("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){He("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){He("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){He("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){He("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){He("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){He("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;He("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){He("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){He("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=wl;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var z0=new Float32Array(1);var Al=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};function ql(i,e,t,n){let s=pd(n);switch(t){case zl:return i*e;case _i:return i*e/s.components*s.byteLength;case Xa:return i*e/s.components*s.byteLength;case vi:return i*e*2/s.components*s.byteLength;case qa:return i*e*2/s.components*s.byteLength;case kl:return i*e*3/s.components*s.byteLength;case mn:return i*e*4/s.components*s.byteLength;case Ya:return i*e*4/s.components*s.byteLength;case gr:case xr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case _r:case vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ja:case Ka:return Math.max(i,16)*Math.max(e,8)/4;case Za:case $a:return Math.max(i,8)*Math.max(e,8)/2;case Qa:case ja:case to:case no:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case eo:case yr:case io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case so:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ro:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ao:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case oo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case lo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case co:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ho:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case uo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case fo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case po:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case mo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case go:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case xo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case _o:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case vo:case yo:case Mo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case So:case bo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Mr:case Eo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function pd(i){switch(i){case en:case Nl:return{byteLength:1,components:1};case gs:case Fl:case Vt:return{byteLength:2,components:1};case Va:case Wa:return{byteLength:2,components:4};case wn:case Ga:case pn:return{byteLength:4,components:1};case Bl:case Ol:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ge("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function su(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function vd(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){let g=d[u],S=d[p];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++u,d[u]=S)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){let S=d[p];i.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var yd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Md=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Sd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ed=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Td=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ad=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Cd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Id=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ld=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Dd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ud=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Od=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,kd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Hd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Gd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Vd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,qd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$d="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,jd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ef=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,tf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,sf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,af=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,of=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,uf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,df=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,ff=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_f=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,vf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Mf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Sf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bf=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Ef=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Af=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Rf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,If=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Lf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Df=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Uf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Nf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ff=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Of=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,kf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Hf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Wf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Xf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,qf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Yf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Zf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Jf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$f=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Kf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Qf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ep=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,np=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ip=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,sp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ap=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,op=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,cp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,up=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,mp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,gp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,yp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Mp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ep=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ap=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Rp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Cp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Pp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ip=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Up=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Np=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Fp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Op=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Gp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Vp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,qp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$p=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Kp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,em=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:yd,alphahash_pars_fragment:Md,alphamap_fragment:Sd,alphamap_pars_fragment:bd,alphatest_fragment:Ed,alphatest_pars_fragment:Td,aomap_fragment:wd,aomap_pars_fragment:Ad,batching_pars_vertex:Rd,batching_vertex:Cd,begin_vertex:Pd,beginnormal_vertex:Id,bsdfs:Ld,iridescence_fragment:Dd,bumpmap_pars_fragment:Ud,clipping_planes_fragment:Nd,clipping_planes_pars_fragment:Fd,clipping_planes_pars_vertex:Bd,clipping_planes_vertex:Od,color_fragment:zd,color_pars_fragment:kd,color_pars_vertex:Hd,color_vertex:Gd,common:Vd,cube_uv_reflection_fragment:Wd,defaultnormal_vertex:Xd,displacementmap_pars_vertex:qd,displacementmap_vertex:Yd,emissivemap_fragment:Zd,emissivemap_pars_fragment:Jd,colorspace_fragment:$d,colorspace_pars_fragment:Kd,envmap_fragment:Qd,envmap_common_pars_fragment:jd,envmap_pars_fragment:ef,envmap_pars_vertex:tf,envmap_physical_pars_fragment:ff,envmap_vertex:nf,fog_vertex:sf,fog_pars_vertex:rf,fog_fragment:af,fog_pars_fragment:of,gradientmap_pars_fragment:lf,lightmap_pars_fragment:cf,lights_lambert_fragment:hf,lights_lambert_pars_fragment:uf,lights_pars_begin:df,lights_toon_fragment:pf,lights_toon_pars_fragment:mf,lights_phong_fragment:gf,lights_phong_pars_fragment:xf,lights_physical_fragment:_f,lights_physical_pars_fragment:vf,lights_fragment_begin:yf,lights_fragment_maps:Mf,lights_fragment_end:Sf,lightprobes_pars_fragment:bf,logdepthbuf_fragment:Ef,logdepthbuf_pars_fragment:Tf,logdepthbuf_pars_vertex:wf,logdepthbuf_vertex:Af,map_fragment:Rf,map_pars_fragment:Cf,map_particle_fragment:Pf,map_particle_pars_fragment:If,metalnessmap_fragment:Lf,metalnessmap_pars_fragment:Df,morphinstance_vertex:Uf,morphcolor_vertex:Nf,morphnormal_vertex:Ff,morphtarget_pars_vertex:Bf,morphtarget_vertex:Of,normal_fragment_begin:zf,normal_fragment_maps:kf,normal_pars_fragment:Hf,normal_pars_vertex:Gf,normal_vertex:Vf,normalmap_pars_fragment:Wf,clearcoat_normal_fragment_begin:Xf,clearcoat_normal_fragment_maps:qf,clearcoat_pars_fragment:Yf,iridescence_pars_fragment:Zf,opaque_fragment:Jf,packing:$f,premultiplied_alpha_fragment:Kf,project_vertex:Qf,dithering_fragment:jf,dithering_pars_fragment:ep,roughnessmap_fragment:tp,roughnessmap_pars_fragment:np,shadowmap_pars_fragment:ip,shadowmap_pars_vertex:sp,shadowmap_vertex:rp,shadowmask_pars_fragment:ap,skinbase_vertex:op,skinning_pars_vertex:lp,skinning_vertex:cp,skinnormal_vertex:hp,specularmap_fragment:up,specularmap_pars_fragment:dp,tonemapping_fragment:fp,tonemapping_pars_fragment:pp,transmission_fragment:mp,transmission_pars_fragment:gp,uv_pars_fragment:xp,uv_pars_vertex:_p,uv_vertex:vp,worldpos_vertex:yp,background_vert:Mp,background_frag:Sp,backgroundCube_vert:bp,backgroundCube_frag:Ep,cube_vert:Tp,cube_frag:wp,depth_vert:Ap,depth_frag:Rp,distance_vert:Cp,distance_frag:Pp,equirect_vert:Ip,equirect_frag:Lp,linedashed_vert:Dp,linedashed_frag:Up,meshbasic_vert:Np,meshbasic_frag:Fp,meshlambert_vert:Bp,meshlambert_frag:Op,meshmatcap_vert:zp,meshmatcap_frag:kp,meshnormal_vert:Hp,meshnormal_frag:Gp,meshphong_vert:Vp,meshphong_frag:Wp,meshphysical_vert:Xp,meshphysical_frag:qp,meshtoon_vert:Yp,meshtoon_frag:Zp,points_vert:Jp,points_frag:$p,shadow_vert:Kp,shadow_frag:Qp,sprite_vert:jp,sprite_frag:em},ve={common:{diffuse:{value:new Be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new Be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Be(16777215)},opacity:{value:1},center:{value:new Pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},zn={basic:{uniforms:Zt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Zt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Be(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Zt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Be(0)},specular:{value:new Be(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Zt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Zt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Be(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Zt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Zt([ve.points,ve.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Zt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Zt([ve.common,ve.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Zt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Zt([ve.sprite,ve.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:Zt([ve.common,ve.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:Zt([ve.lights,ve.fog,{color:{value:new Be(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};zn.physical={uniforms:Zt([zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Be(0)},specularColor:{value:new Be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};var Ro={r:0,b:0,g:0},tm=new pt,ru=new We;ru.set(-1,0,0,0,1,0,0,0,1);function nm(i,e,t,n,s,r){let a=new Be(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function p(M){let A=M.isScene===!0?M.background:null;if(A&&A.isTexture){let v=M.backgroundBlurriness>0;A=e.get(A,v)}return A}function g(M){let A=!1,v=p(M);v===null?m(a,o):v&&v.isColor&&(m(v,1),A=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(M,A){let v=p(A);v&&(v.isCubeTexture||v.mapping===pr)?(c===void 0&&(c=new re(new Ut(1,1,1),new vt({name:"BackgroundCubeMaterial",uniforms:Li(zn.backgroundCube.uniforms),vertexShader:zn.backgroundCube.vertexShader,fragmentShader:zn.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(tm.makeRotationFromEuler(A.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(ru),c.material.toneMapped=tt.getTransfer(v.colorSpace)!==ct,(h!==v||d!==v.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new re(new an(2,2),new vt({name:"BackgroundMaterial",uniforms:Li(zn.background.uniforms),vertexShader:zn.background.vertexShader,fragmentShader:zn.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=tt.getTransfer(v.colorSpace)!==ct,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,A){M.getRGB(Ro,Vl(i)),t.buffers.color.setClear(Ro.r,Ro.g,Ro.b,A,r)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,A=1){a.set(M),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:g,addToRenderList:S,dispose:f}}function im(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(D,U,H,I,k){let W=!1,Y=d(D,I,H,U);r!==Y&&(r=Y,c(r.object)),W=p(D,I,H,k),W&&g(D,I,H,k),k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,v(D,U,H,I),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return i.createVertexArray()}function c(D){return i.bindVertexArray(D)}function h(D){return i.deleteVertexArray(D)}function d(D,U,H,I){let k=I.wireframe===!0,W=n[U.id];W===void 0&&(W={},n[U.id]=W);let Y=D.isInstancedMesh===!0?D.id:0,ie=W[Y];ie===void 0&&(ie={},W[Y]=ie);let B=ie[H.id];B===void 0&&(B={},ie[H.id]=B);let O=B[k];return O===void 0&&(O=u(l()),B[k]=O),O}function u(D){let U=[],H=[],I=[];for(let k=0;k<t;k++)U[k]=0,H[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:H,attributeDivisors:I,object:D,attributes:{},index:null}}function p(D,U,H,I){let k=r.attributes,W=U.attributes,Y=0,ie=H.getAttributes();for(let B in ie)if(ie[B].location>=0){let J=k[B],ce=W[B];if(ce===void 0&&(B==="instanceMatrix"&&D.instanceMatrix&&(ce=D.instanceMatrix),B==="instanceColor"&&D.instanceColor&&(ce=D.instanceColor)),J===void 0||J.attribute!==ce||ce&&J.data!==ce.data)return!0;Y++}return r.attributesNum!==Y||r.index!==I}function g(D,U,H,I){let k={},W=U.attributes,Y=0,ie=H.getAttributes();for(let B in ie)if(ie[B].location>=0){let J=W[B];J===void 0&&(B==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),B==="instanceColor"&&D.instanceColor&&(J=D.instanceColor));let ce={};ce.attribute=J,J&&J.data&&(ce.data=J.data),k[B]=ce,Y++}r.attributes=k,r.attributesNum=Y,r.index=I}function S(){let D=r.newAttributes;for(let U=0,H=D.length;U<H;U++)D[U]=0}function m(D){f(D,0)}function f(D,U){let H=r.newAttributes,I=r.enabledAttributes,k=r.attributeDivisors;H[D]=1,I[D]===0&&(i.enableVertexAttribArray(D),I[D]=1),k[D]!==U&&(i.vertexAttribDivisor(D,U),k[D]=U)}function M(){let D=r.newAttributes,U=r.enabledAttributes;for(let H=0,I=U.length;H<I;H++)U[H]!==D[H]&&(i.disableVertexAttribArray(H),U[H]=0)}function A(D,U,H,I,k,W,Y){Y===!0?i.vertexAttribIPointer(D,U,H,k,W):i.vertexAttribPointer(D,U,H,I,k,W)}function v(D,U,H,I){S();let k=I.attributes,W=H.getAttributes(),Y=U.defaultAttributeValues;for(let ie in W){let B=W[ie];if(B.location>=0){let O=k[ie];if(O===void 0&&(ie==="instanceMatrix"&&D.instanceMatrix&&(O=D.instanceMatrix),ie==="instanceColor"&&D.instanceColor&&(O=D.instanceColor)),O!==void 0){let J=O.normalized,ce=O.itemSize,Ee=e.get(O);if(Ee===void 0)continue;let Ye=Ee.buffer,je=Ee.type,st=Ee.bytesPerElement,$=je===i.INT||je===i.UNSIGNED_INT||O.gpuType===Ga;if(O.isInterleavedBufferAttribute){let j=O.data,he=j.stride,ke=O.offset;if(j.isInstancedInterleavedBuffer){for(let ye=0;ye<B.locationSize;ye++)f(B.location+ye,j.meshPerAttribute);D.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ye=0;ye<B.locationSize;ye++)m(B.location+ye);i.bindBuffer(i.ARRAY_BUFFER,Ye);for(let ye=0;ye<B.locationSize;ye++)A(B.location+ye,ce/B.locationSize,je,J,he*st,(ke+ce/B.locationSize*ye)*st,$)}else{if(O.isInstancedBufferAttribute){for(let j=0;j<B.locationSize;j++)f(B.location+j,O.meshPerAttribute);D.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let j=0;j<B.locationSize;j++)m(B.location+j);i.bindBuffer(i.ARRAY_BUFFER,Ye);for(let j=0;j<B.locationSize;j++)A(B.location+j,ce/B.locationSize,je,J,ce*st,ce/B.locationSize*j*st,$)}}else if(Y!==void 0){let J=Y[ie];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(B.location,J);break;case 3:i.vertexAttrib3fv(B.location,J);break;case 4:i.vertexAttrib4fv(B.location,J);break;default:i.vertexAttrib1fv(B.location,J)}}}}M()}function b(){E();for(let D in n){let U=n[D];for(let H in U){let I=U[H];for(let k in I){let W=I[k];for(let Y in W)h(W[Y].object),delete W[Y];delete I[k]}}delete n[D]}}function T(D){if(n[D.id]===void 0)return;let U=n[D.id];for(let H in U){let I=U[H];for(let k in I){let W=I[k];for(let Y in W)h(W[Y].object),delete W[Y];delete I[k]}}delete n[D.id]}function C(D){for(let U in n){let H=n[U];for(let I in H){let k=H[I];if(k[D.id]===void 0)continue;let W=k[D.id];for(let Y in W)h(W[Y].object),delete W[Y];delete k[D.id]}}}function _(D){for(let U in n){let H=n[U],I=D.isInstancedMesh===!0?D.id:0,k=H[I];if(k!==void 0){for(let W in k){let Y=k[W];for(let ie in Y)h(Y[ie].object),delete Y[ie];delete k[W]}delete H[I],Object.keys(H).length===0&&delete n[U]}}}function E(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:R,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:S,enableAttribute:m,disableUnusedAttributes:M}}function sm(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let p=0;p<h;p++)u+=c[p];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function rm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==mn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let _=C===Vt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==en&&C!==pn&&!_&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ge("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ge("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:A,maxFragmentUniforms:v,maxSamples:b,samples:T}}function am(i){let e=this,t=null,n=0,s=!1,r=!1,a=new yn,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let p=d.length!==0||u||n!==0||s;return s=u,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,p){let g=d.clippingPlanes,S=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:n,A=M*4,v=f.clippingState||null;l.value=v,v=h(g,u,A,p);for(let b=0;b!==A;++b)v[b]=t[b];f.clippingState=v,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,p,g){let S=d!==null?d.length:0,m=null;if(S!==0){if(m=l.value,g!==!0||m===null){let f=p+S*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let A=0,v=p;A!==S;++A,v+=4)a.copy(d[A]).applyMatrix4(M,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,m}}var vs=4,om=6,lm=20,cm=256,Sr=new pi,Bh=new Be,Yl=null,Zl=0,Jl=0,$l=!1,hm=new L,Di=new L,Po=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=hm}=r;Yl=this._renderer.getRenderTarget(),Zl=this._renderer.getActiveCubeFace(),Jl=this._renderer.getActiveMipmapLevel(),$l=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Yl,Zl,Jl),this._renderer.xr.enabled=$l,e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===mi||e.mapping===Ii?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Yl=this._renderer.getRenderTarget(),Zl=this._renderer.getActiveCubeFace(),Jl=this._renderer.getActiveMipmapLevel(),$l=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ht,minFilter:Ht,generateMipmaps:!1,type:Vt,format:mn,colorSpace:ks,depthBuffer:!1},s=Oh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oh(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=um(r)),this._blurMaterial=fm(r,e,t),this._ggxMaterial=dm(r,e,t)}return s}_compileMaterial(e){let t=new re(new Tt,e);this._renderer.compile(t,Sr)}_sceneToCubeUV(e,t,n,s,r){let l=new Yt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(Bh),d.toneMapping=Tn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new re(new Ut,new at({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,m=S.material,f=!1,M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,f=!0):(m.color.copy(Bh),f=!0);for(let A=0;A<6;A++){let v=A%3;v===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):v===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));let b=this._cubeSize;_s(s,v*b,A>2?b:0,b,b),d.setRenderTarget(s),f&&d.render(S,l),d.render(e,l)}d.toneMapping=p,d.autoClear=u,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===mi||e.mapping===Ii;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=kh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;_s(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Sr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,p=d*u,{_lodMax:g}=this,S=this._sizeLods[n],m=3*S*(n>g-vs?n-g+vs:0),f=4*(this._cubeSize-S);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,_s(r,m,f,3*S,2*S),s.setRenderTarget(r),s.render(o,Sr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,_s(e,m,f,3*S,2*S),s.setRenderTarget(e),s.render(o,Sr)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-vs?s-this._lodMax+vs:0),u=4*(this._cubeSize-h);_s(t,d,u,3*h,2*h),a.setRenderTarget(t),a.render(l,Sr)}};function um(i){let e=[],t=[],n=i,s=i-vs+1+om;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,p=3,g=new Float32Array(p*u*d),S=new Float32Array(p*u*d);for(let f=0;f<d;f++){let M=f%3*2/3-1,A=f>2?0:-1,v=[M,A,0,M+2/3,A,0,M+2/3,A+1,0,M,A,0,M+2/3,A+1,0,M,A+1,0];g.set(v,p*u*f);for(let b=0;b<u;b++){let T=h[b*2]*2-1,C=h[b*2+1]*2-1;f===0?Di.set(1,C,T):f===1?Di.set(-T,1,-C):f===2?Di.set(-T,C,1):f===3?Di.set(-1,C,-T):f===4?Di.set(-T,-1,C):Di.set(T,C,-1),Di.toArray(S,(f*u+b)*p)}}let m=new Tt;m.setAttribute("position",new Nt(g,p)),m.setAttribute("outputDirection",new Nt(S,p)),t.push(new re(m,null)),n>vs&&n--}return{lodMeshes:t,sizeLods:e}}function Oh(i,e,t){let n=new Dt(i,e,t);return n.texture.mapping=pr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _s(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function dm(i,e,t){return new vt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:cm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Do(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:fn,depthTest:!1,depthWrite:!1})}function fm(i,e,t){return new vt({name:"SphericalGaussianBlur",defines:{SAMPLES:lm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Do(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:fn,depthTest:!1,depthWrite:!1})}function zh(){return new vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Do(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fn,depthTest:!1,depthWrite:!1})}function kh(){return new vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Do(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fn,depthTest:!1,depthWrite:!1})}function Do(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Io=class extends Dt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ks(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ut(5,5,5),r=new vt({name:"CubemapFromEquirect",uniforms:Li(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ft,blending:fn});r.uniforms.tEquirect.value=t;let a=new re(s,r),o=t.minFilter;return t.minFilter===gi&&(t.minFilter=Ht),new Fa(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function pm(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,p=!1){return u==null?null:p?a(u):r(u)}function r(u){if(u&&u.isTexture){let p=u.mapping;if(p===za||p===ka)if(e.has(u)){let g=e.get(u).texture;return o(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let S=new Io(g.height);return S.fromEquirectangularTexture(i,u),e.set(u,S),u.addEventListener("dispose",c),o(S.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let p=u.mapping,g=p===za||p===ka,S=p===mi||p===Ii;if(g||S){let m=t.get(u),f=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==f)return n===null&&(n=new Po(i)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{let M=u.image;return g&&M&&M.height>0||S&&M&&l(M)?(n===null&&(n=new Po(i)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,p){return p===za?u.mapping=mi:p===ka&&(u.mapping=Ii),u}function l(u){let p=0,g=6;for(let S=0;S<g;S++)u[S]!==void 0&&p++;return p===g}function c(u){let p=u.target;p.removeEventListener("dispose",c);let g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function h(u){let p=u.target;p.removeEventListener("dispose",h);let g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function mm(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ai("WebGLRenderer: "+n+" extension not supported."),s}}}function gm(i,e,t,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];let p=r.get(u);p&&(e.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(d){let u=d.attributes;for(let p in u)e.update(u[p],i.ARRAY_BUFFER)}function c(d){let u=[],p=d.index,g=d.attributes.position,S=0;if(g===void 0)return;if(p!==null){let M=p.array;S=p.version;for(let A=0,v=M.length;A<v;A+=3){let b=M[A+0],T=M[A+1],C=M[A+2];u.push(b,T,T,C,C,b)}}else{let M=g.array;S=g.version;for(let A=0,v=M.length/3-1;A<v;A+=3){let b=A+0,T=A+1,C=A+2;u.push(b,T,T,C,C,b)}}let m=new(g.count>=65535?Js:Zs)(u,1);m.version=S;let f=r.get(d);f&&e.remove(f),r.set(d,m)}function h(d){let u=r.get(d);if(u){let p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function xm(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function c(d,u,p){p!==0&&(i.drawElementsInstanced(n,u,r,d*a,p),t.update(u,n,p))}function h(d,u,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,p);let S=0;for(let m=0;m<p;m++)S+=u[m];t.update(S,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function _m(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:He("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function vm(i,e,t){let n=new WeakMap,s=new Et;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let E=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],A=0;p===!0&&(A=1),g===!0&&(A=2),S===!0&&(A=3);let v=o.attributes.position.count*A,b=1;v>e.maxTextureSize&&(b=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let T=new Float32Array(v*b*4*d),C=new Ws(T,v,b,d);C.type=pn,C.needsUpdate=!0;let _=A*4;for(let R=0;R<d;R++){let D=m[R],U=f[R],H=M[R],I=v*b*4*R;for(let k=0;k<D.count;k++){let W=k*_;p===!0&&(s.fromBufferAttribute(D,k),T[I+W+0]=s.x,T[I+W+1]=s.y,T[I+W+2]=s.z,T[I+W+3]=0),g===!0&&(s.fromBufferAttribute(U,k),T[I+W+4]=s.x,T[I+W+5]=s.y,T[I+W+6]=s.z,T[I+W+7]=0),S===!0&&(s.fromBufferAttribute(H,k),T[I+W+8]=s.x,T[I+W+9]=s.y,T[I+W+10]=s.z,T[I+W+11]=H.itemSize===4?s.w:1)}}u={count:d,texture:C,size:new Pe(v,b)},n.set(o,u),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let S=0;S<c.length;S++)p+=c[S];let g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function ym(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var Mm={[lr]:"LINEAR_TONE_MAPPING",[cr]:"REINHARD_TONE_MAPPING",[hr]:"CINEON_TONE_MAPPING",[Pi]:"ACES_FILMIC_TONE_MAPPING",[dr]:"AGX_TONE_MAPPING",[fr]:"NEUTRAL_TONE_MAPPING",[ur]:"CUSTOM_TONE_MAPPING"};function Sm(i,e,t,n,s,r){let a=new Dt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Tt;c.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new it([0,2,0,0,2,0],2));let h=new fs({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new re(c,h),u=new pi(-1,1,1,-1,0,1),p=null,g=null,S=!1,m,f=null,M=[],A=!1;this.setSize=function(v,b){a.setSize(v,b),o!==null&&o.setSize(v,b),l!==null&&l.setSize(v,b);for(let T=0;T<M.length;T++){let C=M[T];C.setSize&&C.setSize(v,b)}},this.setEffects=function(v){M=v,A=M.length>0&&M[0].isRenderPass===!0;let b=a.width,T=a.height;M.length>0&&o===null&&(o=new Dt(b,T,{type:Vt,depthBuffer:!1,stencilBuffer:!1}),l=new Dt(b,T,{type:Vt,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<M.length;C++){let _=M[C];_.setSize&&_.setSize(b,T)}},this.begin=function(v,b){if(S||v.toneMapping===Tn&&M.length===0)return!1;if(f=b,b!==null){let T=b.width,C=b.height;(a.width!==T||a.height!==C)&&this.setSize(T,C)}return A===!1&&v.setRenderTarget(a),m=v.toneMapping,v.toneMapping=Tn,!0},this.hasRenderPass=function(){return A},this.end=function(v,b){v.toneMapping=m,S=!0;let T=a,C=o;for(let _=0;_<M.length;_++){let E=M[_];E.enabled!==!1&&(E.render(v,C,T,b),E.needsSwap!==!1&&(T=C,C=C===o?l:o))}if(p!==v.outputColorSpace||g!==v.toneMapping){p=v.outputColorSpace,g=v.toneMapping,h.defines={},tt.getTransfer(p)===ct&&(h.defines.SRGB_TRANSFER="");let _=Mm[g];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(f),v.render(d,u),f=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var au=new Kt,jl=new hi(1,1),ou=new Ws,lu=new ya,cu=new Ks,Hh=[],Gh=[],Vh=new Float32Array(16),Wh=new Float32Array(9),Xh=new Float32Array(4);function Ms(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Hh[s];if(r===void 0&&(r=new Float32Array(s),Hh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Bt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Uo(i,e){let t=Gh[e];t===void 0&&(t=new Int32Array(e),Gh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function bm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Em(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function Tm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Bt(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function wm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function Am(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Bt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Bt(t,n))return;Xh.set(n),i.uniformMatrix2fv(this.addr,!1,Xh),Ot(t,n)}}function Rm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Bt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Bt(t,n))return;Wh.set(n),i.uniformMatrix3fv(this.addr,!1,Wh),Ot(t,n)}}function Cm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Bt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Bt(t,n))return;Vh.set(n),i.uniformMatrix4fv(this.addr,!1,Vh),Ot(t,n)}}function Pm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Im(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function Lm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function Dm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function Um(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Nm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function Fm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function Bm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function Om(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(jl.compareFunction=t.isReversedDepthBuffer()?Ao:wo,r=jl):r=au,t.setTexture2D(e||r,s)}function zm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||lu,s)}function km(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||cu,s)}function Hm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||ou,s)}function Gm(i){switch(i){case 5126:return bm;case 35664:return Em;case 35665:return Tm;case 35666:return wm;case 35674:return Am;case 35675:return Rm;case 35676:return Cm;case 5124:case 35670:return Pm;case 35667:case 35671:return Im;case 35668:case 35672:return Lm;case 35669:case 35673:return Dm;case 5125:return Um;case 36294:return Nm;case 36295:return Fm;case 36296:return Bm;case 35678:case 36198:case 36298:case 36306:case 35682:return Om;case 35679:case 36299:case 36307:return zm;case 35680:case 36300:case 36308:case 36293:return km;case 36289:case 36303:case 36311:case 36292:return Hm}}function Vm(i,e){i.uniform1fv(this.addr,e)}function Wm(i,e){let t=Ms(e,this.size,2);i.uniform2fv(this.addr,t)}function Xm(i,e){let t=Ms(e,this.size,3);i.uniform3fv(this.addr,t)}function qm(i,e){let t=Ms(e,this.size,4);i.uniform4fv(this.addr,t)}function Ym(i,e){let t=Ms(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Zm(i,e){let t=Ms(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Jm(i,e){let t=Ms(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function $m(i,e){i.uniform1iv(this.addr,e)}function Km(i,e){i.uniform2iv(this.addr,e)}function Qm(i,e){i.uniform3iv(this.addr,e)}function jm(i,e){i.uniform4iv(this.addr,e)}function eg(i,e){i.uniform1uiv(this.addr,e)}function tg(i,e){i.uniform2uiv(this.addr,e)}function ng(i,e){i.uniform3uiv(this.addr,e)}function ig(i,e){i.uniform4uiv(this.addr,e)}function sg(i,e,t){let n=this.cache,s=e.length,r=Uo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=jl:a=au;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function rg(i,e,t){let n=this.cache,s=e.length,r=Uo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||lu,r[a])}function ag(i,e,t){let n=this.cache,s=e.length,r=Uo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||cu,r[a])}function og(i,e,t){let n=this.cache,s=e.length,r=Uo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||ou,r[a])}function lg(i){switch(i){case 5126:return Vm;case 35664:return Wm;case 35665:return Xm;case 35666:return qm;case 35674:return Ym;case 35675:return Zm;case 35676:return Jm;case 5124:case 35670:return $m;case 35667:case 35671:return Km;case 35668:case 35672:return Qm;case 35669:case 35673:return jm;case 5125:return eg;case 36294:return tg;case 36295:return ng;case 36296:return ig;case 35678:case 36198:case 36298:case 36306:case 35682:return sg;case 35679:case 36299:case 36307:return rg;case 35680:case 36300:case 36308:case 36293:return ag;case 36289:case 36303:case 36311:case 36292:return og}}var ec=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gm(t.type)}},tc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lg(t.type)}},nc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Kl=/(\w+)(\])?(\[|\.)?/g;function qh(i,e){i.seq.push(e),i.map[e.id]=e}function cg(i,e,t){let n=i.name,s=n.length;for(Kl.lastIndex=0;;){let r=Kl.exec(n),a=Kl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){qh(t,c===void 0?new ec(o,i,e):new tc(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new nc(o),qh(t,d)),t=d}}}var ys=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);cg(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Yh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var hg=37297,ug=0;function dg(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Zh=new We;function fg(i){tt._getMatrix(Zh,tt.workingColorSpace,i);let e=`mat3( ${Zh.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case Hs:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return Ge("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Jh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+dg(i.getShaderSource(e),o)}else return r}function pg(i,e){let t=fg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var mg={[lr]:"Linear",[cr]:"Reinhard",[hr]:"Cineon",[Pi]:"ACESFilmic",[dr]:"AgX",[fr]:"Neutral",[ur]:"Custom"};function gg(i,e){let t=mg[e];return t===void 0?(Ge("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Co=new L;function xg(){tt.getLuminanceCoefficients(Co);let i=Co.x.toFixed(4),e=Co.y.toFixed(4),t=Co.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _g(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Er).join(`
`)}function vg(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function yg(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Er(i){return i!==""}function $h(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Kh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Mg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ic(i){return i.replace(Mg,bg)}var Sg=new Map;function bg(i,e){let t=Ke[e];if(t===void 0){let n=Sg.get(e);if(n!==void 0)t=Ke[n],Ge('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ic(t)}var Eg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qh(i){return i.replace(Eg,Tg)}function Tg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function jh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var wg={[or]:"SHADOWMAP_TYPE_PCF",[ps]:"SHADOWMAP_TYPE_VSM"};function Ag(i){return wg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Rg={[mi]:"ENVMAP_TYPE_CUBE",[Ii]:"ENVMAP_TYPE_CUBE",[pr]:"ENVMAP_TYPE_CUBE_UV"};function Cg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Rg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Pg={[Ii]:"ENVMAP_MODE_REFRACTION"};function Ig(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Pg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Lg={[Dl]:"ENVMAP_BLENDING_MULTIPLY",[xh]:"ENVMAP_BLENDING_MIX",[_h]:"ENVMAP_BLENDING_ADD"};function Dg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Lg[i.combine]||"ENVMAP_BLENDING_NONE"}function Ug(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Ng(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Ag(t),c=Cg(t),h=Ig(t),d=Dg(t),u=Ug(t),p=_g(t),g=vg(r),S=s.createProgram(),m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Er).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Er).join(`
`),f.length>0&&(f+=`
`)):(m=[jh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Er).join(`
`),f=[jh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Tn?"#define TONE_MAPPING":"",t.toneMapping!==Tn?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Tn?gg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,pg("linearToOutputTexel",t.outputColorSpace),xg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Er).join(`
`)),a=ic(a),a=$h(a,t),a=Kh(a,t),o=ic(o),o=$h(o,t),o=Kh(o,t),a=Qh(a),o=Qh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Gl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let A=M+m+a,v=M+f+o,b=Yh(s,s.VERTEX_SHADER,A),T=Yh(s,s.FRAGMENT_SHADER,v);s.attachShader(S,b),s.attachShader(S,T),t.index0AttributeName!==void 0?s.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function C(D){if(i.debug.checkShaderErrors){let U=s.getProgramInfoLog(S)||"",H=s.getShaderInfoLog(b)||"",I=s.getShaderInfoLog(T)||"",k=U.trim(),W=H.trim(),Y=I.trim(),ie=!0,B=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,b,T);else{let O=Jh(s,b,"vertex"),J=Jh(s,T,"fragment");He("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+k+`
`+O+`
`+J)}else k!==""?Ge("WebGLProgram: Program Info Log:",k):(W===""||Y==="")&&(B=!1);B&&(D.diagnostics={runnable:ie,programLog:k,vertexShader:{log:W,prefix:m},fragmentShader:{log:Y,prefix:f}})}s.deleteShader(b),s.deleteShader(T),_=new ys(s,S),E=yg(s,S)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(S,hg)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ug++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=T,this}var Fg=0,sc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new rc(e),t.set(e,n)),n}},rc=class{constructor(e){this.id=Fg++,this.code=e,this.usedTimes=0}};function Bg(i){return i===vi||i===yr||i===Mr}function Og(i,e,t,n,s,r){let a=new Xs,o=new sc,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function S(_,E,R,D,U,H){let I=D.fog,k=U.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?D.environment:null,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,ie=e.get(_.envMap||W,Y),B=ie&&ie.mapping===pr?ie.image.height:null,O=p[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Ge("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let J=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ce=J!==void 0?J.length:0,Ee=0;k.morphAttributes.position!==void 0&&(Ee=1),k.morphAttributes.normal!==void 0&&(Ee=2),k.morphAttributes.color!==void 0&&(Ee=3);let Ye,je,st,$;if(O){let yt=zn[O];Ye=yt.vertexShader,je=yt.fragmentShader}else{Ye=_.vertexShader,je=_.fragmentShader;let yt=o.getVertexShaderStage(_),ut=o.getFragmentShaderStage(_);o.update(_,yt,ut),st=yt.id,$=ut.id}let j=i.getRenderTarget(),he=i.state.buffers.depth.getReversed(),ke=U.isInstancedMesh===!0,ye=U.isBatchedMesh===!0,Oe=!!_.map,Te=!!_.matcap,Z=!!ie,ne=!!_.aoMap,oe=!!_.lightMap,ae=!!_.bumpMap&&_.wireframe===!1,Fe=!!_.normalMap,Je=!!_.displacementMap,fe=!!_.emissiveMap,mt=!!_.metalnessMap,ue=!!_.roughnessMap,P=_.anisotropy>0,et=_.clearcoat>0,Ze=_.dispersion>0,w=_.retroreflectivity>0,x=_.iridescence>0,z=_.sheen>0,X=_.transmission>0,K=P&&!!_.anisotropyMap,le=et&&!!_.clearcoatMap,de=et&&!!_.clearcoatNormalMap,Q=et&&!!_.clearcoatRoughnessMap,te=x&&!!_.iridescenceMap,pe=x&&!!_.iridescenceThicknessMap,De=z&&!!_.sheenColorMap,_e=z&&!!_.sheenRoughnessMap,me=!!_.specularMap,Ue=!!_.specularColorMap,ze=!!_.specularIntensityMap,qe=X&&!!_.transmissionMap,F=X&&!!_.thicknessMap,ge=!!_.gradientMap,ee=!!_.alphaMap,xe=_.alphaTest>0,be=!!_.alphaHash,se=!!_.extensions,Ne=Tn;_.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ne=i.toneMapping);let Ie={shaderID:O,shaderType:_.type,shaderName:_.name,vertexShader:Ye,fragmentShader:je,defines:_.defines,customVertexShaderID:st,customFragmentShaderID:$,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:ye,batchingColor:ye&&U._colorsTexture!==null,instancing:ke,instancingColor:ke&&U.instanceColor!==null,instancingMorph:ke&&U.morphTexture!==null,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:tt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Oe,matcap:Te,envMap:Z,envMapMode:Z&&ie.mapping,envMapCubeUVHeight:B,aoMap:ne,lightMap:oe,bumpMap:ae,normalMap:Fe,displacementMap:Je,emissiveMap:fe,normalMapObjectSpace:Fe&&_.normalMapType===Mh,normalMapTangentSpace:Fe&&_.normalMapType===To,packedNormalMap:Fe&&_.normalMapType===To&&Bg(_.normalMap.format),metalnessMap:mt,roughnessMap:ue,anisotropy:P,anisotropyMap:K,clearcoat:et,clearcoatMap:le,clearcoatNormalMap:de,clearcoatRoughnessMap:Q,dispersion:Ze,retroreflection:w,iridescence:x,iridescenceMap:te,iridescenceThicknessMap:pe,sheen:z,sheenColorMap:De,sheenRoughnessMap:_e,specularMap:me,specularColorMap:Ue,specularIntensityMap:ze,transmission:X,transmissionMap:qe,thicknessMap:F,gradientMap:ge,opaque:_.transparent===!1&&_.blending===ms&&_.alphaToCoverage===!1,alphaMap:ee,alphaTest:xe,alphaHash:be,combine:_.combine,mapUv:Oe&&g(_.map.channel),aoMapUv:ne&&g(_.aoMap.channel),lightMapUv:oe&&g(_.lightMap.channel),bumpMapUv:ae&&g(_.bumpMap.channel),normalMapUv:Fe&&g(_.normalMap.channel),displacementMapUv:Je&&g(_.displacementMap.channel),emissiveMapUv:fe&&g(_.emissiveMap.channel),metalnessMapUv:mt&&g(_.metalnessMap.channel),roughnessMapUv:ue&&g(_.roughnessMap.channel),anisotropyMapUv:K&&g(_.anisotropyMap.channel),clearcoatMapUv:le&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:de&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:De&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:_e&&g(_.sheenRoughnessMap.channel),specularMapUv:me&&g(_.specularMap.channel),specularColorMapUv:Ue&&g(_.specularColorMap.channel),specularIntensityMapUv:ze&&g(_.specularIntensityMap.channel),transmissionMapUv:qe&&g(_.transmissionMap.channel),thicknessMapUv:F&&g(_.thicknessMap.channel),alphaMapUv:ee&&g(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Fe||P),vertexNormals:!!k.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!k.attributes.uv&&(Oe||ee),fog:!!I,useFog:_.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||k.attributes.normal===void 0&&Fe===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:he,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:Ee,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ne,decodeVideoTexture:Oe&&_.map.isVideoTexture===!0&&tt.getTransfer(_.map.colorSpace)===ct,decodeVideoTextureEmissive:fe&&_.emissiveMap.isVideoTexture===!0&&tt.getTransfer(_.emissiveMap.colorSpace)===ct,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Rt,flipSided:_.side===Ft,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||ye)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ie.vertexUv1s=l.has(1),Ie.vertexUv2s=l.has(2),Ie.vertexUv3s=l.has(3),l.clear(),Ie}function m(_){let E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)E.push(R),E.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(f(E,_),M(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function f(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numSunLights),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numSunLightShadows),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function M(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function A(_){let E=p[_.type],R;if(E){let D=zn[E];R=Qn.clone(D.uniforms)}else R=_.uniforms;return R}function v(_,E){let R=h.get(E);return R!==void 0?++R.usedTimes:(R=new Ng(i,E,_,s),c.push(R),h.set(E,R)),R}function b(_){if(--_.usedTimes===0){let E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function C(){o.dispose()}return{getParameters:S,getProgramCacheKey:m,getUniforms:A,acquireProgram:v,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:C}}function zg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function kg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function eu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function tu(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let p=0;return u.isInstancedMesh&&(p+=2),u.isSkinnedMesh&&(p+=1),p}function o(u,p,g,S,m,f){let M=i[e];return M===void 0?(M={id:u.id,object:u,geometry:p,material:g,materialVariant:a(u),groupOrder:S,renderOrder:u.renderOrder,z:m,group:f},i[e]=M):(M.id=u.id,M.object=u,M.geometry=p,M.material=g,M.materialVariant=a(u),M.groupOrder=S,M.renderOrder=u.renderOrder,M.z=m,M.group=f),e++,M}function l(u,p,g,S,m,f,M){M.reversedDepth===!0&&(m=-m);let A=o(u,p,g,S,m,f);g.transmission>0?n.push(A):g.transparent===!0?s.push(A):t.push(A)}function c(u,p,g,S,m,f){let M=o(u,p,g,S,m,f);g.transmission>0?n.unshift(M):g.transparent===!0?s.unshift(M):t.unshift(M)}function h(u,p){t.length>1&&t.sort(u||kg),n.length>1&&n.sort(p||eu),s.length>1&&s.sort(p||eu)}function d(){for(let u=e,p=i.length;u<p;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Hg(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new tu,i.set(n,[a])):s>=r.length?(a=new tu,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Gg(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new Be};break;case"SpotLight":t={position:new L,direction:new L,color:new Be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Be,groundColor:new Be};break;case"RectAreaLight":t={color:new Be,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function Vg(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Wg=0;function Xg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function qg(i){let e=new Gg,t=Vg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new pt,a=new pt;function o(c){let h=0,d=0,u=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let p=0,g=0,S=0,m=0,f=0,M=0,A=0,v=0,b=0,T=0,C=0,_=0,E=0,R=0;c.sort(Xg);for(let U=0,H=c.length;U<H;U++){let I=c[U],k=I.color,W=I.intensity,Y=I.distance,ie=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===vi?ie=I.shadow.map.texture:ie=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=k.r*W,d+=k.g*W,u+=k.b*W;else if(I.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(I.sh.coefficients[B],W);R++}else if(I.isSunLight){let B=e.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let O=I.shadow,J=t.get(I);J.shadowIntensity=O.intensity,J.shadowBias=O.bias,J.shadowNormalBias=O.normalBias,J.shadowRadius=O.radius,J.shadowMapSize.copy(O.mapSize).multiply(O.getFrameExtents()),n.sunShadow[g]=J,n.sunShadowMap[g]=ie;let ce=O.getViewportCount();for(let Ee=0;Ee<ce;Ee++)n.sunShadowMatrix[S+Ee]=O.getMatrix(Ee),n.sunShadowCascade[S+Ee]=O._cascadeData[Ee];S+=ce,g++}n.sun[p]=B,p++}else if(I.isDirectionalLight){let B=e.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let O=I.shadow,J=t.get(I);J.shadowIntensity=O.intensity,J.shadowBias=O.bias,J.shadowNormalBias=O.normalBias,J.shadowRadius=O.radius,J.shadowMapSize=O.mapSize,n.directionalShadow[m]=J,n.directionalShadowMap[m]=ie,n.directionalShadowMatrix[m]=I.shadow.matrix,b++}n.directional[m]=B,m++}else if(I.isSpotLight){let B=e.get(I);B.position.setFromMatrixPosition(I.matrixWorld),B.color.copy(k).multiplyScalar(W),B.distance=Y,B.coneCos=Math.cos(I.angle),B.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),B.decay=I.decay,n.spot[M]=B;let O=I.shadow;if(I.map&&(n.spotLightMap[_]=I.map,_++,O.updateMatrices(I),I.castShadow&&E++),n.spotLightMatrix[M]=O.matrix,I.castShadow){let J=t.get(I);J.shadowIntensity=O.intensity,J.shadowBias=O.bias,J.shadowNormalBias=O.normalBias,J.shadowRadius=O.radius,J.shadowMapSize=O.mapSize,n.spotShadow[M]=J,n.spotShadowMap[M]=ie,C++}M++}else if(I.isRectAreaLight){let B=e.get(I);B.color.copy(k).multiplyScalar(W),B.halfWidth.set(I.width*.5,0,0),B.halfHeight.set(0,I.height*.5,0),n.rectArea[A]=B,A++}else if(I.isPointLight){let B=e.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),B.distance=I.distance,B.decay=I.decay,I.castShadow){let O=I.shadow,J=t.get(I);J.shadowIntensity=O.intensity,J.shadowBias=O.bias,J.shadowNormalBias=O.normalBias,J.shadowRadius=O.radius,J.shadowMapSize=O.mapSize,J.shadowCameraNear=O.camera.near,J.shadowCameraFar=O.camera.far,n.pointShadow[f]=J,n.pointShadowMap[f]=ie,n.pointShadowMatrix[f]=I.shadow.matrix,T++}n.point[f]=B,f++}else if(I.isHemisphereLight){let B=e.get(I);B.skyColor.copy(I.color).multiplyScalar(W),B.groundColor.copy(I.groundColor).multiplyScalar(W),n.hemi[v]=B,v++}}A>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let D=n.hash;(D.sunLength!==p||D.directionalLength!==m||D.pointLength!==f||D.spotLength!==M||D.rectAreaLength!==A||D.hemiLength!==v||D.numSunShadows!==g||D.numDirectionalShadows!==b||D.numPointShadows!==T||D.numSpotShadows!==C||D.numSpotMaps!==_||D.numLightProbes!==R)&&(n.sun.length=p,n.directional.length=m,n.spot.length=M,n.rectArea.length=A,n.point.length=f,n.hemi.length=v,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=S,n.sunShadowCascade.length=S,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+_-E,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=R,D.sunLength=p,D.directionalLength=m,D.pointLength=f,D.spotLength=M,D.rectAreaLength=A,D.hemiLength=v,D.numSunShadows=g,D.numDirectionalShadows=b,D.numPointShadows=T,D.numSpotShadows=C,D.numSpotMaps=_,D.numLightProbes=R,n.version=Wg++)}function l(c,h){let d=0,u=0,p=0,g=0,S=0,m=0,f=h.matrixWorldInverse;for(let M=0,A=c.length;M<A;M++){let v=c[M];if(v.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(f),d++}else if(v.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),u++}else if(v.isSpotLight){let b=n.spot[g];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(f),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),g++}else if(v.isRectAreaLight){let b=n.rectArea[S];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(f),a.identity(),r.copy(v.matrixWorld),r.premultiply(f),a.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),S++}else if(v.isPointLight){let b=n.point[p];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(f),p++}else if(v.isHemisphereLight){let b=n.hemi[m];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(f),m++}}}return{setup:o,setupView:l,state:n}}function nu(i){let e=new qg(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Yg(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new nu(i),e.set(s,[o])):r>=a.length?(o=new nu(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Jg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,$g=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Kg=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],iu=new pt,br=new L,Ql=new L;function Qg(i,e,t){let n=new hs,s=new Pe,r=new Pe,a=new Et,o=new ba,l=new Ea,c={},h=t.maxTextureSize,d={[Bn]:Ft,[Ft]:Bn,[Rt]:Rt},u=new vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pe},radius:{value:4}},vertexShader:Zg,fragmentShader:Jg}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let g=new Tt;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new re(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=or;let f=this.type;this.render=function(T,C,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Oa&&(Ge("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=or);let E=i.getRenderTarget(),R=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),U=i.state;U.setBlending(fn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let H=f!==this.type;H&&C.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(k=>k.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,k=T.length;I<k;I++){let W=T[I],Y=W.shadow;if(Y===void 0){Ge("WebGLShadowMap:",W,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let ie=Y.getFrameExtents();s.multiply(ie),r.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ie.x),s.x=r.x*ie.x,Y.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ie.y),s.y=r.y*ie.y,Y.mapSize.y=r.y));let B=i.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=B,Y.map===null||H===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===ps){if(W.isPointLight){Ge("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Dt(s.x,s.y,{format:vi,type:Vt,minFilter:Ht,magFilter:Ht,generateMipmaps:!1}),Y.map.texture.name=W.name+".shadowMap",Y.map.depthTexture=new hi(s.x,s.y,pn),Y.map.depthTexture.name=W.name+".shadowMapDepth",Y.map.depthTexture.format=Ln,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=At,Y.map.depthTexture.magFilter=At}else W.isPointLight?(Y.map=new Io(s.x),Y.map.depthTexture=new Sa(s.x,wn)):(Y.map=new Dt(s.x,s.y),Y.map.depthTexture=new hi(s.x,s.y,wn)),Y.map.depthTexture.name=W.name+".shadowMap",Y.map.depthTexture.format=Ln,this.type===or?(Y.map.depthTexture.compareFunction=B?Ao:wo,Y.map.depthTexture.minFilter=Ht,Y.map.depthTexture.magFilter=Ht):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=At,Y.map.depthTexture.magFilter=At);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==s.x||Y.map.height!==s.y)&&Y.map.setSize(s.x,s.y);let O=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();W.isPointLight!==!0&&Y.updateMatrices(W,_);for(let J=0;J<O;J++){let ce=Y.getCamera(J);if(W.isPointLight){let Ee=Y.camera,Ye=Y.matrix,je=W.distance||Ee.far;je!==Ee.far&&(Ee.far=je,Ee.updateProjectionMatrix()),br.setFromMatrixPosition(W.matrixWorld),Ee.position.copy(br),Ql.copy(Ee.position),Ql.add($g[J]),Ee.up.copy(Kg[J]),Ee.lookAt(Ql),Ee.updateMatrixWorld(),Ye.makeTranslation(-br.x,-br.y,-br.z),iu.multiplyMatrices(Ee.projectionMatrix,Ee.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(iu,Ee.coordinateSystem,Ee.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,J),i.clear();else{J===0&&(i.setRenderTarget(Y.map),i.clear());let Ee=Y.getViewport(J);a.set(r.x*Ee.x,r.y*Ee.y,r.x*Ee.z,r.y*Ee.w),U.viewport(a)}n=Y.getFrustum(J),v(C,_,ce,W,this.type)}Y.isPointLightShadow!==!0&&this.type===ps&&M(Y,_),Y.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(E,R,D)};function M(T,C){let _=e.update(S);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null?T.mapPass=new Dt(s.x,s.y,{format:vi,type:Vt}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(C,null,_,u,S,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value.set(T.map.width,T.map.height),p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(C,null,_,p,S,null)}function A(T,C,_,E){let R=null,D=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)R=D;else if(R=_.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let U=R.uuid,H=C.uuid,I=c[U];I===void 0&&(I={},c[U]=I);let k=I[H];k===void 0&&(k=R.clone(),I[H]=k,C.addEventListener("dispose",b)),R=k}if(R.visible=C.visible,R.wireframe=C.wireframe,E===ps?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:d[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let U=i.properties.get(R);U.light=_}return R}function v(T,C,_,E,R){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===ps)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);let H=e.update(T),I=T.material;if(Array.isArray(I)){let k=H.groups;for(let W=0,Y=k.length;W<Y;W++){let ie=k[W],B=I[ie.materialIndex];if(B&&B.visible){let O=A(T,B,E,R);T.onBeforeShadow(i,T,C,_,H,O,ie),i.renderBufferDirect(_,null,H,O,T,ie),T.onAfterShadow(i,T,C,_,H,O,ie)}}}else if(I.visible){let k=A(T,I,E,R);T.onBeforeShadow(i,T,C,_,H,k,null),i.renderBufferDirect(_,null,H,k,T,null),T.onAfterShadow(i,T,C,_,H,k,null)}}let U=T.children;for(let H=0,I=U.length;H<I;H++)v(U[H],C,_,E,R)}function b(T){T.target.removeEventListener("dispose",b);for(let _ in c){let E=c[_],R=T.target.uuid;R in E&&(E[R].dispose(),delete E[R])}}}function jg(i,e){function t(){let F=!1,ge=new Et,ee=null,xe=new Et(0,0,0,0);return{setMask:function(be){ee!==be&&!F&&(i.colorMask(be,be,be,be),ee=be)},setLocked:function(be){F=be},setClear:function(be,se,Ne,Ie,yt){yt===!0&&(be*=Ie,se*=Ie,Ne*=Ie),ge.set(be,se,Ne,Ie),xe.equals(ge)===!1&&(i.clearColor(be,se,Ne,Ie),xe.copy(ge))},reset:function(){F=!1,ee=null,xe.set(-1,0,0,0)}}}function n(){let F=!1,ge=!1,ee=null,xe=null,be=null;return{setReversed:function(se){if(ge!==se){let Ne=e.get("EXT_clip_control");se?Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.ZERO_TO_ONE_EXT):Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.NEGATIVE_ONE_TO_ONE_EXT),ge=se;let Ie=be;be=null,this.setClear(Ie)}},getReversed:function(){return ge},setTest:function(se){se?j(i.DEPTH_TEST):he(i.DEPTH_TEST)},setMask:function(se){ee!==se&&!F&&(i.depthMask(se),ee=se)},setFunc:function(se){if(ge&&(se=Lh[se]),xe!==se){switch(se){case oa:i.depthFunc(i.NEVER);break;case la:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case is:i.depthFunc(i.LEQUAL);break;case ha:i.depthFunc(i.EQUAL);break;case ua:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xe=se}},setLocked:function(se){F=se},setClear:function(se){be!==se&&(be=se,ge&&(se=1-se),i.clearDepth(se))},reset:function(){F=!1,ee=null,xe=null,be=null,ge=!1}}}function s(){let F=!1,ge=null,ee=null,xe=null,be=null,se=null,Ne=null,Ie=null,yt=null;return{setTest:function(ut){F||(ut?j(i.STENCIL_TEST):he(i.STENCIL_TEST))},setMask:function(ut){ge!==ut&&!F&&(i.stencilMask(ut),ge=ut)},setFunc:function(ut,gn,An){(ee!==ut||xe!==gn||be!==An)&&(i.stencilFunc(ut,gn,An),ee=ut,xe=gn,be=An)},setOp:function(ut,gn,An){(se!==ut||Ne!==gn||Ie!==An)&&(i.stencilOp(ut,gn,An),se=ut,Ne=gn,Ie=An)},setLocked:function(ut){F=ut},setClear:function(ut){yt!==ut&&(i.clearStencil(ut),yt=ut)},reset:function(){F=!1,ge=null,ee=null,xe=null,be=null,se=null,Ne=null,Ie=null,yt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},p=new WeakMap,g=[],S=null,m=!1,f=null,M=null,A=null,v=null,b=null,T=null,C=null,_=new Be(0,0,0),E=0,R=!1,D=null,U=null,H=null,I=null,k=null,W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,ie=0,B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(B)[1]),Y=ie>=1):B.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),Y=ie>=2);let O=null,J={},ce=i.getParameter(i.SCISSOR_BOX),Ee=i.getParameter(i.VIEWPORT),Ye=new Et().fromArray(ce),je=new Et().fromArray(Ee);function st(F,ge,ee,xe){let be=new Uint8Array(4),se=i.createTexture();i.bindTexture(F,se),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ne=0;Ne<ee;Ne++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(ge,0,i.RGBA,1,1,xe,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(ge+Ne,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return se}let $={};$[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),j(i.DEPTH_TEST),a.setFunc(is),ae(!1),Fe(Rl),j(i.CULL_FACE),ne(fn);function j(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function he(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function ke(F,ge){return u[F]!==ge?(i.bindFramebuffer(F,ge),u[F]=ge,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ge),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ge),!0):!1}function ye(F,ge){let ee=g,xe=!1;if(F){ee=p.get(ge),ee===void 0&&(ee=[],p.set(ge,ee));let be=F.textures;if(ee.length!==be.length||ee[0]!==i.COLOR_ATTACHMENT0){for(let se=0,Ne=be.length;se<Ne;se++)ee[se]=i.COLOR_ATTACHMENT0+se;ee.length=be.length,xe=!0}}else ee[0]!==i.BACK&&(ee[0]=i.BACK,xe=!0);xe&&i.drawBuffers(ee)}function Oe(F){return S!==F?(i.useProgram(F),S=F,!0):!1}let Te={[Ci]:i.FUNC_ADD,[eh]:i.FUNC_SUBTRACT,[th]:i.FUNC_REVERSE_SUBTRACT};Te[nh]=i.MIN,Te[ih]=i.MAX;let Z={[sh]:i.ZERO,[rh]:i.ONE,[ah]:i.SRC_COLOR,[Il]:i.SRC_ALPHA,[dh]:i.SRC_ALPHA_SATURATE,[hh]:i.DST_COLOR,[lh]:i.DST_ALPHA,[oh]:i.ONE_MINUS_SRC_COLOR,[Ll]:i.ONE_MINUS_SRC_ALPHA,[uh]:i.ONE_MINUS_DST_COLOR,[ch]:i.ONE_MINUS_DST_ALPHA,[fh]:i.CONSTANT_COLOR,[ph]:i.ONE_MINUS_CONSTANT_COLOR,[mh]:i.CONSTANT_ALPHA,[gh]:i.ONE_MINUS_CONSTANT_ALPHA};function ne(F,ge,ee,xe,be,se,Ne,Ie,yt,ut){if(F===fn){m===!0&&(he(i.BLEND),m=!1);return}if(m===!1&&(j(i.BLEND),m=!0),F!==jc){if(F!==f||ut!==R){if((M!==Ci||b!==Ci)&&(i.blendEquation(i.FUNC_ADD),M=Ci,b=Ci),ut)switch(F){case ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jt:i.blendFunc(i.ONE,i.ONE);break;case Cl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:He("WebGLState: Invalid blending: ",F);break}else switch(F){case ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jt:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Cl:He("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pl:He("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:He("WebGLState: Invalid blending: ",F);break}A=null,v=null,T=null,C=null,_.set(0,0,0),E=0,f=F,R=ut}return}be=be||ge,se=se||ee,Ne=Ne||xe,(ge!==M||be!==b)&&(i.blendEquationSeparate(Te[ge],Te[be]),M=ge,b=be),(ee!==A||xe!==v||se!==T||Ne!==C)&&(i.blendFuncSeparate(Z[ee],Z[xe],Z[se],Z[Ne]),A=ee,v=xe,T=se,C=Ne),(Ie.equals(_)===!1||yt!==E)&&(i.blendColor(Ie.r,Ie.g,Ie.b,yt),_.copy(Ie),E=yt),f=F,R=!1}function oe(F,ge){F.side===Rt?he(i.CULL_FACE):j(i.CULL_FACE);let ee=F.side===Ft;ge&&(ee=!ee),ae(ee),F.blending===ms&&F.transparent===!1?ne(fn):ne(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let xe=F.stencilWrite;o.setTest(xe),xe&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),fe(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):he(i.SAMPLE_ALPHA_TO_COVERAGE)}function ae(F){D!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),D=F)}function Fe(F){F!==Kc?(j(i.CULL_FACE),F!==U&&(F===Rl?i.cullFace(i.BACK):F===Qc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):he(i.CULL_FACE),U=F}function Je(F){F!==H&&(Y&&i.lineWidth(F),H=F)}function fe(F,ge,ee){F?(j(i.POLYGON_OFFSET_FILL),(I!==ge||k!==ee)&&(I=ge,k=ee,a.getReversed()&&(ge=-ge),i.polygonOffset(ge,ee))):he(i.POLYGON_OFFSET_FILL)}function mt(F){F?j(i.SCISSOR_TEST):he(i.SCISSOR_TEST)}function ue(F){F===void 0&&(F=i.TEXTURE0+W-1),O!==F&&(i.activeTexture(F),O=F)}function P(F,ge,ee){ee===void 0&&(O===null?ee=i.TEXTURE0+W-1:ee=O);let xe=J[ee];xe===void 0&&(xe={type:void 0,texture:void 0},J[ee]=xe),(xe.type!==F||xe.texture!==ge)&&(O!==ee&&(i.activeTexture(ee),O=ee),i.bindTexture(F,ge||$[F]),xe.type=F,xe.texture=ge)}function et(){let F=J[O];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Ze(){try{i.compressedTexImage2D(...arguments)}catch(F){He("WebGLState:",F)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(F){He("WebGLState:",F)}}function x(){try{i.texSubImage2D(...arguments)}catch(F){He("WebGLState:",F)}}function z(){try{i.texSubImage3D(...arguments)}catch(F){He("WebGLState:",F)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(F){He("WebGLState:",F)}}function K(){try{i.compressedTexSubImage3D(...arguments)}catch(F){He("WebGLState:",F)}}function le(){try{i.texStorage2D(...arguments)}catch(F){He("WebGLState:",F)}}function de(){try{i.texStorage3D(...arguments)}catch(F){He("WebGLState:",F)}}function Q(){try{i.texImage2D(...arguments)}catch(F){He("WebGLState:",F)}}function te(){try{i.texImage3D(...arguments)}catch(F){He("WebGLState:",F)}}function pe(F){return d[F]!==void 0?d[F]:i.getParameter(F)}function De(F,ge){d[F]!==ge&&(i.pixelStorei(F,ge),d[F]=ge)}function _e(F){Ye.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),Ye.copy(F))}function me(F){je.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),je.copy(F))}function Ue(F,ge){let ee=c.get(ge);ee===void 0&&(ee=new WeakMap,c.set(ge,ee));let xe=ee.get(F);xe===void 0&&(xe=i.getUniformBlockIndex(ge,F.name),ee.set(F,xe))}function ze(F,ge){let xe=c.get(ge).get(F);l.get(ge)!==xe&&(i.uniformBlockBinding(ge,xe,F.__bindingPointIndex),l.set(ge,xe))}function qe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},O=null,J={},u={},p=new WeakMap,g=[],S=null,m=!1,f=null,M=null,A=null,v=null,b=null,T=null,C=null,_=new Be(0,0,0),E=0,R=!1,D=null,U=null,H=null,I=null,k=null,Ye.set(0,0,i.canvas.width,i.canvas.height),je.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:j,disable:he,bindFramebuffer:ke,drawBuffers:ye,useProgram:Oe,setBlending:ne,setMaterial:oe,setFlipSided:ae,setCullFace:Fe,setLineWidth:Je,setPolygonOffset:fe,setScissorTest:mt,activeTexture:ue,bindTexture:P,unbindTexture:et,compressedTexImage2D:Ze,compressedTexImage3D:w,texImage2D:Q,texImage3D:te,pixelStorei:De,getParameter:pe,updateUBOMapping:Ue,uniformBlockBinding:ze,texStorage2D:le,texStorage3D:de,texSubImage2D:x,texSubImage3D:z,compressedTexSubImage2D:X,compressedTexSubImage3D:K,scissor:_e,viewport:me,reset:qe}}function e0(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Pe,h=new WeakMap,d=new Set,u,p=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(w,x){return g?new OffscreenCanvas(w,x):Gs("canvas")}function m(w,x,z){let X=1,K=Ze(w);if((K.width>z||K.height>z)&&(X=z/Math.max(K.width,K.height)),X<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let le=Math.floor(X*K.width),de=Math.floor(X*K.height);u===void 0&&(u=S(le,de));let Q=x?S(le,de):u;return Q.width=le,Q.height=de,Q.getContext("2d").drawImage(w,0,0,le,de),Ge("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+le+"x"+de+")."),Q}else return"data"in w&&Ge("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),w;return w}function f(w){return w.generateMipmaps}function M(w){i.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,x,z,X,K,le=!1){if(w!==null){if(i[w]!==void 0)return i[w];Ge("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let de;X&&(de=e.get("EXT_texture_norm16"),de||Ge("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=x;if(x===i.RED&&(z===i.FLOAT&&(Q=i.R32F),z===i.HALF_FLOAT&&(Q=i.R16F),z===i.UNSIGNED_BYTE&&(Q=i.R8),z===i.UNSIGNED_SHORT&&de&&(Q=de.R16_EXT),z===i.SHORT&&de&&(Q=de.R16_SNORM_EXT)),x===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.R8UI),z===i.UNSIGNED_SHORT&&(Q=i.R16UI),z===i.UNSIGNED_INT&&(Q=i.R32UI),z===i.BYTE&&(Q=i.R8I),z===i.SHORT&&(Q=i.R16I),z===i.INT&&(Q=i.R32I)),x===i.RG&&(z===i.FLOAT&&(Q=i.RG32F),z===i.HALF_FLOAT&&(Q=i.RG16F),z===i.UNSIGNED_BYTE&&(Q=i.RG8),z===i.UNSIGNED_SHORT&&de&&(Q=de.RG16_EXT),z===i.SHORT&&de&&(Q=de.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.RG8UI),z===i.UNSIGNED_SHORT&&(Q=i.RG16UI),z===i.UNSIGNED_INT&&(Q=i.RG32UI),z===i.BYTE&&(Q=i.RG8I),z===i.SHORT&&(Q=i.RG16I),z===i.INT&&(Q=i.RG32I)),x===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),z===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),z===i.UNSIGNED_INT&&(Q=i.RGB32UI),z===i.BYTE&&(Q=i.RGB8I),z===i.SHORT&&(Q=i.RGB16I),z===i.INT&&(Q=i.RGB32I)),x===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),z===i.UNSIGNED_INT&&(Q=i.RGBA32UI),z===i.BYTE&&(Q=i.RGBA8I),z===i.SHORT&&(Q=i.RGBA16I),z===i.INT&&(Q=i.RGBA32I)),x===i.RGB&&(z===i.UNSIGNED_SHORT&&de&&(Q=de.RGB16_EXT),z===i.SHORT&&de&&(Q=de.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(Q=i.R11F_G11F_B10F)),x===i.RGBA){let te=le?Hs:tt.getTransfer(K);z===i.FLOAT&&(Q=i.RGBA32F),z===i.HALF_FLOAT&&(Q=i.RGBA16F),z===i.UNSIGNED_BYTE&&(Q=te===ct?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&de&&(Q=de.RGBA16_EXT),z===i.SHORT&&de&&(Q=de.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function b(w,x){let z;return w?x===null||x===wn||x===xs?z=i.DEPTH24_STENCIL8:x===pn?z=i.DEPTH32F_STENCIL8:x===gs&&(z=i.DEPTH24_STENCIL8,Ge("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===wn||x===xs?z=i.DEPTH_COMPONENT24:x===pn?z=i.DEPTH_COMPONENT32F:x===gs&&(z=i.DEPTH_COMPONENT16),z}function T(w,x){return f(w)===!0||w.isFramebufferTexture&&w.minFilter!==At&&w.minFilter!==Ht?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function C(w){let x=w.target;x.removeEventListener("dispose",C),E(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&d.delete(x)}function _(w){let x=w.target;x.removeEventListener("dispose",_),D(x)}function E(w){let x=n.get(w);if(x.__webglInit===void 0)return;let z=w.source,X=p.get(z);if(X){let K=X[x.__cacheKey];K.usedTimes--,K.usedTimes===0&&R(w),Object.keys(X).length===0&&p.delete(z)}n.remove(w)}function R(w){let x=n.get(w);i.deleteTexture(x.__webglTexture);let z=w.source,X=p.get(z);delete X[x.__cacheKey],a.memory.textures--}function D(w){let x=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let K=0;K<x.__webglFramebuffer[X].length;K++)i.deleteFramebuffer(x.__webglFramebuffer[X][K]);else i.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)i.deleteFramebuffer(x.__webglFramebuffer[X]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let z=w.textures;for(let X=0,K=z.length;X<K;X++){let le=n.get(z[X]);le.__webglTexture&&(i.deleteTexture(le.__webglTexture),a.memory.textures--),n.remove(z[X])}n.remove(w)}let U=0;function H(){U=0}function I(){return U}function k(w){U=w}function W(){let w=U;return w>=s.maxTextures&&Ge("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),U+=1,w}function Y(w){let x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function ie(w,x){let z=n.get(w);if(w.isVideoTexture&&P(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&z.__version!==w.version){let X=w.image;if(X===null)Ge("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ge("WebGLRenderer: Texture marked for update but image is incomplete");else{he(z,w,x);return}}else w.isExternalTexture&&(z.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+x)}function B(w,x){let z=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version){he(z,w,x);return}else w.isExternalTexture&&(z.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+x)}function O(w,x){let z=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version){he(z,w,x);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+x)}function J(w,x){let z=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&z.__version!==w.version){ke(z,w,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+x)}let ce={[pa]:i.REPEAT,[In]:i.CLAMP_TO_EDGE,[ma]:i.MIRRORED_REPEAT},Ee={[At]:i.NEAREST,[vh]:i.NEAREST_MIPMAP_NEAREST,[mr]:i.NEAREST_MIPMAP_LINEAR,[Ht]:i.LINEAR,[Ha]:i.LINEAR_MIPMAP_NEAREST,[gi]:i.LINEAR_MIPMAP_LINEAR},Ye={[bh]:i.NEVER,[Rh]:i.ALWAYS,[Eh]:i.LESS,[wo]:i.LEQUAL,[Th]:i.EQUAL,[Ao]:i.GEQUAL,[wh]:i.GREATER,[Ah]:i.NOTEQUAL};function je(w,x){if(x.type===pn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Ht||x.magFilter===Ha||x.magFilter===mr||x.magFilter===gi||x.minFilter===Ht||x.minFilter===Ha||x.minFilter===mr||x.minFilter===gi)&&Ge("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,ce[x.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,ce[x.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,ce[x.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Ee[x.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Ee[x.minFilter]),x.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,Ye[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===At||x.minFilter!==mr&&x.minFilter!==gi||x.type===pn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function st(w,x){let z=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",C));let X=x.source,K=p.get(X);K===void 0&&(K={},p.set(X,K));let le=Y(x);if(le!==w.__cacheKey){K[le]===void 0&&(K[le]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),K[le].usedTimes++;let de=K[w.__cacheKey];de!==void 0&&(K[w.__cacheKey].usedTimes--,de.usedTimes===0&&R(x)),w.__cacheKey=le,w.__webglTexture=K[le].texture}return z}function $(w,x,z){return Math.floor(Math.floor(w/z)/x)}function j(w,x,z,X){let le=w.updateRanges;if(le.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,z,X,x.data);else{le.sort((De,_e)=>De.start-_e.start);let de=0;for(let De=1;De<le.length;De++){let _e=le[de],me=le[De],Ue=_e.start+_e.count,ze=$(me.start,x.width,4),qe=$(_e.start,x.width,4);me.start<=Ue+1&&ze===qe&&$(me.start+me.count-1,x.width,4)===ze?_e.count=Math.max(_e.count,me.start+me.count-_e.start):(++de,le[de]=me)}le.length=de+1;let Q=t.getParameter(i.UNPACK_ROW_LENGTH),te=t.getParameter(i.UNPACK_SKIP_PIXELS),pe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let De=0,_e=le.length;De<_e;De++){let me=le[De],Ue=Math.floor(me.start/4),ze=Math.ceil(me.count/4),qe=Ue%x.width,F=Math.floor(Ue/x.width),ge=ze,ee=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,qe),t.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,qe,F,ge,ee,z,X,x.data)}w.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Q),t.pixelStorei(i.UNPACK_SKIP_PIXELS,te),t.pixelStorei(i.UNPACK_SKIP_ROWS,pe)}}function he(w,x,z){let X=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=i.TEXTURE_3D);let K=st(w,x),le=x.source;t.bindTexture(X,w.__webglTexture,i.TEXTURE0+z);let de=n.get(le);if(le.version!==de.__version||K===!0){if(t.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let ee=tt.getPrimaries(tt.workingColorSpace),xe=x.colorSpace===Kn?null:tt.getPrimaries(x.colorSpace),be=x.colorSpace===Kn||ee===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let te=m(x.image,!1,s.maxTextureSize);te=et(x,te);let pe=r.convert(x.format,x.colorSpace),De=r.convert(x.type),_e=v(x.internalFormat,pe,De,x.normalized,x.colorSpace,x.isVideoTexture);je(X,x);let me,Ue=x.mipmaps,ze=x.isVideoTexture!==!0,qe=de.__version===void 0||K===!0,F=le.dataReady,ge=T(x,te);if(x.isDepthTexture)_e=b(x.format===xi,x.type),qe&&(ze?t.texStorage2D(i.TEXTURE_2D,1,_e,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,_e,te.width,te.height,0,pe,De,null));else if(x.isDataTexture)if(Ue.length>0){ze&&qe&&t.texStorage2D(i.TEXTURE_2D,ge,_e,Ue[0].width,Ue[0].height);for(let ee=0,xe=Ue.length;ee<xe;ee++)me=Ue[ee],ze?F&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,me.width,me.height,pe,De,me.data):t.texImage2D(i.TEXTURE_2D,ee,_e,me.width,me.height,0,pe,De,me.data);x.generateMipmaps=!1}else ze?(qe&&t.texStorage2D(i.TEXTURE_2D,ge,_e,te.width,te.height),F&&j(x,te,pe,De)):t.texImage2D(i.TEXTURE_2D,0,_e,te.width,te.height,0,pe,De,te.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){ze&&qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,_e,Ue[0].width,Ue[0].height,te.depth);for(let ee=0,xe=Ue.length;ee<xe;ee++)if(me=Ue[ee],x.format!==mn)if(pe!==null)if(ze){if(F)if(x.layerUpdates.size>0){let be=ql(me.width,me.height,x.format,x.type);for(let se of x.layerUpdates){let Ne=me.data.subarray(se*be/me.data.BYTES_PER_ELEMENT,(se+1)*be/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,se,me.width,me.height,1,pe,Ne)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,me.width,me.height,te.depth,pe,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ee,_e,me.width,me.height,te.depth,0,me.data,0,0);else Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,me.width,me.height,te.depth,pe,De,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ee,_e,me.width,me.height,te.depth,0,pe,De,me.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{ze&&qe&&t.texStorage2D(i.TEXTURE_2D,ge,_e,Ue[0].width,Ue[0].height);for(let ee=0,xe=Ue.length;ee<xe;ee++)me=Ue[ee],x.format!==mn?pe!==null?ze?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,ee,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(i.TEXTURE_2D,ee,_e,me.width,me.height,0,me.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?F&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,me.width,me.height,pe,De,me.data):t.texImage2D(i.TEXTURE_2D,ee,_e,me.width,me.height,0,pe,De,me.data)}else if(x.isDataArrayTexture)if(ze){if(qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,_e,te.width,te.height,te.depth),F)if(x.layerUpdates.size>0){let ee=ql(te.width,te.height,x.format,x.type);for(let xe of x.layerUpdates){let be=te.data.subarray(xe*ee/te.data.BYTES_PER_ELEMENT,(xe+1)*ee/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,xe,te.width,te.height,1,pe,De,be)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,pe,De,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,_e,te.width,te.height,te.depth,0,pe,De,te.data);else if(x.isData3DTexture)ze?(qe&&t.texStorage3D(i.TEXTURE_3D,ge,_e,te.width,te.height,te.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,pe,De,te.data)):t.texImage3D(i.TEXTURE_3D,0,_e,te.width,te.height,te.depth,0,pe,De,te.data);else if(x.isFramebufferTexture){if(qe)if(ze)t.texStorage2D(i.TEXTURE_2D,ge,_e,te.width,te.height);else{let ee=te.width,xe=te.height;for(let be=0;be<ge;be++)t.texImage2D(i.TEXTURE_2D,be,_e,ee,xe,0,pe,De,null),ee>>=1,xe>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let ee=i.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),te.parentNode!==ee){ee.appendChild(te),d.add(x),ee.onpaint=xe=>{let be=xe.changedElements;for(let se of d)be.includes(se.image)&&(se.needsUpdate=!0)},ee.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,te);else{let be=i.RGBA,se=i.RGBA,Ne=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,be,se,Ne,te)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ue.length>0){if(ze&&qe){let ee=Ze(Ue[0]);t.texStorage2D(i.TEXTURE_2D,ge,_e,ee.width,ee.height)}for(let ee=0,xe=Ue.length;ee<xe;ee++)me=Ue[ee],ze?F&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,pe,De,me):t.texImage2D(i.TEXTURE_2D,ee,_e,pe,De,me);x.generateMipmaps=!1}else if(ze){if(qe){let ee=Ze(te);t.texStorage2D(i.TEXTURE_2D,ge,_e,ee.width,ee.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,De,te)}else t.texImage2D(i.TEXTURE_2D,0,_e,pe,De,te);f(x)&&M(X),de.__version=le.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function ke(w,x,z){if(x.image.length!==6)return;let X=st(w,x),K=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+z);let le=n.get(K);if(K.version!==le.__version||X===!0){t.activeTexture(i.TEXTURE0+z);let de=tt.getPrimaries(tt.workingColorSpace),Q=x.colorSpace===Kn?null:tt.getPrimaries(x.colorSpace),te=x.colorSpace===Kn||de===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let pe=x.isCompressedTexture||x.image[0].isCompressedTexture,De=x.image[0]&&x.image[0].isDataTexture,_e=[];for(let se=0;se<6;se++)!pe&&!De?_e[se]=m(x.image[se],!0,s.maxCubemapSize):_e[se]=De?x.image[se].image:x.image[se],_e[se]=et(x,_e[se]);let me=_e[0],Ue=r.convert(x.format,x.colorSpace),ze=r.convert(x.type),qe=v(x.internalFormat,Ue,ze,x.normalized,x.colorSpace),F=x.isVideoTexture!==!0,ge=le.__version===void 0||X===!0,ee=K.dataReady,xe=T(x,me);je(i.TEXTURE_CUBE_MAP,x);let be;if(pe){F&&ge&&t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,qe,me.width,me.height);for(let se=0;se<6;se++){be=_e[se].mipmaps;for(let Ne=0;Ne<be.length;Ne++){let Ie=be[Ne];x.format!==mn?Ue!==null?F?ee&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,0,0,Ie.width,Ie.height,Ue,Ie.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,qe,Ie.width,Ie.height,0,Ie.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,0,0,Ie.width,Ie.height,Ue,ze,Ie.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,qe,Ie.width,Ie.height,0,Ue,ze,Ie.data)}}}else{if(be=x.mipmaps,F&&ge){be.length>0&&xe++;let se=Ze(_e[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,qe,se.width,se.height)}for(let se=0;se<6;se++)if(De){F?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,_e[se].width,_e[se].height,Ue,ze,_e[se].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,qe,_e[se].width,_e[se].height,0,Ue,ze,_e[se].data);for(let Ne=0;Ne<be.length;Ne++){let yt=be[Ne].image[se].image;F?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,0,0,yt.width,yt.height,Ue,ze,yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,qe,yt.width,yt.height,0,Ue,ze,yt.data)}}else{F?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Ue,ze,_e[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,qe,Ue,ze,_e[se]);for(let Ne=0;Ne<be.length;Ne++){let Ie=be[Ne];F?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,0,0,Ue,ze,Ie.image[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,qe,Ue,ze,Ie.image[se])}}}f(x)&&M(i.TEXTURE_CUBE_MAP),le.__version=K.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function ye(w,x,z,X,K,le){let de=r.convert(z.format,z.colorSpace),Q=r.convert(z.type),te=v(z.internalFormat,de,Q,z.normalized,z.colorSpace),pe=n.get(x),De=n.get(z);if(De.__renderTarget=x,!pe.__hasExternalTextures){let _e=Math.max(1,x.width>>le),me=Math.max(1,x.height>>le);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,le,te,_e,me,x.depth,0,de,Q,null):t.texImage2D(K,le,te,_e,me,0,de,Q,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),ue(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,K,De.__webglTexture,0,mt(x)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,K,De.__webglTexture,le),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(w,x,z){if(i.bindRenderbuffer(i.RENDERBUFFER,w),x.depthBuffer){let X=x.depthTexture,K=X&&X.isDepthTexture?X.type:null,le=b(x.stencilBuffer,K),de=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ue(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt(x),le,x.width,x.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt(x),le,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,le,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,w)}else{let X=x.textures;for(let K=0;K<X.length;K++){let le=X[K],de=r.convert(le.format,le.colorSpace),Q=r.convert(le.type),te=v(le.internalFormat,de,Q,le.normalized,le.colorSpace);ue(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt(x),te,x.width,x.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt(x),te,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,te,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(w,x,z){let X=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=n.get(x.depthTexture);if(K.__renderTarget=x,(!K.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X){if(K.__webglInit===void 0&&(K.__webglInit=!0,x.depthTexture.addEventListener("dispose",C)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),je(i.TEXTURE_CUBE_MAP,x.depthTexture);let pe=r.convert(x.depthTexture.format),De=r.convert(x.depthTexture.type),_e;x.depthTexture.format===Ln?_e=i.DEPTH_COMPONENT24:x.depthTexture.format===xi&&(_e=i.DEPTH24_STENCIL8);for(let me=0;me<6;me++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,_e,x.width,x.height,0,pe,De,null)}}else ie(x.depthTexture,0);let le=K.__webglTexture,de=mt(x),Q=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,te=x.depthTexture.format===xi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===Ln)ue(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Q,le,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,te,Q,le,0);else if(x.depthTexture.format===xi)ue(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Q,le,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,te,Q,le,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Z(w){let x=n.get(w),z=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){let X=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){let K=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",K)};X.addEventListener("dispose",K),x.__depthDisposeCallback=K}x.__boundDepthTexture=X}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(z)for(let X=0;X<6;X++)Te(x.__webglFramebuffer[X],w,X);else{let X=w.texture.mipmaps;X&&X.length>0?Te(x.__webglFramebuffer[0],w,0):Te(x.__webglFramebuffer,w,0)}else if(z){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=i.createRenderbuffer(),Oe(x.__webglDepthbuffer[X],w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=x.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,le)}}else{let X=w.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Oe(x.__webglDepthbuffer,w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,le)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ne(w,x,z){let X=n.get(w);x!==void 0&&ye(X.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Z(w)}function oe(w){let x=w.texture,z=n.get(w),X=n.get(x);w.addEventListener("dispose",_);let K=w.textures,le=w.isWebGLCubeRenderTarget===!0,de=K.length>1;if(de||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=x.version,a.memory.textures++),le){z.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer[Q]=[];for(let te=0;te<x.mipmaps.length;te++)z.__webglFramebuffer[Q][te]=i.createFramebuffer()}else z.__webglFramebuffer[Q]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer=[];for(let Q=0;Q<x.mipmaps.length;Q++)z.__webglFramebuffer[Q]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(de)for(let Q=0,te=K.length;Q<te;Q++){let pe=n.get(K[Q]);pe.__webglTexture===void 0&&(pe.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&ue(w)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let Q=0;Q<K.length;Q++){let te=K[Q];z.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[Q]);let pe=r.convert(te.format,te.colorSpace),De=r.convert(te.type),_e=v(te.internalFormat,pe,De,te.normalized,te.colorSpace,w.isXRRenderTarget===!0),me=mt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,me,_e,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,z.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Oe(z.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(le){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),je(i.TEXTURE_CUBE_MAP,x);for(let Q=0;Q<6;Q++)if(x.mipmaps&&x.mipmaps.length>0)for(let te=0;te<x.mipmaps.length;te++)ye(z.__webglFramebuffer[Q][te],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,te);else ye(z.__webglFramebuffer[Q],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);f(x)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let Q=0,te=K.length;Q<te;Q++){let pe=K[Q],De=n.get(pe),_e=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(_e=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(_e,De.__webglTexture),je(_e,pe),ye(z.__webglFramebuffer,w,pe,i.COLOR_ATTACHMENT0+Q,_e,0),f(pe)&&M(_e)}t.unbindTexture()}else{let Q=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Q=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Q,X.__webglTexture),je(Q,x),x.mipmaps&&x.mipmaps.length>0)for(let te=0;te<x.mipmaps.length;te++)ye(z.__webglFramebuffer[te],w,x,i.COLOR_ATTACHMENT0,Q,te);else ye(z.__webglFramebuffer,w,x,i.COLOR_ATTACHMENT0,Q,0);f(x)&&M(Q),t.unbindTexture()}w.depthBuffer&&Z(w)}function ae(w){let x=w.textures;for(let z=0,X=x.length;z<X;z++){let K=x[z];if(f(K)){let le=A(w),de=n.get(K).__webglTexture;t.bindTexture(le,de),M(le),t.unbindTexture()}}}let Fe=[],Je=[];function fe(w){if(w.samples>0){if(ue(w)===!1){let x=w.textures,z=w.width,X=w.height,K=i.COLOR_BUFFER_BIT,le=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(w),Q=x.length>1;if(Q)for(let pe=0;pe<x.length;pe++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);let te=w.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let pe=0;pe<x.length;pe++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),Q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[pe]);let De=n.get(x[pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,De,0)}i.blitFramebuffer(0,0,z,X,0,0,z,X,K,i.NEAREST),l===!0&&(Fe.length=0,Je.length=0,Fe.push(i.COLOR_ATTACHMENT0+pe),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(Fe.push(le),Je.push(le),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Je)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Fe))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let pe=0;pe<x.length;pe++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,de.__webglColorRenderbuffer[pe]);let De=n.get(x[pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,De,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){let x=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function mt(w){return Math.min(s.maxSamples,w.samples)}function ue(w){let x=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function P(w){let x=a.render.frame;h.get(w)!==x&&(h.set(w,x),w.update())}function et(w,x){let z=w.colorSpace,X=w.format,K=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||z!==ks&&z!==Kn&&(tt.getTransfer(z)===ct?(X!==mn||K!==en)&&Ge("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):He("WebGLTextures: Unsupported texture color space:",z)),x}function Ze(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=H,this.getTextureUnits=I,this.setTextureUnits=k,this.setTexture2D=ie,this.setTexture2DArray=B,this.setTexture3D=O,this.setTextureCube=J,this.rebindTextures=ne,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=fe,this.setupDepthRenderbuffer=Z,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=ue,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function t0(i,e){function t(n,s=Kn){let r,a=tt.getTransfer(s);if(n===en)return i.UNSIGNED_BYTE;if(n===Va)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Wa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Bl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ol)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Nl)return i.BYTE;if(n===Fl)return i.SHORT;if(n===gs)return i.UNSIGNED_SHORT;if(n===Ga)return i.INT;if(n===wn)return i.UNSIGNED_INT;if(n===pn)return i.FLOAT;if(n===Vt)return i.HALF_FLOAT;if(n===zl)return i.ALPHA;if(n===kl)return i.RGB;if(n===mn)return i.RGBA;if(n===Ln)return i.DEPTH_COMPONENT;if(n===xi)return i.DEPTH_STENCIL;if(n===_i)return i.RED;if(n===Xa)return i.RED_INTEGER;if(n===vi)return i.RG;if(n===qa)return i.RG_INTEGER;if(n===Ya)return i.RGBA_INTEGER;if(n===gr||n===xr||n===_r||n===vr)if(a===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Za||n===Ja||n===$a||n===Ka)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Za)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ja)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===$a)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ka)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Qa||n===ja||n===eo||n===to||n===no||n===yr||n===io)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Qa||n===ja)return a===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===eo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===to)return r.COMPRESSED_R11_EAC;if(n===no)return r.COMPRESSED_SIGNED_R11_EAC;if(n===yr)return r.COMPRESSED_RG11_EAC;if(n===io)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===xo||n===_o)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===so)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ro)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ao)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===oo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===lo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===co)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ho)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===uo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===po)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===mo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===go)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===xo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===_o)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===vo||n===yo||n===Mo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===vo)return a===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===yo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Mo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===So||n===bo||n===Mr||n===Eo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===So)return r.COMPRESSED_RED_RGTC1_EXT;if(n===bo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Mr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Eo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var n0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,i0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ac=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Qs(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new vt({vertexShader:n0,fragmentShader:i0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new re(new an(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},oc=class extends Dn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null,S=typeof XRWebGLBinding<"u",m=new ac,f={},M=t.getContextAttributes(),A=null,v=null,b=[],T=[],C=new Pe,_=null,E=null,R=new Yt;R.viewport=new Et;let D=new Yt;D.viewport=new Et;let U=[R,D],H=new Ba,I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let j=b[$];return j===void 0&&(j=new os,b[$]=j),j.getTargetRaySpace()},this.getControllerGrip=function($){let j=b[$];return j===void 0&&(j=new os,b[$]=j),j.getGripSpace()},this.getHand=function($){let j=b[$];return j===void 0&&(j=new os,b[$]=j),j.getHandSpace()};function W($){let j=T.indexOf($.inputSource);if(j===-1)return;let he=b[j];he!==void 0&&(he.update($.inputSource,$.frame,c||a),he.dispatchEvent({type:$.type,data:$.inputSource}))}function Y(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",ie);for(let $=0;$<b.length;$++){let j=T[$];j!==null&&(T[$]=null,b[$].disconnect(j))}I=null,k=null,m.reset();for(let $ in f)delete f[$];if(e.setRenderTarget(A),p=null,u=null,d=null,s=null,v=null,st.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),E!==null){let $=E.camera;$.fov=E.fov,$.zoom=E.zoom,$.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Ge("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&Ge("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",ie),M.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let he=null,ke=null,ye=null;M.depth&&(ye=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=M.stencil?xi:Ln,ke=M.stencil?xs:wn);let Oe={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Oe),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),v=new Dt(u.textureWidth,u.textureHeight,{format:mn,type:en,depthTexture:new hi(u.textureWidth,u.textureHeight,ke,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let he={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,he),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new Dt(p.framebufferWidth,p.framebufferHeight,{format:mn,type:en,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),st.setContext(s),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ie($){for(let j=0;j<$.removed.length;j++){let he=$.removed[j],ke=T.indexOf(he);ke>=0&&(T[ke]=null,b[ke].disconnect(he))}for(let j=0;j<$.added.length;j++){let he=$.added[j],ke=T.indexOf(he);if(ke===-1){for(let Oe=0;Oe<b.length;Oe++)if(Oe>=T.length){T.push(he),ke=Oe;break}else if(T[Oe]===null){T[Oe]=he,ke=Oe;break}if(ke===-1)break}let ye=b[ke];ye&&ye.connect(he)}}let B=new L,O=new L;function J($,j,he){B.setFromMatrixPosition(j.matrixWorld),O.setFromMatrixPosition(he.matrixWorld);let ke=B.distanceTo(O),ye=j.projectionMatrix.elements,Oe=he.projectionMatrix.elements,Te=ye[14]/(ye[10]-1),Z=ye[14]/(ye[10]+1),ne=(ye[9]+1)/ye[5],oe=(ye[9]-1)/ye[5],ae=(ye[8]-1)/ye[0],Fe=(Oe[8]+1)/Oe[0],Je=Te*ae,fe=Te*Fe,mt=ke/(-ae+Fe),ue=mt*-ae;if(j.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ue),$.translateZ(mt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),ye[10]===-1)$.projectionMatrix.copy(j.projectionMatrix),$.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{let P=Te+mt,et=Z+mt,Ze=Je-ue,w=fe+(ke-ue),x=ne*Z/et*P,z=oe*Z/et*P;$.projectionMatrix.makePerspective(Ze,w,x,z,P,et),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ce($,j){j===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(j.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let j=$.near,he=$.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(he=m.depthFar)),H.near=D.near=R.near=j,H.far=D.far=R.far=he,(I!==H.near||k!==H.far)&&(s.updateRenderState({depthNear:H.near,depthFar:H.far}),I=H.near,k=H.far),H.layers.mask=$.layers.mask|6,R.layers.mask=H.layers.mask&-5,D.layers.mask=H.layers.mask&-3;let ke=$.parent,ye=H.cameras;ce(H,ke);for(let Oe=0;Oe<ye.length;Oe++)ce(ye[Oe],ke);ye.length===2?J(H,R,D):H.projectionMatrix.copy(R.projectionMatrix),E===null&&$.isPerspectiveCamera&&(E={camera:$,fov:$.fov,zoom:$.zoom}),Ee($,H,ke)};function Ee($,j,he){he===null?$.matrix.copy(j.matrixWorld):($.matrix.copy(he.matrixWorld),$.matrix.invert(),$.matrix.multiply(j.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(j.projectionMatrix),$.projectionMatrixInverse.copy(j.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=xa*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function($){l=$,u!==null&&(u.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(H)},this.getCameraTexture=function($){return f[$]};let Ye=null;function je($,j){if(h=j.getViewerPose(c||a),g=j,h!==null){let he=h.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let ke=!1;he.length!==H.cameras.length&&(H.cameras.length=0,ke=!0);for(let Z=0;Z<he.length;Z++){let ne=he[Z],oe=null;if(p!==null)oe=p.getViewport(ne);else{let Fe=d.getViewSubImage(u,ne);oe=Fe.viewport,Z===0&&(e.setRenderTargetTextures(v,Fe.colorTexture,Fe.depthStencilTexture),e.setRenderTarget(v))}let ae=U[Z];ae===void 0&&(ae=new Yt,ae.layers.enable(Z),ae.viewport=new Et,U[Z]=ae),ae.matrix.fromArray(ne.transform.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.projectionMatrix.fromArray(ne.projectionMatrix),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert(),ae.viewport.set(oe.x,oe.y,oe.width,oe.height),Z===0&&(H.matrix.copy(ae.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),ke===!0&&H.cameras.push(ae)}let ye=s.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){d=n.getBinding();let Z=d.getDepthInformation(he[0]);Z&&Z.isValid&&Z.texture&&m.init(Z,s.renderState)}if(ye&&ye.includes("camera-access")&&S){e.state.unbindTexture(),d=n.getBinding();for(let Z=0;Z<he.length;Z++){let ne=he[Z].camera;if(ne){let oe=f[ne];oe||(oe=new Qs,f[ne]=oe);let ae=d.getCameraImage(ne);oe.sourceTexture=ae}}}}for(let he=0;he<b.length;he++){let ke=T[he],ye=b[he];ke!==null&&ye!==void 0&&ye.update(ke,j,c||a)}Ye&&Ye($,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}let st=new su;st.setAnimationLoop(je),this.setAnimationLoop=function($){Ye=$},this.dispose=function(){}}},s0=new pt,hu=new We;hu.set(-1,0,0,0,1,0,0,0,1);function r0(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Vl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,M,A,v){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(m,f):f.isMeshLambertMaterial?(r(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,v)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),S(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,M,A):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ft&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ft&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let M=e.get(f),A=M.envMap,v=M.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(s0.makeRotationFromEuler(v)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(hu),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,M,A){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=A*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ft&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function S(m,f){let M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function a0(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,b){let T=b.program;n.uniformBlockBinding(v,T)}function c(v,b){let T=s[v.id];T===void 0&&(m(v),T=h(v),s[v.id]=T,v.addEventListener("dispose",M));let C=b.program;n.updateUBOMapping(v,C);let _=e.render.frame;r[v.id]!==_&&(u(v),r[v.id]=_)}function h(v){let b=d();v.__bindingPointIndex=b;let T=i.createBuffer(),C=v.__size,_=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,C,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,T),T}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return He("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let b=s[v.id],T=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let _=0,E=T.length;_<E;_++){let R=T[_];if(Array.isArray(R))for(let D=0,U=R.length;D<U;D++)p(R[D],_,D,C);else p(R,_,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,b,T,C){if(S(v,b,T,C)===!0){let _=v.__offset,E=v.value;if(Array.isArray(E)){let R=0;for(let D=0;D<E.length;D++){let U=E[D],H=f(U);g(U,v.__data,R),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(R+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,v.__data)}}function g(v,b,T){typeof v=="number"||typeof v=="boolean"?b[0]=v:v.isMatrix3?(b[0]=v.elements[0],b[1]=v.elements[1],b[2]=v.elements[2],b[3]=0,b[4]=v.elements[3],b[5]=v.elements[4],b[6]=v.elements[5],b[7]=0,b[8]=v.elements[6],b[9]=v.elements[7],b[10]=v.elements[8],b[11]=0):ArrayBuffer.isView(v)?b.set(new v.constructor(v.buffer,v.byteOffset,b.length)):v.toArray(b,T)}function S(v,b,T,C){let _=v.value,E=b+"_"+T;if(C[E]===void 0)return typeof _=="number"||typeof _=="boolean"?C[E]=_:ArrayBuffer.isView(_)?C[E]=_.slice():C[E]=_.clone(),!0;{let R=C[E];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return C[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function m(v){let b=v.uniforms,T=0,C=16;for(let E=0,R=b.length;E<R;E++){let D=Array.isArray(b[E])?b[E]:[b[E]];for(let U=0,H=D.length;U<H;U++){let I=D[U],k=Array.isArray(I.value)?I.value:[I.value];for(let W=0,Y=k.length;W<Y;W++){let ie=k[W],B=f(ie),O=T%C,J=O%B.boundary,ce=O+J;T+=J,ce!==0&&C-ce<B.storage&&(T+=C-ce),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=T,T+=B.storage}}}let _=T%C;return _>0&&(T+=C-_),v.__size=T,v.__cache={},this}function f(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?Ge("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):Ge("WebGLRenderer: Unsupported uniform value type.",v),b}function M(v){let b=v.target;b.removeEventListener("dispose",M);let T=a.indexOf(b.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function A(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:A}}var o0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),On=null;function l0(){return On===null&&(On=new Zn(o0,16,16,vi,Vt),On.name="DFG_LUT",On.minFilter=Ht,On.magFilter=Ht,On.wrapS=In,On.wrapT=In,On.generateMipmaps=!1,On.needsUpdate=!0),On}var Lo=class{constructor(e={}){let{canvas:t=Ch(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:p=en}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let S=p,m=new Set([Ya,qa,Xa]),f=new Set([en,wn,gs,xs,Va,Wa]),M=new Uint32Array(4),A=new Int32Array(4),v=new L,b=null,T=null,C=[],_=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Tn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,D=!1,U=null,H=null,I=null,k=null;this._outputColorSpace=kt;let W=0,Y=0,ie=null,B=-1,O=null,J=new Et,ce=new Et,Ee=null,Ye=new Be(0),je=0,st=t.width,$=t.height,j=1,he=null,ke=null,ye=new Et(0,0,st,$),Oe=new Et(0,0,st,$),Te=!1,Z=new hs,ne=!1,oe=!1,ae=new pt,Fe=new L,Je=new Et,fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},mt=!1;function ue(){return ie===null?j:1}let P=n;function et(y,N){return t.getContext(y,N)}let Ze,w,x,z,X,K,le,de,Q,te,pe,De,_e,me,Ue,ze,qe,F,ge,ee,xe,be,se;try{let y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",yt,!1),t.addEventListener("webglcontextrestored",ut,!1),t.addEventListener("webglcontextcreationerror",gn,!1),P===null){let N="webgl2";if(P=et(N,y),P===null)throw et(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ne()}catch(y){throw t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",gn,!1),He("WebGLRenderer: "+y.message),y}function Ne(){Ze=new mm(P),Ze.init(),xe=new t0(P,Ze),w=new rm(P,Ze,e,xe),x=new jg(P,Ze),w.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),H=P.createFramebuffer(),I=P.createFramebuffer(),k=P.createFramebuffer(),z=new _m(P),X=new zg,K=new e0(P,Ze,x,X,w,xe,z),le=new pm(R),de=new vd(P),be=new im(P,de),Q=new gm(P,de,z,be),te=new ym(P,Q,de,be,z),F=new vm(P,w,K),Ue=new am(X),pe=new Og(R,le,Ze,w,be,Ue),De=new r0(R,X),_e=new Hg,me=new Yg(Ze),qe=new nm(R,le,x,te,g,l),ze=new Qg(R,te,w),se=new a0(P,z,w,x),ge=new sm(P,Ze,z),ee=new xm(P,Ze,z),z.programs=pe.programs,R.capabilities=w,R.extensions=Ze,R.properties=X,R.renderLists=_e,R.shadowMap=ze,R.state=x,R.info=z}S!==en&&(E=new Sm(S,t.width,t.height,o,s,r));let Ie=new oc(R,P);this.xr=Ie,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let y=Ze.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=Ze.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(y){y!==void 0&&(j=y,this.setSize(st,$,!1))},this.getSize=function(y){return y.set(st,$)},this.setSize=function(y,N,q=!0){if(Ie.isPresenting){Ge("WebGLRenderer: Can't change size while VR device is presenting.");return}st=y,$=N,t.width=Math.floor(y*j),t.height=Math.floor(N*j),q===!0&&(t.style.width=y+"px",t.style.height=N+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,y,N)},this.getDrawingBufferSize=function(y){return y.set(st*j,$*j).floor()},this.setDrawingBufferSize=function(y,N,q){st=y,$=N,j=q,t.width=Math.floor(y*q),t.height=Math.floor(N*q),this.setViewport(0,0,y,N)},this.setEffects=function(y){if(S===en){He("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let N=0;N<y.length;N++)if(y[N].isOutputPass===!0){Ge("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(J)},this.getViewport=function(y){return y.copy(ye)},this.setViewport=function(y,N,q,G){y.isVector4?ye.set(y.x,y.y,y.z,y.w):ye.set(y,N,q,G),x.viewport(J.copy(ye).multiplyScalar(j).round())},this.getScissor=function(y){return y.copy(Oe)},this.setScissor=function(y,N,q,G){y.isVector4?Oe.set(y.x,y.y,y.z,y.w):Oe.set(y,N,q,G),x.scissor(ce.copy(Oe).multiplyScalar(j).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(y){x.setScissorTest(Te=y)},this.setOpaqueSort=function(y){he=y},this.setTransparentSort=function(y){ke=y},this.getClearColor=function(y){return y.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor(...arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha(...arguments)},this.clear=function(y=!0,N=!0,q=!0){let G=0;if(y){let V=!1;if(ie!==null){let Se=ie.texture.format;V=m.has(Se)}if(V){let Se=ie.texture.type,Ae=f.has(Se),Me=qe.getClearColor(),Re=qe.getClearAlpha(),Le=Me.r,$e=Me.g,nt=Me.b;Ae?(M[0]=Le,M[1]=$e,M[2]=nt,M[3]=Re,P.clearBufferuiv(P.COLOR,0,M)):(A[0]=Le,A[1]=$e,A[2]=nt,A[3]=Re,P.clearBufferiv(P.COLOR,0,A))}else G|=P.COLOR_BUFFER_BIT}N&&(G|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),U=y},this.dispose=function(){t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",gn,!1),qe.dispose(),_e.dispose(),me.dispose(),X.dispose(),le.dispose(),te.dispose(),be.dispose(),se.dispose(),pe.dispose(),Ie.dispose(),Ie.removeEventListener("sessionstart",xc),Ie.removeEventListener("sessionend",_c),Si.stop()};function yt(y){y.preventDefault(),Vs("WebGLRenderer: Context Lost."),D=!0}function ut(){Vs("WebGLRenderer: Context Restored."),D=!1;let y=z.autoReset,N=ze.enabled,q=ze.autoUpdate,G=ze.needsUpdate,V=ze.type;Ne(),z.autoReset=y,ze.enabled=N,ze.autoUpdate=q,ze.needsUpdate=G,ze.type=V}function gn(y){He("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function An(y){let N=y.target;N.removeEventListener("dispose",An),Tu(N)}function Tu(y){wu(y),X.remove(y)}function wu(y){let N=X.get(y).programs;N!==void 0&&(N.forEach(function(q){pe.releaseProgram(q)}),y.isShaderMaterial&&pe.releaseShaderCache(y))}this.renderBufferDirect=function(y,N,q,G,V,Se){N===null&&(N=fe);let Ae=V.isMesh&&V.matrixWorld.determinantAffine()<0,Me=Cu(y,N,q,G,V);x.setMaterial(G,Ae);let Re=q.index,Le=1;if(G.wireframe===!0){if(Re=Q.getWireframeAttribute(q),Re===void 0)return;Le=2}let $e=q.drawRange,nt=q.attributes.position,Ce=$e.start*Le,dt=($e.start+$e.count)*Le;Se!==null&&(Ce=Math.max(Ce,Se.start*Le),dt=Math.min(dt,(Se.start+Se.count)*Le)),Re!==null?(Ce=Math.max(Ce,0),dt=Math.min(dt,Re.count)):nt!=null&&(Ce=Math.max(Ce,0),dt=Math.min(dt,nt.count));let It=dt-Ce;if(It<0||It===1/0)return;be.setup(V,G,Me,q,Re);let St,_t=ge;if(Re!==null&&(St=de.get(Re),_t=ee,_t.setIndex(St)),V.isMesh)G.wireframe===!0?(x.setLineWidth(G.wireframeLinewidth*ue()),_t.setMode(P.LINES)):_t.setMode(P.TRIANGLES);else if(V.isLine){let Wt=G.linewidth;Wt===void 0&&(Wt=1),x.setLineWidth(Wt*ue()),V.isLineSegments?_t.setMode(P.LINES):V.isLineLoop?_t.setMode(P.LINE_LOOP):_t.setMode(P.LINE_STRIP)}else V.isPoints?_t.setMode(P.POINTS):V.isSprite&&_t.setMode(P.TRIANGLES);if(V.isBatchedMesh)if(Ze.get("WEBGL_multi_draw"))_t.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let Wt=V._multiDrawStarts,we=V._multiDrawCounts,Jt=V._multiDrawCount,ot=Re?de.get(Re).bytesPerElement:1,hn=X.get(G).currentProgram.getUniforms();for(let Rn=0;Rn<Jt;Rn++)hn.setValue(P,"_gl_DrawID",Rn),_t.render(Wt[Rn]/ot,we[Rn])}else if(V.isInstancedMesh)_t.renderInstances(Ce,It,V.count);else if(q.isInstancedBufferGeometry){let Wt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,we=Math.min(q.instanceCount,Wt);_t.renderInstances(Ce,It,we)}else _t.render(Ce,It)};function gc(y,N,q,G){U!==null&&y.isNodeMaterial&&U.setObject(G,y),ne===!0&&Ue.setState(y,q,!1),y.transparent===!0&&y.side===Rt&&y.forceSinglePass===!1?(y.side=Ft,y.needsUpdate=!0,Nr(y,N,G),y.side=Bn,y.needsUpdate=!0,Nr(y,N,G),y.side=Rt):Nr(y,N,G)}this.compile=function(y,N,q=null){q===null&&(q=y),U!==null&&U.renderStart(y,N,q),T=me.get(q),T.init(N),_.push(T),q.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),y!==q&&y.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),T.setupLights(),U!==null&&U.updateLights(T.state.lightsArray),oe=this.localClippingEnabled,ne=Ue.init(this.clippingPlanes,oe),ne===!0&&Ue.setGlobalState(this.clippingPlanes,N),U!==null&&ze.render(T.state.shadowsArray,q,N);let G=new Set;return y.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let Se=V.material;if(Se)if(Array.isArray(Se))for(let Ae=0;Ae<Se.length;Ae++){let Me=Se[Ae];gc(Me,q,N,V),G.add(Me)}else gc(Se,q,N,V),G.add(Se)}),T=_.pop(),U!==null&&U.renderEnd(),G},this.compileAsync=function(y,N,q=null){let G=this.compile(y,N,q);return new Promise(V=>{function Se(){if(G.forEach(function(Ae){let Re=X.get(Ae).currentProgram;(Re===void 0||Re.isReady())&&G.delete(Ae)}),G.size===0){V(y);return}setTimeout(Se,10)}Ze.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let Jo=null;function Au(y){Jo&&Jo(y)}function xc(){Si.stop()}function _c(){Si.start()}let Si=new su;Si.setAnimationLoop(Au),typeof self<"u"&&Si.setContext(self),this.setAnimationLoop=function(y){Jo=y,Ie.setAnimationLoop(y),y===null?Si.stop():Si.start()},Ie.addEventListener("sessionstart",xc),Ie.addEventListener("sessionend",_c),this.render=function(y,N){if(N!==void 0&&N.isCamera!==!0){He("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;U!==null&&U.renderStart(y,N);let q=Ie.enabled===!0&&Ie.isPresenting===!0,G=E!==null&&(ie===null||q)&&E.begin(R,ie);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(N),N=Ie.getCamera()),y.isScene===!0&&y.onBeforeRender(R,y,N,ie),T=me.get(y,_.length),T.init(N),T.state.textureUnits=K.getTextureUnits(),_.push(T),ae.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Z.setFromProjectionMatrix(ae,Mn,N.reversedDepth),oe=this.localClippingEnabled,ne=Ue.init(this.clippingPlanes,oe),b=_e.get(y,C.length),b.init(),C.push(b),Ie.enabled===!0&&Ie.isPresenting===!0){let Ae=R.xr.getDepthSensingMesh();Ae!==null&&$o(Ae,N,-1/0,R.sortObjects)}$o(y,N,0,R.sortObjects),b.finish(),U!==null&&U.updateLights(T.state.lightsArray),R.sortObjects===!0&&b.sort(he,ke),mt=Ie.enabled===!1||Ie.isPresenting===!1||Ie.hasDepthSensing()===!1,mt&&qe.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ne===!0&&Ue.beginShadows();let V=T.state.shadowsArray;if(ze.render(V,y,N),ne===!0&&Ue.endShadows(),(G&&E.hasRenderPass())===!1){let Ae=b.opaque,Me=b.transmissive;if(T.setupLights(),N.isArrayCamera){let Re=N.cameras;if(Me.length>0)for(let Le=0,$e=Re.length;Le<$e;Le++){let nt=Re[Le];yc(Ae,Me,y,nt)}mt&&qe.render(y);for(let Le=0,$e=Re.length;Le<$e;Le++){let nt=Re[Le];vc(b,y,nt,nt.viewport)}}else Me.length>0&&yc(Ae,Me,y,N),mt&&qe.render(y),vc(b,y,N)}ie!==null&&Y===0&&(K.updateMultisampleRenderTarget(ie),K.updateRenderTargetMipmap(ie)),G&&E.end(R),y.isScene===!0&&y.onAfterRender(R,y,N),be.resetDefaultState(),B=-1,O=null,_.pop(),_.length>0?(T=_[_.length-1],K.setTextureUnits(T.state.textureUnits),ne===!0&&Ue.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?b=C[C.length-1]:b=null,U!==null&&U.renderEnd()};function $o(y,N,q,G){if(y.visible===!1)return;if(y.layers.test(N.layers)){if(y.isGroup)q=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(N);else if(y.isLightProbeGrid)T.pushLightProbeGrid(y);else if(y.isLight)T.pushLight(y),y.castShadow&&T.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(Z)){G&&Je.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ae);let Ae=te.update(y),Me=y.material;Me.visible&&b.push(y,Ae,Me,q,Je.z,null,N)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(Z))){let Ae=te.update(y),Me=y.material;if(G&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Je.copy(y.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),Je.copy(Ae.boundingSphere.center)),Je.applyMatrix4(y.matrixWorld).applyMatrix4(ae)),Array.isArray(Me)){let Re=Ae.groups;for(let Le=0,$e=Re.length;Le<$e;Le++){let nt=Re[Le],Ce=Me[nt.materialIndex];Ce&&Ce.visible&&b.push(y,Ae,Ce,q,Je.z,nt,N)}}else Me.visible&&b.push(y,Ae,Me,q,Je.z,null,N)}}let Se=y.children;for(let Ae=0,Me=Se.length;Ae<Me;Ae++)$o(Se[Ae],N,q,G)}function vc(y,N,q,G){let{opaque:V,transmissive:Se,transparent:Ae}=y;T.setupLightsView(q),ne===!0&&Ue.setGlobalState(R.clippingPlanes,q),G&&x.viewport(J.copy(G)),V.length>0&&Ur(V,N,q),Se.length>0&&Ur(Se,N,q),Ae.length>0&&Ur(Ae,N,q),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function yc(y,N,q,G){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[G.id]===void 0){let Ce=Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[G.id]=new Dt(1,1,{generateMipmaps:!0,type:Ce?Vt:en,minFilter:gi,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:tt.workingColorSpace})}let Se=T.state.transmissionRenderTarget[G.id],Ae=G.viewport||J;Se.setSize(Ae.z*R.transmissionResolutionScale,Ae.w*R.transmissionResolutionScale);let Me=R.getRenderTarget(),Re=R.getActiveCubeFace(),Le=R.getActiveMipmapLevel();R.setRenderTarget(Se),R.getClearColor(Ye),je=R.getClearAlpha(),je<1&&R.setClearColor(16777215,.5),R.clear(),mt&&qe.render(q);let $e=R.toneMapping;R.toneMapping=Tn;let nt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),T.setupLightsView(G),ne===!0&&Ue.setGlobalState(R.clippingPlanes,G),Ur(y,q,G),K.updateMultisampleRenderTarget(Se),K.updateRenderTargetMipmap(Se),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let dt=0,It=N.length;dt<It;dt++){let St=N[dt],{object:_t,geometry:Wt,material:we,group:Jt}=St;if(we.side===Rt&&_t.layers.test(G.layers)){let ot=we.side;we.side=Ft,we.needsUpdate=!0,Mc(_t,q,G,Wt,we,Jt),we.side=ot,we.needsUpdate=!0,Ce=!0}}Ce===!0&&(K.updateMultisampleRenderTarget(Se),K.updateRenderTargetMipmap(Se))}R.setRenderTarget(Me,Re,Le),R.setClearColor(Ye,je),nt!==void 0&&(G.viewport=nt),R.toneMapping=$e}function Ur(y,N,q){let G=N.isScene===!0?N.overrideMaterial:null;for(let V=0,Se=y.length;V<Se;V++){let Ae=y[V],{object:Me,geometry:Re,group:Le}=Ae,$e=Ae.material;$e.allowOverride===!0&&G!==null&&($e=G),Me.layers.test(q.layers)&&Mc(Me,N,q,Re,$e,Le)}}function Mc(y,N,q,G,V,Se){U!==null&&V.isNodeMaterial&&U.setObject(y,V),y.onBeforeRender(R,N,q,G,V,Se),y.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),V.onBeforeRender(R,N,q,G,y,Se),V.transparent===!0&&V.side===Rt&&V.forceSinglePass===!1?(V.side=Ft,V.needsUpdate=!0,R.renderBufferDirect(q,N,G,V,y,Se),V.side=Bn,V.needsUpdate=!0,R.renderBufferDirect(q,N,G,V,y,Se),V.side=Rt):R.renderBufferDirect(q,N,G,V,y,Se),y.onAfterRender(R,N,q,G,V,Se)}function Nr(y,N,q){N.isScene!==!0&&(N=fe);let G=X.get(y),V=T.state.lights,Se=T.state.shadowsArray,Ae=V.state.version,Me=pe.getParameters(y,V.state,Se,N,q,T.state.lightProbeGridArray),Re=pe.getProgramCacheKey(Me),Le=G.programs;G.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,G.fog=N.fog;let $e=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;G.envMap=le.get(y.envMap||G.environment,$e),G.envMapRotation=G.environment!==null&&y.envMap===null?N.environmentRotation:y.envMapRotation,Le===void 0&&(y.addEventListener("dispose",An),Le=new Map,G.programs=Le);let nt=Le.get(Re);if(nt!==void 0){if(G.currentProgram===nt&&G.lightsStateVersion===Ae)return bc(y,Me),nt}else Me.uniforms=pe.getUniforms(y),U!==null&&y.isNodeMaterial&&U.build(y,q,Me),y.onBeforeCompile(Me,R),nt=pe.acquireProgram(Me,Re),Le.set(Re,nt),G.uniforms=Me.uniforms;let Ce=G.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ce.clippingPlanes=Ue.uniform),bc(y,Me),G.needsLights=Iu(y),G.lightsStateVersion=Ae,G.needsLights&&(Ce.ambientLightColor.value=V.state.ambient,Ce.lightProbe.value=V.state.probe,Ce.sunLights.value=V.state.sun,Ce.sunLightShadows.value=V.state.sunShadow,Ce.directionalLights.value=V.state.directional,Ce.directionalLightShadows.value=V.state.directionalShadow,Ce.spotLights.value=V.state.spot,Ce.spotLightShadows.value=V.state.spotShadow,Ce.rectAreaLights.value=V.state.rectArea,Ce.ltc_1.value=V.state.rectAreaLTC1,Ce.ltc_2.value=V.state.rectAreaLTC2,Ce.pointLights.value=V.state.point,Ce.pointLightShadows.value=V.state.pointShadow,Ce.hemisphereLights.value=V.state.hemi,Ce.sunShadowMatrix.value=V.state.sunShadowMatrix,Ce.sunShadowCascade.value=V.state.sunShadowCascade,Ce.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ce.spotLightMatrix.value=V.state.spotLightMatrix,Ce.spotLightMap.value=V.state.spotLightMap,Ce.pointShadowMatrix.value=V.state.pointShadowMatrix),G.lightProbeGrid=T.state.lightProbeGridArray.length>0,G.currentProgram=nt,G.uniformsList=null,nt}function Sc(y){if(y.uniformsList===null){let N=y.currentProgram.getUniforms();y.uniformsList=ys.seqWithValue(N.seq,y.uniforms)}return y.uniformsList}function bc(y,N){let q=X.get(y);q.outputColorSpace=N.outputColorSpace,q.batching=N.batching,q.batchingColor=N.batchingColor,q.instancing=N.instancing,q.instancingColor=N.instancingColor,q.instancingMorph=N.instancingMorph,q.skinning=N.skinning,q.morphTargets=N.morphTargets,q.morphNormals=N.morphNormals,q.morphColors=N.morphColors,q.morphTargetsCount=N.morphTargetsCount,q.numClippingPlanes=N.numClippingPlanes,q.numIntersection=N.numClipIntersection,q.vertexAlphas=N.vertexAlphas,q.vertexTangents=N.vertexTangents,q.toneMapping=N.toneMapping}function Ru(y,N){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let q=0,G=y.length;q<G;q++){let V=y[q];if(V.texture!==null&&V.boundingBox.containsPoint(v))return V}return null}function Cu(y,N,q,G,V){N.isScene!==!0&&(N=fe),K.resetTextureUnits();let Se=N.fog,Ae=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?N.environment:null,Me=ie===null?R.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:tt.workingColorSpace,Re=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Le=le.get(G.envMap||Ae,Re),$e=G.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,nt=!!q.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ce=!!q.morphAttributes.position,dt=!!q.morphAttributes.normal,It=!!q.morphAttributes.color,St=Tn;G.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(St=R.toneMapping);let _t=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Wt=_t!==void 0?_t.length:0,we=X.get(G),Jt=T.state.lights;if(ne===!0&&(oe===!0||y!==O)){let Mt=y===O&&G.id===B;Ue.setState(G,y,Mt)}let ot=!1;G.version===we.__version?(we.needsLights&&we.lightsStateVersion!==Jt.state.version||we.outputColorSpace!==Me||V.isBatchedMesh&&we.batching===!1||!V.isBatchedMesh&&we.batching===!0||V.isBatchedMesh&&we.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&we.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&we.instancing===!1||!V.isInstancedMesh&&we.instancing===!0||V.isSkinnedMesh&&we.skinning===!1||!V.isSkinnedMesh&&we.skinning===!0||V.isInstancedMesh&&we.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&we.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&we.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&we.instancingMorph===!1&&V.morphTexture!==null||we.envMap!==Le||G.fog===!0&&we.fog!==Se||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Ue.numPlanes||we.numIntersection!==Ue.numIntersection)||we.vertexAlphas!==$e||we.vertexTangents!==nt||we.morphTargets!==Ce||we.morphNormals!==dt||we.morphColors!==It||we.toneMapping!==St||we.morphTargetsCount!==Wt||!!we.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ot=!0):(ot=!0,we.__version=G.version);let hn=we.currentProgram;ot===!0&&(hn=Nr(G,N,V),U&&G.isNodeMaterial&&U.onUpdateProgram(G,hn,we));let Rn=!1,jn=!1,Fi=!1,gt=hn.getUniforms(),Ct=we.uniforms;if(x.useProgram(hn.program)&&(Rn=!0,jn=!0,Fi=!0),G.id!==B&&(B=G.id,jn=!0),we.needsLights){let Mt=Ru(T.state.lightProbeGridArray,V);we.lightProbeGrid!==Mt&&(we.lightProbeGrid=Mt,jn=!0)}if(Rn||O!==y){x.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),gt.setValue(P,"projectionMatrix",y.projectionMatrix),gt.setValue(P,"viewMatrix",y.matrixWorldInverse);let ti=gt.map.cameraPosition;ti!==void 0&&ti.setValue(P,Fe.setFromMatrixPosition(y.matrixWorld)),w.logarithmicDepthBuffer&&gt.setValue(P,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&gt.setValue(P,"isOrthographic",y.isOrthographicCamera===!0),O!==y&&(O=y,jn=!0,Fi=!0)}if(we.needsLights&&(Jt.state.sunShadowMap.length>0&&gt.setValue(P,"sunShadowMap",Jt.state.sunShadowMap,K),Jt.state.directionalShadowMap.length>0&&gt.setValue(P,"directionalShadowMap",Jt.state.directionalShadowMap,K),Jt.state.spotShadowMap.length>0&&gt.setValue(P,"spotShadowMap",Jt.state.spotShadowMap,K),Jt.state.pointShadowMap.length>0&&gt.setValue(P,"pointShadowMap",Jt.state.pointShadowMap,K)),V.isSkinnedMesh){gt.setOptional(P,V,"bindMatrix"),gt.setOptional(P,V,"bindMatrixInverse");let Mt=V.skeleton;Mt&&(Mt.boneTexture===null&&Mt.computeBoneTexture(),gt.setValue(P,"boneTexture",Mt.boneTexture,K))}V.isBatchedMesh&&(gt.setOptional(P,V,"batchingTexture"),gt.setValue(P,"batchingTexture",V._matricesTexture,K),gt.setOptional(P,V,"batchingIdTexture"),gt.setValue(P,"batchingIdTexture",V._indirectTexture,K),gt.setOptional(P,V,"batchingColorTexture"),V._colorsTexture!==null&&gt.setValue(P,"batchingColorTexture",V._colorsTexture,K));let ei=q.morphAttributes;if((ei.position!==void 0||ei.normal!==void 0||ei.color!==void 0)&&F.update(V,q,hn),(jn||we.receiveShadow!==V.receiveShadow)&&(we.receiveShadow=V.receiveShadow,gt.setValue(P,"receiveShadow",V.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&N.environment!==null&&(Ct.envMapIntensity.value=N.environmentIntensity),Ct.dfgLUT!==void 0&&(Ct.dfgLUT.value=l0()),jn){if(gt.setValue(P,"toneMappingExposure",R.toneMappingExposure),we.needsLights&&Pu(Ct,Fi),Se&&G.fog===!0&&De.refreshFogUniforms(Ct,Se),De.refreshMaterialUniforms(Ct,G,j,$,T.state.transmissionRenderTarget[y.id]),we.needsLights&&we.lightProbeGrid){let Mt=we.lightProbeGrid;Ct.probesSH.value=Mt.texture,Ct.probesMin.value.copy(Mt.boundingBox.min),Ct.probesMax.value.copy(Mt.boundingBox.max),Ct.probesResolution.value.copy(Mt.resolution)}ys.upload(P,Sc(we),Ct,K)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(ys.upload(P,Sc(we),Ct,K),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&gt.setValue(P,"center",V.center),gt.setValue(P,"modelViewMatrix",V.modelViewMatrix),gt.setValue(P,"normalMatrix",V.normalMatrix),gt.setValue(P,"modelMatrix",V.matrixWorld),G.uniformsGroups!==void 0){let Mt=G.uniformsGroups;for(let ti=0,Bi=Mt.length;ti<Bi;ti++){let Tc=Mt[ti];se.update(Tc,hn),se.bind(Tc,hn)}}return hn}function Pu(y,N){y.ambientLightColor.needsUpdate=N,y.lightProbe.needsUpdate=N,y.sunLights.needsUpdate=N,y.sunLightShadows.needsUpdate=N,y.directionalLights.needsUpdate=N,y.directionalLightShadows.needsUpdate=N,y.pointLights.needsUpdate=N,y.pointLightShadows.needsUpdate=N,y.spotLights.needsUpdate=N,y.spotLightShadows.needsUpdate=N,y.rectAreaLights.needsUpdate=N,y.hemisphereLights.needsUpdate=N}function Iu(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return ie},this.setRenderTargetTextures=function(y,N,q){let G=X.get(y);G.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),X.get(y.texture).__webglTexture=N,X.get(y.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:q,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,N){let q=X.get(y);q.__webglFramebuffer=N,q.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(y,N=0,q=0){ie=y,W=N,Y=q;let G=null,V=!1,Se=!1;if(y){let Me=X.get(y);if(Me.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(P.FRAMEBUFFER,Me.__webglFramebuffer),J.copy(y.viewport),ce.copy(y.scissor),Ee=y.scissorTest,x.viewport(J),x.scissor(ce),x.setScissorTest(Ee),B=-1;return}else if(Me.__webglFramebuffer===void 0)K.setupRenderTarget(y);else if(Me.__hasExternalTextures)K.rebindTextures(y,X.get(y.texture).__webglTexture,X.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let $e=y.depthTexture;if(Me.__boundDepthTexture!==$e){if($e!==null&&X.has($e)&&(y.width!==$e.image.width||y.height!==$e.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(y)}}let Re=y.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(Se=!0);let Le=X.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Le[N])?G=Le[N][q]:G=Le[N],V=!0):y.samples>0&&K.useMultisampledRTT(y)===!1?G=X.get(y).__webglMultisampledFramebuffer:Array.isArray(Le)?G=Le[q]:G=Le,J.copy(y.viewport),ce.copy(y.scissor),Ee=y.scissorTest}else J.copy(ye).multiplyScalar(j).floor(),ce.copy(Oe).multiplyScalar(j).floor(),Ee=Te;if(q!==0&&(G=H),x.bindFramebuffer(P.FRAMEBUFFER,G)&&x.drawBuffers(y,G),x.viewport(J),x.scissor(ce),x.setScissorTest(Ee),V){let Me=X.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+N,Me.__webglTexture,q)}else if(Se){let Me=N;for(let Re=0;Re<y.textures.length;Re++){let Le=X.get(y.textures[Re]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Re,Le.__webglTexture,q,Me)}}else if(y!==null&&q!==0){let Me=X.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Me.__webglTexture,q)}B=-1};function Ec(y){let N=X.get(y);return(N.__readFormat!==y.format||N.__readType!==y.type)&&(N.__readFormat=y.format,N.__readType=y.type,N.__formatReadable=w.textureFormatReadable(y.format),N.__typeReadable=w.textureTypeReadable(y.type)),N}this.readRenderTargetPixels=function(y,N,q,G,V,Se,Ae,Me=0){if(!(y&&y.isWebGLRenderTarget)){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=X.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ae!==void 0&&(Re=Re[Ae]),Re){x.bindFramebuffer(P.FRAMEBUFFER,Re);try{let Le=y.textures[Me],$e=Le.format,nt=Le.type;y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Me);let Ce=Ec(Le);if(Ce.__formatReadable===!1){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ce.__typeReadable===!1){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=y.width-G&&q>=0&&q<=y.height-V&&P.readPixels(N,q,G,V,xe.convert($e),xe.convert(nt),Se)}finally{let Le=ie!==null?X.get(ie).__webglFramebuffer:null;x.bindFramebuffer(P.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(y,N,q,G,V,Se,Ae,Me=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=X.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ae!==void 0&&(Re=Re[Ae]),Re)if(N>=0&&N<=y.width-G&&q>=0&&q<=y.height-V){x.bindFramebuffer(P.FRAMEBUFFER,Re);let Le=y.textures[Me],$e=Le.format,nt=Le.type;y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Me);let Ce=Ec(Le);if(Ce.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ce.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let dt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,dt),P.bufferData(P.PIXEL_PACK_BUFFER,Se.byteLength,P.STREAM_READ),P.readPixels(N,q,G,V,xe.convert($e),xe.convert(nt),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);let It=ie!==null?X.get(ie).__webglFramebuffer:null;x.bindFramebuffer(P.FRAMEBUFFER,It);let St=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Ih(P,St,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,dt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,Se),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(dt),P.deleteSync(St),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,N=null,q=0){let G=Math.pow(2,-q),V=Math.floor(y.image.width*G),Se=Math.floor(y.image.height*G),Ae=N!==null?N.x:0,Me=N!==null?N.y:0;K.setTexture2D(y,0),P.copyTexSubImage2D(P.TEXTURE_2D,q,0,0,Ae,Me,V,Se),x.unbindTexture()},this.copyTextureToTexture=function(y,N,q=null,G=null,V=0,Se=0){let Ae,Me,Re,Le,$e,nt,Ce,dt,It,St=y.isCompressedTexture?y.mipmaps[Se]:y.image;if(q!==null)Ae=q.max.x-q.min.x,Me=q.max.y-q.min.y,Re=q.isBox3?q.max.z-q.min.z:1,Le=q.min.x,$e=q.min.y,nt=q.isBox3?q.min.z:0;else{let Ct=Math.pow(2,-V);Ae=Math.floor(St.width*Ct),Me=Math.floor(St.height*Ct),y.isDataArrayTexture?Re=St.depth:y.isData3DTexture?Re=Math.floor(St.depth*Ct):Re=1,Le=0,$e=0,nt=0}G!==null?(Ce=G.x,dt=G.y,It=G.z):(Ce=0,dt=0,It=0);let _t=xe.convert(N.format),Wt=xe.convert(N.type),we;N.isData3DTexture?(K.setTexture3D(N,0),we=P.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(K.setTexture2DArray(N,0),we=P.TEXTURE_2D_ARRAY):(K.setTexture2D(N,0),we=P.TEXTURE_2D),x.activeTexture(P.TEXTURE0),x.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,N.flipY),x.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),x.pixelStorei(P.UNPACK_ALIGNMENT,N.unpackAlignment);let Jt=x.getParameter(P.UNPACK_ROW_LENGTH),ot=x.getParameter(P.UNPACK_IMAGE_HEIGHT),hn=x.getParameter(P.UNPACK_SKIP_PIXELS),Rn=x.getParameter(P.UNPACK_SKIP_ROWS),jn=x.getParameter(P.UNPACK_SKIP_IMAGES);x.pixelStorei(P.UNPACK_ROW_LENGTH,St.width),x.pixelStorei(P.UNPACK_IMAGE_HEIGHT,St.height),x.pixelStorei(P.UNPACK_SKIP_PIXELS,Le),x.pixelStorei(P.UNPACK_SKIP_ROWS,$e),x.pixelStorei(P.UNPACK_SKIP_IMAGES,nt);let Fi=y.isDataArrayTexture||y.isData3DTexture,gt=N.isDataArrayTexture||N.isData3DTexture;if(y.isDepthTexture){let Ct=X.get(y),ei=X.get(N),Mt=X.get(Ct.__renderTarget),ti=X.get(ei.__renderTarget);x.bindFramebuffer(P.READ_FRAMEBUFFER,Mt.__webglFramebuffer),x.bindFramebuffer(P.DRAW_FRAMEBUFFER,ti.__webglFramebuffer);for(let Bi=0;Bi<Re;Bi++)Fi&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,X.get(y).__webglTexture,V,nt+Bi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,X.get(N).__webglTexture,Se,It+Bi)),P.blitFramebuffer(Le,$e,Ae,Me,Ce,dt,Ae,Me,P.DEPTH_BUFFER_BIT,P.NEAREST);x.bindFramebuffer(P.READ_FRAMEBUFFER,null),x.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(V!==0||y.isRenderTargetTexture||X.has(y)){let Ct=X.get(y),ei=X.get(N);x.bindFramebuffer(P.READ_FRAMEBUFFER,I),x.bindFramebuffer(P.DRAW_FRAMEBUFFER,k);for(let Mt=0;Mt<Re;Mt++)Fi?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ct.__webglTexture,V,nt+Mt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ct.__webglTexture,V),gt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ei.__webglTexture,Se,It+Mt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ei.__webglTexture,Se),V!==0?P.blitFramebuffer(Le,$e,Ae,Me,Ce,dt,Ae,Me,P.COLOR_BUFFER_BIT,P.NEAREST):gt?P.copyTexSubImage3D(we,Se,Ce,dt,It+Mt,Le,$e,Ae,Me):P.copyTexSubImage2D(we,Se,Ce,dt,Le,$e,Ae,Me);x.bindFramebuffer(P.READ_FRAMEBUFFER,null),x.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else gt?y.isDataTexture||y.isData3DTexture?P.texSubImage3D(we,Se,Ce,dt,It,Ae,Me,Re,_t,Wt,St.data):N.isCompressedArrayTexture?P.compressedTexSubImage3D(we,Se,Ce,dt,It,Ae,Me,Re,_t,St.data):P.texSubImage3D(we,Se,Ce,dt,It,Ae,Me,Re,_t,Wt,St):y.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,Se,Ce,dt,Ae,Me,_t,Wt,St.data):y.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,Se,Ce,dt,St.width,St.height,_t,St.data):P.texSubImage2D(P.TEXTURE_2D,Se,Ce,dt,Ae,Me,_t,Wt,St);x.pixelStorei(P.UNPACK_ROW_LENGTH,Jt),x.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ot),x.pixelStorei(P.UNPACK_SKIP_PIXELS,hn),x.pixelStorei(P.UNPACK_SKIP_ROWS,Rn),x.pixelStorei(P.UNPACK_SKIP_IMAGES,jn),Se===0&&N.generateMipmaps&&P.generateMipmap(we),x.unbindTexture()},this.initRenderTarget=function(y){X.get(y).__webglFramebuffer===void 0&&K.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?K.setTextureCube(y,0):y.isData3DTexture?K.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?K.setTexture2DArray(y,0):K.setTexture2D(y,0),x.unbindTexture()},this.resetState=function(){W=0,Y=0,ie=null,x.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var bs={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var ln=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},c0=new pi(-1,1,1,-1,0,1),lc=class extends Tt{constructor(){super(),this.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new it([0,2,0,0,2,0],2))}},h0=new lc,yi=class{constructor(e){this._mesh=new re(h0,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,c0)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var No=class extends ln{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof vt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Qn.clone(e.uniforms),this.material=new vt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new yi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Tr=class extends ln{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Fo=class extends ln{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Bo=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new Pe);this._width=n.width,this._height=n.height,t=new Dt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Vt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new No(bs),this.copyPass.material.blending=fn,this.timer=new ar}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Tr!==void 0&&(a instanceof Tr?n=!0:a instanceof Fo&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Pe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Oo=class extends ln{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Be}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var uu={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Be(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Es=class i extends ln{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Pe(e.x,e.y):new Pe(256,256),this.clearColor=new Be(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Dt(r,a,{type:Vt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new Dt(r,a,{type:Vt,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new Dt(r,a,{type:Vt,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}let o=uu;this.highPassUniforms=Qn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new vt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new Pe(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Qn.clone(bs.uniforms),this.blendMaterial=new vt({uniforms:this.copyUniforms,vertexShader:bs.vertexShader,fragmentShader:bs.fragmentShader,premultipliedAlpha:!0,blending:jt,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Be,this._oldClearAlpha=1,this._basic=new at,this._fsQuad=new yi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Pe(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let s=[],r=[];for(let a=1;a<e;a+=2){let o=t[a],l=a+1<e?t[a+1]:0,c=o+l;s.push((a*o+(a+1)*l)/c),r.push(c)}return new vt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new Pe(.5,.5)},direction:{value:new Pe(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new vt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Es.BlurDirectionX=new Pe(1,0);Es.BlurDirectionY=new Pe(0,1);var wr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var zo=class extends ln{constructor(){super(),this.isOutputPass=!0,this.uniforms=Qn.clone(wr.uniforms),this.material=new fs({name:wr.name,uniforms:this.uniforms,vertexShader:wr.vertexShader,fragmentShader:wr.fragmentShader}),this._fsQuad=new yi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},tt.getTransfer(this._outputColorSpace)===ct&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===lr?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===cr?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===hr?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Pi?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===dr?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===fr?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ur&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function Rs(i){let e=i>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Ar=Math.PI*2,As=(i,e,t)=>i<e?e:i>t?t:i,tn=(i,e,t,n)=>{let s=i-t,r=e-n;return s*s+r*r},ko=(i,e)=>{let t=(e-i)%Ar;return t>Math.PI&&(t-=Ar),t<-Math.PI&&(t+=Ar),t},Ve={player:{hp:100,speed:7.6,dashSpeed:17,dashTime:.18,dashIframes:.3,dashCooldown:1.5,comboDamage:[12,14,22],comboDuration:[.3,.34,.5],comboRange:[2.8,2.8,3.3],comboArc:[1.92,1.92,2.44],comboHitAt:.42,comboBufferAfter:.35,heavyCharge:.55,heavyDamage:34,heavyRadius:4.2,bladeCooldown:2.2,bladeDamage:16,bladeSpeed:26,bladeLife:1.1,energyPerHit:4,energyPerKill:8,burstDamage:40,burstRadius:6.5,hurtIframes:.7},rusher:{hp:20,speed:6.4,radius:.55,score:10,touch:8,windup:.45,lungeSpeed:13,lungeTime:.3,lungeRange:4.6,recover:.8,cooldown:2.2},thrower:{hp:28,speed:3.6,radius:.6,score:20,keepNear:8,keepFar:14,lobCd:2.6,lobTelegraph:.7,lobRadius:2.2,lobDamage:12,lobLead:.35},charger:{hp:45,speed:3.4,radius:.75,score:25,touch:10,chargeSpeed:14.5,chargeTime:.55,chargeDamage:16,telegraph:.8,lineLen:11,lineHalfWidth:1.5,dizzy:1.3,dizzyMult:1.5,cooldown:3.5,rangeMin:5,rangeMax:14},brute:{hp:90,speed:2.3,radius:.95,score:40,touch:10,blockAngle:1.05,blockMult:.2,slamRange:3.8,slamTelegraph:.9,slamRadius:3.5,slamDamage:18,recover:1.2,cooldown:4,kbMult:.15},boss:{hp:550,hpPerWave:130,radius:1.7,score:200,speed:2.6,touch:12,slamDamage:20,slamRadius:4.6,slamTelegraph:1,ringCount:12,ringCountLate:16,ringSpeed:8,ringDamage:10,ringCd:4,stunAfterSlam:1.6,stunMult:2,phase2:.66,phase3:.33,contactRange:3.4}},Ho=[{id:"atkSpeed",name:"\u75BE\u98CE\u8FDE\u65A9",desc:"\u666E\u653B\u901F\u5EA6 +12%",max:5,apply:i=>{i.player.stats.atkSpeed+=.12}},{id:"comboDmg",name:"\u8FDE\u51FB\u7CBE\u901A",desc:"\u666E\u653B\u4F24\u5BB3 +15%",max:5,apply:i=>{i.player.stats.comboDmg+=.15}},{id:"dashCharge",name:"\u53CC\u5F71\u51B2\u523A",desc:"\u51B2\u523A\u5145\u80FD +1",max:2,apply:i=>{i.player.stats.dashMax+=1,i.player.dashCharges+=1}},{id:"lifesteal",name:"\u63A0\u593A\u4E4B\u98CE",desc:"\u6BCF\u6B21\u51FB\u6740\u56DE\u590D 3 \u751F\u547D",max:3,apply:i=>{i.player.stats.lifesteal+=3}},{id:"pierce",name:"\u7A7F\u4E91\u5203",desc:"\u98CE\u5203\u53EF\u591A\u7A7F\u900F 1 \u540D\u654C\u4EBA",max:2,apply:i=>{i.player.stats.bladePierce+=1}},{id:"energyGain",name:"\u7075\u606F",desc:"\u80FD\u91CF\u83B7\u53D6 +30%",max:3,apply:i=>{i.player.stats.energyGain+=.3}},{id:"moveSpeed",name:"\u8F7B\u7FBD",desc:"\u79FB\u52A8\u901F\u5EA6 +10%",max:3,apply:i=>{i.player.stats.moveSpeed+=.1}},{id:"maxHp",name:"\u836F\u5E08\u795D\u798F",desc:"\u751F\u547D\u4E0A\u9650 +25 \u5E76\u56DE\u6EE1 25",max:4,apply:i=>{i.player.maxHp+=25,i.player.hp=As(i.player.hp+25,0,i.player.maxHp)}},{id:"knock",name:"\u91CD\u52BF",desc:"\u51FB\u9000\u529B\u5EA6 +40%",max:3,apply:i=>{i.player.stats.knockMult+=.4}},{id:"dashCd",name:"\u56DE\u606F",desc:"\u51B2\u523A\u5145\u80FD\u65F6\u95F4 -15%",max:3,apply:i=>{i.player.stats.dashRecharge*=.85}}];function Go(i){let e=Ve.player;return{seed:i,time:0,phase:"menu",wave:0,score:0,waveDamageTaken:0,kills:0,player:{x:0,z:0,vx:0,vz:0,face:0,hp:e.hp,maxHp:e.hp,energy:0,comboStage:0,comboT:0,comboBuffered:!1,comboHitDone:!1,comboHits:null,heavyT:-1,dashT:0,dashDirX:0,dashDirZ:0,dashCharges:1,dashRechargeT:0,dashIframes:0,bladeCd:0,hurtIframes:0,hurtT:0,touchCd:0,moving:0,runT:0,stats:{atkSpeed:1,comboDmg:0,dashMax:1,lifesteal:0,bladePierce:1,energyGain:1,moveSpeed:1,knockMult:1,dashRecharge:e.dashCooldown}},enemies:[],projectiles:[],telegraphs:[],pickups:[],effects:[],spawnQueue:[],spawnTimer:0,offer:null,events:[],nextId:1}}function wt(i,e,t){i.events.push({type:e,...t})}var du={rusher:1,thrower:2,charger:3,brute:4};function u0(i,e){let t=[];if(i%3===0){t.push({type:"boss",delay:.4});let a=Math.floor((4+i)/3),o=3;for(;a>0;){let l=a>=3&&e()<.5?"charger":"rusher",c=du[l];if(c>a){a-=1;continue}t.push({type:l,delay:o}),a-=c,o+=1.6+e()*1.4}return t}let n=4+2*i,s=.4;for(;n>0;){let r=["rusher"];i>=2&&r.push("thrower","rusher"),i>=3&&r.push("charger"),i>=4&&r.push("brute");let a=r[Math.floor(e()*r.length)],o=du[a]||1;if(o>n){n-=1;continue}t.push({type:a,delay:s}),n-=o,s+=e()<.45?.1:1.1+e()*1.3}return t}function pu(i){return Math.min(6+i,13)}function hc(i,e){let t=Rs(i.seed+e*7919);i.wave=e,i.spawnQueue=u0(e,t),i.spawnTimer=0,i.waveDamageTaken=0,i.phase="playing",wt(i,"wave",{n:e})}function mu(i,e,t){let s=0,r=0;for(let l=0;l<24;l++){let c=t()*Ar,h=17.5*(.45+.55*t());if(s=Math.cos(c)*h,r=Math.sin(c)*h,tn(s,r,i.player.x,i.player.z)>64)break}let a={id:i.nextId++,type:e,x:s,z:r,vx:0,vz:0,face:0,state:"spawn",t:.6,flash:0,kbx:0,kbz:0,touchCd:0,animT:t()*10},o;if(e==="rusher")o={...a,hp:Ve.rusher.hp,maxHp:Ve.rusher.hp,phase:"chase",cd:1+t()};else if(e==="thrower")o={...a,hp:Ve.thrower.hp,maxHp:Ve.thrower.hp,phase:"keep",cd:1.5+t()};else if(e==="charger")o={...a,hp:Ve.charger.hp,maxHp:Ve.charger.hp,phase:"chase",cd:1.5+t()};else if(e==="brute")o={...a,hp:Ve.brute.hp,maxHp:Ve.brute.hp,phase:"chase",cd:1.5+t()};else if(e==="boss"){let l=Ve.boss.hp+Ve.boss.hpPerWave*Math.floor((i.wave-1)/3);o={...a,hp:l,maxHp:l,phase:"chase",cd:2.5,bossPhase:1,volleys:0,pattern:null,x:0,z:-16,stunMult:1},delete o.cd,o.cd=2.2}i.enemies.push(o),wt(i,"spawnPoof",{x:o.x,z:o.z,type:e})}function d0(i,e){let t=i.upgradesTaken||(i.upgradesTaken={}),n=Ho.filter(a=>(t[a.id]||0)<a.max),s=[],r=n.slice();for(;s.length<3&&r.length>0;){let a=Math.floor(e()*r.length);s.push(r.splice(a,1)[0].id)}return s}function gu(i,e){let t=Ho.find(s=>s.id===e);if(!t)return!1;let n=i.upgradesTaken||(i.upgradesTaken={});return(n[e]||0)>=t.max?!1:(n[e]=(n[e]||0)+1,t.apply(i),wt(i,"upgrade",{id:e}),!0)}function f0(i,e=7){let t=null,n=e*e;for(let s of i.enemies){if(s.state==="spawn")continue;let r=tn(i.player.x,i.player.z,s.x,s.z);r<n&&(n=r,t=s)}return t}function uc(i){let e=f0(i);e&&(i.player.face=Math.atan2(e.x-i.player.x,e.z-i.player.z))}function cc(i,e){let t=i.player;t.comboStage=e,t.comboT=0,t.comboBuffered=!1,t.comboHitDone=!1,t.comboHits=new Set,uc(i),wt(i,"slash",{stage:e,x:t.x,z:t.z,face:t.face})}function Vo(i,e,t,n,s,r,a={}){let o=e.type==="brute"&&!a.ignoreBlock&&Math.abs(ko(e.face,Math.atan2(s,r)))<Ve.brute.blockAngle,l=t*(1+i.player.stats.comboDmg*(a.combo?1:0));e.type==="charger"&&e.phase==="dizzy"&&(l*=Ve.charger.dizzyMult),e.type==="boss"&&e.phase==="stun"&&(l*=Ve.boss.stunMult),o&&(l*=Ve.brute.blockMult,wt(i,"block",{x:e.x,z:e.z})),e.hp-=l,e.flash=.18;let c=n*(e.type==="brute"?Ve.brute.kbMult:1)*i.player.stats.knockMult;e.still||(e.kbx+=s*c,e.kbz+=r*c),xu(i,Ve.player.energyPerHit),wt(i,"hit",{x:e.x,z:e.z,dmg:Math.round(l),blocked:o,boss:e.type==="boss"}),e.hp<=0&&p0(i,e)}function p0(i,e){let t=i.enemies.indexOf(e);t>=0&&i.enemies.splice(t,1),i.kills+=1,i.score+=Ve[e.type].score||10,xu(i,Ve.player.energyPerKill),i.player.stats.lifesteal>0&&(i.player.hp=As(i.player.hp+i.player.stats.lifesteal,0,i.player.maxHp)),e.type==="boss"&&(i.projectiles=i.projectiles.filter(n=>n.kind!=="ebullet"),i.telegraphs=i.telegraphs.filter(n=>n.owner!==e.id)),wt(i,"kill",{x:e.x,z:e.z,type:e.type})}function xu(i,e){let t=i.player;t.energy=As(t.energy+e*t.stats.energyGain,0,100)}function fu(i){let e=i.player,t=As(e.heavyT/Ve.player.heavyCharge,0,1.5);e.heavyT=-1,uc(i);let n=e.x+Math.sin(e.face)*1.6,s=e.z+Math.cos(e.face)*1.6,r=Ve.player.heavyDamage*(.8+.2*As(t,0,1));for(let a of[...i.enemies])if(tn(n,s,a.x,a.z)<Ve.player.heavyRadius*Ve.player.heavyRadius){let l=a.x-e.x,c=a.z-e.z,h=Math.hypot(l,c)||1;Vo(i,a,r,9,l/h,c/h,{ignoreBlock:!0})}wt(i,"heavy",{x:n,z:s,face:e.face})}function m0(i){let e=i.player;e.bladeCd>0||(e.bladeCd=Ve.player.bladeCooldown,uc(i),i.projectiles.push({kind:"blade",x:e.x+Math.sin(e.face)*.8,z:e.z+Math.cos(e.face)*.8,vx:Math.sin(e.face)*Ve.player.bladeSpeed,vz:Math.cos(e.face)*Ve.player.bladeSpeed,t:Ve.player.bladeLife,dmg:Ve.player.bladeDamage,pierce:e.stats.bladePierce,hits:new Set}),wt(i,"blade",{x:e.x,z:e.z,face:e.face}))}function g0(i){let e=i.player;if(!(e.energy<100)){e.energy=0;for(let t of[...i.enemies])if(tn(e.x,e.z,t.x,t.z)<Ve.player.burstRadius*Ve.player.burstRadius){let s=t.x-e.x,r=t.z-e.z,a=Math.hypot(s,r)||1;Vo(i,t,Ve.player.burstDamage,11,s/a,r/a,{ignoreBlock:!0})}wt(i,"burst",{x:e.x,z:e.z})}}function x0(i,e){let t=i.player;if(t.dashCharges<1||t.dashT>0)return;let n=e.moveX,s=e.moveZ;Math.hypot(n,s)<.2&&(n=Math.sin(t.face),s=Math.cos(t.face));let r=Math.hypot(n,s)||1;t.dashDirX=n/r,t.dashDirZ=s/r,t.dashT=Ve.player.dashTime,t.dashCharges-=1,t.dashIframes=Math.max(t.dashIframes,Ve.player.dashIframes),t.comboStage=0,t.comboT=0,t.comboBuffered=!1,t.heavyT=-1,wt(i,"dash",{x:t.x,z:t.z,dirX:t.dashDirX,dirZ:t.dashDirZ})}function Rr(i,e,t,n){let s=i.player;if(s.hurtIframes>0||s.dashIframes>0||i.phase!=="playing")return;s.hp-=e,i.waveDamageTaken+=e,s.hurtIframes=Ve.player.hurtIframes,s.hurtT=.35,s.comboStage=0,s.comboT=0,s.heavyT=-1;let r=s.x-t,a=s.z-n,o=Math.hypot(r,a)||1;s.vx+=r/o*5,s.vz+=a/o*5,wt(i,"playerHurt",{hp:Math.max(0,s.hp),x:s.x,z:s.z}),s.hp<=0&&(s.hp=0,i.phase="over",wt(i,"gameover",{score:i.score,wave:i.wave,kills:i.kills}))}function _0(i,e){for(let t of i.telegraphs)if(t.t+=e,t.t>=t.dur&&!t.resolved){t.resolved=!0;let n=i.player;if(t.kind==="line"){let s=n.x-t.x,r=n.z-t.z,a=s*t.dirX+r*t.dirZ,o=Math.abs(s*t.dirZ-r*t.dirX);if(a>-.5&&a<t.len&&o<t.halfWidth&&Rr(i,t.damage,t.x,t.z),t.owner!==void 0){let l=i.enemies.find(c=>c.id===t.owner);l&&(l.phase="charge",l.t=t.kind==="line"?l.type==="charger"?Ve.charger.chargeTime:.5:0,l.chargeX=t.dirX,l.chargeZ=t.dirZ)}}else if(t.kind==="slam"){if(tn(n.x,n.z,t.x,t.z)<t.radius*t.radius&&Rr(i,t.damage,t.x,t.z),t.owner!==void 0){let s=i.enemies.find(r=>r.id===t.owner);s&&s.type==="boss"?(s.phase="stun",s.t=Ve.boss.stunAfterSlam,wt(i,"bossStun",{x:s.x,z:s.z})):s&&(s.phase="recover",s.t=Ve.brute.recover)}}else t.kind==="lob"&&(tn(n.x,n.z,t.x,t.z)<t.radius*t.radius&&Rr(i,t.damage,t.x,t.z),wt(i,"lobDone",{x:t.x,z:t.z}));wt(i,"telegraphDone",{kind:t.kind,x:t.x,z:t.z})}i.telegraphs=i.telegraphs.filter(t=>t.t<t.dur+.05)}function ws(i,e,t,n,s,r){let a=t-e.x,o=n-e.z,l=Math.hypot(a,o);l>.01?(e.vx=a/l*s,e.vz=o/l*s):(e.vx=0,e.vz=0)}function v0(i,e,t){for(let n of i.enemies){if(n===e||n.state==="spawn")continue;let s=(Ve[e.type].radius+Ve[n.type].radius)*.9,r=tn(e.x,e.z,n.x,n.z);if(r<s*s&&r>1e-4){let a=Math.sqrt(r),o=(s-a)*2.2;e.kbx+=(e.x-n.x)/a*o*t*60*.02,e.kbz+=(e.z-n.z)/a*o*t*60*.02}}}function Ts(i,e,t,n){e.touchCd-=t;let s=i.player,r=Ve[e.type].radius+.5;e.touchCd<=0&&tn(s.x,s.z,e.x,e.z)<r*r&&(e.touchCd=.8,Rr(i,n,e.x,e.z))}function y0(i,e,t,n){let s=i.player,r=Ve[e.type];if(e.animT+=t,e.flash=Math.max(0,e.flash-t),e.state==="spawn"){e.t-=t,e.t<=0&&(e.state="act");return}let a=Math.atan2(s.x-e.x,s.z-e.z);switch(e.type){case"rusher":{if(e.phase==="chase"){e.face=a;let o=Math.sin(e.animT*3+e.id)*.5;ws(i,e,s.x+Math.cos(a)*o*2,s.z-Math.sin(a)*o*2,r.speed,t),e.cd-=t,e.cd<=0&&tn(e.x,e.z,s.x,s.z)<r.lungeRange*r.lungeRange&&(e.phase="windup",e.t=r.windup,e.lungeX=Math.sin(a),e.lungeZ=Math.cos(a))}else e.phase==="windup"?(e.t-=t,e.vx=0,e.vz=0,e.t<=0&&(e.phase="lunge",e.t=r.lungeTime)):e.phase==="lunge"?(e.t-=t,e.vx=e.lungeX*r.lungeSpeed,e.vz=e.lungeZ*r.lungeSpeed,Ts(i,e,t,r.touch+4),e.t<=0&&(e.phase="recover",e.t=r.recover,e.cd=r.cooldown)):e.phase==="recover"&&(e.t-=t,e.vx=0,e.vz=0,e.t<=0&&(e.phase="chase"));Ts(i,e,t,r.touch);break}case"thrower":{e.face=a;let o=Math.hypot(s.x-e.x,s.z-e.z);if(o<r.keepNear?ws(i,e,e.x-(s.x-e.x),e.z-(s.z-e.z),r.speed,t):o>r.keepFar?ws(i,e,s.x,s.z,r.speed,t):(e.vx=Math.cos(e.animT*1.7)*r.speed*.5,e.vz=Math.sin(e.animT*1.3)*r.speed*.5),e.cd-=t,e.cd<=0&&o<18){e.cd=r.lobCd;let l=r.lobLead;i.telegraphs.push({kind:"lob",x:s.x+s.vx*l,z:s.z+s.vz*l,radius:r.lobRadius,damage:r.lobDamage,t:0,dur:r.lobTelegraph,owner:e.id}),wt(i,"lobAim",{x:s.x+s.vx*l,z:s.z+s.vz*l})}break}case"charger":{if(e.phase==="chase"){e.face=a,ws(i,e,s.x,s.z,r.speed,t),e.cd-=t;let o=Math.hypot(s.x-e.x,s.z-e.z);if(e.cd<=0&&o>r.rangeMin&&o<r.rangeMax){e.phase="aim",e.t=r.telegraph;let l=Math.sin(a),c=Math.cos(a);e.chargeX=l,e.chargeZ=c,e.face=a,i.telegraphs.push({kind:"line",x:e.x,z:e.z,dirX:l,dirZ:c,len:r.lineLen,halfWidth:r.lineHalfWidth,damage:r.chargeDamage,t:0,dur:r.telegraph,owner:e.id}),wt(i,"chargeAim",{x:e.x,z:e.z,dirX:l,dirZ:c})}}else e.phase==="aim"?(e.t-=t,e.vx=0,e.vz=0):e.phase==="charge"?(e.t-=t,e.vx=e.chargeX*r.chargeSpeed,e.vz=e.chargeZ*r.chargeSpeed,Ts(i,e,t,r.chargeDamage),e.t<=0&&(e.phase="dizzy",e.t=r.dizzy,e.cd=r.cooldown,wt(i,"dizzy",{x:e.x,z:e.z}))):e.phase==="dizzy"&&(e.t-=t,e.vx=0,e.vz=0,e.t<=0&&(e.phase="chase"));e.phase!=="charge"&&e.phase!=="aim"&&Ts(i,e,t,r.touch);break}case"brute":{e.face=ko(e.face,a)!==0?e.face+As(ko(e.face,a),-1.8*t,1.8*t):a,e.phase==="chase"?(ws(i,e,s.x,s.z,r.speed,t),e.cd-=t,e.cd<=0&&tn(e.x,e.z,s.x,s.z)<r.slamRange*r.slamRange&&(e.phase="slam",e.t=r.slamTelegraph,i.telegraphs.push({kind:"slam",x:e.x,z:e.z,radius:r.slamRadius,damage:r.slamDamage,t:0,dur:r.slamTelegraph,owner:e.id}))):e.phase==="slam"?(e.t-=t,e.vx=0,e.vz=0):e.phase==="recover"&&(e.t-=t,e.t<=0&&(e.phase="chase",e.cd=r.cooldown)),Ts(i,e,t,r.touch);break}case"boss":{M0(i,e,t,n,a),Ts(i,e,t,r.touch);break}}v0(i,e,t)}function Mi(i,e,t){let n=Ve.boss;if(t==="ring"){let s=e.bossPhase>=3?n.ringCountLate:n.ringCount,r=e.animT;for(let a=0;a<s;a++){let o=r+a/s*Ar;i.projectiles.push({kind:"ebullet",x:e.x,z:e.z,vx:Math.sin(o)*n.ringSpeed,vz:Math.cos(o)*n.ringSpeed,t:5,dmg:n.ringDamage,r:.35})}wt(i,"bossRing",{x:e.x,z:e.z})}else if(t==="slam")i.telegraphs.push({kind:"slam",x:e.x,z:e.z,radius:n.slamRadius,damage:n.slamDamage,t:0,dur:n.slamTelegraph,owner:e.id});else if(t==="charge"){let s=Math.atan2(i.player.x-e.x,i.player.z-e.z),r=Math.sin(s),a=Math.cos(s);i.telegraphs.push({kind:"line",x:e.x,z:e.z,dirX:r,dirZ:a,len:Ve.charger.lineLen+4,halfWidth:2.2,damage:n.slamDamage,t:0,dur:.85,owner:e.id,boss:!0})}else if(t==="summon"){let s=Rs(i.seed+i.time*1e3|0),r=pu(i.wave),a=0;for(let o=0;o<4&&i.enemies.length<r;o++)mu(i,"rusher",s),a++;wt(i,"bossSummon",{n:a})}}function M0(i,e,t,n,s){let r=Ve.boss,a=e.hp/e.maxHp,o=a<=r.phase3?3:a<=r.phase2?2:1;if(o!==e.bossPhase&&e.phase!=="stun"&&(e.bossPhase=o,e.cd=1.2,wt(i,"bossPhase",{phase:o,x:e.x,z:e.z})),e.phase==="stun"){e.t-=t,e.vx=0,e.vz=0,e.t<=0&&(e.phase="chase",e.cd=.8);return}if(e.phase==="chase"){let l=Math.hypot(i.player.x-e.x,i.player.z-e.z),c=e.bossPhase===1?7:9;if(l>c?ws(i,e,i.player.x,i.player.z,r.speed*(e.bossPhase===3?1.35:1),t):(e.vx*=.9,e.vz*=.9),e.cd-=t,e.cd<=0){let h=n();e.bossPhase===1?h<.55&&l<8?(Mi(i,e,"slam"),e.phase="slam",e.t=r.slamTelegraph,e.cd=3.4):(Mi(i,e,"ring"),e.cd=r.ringCd*.8):e.bossPhase===2?h<.5?(Mi(i,e,"charge"),e.cd=2.6):h<.8?(Mi(i,e,"ring"),e.cd=r.ringCd*.65):(Mi(i,e,"slam"),e.phase="slam",e.t=r.slamTelegraph,e.cd=3.2):h<.3?(Mi(i,e,"summon"),e.cd=4.5):h<.6?(Mi(i,e,"charge"),e.cd=2.2):(Mi(i,e,"ring"),e.cd=r.ringCd*.5)}}else e.phase==="slam"?(e.t-=t,e.vx=0,e.vz=0):e.phase==="charge"&&(e.t-=t,e.vx=e.chargeX*16,e.vz=e.chargeZ*16,e.t<=0&&(e.phase="chase",e.cd=2,e.vx=0,e.vz=0));e.face=s}function S0(i,e){for(let t of i.projectiles){if(t.t-=e,t.x+=t.vx*e,t.z+=t.vz*e,t.kind==="blade")for(let s of i.enemies){if(t.hits.has(s.id)||s.state==="spawn")continue;let r=Ve[s.type].radius+.4;if(tn(t.x,t.z,s.x,s.z)<r*r){t.hits.add(s.id);let a=Math.hypot(t.vx,t.vz)||1;if(Vo(i,s,t.dmg,3,t.vx/a,t.vz/a),t.pierce-=1,t.pierce<=0){t.t=0;break}}}else t.kind==="ebullet"&&tn(t.x,t.z,i.player.x,i.player.z)<.36&&(Rr(i,t.dmg,t.x,t.z),t.t=0);let n=(21-.5)*(21-.5);tn(t.x,t.z,0,0)>n&&(t.t=0)}i.projectiles=i.projectiles.filter(t=>t.t>0)}function _u(i,e,t,n){if(i.phase==="paused"||i.phase==="menu"||i.phase==="upgrade"||i.phase==="over"){i.events.length=0;return}i.time+=e;let s=i.player,r=Ve.player;if(s.bladeCd=Math.max(0,s.bladeCd-e),s.hurtIframes=Math.max(0,s.hurtIframes-e),s.hurtT=Math.max(0,s.hurtT-e),s.dashIframes=Math.max(0,s.dashIframes-e),s.dashCharges<s.stats.dashMax?(s.dashRechargeT+=e,s.dashRechargeT>=s.stats.dashRecharge&&(s.dashRechargeT=0,s.dashCharges+=1,wt(i,"dashRecharge",{charges:s.dashCharges}))):s.dashRechargeT=0,s.dashT>0)s.dashT-=e,s.vx=s.dashDirX*r.dashSpeed,s.vz=s.dashDirZ*r.dashSpeed,s.dashT<=0&&(s.vx=s.vz=0);else{let l=t.moveX||0,c=t.moveZ||0,h=Math.hypot(l,c),d=s.comboStage>0||s.heavyT>=0;if(h>.15){let u=r.speed*s.stats.moveSpeed*(d?.35:1);s.vx=l/h*u,s.vz=c/h*u,s.moving=Math.min(1,s.moving+e*8),!d&&s.comboStage===0&&(s.face=Math.atan2(l,c)),s.runT+=e*(1+u*.12)}else s.vx*=Math.pow(1e-4,e),s.vz*=Math.pow(1e-4,e),s.moving=Math.max(0,s.moving-e*8)}if(t.heavyDown&&s.heavyT>=0?(s.heavyT+=e,s.heavyT>=1.2&&fu(i)):!t.heavyDown&&s.heavyT>=0&&(s.heavyT>=r.heavyCharge?fu(i):s.heavyT=-1),t.attackPressed&&s.heavyT<0&&(s.comboStage===0?cc(i,1):!s.comboBuffered&&s.comboT>r.comboDuration[s.comboStage-1]*(1/s.stats.atkSpeed)*r.comboBufferAfter&&(s.comboBuffered=!0)),t.heavyPressed&&s.heavyT<0&&s.comboStage===0&&(s.heavyT=0),t.dashPressed&&x0(i,t),t.bladePressed&&m0(i),t.burstPressed&&g0(i),s.comboStage>0){let l=s.comboStage,c=r.comboDuration[l-1]/s.stats.atkSpeed;if(s.comboT+=e,!s.comboHitDone&&s.comboT>=c*r.comboHitAt){s.comboHitDone=!0;let h=r.comboRange[l-1],d=r.comboArc[l-1],u=r.comboDamage[l-1],p=l===3?8:3.5;for(let g of[...i.enemies]){if(g.state==="spawn")continue;let S=tn(s.x,s.z,g.x,g.z),m=h+Ve[g.type].radius;if(S>m*m)continue;let f=Math.atan2(g.x-s.x,g.z-s.z);if(Math.abs(ko(s.face,f))>d/2)continue;let M=g.x-s.x,A=g.z-s.z,v=Math.hypot(M,A)||1;Vo(i,g,u,p,M/v,A/v,{combo:!0})}}s.comboT>=c&&(s.comboBuffered&&l<3?cc(i,l+1):s.comboBuffered&&l===3?cc(i,1):(s.comboStage=0,s.comboT=0))}s.x+=s.vx*e,s.z+=s.vz*e;let a=Math.hypot(s.x,s.z),o=20;a>o&&(s.x=s.x/a*o,s.z=s.z/a*o,s.vx*=.2,s.vz*=.2);for(let l of[...i.enemies]){l.kbx*=Math.pow(.002,e),l.kbz*=Math.pow(.002,e),l.x+=(l.vx+l.kbx)*e,l.z+=(l.vz+l.kbz)*e;let c=Math.hypot(l.x,l.z);c>20&&(l.x=l.x/c*20,l.z=l.z/c*20),y0(i,l,e,n)}_0(i,e),S0(i,e);for(let l of i.pickups)l.t+=e;if(i.spawnQueue.length>0){i.spawnTimer+=e;let l=pu(i.wave);for(;i.spawnQueue.length>0&&i.enemies.length<l&&i.spawnQueue[0].delay<=i.spawnTimer;){let c=i.spawnQueue.shift();mu(i,c.type,n)}}else if(i.enemies.length===0&&i.phase==="playing"){let l=i.waveDamageTaken===0;i.score+=50+10*i.wave+(l?25:0),i.offer=d0(i,n),i.phase="upgrade",wt(i,"waveClear",{n:i.wave,flawless:l,offer:i.offer})}}function dc(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Tt,c=0;for(let h=0;h<i.length;++h){let d=i[h],u=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in d.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(d.attributes[p]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in d.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(d.morphAttributes[p])}if(e){let p;if(t)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(t){let h=0,d=[];for(let u=0;u<i.length;++u){let p=i[u].index;for(let g=0;g<p.count;++g)d.push(p.getX(g)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(let h in r){let d=vu(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in a){let d=a[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){let p=[];for(let S=0;S<a[h].length;++S)p.push(a[h][S][u]);let g=vu(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function vu(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new Nt(a,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let d=l/t;for(let u=0,p=h.count;u<p;u++)for(let g=0;g<t;g++){let S=h.getComponent(u,g);o.setComponent(u+d,g,S)}}else a.set(h.array,l);l+=h.count*t}return s!==void 0&&(o.gpuType=s),o}var ft={ink:1517355,sun:16773590,grassA:7651678,grassB:10410095,grassDeco:5545546,cliff:9149818,cliffDark:7110756,trunk:9071176,leafA:5221998,leafB:8176997,water:5227465,rock:9674891,jacket:3042140,jacketLight:4164213,skin:16767412,hair:2572362,scarf:16734780,steel:15266806,rusher:11760703,thrower:9411154,charger:10116931,brute:7174770,bossCore:2051666,bossRing:14263361,petal:16767458},fc=null;function b0(){if(fc)return fc;let i=new Uint8Array([96,160,216,255]),e=new Zn(i,4,1,_i);return e.minFilter=At,e.magFilter=At,e.generateMipmaps=!1,e.needsUpdate=!0,fc=e,e}function Xe(i,{rim:e=16777215,rimStrength:t=.22,emissive:n=0,emissiveIntensity:s=1,transparent:r=!1,opacity:a=1,side:o=Bn}={}){let l=new Ri({color:i,gradientMap:b0(),transparent:r,opacity:a,side:o,emissive:n,emissiveIntensity:s});return t>0&&(l.userData.uniforms={uRimColor:{value:new Be(e)},uRimStrength:{value:t}},l.onBeforeCompile=c=>{Object.assign(c.uniforms,l.userData.uniforms),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uRimColor;
uniform float uRimStrength;`).replace("#include <opaque_fragment>",`
          float isleRim = pow(1.0 - clamp(dot(normalize(vViewPosition), normalize(normal)), 0.0, 1.0), 2.4);
          outgoingLight += uRimColor * isleRim * uRimStrength;
          #include <opaque_fragment>
        `)}),l}var pc=null;function E0(){return pc||(pc=new vt({uniforms:{uWidth:{value:.03},uColor:{value:new Be(ft.ink)}},vertexShader:`
        uniform float uWidth;
        void main() {
          vec3 pos = position + normal * uWidth;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,fragmentShader:`
        uniform vec3 uColor;
        void main() { gl_FragColor = vec4(uColor, 1.0); }`,side:Ft})),pc}function nn(i,e=.035){let t=E0().clone();t.uniforms.uWidth.value=e;let n=new re(i.geometry,t);return n.renderOrder=-1,i.add(n),n}function Cs(i="rgba(255,255,255,1)",e="rgba(255,255,255,0)",t=128,n=null){let s=document.createElement("canvas");s.width=s.height=t;let r=s.getContext("2d"),a=r.createRadialGradient(t/2,t/2,0,t/2,t/2,t/2);if(n)for(let[l,c]of n)a.addColorStop(l,c);else a.addColorStop(0,i),a.addColorStop(1,e);r.fillStyle=a,r.fillRect(0,0,t,t);let o=new us(s);return o.colorSpace=kt,o}function yu(i=256){let e=document.createElement("canvas");e.width=i,e.height=i/2;let t=e.getContext("2d"),n=(r,a,o,l)=>{let c=t.createRadialGradient(r,a,0,r,a,o);c.addColorStop(0,`rgba(255,255,255,${l})`),c.addColorStop(.65,`rgba(255,252,245,${l*.55})`),c.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=c,t.fillRect(r-o,a-o,o*2,o*2)};n(i*.32,i*.3,i*.2,.85),n(i*.5,i*.26,i*.24,.9),n(i*.68,i*.32,i*.18,.8),n(i*.44,i*.4,i*.22,.7),n(i*.6,i*.42,i*.16,.6);let s=new us(e);return s.colorSpace=kt,s}function Cr(i,e,t=Math.random){let n=i.attributes.position;for(let s=0;s<n.count;s++)n.setXYZ(s,n.getX(s)+(t()-.5)*e,n.getY(s)+(t()-.5)*e,n.getZ(s)+(t()-.5)*e);return i.computeVertexNormals(),i}var Ui=new L(.78,.4,-.42).normalize();function T0(){let i=new an(.13,.55);i.translate(0,.27,0);let e=i.clone();return e.rotateY(Math.PI/2),dc([i,e])}function w0(){let i=new Qt(.02,.03,.34,5);i.translate(0,.17,0);let e=new ht(.09,7,6);return e.scale(1,.62,1),e.translate(0,.36,0),dc([i,e])}function Mu(i){let e=new lt,t=new re(new Qt(.16,.3,1.7,7),Xe(ft.trunk,{rimStrength:.14}));t.position.y=.85,t.castShadow=!0,e.add(t),nn(t,.04);let n=Xe(i()<.5?ft.leafA:ft.leafB,{rim:16771512,rimStrength:.3});for(let s=0;s<3;s++){let r=1.05-s*.18,a=new re(Cr(new $n(r,1),.16,i),n);a.position.set((i()-.5)*.5,1.9+s*.62,(i()-.5)*.5),a.scale.y=.82,a.castShadow=!0,e.add(a),nn(a,.045)}return e}function A0(i){let e=new lt,t=new re(Cr(new Fn(1.6,2.6,7),.22,i),Xe(ft.cliffDark,{rimStrength:.2}));t.rotation.x=Math.PI,e.add(t);let n=new re(Cr(new Qt(1.55,1.35,.5,7),.1,i),Xe(ft.grassA,{rimStrength:.24}));n.position.y=1.2,e.add(n);let s=Mu(i);return s.scale.setScalar(.55),s.position.y=1.4,e.add(s),e}function Su(i,{reducedMotion:e=!1}={}){let t=(()=>{let B=20261101;return()=>(B=B*1664525+1013904223>>>0,B/4294967296)})(),n=new lt;i.add(n);let s={grass:[],water:[],clouds:[],islets:[],rays:[]},r=new re(new Gt(21+2.4,72),Xe(ft.grassA,{rimStrength:0}));r.rotation.x=-Math.PI/2,r.receiveShadow=!0,n.add(r);for(let B=0;B<7;B++){let O=new re(new Gt(2.2+t()*3.4,20),Xe(B%2?8571494:6993240,{rimStrength:0}));O.rotation.x=-Math.PI/2;let J=t()*Math.PI*2,ce=t()*18;O.position.set(Math.cos(J)*ce,.012+B*.001,Math.sin(J)*ce),n.add(O)}let a=new re(new bn(6.3,6.58,64),new at({color:15985362,transparent:!0,opacity:.32}));a.rotation.x=-Math.PI/2,a.position.y=.045,n.add(a);let o=Math.PI*.78,l=[0,1,2,3].map(()=>Cr(new $n(1,1),.12,t));for(let B=0;B<17;B++){let O=B/17*Math.PI*2;if(Math.abs((O-o+Math.PI*3)%(Math.PI*2)-Math.PI)<.4)continue;let ce=l[B%4],Ee=new re(ce,Xe(B%3?10268554:8689272,{rim:16769712,rimStrength:.22})),Ye=21+2.6+t()*2.2;Ee.position.set(Math.cos(O)*Ye,.4+t()*.6,Math.sin(O)*Ye),Ee.scale.set(2.4+t()*2,3+t()*3.2,2.4+t()*2),Ee.rotation.y=t()*Math.PI,Ee.castShadow=!0,n.add(Ee)}let c=new lt,h={uTime:{value:0}},d=new vt({uniforms:h,transparent:!0,depthWrite:!1,side:Rt,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform float uTime; varying vec2 vUv;
      void main() {
        float flow = fract(vUv.y * 2.4 - uTime * 1.5);
        float bands = smoothstep(0.25, 0.0, abs(flow - 0.5) - 0.18) * 0.55 + 0.35;
        float edge = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
        float alpha = edge * (0.55 + bands * 0.4);
        vec3 col = mix(vec3(0.62, 0.86, 0.92), vec3(1.0), bands * 0.7);
        gl_FragColor = vec4(col, alpha);
      }`}),u=new re(new an(3.6,6.4,1,1),d);u.position.set(Math.cos(o)*(21+3.4),3.2,Math.sin(o)*(21+3.4)),u.lookAt(0,3.2,0),c.add(u);let p=new re(new Gt(2.6,24),Xe(15924219,{rimStrength:0},{transparent:!0,opacity:.75}));p.rotation.x=-Math.PI/2,p.position.set(Math.cos(o)*(21+1.2),.03,Math.sin(o)*(21+1.2)),c.add(p),n.add(c),s.water.push({uniforms:h,rate:1});let g={uTime:{value:0}},S=new re(new Gt(2.9,36),new vt({uniforms:g,transparent:!0,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform float uTime; varying vec2 vUv;
      void main() {
        vec2 c = vUv - 0.5; float d = length(c) * 2.0;
        float bands = sin((c.x + c.y) * 22.0 - uTime * 2.1) * 0.5 + 0.5;
        vec3 col = mix(vec3(0.23, 0.66, 0.70), vec3(0.62, 0.92, 0.94), bands * 0.45);
        float foam = smoothstep(0.78, 0.9, d) * (0.5 + 0.5 * sin(uTime * 3.0 + d * 40.0));
        col = mix(col, vec3(0.95, 0.99, 1.0), foam * 0.8);
        float alpha = smoothstep(1.0, 0.86, d);
        gl_FragColor = vec4(col, alpha);
      }`}));S.rotation.x=-Math.PI/2;let m=o+Math.PI*.9;S.position.set(Math.cos(m)*(21-3.4),.02,Math.sin(m)*(21-3.4)),n.add(S),s.water.push({uniforms:g,rate:1});for(let B=0;B<11;B++){let O=t()*Math.PI*2,J=21+6.5+t()*7,ce=Mu(t);ce.position.set(Math.cos(O)*J,0,Math.sin(O)*J);let Ee=1+t()*.7;ce.scale.setScalar(Ee),ce.rotation.y=t()*Math.PI*2,n.add(ce)}for(let B=0;B<4;B++){let O=A0(t),J=o+(B+.7)*(Math.PI*2/4.6),ce=27+t()*5;O.position.set(Math.cos(J)*ce,6.5+t()*4.5,Math.sin(J)*ce),O.scale.setScalar(.9+t()*.7),O.userData.baseY=O.position.y,O.userData.phase=t()*10,n.add(O),s.islets.push(O)}let f=e?500:1500,M=T0(),A=new Ri({color:16777215,gradientMap:null,side:Rt});A.gradientMap=(()=>{let B=new Uint8Array([120,210]),O=new Zn(B,2,1,_i);return O.minFilter=O.magFilter=At,O.needsUpdate=!0,O})(),A.userData.uniforms={uTime:{value:0}},A.onBeforeCompile=B=>{B.uniforms.uTime=A.userData.uniforms.uTime,B.vertexShader=B.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`
        #include <begin_vertex>
        #ifdef USE_INSTANCING
          float phase = instanceMatrix[3][0] * 0.37 + instanceMatrix[3][2] * 0.43;
          float amp = smoothstep(0.0, 0.55, position.y);
          transformed.x += sin(uTime * 1.9 + phase) * 0.12 * amp;
          transformed.z += cos(uTime * 1.47 + phase * 1.31) * 0.09 * amp;
        #endif
      `)};let v=new Jn(M,A,f),b=new Pt,T=new Be(ft.grassA),C=new Be(ft.grassB),_=new Be;for(let B=0;B<f;B++){let O=t()*Math.PI*2,J=Math.sqrt(t())*(21-1.2);b.position.set(Math.cos(O)*J,0,Math.sin(O)*J),b.rotation.y=t()*Math.PI;let ce=.7+t()*.8;b.scale.set(ce,ce*(.8+t()*.7),ce),b.updateMatrix(),v.setMatrixAt(B,b.matrix),_.lerpColors(T,C,t()),v.setColorAt(B,_)}v.instanceMatrix.needsUpdate=!0,n.add(v),s.grass.push(A);let E=e?40:130,R=new Jn(w0(),Xe(16777215,{rimStrength:.2}),E),D=[16774131,16767458,16773304,15259135].map(B=>new Be(B));for(let B=0;B<E;B++){let O=t()*Math.PI*2,J=Math.sqrt(t())*19;b.position.set(Math.cos(O)*J,0,Math.sin(O)*J),b.rotation.set(0,t()*Math.PI,0),b.scale.setScalar(.8+t()*.7),b.updateMatrix(),R.setMatrixAt(B,b.matrix),R.setColorAt(B,D[B%D.length])}n.add(R);let U={uSunDir:{value:Ui.clone()}},H=new re(new ht(300,32,18),new vt({uniforms:U,side:Ft,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform vec3 uSunDir; varying vec3 vDir;
      void main() {
        float h = clamp(vDir.y, -0.1, 1.0);
        vec3 zenith = vec3(0.16, 0.40, 0.66);
        vec3 mid = vec3(0.50, 0.72, 0.85);
        vec3 horizon = vec3(0.93, 0.76, 0.55);
        vec3 col = mix(horizon, mid, smoothstep(0.0, 0.22, h));
        col = mix(col, zenith, smoothstep(0.2, 0.75, h));
        float sunAmt = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 5.0);
        col += vec3(1.0, 0.72, 0.38) * sunAmt * 0.28;
        gl_FragColor = vec4(col, 1.0);
      }`}));n.add(H);let I=new Nn(new Sn({map:Cs("rgba(255,244,214,0.95)","rgba(255,214,140,0)",128),blending:jt,depthWrite:!1,fog:!1,opacity:.55}));I.position.copy(Ui).multiplyScalar(240),I.scale.setScalar(52),n.add(I);let k=yu();for(let B=0;B<12;B++){let O=new Nn(new Sn({map:k,transparent:!0,opacity:.5+t()*.35,depthWrite:!1,fog:!1})),J=t()*Math.PI*2,ce=70+t()*120;O.position.set(Math.cos(J)*ce,34+t()*40,Math.sin(J)*ce),O.scale.set(30+t()*34,12+t()*12,1),O.userData.speed=.6+t()*1.2,n.add(O),s.clouds.push(O)}if(!e)for(let B=0;B<3;B++){let O=new re(new an(46,9),new at({color:16774096,transparent:!0,opacity:.055,blending:jt,depthWrite:!1,side:Rt,fog:!1}));O.position.copy(Ui).multiplyScalar(26).add(new L((B-1)*10,0,(B-1)*6)),O.lookAt(O.position.clone().add(new L(-Ui.x,.4,-Ui.z))),O.userData.phase=B*2.1,n.add(O),s.rays.push(O)}let W=new rr(ft.sun,2.1);W.position.copy(Ui).multiplyScalar(60),W.castShadow=!0,W.shadow.mapSize.set(2048,2048),W.shadow.camera.left=-28,W.shadow.camera.right=28,W.shadow.camera.top=28,W.shadow.camera.bottom=-28,W.shadow.camera.near=20,W.shadow.camera.far=120,W.shadow.bias=-4e-4,W.shadow.normalBias=.03,i.add(W),i.add(new ir(13625855,7575386,1.1)),i.fog=new qs(16768174,95,260);let Y=0;function ie(B){Y+=B;for(let O of s.grass)O.userData.uniforms.uTime.value=Y;for(let O of s.water)O.uniforms.uTime.value=Y*O.rate;for(let O of s.clouds)O.position.x+=O.userData.speed*B,O.position.x>200&&(O.position.x=-200);for(let O of s.islets)e||(O.position.y=O.userData.baseY+Math.sin(Y*.6+O.userData.phase)*.4);for(let O of s.rays)O.material.opacity=.045+Math.sin(Y*.7+O.userData.phase)*.02}return{group:n,update:ie,sunDir:Ui}}var R0=(i,e,t,n)=>i+(e-i)*(1-Math.exp(-t*n)),C0=i=>1-Math.pow(1-i,3),P0=i=>i*i*i,mc=i=>Math.max(0,Math.min(1,i));function Pr(i,e,t){let n=new re(new ds(i,e,4,10),t);return n.castShadow=!0,n}function I0(){let i=new lt,e=Xe(ft.steel,{rim:12577524,rimStrength:.5,emissive:2775654,emissiveIntensity:.35}),t=new re(new Ut(.055,.78,.015),e);t.position.y=.52,t.castShadow=!0,i.add(t);let n=new re(new Fn(.038,.14,4),e);n.position.y=.97,n.rotation.y=Math.PI/4,i.add(n);let s=new re(new Ut(.17,.035,.05),Xe(ft.bossRing,{rimStrength:.3}));s.position.y=.12,i.add(s);let r=new re(new Qt(.022,.026,.16,8),Xe(3492175,{rimStrength:.2}));r.position.y=.02,i.add(r);let a=new re(new ht(.03,8,6),Xe(ft.scarf,{rimStrength:.4}));return a.position.set(0,-.07,0),i.add(a),nn(t,.012),i}function bu(i){let e=new lt;i.add(e);let t=Xe(ft.jacket,{rim:16771512,rimStrength:.32}),n=Xe(ft.jacketLight,{rim:16771512,rimStrength:.3}),s=Xe(ft.skin,{rim:16769216,rimStrength:.18}),r=Xe(ft.hair,{rim:10475752,rimStrength:.4}),a=Xe(2372666,{rimStrength:.15}),o={hipsY:0,leanX:0,twistY:0,headX:0,headY:0,shRx:.22,shRy:0,shRz:-.12,elR:.4,shLx:.2,shLy:0,shLz:.12,elL:.35,hipR:0,hipL:0,kneeR:.05,kneeL:.05,swordX:.5,swordZ:-.3},l=new lt;e.add(l);let c=new lt;c.position.y=.92,l.add(c);let h=Pr(.21,.34,t);h.position.y=.3,h.scale.set(1,1,.82),c.add(h),nn(h,.03);let d=new re(new ht(.215,12,10),n);d.position.set(0,.4,.06),d.scale.set(.92,.8,.72),c.add(d);let u=new re(new En(.215,.035,6,16),Xe(2834245,{rimStrength:.2}));u.position.y=.08,u.rotation.x=Math.PI/2,u.scale.set(1,1,.82),c.add(u);let p=new re(new Ut(.07,.3,.02),Xe(ft.scarf,{rimStrength:.3}));p.position.set(-.12,.28,.15),p.rotation.z=.35,c.add(p);let g=new lt;g.position.y=.62,c.add(g);let S=new re(new ht(.28,16,14),s);S.position.y=.24,S.scale.set(1,1.04,.96),S.castShadow=!0,g.add(S),nn(S,.028);let m=new re(new ht(.3,14,12),r);m.position.set(0,.27,-.05),m.scale.set(1.02,1.02,1),g.add(m);let f=new re(new ht(.29,12,10,0,Math.PI*2,0,Math.PI*.42),r);f.position.set(0,.26,.015),f.rotation.x=.22,g.add(f);let M=new re(new ds(.07,.3,4,8),r);M.position.set(0,.1,-.3),M.rotation.x=.5,g.add(M);for(let Te of[-1,1]){let Z=new re(new Gt(.035,10),new at({color:2241080}));Z.position.set(Te*.1,.22,.262),g.add(Z);let ne=new re(new Gt(.011,6),new at({color:16777215}));ne.position.set(Te*.1+Te*.012,.232,.268),g.add(ne)}function A(Te){let Z=new lt;Z.position.set(Te*.27,.5,0),c.add(Z);let ne=Pr(.07,.2,t);ne.position.y=-.16,Z.add(ne);let oe=new lt;oe.position.y=-.33,Z.add(oe);let ae=Pr(.06,.18,s);ae.position.y=-.14,oe.add(ae);let Fe=new re(new Qt(.075,.07,.09,10),n);Fe.position.y=-.05,oe.add(Fe);let Je=new re(new ht(.065,8,7),s);return Je.position.y=-.3,oe.add(Je),{sh:Z,elbow:oe}}let v=A(1),b=A(-1),T=I0();T.position.set(0,-.34,.02),v.elbow.add(T);function C(Te){let Z=new lt;Z.position.set(Te*.12,-.04,0),c.add(Z);let ne=Pr(.085,.24,a);ne.position.y=-.2,Z.add(ne);let oe=new lt;oe.position.y=-.42,Z.add(oe);let ae=Pr(.07,.22,a);ae.position.y=-.18,oe.add(ae);let Fe=new re(new Ut(.14,.1,.24),Xe(8872254,{rimStrength:.2}));return Fe.position.set(0,-.36,.05),oe.add(Fe),{hip:Z,knee:oe}}let _=C(1),E=C(-1),R=8,D=.15,U=[],H=[];for(let Te=0;Te<R;Te++)U.push(new L(0,1.5,-Te*D)),H.push(U[Te].clone());let I=new Tt,k=new Float32Array(R*2*3),W=new Float32Array(R*2*3),Y=[];for(let Te=0;Te<R-1;Te++){let Z=Te*2,ne=Te*2+1,oe=Te*2+2,ae=Te*2+3;Y.push(Z,ne,oe,ne,ae,oe)}I.setIndex(Y),I.setAttribute("position",new Nt(k,3)),I.setAttribute("color",new Nt(W,3));let ie=new re(I,new at({vertexColors:!0,side:Rt}));ie.frustumCulled=!1,i.add(ie);let B=new L,O=new L,J=new L,ce=new L(0,1,0);function Ee(Te,Z,ne,oe,ae){g.updateWorldMatrix(!0,!1),B.set(oe.x,oe.y,oe.z).applyMatrix4(g.matrixWorld),U[0].copy(B),H[0].copy(B);let Fe=Math.sin(Z*2.1)*.3+.22,Je=Math.cos(Z*1.6)*.25+.38,fe=Math.hypot(ne.x,ne.z);for(let ue=1;ue<R;ue++){let P=U[ue],et=H[ue],Ze=(P.x-et.x)*.94,w=(P.y-et.y)*.94,x=(P.z-et.z)*.94;et.copy(P),P.x+=Ze,P.y+=w,P.z+=x,P.y-=2.6*Te*Te*60*(1/60);let z=ue/R*(.9+fe*.35);P.x+=(Fe*1.4-ne.x*.32)*z*Te,P.z+=(Je*1.4-ne.z*.32)*z*Te,P.y+=Math.sin(Z*3.1+ue)*.006}for(let ue=0;ue<3;ue++)for(let P=1;P<R;P++){let et=U[P-1],Ze=U[P];O.subVectors(Ze,et);let w=O.length()||1e-4;O.multiplyScalar((w-D)/w),P===1||et.add(O.multiplyScalar(.5)),Ze.sub(O)}let mt=new L;for(let ue=0;ue<R;ue++){let P=U[ue],et=U[Math.min(ue+1,R-1)],Ze=U[Math.max(ue-1,0)];O.subVectors(et,Ze).normalize(),J.crossVectors(O,ce).normalize();let w=.13*(1-ue/R*.72),x=1-ue/R*.42;k[ue*6+0]=P.x-J.x*w,k[ue*6+1]=P.y,k[ue*6+2]=P.z-J.z*w,k[ue*6+3]=P.x+J.x*w,k[ue*6+4]=P.y,k[ue*6+5]=P.z+J.z*w,W[ue*6+0]=1*x,W[ue*6+1]=.353*x,W[ue*6+2]=.235*x,W[ue*6+3]=W[ue*6+0]*.82,W[ue*6+4]=W[ue*6+1]*.82,W[ue*6+5]=W[ue*6+2]*.82}I.attributes.position.needsUpdate=!0,I.attributes.color.needsUpdate=!0}function Ye(){return{hipsY:0,leanX:0,twistY:0,headX:0,headY:0,shRx:.22,shRy:0,shRz:-.12,elR:.4,shLx:.2,shLy:0,shLz:.12,elL:.35,hipR:0,hipL:0,kneeR:.06,kneeL:.06,swordX:.5,swordZ:-.3}}function je(Te,Z){let ne=Ye(),oe=.34,ae=.62,Fe;return Z<oe?(Fe=P0(Z/oe),j(Ye(),st(Te),Fe)):Z<ae?(Fe=C0((Z-oe)/(ae-oe)),j(st(Te),$(Te),Fe)):(Fe=he((Z-ae)/(1-ae)),j($(Te),Ye(),Fe))}function st(Te){let Z=Ye();return Te===1?(Z.shRy=1.15,Z.shRx=.35,Z.elR=1.5,Z.twistY=.4,Z.headY=-.15,Z.shLz=.5,Z.swordX=.1,Z.swordZ=.2):Te===2?(Z.shRy=-1.6,Z.shRx=.3,Z.elR=1.6,Z.twistY=-.45,Z.headY=.18,Z.shLz=-.4,Z.swordX=.1,Z.swordZ=.2):(Z.shRx=-2.5,Z.shRy=.25,Z.elR=.7,Z.leanX=-.18,Z.twistY=.25,Z.hipsY=.04,Z.shLx=-1.2,Z.shLz=.55,Z.swordX=.35,Z.swordZ=0),Z}function $(Te){let Z=Ye();return Te===1?(Z.shRy=-1.45,Z.shRx=.5,Z.elR=.25,Z.twistY=-.42,Z.leanX=.12,Z.headY=.14,Z.shLz=-.55,Z.swordX=1.35,Z.swordZ=-.5):Te===2?(Z.shRy=1.3,Z.shRx=.45,Z.elR=.3,Z.twistY=.4,Z.leanX=.12,Z.headY=-.12,Z.shLz=.5,Z.swordX=1.35,Z.swordZ=-.5):(Z.shRx=1.05,Z.shRy=-.1,Z.elR=.15,Z.leanX=.34,Z.twistY=-.2,Z.hipsY=-.06,Z.shLx=.7,Z.shLz=.4,Z.kneeR=.35,Z.kneeL=.35,Z.swordX=.9,Z.swordZ=-.15),Z}function j(Te,Z,ne){let oe={};for(let ae in Te)oe[ae]=Te[ae]+(Z[ae]-Te[ae])*ne;return oe}function he(Te){return Te=mc(Te),Te*Te*(3-2*Te)}let ke=!1,ye=1;function Oe(Te,Z,ne,oe){let ae=Te.player;e.position.set(ae.x,0,ae.z);let Je=(ae.face-e.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;e.rotation.y+=Je*(1-Math.exp(-16*Z));let fe=Ye(),mt=ae.moving>.05&&ae.dashT<=0;if(ae.dashT>0)fe.leanX=.42,fe.headX=-.15,fe.shRx=.95,fe.shLx=.85,fe.shRz=-.5,fe.shLz=.5,fe.hipR=-.7,fe.hipL=.5,fe.kneeR=.8,fe.kneeL=.4,fe.swordX=1.8,fe.swordZ=-.8,l.scale.set(1,1.05,1);else if(l.scale.set(1,1,1),ae.comboStage>0){let ue=[.3,.34,.5][ae.comboStage-1]/ae.stats.atkSpeed;Object.assign(fe,je(ae.comboStage,mc(ae.comboT/ue)))}else if(ae.heavyT>=0){let ue=mc(ae.heavyT/.55);fe.shRx=-2.4,fe.shRy=.1,fe.elR=.6,fe.shLx=-2,fe.shLz=.5,fe.leanX=-.12-ue*.08,fe.hipsY=.03,fe.headX=-.25,fe.swordX=.3,fe.swordZ=0,l.scale.setScalar(1+Math.sin(ne*20)*.012*ue)}else if(ye<.28){ye+=Z;let ue=ye/.28;fe.shRx=-2.4+he(ue)*3.3,fe.elR=.2,fe.leanX=-.12+he(ue)*.45,fe.swordX=.3+he(ue)*.6}else if(ae.hurtT>0){let ue=ae.hurtT/.35;fe.leanX=-.3*ue,fe.headX=-.3*ue,fe.shRx=-.8*ue,fe.shLx=-.7*ue}else if(mt){let ue=Math.sin(ae.runT*8.5),P=Math.sin(ae.runT*8.5+Math.PI),et=.15+ae.moving*.62;fe.hipR=ue*et,fe.hipL=P*et,fe.kneeR=Math.max(.06,-P*et*1.1+.15),fe.kneeL=Math.max(.06,-ue*et*1.1+.15),fe.shRx=P*et*.55+.1,fe.shLx=ue*et*.55+.1,fe.shRz=-.2,fe.shLz=.2,fe.leanX=.14*ae.moving,fe.hipsY=Math.abs(Math.sin(ae.runT*8.5))*.045*ae.moving,fe.swordX=.9,fe.swordZ=-.55,fe.headX=-.06}else fe.hipsY=Math.sin(ne*2.1)*.014,fe.shRx=.22+Math.sin(ne*2.1)*.02,fe.shLx=.2+Math.sin(ne*2.1+1)*.02,fe.headY=Math.sin(ne*.7)*.08,fe.swordX=.5+Math.sin(ne*1.3)*.04;ke&&ae.heavyT<0&&(ye=0),ke=ae.heavyT>=0;for(let ue in o)o[ue]=R0(o[ue],fe[ue],ue==="hipsY"?18:14,Z);c.position.y=.92+o.hipsY,l.rotation.x=o.leanX,l.rotation.y=o.twistY,g.rotation.x=o.headX,g.rotation.y=o.headY,v.sh.rotation.set(o.shRx,o.shRy,o.shRz),v.elbow.rotation.x=-o.elR,b.sh.rotation.set(o.shLx,0,o.shLz),b.elbow.rotation.x=-o.elL,_.hip.rotation.x=o.hipR,_.knee.rotation.x=o.kneeR,E.hip.rotation.x=o.hipL,E.knee.rotation.x=o.kneeL,T.rotation.x=o.swordX,T.rotation.z=o.swordZ,Ee(Z,ne,{x:ae.vx,z:ae.vz},{x:0,y:.55,z:-.2},oe)}return{root:e,update:Oe}}var Eu=(i,e,t,n)=>i+(e-i)*(1-Math.exp(-t*n));function Ir(i){let e=[];return i.traverse(t=>{t.isMesh&&t.material&&t.material.isMeshToonMaterial&&e.push(t.material)}),e}function L0(){let i=new lt,e=Xe(ft.rusher,{rim:16767400,rimStrength:.35}),t=new re(new ht(.52,14,12),e);t.position.y=.5,t.scale.set(1,.86,1),t.castShadow=!0,i.add(t),nn(t,.04);let n=new re(new ht(.4,12,10),Xe(14264426,{rimStrength:.2}));n.position.set(0,.44,.24),n.scale.set(.8,.7,.55),i.add(n);for(let a of[-1,1]){let o=new re(new Fn(.09,.3,6),Xe(15787730,{rimStrength:.3}));o.position.set(a*.22,.92,0),o.rotation.z=-a*.5,i.add(o);let l=new re(new ht(.14,8,6),e);l.position.set(a*.24,.1,.08),i.add(l);let c=new re(new Gt(.055,8),new at({color:2759184}));c.position.set(a*.16,.6,.46),i.add(c)}let s=new re(new Ut(.14,.03,.02),new at({color:2759184}));s.position.set(-.16,.7,.45),s.rotation.z=-.5,i.add(s);let r=s.clone();return r.position.x=.16,r.rotation.z=.5,i.add(r),{group:i,body:t,mats:Ir(i)}}function D0(){let i=new lt,e=Xe(ft.thrower,{rim:16774084,rimStrength:.3}),t=new re(new ht(.5,14,12),e);t.position.y=.62,t.scale.set(.8,1.15,.8),t.castShadow=!0,i.add(t),nn(t,.04);let n=new re(new ht(.2,10,8),Xe(8030788,{rimStrength:.3}));n.position.set(.3,.7,.3),i.add(n);let s=new re(new ht(.1,10,8),new at({color:16643808}));s.position.set(0,.86,.36),i.add(s);let r=new re(new ht(.045,8,6),new at({color:2240570}));r.position.set(0,.86,.44),i.add(r);let a=new re(new Qt(.03,.05,.34,6),Xe(6056756,{rimStrength:.2}));a.position.y=1.4,i.add(a);let o=new re(new ht(.12,8,6),Xe(7175486,{rimStrength:.25}));return o.position.set(.12,1.56,0),o.scale.set(1.4,.4,.7),o.rotation.z=-.5,i.add(o),{group:i,body:t,pouch:n,mats:Ir(i)}}function U0(){let i=new lt,e=Xe(ft.charger,{rim:16767400,rimStrength:.32}),t=new re(new ht(.62,14,12),e);t.position.y=.58,t.scale.set(.95,.8,1.25),t.castShadow=!0,i.add(t),nn(t,.045);let n=new re(new ht(.5,12,10),Xe(8013104,{rimStrength:.3}));n.position.set(0,.78,-.3),n.scale.set(1,.6,.9),i.add(n);for(let o of[-1,1]){let l=new re(new Fn(.12,.5,6),Xe(15721676,{rimStrength:.35}));l.position.set(o*.26,.62,.68),l.rotation.x=Math.PI/2.3,i.add(l);let c=new re(new Qt(.09,.11,.36,8),e);c.position.set(o*.3,.18,.3),i.add(c);let h=c.clone();h.position.z=-.3,i.add(h)}let s=new re(new Gt(.05,8),new at({color:2757640}));s.position.set(-.2,.72,.56),i.add(s);let r=s.clone();r.position.x=.2,i.add(r);let a=new re(new ht(.2,10,8),Xe(12615768,{rimStrength:.2}));return a.position.set(0,.5,.7),a.scale.set(1,.7,.8),i.add(a),{group:i,body:t,mats:Ir(i)}}function N0(){let i=new lt,e=Xe(ft.brute,{rim:14215388,rimStrength:.28}),t=new re(new Ut(1.1,1,.8),e);t.position.y=.78,t.castShadow=!0,i.add(t),nn(t,.05);let n=new re(new Ut(.5,.4,.45),Xe(5859423,{rimStrength:.3}));n.position.set(0,1.5,.05),i.add(n),nn(n,.04);let s=new re(new Ut(.58,.16,.52),Xe(4411979,{rimStrength:.3}));s.position.set(0,1.72,.02),i.add(s);let r=new re(new Ut(.4,.06,.03),new at({color:10479824}));r.position.set(0,1.5,.27),i.add(r);let a=new re(new Ut(1.3,1.5,.14),Xe(4872784,{rim:16769712,rimStrength:.4}));a.position.set(0,.8,.55),a.castShadow=!0,i.add(a);let o=new re(new En(.22,.045,6,18),Xe(ft.bossRing,{rimStrength:.3}));o.position.set(0,.85,.65),i.add(o);for(let l of[-1,1]){let c=new re(new Ut(.24,.7,.24),e);c.position.set(l*.75,.85,.15),i.add(c);let h=new re(new Ut(.3,.3,.3),Xe(5398359,{rimStrength:.2}));h.position.set(l*.28,.15,0),i.add(h)}return{group:i,body:t,head:n,shield:a,mats:Ir(i)}}function F0(){let i=new lt,e=Xe(ft.bossCore,{rim:8382680,rimStrength:.5,emissive:866878,emissiveIntensity:1}),t=new re(new $n(1.25,1),e);t.position.y=2.1,t.castShadow=!0,i.add(t),nn(t,.06);let n=new re(new $n(.7,1),new at({color:6285519,transparent:!0,opacity:.85}));n.position.y=2.1,i.add(n);let s=new re(new ht(.22,12,10),new at({color:16771496}));s.position.set(0,2.25,1.05),i.add(s);let r=new re(new ht(.09,8,6),new at({color:4856336}));r.position.set(0,2.25,1.2),i.add(r);let a=Xe(ft.bossRing,{rim:16773312,rimStrength:.4}),o=new re(new En(2,.09,8,40),a);o.position.y=2.1,o.rotation.x=Math.PI/2.4,i.add(o);let l=new re(new En(2.5,.07,8,44),a);l.position.y=2.1,l.rotation.x=Math.PI/1.7,l.rotation.y=.5,i.add(l);let c=[];for(let d=0;d<6;d++){let u=new re(new er(.22),Xe(3832440,{rim:10479832,rimStrength:.5}));i.add(u),c.push(u)}let h=new re(new Gt(2.1,24),Xe(3828322,{rimStrength:0}));return h.rotation.x=-Math.PI/2,h.position.y=.02,h.material.transparent=!0,h.material.opacity=.5,i.add(h),{group:i,core:t,inner:n,eye:s,ring1:o,ring2:l,shards:c,mats:Ir(i),coreMat:e}}var B0={rusher:L0,thrower:D0,charger:U0,brute:N0,boss:F0},Wo=class{constructor(e){this.scene=e,this.map=new Map}sync(e,t,n,s){for(let[r,a]of this.map)e.enemies.find(o=>o.id===r)||(this.scene.remove(a.built.group),a.built.group.traverse(o=>{o.geometry&&!o.geometry.__shared&&o.geometry.dispose?.()}),this.map.delete(r));for(let r of e.enemies){let a=this.map.get(r.id);if(!a){let o=B0[r.type]();this.scene.add(o.group),a={built:o,spawnT:0},this.map.set(r.id,a)}a.spawnT=Math.min(1,a.spawnT+t*2.2),this.updateRig(a,r,t,n,s)}}updateRig(e,t,n,s,r){let{group:a,body:o,mats:l}=e.built,c=t.type==="boss"?null:t.type,d=(e.spawnT<1?Math.sin(e.spawnT*Math.PI/2):1)*(e.spawnT<1?.6+e.spawnT*.4:1);a.position.set(t.x,0,t.z);let u=t.flash>0?t.flash/.18:0;for(let v of l)v.emissiveIntensity=u>0?1:v.userData.baseEI??1,v.emissive.setRGB(u,u,u);let p=0,g=1,S=1,m=1,f=0,M=0,A=t.animT;if(t.type==="rusher")if(p=Math.abs(Math.sin(A*7))*.16,S=1-Math.abs(Math.sin(A*7+.5))*.06,t.phase==="windup"){let v=1-t.t/.45;g=S=1+v*.22,f=-.15*v}else t.phase==="lunge"?(m=1.35,S=.8,f=.35,p=.1):t.phase==="recover"&&(M=Math.sin(A*14)*.08);else if(t.type==="thrower"){if(p=Math.abs(Math.sin(A*3.2))*.08,M=Math.sin(A*2.4)*.06,e.built.pouch){let v=t.cd<.6?1-t.cd/.6:0;e.built.pouch.scale.setScalar(1+v*1.4),e.built.pouch.position.y=.7+v*.15}}else if(t.type==="charger")if(t.phase==="aim"){let v=1-t.t/.8;f=-.22*v,p=-.05*v,r||(a.position.x+=Math.sin(s*40)*.02*v)}else t.phase==="charge"?(f=.28,m=1.25,p=.05):t.phase==="dizzy"?(M=Math.sin(s*6)*.16,p=-.08):p=Math.abs(Math.sin(A*5))*.06;else if(t.type==="brute")if(t.phase==="slam"){let v=1-t.t/.9;v<.5?(f=-.18*(v*2),p=-.12*(v*2)):(f=.25*((v-.5)*2),p=.05,S=1.06)}else t.phase==="recover"?(f=.2,p=-.08):f=Math.sin(A*2.2)*.04;else if(t.type==="boss"){let v=e.built,b=Math.sin(s*1.4)*.16+.25;v.core.position.y=v.inner.position.y=v.eye.position.y=2.1+b,v.pupil&&v.eye.children.length,v.ring1.position.y=v.ring2.position.y=2.1+b;let T=s*(.6+t.bossPhase*.5);v.ring1.rotation.z=T,v.ring2.rotation.z=-T*.8;for(let E=0;E<v.shards.length;E++){let R=T*1.4+E/6*Math.PI*2,D=2.6;v.shards[E].position.set(Math.cos(R)*D,2.1+b+Math.sin(s*2+E)*.3,Math.sin(R)*D),v.shards[E].rotation.set(s+E,s*.7+E,0)}let C=t.bossPhase===3?[1,.3,.25]:t.bossPhase===2?[1,.72,.3]:[.35,.9,.8];v.inner.material.color.setRGB(...C),t.phase==="stun"?(M=Math.sin(s*9)*.1,v.ring1.rotation.x=Math.PI/2+.5,v.ring2.rotation.x=Math.PI/1.7+.4,v.eye.material.color.setRGB(.6,.6,.6)):(v.ring1.rotation.x=Eu(v.ring1.rotation.x,Math.PI/2.4,4,n),v.ring2.rotation.x=Eu(v.ring2.rotation.x,Math.PI/1.7,4,n),v.eye.material.color.setRGB(1,.91,.66)),v.core.rotation.y=s*.5,v.core.rotation.x=Math.sin(s*.7)*.2;let _=1+Math.sin(s*3.4)*.03;v.inner.scale.setScalar(_),a.position.y=0}a.scale.set(d*g,d*S,d*m),t.type!=="boss"&&(a.rotation.x=f,a.rotation.z=M,a.position.y=p,a.rotation.y=t.face)}};var Ni=Math.PI*2,Lr=class{constructor(e,t){this.items=[];for(let n=0;n<e;n++){let s=t();s.userData.active=!1,this.items.push(s)}}get(){return this.items.find(e=>!e.userData.active)||null}},Xo=class{constructor(e,t,n,{reducedMotion:s=!1}={}){this.scene=e,this.camera=t,this.damageLayer=n,this.reduced=s,this.time=0,this.shake=0,this.hitstop=0,this.tmpV=new L,this.arcs=new Lr(8,()=>{let l=new at({color:1928024,transparent:!0,opacity:0,depthWrite:!1,side:Rt}),c=new re(new bn(.5,2.2,26,1,0,2.2),l);return c.visible=!1,e.add(c),c}),this.rings=new Lr(10,()=>{let l=new at({color:16777215,transparent:!0,opacity:0,blending:jt,depthWrite:!1,side:Rt}),c=new re(new bn(.82,1,40),l);return c.rotation.x=-Math.PI/2,c.visible=!1,e.add(c),c});let r=new ht(.05,6,4),a=new at({color:16771496,blending:jt,transparent:!0,depthWrite:!1});this.sparks=new Jn(r,a,90),this.sparks.frustumCulled=!1,this.sparkData=new Array(90).fill(null).map(()=>({x:0,y:-99,z:0,vx:0,vy:0,vz:0,life:0,max:1})),e.add(this.sparks),this.sparkCursor=0;let o=Cs("rgba(235,245,225,0.85)","rgba(235,245,225,0)",64);if(this.dusts=new Lr(20,()=>{let l=new Nn(new Sn({map:o,transparent:!0,opacity:0,depthWrite:!1}));return l.visible=!1,e.add(l),l}),this.petalMax=s?0:90,this.petalMax>0){let l=new an(.13,.1),c=new at({color:ft.petal,side:Rt,transparent:!0,opacity:.9,depthWrite:!1});this.petals=new Jn(l,c,this.petalMax),this.petals.frustumCulled=!1,e.add(this.petals),this.petalData=new Array(this.petalMax).fill(null).map((h,d)=>this.spawnAmbientPetal({},!0,d)),this.dummy=new Pt}this.decals=new Map,this.blades=new Map,this.bullets=new Map,this.bladeProto=this.makeBladeMesh(),this.bulletProto=this.makeBulletMesh(),this.dmgPool=[];for(let l=0;l<22;l++){let c=document.createElement("span");c.className="dmg-num",c.style.display="none",n.appendChild(c),this.dmgPool.push({el:c,life:0,x:0,y:0,vy:0,world:new L})}this.flashSprite=new Nn(new Sn({map:Cs("rgba(255,255,240,1)","rgba(255,255,240,0)",64),transparent:!0,opacity:0,blending:jt,depthWrite:!1})),this.flashSprite.scale.setScalar(3.2),e.add(this.flashSprite),this.flashT=1}makeBladeMesh(){let e=new lt,t=new at({color:10481888,transparent:!0,opacity:.95,blending:jt,depthWrite:!1}),n=new re(new En(.34,.075,6,14,Math.PI*1.25),t);e.add(n);let s=new re(new ht(.1,8,6),t);return e.add(s),e}makeBulletMesh(){let e=new lt,t=new re(new ht(.26,8,6),new at({color:16742997}));e.add(t);let n=new Nn(new Sn({map:Cs("rgba(255,150,90,0.9)","rgba(255,150,90,0)",64),transparent:!0,opacity:.85,blending:jt,depthWrite:!1}));return n.scale.setScalar(1.15),e.add(n),e}drain(e){for(let t of e)switch(t.type){case"slash":this.spawnArc(t);break;case"heavy":this.spawnRing(t.x,t.z,4.6,16773312,.32),this.addShake(.32),this.flash(t.x,t.z,.5);break;case"burst":this.spawnRing(t.x,t.z,7,12255204,.5),this.addShake(.5),this.flash(t.x,t.z,1),this.petalBurst(t.x,t.z,26);break;case"hit":this.spawnSparks(t.x,1,t.z,t.boss?8:5,t.blocked?13623514:16771496),t.blocked||this.addShake(t.boss?.12:.07),this.spawnDmg(t.dmg,t.x,1.5,t.z,t.blocked?"blocked":t.dmg>=22?"crit":""),this.hitstop=Math.max(this.hitstop,t.blocked?.02:.045);break;case"kill":this.spawnRing(t.x,t.z,t.type==="boss"?9:2.4,t.type==="boss"?16765056:13828072,t.type==="boss"?.6:.35),this.spawnSparks(t.x,1,t.z,t.type==="boss"?30:9,11465432),this.spawnDust(t.x,t.z,3),this.addShake(t.type==="boss"?.6:.14),this.hitstop=Math.max(this.hitstop,t.type==="boss"?.16:.07);break;case"playerHurt":this.addShake(.38),this.spawnDmg(" hurt",t.x,2,t.z,"player");break;case"dash":this.reduced||this.spawnDust(t.x,t.z,5);break;case"blade":break;case"bossPhase":this.spawnRing(t.x,t.z,10,16756880,.7),this.addShake(.5),this.flash(t.x,t.z,1);break;case"bossStun":this.spawnRing(t.x,t.z,6,16771496,.5),this.addShake(.3);break;case"bossRing":this.spawnRing(t.x,t.z,5,16751216,.45);break;case"spawnPoof":this.spawnRing(t.x,t.z,2,12447968,.4),this.spawnDust(t.x,t.z,3);break;case"lobDone":this.spawnRing(t.x,t.z,2.6,16756880,.4),this.spawnSparks(t.x,.6,t.z,6,16756880);break;case"telegraphDone":this.flash(t.x,t.z,.8);break}}spawnArc(e){let t=this.arcs.get();if(!t)return;let n=e.stage===3;t.userData.active=!0,t.visible=!0,t.userData.t=0,t.userData.dur=.2,t.userData.scale=n?1.5:1,t.position.set(e.x,.08,e.z),t.rotation.order="YXZ",t.rotation.set(-Math.PI/2,e.face,0),t.material.color.setHex(n?10115880:1928024),t.material.opacity=.85,t.geometry=n?this.arcGeoBig??(this.arcGeoBig=new bn(.55,2.6,26,1,-Math.PI/2-1.15,2.3)):this.arcGeo??(this.arcGeo=new bn(.5,2.2,26,1,-Math.PI/2-1,2))}spawnRing(e,t,n,s,r){let a=this.rings.get();a&&(a.userData.active=!0,a.visible=!0,a.userData.t=0,a.userData.dur=r,a.userData.radius=n,a.position.set(e,.06,t),a.material.color.setHex(s),a.material.opacity=.9,a.scale.setScalar(.3))}spawnSparks(e,t,n,s,r){this.reduced&&(s=Math.ceil(s/2));for(let a=0;a<s;a++){let o=this.sparkData[this.sparkCursor];this.sparkCursor=(this.sparkCursor+1)%this.sparkData.length;let l=Math.random()*Ni,c=1.5+Math.random()*3,h=2.5+Math.random()*3.5;o.x=e,o.y=t,o.z=n,o.vx=Math.cos(l)*h,o.vy=c,o.vz=Math.sin(l)*h,o.max=o.life=.3+Math.random()*.25}this.sparks.material.color.setHex(r)}spawnDust(e,t,n){for(let s=0;s<n;s++){let r=this.dusts.get();if(!r)break;r.userData.active=!0,r.visible=!0,r.userData.t=0,r.userData.dur=.5+Math.random()*.3,r.userData.rise=.8+Math.random()*.8;let a=Math.random()*Ni;r.position.set(e+Math.cos(a)*.4,.25,t+Math.sin(a)*.4),r.scale.setScalar(.4+Math.random()*.4),r.material.opacity=.5}}flash(e,t,n){this.flashT=0,this.flashSprite.position.set(e,1.4,t),this.flashSprite.material.opacity=.5*n}spawnAmbientPetal(e,t,n){let s=Math.random()*Ni,r=Math.sqrt(Math.random())*20;return e.x=Math.cos(s)*r,e.z=Math.sin(s)*r,e.y=t?Math.random()*9:8.5+Math.random()*2,e.vx=(Math.random()-.5)*.4,e.vy=-(.55+Math.random()*.5),e.vz=(Math.random()-.5)*.4,e.rx=Math.random()*Ni,e.ry=Math.random()*Ni,e.phase=Math.random()*Ni,e.ambient=!0,e.life=1,e}petalBurst(e,t,n){if(this.reduced||!this.petalData)return;let s=0;for(let r of this.petalData){if(s>=n)break;if(!r.ambient)continue;r.ambient=!1;let a=Math.random()*Ni,o=2+Math.random()*3;r.x=e,r.y=1+Math.random(),r.z=t,r.vx=Math.cos(a)*o,r.vy=2+Math.random()*2.5,r.vz=Math.sin(a)*o,r.life=1.4,s++}}spawnDmg(e,t,n,s,r=""){let a=this.dmgPool.find(o=>o.life<=0)||this.dmgPool[0];a.life=.8,a.world.set(t,n,s),a.vy=0,a.el.textContent=typeof e=="number"?r==="crit"?`${e}!`:`${e}`:e,a.el.className=`dmg-num ${r}`,a.el.style.display="block"}addShake(e){this.reduced||(this.shake=Math.min(.9,this.shake+e))}requestHitstop(){return this.hitstop}getShakeOffset(e){if(this.shake<=.001)return e.set(0,0,0);let t=this.shake*.16;return e.set((Math.random()-.5)*t,(Math.random()-.5)*t,(Math.random()-.5)*t)}update(e,t){this.time+=e,this.shake=Math.max(0,this.shake-e*2.2),this.hitstop=Math.max(0,this.hitstop-e);for(let o of this.arcs.items){if(!o.userData.active)continue;o.userData.t+=e;let l=o.userData.t/o.userData.dur;if(l>=1){o.userData.active=!1,o.visible=!1;continue}let c=(.55+l*.75)*o.userData.scale;o.scale.setScalar(c),o.material.opacity=.85*(1-l*l)}for(let o of this.rings.items){if(!o.userData.active)continue;o.userData.t+=e;let l=o.userData.t/o.userData.dur;if(l>=1){o.userData.active=!1,o.visible=!1;continue}o.scale.setScalar(.3+l*o.userData.radius),o.material.opacity=.9*(1-l)}let n=new pt,s=new dn,r=new L,a=new L;for(let o=0;o<this.sparkData.length;o++){let l=this.sparkData[o];if(l.life<=0){n.makeScale(0,0,0),this.sparks.setMatrixAt(o,n);continue}l.life-=e,l.vy-=9*e,l.x+=l.vx*e,l.y+=l.vy*e,l.z+=l.vz*e,l.y<.05&&(l.y=.05,l.vy*=-.4);let c=Math.max(0,l.life/l.max);a.set(l.x,l.y,l.z),r.setScalar(.4+c*.9),n.compose(a,s,r),this.sparks.setMatrixAt(o,n)}this.sparks.instanceMatrix.needsUpdate=!0;for(let o of this.dusts.items){if(!o.userData.active)continue;o.userData.t+=e;let l=o.userData.t/o.userData.dur;if(l>=1){o.userData.active=!1,o.visible=!1;continue}o.position.y+=o.userData.rise*e,o.scale.setScalar(o.scale.x+e*1.4),o.material.opacity=.5*(1-l)}if(this.petalData){for(let o=0;o<this.petalData.length;o++){let l=this.petalData[o];if(!l.ambient&&(l.life-=e,l.vy-=4*e,l.life<=0)){this.spawnAmbientPetal(l,!1);continue}l.phase+=e*2,l.x+=(l.vx+Math.sin(l.phase)*.5)*e,l.y+=l.vy*e,l.z+=(l.vz+Math.cos(l.phase*.8)*.4)*e,l.ambient&&(l.y<.05||Math.hypot(l.x,l.z)>21)&&this.spawnAmbientPetal(l,!1),this.dummy.position.set(l.x,l.y,l.z),this.dummy.rotation.set(l.rx+l.phase,l.ry,l.phase*.7);let c=l.ambient?1:Math.min(1,l.life*2);this.dummy.scale.setScalar(c),this.dummy.updateMatrix(),this.petals.setMatrixAt(o,this.dummy.matrix)}this.petals.instanceMatrix.needsUpdate=!0}this.flashT+=e,this.flashSprite.material.opacity*=Math.pow(.001,e),t&&(this.syncDecals(t,e),this.syncProjectiles(t),this.updateDamageNumbers(e))}syncDecals(e,t){let n=new Set;for(let s of e.telegraphs){n.add(s);let r=this.decals.get(s);if(!r){let o=new lt,l=new at({color:16735288,transparent:!0,opacity:.2,depthWrite:!1,side:Rt}),c=new at({color:16756880,transparent:!0,opacity:.85,depthWrite:!1,side:Rt}),h,d;if(s.kind==="line"?(h=new re(new an(s.halfWidth*2,s.len),l),h.rotation.x=-Math.PI/2,h.position.y=.04,d=new re(new an(s.halfWidth*2,.5),c),d.rotation.x=-Math.PI/2,d.position.y=.05):(h=new re(new Gt(s.radius,28),l),h.rotation.x=-Math.PI/2,h.position.y=.04,d=new re(new bn(s.radius-.14,s.radius,28),c),d.rotation.x=-Math.PI/2,d.position.y=.05),o.add(h),o.add(d),s.kind==="lob"){let u=new re(new ht(.18,8,6),new at({color:9071162}));o.add(u),r={group:o,fill:h,edge:d,bomb:u}}else r={group:o,fill:h,edge:d};this.scene.add(o),this.decals.set(s,r)}let a=Math.min(1,s.t/s.dur);if(r.group.visible=!0,s.kind==="line")r.group.position.set(s.x,0,s.z),r.group.rotation.y=Math.atan2(s.dirX,s.dirZ),r.fill.scale.y=a,r.fill.position.z=-(s.len/2)*(1-a),r.edge.position.z=s.len/2-a*s.len,r.edge.material.opacity=.6+Math.sin(this.time*18)*.3;else if(r.group.position.set(s.x,0,s.z),r.fill.material.opacity=.16+a*.3,r.edge.scale.setScalar(1+Math.sin(this.time*14)*.04),r.bomb&&s.kind==="lob"){let o=s.owner!==void 0?e.enemies.find(d=>d.id===s.owner)||{x:s.x,z:s.z+8}:{x:s.x,z:s.z+8},l=o.x+(s.x-o.x)*a,c=o.z+(s.z-o.z)*a,h=1.2+Math.sin(a*Math.PI)*2.6;r.bomb.position.set(l,h,c),a>=1&&(r.bomb.position.y=-99)}}for(let[s,r]of this.decals)n.has(s)||(this.scene.remove(r.group),this.decals.delete(s))}syncProjectiles(e){let t=new Set,n=new Set;for(let s of e.projectiles)if(s.kind==="blade"){t.add(s);let r=this.blades.get(s);r||(r=this.makeBladeMesh(),this.scene.add(r),this.blades.set(s,r)),r.position.set(s.x,.95,s.z),r.rotation.y=Math.atan2(s.vx,s.vz)+Math.PI/2,r.rotation.z+=.4}else{n.add(s);let r=this.bullets.get(s);r||(r=this.makeBulletMesh(),this.scene.add(r),this.bullets.set(s,r)),r.position.set(s.x,.55,s.z)}for(let[s,r]of this.blades)t.has(s)||(this.scene.remove(r),this.blades.delete(s));for(let[s,r]of this.bullets)n.has(s)||(this.scene.remove(r),this.bullets.delete(s))}updateDamageNumbers(e){let t=window.innerWidth,n=window.innerHeight;for(let s of this.dmgPool){if(s.life<=0){s.el.style.display="none";continue}if(s.life-=e,s.vy+=e*1.4,this.tmpV.copy(s.world),this.tmpV.y+=s.vy*.9,this.tmpV.project(this.camera),this.tmpV.z>1){s.el.style.display="none";continue}let r=(this.tmpV.x*.5+.5)*t,a=(-this.tmpV.y*.5+.5)*n;s.el.style.left=`${r}px`,s.el.style.top=`${a}px`,s.el.style.opacity=Math.min(1,s.life*2.5)}}};var Qe=i=>document.getElementById(i),qo=class{constructor(e){this.el={loading:Qe("loading"),loadingStatus:Qe("loading-status"),menu:Qe("menu"),start:Qe("start"),best:Qe("best-record"),hud:Qe("hud"),hpFill:Qe("hp-fill"),hpText:Qe("hp-text"),energyFill:Qe("energy-fill"),dashPips:Qe("dash-pips"),waveLabel:Qe("wave-label"),score:Qe("score"),bossBar:Qe("boss-bar"),bossFill:Qe("boss-fill"),bossName:Qe("boss-name"),banner:Qe("banner"),pauseButton:Qe("pause-button"),upgrade:Qe("upgrade"),upgradeTitle:Qe("upgrade-title"),upgradeEyebrow:Qe("upgrade-eyebrow"),cards:Qe("upgrade-cards"),pause:Qe("pause"),resume:Qe("resume"),restart:Qe("restart"),menuButton:Qe("menu-button"),result:Qe("result"),resultLabel:Qe("result-label"),resultTitle:Qe("result-title"),resultNote:Qe("result-note"),resultScore:Qe("result-score"),resultWave:Qe("result-wave"),resultKills:Qe("result-kills"),again:Qe("again"),resultMenu:Qe("result-menu"),failure:Qe("failure"),failureMessage:Qe("failure-message"),sound:Qe("sound"),fullscreen:Qe("fullscreen"),touch:Qe("touch-controls"),burst:Qe("touch-burst")},this.onUpgradePick=null,this.on={start:null,resume:null,restart:null,menu:null,pause:null,sound:null,fullscreen:null},this.best=this.loadBest(),this.el.start?.addEventListener("click",()=>this.on.start?.()),this.el.again.addEventListener("click",()=>this.on.start?.()),this.el.restart.addEventListener("click",()=>this.on.restart?.()),this.el.resume.addEventListener("click",()=>this.on.resume?.()),this.el.pauseButton.addEventListener("click",()=>this.on.pause?.()),this.el.menuButton.addEventListener("click",()=>this.on.menu?.()),this.el.resultMenu.addEventListener("click",()=>this.on.menu?.()),this.el.sound.addEventListener("click",()=>this.on.sound?.()),this.el.fullscreen.addEventListener("click",()=>this.on.fullscreen?.());let t=matchMedia("(pointer: coarse)");this.touchMode=t.matches,t.addEventListener?.("change",n=>{this.touchMode=n.matches})}loadBest(){try{return JSON.parse(localStorage.getItem("windisle-best"))||{score:0,wave:0}}catch{return{score:0,wave:0}}}saveBest(e){try{localStorage.setItem("windisle-best",JSON.stringify(e))}catch{}this.best=e}showLoading(e){this.el.loading.hidden=!1,e&&(this.el.loadingStatus.textContent=e)}hideLoading(){this.el.loading.hidden=!0}showMenu(){this.el.menu.hidden=!1,this.el.hud.hidden=!0,this.el.upgrade.hidden=!0,this.el.pause.hidden=!0,this.el.result.hidden=!0,this.refreshBest()}refreshBest(){let e=this.best;this.el.best.textContent=e.score>0?`\u6700\u4F73\u6218\u7EE9 \xB7 ${e.score} \u5206 / \u7B2C ${e.wave} \u6CE2`:""}startRun(){this.el.menu.hidden=!0,this.el.result.hidden=!0,this.el.upgrade.hidden=!0,this.el.pause.hidden=!0,this.el.hud.hidden=!1,this.el.touch.hidden=!this.touchMode}updateHUD(e){let t=e.player,n=Math.max(0,t.hp/t.maxHp);this.el.hpFill.style.width=`${n*100}%`,this.el.hpFill.classList.toggle("low",n<.3),this.el.hpText.textContent=`${Math.ceil(t.hp)} / ${t.maxHp}`,this.el.energyFill.style.width=`${t.energy}%`,this.el.energyFill.classList.toggle("full",t.energy>=100),this.el.waveLabel.textContent=`\u7B2C ${e.wave} \u6CE2`,this.el.score.textContent=`${e.score}`;let s=t.stats.dashMax;for(;this.el.dashPips.children.length<s;)this.el.dashPips.appendChild(document.createElement("i"));for(;this.el.dashPips.children.length>s;)this.el.dashPips.lastChild.remove();[...this.el.dashPips.children].forEach((a,o)=>a.classList.toggle("on",o<t.dashCharges)),this.el.burst.classList.toggle("ready",t.energy>=100);let r=e.enemies.find(a=>a.type==="boss");r?(this.el.bossBar.hidden=!1,this.el.bossFill.style.width=`${Math.max(0,r.hp/r.maxHp)*100}%`,this.el.bossName.textContent=`\u98CE\u66B4\u4E4B\u5FC3 \xB7 ${["\u4E00","\u4E8C","\u4E09"][r.bossPhase-1]}\u9636\u6BB5`):this.el.bossBar.hidden=!0}banner(e){let t=this.el.banner;t.hidden=!1,t.textContent=e,t.style.animation="none",t.offsetWidth,t.style.animation="",clearTimeout(this.bannerTimer),this.bannerTimer=setTimeout(()=>{t.hidden=!0},2e3)}showUpgrade(e,t,n){this.el.upgradeEyebrow.textContent=e%3===0?"BOSS DOWN / \u98CE\u66B4\u9000\u6563":"WAVE CLEAR / \u6CE2\u6B21\u8083\u6E05",this.el.upgradeTitle.textContent=e%3===0?"\u98CE\u66B4\u4E4B\u5FC3\u5012\u4E0B\u4E86":"\u7B2C "+e+" \u6CE2\u5DF2\u8083\u6E05",this.el.cards.innerHTML="",t.forEach((s,r)=>{let a=Ho.find(l=>l.id===s),o=document.createElement("button");o.className="upgrade-card",o.innerHTML=`<span class="u-key">${r+1}</span><span class="u-name">${a.name}</span><span class="u-desc">${a.desc}</span><span class="u-count">\u5DF2\u6301\u6709 ${n[s]||0} / ${a.max}</span>`,o.addEventListener("click",()=>this.onUpgradePick?.(s)),this.el.cards.appendChild(o)}),this.el.upgrade.hidden=!1}hideUpgrade(){this.el.upgrade.hidden=!0}showPause(){this.el.pause.hidden=!1}hidePause(){this.el.pause.hidden=!0}showResult(e,t){this.el.resultScore.textContent=e.score,this.el.resultWave.textContent=e.wave,this.el.resultKills.textContent=e.kills,t?this.el.resultNote.textContent="\u65B0\u7684\u6700\u4F73\u6218\u7EE9\uFF01":this.best.score>0?this.el.resultNote.textContent=`\u6700\u4F73\u6218\u7EE9 \xB7 ${this.best.score} \u5206 / \u7B2C ${this.best.wave} \u6CE2`:this.el.resultNote.textContent="\u5B88\u4F4F\u4E00\u6CE2\uFF0C\u6218\u7EE9\u81EA\u4F1A\u8BB0\u5F55\u3002",this.el.result.hidden=!1,this.el.hud.hidden=!0}setSound(e){this.el.sound.textContent=e?"\u58F0\u97F3\uFF1A\u5F00":"\u58F0\u97F3\uFF1A\u5173",this.el.sound.setAttribute("aria-pressed",String(e))}fail(e){this.el.loading.hidden=!0,this.el.failureMessage.textContent=e,this.el.failure.hidden=!1}};var Yo=class{constructor(){this.ctx=null,this.enabled=!0,this.master=null,this.windGain=null}ensure(){if(this.ctx)return!0;try{return this.ctx=new(window.AudioContext||window.webkitAudioContext),this.master=this.ctx.createGain(),this.master.gain.value=.5,this.master.connect(this.ctx.destination),this.startWind(),!0}catch{return!1}}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}setEnabled(e){this.enabled=e,this.master&&(this.master.gain.value=e?.5:0)}startWind(){let e=this.ctx,t=e.sampleRate*2,n=e.createBuffer(1,t,e.sampleRate),s=n.getChannelData(0),r=0;for(let d=0;d<t;d++){let u=Math.random()*2-1;r=(r+.02*u)/1.02,s[d]=r*3.5}let a=e.createBufferSource();a.buffer=n,a.loop=!0;let o=e.createBiquadFilter();o.type="bandpass",o.frequency.value=420,o.Q.value=.6;let l=e.createGain();l.gain.value=.05;let c=e.createOscillator();c.frequency.value=.13;let h=e.createGain();h.gain.value=.025,c.connect(h),h.connect(l.gain),a.connect(o),o.connect(l),l.connect(this.master),a.start(),c.start(),this.windGain=l}tone({freq:e=440,dur:t=.15,type:n="sine",vol:s=.2,slide:r=0,delay:a=0}){if(!this.ctx||!this.enabled)return;let o=this.ctx,l=o.currentTime+a,c=o.createOscillator(),h=o.createGain();c.type=n,c.frequency.setValueAtTime(e,l),r&&c.frequency.exponentialRampToValueAtTime(Math.max(30,e+r),l+t),h.gain.setValueAtTime(0,l),h.gain.linearRampToValueAtTime(s,l+.008),h.gain.exponentialRampToValueAtTime(1e-4,l+t),c.connect(h),h.connect(this.master),c.start(l),c.stop(l+t+.02)}noise({dur:e=.12,vol:t=.15,freq:n=2e3,q:s=1,slideTo:r=0,delay:a=0}){if(!this.ctx||!this.enabled)return;let o=this.ctx,l=o.currentTime+a,c=Math.ceil(o.sampleRate*e),h=o.createBuffer(1,c,o.sampleRate),d=h.getChannelData(0);for(let S=0;S<c;S++)d[S]=Math.random()*2-1;let u=o.createBufferSource();u.buffer=h;let p=o.createBiquadFilter();p.type="bandpass",p.frequency.setValueAtTime(n,l),p.Q.value=s,r&&p.frequency.exponentialRampToValueAtTime(Math.max(60,r),l+e);let g=o.createGain();g.gain.setValueAtTime(t,l),g.gain.exponentialRampToValueAtTime(1e-4,l+e),u.connect(p),p.connect(g),g.connect(this.master),u.start(l)}slash(e){this.noise({dur:.1,vol:.16,freq:2600+e*700,slideTo:700,q:1.4}),this.tone({freq:620+e*110,dur:.09,type:"triangle",vol:.1,slide:-260})}heavy(){this.noise({dur:.24,vol:.24,freq:900,slideTo:200,q:.8}),this.tone({freq:130,dur:.3,type:"sine",vol:.3,slide:-60})}hit(e){e?(this.tone({freq:1150,dur:.06,type:"square",vol:.08}),this.noise({dur:.05,vol:.1,freq:3200})):(this.noise({dur:.06,vol:.14,freq:1800,q:.8}),this.tone({freq:220,dur:.08,type:"triangle",vol:.16,slide:-80}))}kill(e){e?(this.tone({freq:90,dur:.7,type:"sine",vol:.4,slide:-40}),this.noise({dur:.5,vol:.25,freq:500,slideTo:80})):this.tone({freq:330,dur:.14,type:"triangle",vol:.16,slide:-180})}dash(){this.noise({dur:.18,vol:.13,freq:700,slideTo:2400,q:.8})}blade(){this.tone({freq:880,dur:.16,type:"sine",vol:.12,slide:420}),this.noise({dur:.12,vol:.07,freq:3600,slideTo:1600})}burst(){this.tone({freq:160,dur:.5,type:"sine",vol:.34,slide:90}),this.noise({dur:.5,vol:.2,freq:1200,slideTo:2600}),[523,659,784].forEach((e,t)=>this.tone({freq:e,dur:.3,type:"triangle",vol:.1,delay:t*.06}))}hurt(){this.tone({freq:150,dur:.22,type:"sawtooth",vol:.2,slide:-70}),this.noise({dur:.12,vol:.12,freq:500})}wave(){[392,523,659,784].forEach((e,t)=>this.tone({freq:e,dur:.35,type:"triangle",vol:.12,delay:t*.09}))}bossPhase(){this.tone({freq:70,dur:.8,type:"sine",vol:.4,slide:30}),this.noise({dur:.4,vol:.2,freq:300,slideTo:90})}upgrade(){[523,784,1047].forEach((e,t)=>this.tone({freq:e,dur:.25,type:"sine",vol:.12,delay:t*.07}))}gameover(){[440,349,262,196].forEach((e,t)=>this.tone({freq:e,dur:.5,type:"triangle",vol:.14,delay:t*.22}))}start(){[262,392,523].forEach((e,t)=>this.tone({freq:e,dur:.3,type:"triangle",vol:.14,delay:t*.08}))}};var Zo=1/60,Dr=matchMedia("(prefers-reduced-motion: reduce)");function O0(){let i=document.getElementById("windisle-canvas"),e=document.createElement("div");e.id="damage-layer";let t=document.getElementById("hud");t?t.after(e):document.getElementById("game-stage").appendChild(e);let n=new qo,s;try{s=new Lo({canvas:i,antialias:!0,powerPreference:"high-performance"})}catch{n.fail("\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 WebGL\uFF0C\u65E0\u6CD5\u8FDB\u5165\u98CE\u5C7F\u3002");return}s.outputColorSpace=kt,s.toneMapping=Pi,s.toneMappingExposure=1,s.shadowMap.enabled=!0,s.shadowMap.type=Oa;let r=new Ys,a=new Yt(50,1,.1,400),o=new Bo(s);o.addPass(new Oo(r,a));let l=new Es(new Pe(1,1),.26,.5,1.05);o.addPass(l),o.addPass(new zo);let c=Su(r,{reducedMotion:Dr.matches}),h=new Yo,d=new Xo(r,a,e,{reducedMotion:Dr.matches}),u=bu(r),p=new Wo(r),g=Go(1),S=Rs(1),m="menu",f=null,M=new Set,A={attack:!1,dash:!1,blade:!1,burst:!1},v=!1,b={x:0,z:0,active:!1};function T(){let ne=0,oe=0;return(M.has("KeyW")||M.has("ArrowUp"))&&(oe-=1),(M.has("KeyS")||M.has("ArrowDown"))&&(oe+=1),(M.has("KeyA")||M.has("ArrowLeft"))&&(ne-=1),(M.has("KeyD")||M.has("ArrowRight"))&&(ne+=1),{x:ne,z:oe}}window.addEventListener("keydown",ne=>{if(!ne.repeat&&(M.add(ne.code),ne.code==="Space"&&(A.dash=!0,ne.preventDefault()),ne.code==="KeyJ"&&(A.attack=!0),ne.code==="KeyU"&&(v=!0),ne.code==="KeyK"&&(A.blade=!0),ne.code==="KeyL"&&(A.burst=!0),(ne.code==="KeyP"||ne.code==="Escape")&&U(),m==="run"&&g.phase==="upgrade"&&["Digit1","Digit2","Digit3"].includes(ne.code))){let oe=Number(ne.code.slice(-1))-1;g.offer[oe]&&D(g.offer[oe])}}),window.addEventListener("keyup",ne=>{M.delete(ne.code),ne.code==="KeyU"&&(v=!1)}),i.addEventListener("pointerdown",ne=>{ne.pointerType==="mouse"&&ne.button===0&&(A.attack=!0),h.ensure(),h.resume()});let C=document.getElementById("touch-stick"),_=C?.querySelector("i");if(C){let ne=null,oe=Je=>{ne=Je.pointerId,C.setPointerCapture(ne),ae(Je)},ae=Je=>{if(Je.pointerId!==ne)return;let fe=C.getBoundingClientRect(),mt=fe.left+fe.width/2,ue=fe.top+fe.height/2,P=(Je.clientX-mt)/(fe.width/2),et=(Je.clientY-ue)/(fe.height/2),Ze=Math.hypot(P,et);Ze>1&&(P/=Ze,et/=Ze),b.x=P,b.z=et,b.active=!0,_&&(_.style.transform=`translate(${P*30}px, ${et*30}px)`)},Fe=Je=>{Je.pointerId===ne&&(ne=null,b.x=b.z=0,b.active=!1,_&&(_.style.transform=""))};C.addEventListener("pointerdown",oe),C.addEventListener("pointermove",ae),C.addEventListener("pointerup",Fe),C.addEventListener("pointercancel",Fe)}let E=(ne,oe)=>{let ae=document.getElementById(ne);ae&&ae.addEventListener("pointerdown",Fe=>{Fe.preventDefault(),oe(),h.ensure(),h.resume()})};E("touch-attack",()=>{A.attack=!0}),E("touch-dash",()=>{A.dash=!0}),E("touch-blade",()=>{A.blade=!0}),E("touch-burst",()=>{A.burst=!0}),n.on.start=()=>R(),n.on.restart=()=>R(),n.on.resume=()=>U(),n.on.menu=()=>{m="menu",g=Go(1),S=Rs(1),n.showMenu()},n.on.pause=()=>U(),n.on.sound=()=>{h.ensure(),h.setEnabled(!h.enabled),n.setSound(h.enabled)},n.on.fullscreen=()=>{let ne=document.getElementById("game-stage");document.fullscreenElement?document.exitFullscreen?.():ne.requestFullscreen?.()},n.onUpgradePick=ne=>D(ne),n.setSound(!0),n.showMenu();function R(){h.ensure(),h.resume(),h.start(),g=Go(Math.random()*1e9|0),S=Rs(g.seed^10875218),m="run",hc(g,1),n.startRun(),n.banner("\u7B2C 1 \u6CE2")}function D(ne){gu(g,ne),n.hideUpgrade(),h.upgrade(),hc(g,g.wave+1),n.banner(g.wave%3===0?"\u98CE\u66B4\u5C06\u81F3":`\u7B2C ${g.wave} \u6CE2`)}function U(){m==="run"&&(g.phase==="playing"?(g.phase="paused",n.showPause()):g.phase==="paused"&&(g.phase="playing",n.hidePause()))}window.addEventListener("blur",()=>{m==="run"&&g.phase==="playing"&&U()});function H(ne){d.drain(ne);for(let oe of ne)switch(oe.type){case"slash":h.slash(oe.stage);break;case"heavy":h.heavy();break;case"hit":h.hit(oe.blocked);break;case"kill":h.kill(oe.type==="boss");break;case"dash":h.dash();break;case"blade":h.blade();break;case"burst":h.burst();break;case"playerHurt":h.hurt();break;case"waveClear":h.wave();break;case"bossPhase":h.bossPhase(),n.banner(`\u98CE\u66B4\u4E4B\u5FC3 \xB7 ${["\u4E00","\u4E8C","\u4E09"][oe.phase-1]}\u9636\u6BB5`);break;case"wave":oe.n%3===0&&n.banner("\u98CE\u66B4\u4E4B\u5FC3 \u82CF\u9192");break;case"gameover":{let ae=n.best,Fe=g.score>ae.score;Fe&&n.saveBest({score:g.score,wave:g.wave}),h.gameover(),n.showResult(g,Fe);break}}}let I=new L,k=new L(0,14,26),W=new L;function Y(ne,oe){if(m==="menu"){let fe=oe*.1;k.lerp(new L(Math.cos(fe)*26,11+Math.sin(oe*.3)*1.5,Math.sin(fe)*26),1-Math.exp(-2*ne)),a.position.copy(k),a.lookAt(0,1.6,0);return}let ae=g.player,Fe=.12;I.set(ae.x+ae.vx*Fe,0,ae.z+ae.vz*Fe);let Je=I.clone().add(new L(0,10,12));k.lerp(Je,1-Math.exp(-4.2*ne)),d.getShakeOffset(W),a.position.copy(k).add(W),a.lookAt(I.x,I.y+1.1,I.z-1.4)}let ie=Math.min(window.devicePixelRatio||1,2),B=1;function O(){let ne=window.innerWidth,oe=window.innerHeight;s.setSize(ne,oe,!1),s.setPixelRatio(ie*B),o.setSize(ne,oe),o.setPixelRatio(ie*B),a.aspect=ne/oe,a.updateProjectionMatrix()}window.addEventListener("resize",O),O();let J=60,ce=0,Ee=0,Ye=0,je=document.getElementById("performance");function st(ne){ce+=ne,Ee++,ce>=.5&&(J=Ee/ce,je&&(je.textContent=`\u5E27\u7387 ${J.toFixed(0)} FPS`),ce=0,Ee=0,J<42&&B>.62?(Ye+=.5,Ye>=2&&(B=Math.max(.62,B-.22),O(),Ye=0)):Ye=0)}let $=performance.now(),j=0,he=0,ke=0,ye=0,Oe={moveX:0,moveZ:0,attackPressed:!1,heavyDown:!1,dashPressed:!1,bladePressed:!1,burstPressed:!1};function Te(ne=performance.now()){ke++;let oe=Math.min(.05,(ne-$)/1e3);if(ye=oe,$=ne,j+=oe,st(oe),c.update(oe),m==="run"){let ae=T();if(Oe.moveX=b.active?b.x:ae.x,Oe.moveZ=b.active?b.z:ae.z,Oe.attackPressed=A.attack,Oe.dashPressed=A.dash,Oe.bladePressed=A.blade,Oe.burstPressed=A.burst,Oe.heavyDown=v,d.hitstop<=0){he+=oe;let Fe=0;for(;he>=Zo&&Fe<4;){try{_u(g,Zo,Oe,S),H(g.events)}catch(Je){window.__simError=String(Je&&Je.stack||Je);break}if(g.events.length=0,A.attack=A.dash=A.blade=A.burst=!1,Oe.attackPressed=Oe.dashPressed=Oe.bladePressed=Oe.burstPressed=!1,he-=Zo,Fe++,g.phase==="upgrade"){n.showUpgrade(g.wave,g.offer,g.upgradesTaken||{}),he=0;break}if(g.phase!=="playing"){he=0;break}}}else d.hitstop-=oe;he>Zo*4&&(he=0),u.update(g,oe,j,Dr.matches),p.sync(g,oe,j,Dr.matches),d.update(oe,g),n.updateHUD(g)}else u.update({player:{...g.player,x:0,z:0,vx:0,vz:0,moving:0,dashT:0,comboStage:0,heavyT:-1,hurtT:0,runT:0,stats:g.player.stats},enemies:[]},oe,j,Dr.matches),d.update(oe,null);Y(oe,j),o.render()}let Z=new URLSearchParams(location.search);if(Z.has("pump")){let ne=Math.max(1,Number(Z.get("slow"))||1);setInterval(()=>Te(performance.now()),16*ne)}else requestAnimationFrame(Te);window.__windisle={get state(){return g},get mode(){return m},get acc(){return he},get hitstop(){return d.hitstop},get simError(){return window.__simError||null},get frames(){return ke},get lastDt(){return ye}},n.hideLoading()}O0();
/*! For license information please see windisle.js.LEGAL.txt */
