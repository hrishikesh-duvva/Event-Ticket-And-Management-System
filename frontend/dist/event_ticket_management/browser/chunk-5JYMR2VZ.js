import{a as f}from"./chunk-MCRJI3T3.js";import{b as p}from"./chunk-MM5QLNJM.js";import{i as v}from"./chunk-H3GX5QFY.js";var h=(n,t,o)=>{let r,e;if(f!==void 0&&"MutationObserver"in f){let d=Array.isArray(t)?t:[t];r=new MutationObserver(s=>{for(let c of s)for(let i of c.addedNodes)if(i.nodeType===Node.ELEMENT_NODE&&d.includes(i.slot)){o(),v(()=>u(i));return}}),r.observe(n,{childList:!0,subtree:!0})}let u=d=>{var s;e&&(e.disconnect(),e=void 0),e=new MutationObserver(c=>{o();for(let i of c)for(let l of i.removedNodes)l.nodeType===Node.ELEMENT_NODE&&l.slot===t&&a()}),e.observe((s=d.parentElement)!==null&&s!==void 0?s:d,{subtree:!0,childList:!0})},E=()=>{r&&(r.disconnect(),r=void 0),a()},a=()=>{e&&(e.disconnect(),e=void 0)};return{destroy:E}},C=(n,t,o)=>{let r=n==null?0:n.toString().length,e=b(r,t);if(o===void 0)return e;try{return o(r,t)}catch(u){return p("Exception in provided `counterFormatter`.",u),e}},b=(n,t)=>`${n} / ${t}`;export{h as a,C as b};
