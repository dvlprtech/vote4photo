import{s as be,A as se,C as oe,B as fe,L as J,e as ie,i as T,d as v,r as $e,u as ke,v as we,w as Ce,f as F,a as L,g as M,c as j,h as A,j as P,S as ce,R as Ee,y as z,T as Te,x as te,o as Fe,l as O,m as U,z as ze,U as Me,K as ue,n as Q,P as Be}from"../chunks/scheduler.f07fb11b.js";import{S as Ie,i as Pe,b as R,d as q,m as H,a as k,t as S,e as G,g as Y,c as Z}from"../chunks/index.839dbff0.js";import{e as me,D as W,a as X}from"../chunks/format-utils.603f5a98.js";import{a as Le,g as je}from"../chunks/navigation.f069e489.js";import{F as Ae,a as le,c as Ne,d as Ve,e as Oe,g as Ue}from"../chunks/fetch-utils.834a8e20.js";import{w as de}from"../chunks/index.106180d9.js";import{B as Re}from"../chunks/Badge.aeb8a397.js";import{g as qe,a as He,t as _e,B as Se}from"../chunks/Button.b97be4f2.js";import{F as Ge,c as Ke}from"../chunks/contest-store.b597ef5d.js";function Je(n){let e;const s=n[10].default,t=$e(s,n,n[16],null);return{c(){t&&t.c()},l(l){t&&t.l(l)},m(l,a){t&&t.m(l,a),e=!0},p(l,a){t&&t.p&&(!e||a&65536)&&ke(t,s,l,l[16],e?Ce(s,l[16],a,null):we(l[16]),null)},i(l){e||(k(t,l),e=!0)},o(l){S(t,l),e=!1},d(l){t&&t.d(l)}}}function Qe(n){let e,s,t,l,a;const i=n[10].default,f=$e(i,n,n[16],null);return{c(){e=F("img"),t=L(),l=F("div"),f&&f.c(),this.h()},l(r){e=M(r,"IMG",{class:!0,src:!0,alt:!0}),t=j(r),l=M(r,"DIV",{class:!0});var c=A(l);f&&f.l(c),c.forEach(v),this.h()},h(){P(e,"class",n[4]),ce(e.src,s=n[1])||P(e,"src",s),P(e,"alt",""),P(l,"class",n[2])},m(r,c){T(r,e,c),T(r,t,c),T(r,l,c),f&&f.m(l,null),a=!0},p(r,c){(!a||c&16)&&P(e,"class",r[4]),(!a||c&2&&!ce(e.src,s=r[1]))&&P(e,"src",s),f&&f.p&&(!a||c&65536)&&ke(f,i,r,r[16],a?Ce(i,r[16],c,null):we(r[16]),null),(!a||c&4)&&P(l,"class",r[2])},i(r){a||(k(f,r),a=!0)},o(r){S(f,r),a=!1},d(r){r&&(v(e),v(t),v(l)),f&&f.d(r)}}}function We(n){let e,s,t,l;const a=[Qe,Je],i=[];function f(r,c){return r[1]?0:1}return e=f(n),s=i[e]=a[e](n),{c(){s.c(),t=ie()},l(r){s.l(r),t=ie()},m(r,c){i[e].m(r,c),T(r,t,c),l=!0},p(r,c){let p=e;e=f(r),e===p?i[e].p(r,c):(Y(),S(i[p],1,1,()=>{i[p]=null}),Z(),s=i[e],s?s.p(r,c):(s=i[e]=a[e](r),s.c()),k(s,1),s.m(t.parentNode,t))},i(r){l||(k(s),l=!0)},o(r){S(s),l=!1},d(r){r&&v(t),i[e].d(r)}}}function Xe(n){let e,s;const t=[{tag:n[0]?"a":"div"},{rounded:!0},{shadow:!0},{border:!0},{href:n[0]},n[5],{class:n[3]}];let l={$$slots:{default:[We]},$$scope:{ctx:n}};for(let a=0;a<t.length;a+=1)l=se(l,t[a]);return e=new Ae({props:l}),e.$on("click",n[11]),e.$on("focusin",n[12]),e.$on("focusout",n[13]),e.$on("mouseenter",n[14]),e.$on("mouseleave",n[15]),{c(){R(e.$$.fragment)},l(a){q(e.$$.fragment,a)},m(a,i){H(e,a,i),s=!0},p(a,[i]){const f=i&41?qe(t,[i&1&&{tag:a[0]?"a":"div"},t[1],t[2],t[3],i&1&&{href:a[0]},i&32&&He(a[5]),i&8&&{class:a[3]}]):{};i&65558&&(f.$$scope={dirty:i,ctx:a}),e.$set(f)},i(a){s||(k(e.$$.fragment,a),s=!0)},o(a){S(e.$$.fragment,a),s=!1},d(a){G(e,a)}}}function Ye(n,e,s){let t;const l=["href","horizontal","reverse","img","padding","size"];let a=oe(e,l),{$$slots:i={},$$scope:f}=e,{href:r=void 0}=e,{horizontal:c=!1}=e,{reverse:p=!1}=e,{img:b=void 0}=e,{padding:D="lg"}=e,{size:d="sm"}=e;const w={none:"p-0",sm:"p-4 sm:p-6 md:p-8",md:"p-4 sm:p-5",lg:"p-4 sm:p-6",xl:"p-4 sm:p-8"},m={xs:"max-w-xs",sm:"max-w-sm",md:"max-w-lg",lg:"max-w-2xl",xl:"max-w-screen-xl"};let g,o;function u(_){J.call(this,n,_)}function $(_){J.call(this,n,_)}function B(_){J.call(this,n,_)}function h(_){J.call(this,n,_)}function N(_){J.call(this,n,_)}return n.$$set=_=>{s(20,e=se(se({},e),fe(_))),s(5,a=oe(e,l)),"href"in _&&s(0,r=_.href),"horizontal"in _&&s(6,c=_.horizontal),"reverse"in _&&s(7,p=_.reverse),"img"in _&&s(1,b=_.img),"padding"in _&&s(8,D=_.padding),"size"in _&&s(9,d=_.size),"$$scope"in _&&s(16,f=_.$$scope)},n.$$.update=()=>{n.$$.dirty&256&&s(2,t=w[D]),s(3,g=_e("flex",m[d],p?"flex-col-reverse":"flex-col",c&&(p?"md:flex-row-reverse md:max-w-xl":"md:flex-row md:max-w-xl"),r&&"hover:bg-gray-100 dark:hover:bg-gray-700",!b&&t,e.class)),n.$$.dirty&192&&s(4,o=_e(p?"rounded-b-lg":"rounded-t-lg",c&&"object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none",c&&(p?"md:rounded-e-lg":"md:rounded-s-lg")))},e=fe(e),[r,b,t,g,o,a,c,p,D,d,i,u,$,B,h,N,f]}class Ze extends Ie{constructor(e){super(),Pe(this,e,Ye,Xe,be,{href:0,horizontal:6,reverse:7,img:1,padding:8,size:9})}}function ge(n,e,s){const t=n.slice();return t[13]=e[s],t[15]=s,t}function he(n){let e,s;return e=new Se({props:{outline:!0,size:"xs",class:"button-secondary",$$slots:{default:[ye]},$$scope:{ctx:n}}}),e.$on("click",n[6]),{c(){R(e.$$.fragment)},l(t){q(e.$$.fragment,t)},m(t,l){H(e,t,l),s=!0},p(t,l){const a={};l&65536&&(a.$$scope={dirty:l,ctx:t}),e.$set(a)},i(t){s||(k(e.$$.fragment,t),s=!0)},o(t){S(e.$$.fragment,t),s=!1},d(t){G(e,t)}}}function ye(n){let e,s,t;return e=new le({props:{icon:Ne,class:"w-5 h-5 mr-1"}}),{c(){R(e.$$.fragment),s=O(`
				Nuevo`)},l(l){q(e.$$.fragment,l),s=U(l,`
				Nuevo`)},m(l,a){H(e,l,a),T(l,s,a),t=!0},p:ze,i(l){t||(k(e.$$.fragment,l),t=!0)},o(l){S(e.$$.fragment,l),t=!1},d(l){l&&v(s),G(e,l)}}}function xe(n){let e,s,t;return e=new le({props:{icon:Ve,class:"w-5 h-5 mr-1"}}),{c(){R(e.$$.fragment),s=O(`
			Actualizar`)},l(l){q(e.$$.fragment,l),s=U(l,`
			Actualizar`)},m(l,a){H(e,l,a),T(l,s,a),t=!0},p:ze,i(l){t||(k(e.$$.fragment,l),t=!0)},o(l){S(e.$$.fragment,l),t=!1},d(l){l&&v(s),G(e,l)}}}function pe(n){let e,s;return e=new Re({props:{rounded:!0,class:"text-white bg-surface-900 text-xs font-bold",$$slots:{default:[et]},$$scope:{ctx:n}}}),{c(){R(e.$$.fragment)},l(t){q(e.$$.fragment,t)},m(t,l){H(e,t,l),s=!0},p(t,l){const a={};l&65540&&(a.$$scope={dirty:l,ctx:t}),e.$set(a)},i(t){s||(k(e.$$.fragment,t),s=!0)},o(t){S(e.$$.fragment,t),s=!1},d(t){G(e,t)}}}function et(n){let e=n[13].totalPhotos+"",s;return{c(){s=O(e)},l(t){s=U(t,e)},m(t,l){T(t,s,l)},p(t,l){l&4&&e!==(e=t[13].totalPhotos+"")&&Q(s,e)},d(t){t&&v(s)}}}function tt(n){let e,s,t,l,a,i=n[13].title+"",f,r,c,p,b=n[13].description+"",D,d,w,m,g=W.fromISO(n[13].initTimestamp).toLocaleString(X)+"",o,u,$,B,h=W.fromISO(n[13].endTimestamp).toLocaleString(X)+"",N,_,K,y,ne;t=new le({props:{icon:Ue,size:"lg",class:"mr-1 ",color:n[9](n[13].status)}});let C=n[13].totalPhotos&&pe(n);function De(){return n[12](n[13])}return{c(){e=F("div"),s=F("div"),R(t.$$.fragment),l=L(),a=F("h3"),f=O(i),r=L(),C&&C.c(),c=L(),p=F("p"),D=O(b),d=L(),w=F("p"),m=O("Inicio: "),o=O(g),u=L(),$=F("p"),B=O("Fin: "),N=O(h),_=L(),this.h()},l(E){e=M(E,"DIV",{role:!0,tabindex:!0,class:!0});var I=A(e);s=M(I,"DIV",{class:!0});var V=A(s);q(t.$$.fragment,V),l=j(V),a=M(V,"H3",{class:!0});var ae=A(a);f=U(ae,i),ae.forEach(v),r=j(V),C&&C.l(V),V.forEach(v),c=j(I),p=M(I,"P",{class:!0});var re=A(p);D=U(re,b),re.forEach(v),d=j(I),w=M(I,"P",{class:!0});var x=A(w);m=U(x,"Inicio: "),o=U(x,g),x.forEach(v),u=j(I),$=M(I,"P",{class:!0});var ee=A($);B=U(ee,"Fin: "),N=U(ee,h),ee.forEach(v),I.forEach(v),_=j(E),this.h()},h(){P(a,"class","text-lg font-semibold tracking-tight"),P(s,"class","flex flex-row gap-2 items-center"),P(p,"class","mb-3 font-normal"),P(w,"class","text-sm text-gray-500"),P($,"class","text-sm text-gray-500"),P(e,"role","link"),P(e,"tabindex",n[15]),P(e,"class","flex flex-col cursor-pointer")},m(E,I){T(E,e,I),z(e,s),H(t,s,null),z(s,l),z(s,a),z(a,f),z(s,r),C&&C.m(s,null),z(e,c),z(e,p),z(p,D),z(e,d),z(e,w),z(w,m),z(w,o),z(e,u),z(e,$),z($,B),z($,N),T(E,_,I),K=!0,y||(ne=[ue(e,"click",De),ue(e,"keypress",null)],y=!0)},p(E,I){n=E;const V={};I&4&&(V.color=n[9](n[13].status)),t.$set(V),(!K||I&4)&&i!==(i=n[13].title+"")&&Q(f,i),n[13].totalPhotos?C?(C.p(n,I),I&4&&k(C,1)):(C=pe(n),C.c(),k(C,1),C.m(s,null)):C&&(Y(),S(C,1,1,()=>{C=null}),Z()),(!K||I&4)&&b!==(b=n[13].description+"")&&Q(D,b),(!K||I&4)&&g!==(g=W.fromISO(n[13].initTimestamp).toLocaleString(X)+"")&&Q(o,g),(!K||I&4)&&h!==(h=W.fromISO(n[13].endTimestamp).toLocaleString(X)+"")&&Q(N,h)},i(E){K||(k(t.$$.fragment,E),k(C),K=!0)},o(E){S(t.$$.fragment,E),S(C),K=!1},d(E){E&&(v(e),v(_)),G(t),C&&C.d(),y=!1,Be(ne)}}}function ve(n){let e,s;return e=new Ze({props:{class:n[10](n[13].status),$$slots:{default:[tt]},$$scope:{ctx:n}}}),{c(){R(e.$$.fragment)},l(t){q(e.$$.fragment,t)},m(t,l){H(e,t,l),s=!0},p(t,l){const a={};l&4&&(a.class=t[10](t[13].status)),l&65540&&(a.$$scope={dirty:l,ctx:t}),e.$set(a)},i(t){s||(k(e.$$.fragment,t),s=!0)},o(t){S(e.$$.fragment,t),s=!1},d(t){G(e,t)}}}function st(n){let e,s,t="Concursos",l,a,i,f,r,c,p,b,D,d=n[1]&&he(n);f=new Se({props:{color:"alternative",outline:!0,size:"xs",$$slots:{default:[xe]},$$scope:{ctx:n}}}),f.$on("click",n[5]);let w=me(n[2]),m=[];for(let o=0;o<w.length;o+=1)m[o]=ve(ge(n,w,o));const g=o=>S(m[o],1,1,()=>{m[o]=null});return b=new Ge({props:{openModal:n[0]}}),b.$on("created",n[7]),b.$on("close",n[8]),{c(){e=F("div"),s=F("h1"),s.textContent=t,l=L(),a=F("div"),d&&d.c(),i=L(),R(f.$$.fragment),r=L(),c=F("div");for(let o=0;o<m.length;o+=1)m[o].c();p=L(),R(b.$$.fragment),this.h()},l(o){e=M(o,"DIV",{class:!0});var u=A(e);s=M(u,"H1",{class:!0,"data-svelte-h":!0}),Ee(s)!=="svelte-gbj0ph"&&(s.textContent=t),l=j(u),a=M(u,"DIV",{class:!0});var $=A(a);d&&d.l($),i=j($),q(f.$$.fragment,$),$.forEach(v),u.forEach(v),r=j(o),c=M(o,"DIV",{class:!0});var B=A(c);for(let h=0;h<m.length;h+=1)m[h].l(B);B.forEach(v),p=j(o),q(b.$$.fragment,o),this.h()},h(){P(s,"class","text-xl font-semibold"),P(a,"class","flex gap-1"),P(e,"class","w-full flex items-center justify-between"),P(c,"class","flex flex-row gap-2 flex-wrap mt-5")},m(o,u){T(o,e,u),z(e,s),z(e,l),z(e,a),d&&d.m(a,null),z(a,i),H(f,a,null),T(o,r,u),T(o,c,u);for(let $=0;$<m.length;$+=1)m[$]&&m[$].m(c,null);T(o,p,u),H(b,o,u),D=!0},p(o,[u]){o[1]?d?(d.p(o,u),u&2&&k(d,1)):(d=he(o),d.c(),k(d,1),d.m(a,i)):d&&(Y(),S(d,1,1,()=>{d=null}),Z());const $={};if(u&65536&&($.$$scope={dirty:u,ctx:o}),f.$set($),u&3588){w=me(o[2]);let h;for(h=0;h<w.length;h+=1){const N=ge(o,w,h);m[h]?(m[h].p(N,u),k(m[h],1)):(m[h]=ve(N),m[h].c(),k(m[h],1),m[h].m(c,null))}for(Y(),h=w.length;h<m.length;h+=1)g(h);Z()}const B={};u&1&&(B.openModal=o[0]),b.$set(B)},i(o){if(!D){k(d),k(f.$$.fragment,o);for(let u=0;u<w.length;u+=1)k(m[u]);k(b.$$.fragment,o),D=!0}},o(o){S(d),S(f.$$.fragment,o),m=m.filter(Boolean);for(let u=0;u<m.length;u+=1)S(m[u]);S(b.$$.fragment,o),D=!1},d(o){o&&(v(e),v(r),v(c),v(p)),d&&d.d(),G(f),Te(m,o),G(b,o)}}}function lt(n,e,s){let t,l,a;te(n,Le,g=>s(1,l=g));const i=de(!1);te(n,i,g=>s(0,t=g));const f=de([]);te(n,f,g=>s(2,a=g));const r=async()=>{const g=await Oe("/api/contest");g.status===200&&(console.log("Refresh contest data..."),f.set(await g.json()))};Fe(r);const c=async()=>{i.set(!0)},p=async g=>{console.log("newContestCreated",g),r()},b=async()=>{console.log("closedNewContestDialog"),Me(i,t=!1,t)},D=g=>{switch(g){case"active":return"green";case"pending":return"blue";default:return"gray"}},d=g=>`shadow-${D(g)}-100`,w=g=>{Ke.set(g),je("/app/contests/selected")};return[t,l,a,i,f,r,c,p,b,D,d,w,g=>w(g.id)]}class dt extends Ie{constructor(e){super(),Pe(this,e,lt,st,be,{})}}export{dt as component};
