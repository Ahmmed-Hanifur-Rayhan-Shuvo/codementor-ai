import{c as s,r as m,G as h,j as e,z as x}from"./index-CCbLUaLu.js";import{S as y,m as n}from"./proxy-DkPnNc_Y.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=s("Bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=s("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=s("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=s("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),N=({darkMode:t})=>{const[a,b]=m.useState({theme:"dark",notifications:!0,autoFix:!0,language:"python",model:"deepseek",securityLevel:"high"}),c=()=>{x.success("✅ Settings saved successfully!")},o=[{icon:v,title:"Profile",fields:[{label:"Username",value:"developer"},{label:"Email",value:"dev@codementor.ai"}]},{icon:y,title:"Security",fields:[{label:"Security Level",value:a.securityLevel},{label:"2FA",value:"Disabled"}]},{icon:u,title:"Notifications",fields:[{label:"Email Notifications",value:a.notifications?"On":"Off"},{label:"Push Notifications",value:"On"}]},{icon:h,title:"Preferences",fields:[{label:"Default Language",value:a.language},{label:"Default Model",value:a.model},{label:"Auto-Fix",value:a.autoFix?"Enabled":"Disabled"}]}];return e.jsx("div",{className:"container mx-auto px-4 py-12",children:e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},children:[e.jsxs("div",{className:"flex items-center justify-between mb-8",children:[e.jsx("h1",{className:`text-3xl font-bold ${t?"text-white":"text-gray-800"}`,children:"Settings"}),e.jsxs("button",{onClick:c,className:"px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition flex items-center gap-2",children:[e.jsx(p,{className:"w-4 h-4"}),"Save Changes"]})]}),e.jsx("div",{className:"grid md:grid-cols-2 gap-6",children:o.map((l,i)=>e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:i*.1},className:`rounded-2xl p-6 ${t?"glass":"bg-white border border-gray-200"}`,children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("div",{className:`p-2 rounded-lg ${t?"bg-primary/20":"bg-primary/10"}`,children:e.jsx(l.icon,{className:"w-5 h-5 text-primary"})}),e.jsx("h3",{className:`text-lg font-semibold ${t?"text-white":"text-gray-800"}`,children:l.title})]}),e.jsx("div",{className:"space-y-3",children:l.fields.map((r,d)=>e.jsxs("div",{className:"flex items-center justify-between p-3 rounded-lg border border-white/5",children:[e.jsx("span",{className:t?"text-gray-300":"text-gray-700",children:r.label}),e.jsx("span",{className:`px-3 py-1 rounded-full text-sm ${t?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-600"}`,children:r.value})]},d))})]},i))}),e.jsx("div",{className:"mt-8 text-center",children:e.jsxs("button",{className:`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 mx-auto ${t?"bg-red-500/20 text-red-400 hover:bg-red-500/30":"bg-red-50 text-red-600 hover:bg-red-100"}`,children:[e.jsx(g,{className:"w-4 h-4"}),"Reset All Settings"]})})]})})};export{N as default};
//# sourceMappingURL=Settings-B0vb_MvN.js.map
