import{s as O}from"./chunk-C7UFNYZC.js";import{Ka as d,Na as u,Qa as s,Ra as t,Vb as C,Wa as v,Wb as k,X as f,Xa as _,Ya as p,_b as S,da as x,ea as b,fb as n,fc as E,hb as c,nb as I,ya as a,za as h}from"./chunk-A5IQK4TJ.js";import{a as m,b as g}from"./chunk-JHI3MBHO.js";function y(r,o){if(r&1){let e=v();s(0,"button",6),_("click",function(){x(e);let l=p().$implicit,w=p();return b(w.resolveIssue(l.id))}),n(1," Mark as Resolved "),t()}}function P(r,o){if(r&1&&(s(0,"div",2)(1,"div",3)(2,"p")(3,"strong"),n(4,"User:"),t(),n(5),t(),s(6,"p")(7,"strong"),n(8,"Email:"),t(),n(9),t(),s(10,"p")(11,"strong"),n(12,"Issue:"),t(),n(13),t(),s(14,"p")(15,"strong"),n(16,"Status:"),t(),n(17),t()(),s(18,"div",4),d(19,y,2,0,"button",5),t()()),r&2){let e=o.$implicit;a(5),c(" ",(e.user==null?null:e.user.username)||"Unknown",""),a(4),c(" ",(e.user==null?null:e.user.email)||"Unknown",""),a(4),c(" ",e.issue,""),a(4),c(" ",e.status,""),a(2),u("ngIf",e.status==="Pending")}}var M=class r{constructor(o){this.http=o}issues=[];apiUrl="http://localhost:5095/api/SupportTicket";ngOnInit(){this.fetchIssues()}fetchIssues(){let o=localStorage.getItem("token");if(!o){console.error("No token found.");return}let e={Authorization:`Bearer ${o}`};this.http.get(this.apiUrl,{headers:e}).subscribe({next:i=>{console.log("Fetched issues:",i),this.issues=(i.$values||[]).map(l=>g(m({},l),{user:l.user||{userId:0,username:"Unknown",email:"Unknown",phoneNumber:"Unknown"}}))},error:i=>{console.error("Error fetching issues:",i)}})}resolveIssue(o){let e=localStorage.getItem("token");if(!e){console.error("No token found.");return}let i={Authorization:`Bearer ${e}`};this.http.put(`${this.apiUrl}/${o}`,{},{headers:i}).subscribe({next:()=>{alert("Issue marked as resolved."),this.fetchIssues()},error:l=>{console.error("Error resolving issue:",l)}})}static \u0275fac=function(e){return new(e||r)(h(E))};static \u0275cmp=f({type:r,selectors:[["app-sdashboard"]],standalone:!0,features:[I],decls:4,vars:1,consts:[[1,"issues-container"],["class","issue-card",4,"ngFor","ngForOf"],[1,"issue-card"],[1,"issue-details"],[1,"action-container"],["class","resolve-button",3,"click",4,"ngIf"],[1,"resolve-button",3,"click"]],template:function(e,i){e&1&&(s(0,"div",0)(1,"h2"),n(2,"All Issues"),t(),d(3,P,20,5,"div",1),t()),e&2&&(a(3),u("ngForOf",i.issues))},dependencies:[S,C,k,O],styles:[".issues-container[_ngcontent-%COMP%]{width:90%;margin:20px auto;font-family:Arial,sans-serif}h2[_ngcontent-%COMP%]{text-align:center;color:#333;font-size:24px;margin-bottom:20px}.issue-card[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:15px;margin-bottom:15px;background-color:#f9f9f9;border:1px solid #ddd;border-radius:8px;box-shadow:0 4px 6px #0000001a}.issue-details[_ngcontent-%COMP%]{flex:1;padding-right:20px}.issue-details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:5px 0;color:#555}.action-container[_ngcontent-%COMP%]{display:flex;justify-content:flex-end}.resolve-button[_ngcontent-%COMP%]{background-color:#28a745;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;transition:background-color .3s ease}.resolve-button[_ngcontent-%COMP%]:hover{background-color:#218838}"]})};export{M as SdashboardComponent};
