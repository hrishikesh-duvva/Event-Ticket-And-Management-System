import{K as r,N as s,S as n,f as o,fc as a}from"./chunk-A5IQK4TJ.js";var l=class i{constructor(t){this.http=t;this.checkLoginStatus()}apiUrl="http://localhost:5095/api/auth";isLoggedInSubject=new o(!1);isLoggedIn$=this.isLoggedInSubject.asObservable();user=null;login(t){return this.http.post(`${this.apiUrl}/login`,t).pipe(r(e=>{e?.token&&(localStorage.setItem("token",e.token),this.isLoggedInSubject.next(!0),this.user=t)}))}register(t){return this.http.post(`${this.apiUrl}/register`,t)}logout(){this.user=null,localStorage.removeItem("token"),this.isLoggedInSubject.next(!1)}getUser(){return this.user}checkLoginStatus(){localStorage.getItem("token")?this.isLoggedInSubject.next(!0):this.isLoggedInSubject.next(!1)}static \u0275fac=function(e){return new(e||i)(n(a))};static \u0275prov=s({token:i,factory:i.\u0275fac,providedIn:"root"})};export{l as a};