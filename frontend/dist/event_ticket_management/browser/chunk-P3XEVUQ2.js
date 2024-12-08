import{a as M}from"./chunk-R3BLK4VH.js";import{Ka as l,Na as m,Qa as n,Ra as t,Vb as C,Wa as h,Wb as S,X as v,Xa as x,Ya as p,_b as O,da as u,ea as f,eb as E,fb as i,gb as d,nb as _,ub as b,ya as a,za as g}from"./chunk-A5IQK4TJ.js";import"./chunk-JHI3MBHO.js";function I(o,e){if(o&1){let s=h();n(0,"div",6)(1,"span"),i(2),t(),n(3,"button",7),x("click",function(){let c=u(s).$implicit,A=p(2);return f(A.deleteEvent(c.id))}),i(4,"Delete"),t()()}if(o&2){let s=e.$implicit;a(2),d(s.name)}}function y(o,e){if(o&1&&(n(0,"div"),l(1,I,5,1,"div",5),t()),o&2){let s=p();a(),m("ngForOf",s.suspiciousEvents)}}function U(o,e){o&1&&(n(0,"p"),i(1,"No suspicious events found."),t())}var P=class o{constructor(e){this.adminService=e}totalEvents=0;activeEvents=0;totalUsers=0;activeUsers=0;suspiciousEvents=[];events=[];users=[];ngOnInit(){this.events=this.adminService.getEvents(),this.users=this.adminService.getUsers(),this.totalEvents=this.events.length,this.activeEvents=this.events.filter(e=>e.status==="Active").length,this.suspiciousEvents=this.events.filter(e=>e.status==="Suspicious"),this.totalUsers=this.users.length,this.activeUsers=this.users.filter(e=>e.status==="Active").length}deleteEvent(e){this.adminService.deleteEvent(e),this.suspiciousEvents=this.suspiciousEvents.filter(s=>s.id!==e),this.totalEvents--}static \u0275fac=function(s){return new(s||o)(g(M))};static \u0275cmp=v({type:o,selectors:[["app-adashboard"]],standalone:!0,features:[_],decls:29,vars:6,consts:[["noEvents",""],[1,"dashboard"],[1,"stats-container"],[1,"stat-card"],[4,"ngIf","ngIfElse"],["class","event",4,"ngFor","ngForOf"],[1,"event"],[3,"click"]],template:function(s,r){if(s&1&&(n(0,"div",1)(1,"h1"),i(2,"Admin Dashboard"),t(),n(3,"div",2)(4,"div",3)(5,"h2"),i(6,"Total Events"),t(),n(7,"p"),i(8),t()(),n(9,"div",3)(10,"h2"),i(11,"Active Events"),t(),n(12,"p"),i(13),t()(),n(14,"div",3)(15,"h2"),i(16,"Total Users"),t(),n(17,"p"),i(18),t()(),n(19,"div",3)(20,"h2"),i(21,"Active Users"),t(),n(22,"p"),i(23),t()()(),n(24,"h2"),i(25,"Suspicious Events"),t(),l(26,y,2,1,"div",4)(27,U,2,0,"ng-template",null,0,b),t()),s&2){let c=E(28);a(8),d(r.totalEvents),a(5),d(r.activeEvents),a(5),d(r.totalUsers),a(5),d(r.activeUsers),a(3),m("ngIf",r.suspiciousEvents.length)("ngIfElse",c)}},dependencies:[O,C,S],styles:[".dashboard[_ngcontent-%COMP%]{font-family:Arial,sans-serif;padding:20px}h1[_ngcontent-%COMP%]{text-align:center;margin-bottom:20px}.stats-container[_ngcontent-%COMP%]{display:flex;justify-content:space-around;flex-wrap:wrap;margin-bottom:30px}.stat-card[_ngcontent-%COMP%]{background-color:#f4f4f4;border-radius:10px;box-shadow:0 4px 6px #0000001a;padding:20px;text-align:center;width:200px;margin:10px;transition:transform .2s}.stat-card[_ngcontent-%COMP%]:hover{transform:scale(1.05)}.stat-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:18px;margin-bottom:10px}.stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:24px;font-weight:700;color:#333}.event[_ngcontent-%COMP%]{display:flex;justify-content:space-between;background-color:#fff;border:1px solid #ddd;border-radius:5px;padding:10px;margin-bottom:10px}.event[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:16px}.event[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#d9534f;color:#fff;border:none;border-radius:5px;padding:5px 10px;cursor:pointer;transition:background-color .2s}.event[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#c9302c}"]})};export{P as AdashboardComponent};