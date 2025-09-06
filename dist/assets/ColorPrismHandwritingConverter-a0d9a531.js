import{j as e}from"./index-425a4db3.js";import{r as l}from"./vendor-8a332d8f.js";import"./router-2c18f3be.js";import"./ui-86c81d4e.js";class U{static async loadFont(r,s){if(this.loadedFonts.has(r))return Promise.resolve();if(this.loadingFonts.has(r))return this.loadingFonts.get(r);const o=this.loadFontInternal(r,s);this.loadingFonts.set(r,o);try{await o,this.loadedFonts.add(r)}catch(n){throw console.warn(`Failed to load font ${r}:`,n),n}finally{this.loadingFonts.delete(r)}}static async loadFontInternal(r,s){return new Promise((o,n)=>{this.loadFontViaCSS(r,s).then(()=>{setTimeout(()=>{this.verifyFontLoaded(r)?o():this.loadFontViaFontFace(r,s).then(o).catch(n)},200)}).catch(()=>{this.loadFontViaFontFace(r,s).then(o).catch(n)})})}static loadFontViaCSS(r,s){return new Promise((o,n)=>{if(document.querySelector(`link[href="${s}"]`)){o();return}const c=document.createElement("link");c.rel="stylesheet",c.href=s,c.crossOrigin="anonymous";const j=setTimeout(()=>{n(new Error(`Font loading timeout: ${r}`))},1e4);c.onload=()=>{clearTimeout(j),setTimeout(()=>o(),100)},c.onerror=()=>{clearTimeout(j),n(new Error(`Failed to load font CSS from ${s}`))},document.head.appendChild(c)})}static async loadFontViaFontFace(r,s){if(!window.FontFace)throw new Error("FontFace API not supported");try{const o=await this.extractFontFileUrl(s),n=new FontFace(r,`url(${o})`);await n.load(),document.fonts.add(n)}catch(o){throw new Error(`FontFace loading failed: ${o}`)}}static async extractFontFileUrl(r){if(r.includes("fonts.googleapis.com")){const n=(await(await fetch(r)).text()).match(/url\(([^)]+)\)/);if(n)return n[1].replace(/["']/g,"")}throw new Error("Could not extract font file URL")}static verifyFontLoaded(r){if(!document.fonts||!document.fonts.check)return!0;try{return document.fonts.check(`16px "${r}"`)}catch{return!0}}}U.loadedFonts=new Set;U.loadingFonts=new Map;const Fe=()=>{var Z,J,X,Q,_,ee,ae,te,re;const[d,r]=l.useState(""),[s,o]=l.useState("english"),[n,M]=l.useState("rainbow"),[c,j]=l.useState(24),[C,Y]=l.useState(!1),[F,$]=l.useState(!1),[ce,B]=l.useState(!1),[D,K]=l.useState(""),[f,pe]=l.useState("prism"),[T,O]=l.useState(!1),[h,me]=l.useState("prism-card"),[z,G]=l.useState(!1),[g,ge]=l.useState("center"),[P,H]=l.useState(!1),fe=l.useRef(null),b=[{value:"english",label:"English",flag:"🇺🇸",font:"Dancing Script",fontUrl:"https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"},{value:"spanish",label:"Español",flag:"🇪🇸",font:"Kalam",fontUrl:"https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap"},{value:"french",label:"Français",flag:"🇫🇷",font:"Caveat",fontUrl:"https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap"},{value:"chinese",label:"中文",flag:"🇨🇳",font:"Ma Shan Zheng",fontUrl:"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap"},{value:"japanese",label:"日本語",flag:"🇯🇵",font:"Klee One",fontUrl:"https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&display=swap"},{value:"korean",label:"한국어",flag:"🇰🇷",font:"Gaegu",fontUrl:"https://fonts.googleapis.com/css2?family=Gaegu:wght@300;400;700&display=swap"},{value:"arabic",label:"العربية",flag:"🇸🇦",font:"Amiri",fontUrl:"https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap"},{value:"hindi",label:"हिन्दी",flag:"🇮🇳",font:"Kalam",fontUrl:"https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap"}],u=[{id:"prism",name:"Rainbow Prism",preview:"🌈",description:"Vibrant rainbow gradient",background:"linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)"},{id:"aurora",name:"Aurora Borealis",preview:"🌌",description:"Northern lights effect",background:"linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"},{id:"sunset",name:"Sunset Gradient",preview:"🌅",description:"Warm sunset colors",background:"linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #fad0c4 75%, #ffd1ff 100%)"},{id:"ocean",name:"Ocean Waves",preview:"🌊",description:"Deep ocean blues",background:"linear-gradient(135deg, #667eea 0%, #764ba2 25%, #89f7fe 50%, #66a6ff 75%, #667eea 100%)"},{id:"galaxy",name:"Galaxy Nebula",preview:"🌌",description:"Cosmic space theme",background:"linear-gradient(135deg, #2c3e50 0%, #4a00e0 25%, #8e2de2 50%, #ff006e 75%, #8a2387 100%)"},{id:"crystal",name:"Crystal Prism",preview:"💎",description:"Crystalline reflections",background:"linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #ff9a9e 50%, #fecfef 75%, #ffecd2 100%)"}],w=[{id:"prism-card",name:"Prism Card",icon:"🌈",description:"Rainbow card format",aspectRatio:"16:10",padding:32},{id:"crystal-square",name:"Crystal Square",icon:"💎",description:"Perfect square crystal",aspectRatio:"1:1",padding:40},{id:"aurora-wide",name:"Aurora Wide",icon:"🌌",description:"Wide aurora display",aspectRatio:"21:9",padding:24},{id:"rainbow-portrait",name:"Rainbow Portrait",icon:"🎨",description:"Tall rainbow format",aspectRatio:"9:16",padding:36}],y=[{id:"center",name:"Center Prism",icon:"🌈",description:"Centered rainbow text",textAlign:"center",justifyContent:"center",alignItems:"center"},{id:"floating",name:"Floating Colors",icon:"✨",description:"Floating color effect",textAlign:"center",justifyContent:"center",alignItems:"center"},{id:"cascade",name:"Color Cascade",icon:"🌊",description:"Cascading rainbow",textAlign:"left",justifyContent:"flex-start",alignItems:"flex-start"}],k=[{value:"rainbow",label:"🌈 Rainbow",gradient:"linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)"},{value:"fire",label:"🔥 Fire",gradient:"linear-gradient(45deg, #ff4757, #ff6348, #ff7675, #fd79a8)"},{value:"ice",label:"❄️ Ice",gradient:"linear-gradient(45deg, #74b9ff, #0984e3, #00b894, #00cec9)"},{value:"sunset",label:"🌅 Sunset",gradient:"linear-gradient(45deg, #fd79a8, #fdcb6e, #e17055, #d63031)"},{value:"aurora",label:"🌌 Aurora",gradient:"linear-gradient(45deg, #a29bfe, #6c5ce7, #fd79a8, #fdcb6e)"}];l.useEffect(()=>{(async()=>{const i=b.find(t=>t.value===s);if(i&&i.fontUrl){B(!0),K("");try{await U.loadFont(i.font,i.fontUrl)}catch(t){const m=`Font "${i.font}" may not display correctly. Using system fallback.`;K(m),console.warn("Font loading error:",t)}finally{B(!1)}}})()},[s]);const V=()=>{const a=b.find(i=>i.value===s);if(a){const i=a.font;let t="cursive";return["hindi"].includes(s)?t='Kalam, "Noto Sans Devanagari", sans-serif':["arabic"].includes(s)?t='Amiri, "Noto Sans Arabic", serif':["chinese","japanese","korean"].includes(s)?t='"Noto Sans CJK", sans-serif':t="cursive, fantasy",`"${i}", ${t}`}return"cursive"},q=()=>{const a=k.find(i=>i.value===n);return(a==null?void 0:a.gradient)||k[0].gradient},he=()=>{const a=u.find(i=>i.id===f);return{background:(a==null?void 0:a.background)||u[0].background}},ue=()=>{const a=w.find(E=>E.id===h);if(!a)return{};const[i,t]=a.aspectRatio.split(":").map(Number),m=400,R=m*t/i;return{width:`${m}px`,height:`${Math.min(R,500)}px`,padding:`${a.padding}px`,aspectRatio:a.aspectRatio.replace(":","/")}},xe=()=>{const a=y.find(i=>i.id===g);return a?g==="floating"?{position:"relative",overflow:"hidden",display:"block"}:{textAlign:a.textAlign,justifyContent:a.justifyContent,alignItems:a.alignItems,display:"flex",flexDirection:"column",height:"100%",width:"100%"}:{}},be=()=>{if(g!=="floating"||!d)return null;const a=d.split(`
`);return e.jsx(e.Fragment,{children:a.map((i,t)=>e.jsx("span",{className:"floating-text-line",style:{position:"absolute",left:`${15+Math.random()*60}%`,top:`${15+Math.random()*60}%`,transform:`rotate(${(Math.random()-.5)*15}deg) scale(${.9+Math.random()*.2})`,whiteSpace:"nowrap",fontSize:"inherit",fontFamily:"inherit",background:q(),WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:`hue-rotate(${t*30}deg)`,animation:`float-${t%3} 3s ease-in-out infinite`},children:i},t))})},we=async()=>{try{await navigator.clipboard.writeText(d),Y(!0),setTimeout(()=>Y(!1),2e3)}catch(a){console.error("Failed to copy text: ",a)}},ve=async()=>{if(!d.trim())return;const a=w.find(p=>p.id===h);if(!a)return;const i=document.createElement("canvas"),t=i.getContext("2d"),m=3,[R,E]=a.aspectRatio.split(":").map(Number);let x=1200,N=x*E/R;i.width=x*m,i.height=N*m,t.scale(m,m);const L=u.find(p=>p.id===f),ie=t.createLinearGradient(0,0,x,N);if(L!=null&&L.background.includes("linear-gradient")){const p=["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#feca57"];p.forEach((v,W)=>{ie.addColorStop(W/(p.length-1),v)})}t.fillStyle=ie,t.fillRect(0,0,x,N);const se=Math.max(16,c*(x/600));t.font=`${se}px ${V()}`;const ne=d.split(`
`),S=se*1.6,oe=ne.length*S;let je=x/2,A=(N-oe)/2+S/2;t.textAlign="center",t.textBaseline="middle";const le=t.createLinearGradient(0,A-S,0,A+oe),de=["#ff0000","#ff7f00","#ffff00","#00ff00","#0000ff","#4b0082","#9400d3"];de.forEach((p,v)=>{le.addColorStop(v/(de.length-1),p)}),t.fillStyle=le,ne.forEach((p,v)=>{const W=je,ye=A+v*S;t.fillText(p,W,ye)});const I=document.createElement("a");I.download=`prism-handwriting-${s}-${f}-${h}-${Date.now()}.png`,I.href=i.toDataURL("image/png"),I.click()};return e.jsxs("div",{className:"prism-tool-container",children:[e.jsx("style",{jsx:!0,children:`
        .prism-tool-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
          background-size: 400% 400%;
          animation: prismBackground 15s ease infinite;
          padding: 2rem;
        }

        @keyframes prismBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        .prism-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .prism-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
        }

        .prism-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          font-weight: 300;
        }

        .prism-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .prism-input-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .prism-section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .prism-textarea {
          width: 100%;
          min-height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          padding: 1rem;
          color: white;
          font-size: 1rem;
          resize: vertical;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .prism-textarea:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .prism-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .prism-preview-container {
          margin-top: 2rem;
          position: relative;
        }

        .prism-preview {
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
          position: relative;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .prism-preview:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .prism-text-content {
          font-weight: 500;
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }

        .prism-placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          text-align: center;
        }

        .prism-controls {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .prism-control-group {
          margin-bottom: 2rem;
        }

        .prism-control-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .prism-dropdown {
          position: relative;
        }

        .prism-dropdown-trigger {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .prism-dropdown-trigger:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .prism-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
          margin-top: 0.5rem;
        }

        .prism-dropdown-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #333;
        }

        .prism-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .prism-dropdown-item.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .prism-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
        }

        .prism-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .prism-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .prism-btn {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .prism-btn-primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .prism-btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .prism-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .prism-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .prism-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .prism-stat {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }

        .prism-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          display: block;
        }

        .prism-stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .prism-layout {
            grid-template-columns: 1fr;
          }
          
          .prism-title {
            font-size: 2rem;
          }
        }
      `}),e.jsxs("div",{className:"prism-header",children:[e.jsx("h1",{className:"prism-title",children:"🌈 Color Prism Handwriting"}),e.jsx("p",{className:"prism-subtitle",children:"Transform your text into vibrant rainbow handwriting"})]}),e.jsxs("div",{className:"prism-layout",children:[e.jsxs("div",{className:"prism-input-section",children:[e.jsxs("h2",{className:"prism-section-title",children:[e.jsx("span",{children:"✨"}),"Text Input & Preview"]}),e.jsx("textarea",{value:d,onChange:a=>r(a.target.value),placeholder:`Enter your text here to see it transform into beautiful rainbow handwriting...

Try multiple lines!
Experiment with different colors and effects.`,className:"prism-textarea"}),e.jsx("div",{className:"prism-preview-container",children:e.jsx("div",{ref:fe,className:"prism-preview",style:{...he(),...ue()},children:e.jsx("div",{className:"prism-text-content",style:xe(),children:g==="floating"?be():e.jsx("div",{style:{fontFamily:V(),fontSize:`${c}px`,background:q(),WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",fontWeight:500,lineHeight:1.6},children:d||e.jsx("div",{className:"prism-placeholder",children:"Your rainbow handwriting will appear here... ✨"})})})})}),e.jsxs("div",{className:"prism-actions",children:[e.jsxs("button",{className:`prism-btn prism-btn-primary ${C?"success":""}`,onClick:we,disabled:!d.trim(),children:[e.jsx("span",{children:C?"✅":"📋"}),C?"Copied!":"Copy Text"]}),e.jsxs("button",{className:"prism-btn prism-btn-secondary",onClick:ve,disabled:!d.trim(),children:[e.jsx("span",{children:"💾"}),"Download Image"]})]}),d&&e.jsxs("div",{className:"prism-stats",children:[e.jsxs("div",{className:"prism-stat",children:[e.jsx("span",{className:"prism-stat-value",children:d.length}),e.jsx("span",{className:"prism-stat-label",children:"Characters"})]}),e.jsxs("div",{className:"prism-stat",children:[e.jsx("span",{className:"prism-stat-value",children:d.split(/\s+/).filter(a=>a.length>0).length}),e.jsx("span",{className:"prism-stat-label",children:"Words"})]}),e.jsxs("div",{className:"prism-stat",children:[e.jsx("span",{className:"prism-stat-value",children:d.split(`
`).length}),e.jsx("span",{className:"prism-stat-label",children:"Lines"})]})]})]}),e.jsxs("div",{className:"prism-controls",children:[e.jsxs("h2",{className:"prism-section-title",children:[e.jsx("span",{children:"🎨"}),"Customization"]}),e.jsxs("div",{className:"prism-control-group",children:[e.jsxs("label",{className:"prism-control-label",children:[e.jsx("span",{children:"🌍"}),"Language & Font",ce&&e.jsx("span",{children:"⏳"})]}),D&&e.jsxs("div",{style:{color:"#ff6b6b",fontSize:"0.8rem",marginBottom:"0.5rem"},children:["⚠️ ",D]}),e.jsxs("div",{className:"prism-dropdown",children:[e.jsxs("div",{className:"prism-dropdown-trigger",onClick:()=>$(!F),children:[e.jsxs("span",{children:[(Z=b.find(a=>a.value===s))==null?void 0:Z.flag," ",(J=b.find(a=>a.value===s))==null?void 0:J.label]}),e.jsx("span",{children:F?"▲":"▼"})]}),F&&e.jsx("div",{className:"prism-dropdown-menu",children:b.map(a=>e.jsxs("div",{className:`prism-dropdown-item ${s===a.value?"active":""}`,onClick:()=>{o(a.value),$(!1)},children:[e.jsx("span",{children:a.flag}),e.jsx("span",{children:a.label})]},a.value))})]})]}),e.jsxs("div",{className:"prism-control-group",children:[e.jsxs("label",{className:"prism-control-label",children:[e.jsx("span",{children:"🎨"}),"Color Theme"]}),e.jsxs("div",{className:"prism-dropdown",children:[e.jsx("div",{className:"prism-dropdown-trigger",onClick:()=>$(!1),children:e.jsx("span",{children:(X=k.find(a=>a.value===n))==null?void 0:X.label})}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"0.5rem",marginTop:"0.5rem"},children:k.map(a=>e.jsx("div",{onClick:()=>M(a.value),style:{padding:"0.5rem",borderRadius:"8px",background:a.gradient,color:"white",textAlign:"center",cursor:"pointer",border:n===a.value?"2px solid white":"2px solid transparent",fontSize:"0.8rem",fontWeight:"600"},children:a.label},a.value))})]})]}),e.jsxs("div",{className:"prism-control-group",children:[e.jsxs("label",{className:"prism-control-label",children:[e.jsx("span",{children:"📄"}),"Background Theme"]}),e.jsxs("div",{className:"prism-dropdown",children:[e.jsxs("div",{className:"prism-dropdown-trigger",onClick:()=>O(!T),children:[e.jsxs("span",{children:[(Q=u.find(a=>a.id===f))==null?void 0:Q.preview," ",(_=u.find(a=>a.id===f))==null?void 0:_.name]}),e.jsx("span",{children:T?"▲":"▼"})]}),T&&e.jsx("div",{className:"prism-dropdown-menu",children:u.map(a=>e.jsxs("div",{className:`prism-dropdown-item ${f===a.id?"active":""}`,onClick:()=>{pe(a.id),O(!1)},children:[e.jsx("span",{children:a.preview}),e.jsxs("div",{children:[e.jsx("div",{children:a.name}),e.jsx("div",{style:{fontSize:"0.7rem",opacity:.7},children:a.description})]})]},a.id))})]})]}),e.jsxs("div",{className:"prism-control-group",children:[e.jsxs("label",{className:"prism-control-label",children:[e.jsx("span",{children:"📏"}),"Text Size: ",c,"px"]}),e.jsx("input",{type:"range",value:c,onChange:a=>j(parseInt(a.target.value)),min:"16",max:"48",className:"prism-slider"})]}),e.jsxs("div",{className:"prism-control-group",children:[e.jsxs("label",{className:"prism-control-label",children:[e.jsx("span",{children:"📐"}),"Format"]}),e.jsxs("div",{className:"prism-dropdown",children:[e.jsxs("div",{className:"prism-dropdown-trigger",onClick:()=>G(!z),children:[e.jsxs("span",{children:[(ee=w.find(a=>a.id===h))==null?void 0:ee.icon," ",(ae=w.find(a=>a.id===h))==null?void 0:ae.name]}),e.jsx("span",{children:z?"▲":"▼"})]}),z&&e.jsx("div",{className:"prism-dropdown-menu",children:w.map(a=>e.jsxs("div",{className:`prism-dropdown-item ${h===a.id?"active":""}`,onClick:()=>{me(a.id),G(!1)},children:[e.jsx("span",{children:a.icon}),e.jsxs("div",{children:[e.jsx("div",{children:a.name}),e.jsx("div",{style:{fontSize:"0.7rem",opacity:.7},children:a.description})]})]},a.id))})]})]}),e.jsxs("div",{className:"prism-control-group",children:[e.jsxs("label",{className:"prism-control-label",children:[e.jsx("span",{children:"📍"}),"Text Effect"]}),e.jsxs("div",{className:"prism-dropdown",children:[e.jsxs("div",{className:"prism-dropdown-trigger",onClick:()=>H(!P),children:[e.jsxs("span",{children:[(te=y.find(a=>a.id===g))==null?void 0:te.icon," ",(re=y.find(a=>a.id===g))==null?void 0:re.name]}),e.jsx("span",{children:P?"▲":"▼"})]}),P&&e.jsx("div",{className:"prism-dropdown-menu",children:y.map(a=>e.jsxs("div",{className:`prism-dropdown-item ${g===a.id?"active":""}`,onClick:()=>{ge(a.id),H(!1)},children:[e.jsx("span",{children:a.icon}),e.jsxs("div",{children:[e.jsx("div",{children:a.name}),e.jsx("div",{style:{fontSize:"0.7rem",opacity:.7},children:a.description})]})]},a.id))})]})]})]})]})]})};export{Fe as default};
