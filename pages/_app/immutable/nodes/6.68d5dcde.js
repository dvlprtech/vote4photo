import{e as Pe,M as bt,h as lt,i as Nt,a as we,j as vt,c as wt,k as yt,l as Mt,m as Ot}from"../chunks/fetch-utils.834a8e20.js";import{s as Ae,r as Ft,A as Ne,f as V,a as A,g as D,h as K,c as L,d as u,E as Ge,j as U,i as I,y as b,K as x,u as jt,v as zt,w as At,P as kt,C as Re,B as et,L as oe,p as Le,V as It,W as ze,X as Lt,Y as Je,x as Me,Z as Pt,_ as Ut,e as Fe,R as Ce,T as Et,l as q,m as J,z as ke,n as ve,o as Bt,U as Kt}from"../chunks/scheduler.f07fb11b.js";import{c as Ht,F as Gt}from"../chunks/contest-store.b597ef5d.js";import{g as Rt,b as Wt,d as Ct,a as qt}from"../chunks/navigation.f069e489.js";import{S as Ue,i as Be,a as $,t as k,b as y,d as M,m as O,e as F,h as Xe,g as De,c as Te}from"../chunks/index.839dbff0.js";import{e as We,D as Ke,a as He}from"../chunks/format-utils.603f5a98.js";import{p as Jt}from"../chunks/stores.4f1751f7.js";import{t as at,g as Ye,a as St,B as Ee}from"../chunks/Button.b97be4f2.js";import{L as Oe,f as Xt,a as Yt,b as Zt}from"../chunks/index.bb9cc5fb.js";import{S as Qt,a as xt,M as en}from"../chunks/my-card.649661f8.js";import{s as qe}from"../chunks/error-manager.904fdb74.js";import{s as tn}from"../chunks/wallet-store.e2583a36.js";import{w as Vt}from"../chunks/index.106180d9.js";import{I as je}from"../chunks/Input.f2aa900e.js";import{I as Dt}from"../chunks/Img.2854c9e3.js";import"../chunks/paths.5329a3f8.js";import{B as nn}from"../chunks/Badge.aeb8a397.js";import{C as sn}from"../chunks/Checkbox.f6abab59.js";import{H as Tt}from"../chunks/Textarea.9523c714.js";function on(o){let e,t,n,s,l,a,r,f;const c=o[8].default,d=Ft(c,o,o[7],null);let g=[o[6],{type:"file"},{class:"hidden"}],m={};for(let w=0;w<g.length;w+=1)m=Ne(m,g[w]);return{c(){e=V("button"),t=V("label"),d&&d.c(),n=A(),s=V("input"),this.h()},l(w){e=D(w,"BUTTON",{class:!0,type:!0});var v=K(e);t=D(v,"LABEL",{class:!0,tabindex:!0});var E=K(t);d&&d.l(E),n=L(E),s=D(E,"INPUT",{type:!0,class:!0}),E.forEach(u),v.forEach(u),this.h()},h(){Ge(s,m),U(t,"class","flex flex-col items-center"),U(t,"tabindex","0"),U(e,"class",l=at(o[2],o[5].class)),U(e,"type","button")},m(w,v){I(w,e,v),b(e,t),d&&d.m(t,null),b(t,n),b(t,s),s.autofocus&&s.focus(),o[21](s),a=!0,r||(f=[x(s,"change",o[20]),x(s,"change",o[18]),x(s,"click",o[19]),x(e,"keydown",o[4]),x(e,"focus",o[9]),x(e,"blur",o[10]),x(e,"mouseenter",o[11]),x(e,"mouseleave",o[12]),x(e,"mouseover",o[13]),x(e,"dragenter",o[14]),x(e,"dragleave",o[15]),x(e,"dragover",o[16]),x(e,"drop",o[17])],r=!0)},p(w,[v]){d&&d.p&&(!a||v&128)&&jt(d,c,w,w[7],a?At(c,w[7],v,null):zt(w[7]),null),Ge(s,m=Ye(g,[v&64&&w[6],{type:"file"},{class:"hidden"}])),(!a||v&36&&l!==(l=at(w[2],w[5].class)))&&U(e,"class",l)},i(w){a||($(d,w),a=!0)},o(w){k(d,w),a=!1},d(w){w&&u(e),d&&d.d(w),o[21](null),r=!1,kt(f)}}}function ln(o,e,t){const n=["value","files","defaultClass"];let s=Re(e,n),{$$slots:l={},$$scope:a}=e,{value:r=""}=e,{files:f=void 0}=e,{defaultClass:c="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"}=e,d;function g(i){[" ","Enter"].includes(i.key)&&(i.preventDefault(),d.click())}function m(i){oe.call(this,o,i)}function w(i){oe.call(this,o,i)}function v(i){oe.call(this,o,i)}function E(i){oe.call(this,o,i)}function j(i){oe.call(this,o,i)}function G(i){oe.call(this,o,i)}function R(i){oe.call(this,o,i)}function H(i){oe.call(this,o,i)}function S(i){oe.call(this,o,i)}function ee(i){oe.call(this,o,i)}function z(i){oe.call(this,o,i)}function P(){r=this.value,f=this.files,t(0,r),t(1,f)}function _(i){Le[i?"unshift":"push"](()=>{d=i,t(3,d)})}return o.$$set=i=>{t(5,e=Ne(Ne({},e),et(i))),t(6,s=Re(e,n)),"value"in i&&t(0,r=i.value),"files"in i&&t(1,f=i.files),"defaultClass"in i&&t(2,c=i.defaultClass),"$$scope"in i&&t(7,a=i.$$scope)},e=et(e),[r,f,c,d,g,e,s,a,l,m,w,v,E,j,G,R,H,S,ee,z,P,_]}class an extends Ue{constructor(e){super(),Be(this,e,ln,on,Ae,{value:0,files:1,defaultClass:2})}}function rn(o){let e,t,n,s=[o[16],{type:"number"}],l={};for(let a=0;a<s.length;a+=1)l=Ne(l,s[a]);return{c(){e=V("input"),this.h()},l(a){e=D(a,"INPUT",{type:!0}),this.h()},h(){Ge(e,l)},m(a,r){I(a,e,r),e.autofocus&&e.focus(),ze(e,o[0]),t||(n=[x(e,"input",o[15]),x(e,"blur",o[2]),x(e,"change",o[3]),x(e,"click",o[4]),x(e,"contextmenu",o[5]),x(e,"focus",o[6]),x(e,"keydown",o[7]),x(e,"keypress",o[8]),x(e,"keyup",o[9]),x(e,"mouseover",o[10]),x(e,"mouseenter",o[11]),x(e,"mouseleave",o[12]),x(e,"paste",o[13]),x(e,"input",o[14])],t=!0)},p(a,r){Ge(e,l=Ye(s,[r&65536&&a[16],{type:"number"}])),r&1&&It(e.value)!==a[0]&&ze(e,a[0])},d(a){a&&u(e),t=!1,kt(n)}}}function fn(o){let e,t;const n=[o[1]];let s={$$slots:{default:[rn,({props:l})=>({16:l}),({props:l})=>l?65536:0]},$$scope:{ctx:o}};for(let l=0;l<n.length;l+=1)s=Ne(s,n[l]);return e=new je({props:s}),{c(){y(e.$$.fragment)},l(l){M(e.$$.fragment,l)},m(l,a){O(e,l,a),t=!0},p(l,[a]){const r=a&2?Ye(n,[St(l[1])]):{};a&196609&&(r.$$scope={dirty:a,ctx:l}),e.$set(r)},i(l){t||($(e.$$.fragment,l),t=!0)},o(l){k(e.$$.fragment,l),t=!1},d(l){F(e,l)}}}function un(o,e,t){const n=["value"];let s=Re(e,n),{value:l=0}=e;function a(S){oe.call(this,o,S)}function r(S){oe.call(this,o,S)}function f(S){oe.call(this,o,S)}function c(S){oe.call(this,o,S)}function d(S){oe.call(this,o,S)}function g(S){oe.call(this,o,S)}function m(S){oe.call(this,o,S)}function w(S){oe.call(this,o,S)}function v(S){oe.call(this,o,S)}function E(S){oe.call(this,o,S)}function j(S){oe.call(this,o,S)}function G(S){oe.call(this,o,S)}function R(S){oe.call(this,o,S)}function H(){l=It(this.value),t(0,l)}return o.$$set=S=>{e=Ne(Ne({},e),et(S)),t(1,s=Re(e,n)),"value"in S&&t(0,l=S.value)},[l,s,a,r,f,c,d,g,m,w,v,E,j,G,R,H]}class cn extends Ue{constructor(e){super(),Be(this,e,un,fn,Ae,{value:0})}}const pn=async({})=>{const o=Lt(Ht);if(console.log("contestId",o),!o){Rt("/app/contests");return}let e={},t={};const n=await Pe(`/api/contest/${o}`);n.status===200&&(e=await n.json());const s=await Pe("/api/config/fees");return s.status===200&&(t=await s.json()),{contestData:e,fees:t}},vs=Object.freeze(Object.defineProperty({__proto__:null,load:pn},Symbol.toStringTag,{value:"Module"})),rt=o=>{switch(o){case"active":return"Activo";case"finished":return"Finalizado";case"pending":return"Pendiente"}},ft=o=>{switch(o){case"active":return"green";case"finished":return"gray";case"pending":return"blue"}};function it(o,e,t){const n=o.slice();return n[29]=e[t],n}function ut(o){let e,t;return e=new Qt({props:{id:"",name:"userPhoto",class:"mb-2",placeholder:"",$$slots:{default:[mn]},$$scope:{ctx:o}}}),e.$on("change",o[9]),{c(){y(e.$$.fragment)},l(n){M(e.$$.fragment,n)},m(n,s){O(e,n,s),t=!0},p(n,s){const l={};s[0]&16|s[1]&2&&(l.$$scope={dirty:s,ctx:n}),e.$set(l)},i(n){t||($(e.$$.fragment,n),t=!0)},o(n){k(e.$$.fragment,n),t=!1},d(n){F(e,n)}}}function ct(o){let e,t=o[29].title+"",n,s;return{c(){e=V("option"),n=q(t),this.h()},l(l){e=D(l,"OPTION",{});var a=K(e);n=J(a,t),a.forEach(u),this.h()},h(){e.__value=s=o[29].id,ze(e,e.__value)},m(l,a){I(l,e,a),b(e,n)},p(l,a){a[0]&16&&t!==(t=l[29].title+"")&&ve(n,t),a[0]&16&&s!==(s=l[29].id)&&(e.__value=s,ze(e,e.__value))},d(l){l&&u(e)}}}function mn(o){let e,t="Nueva foto",n,s,l=We(o[4]),a=[];for(let r=0;r<l.length;r+=1)a[r]=ct(it(o,l,r));return{c(){e=V("option"),e.textContent=t,n=A();for(let r=0;r<a.length;r+=1)a[r].c();s=Fe(),this.h()},l(r){e=D(r,"OPTION",{"data-svelte-h":!0}),Ce(e)!=="svelte-ujsr34"&&(e.textContent=t),n=L(r);for(let f=0;f<a.length;f+=1)a[f].l(r);s=Fe(),this.h()},h(){e.__value="0",ze(e,e.__value),e.selected=!0},m(r,f){I(r,e,f),I(r,n,f);for(let c=0;c<a.length;c+=1)a[c]&&a[c].m(r,f);I(r,s,f)},p(r,f){if(f[0]&16){l=We(r[4]);let c;for(c=0;c<l.length;c+=1){const d=it(r,l,c);a[c]?a[c].p(d,f):(a[c]=ct(d),a[c].c(),a[c].m(s.parentNode,s))}for(;c<a.length;c+=1)a[c].d(1);a.length=l.length}},d(r){r&&(u(e),u(n),u(s)),Et(a,r)}}}function dn(o){let e;return{c(){e=q("Foto")},l(t){e=J(t,"Foto")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function _n(o){let e,t;return e=new an({props:{id:"dropzone",$$slots:{default:[$n]},$$scope:{ctx:o}}}),e.$on("drop",o[13]),e.$on("dragover",Vn),e.$on("change",o[14]),{c(){y(e.$$.fragment)},l(n){M(e.$$.fragment,n)},m(n,s){O(e,n,s),t=!0},p(n,s){const l={};s[0]&8|s[1]&2&&(l.$$scope={dirty:s,ctx:n}),e.$set(l)},i(n){t||($(e.$$.fragment,n),t=!0)},o(n){k(e.$$.fragment,n),t=!1},d(n){F(e,n)}}}function hn(o){let e,t;return e=new Dt({props:{src:`/api/photo/${o[8]}`,class:"w-full h-auto"}}),{c(){y(e.$$.fragment)},l(n){M(e.$$.fragment,n)},m(n,s){O(e,n,s),t=!0},p(n,s){const l={};s[0]&256&&(l.src=`/api/photo/${n[8]}`),e.$set(l)},i(n){t||($(e.$$.fragment,n),t=!0)},o(n){k(e.$$.fragment,n),t=!1},d(n){F(e,n)}}}function pt(o){let e,t,n,s=o[3].name+"",l;return{c(){e=V("div"),t=A(),n=V("p"),l=q(s),this.h()},l(a){e=D(a,"DIV",{class:!0}),K(e).forEach(u),t=L(a),n=D(a,"P",{class:!0});var r=K(n);l=J(r,s),r.forEach(u),this.h()},h(){U(e,"class","border-t-2 h-1 w-full mt-2"),U(n,"class","mb-2 text-sm text-gray-600 font-semibold")},m(a,r){I(a,e,r),I(a,t,r),I(a,n,r),b(n,l)},p(a,r){r[0]&8&&s!==(s=a[3].name+"")&&ve(l,s)},d(a){a&&(u(e),u(t),u(n))}}}function $n(o){let e,t,n,s='<span class="font-semibold">Pincha para subir una foto</span> o haz drag&amp;drop',l,a,r="SVG, PNG, JPG or GIF",f,c,d;e=new we({props:{icon:vt,class:"text-3xl text-gray-400 mb-2"}});let g=o[3]&&pt(o);return{c(){y(e.$$.fragment),t=A(),n=V("p"),n.innerHTML=s,l=A(),a=V("p"),a.textContent=r,f=A(),g&&g.c(),c=Fe(),this.h()},l(m){M(e.$$.fragment,m),t=L(m),n=D(m,"P",{class:!0,"data-svelte-h":!0}),Ce(n)!=="svelte-1ypyklf"&&(n.innerHTML=s),l=L(m),a=D(m,"P",{class:!0,"data-svelte-h":!0}),Ce(a)!=="svelte-1wyiql4"&&(a.textContent=r),f=L(m),g&&g.l(m),c=Fe(),this.h()},h(){U(n,"class","mb-2 text-sm text-gray-500"),U(a,"class","text-xs text-gray-500")},m(m,w){O(e,m,w),I(m,t,w),I(m,n,w),I(m,l,w),I(m,a,w),I(m,f,w),g&&g.m(m,w),I(m,c,w),d=!0},p(m,w){m[3]?g?g.p(m,w):(g=pt(m),g.c(),g.m(c.parentNode,c)):g&&(g.d(1),g=null)},i(m){d||($(e.$$.fragment,m),d=!0)},o(m){k(e.$$.fragment,m),d=!1},d(m){m&&(u(t),u(n),u(l),u(a),u(f),u(c)),F(e,m),g&&g.d(m)}}}function gn(o){let e;return{c(){e=q("Título")},l(t){e=J(t,"Título")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function bn(o){let e;return{c(){e=q("Precio de venta")},l(t){e=J(t,"Precio de venta")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function vn(o){let e,t="€";return{c(){e=V("span"),e.textContent=t,this.h()},l(n){e=D(n,"SPAN",{slot:!0,class:!0,"data-svelte-h":!0}),Ce(e)!=="svelte-1u0ongp"&&(e.textContent=t),this.h()},h(){U(e,"slot","right"),U(e,"class","text-gray-500")},m(n,s){I(n,e,s)},p:ke,d(n){n&&u(e)}}}function wn(o){let e;return{c(){e=q("Fondos")},l(t){e=J(t,"Fondos")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function kn(o){let e,t="€";return{c(){e=V("span"),e.textContent=t,this.h()},l(n){e=D(n,"SPAN",{slot:!0,class:!0,"data-svelte-h":!0}),Ce(e)!=="svelte-1u0ongp"&&(e.textContent=t),this.h()},h(){U(e,"slot","right"),U(e,"class","text-gray-500")},m(n,s){I(n,e,s)},p:ke,d(n){n&&u(e)}}}function In(o){let e;return{c(){e=q("Tasa inscripción")},l(t){e=J(t,"Tasa inscripción")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function Pn(o){let e,t="€";return{c(){e=V("span"),e.textContent=t,this.h()},l(n){e=D(n,"SPAN",{slot:!0,class:!0,"data-svelte-h":!0}),Ce(e)!=="svelte-1u0ongp"&&(e.textContent=t),this.h()},h(){U(e,"slot","right"),U(e,"class","text-gray-500")},m(n,s){I(n,e,s)},p:ke,d(n){n&&u(e)}}}function En(o){let e,t,n,s;return e=new we({props:{icon:o[1],class:"w-5 h-5 mr-1"}}),{c(){y(e.$$.fragment),t=A(),n=q(o[2])},l(l){M(e.$$.fragment,l),t=L(l),n=J(l,o[2])},m(l,a){O(e,l,a),I(l,t,a),I(l,n,a),s=!0},p(l,a){const r={};a[0]&2&&(r.icon=l[1]),e.$set(r),(!s||a[0]&4)&&ve(n,l[2])},i(l){s||($(e.$$.fragment,l),s=!0)},o(l){k(e.$$.fragment,l),s=!1},d(l){l&&(u(t),u(n)),F(e,l)}}}function Cn(o){let e,t,n,s,l,a,r,f,c,d,g,m,w,v,E,j,G,R,H,S,ee,z,P,_,i,te,ne,ae,ge,re,_e,T,B,se,ie,me,W=o[4].length>0&&ut(o);l=new Oe({props:{for:"dropzone",class:"mb-2",$$slots:{default:[dn]},$$scope:{ctx:o}}});const de=[hn,_n],le=[];function ye(h,N){return h[8]?0:1}r=ye(o),f=le[r]=de[r](o),m=new Oe({props:{for:"title",class:"mb-2",$$slots:{default:[gn]},$$scope:{ctx:o}}});const fe=[{type:"text"},{id:"title"},{name:"title"},{placeholder:"Título"},o[6],{required:!0},{disabled:!!o[8]}];let Se={};for(let h=0;h<fe.length;h+=1)Se=Ne(Se,fe[h]);return v=new je({props:Se}),G=new Oe({props:{for:"salePrice",class:"mb-2",$$slots:{default:[bn]},$$scope:{ctx:o}}}),H=new je({props:{type:"number",id:"salePrice",name:"salePrice",disabled:!o[8],$$slots:{right:[vn]},$$scope:{ctx:o}}}),P=new Oe({props:{for:"funds",class:"mb-2",$$slots:{default:[wn]},$$scope:{ctx:o}}}),i=new je({props:{id:"funds",name:"funds",value:o[5],readonly:!0,disabled:!0,$$slots:{right:[kn]},$$scope:{ctx:o}}}),ae=new Oe({props:{for:"fee",class:"mb-2",$$slots:{default:[In]},$$scope:{ctx:o}}}),re=new je({props:{id:"fee",name:"fee",value:o[7],readonly:!0,color:o[5]<o[7]?"red":void 0,$$slots:{right:[Pn]},$$scope:{ctx:o}}}),B=new Ee({props:{type:"submit",class:"w-52",outline:!0,disabled:o[5]<o[7],$$slots:{default:[En]},$$scope:{ctx:o}}}),{c(){e=V("form"),t=V("div"),n=V("div"),W&&W.c(),s=A(),y(l.$$.fragment),a=A(),f.c(),c=A(),d=V("div"),g=V("div"),y(m.$$.fragment),w=A(),y(v.$$.fragment),E=A(),j=V("div"),y(G.$$.fragment),R=A(),y(H.$$.fragment),S=A(),ee=V("div"),z=V("div"),y(P.$$.fragment),_=A(),y(i.$$.fragment),te=A(),ne=V("div"),y(ae.$$.fragment),ge=A(),y(re.$$.fragment),_e=A(),T=V("div"),y(B.$$.fragment),this.h()},l(h){e=D(h,"FORM",{});var N=K(e);t=D(N,"DIV",{class:!0});var Z=K(t);n=D(Z,"DIV",{});var X=K(n);W&&W.l(X),s=L(X),M(l.$$.fragment,X),a=L(X),f.l(X),X.forEach(u),c=L(Z),d=D(Z,"DIV",{class:!0});var pe=K(d);g=D(pe,"DIV",{});var Y=K(g);M(m.$$.fragment,Y),w=L(Y),M(v.$$.fragment,Y),Y.forEach(u),E=L(pe),j=D(pe,"DIV",{});var Ie=K(j);M(G.$$.fragment,Ie),R=L(Ie),M(H.$$.fragment,Ie),Ie.forEach(u),S=L(pe),ee=D(pe,"DIV",{class:!0});var Q=K(ee);z=D(Q,"DIV",{});var p=K(z);M(P.$$.fragment,p),_=L(p),M(i.$$.fragment,p),p.forEach(u),te=L(Q),ne=D(Q,"DIV",{});var C=K(ne);M(ae.$$.fragment,C),ge=L(C),M(re.$$.fragment,C),C.forEach(u),Q.forEach(u),pe.forEach(u),_e=L(Z),T=D(Z,"DIV",{class:!0});var ue=K(T);M(B.$$.fragment,ue),ue.forEach(u),Z.forEach(u),N.forEach(u),this.h()},h(){U(ee,"class","flex flex-row gap-2"),U(d,"class","flex flex-col gap-2"),U(T,"class","flex justify-end col-span-2"),U(t,"class","grid gap-4 mb-4 grid-cols-1 sm:grid-cols-2")},m(h,N){I(h,e,N),b(e,t),b(t,n),W&&W.m(n,null),b(n,s),O(l,n,null),b(n,a),le[r].m(n,null),b(t,c),b(t,d),b(d,g),O(m,g,null),b(g,w),O(v,g,null),b(d,E),b(d,j),O(G,j,null),b(j,R),O(H,j,null),b(d,S),b(d,ee),b(ee,z),O(P,z,null),b(z,_),O(i,z,null),b(ee,te),b(ee,ne),O(ae,ne,null),b(ne,ge),O(re,ne,null),b(t,_e),b(t,T),O(B,T,null),se=!0,ie||(me=x(e,"submit",Ut(o[10])),ie=!0)},p(h,N){h[4].length>0?W?(W.p(h,N),N[0]&16&&$(W,1)):(W=ut(h),W.c(),$(W,1),W.m(n,s)):W&&(De(),k(W,1,1,()=>{W=null}),Te());const Z={};N[1]&2&&(Z.$$scope={dirty:N,ctx:h}),l.$set(Z);let X=r;r=ye(h),r===X?le[r].p(h,N):(De(),k(le[X],1,1,()=>{le[X]=null}),Te(),f=le[r],f?f.p(h,N):(f=le[r]=de[r](h),f.c()),$(f,1),f.m(n,null));const pe={};N[1]&2&&(pe.$$scope={dirty:N,ctx:h}),m.$set(pe);const Y=N[0]&320?Ye(fe,[fe[0],fe[1],fe[2],fe[3],N[0]&64&&St(h[6]),fe[5],N[0]&256&&{disabled:!!h[8]}]):{};v.$set(Y);const Ie={};N[1]&2&&(Ie.$$scope={dirty:N,ctx:h}),G.$set(Ie);const Q={};N[0]&256&&(Q.disabled=!h[8]),N[1]&2&&(Q.$$scope={dirty:N,ctx:h}),H.$set(Q);const p={};N[1]&2&&(p.$$scope={dirty:N,ctx:h}),P.$set(p);const C={};N[0]&32&&(C.value=h[5]),N[1]&2&&(C.$$scope={dirty:N,ctx:h}),i.$set(C);const ue={};N[1]&2&&(ue.$$scope={dirty:N,ctx:h}),ae.$set(ue);const he={};N[0]&128&&(he.value=h[7]),N[0]&160&&(he.color=h[5]<h[7]?"red":void 0),N[1]&2&&(he.$$scope={dirty:N,ctx:h}),re.$set(he);const $e={};N[0]&160&&($e.disabled=h[5]<h[7]),N[0]&6|N[1]&2&&($e.$$scope={dirty:N,ctx:h}),B.$set($e)},i(h){se||($(W),$(l.$$.fragment,h),$(f),$(m.$$.fragment,h),$(v.$$.fragment,h),$(G.$$.fragment,h),$(H.$$.fragment,h),$(P.$$.fragment,h),$(i.$$.fragment,h),$(ae.$$.fragment,h),$(re.$$.fragment,h),$(B.$$.fragment,h),se=!0)},o(h){k(W),k(l.$$.fragment,h),k(f),k(m.$$.fragment,h),k(v.$$.fragment,h),k(G.$$.fragment,h),k(H.$$.fragment,h),k(P.$$.fragment,h),k(i.$$.fragment,h),k(ae.$$.fragment,h),k(re.$$.fragment,h),k(B.$$.fragment,h),se=!1},d(h){h&&u(e),W&&W.d(),F(l),le[r].d(),F(m),F(v),F(G),F(H),F(P),F(i),F(ae),F(re),F(B),ie=!1,me()}}}function Sn(o){let e,t,n;function s(a){o[17](a)}let l={title:"Subir foto",class:"min-w-full",$$slots:{default:[Cn]},$$scope:{ctx:o}};return o[0]!==void 0&&(l.open=o[0]),e=new bt({props:l}),Le.push(()=>Xe(e,"open",s)),e.$on("close",o[11]),{c(){y(e.$$.fragment)},l(a){M(e.$$.fragment,a)},m(a,r){O(e,a,r),n=!0},p(a,r){const f={};r[0]&510|r[1]&2&&(f.$$scope={dirty:r,ctx:a}),!t&&r[0]&1&&(t=!0,f.open=a[0],Je(()=>t=!1)),e.$set(f)},i(a){n||($(e.$$.fragment,a),n=!0)},o(a){k(e.$$.fragment,a),n=!1},d(a){F(e,a)}}}const Vn=o=>{o.preventDefault()};function Dn(o,e,t){let n,s,l,a,r;Me(o,Wt,T=>t(21,a=T)),Me(o,Ct,T=>t(22,r=T));const f=Pt(),c=async()=>{const T=await Pe(`/api/account/${r}`);if(T.status===200){const B=await T.json();t(5,ne=B.funds);const se=B.photos;t(4,te=se.filter(ie=>!ie.currentContestId&&ie.account.toLowerCase()===a))}},d=()=>{z.set(""),t(3,i=null),t(1,S=lt),t(2,ee="Preparar foto"),t(7,s=H==null?void 0:H.CONTEST_NEW_PHOTO),n=null,t(6,ae={})},g=(T,B="Enviar foto y firma")=>{z.set(T),t(1,S=Nt),t(2,ee=B)},m=T=>{const B=parseInt(T.target.value);if(!B)d();else{const se=te.find(ie=>ie.id===B);se?(t(7,s=H==null?void 0:H.CONTEST),n=se,t(6,ae={value:se.title,readonly:!0}),g(se.photoKey,"Enviar foto")):d()}},w=async T=>{const B=new FormData(T),ie={salePrice:Number(B.get("salePrice")),photoKey:l};if(!n){const W=await tn(P,_);if(!W){qe("No se ha podido firmar el mensaje");return}ie.signedMessage={...P,signature:W}}const me=await Pe(`/api/contest/${R}/addphoto`,{method:"POST",payload:ie});if(me.status===200){d();const W=await me.json();f("close",{}),f("created",W),c()}},v=async T=>{const B=new FormData,ie=new FormData(T).get("title");if(!n){const de=i;if(!de){qe("No se ha incluido la foto");return}B.append("photo",de)}B.append("title",ie);const me=n?`/api/photo/prepare/${n.id}`:"/api/photo/prepare",W=await Pe(me,{method:"POST",body:B});if(W.status===200){const de=await W.json();P=de.messageToSign,_=de.domain,g(de.photoKey),setTimeout(()=>{const le=document.getElementById("salePrice");le==null||le.focus()},50)}},E=async T=>{T.preventDefault();const B=T.target;l?await w(B):await v(B)},j=async()=>{l&&await Pe(`/api/photo/${l}`,{method:"DELETE"}),f("close",{})};let{openModal:G=!1}=e,{contestId:R=null}=e,{fees:H}=e,S=lt,ee="Preparar foto";const z=Vt("");Me(o,z,T=>t(8,l=T));let P,_,i=null,te=[],ne=0,ae={};c();const ge=T=>{var se;T.preventDefault();const B=(se=T.dataTransfer)==null?void 0:se.files;B!=null&&B.length&&t(3,i=B[0])},re=T=>{var se;T.preventDefault();const B=(se=T.target)==null?void 0:se.files;B!=null&&B.length&&t(3,i=B[0])};function _e(T){G=T,t(0,G)}return o.$$set=T=>{"openModal"in T&&t(0,G=T.openModal),"contestId"in T&&t(15,R=T.contestId),"fees"in T&&t(16,H=T.fees)},o.$$.update=()=>{o.$$.dirty[0]&65536&&t(7,s=(H==null?void 0:H.CONTEST_NEW_PHOTO)||0)},n=null,[G,S,ee,i,te,ne,ae,s,l,m,E,j,z,ge,re,R,H,_e]}class Tn extends Ue{constructor(e){super(),Be(this,e,Dn,Sn,Ae,{openModal:0,contestId:15,fees:16},null,[-1,-1])}}function Nn(o){let e;return{c(){e=q("Votos:")},l(t){e=J(t,"Votos:")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function yn(o){let e,t,n="5",s;return e=new we({props:{icon:wt,size:"md"}}),{c(){y(e.$$.fragment),t=V("span"),t.textContent=n,this.h()},l(l){M(e.$$.fragment,l),t=D(l,"SPAN",{class:!0,"data-svelte-h":!0}),Ce(t)!=="svelte-31v3j7"&&(t.textContent=n),this.h()},h(){U(t,"class","text-md")},m(l,a){O(e,l,a),I(l,t,a),s=!0},p:ke,i(l){s||($(e.$$.fragment,l),s=!0)},o(l){k(e.$$.fragment,l),s=!1},d(l){l&&u(t),F(e,l)}}}function Mn(o){let e,t,n,s;return e=new we({props:{icon:yt,size:"md"}}),{c(){y(e.$$.fragment),t=A(),n=V("div"),this.h()},l(l){M(e.$$.fragment,l),t=L(l),n=D(l,"DIV",{class:!0}),K(n).forEach(u),this.h()},h(){U(n,"class","h-4")},m(l,a){O(e,l,a),I(l,t,a),I(l,n,a),s=!0},p:ke,i(l){s||($(e.$$.fragment,l),s=!0)},o(l){k(e.$$.fragment,l),s=!1},d(l){l&&(u(t),u(n)),F(e,l)}}}function mt(o){let e,t,n,s,l,a;function r(c){o[16](c)}let f={color:"primary","aria-describedby":"helper-wantbuy",$$slots:{default:[On]},$$scope:{ctx:o}};return o[3]!==void 0&&(f.checked=o[3]),t=new sn({props:f}),Le.push(()=>Xe(t,"checked",r)),l=new Tt({props:{id:"helper-wantbuy",class:"ps-6",$$slots:{default:[Fn]},$$scope:{ctx:o}}}),{c(){e=V("div"),y(t.$$.fragment),s=A(),y(l.$$.fragment),this.h()},l(c){e=D(c,"DIV",{class:!0});var d=K(e);M(t.$$.fragment,d),s=L(d),M(l.$$.fragment,d),d.forEach(u),this.h()},h(){U(e,"class","sm:col-span-2")},m(c,d){I(c,e,d),O(t,e,null),b(e,s),O(l,e,null),a=!0},p(c,d){const g={};d&4194304&&(g.$$scope={dirty:d,ctx:c}),!n&&d&8&&(n=!0,g.checked=c[3],Je(()=>n=!1)),t.$set(g);const m={};d&4194304&&(m.$$scope={dirty:d,ctx:c}),l.$set(m)},i(c){a||($(t.$$.fragment,c),$(l.$$.fragment,c),a=!0)},o(c){k(t.$$.fragment,c),k(l.$$.fragment,c),a=!1},d(c){c&&u(e),F(t),F(l)}}}function On(o){let e;return{c(){e=q("Deseo comprar la foto")},l(t){e=J(t,"Deseo comprar la foto")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function Fn(o){let e;return{c(){e=q("Se sortea entre los votantes interesados el derecho a compra")},l(t){e=J(t,"Se sortea entre los votantes interesados el derecho a compra")},m(t,n){I(t,e,n)},d(t){t&&u(e)}}}function jn(o){var n;let e=((n=o[2])==null?void 0:n.remainingVotes)+"",t;return{c(){t=q(e)},l(s){t=J(s,e)},m(s,l){I(s,t,l)},p(s,l){var a;l&4&&e!==(e=((a=s[2])==null?void 0:a.remainingVotes)+"")&&ve(t,e)},d(s){s&&u(t)}}}function zn(o){let e,t,n;return t=new nn({props:{color:"primary",class:"text-sm",$$slots:{default:[jn]},$$scope:{ctx:o}}}),{c(){e=q("Votos disponibles: "),y(t.$$.fragment)},l(s){e=J(s,"Votos disponibles: "),M(t.$$.fragment,s)},m(s,l){I(s,e,l),O(t,s,l),n=!0},p(s,l){const a={};l&4194308&&(a.$$scope={dirty:l,ctx:s}),t.$set(a)},i(s){n||($(t.$$.fragment,s),n=!0)},o(s){k(t.$$.fragment,s),n=!1},d(s){s&&u(e),F(t,s)}}}function An(o){let e,t,n;return e=new we({props:{icon:Mt,class:"text-md mr-1"}}),{c(){y(e.$$.fragment),t=q(`
					Votar`)},l(s){M(e.$$.fragment,s),t=J(s,`
					Votar`)},m(s,l){O(e,s,l),I(s,t,l),n=!0},i(s){n||($(e.$$.fragment,s),n=!0)},o(s){k(e.$$.fragment,s),n=!1},d(s){s&&u(t),F(e,s)}}}function Ln(o){let e,t,n;return e=new xt({props:{class:"me-3",size:"4",color:"white"}}),{c(){y(e.$$.fragment),t=q(`
					Votación en curso...`)},l(s){M(e.$$.fragment,s),t=J(s,`
					Votación en curso...`)},m(s,l){O(e,s,l),I(s,t,l),n=!0},i(s){n||($(e.$$.fragment,s),n=!0)},o(s){k(e.$$.fragment,s),n=!1},d(s){s&&u(t),F(e,s)}}}function Un(o){let e,t,n,s;const l=[Ln,An],a=[];function r(f,c){return f[4]?0:1}return e=r(o),t=a[e]=l[e](o),{c(){t.c(),n=Fe()},l(f){t.l(f),n=Fe()},m(f,c){a[e].m(f,c),I(f,n,c),s=!0},p(f,c){let d=e;e=r(f),e!==d&&(De(),k(a[d],1,1,()=>{a[d]=null}),Te(),t=a[e],t||(t=a[e]=l[e](f),t.c()),$(t,1),t.m(n.parentNode,n))},i(f){s||($(t),s=!0)},o(f){k(t),s=!1},d(f){f&&u(n),a[e].d(f)}}}function Bn(o){let e,t,n,s,l,a,r,f,c,d,g,m,w,v,E,j,G,R,H;t=new Dt({props:{class:"h-56 w-auto rounded m-auto",src:o[5]}}),l=new Oe({props:{for:"votes",class:"mb-2 w-full text-right",$$slots:{default:[Nn]},$$scope:{ctx:o}}});function S(P){o[13](P)}let ee={id:"votes",required:!0,class:"w-full",min:"1"};o[1]!==void 0&&(ee.value=o[1]),r=new cn({props:ee}),Le.push(()=>Xe(r,"value",S)),d=new Ee({props:{type:"button",outline:!0,color:"light",size:"xs",$$slots:{default:[yn]},$$scope:{ctx:o}}}),d.$on("click",o[14]),m=new Ee({props:{type:"button",outline:!0,color:"light",size:"xs",$$slots:{default:[Mn]},$$scope:{ctx:o}}}),m.$on("click",o[15]);let z=!o[7]&&mt(o);return E=new Tt({props:{class:"text-sm self-center",$$slots:{default:[zn]},$$scope:{ctx:o}}}),R=new Ee({props:{type:"button",disabled:!o[6],$$slots:{default:[Un]},$$scope:{ctx:o}}}),R.$on("click",o[9]),{c(){e=V("div"),y(t.$$.fragment),n=A(),s=V("div"),y(l.$$.fragment),a=A(),y(r.$$.fragment),c=A(),y(d.$$.fragment),g=A(),y(m.$$.fragment),w=A(),z&&z.c(),v=A(),y(E.$$.fragment),j=A(),G=V("div"),y(R.$$.fragment),this.h()},l(P){e=D(P,"DIV",{class:!0});var _=K(e);M(t.$$.fragment,_),n=L(_),s=D(_,"DIV",{class:!0});var i=K(s);M(l.$$.fragment,i),a=L(i),M(r.$$.fragment,i),c=L(i),M(d.$$.fragment,i),g=L(i),M(m.$$.fragment,i),i.forEach(u),w=L(_),z&&z.l(_),v=L(_),M(E.$$.fragment,_),j=L(_),G=D(_,"DIV",{class:!0});var te=K(G);M(R.$$.fragment,te),te.forEach(u),_.forEach(u),this.h()},h(){U(s,"class","flex flex-row items-baseline gap-2 w-52 self-center"),U(G,"class","flex justify-center col-span-2 mt-2"),U(e,"class","flex flex-col gap-2")},m(P,_){I(P,e,_),O(t,e,null),b(e,n),b(e,s),O(l,s,null),b(s,a),O(r,s,null),b(s,c),O(d,s,null),b(s,g),O(m,s,null),b(e,w),z&&z.m(e,null),b(e,v),O(E,e,null),b(e,j),b(e,G),O(R,G,null),H=!0},p(P,_){const i={};_&32&&(i.src=P[5]),t.$set(i);const te={};_&4194304&&(te.$$scope={dirty:_,ctx:P}),l.$set(te);const ne={};!f&&_&2&&(f=!0,ne.value=P[1],Je(()=>f=!1)),r.$set(ne);const ae={};_&4194304&&(ae.$$scope={dirty:_,ctx:P}),d.$set(ae);const ge={};_&4194304&&(ge.$$scope={dirty:_,ctx:P}),m.$set(ge),P[7]?z&&(De(),k(z,1,1,()=>{z=null}),Te()):z?(z.p(P,_),_&128&&$(z,1)):(z=mt(P),z.c(),$(z,1),z.m(e,v));const re={};_&4194308&&(re.$$scope={dirty:_,ctx:P}),E.$set(re);const _e={};_&64&&(_e.disabled=!P[6]),_&4194320&&(_e.$$scope={dirty:_,ctx:P}),R.$set(_e)},i(P){H||($(t.$$.fragment,P),$(l.$$.fragment,P),$(r.$$.fragment,P),$(d.$$.fragment,P),$(m.$$.fragment,P),$(z),$(E.$$.fragment,P),$(R.$$.fragment,P),H=!0)},o(P){k(t.$$.fragment,P),k(l.$$.fragment,P),k(r.$$.fragment,P),k(d.$$.fragment,P),k(m.$$.fragment,P),k(z),k(E.$$.fragment,P),k(R.$$.fragment,P),H=!1},d(P){P&&u(e),F(t),F(l),F(r),F(d),F(m),z&&z.d(),F(E),F(R)}}}function Kn(o){let e,t,n;function s(a){o[17](a)}let l={title:"Votar por foto",class:"w-96",dismissable:!0,placement:"bottom-center",$$slots:{default:[Bn]},$$scope:{ctx:o}};return o[0]!==void 0&&(l.open=o[0]),e=new bt({props:l}),Le.push(()=>Xe(e,"open",s)),e.$on("close",o[10]),{c(){y(e.$$.fragment)},l(a){M(e.$$.fragment,a)},m(a,r){O(e,a,r),n=!0},p(a,[r]){const f={};r&4194558&&(f.$$scope={dirty:r,ctx:a}),!t&&r&1&&(t=!0,f.open=a[0],Je(()=>t=!1)),e.$set(f)},i(a){n||($(e.$$.fragment,a),n=!0)},o(a){k(e.$$.fragment,a),n=!1},d(a){F(e,a)}}}function Hn(o,e,t){let n,s,l,a,r,f,c;Me(o,Ct,i=>t(19,c=i));const d=Pt(),g=Vt();Me(o,g,i=>t(2,f=i)),Bt(async()=>{const i=await Pe(`/api/account/${c}`);i.status===200&&(console.log("Refresh contest data..."),g.set(await i.json()))});let{openModal:w=!1}=e,{contestId:v}=e,{selectedPhoto:E}=e,j=1,G=!1;const R=async()=>{if(n)return;if(j<=0){qe("Debe ingresar una cantidad de votos válida");return}if(j>(f==null?void 0:f.remainingVotes)){qe("No tienes suficientes votos para realizar esta acción");return}t(4,n=!0);const i=await Pe(`/api/contest/${v}/vote`,{method:"POST",payload:{contestPhotoId:r,wantBuy:G,votes:j}});if(i.status===200){const te=await i.json();d("voted",{contestPhotoId:te.contestPhotoId,votes:te.votes}),Kt(g,f.remainingVotes=te.remainingVotes,f),t(0,w=!1)}t(4,n=!1)},H=()=>{t(0,w=!1),d("close")};function S(i){j=i,t(1,j)}const ee=()=>{t(1,j+=5)},z=()=>{t(1,j=1)};function P(i){G=i,t(3,G)}function _(i){w=i,t(0,w)}return o.$$set=i=>{"openModal"in i&&t(0,w=i.openModal),"contestId"in i&&t(11,v=i.contestId),"selectedPhoto"in i&&t(12,E=i.selectedPhoto)},o.$$.update=()=>{var i;o.$$.dirty&4100&&t(7,s=(i=f==null?void 0:f.photos)==null?void 0:i.some(te=>te.photoKey===(E==null?void 0:E.photoKey))),o.$$.dirty&6&&t(6,l=(f==null?void 0:f.remainingVotes)>j),o.$$.dirty&4096&&t(5,a=`/api/photo/${E==null?void 0:E.photoKey}`),o.$$.dirty&4096&&(r=E==null?void 0:E.contestPhotoId)},t(4,n=!1),[w,j,f,G,n,a,l,s,g,R,H,v,E,S,ee,z,P,_]}class Gn extends Ue{constructor(e){super(),Be(this,e,Hn,Kn,Ae,{openModal:0,contestId:11,selectedPhoto:12})}}function dt(o,e,t){const n=o.slice();return n[22]=e[t],n}function _t(o){let e,t,n,s;return e=new Ee({props:{outline:!0,size:"xs",color:"primary",$$slots:{default:[Rn]},$$scope:{ctx:o}}}),e.$on("click",o[11]),n=new Ee({props:{outline:!0,size:"xs",color:"primary",$$slots:{default:[Wn]},$$scope:{ctx:o}}}),n.$on("click",o[17]),{c(){y(e.$$.fragment),t=A(),y(n.$$.fragment)},l(l){M(e.$$.fragment,l),t=L(l),M(n.$$.fragment,l)},m(l,a){O(e,l,a),I(l,t,a),O(n,l,a),s=!0},p(l,a){const r={};a&33554432&&(r.$$scope={dirty:a,ctx:l}),e.$set(r);const f={};a&33554432&&(f.$$scope={dirty:a,ctx:l}),n.$set(f)},i(l){s||($(e.$$.fragment,l),$(n.$$.fragment,l),s=!0)},o(l){k(e.$$.fragment,l),k(n.$$.fragment,l),s=!1},d(l){l&&u(t),F(e,l),F(n,l)}}}function Rn(o){let e,t,n;return e=new we({props:{icon:Xt,class:"w-5 h-5 mr-1"}}),{c(){y(e.$$.fragment),t=q(`
				Iniciar ahora`)},l(s){M(e.$$.fragment,s),t=J(s,`
				Iniciar ahora`)},m(s,l){O(e,s,l),I(s,t,l),n=!0},p:ke,i(s){n||($(e.$$.fragment,s),n=!0)},o(s){k(e.$$.fragment,s),n=!1},d(s){s&&u(t),F(e,s)}}}function Wn(o){let e,t,n;return e=new we({props:{icon:Yt,class:"w-5 h-5 mr-1"}}),{c(){y(e.$$.fragment),t=q(`
				Modificar`)},l(s){M(e.$$.fragment,s),t=J(s,`
				Modificar`)},m(s,l){O(e,s,l),I(s,t,l),n=!0},p:ke,i(s){n||($(e.$$.fragment,s),n=!0)},o(s){k(e.$$.fragment,s),n=!1},d(s){s&&u(t),F(e,s)}}}function ht(o){let e,t;return e=new Ee({props:{outline:!0,size:"xs",class:"button-secondary",$$slots:{default:[qn]},$$scope:{ctx:o}}}),e.$on("click",o[10]),{c(){y(e.$$.fragment)},l(n){M(e.$$.fragment,n)},m(n,s){O(e,n,s),t=!0},p(n,s){const l={};s&33554432&&(l.$$scope={dirty:s,ctx:n}),e.$set(l)},i(n){t||($(e.$$.fragment,n),t=!0)},o(n){k(e.$$.fragment,n),t=!1},d(n){F(e,n)}}}function qn(o){let e,t,n;return e=new we({props:{icon:wt,class:"w-5 h-5 mr-1"}}),{c(){y(e.$$.fragment),t=q(`
					Nueva foto`)},l(s){M(e.$$.fragment,s),t=J(s,`
					Nueva foto`)},m(s,l){O(e,s,l),I(s,t,l),n=!0},p:ke,i(s){n||($(e.$$.fragment,s),n=!0)},o(s){k(e.$$.fragment,s),n=!1},d(s){s&&u(t),F(e,s)}}}function Jn(o){let e,t=" ";return{c(){e=V("p"),e.textContent=t,this.h()},l(n){e=D(n,"P",{class:!0,"data-svelte-h":!0}),Ce(e)!=="svelte-187adop"&&(e.textContent=t),this.h()},h(){U(e,"class","text-sm")},m(n,s){I(n,e,s)},p:ke,d(n){n&&u(e)}}}function Xn(o){let e,t,n,s=o[22].price+"",l,a;return{c(){e=V("p"),t=q("Precio de venta: "),n=V("strong"),l=q(s),a=q(" €"),this.h()},l(r){e=D(r,"P",{class:!0});var f=K(e);t=J(f,"Precio de venta: "),n=D(f,"STRONG",{});var c=K(n);l=J(c,s),a=J(c," €"),c.forEach(u),f.forEach(u),this.h()},h(){U(e,"class","text-sm")},m(r,f){I(r,e,f),b(e,t),b(e,n),b(n,l),b(n,a)},p(r,f){f&32&&s!==(s=r[22].price+"")&&ve(l,s)},d(r){r&&u(e)}}}function Yn(o){let e,t,n;return e=new we({props:{icon:Zt,class:"w-5 h-5 mr-1"}}),{c(){y(e.$$.fragment),t=q(" Vota")},l(s){M(e.$$.fragment,s),t=J(s," Vota")},m(s,l){O(e,s,l),I(s,t,l),n=!0},p:ke,i(s){n||($(e.$$.fragment,s),n=!0)},o(s){k(e.$$.fragment,s),n=!1},d(s){s&&u(t),F(e,s)}}}function Zn(o){let e,t=o[22].title+"",n,s,l,a,r,f,c;function d(v,E){return v[22].price?Xn:Jn}let g=d(o),m=g(o);function w(...v){return o[19](o[22],...v)}return r=new Ee({props:{color:"light",size:"xs",$$slots:{default:[Yn]},$$scope:{ctx:o}}}),r.$on("click",w),{c(){e=V("h5"),n=q(t),s=A(),m.c(),l=A(),a=V("div"),y(r.$$.fragment),f=A(),this.h()},l(v){e=D(v,"H5",{class:!0});var E=K(e);n=J(E,t),E.forEach(u),s=L(v),m.l(v),l=L(v),a=D(v,"DIV",{class:!0});var j=K(a);M(r.$$.fragment,j),j.forEach(u),f=L(v),this.h()},h(){U(e,"class","mb-2 text-lg font-semibold tracking-tight"),U(a,"class","flex justify-end mt-2 svelte-ml98y4")},m(v,E){I(v,e,E),b(e,n),I(v,s,E),m.m(v,E),I(v,l,E),I(v,a,E),O(r,a,null),I(v,f,E),c=!0},p(v,E){o=v,(!c||E&32)&&t!==(t=o[22].title+"")&&ve(n,t),g===(g=d(o))&&m?m.p(o,E):(m.d(1),m=g(o),m&&(m.c(),m.m(l.parentNode,l)));const j={};E&33554432&&(j.$$scope={dirty:E,ctx:o}),r.$set(j)},i(v){c||($(r.$$.fragment,v),c=!0)},o(v){k(r.$$.fragment,v),c=!1},d(v){v&&(u(e),u(s),u(l),u(a),u(f)),m.d(v),F(r)}}}function $t(o){let e,t;return e=new en({props:{imgSrc:"/api/photo/"+o[22].photoKey,badgeContent:o[22].ownVotes??null,$$slots:{default:[Zn]},$$scope:{ctx:o}}}),{c(){y(e.$$.fragment)},l(n){M(e.$$.fragment,n)},m(n,s){O(e,n,s),t=!0},p(n,s){const l={};s&32&&(l.imgSrc="/api/photo/"+n[22].photoKey),s&32&&(l.badgeContent=n[22].ownVotes??null),s&33554464&&(l.$$scope={dirty:s,ctx:n}),e.$set(l)},i(n){t||($(e.$$.fragment,n),t=!0)},o(n){k(e.$$.fragment,n),t=!1},d(n){F(e,n)}}}function gt(o){let e,t,n="No hay fotos en este concurso, añade la primera",s,l,a;return l=new Ee({props:{type:"button",color:"light",class:"button-secondary",$$slots:{default:[Qn]},$$scope:{ctx:o}}}),l.$on("click",o[10]),{c(){e=V("div"),t=V("span"),t.textContent=n,s=A(),y(l.$$.fragment),this.h()},l(r){e=D(r,"DIV",{class:!0});var f=K(e);t=D(f,"SPAN",{class:!0,"data-svelte-h":!0}),Ce(t)!=="svelte-1dag9rs"&&(t.textContent=n),s=L(f),M(l.$$.fragment,f),f.forEach(u),this.h()},h(){U(t,"class","text-gray-400 mb-3 mt-10"),U(e,"class","flex flex-col items-center w-full h-full")},m(r,f){I(r,e,f),b(e,t),b(e,s),O(l,e,null),a=!0},p(r,f){const c={};f&33554432&&(c.$$scope={dirty:f,ctx:r}),l.$set(c)},i(r){a||($(l.$$.fragment,r),a=!0)},o(r){k(l.$$.fragment,r),a=!1},d(r){r&&u(e),F(l)}}}function Qn(o){let e,t,n;return e=new we({props:{icon:vt,class:"text-xl mr-2"}}),{c(){y(e.$$.fragment),t=q(`    
			Subir foto`)},l(s){M(e.$$.fragment,s),t=J(s,`    
			Subir foto`)},m(s,l){O(e,s,l),I(s,t,l),n=!0},p:ke,i(s){n||($(e.$$.fragment,s),n=!0)},o(s){k(e.$$.fragment,s),n=!1},d(s){s&&u(t),F(e,s)}}}function xn(o){let e,t,n,s,l=o[1].title+"",a,r,f,c,d,g,m,w=o[1].description+"",v,E,j,G,R,H,S,ee=rt(o[1].status)+"",z,P,_,i,te,ne=Ke.fromISO(o[1].initTimestamp).toLocaleString(He)+"",ae,ge,re,_e,T,B=Ke.fromISO(o[1].endTimestamp).toLocaleString(He)+"",se,ie,me,W,de,le,ye,fe,Se,h,N,Z=o[8]&&o[1].status==="pending"&&_t(o),X=o[1].status!=="finished"&&ht(o);R=new we({props:{icon:Ot,class:"w-5 h-5 mt-1 text-"+ft(o[1].status)+"-600"}});let pe=We(o[5]),Y=[];for(let p=0;p<pe.length;p+=1)Y[p]=$t(dt(o,pe,p));const Ie=p=>k(Y[p],1,1,()=>{Y[p]=null});let Q=o[5].length===0&&gt(o);return le=new Tn({props:{contestId:o[7],fees:o[0].fees,openModal:o[6]}}),le.$on("created",o[12]),le.$on("close",o[13]),fe=new Gn({props:{contestId:o[7],selectedPhoto:o[4],openModal:o[3]}}),fe.$on("voted",o[15]),fe.$on("close",o[20]),h=new Gt({props:{contestData:o[1],openModal:o[2]}}),h.$on("updated",o[9]),h.$on("close",o[14]),{c(){e=V("div"),t=V("div"),n=V("h1"),s=q("Concurso: "),a=q(l),r=A(),f=V("div"),Z&&Z.c(),c=A(),X&&X.c(),d=A(),g=V("div"),m=V("pre"),v=q(w),E=A(),j=V("span"),G=q(`Estado: 
			`),y(R.$$.fragment),H=A(),S=V("strong"),z=q(ee),P=A(),_=V("span"),i=q("Fecha de inicio: "),te=V("strong"),ae=q(ne),ge=A(),re=V("span"),_e=q("Fecha de fin: "),T=V("strong"),se=q(B),ie=A(),me=V("div");for(let p=0;p<Y.length;p+=1)Y[p].c();W=A(),Q&&Q.c(),de=A(),y(le.$$.fragment),ye=A(),y(fe.$$.fragment),Se=A(),y(h.$$.fragment),this.h()},l(p){e=D(p,"DIV",{class:!0});var C=K(e);t=D(C,"DIV",{class:!0});var ue=K(t);n=D(ue,"H1",{class:!0});var he=K(n);s=J(he,"Concurso: "),a=J(he,l),he.forEach(u),r=L(ue),f=D(ue,"DIV",{class:!0});var $e=K(f);Z&&Z.l($e),c=L($e),X&&X.l($e),$e.forEach(u),ue.forEach(u),d=L(C),g=D(C,"DIV",{class:!0});var be=K(g);m=D(be,"PRE",{class:!0});var ce=K(m);v=J(ce,w),ce.forEach(u),E=L(be),j=D(be,"SPAN",{class:!0});var Ve=K(j);G=J(Ve,`Estado: 
			`),M(R.$$.fragment,Ve),H=L(Ve),S=D(Ve,"STRONG",{class:!0});var tt=K(S);z=J(tt,ee),tt.forEach(u),Ve.forEach(u),P=L(be),_=D(be,"SPAN",{class:!0});var Ze=K(_);i=J(Ze,"Fecha de inicio: "),te=D(Ze,"STRONG",{});var nt=K(te);ae=J(nt,ne),nt.forEach(u),Ze.forEach(u),ge=L(be),re=D(be,"SPAN",{class:!0});var Qe=K(re);_e=J(Qe,"Fecha de fin: "),T=D(Qe,"STRONG",{});var st=K(T);se=J(st,B),st.forEach(u),Qe.forEach(u),be.forEach(u),C.forEach(u),ie=L(p),me=D(p,"DIV",{class:!0});var ot=K(me);for(let xe=0;xe<Y.length;xe+=1)Y[xe].l(ot);ot.forEach(u),W=L(p),Q&&Q.l(p),de=L(p),M(le.$$.fragment,p),ye=L(p),M(fe.$$.fragment,p),Se=L(p),M(h.$$.fragment,p),this.h()},h(){U(n,"class","text-xl font-semibold"),U(f,"class","flex flex-row gap-2 justify-end"),U(t,"class","flex flex-row gap-2 justify-between"),U(m,"class","text-xs font-sans"),U(S,"class",""),U(j,"class","text-sm flex"),U(_,"class","text-sm"),U(re,"class","text-sm"),U(g,"class","flex flex-col gap-2"),U(e,"class","flex flex-col gap-2 shadow-md rounded-sm p-2 bg-surface-200"),U(me,"class","flex flex-row gap-2 flex-wrap photos mt-3 svelte-ml98y4")},m(p,C){I(p,e,C),b(e,t),b(t,n),b(n,s),b(n,a),b(t,r),b(t,f),Z&&Z.m(f,null),b(f,c),X&&X.m(f,null),b(e,d),b(e,g),b(g,m),b(m,v),b(g,E),b(g,j),b(j,G),O(R,j,null),b(j,H),b(j,S),b(S,z),b(g,P),b(g,_),b(_,i),b(_,te),b(te,ae),b(g,ge),b(g,re),b(re,_e),b(re,T),b(T,se),I(p,ie,C),I(p,me,C);for(let ue=0;ue<Y.length;ue+=1)Y[ue]&&Y[ue].m(me,null);I(p,W,C),Q&&Q.m(p,C),I(p,de,C),O(le,p,C),I(p,ye,C),O(fe,p,C),I(p,Se,C),O(h,p,C),N=!0},p(p,[C]){(!N||C&2)&&l!==(l=p[1].title+"")&&ve(a,l),p[8]&&p[1].status==="pending"?Z?(Z.p(p,C),C&258&&$(Z,1)):(Z=_t(p),Z.c(),$(Z,1),Z.m(f,c)):Z&&(De(),k(Z,1,1,()=>{Z=null}),Te()),p[1].status!=="finished"?X?(X.p(p,C),C&2&&$(X,1)):(X=ht(p),X.c(),$(X,1),X.m(f,null)):X&&(De(),k(X,1,1,()=>{X=null}),Te()),(!N||C&2)&&w!==(w=p[1].description+"")&&ve(v,w);const ue={};if(C&2&&(ue.class="w-5 h-5 mt-1 text-"+ft(p[1].status)+"-600"),R.$set(ue),(!N||C&2)&&ee!==(ee=rt(p[1].status)+"")&&ve(z,ee),(!N||C&2)&&ne!==(ne=Ke.fromISO(p[1].initTimestamp).toLocaleString(He)+"")&&ve(ae,ne),(!N||C&2)&&B!==(B=Ke.fromISO(p[1].endTimestamp).toLocaleString(He)+"")&&ve(se,B),C&65568){pe=We(p[5]);let ce;for(ce=0;ce<pe.length;ce+=1){const Ve=dt(p,pe,ce);Y[ce]?(Y[ce].p(Ve,C),$(Y[ce],1)):(Y[ce]=$t(Ve),Y[ce].c(),$(Y[ce],1),Y[ce].m(me,null))}for(De(),ce=pe.length;ce<Y.length;ce+=1)Ie(ce);Te()}p[5].length===0?Q?(Q.p(p,C),C&32&&$(Q,1)):(Q=gt(p),Q.c(),$(Q,1),Q.m(de.parentNode,de)):Q&&(De(),k(Q,1,1,()=>{Q=null}),Te());const he={};C&128&&(he.contestId=p[7]),C&1&&(he.fees=p[0].fees),C&64&&(he.openModal=p[6]),le.$set(he);const $e={};C&128&&($e.contestId=p[7]),C&16&&($e.selectedPhoto=p[4]),C&8&&($e.openModal=p[3]),fe.$set($e);const be={};C&2&&(be.contestData=p[1]),C&4&&(be.openModal=p[2]),h.$set(be)},i(p){if(!N){$(Z),$(X),$(R.$$.fragment,p);for(let C=0;C<pe.length;C+=1)$(Y[C]);$(Q),$(le.$$.fragment,p),$(fe.$$.fragment,p),$(h.$$.fragment,p),N=!0}},o(p){k(Z),k(X),k(R.$$.fragment,p),Y=Y.filter(Boolean);for(let C=0;C<Y.length;C+=1)k(Y[C]);k(Q),k(le.$$.fragment,p),k(fe.$$.fragment,p),k(h.$$.fragment,p),N=!1},d(p){p&&(u(e),u(ie),u(me),u(W),u(de),u(ye),u(Se)),Z&&Z.d(),X&&X.d(),F(R),Et(Y,p),Q&&Q.d(p),F(le,p),F(fe,p),F(h,p)}}}function es(o,e,t){let n,s,l,a,r,f,c,d,g;Me(o,Jt,_=>t(18,d=_)),Me(o,qt,_=>t(8,g=_));let{data:m}=e;const w=async _=>{console.log("contestUpdated",_.detail),t(1,s={...s,..._.detail})},v=async()=>{t(6,a=!0)},E=async()=>{const _=await Pe(`/api/contest/${n}/init`,{method:"POST"});_.status===200&&t(1,s={...s,...await _.json()})},j=async _=>{console.log("photoCreated",_),console.log("photoCreated",_.detail),t(1,s={...s,photos:[...s.photos,_.detail]}),G()},G=async()=>{t(6,a=!1)},R=async()=>{t(2,f=!1)},H=async _=>{const{contestPhotoId:i,votes:te}=_.detail;console.log("photoVoted",_.detail);const ne=l.find(ae=>ae.contestPhotoId===i);ne&&(ne.ownVotes=(ne.ownVotes||0)+te,console.log("voted photo:",ne),t(4,c=void 0),t(5,l=[...l]))},S=async(_,i)=>{console.log("photo:",_),t(4,c=_),t(3,r=!0)},ee=async()=>{t(2,f=!0)},z=(_,i)=>S(_,i.target),P=()=>t(3,r=!1);return o.$$set=_=>{"data"in _&&t(0,m=_.data)},o.$$.update=()=>{o.$$.dirty&262144&&t(7,n=parseInt(d.url.pathname.split("/").pop())),o.$$.dirty&1&&t(1,s=m.contestData),o.$$.dirty&2&&t(5,l=s.photos||[])},t(6,a=!1),t(3,r=!1),t(2,f=!1),t(4,c=void 0),[m,s,f,r,c,l,a,n,g,w,v,E,j,G,R,H,S,ee,d,z,P]}class ws extends Ue{constructor(e){super(),Be(this,e,es,xn,Ae,{data:0})}}export{ws as component,vs as universal};