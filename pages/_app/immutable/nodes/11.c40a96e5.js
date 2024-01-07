import{s as Re,A as Ae,C as Le,a1 as et,B as qe,L as tt,r as Oe,a as w,f as k,c as C,g as E,h as P,d as u,j as x,i as D,u as Ue,v as Ke,w as Ge,l as j,m as N,y as p,n as st,$ as at,R as Se,K as rt,_ as nt,x as Fe,X as lt,o as ot,z}from"../chunks/scheduler.f07fb11b.js";import{S as Je,i as Xe,b as g,d,m as _,a as $,t as m,e as h,g as Qe,c as We}from"../chunks/index.839dbff0.js";import{e as Me,g as ft}from"../chunks/navigation.f069e489.js";import{w as ct,b as it,f as ut}from"../chunks/wallet-store.e2583a36.js";import{s as Te}from"../chunks/error-manager.904fdb74.js";import{F as $t,E as mt}from"../chunks/error-modal.061650c5.js";import{a as ie,w as Ye,s as pt,e as gt,x as dt}from"../chunks/fetch-utils.834a8e20.js";import{L as me,k as _t,h as ht,j as vt}from"../chunks/index.bb9cc5fb.js";import{g as bt,a as wt,B as Ze}from"../chunks/Button.b97be4f2.js";import{C as Ct}from"../chunks/Checkbox.f6abab59.js";import{I as pe}from"../chunks/Input.f2aa900e.js";import{P as kt}from"../chunks/Popper.5386a8f7.js";const Et=r=>({}),Be=r=>({});function He(r){let e,s;const t=r[5].title,a=Oe(t,r,r[7],Be),o=a||Dt(r);return{c(){e=k("div"),o&&o.c(),this.h()},l(f){e=E(f,"DIV",{class:!0});var n=P(e);o&&o.l(n),n.forEach(u),this.h()},h(){x(e,"class","py-2 px-3 bg-gray-100 rounded-t-md border-b border-gray-200 dark:border-gray-600 dark:bg-gray-700")},m(f,n){D(f,e,n),o&&o.m(e,null),s=!0},p(f,n){a?a.p&&(!s||n&128)&&Ue(a,t,f,f[7],s?Ge(t,f[7],n,Et):Ke(f[7]),Be):o&&o.p&&(!s||n&1)&&o.p(f,s?n:-1)},i(f){s||($(o,f),s=!0)},o(f){m(o,f),s=!1},d(f){f&&u(e),o&&o.d(f)}}}function Dt(r){let e,s;return{c(){e=k("h3"),s=j(r[0]),this.h()},l(t){e=E(t,"H3",{class:!0});var a=P(e);s=N(a,r[0]),a.forEach(u),this.h()},h(){x(e,"class","font-semibold text-gray-900 dark:text-white")},m(t,a){D(t,e,a),p(e,s)},p(t,a){a&1&&st(s,t[0])},d(t){t&&u(e)}}}function yt(r){let e,s,t,a=(r[4].title||r[0])&&He(r);const o=r[5].default,f=Oe(o,r,r[7],null);return{c(){a&&a.c(),e=w(),s=k("div"),f&&f.c(),this.h()},l(n){a&&a.l(n),e=C(n),s=E(n,"DIV",{class:!0});var c=P(s);f&&f.l(c),c.forEach(u),this.h()},h(){x(s,"class",r[1])},m(n,c){a&&a.m(n,c),D(n,e,c),D(n,s,c),f&&f.m(s,null),t=!0},p(n,c){n[4].title||n[0]?a?(a.p(n,c),c&17&&$(a,1)):(a=He(n),a.c(),$(a,1),a.m(e.parentNode,e)):a&&(Qe(),m(a,1,1,()=>{a=null}),We()),f&&f.p&&(!t||c&128)&&Ue(f,o,n,n[7],t?Ge(o,n[7],c,null):Ke(n[7]),null),(!t||c&2)&&x(s,"class",n[1])},i(n){t||($(a),$(f,n),t=!0)},o(n){m(a),m(f,n),t=!1},d(n){n&&(u(e),u(s)),a&&a.d(n),f&&f.d(n)}}}function xt(r){let e,s;const t=[{activeContent:!0},{border:!0},{shadow:!0},{rounded:!0},r[2],{class:"dark:!border-gray-600 "+r[3].class}];let a={$$slots:{default:[yt]},$$scope:{ctx:r}};for(let o=0;o<t.length;o+=1)a=Ae(a,t[o]);return e=new kt({props:a}),e.$on("show",r[6]),{c(){g(e.$$.fragment)},l(o){d(e.$$.fragment,o)},m(o,f){_(e,o,f),s=!0},p(o,[f]){const n=f&12?bt(t,[t[0],t[1],t[2],t[3],f&4&&wt(o[2]),f&8&&{class:"dark:!border-gray-600 "+o[3].class}]):{};f&147&&(n.$$scope={dirty:f,ctx:o}),e.$set(n)},i(o){s||($(e.$$.fragment,o),s=!0)},o(o){m(e.$$.fragment,o),s=!1},d(o){h(e,o)}}}function It(r,e,s){const t=["title","defaultClass"];let a=Le(e,t),{$$slots:o={},$$scope:f}=e;const n=et(o);let{title:c=""}=e,{defaultClass:v="py-2 px-3"}=e;function S(y){tt.call(this,r,y)}return r.$$set=y=>{s(3,e=Ae(Ae({},e),qe(y))),s(2,a=Le(e,t)),"title"in y&&s(0,c=y.title),"defaultClass"in y&&s(1,v=y.defaultClass),"$$scope"in y&&s(7,f=y.$$scope)},e=qe(e),[c,v,a,e,n,o,S,f]}class Pt extends Je{constructor(e){super(),Xe(this,e,It,xt,Re,{title:0,defaultClass:1})}}async function Vt(r,...e){const t=new TextEncoder().encode(e.join("")),a=await crypto.subtle.digest(r,t),f=new Uint8Array(a).reduce((c,v)=>c+String.fromCharCode(v),"");return btoa(f)}const At=async r=>{const e=`${Math.floor(Date.now()/1e3/60)}`;console.log("challengeMinuteDate",e),console.log("email",r);const s=await Vt("SHA-256",e,r);return console.log("challenge",s),s};function St(r){let e;return{c(){e=j("Nombre completo")},l(s){e=N(s,"Nombre completo")},m(s,t){D(s,e,t)},d(s){s&&u(e)}}}function jt(r){let e,s;return e=new ie({props:{icon:_t,slot:"left"}}),{c(){g(e.$$.fragment)},l(t){d(e.$$.fragment,t)},m(t,a){_(e,t,a),s=!0},p:z,i(t){s||($(e.$$.fragment,t),s=!0)},o(t){m(e.$$.fragment,t),s=!1},d(t){h(e,t)}}}function Nt(r){let e;return{c(){e=j("Email")},l(s){e=N(s,"Email")},m(s,t){D(s,e,t)},d(s){s&&u(e)}}}function zt(r){let e,s;return e=new ie({props:{icon:ht,slot:"left"}}),{c(){g(e.$$.fragment)},l(t){d(e.$$.fragment,t)},m(t,a){_(e,t,a),s=!0},p:z,i(t){s||($(e.$$.fragment,t),s=!0)},o(t){m(e.$$.fragment,t),s=!1},d(t){h(e,t)}}}function Lt(r){let e;return{c(){e=j("Password")},l(s){e=N(s,"Password")},m(s,t){D(s,e,t)},d(s){s&&u(e)}}}function qt(r){let e,s;return e=new ie({props:{icon:Ye,slot:"left"}}),{c(){g(e.$$.fragment)},l(t){d(e.$$.fragment,t)},m(t,a){_(e,t,a),s=!0},p:z,i(t){s||($(e.$$.fragment,t),s=!0)},o(t){m(e.$$.fragment,t),s=!1},d(t){h(e,t)}}}function Ft(r){let e;return{c(){e=j("Confirma password")},l(s){e=N(s,"Confirma password")},m(s,t){D(s,e,t)},d(s){s&&u(e)}}}function Mt(r){let e,s;return e=new ie({props:{icon:Ye,slot:"left"}}),{c(){g(e.$$.fragment)},l(t){d(e.$$.fragment,t)},m(t,a){_(e,t,a),s=!0},p:z,i(t){s||($(e.$$.fragment,t),s=!0)},o(t){m(e.$$.fragment,t),s=!1},d(t){h(e,t)}}}function Tt(r){var f;let e,s,t,a,o;return s=new me({props:{for:"walletaccount",class:"text-gray-500",$$slots:{default:[Ht]},$$scope:{ctx:r}}}),a=new pe({props:{type:"text",id:"walletaccount",size:"lg",value:`${(f=r[1])==null?void 0:f.name}: ${r[0]}`,readonly:!0,$$slots:{left:[Rt]},$$scope:{ctx:r}}}),{c(){e=k("div"),g(s.$$.fragment),t=w(),g(a.$$.fragment)},l(n){e=E(n,"DIV",{});var c=P(e);d(s.$$.fragment,c),t=C(c),d(a.$$.fragment,c),c.forEach(u)},m(n,c){D(n,e,c),_(s,e,null),p(e,t),_(a,e,null),o=!0},p(n,c){var y;const v={};c&32&&(v.$$scope={dirty:c,ctx:n}),s.$set(v);const S={};c&3&&(S.value=`${(y=n[1])==null?void 0:y.name}: ${n[0]}`),c&32&&(S.$$scope={dirty:c,ctx:n}),a.$set(S)},i(n){o||($(s.$$.fragment,n),$(a.$$.fragment,n),o=!0)},o(n){m(s.$$.fragment,n),m(a.$$.fragment,n),o=!1},d(n){n&&u(e),h(s),h(a)}}}function Bt(r){let e,s;return e=new Ze({props:{type:"button",class:"w-full",color:"alternative",$$slots:{default:[Ot]},$$scope:{ctx:r}}}),e.$on("click",ut),{c(){g(e.$$.fragment)},l(t){d(e.$$.fragment,t)},m(t,a){_(e,t,a),s=!0},p(t,a){const o={};a&32&&(o.$$scope={dirty:a,ctx:t}),e.$set(o)},i(t){s||($(e.$$.fragment,t),s=!0)},o(t){m(e.$$.fragment,t),s=!1},d(t){h(e,t)}}}function Ht(r){let e;return{c(){e=j("Cuenta conectada")},l(s){e=N(s,"Cuenta conectada")},m(s,t){D(s,e,t)},d(s){s&&u(e)}}}function Rt(r){let e,s;return e=new ie({props:{icon:vt,slot:"left"}}),{c(){g(e.$$.fragment)},l(t){d(e.$$.fragment,t)},m(t,a){_(e,t,a),s=!0},p:z,i(t){s||($(e.$$.fragment,t),s=!0)},o(t){m(e.$$.fragment,t),s=!1},d(t){h(e,t)}}}function Ot(r){let e,s,t;return e=new ie({props:{icon:dt,class:"text-xl mr-2"}}),{c(){g(e.$$.fragment),s=j(`    
							Conecta tu wallet`)},l(a){d(e.$$.fragment,a),s=N(a,`    
							Conecta tu wallet`)},m(a,o){_(e,a,o),D(a,s,o),t=!0},p:z,i(a){t||($(e.$$.fragment,a),t=!0)},o(a){m(e.$$.fragment,a),t=!1},d(a){a&&u(s),h(e,a)}}}function Ut(r){let e,s="Condiciones legales";return{c(){e=k("a"),e.textContent=s,this.h()},l(t){e=E(t,"A",{id:!0,class:!0,"data-svelte-h":!0}),Se(e)!=="svelte-15z2ep2"&&(e.textContent=s),this.h()},h(){x(e,"id","terms_and_conditions"),x(e,"class","font-medium text-primary-600 hover:underline ")},m(t,a){D(t,e,a)},p:z,d(t){t&&u(e)}}}function Kt(r){let e;return{c(){e=j(r[3])},l(s){e=N(s,r[3])},m(s,t){D(s,e,t)},p:z,d(s){s&&u(e)}}}function Gt(r){let e,s,t;return e=new ie({props:{icon:pt,color:"white",class:"text-xl mr-2"}}),{c(){g(e.$$.fragment),s=j(`    
						Registrarse`)},l(a){d(e.$$.fragment,a),s=N(a,`    
						Registrarse`)},m(a,o){_(e,a,o),D(a,s,o),t=!0},p:z,i(a){t||($(e.$$.fragment,a),t=!0)},o(a){m(e.$$.fragment,a),t=!1},d(a){a&&u(s),h(e,a)}}}function Jt(r){let e,s,t,a,o=`<img class="w-20 h-20 mr-2" src="/images/logo.svg" alt="Logo Vote4Photo"/>
			Vote4Photo`,f,n,c,v,S="Crea tu cuenta",y,b,W,L,ve,q,be,Y,F,we,M,Ce,T,Z,B,ke,H,Ee,ee,R,De,O,ye,V,A,ge,U,K,xe,G,Ie,J,de,te,_e,se,he,Pe,je;L=new me({props:{for:"fullName",class:"text-gray-500",$$slots:{default:[St]},$$scope:{ctx:r}}}),q=new pe({props:{type:"text",name:"fullName",id:"fullName",placeholder:"John Doe",required:"true",size:"lg",$$slots:{left:[jt]},$$scope:{ctx:r}}}),F=new me({props:{for:"email",class:"text-gray-500",$$slots:{default:[Nt]},$$scope:{ctx:r}}}),M=new pe({props:{type:"email",name:"email",id:"email",placeholder:"name@example.com",required:"true",size:"lg",$$slots:{left:[zt]},$$scope:{ctx:r}}}),B=new me({props:{for:"password",class:"text-gray-500",$$slots:{default:[Lt]},$$scope:{ctx:r}}}),H=new pe({props:{type:"password",name:"password",id:"password",required:"true",size:"lg",$$slots:{left:[qt]},$$scope:{ctx:r}}}),R=new me({props:{for:"password2",class:"text-gray-500",$$slots:{default:[Ft]},$$scope:{ctx:r}}}),O=new pe({props:{type:"password",name:"password2",id:"password2",required:"true",size:"lg",$$slots:{left:[Mt]},$$scope:{ctx:r}}});const Ne=[Bt,Tt],X=[];function ze(l,i){return l[0]===void 0?0:1}return V=ze(r),A=X[V]=Ne[V](r),K=new Ct({props:{id:"terms",name:"terms",required:"true",$$slots:{default:[Ut]},$$scope:{ctx:r}}}),G=new Pt({props:{class:"w-64 text-sm font-light ",title:"Términos y condiciones",triggeredBy:"#terms_and_conditions",$$slots:{default:[Kt]},$$scope:{ctx:r}}}),J=new Ze({props:{type:"submit",class:"w-full bg-secondary-600 hover:bg-secondary-500",disabled:!r[0],$$slots:{default:[Gt]},$$scope:{ctx:r}}}),te=new $t({}),se=new mt({}),{c(){e=w(),s=k("section"),t=k("div"),a=k("a"),a.innerHTML=o,f=w(),n=k("div"),c=k("div"),v=k("h1"),v.textContent=S,y=w(),b=k("form"),W=k("div"),g(L.$$.fragment),ve=w(),g(q.$$.fragment),be=w(),Y=k("div"),g(F.$$.fragment),we=w(),g(M.$$.fragment),Ce=w(),T=k("div"),Z=k("div"),g(B.$$.fragment),ke=w(),g(H.$$.fragment),Ee=w(),ee=k("div"),g(R.$$.fragment),De=w(),g(O.$$.fragment),ye=w(),A.c(),ge=w(),U=k("p"),g(K.$$.fragment),xe=w(),g(G.$$.fragment),Ie=w(),g(J.$$.fragment),de=w(),g(te.$$.fragment),_e=w(),g(se.$$.fragment),this.h()},l(l){at("svelte-14vr3n0",document.head).forEach(u),e=C(l),s=E(l,"SECTION",{class:!0});var ue=P(s);t=E(ue,"DIV",{class:!0});var ae=P(t);a=E(ae,"A",{href:!0,class:!0,"data-svelte-h":!0}),Se(a)!=="svelte-1cqpjo5"&&(a.innerHTML=o),f=C(ae),n=E(ae,"DIV",{class:!0});var $e=P(n);c=E($e,"DIV",{class:!0});var re=P(c);v=E(re,"H1",{class:!0,"data-svelte-h":!0}),Se(v)!=="svelte-18g5fm7"&&(v.textContent=S),y=C(re),b=E(re,"FORM",{class:!0});var I=P(b);W=E(I,"DIV",{});var ne=P(W);d(L.$$.fragment,ne),ve=C(ne),d(q.$$.fragment,ne),ne.forEach(u),be=C(I),Y=E(I,"DIV",{});var le=P(Y);d(F.$$.fragment,le),we=C(le),d(M.$$.fragment,le),le.forEach(u),Ce=C(I),T=E(I,"DIV",{class:!0});var oe=P(T);Z=E(oe,"DIV",{});var Q=P(Z);d(B.$$.fragment,Q),ke=C(Q),d(H.$$.fragment,Q),Q.forEach(u),Ee=C(oe),ee=E(oe,"DIV",{});var fe=P(ee);d(R.$$.fragment,fe),De=C(fe),d(O.$$.fragment,fe),fe.forEach(u),oe.forEach(u),ye=C(I),A.l(I),ge=C(I),U=E(I,"P",{class:!0});var ce=P(U);d(K.$$.fragment,ce),xe=C(ce),d(G.$$.fragment,ce),ce.forEach(u),Ie=C(I),d(J.$$.fragment,I),I.forEach(u),re.forEach(u),$e.forEach(u),ae.forEach(u),ue.forEach(u),de=C(l),d(te.$$.fragment,l),_e=C(l),d(se.$$.fragment,l),this.h()},h(){document.title="Vote4Photo - Acceso",x(a,"href","/"),x(a,"class","flex items-center mb-6 font-semibold text-gray-600 dark:text-white text-4xl"),x(v,"class","text-2xl font-semibold leading-tight tracking-tight text-gray-700 "),x(T,"class","flex flex-row gap-2"),x(U,"class","text-sm font-light text-gray-500 dark:text-gray-400"),x(b,"class","space-y-4 md:space-y-6"),x(c,"class","p-6 space-y-4 md:space-y-6 sm:p-8"),x(n,"class","w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0"),x(t,"class","flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"),x(s,"class","bg-gray-50 min-h-full")},m(l,i){D(l,e,i),D(l,s,i),p(s,t),p(t,a),p(t,f),p(t,n),p(n,c),p(c,v),p(c,y),p(c,b),p(b,W),_(L,W,null),p(W,ve),_(q,W,null),p(b,be),p(b,Y),_(F,Y,null),p(Y,we),_(M,Y,null),p(b,Ce),p(b,T),p(T,Z),_(B,Z,null),p(Z,ke),_(H,Z,null),p(T,Ee),p(T,ee),_(R,ee,null),p(ee,De),_(O,ee,null),p(b,ye),X[V].m(b,null),p(b,ge),p(b,U),_(K,U,null),p(U,xe),_(G,U,null),p(b,Ie),_(J,b,null),D(l,de,i),_(te,l,i),D(l,_e,i),_(se,l,i),he=!0,Pe||(je=rt(b,"submit",nt(r[2])),Pe=!0)},p(l,[i]){const ue={};i&32&&(ue.$$scope={dirty:i,ctx:l}),L.$set(ue);const ae={};i&32&&(ae.$$scope={dirty:i,ctx:l}),q.$set(ae);const $e={};i&32&&($e.$$scope={dirty:i,ctx:l}),F.$set($e);const re={};i&32&&(re.$$scope={dirty:i,ctx:l}),M.$set(re);const I={};i&32&&(I.$$scope={dirty:i,ctx:l}),B.$set(I);const ne={};i&32&&(ne.$$scope={dirty:i,ctx:l}),H.$set(ne);const le={};i&32&&(le.$$scope={dirty:i,ctx:l}),R.$set(le);const oe={};i&32&&(oe.$$scope={dirty:i,ctx:l}),O.$set(oe);let Q=V;V=ze(l),V===Q?X[V].p(l,i):(Qe(),m(X[Q],1,1,()=>{X[Q]=null}),We(),A=X[V],A?A.p(l,i):(A=X[V]=Ne[V](l),A.c()),$(A,1),A.m(b,ge));const fe={};i&32&&(fe.$$scope={dirty:i,ctx:l}),K.$set(fe);const ce={};i&32&&(ce.$$scope={dirty:i,ctx:l}),G.$set(ce);const Ve={};i&1&&(Ve.disabled=!l[0]),i&32&&(Ve.$$scope={dirty:i,ctx:l}),J.$set(Ve)},i(l){he||($(L.$$.fragment,l),$(q.$$.fragment,l),$(F.$$.fragment,l),$(M.$$.fragment,l),$(B.$$.fragment,l),$(H.$$.fragment,l),$(R.$$.fragment,l),$(O.$$.fragment,l),$(A),$(K.$$.fragment,l),$(G.$$.fragment,l),$(J.$$.fragment,l),$(te.$$.fragment,l),$(se.$$.fragment,l),he=!0)},o(l){m(L.$$.fragment,l),m(q.$$.fragment,l),m(F.$$.fragment,l),m(M.$$.fragment,l),m(B.$$.fragment,l),m(H.$$.fragment,l),m(R.$$.fragment,l),m(O.$$.fragment,l),m(A),m(K.$$.fragment,l),m(G.$$.fragment,l),m(J.$$.fragment,l),m(te.$$.fragment,l),m(se.$$.fragment,l),he=!1},d(l){l&&(u(e),u(s),u(de),u(_e)),h(L),h(q),h(F),h(M),h(B),h(H),h(R),h(O),X[V].d(),h(K),h(G),h(J),h(te,l),h(se,l),Pe=!1,je()}}}function Xt(r,e,s){let t,a;Fe(r,ct,n=>s(0,t=n)),Fe(r,it,n=>s(1,a=n)),lt(Me);const o=async n=>{console.log("Signing up...");const c=new FormData(n.target);if(console.log(c.entries()),!t){Te("Es necesario conectar con una wallet para poder acceder");return}if(c.get("password")!==c.get("password2")){Te("Las contraseñas no coinciden");return}const v=await gt("/api/account/signup",{method:"POST",headers:{"x-v4p-challenge":await At(c.get("email"))},payload:{fullName:c.get("fullName"),email:c.get("email"),password:c.get("password"),terms:c.get("terms"),chainId:a==null?void 0:a.id,account:t}});if(v.status===200){console.log("Cuenta creada correctamente");const S=await v.json();Me.set(S.jwt),ft("/app/home")}};return ot(async()=>{}),[t,a,o,`
	La presente aplicación es una PoC sin objetivo comercial, creada exclusivamente para fines educativos.
	Si has llegado por accidente a esta página, por favor, no introduzcas tus datos personales.
	`]}class fs extends Je{constructor(e){super(),Xe(this,e,Xt,Jt,Re,{})}}export{fs as component};