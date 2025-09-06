import{j as e}from"./index-425a4db3.js";import{r as a}from"./vendor-8a332d8f.js";import"./router-2c18f3be.js";import"./ui-86c81d4e.js";function F(){const[r,p]=a.useState(16),[t,h]=a.useState(.25),[n,m]=a.useState(10),[i,x]=a.useState(1),[l,g]=a.useState(.18),[o,b]=a.useState(.8),c=()=>`.glass {
  background: rgba(255, 255, 255, ${t});
  border-radius: ${n}px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, ${o/10});
  backdrop-filter: blur(${r}px);
  -webkit-backdrop-filter: blur(${r}px);
  border: ${i}px solid rgba(255, 255, 255, ${l});
}`,u=()=>`<div class="glass">
  <h2>Glassmorphism Card</h2>
  <p>This is a beautiful glass effect created with CSS backdrop-filter and transparency.</p>
</div>`,j=s=>{navigator.clipboard.writeText(s)},y=()=>{p(16),h(.25),m(10),x(1),g(.18),b(.8)},v=()=>{const s=c(),N=u(),S=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glassmorphism Effect</title>
    <style>
body {
  margin: 0;
  padding: 40px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

${s}

.glass {
  padding: 40px;
  max-width: 400px;
  text-align: center;
}

.glass h2 {
  margin: 0 0 20px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 24px;
}

.glass p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}
    </style>
</head>
<body>
    ${N}
</body>
</html>`,k=new Blob([S],{type:"text/html"}),f=URL.createObjectURL(k),d=document.createElement("a");d.href=f,d.download="glassmorphism-effect.html",d.click(),URL.revokeObjectURL(f)};return e.jsxs("div",{className:"tool-container",children:[e.jsxs("div",{className:"tool-header",children:[e.jsx("h1",{children:"CSS Glassmorphism Generator"}),e.jsx("p",{children:"Create beautiful glass morphism effects with backdrop-filter"})]}),e.jsxs("div",{className:"css-glassmorphism-layout",children:[e.jsxs("div",{className:"glassmorphism-preview-section",children:[e.jsxs("div",{className:"preview-container",children:[e.jsx("h3",{children:"Preview"}),e.jsx("div",{className:"glassmorphism-preview",style:{backgroundImage:"url(https://plus.unsplash.com/premium_photo-1661882403999-46081e67c401?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D)",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"},children:e.jsxs("div",{className:"glass-demo",style:{background:`rgba(255, 255, 255, ${t})`,borderRadius:`${n}px`,boxShadow:`0 4px 30px rgba(0, 0, 0, ${o/10})`,backdropFilter:`blur(${r}px)`,WebkitBackdropFilter:`blur(${r}px)`,border:`${i}px solid rgba(255, 255, 255, ${l})`,padding:"40px",maxWidth:"350px",minHeight:"200px",textAlign:"center"},children:[e.jsx("h1",{style:{margin:"0 0 10px 0",color:"rgba(255, 255, 255, 0.95)",fontSize:"28px",fontWeight:"700",fontFamily:"Inter, system-ui, sans-serif"},children:"Glassmorphism"}),e.jsx("h2",{style:{margin:"0 0 15px 0",color:"rgba(255, 255, 255, 0.85)",fontSize:"18px",fontWeight:"500",fontFamily:"Inter, system-ui, sans-serif"},children:"Modern UI Design"}),e.jsx("p",{style:{margin:"0 0 12px 0",color:"rgba(255, 255, 255, 0.8)",fontSize:"14px",lineHeight:"1.5",fontFamily:"Inter, system-ui, sans-serif"},children:"Beautiful glass morphism effect with backdrop blur, transparency, and subtle borders."}),e.jsx("small",{style:{color:"rgba(255, 255, 255, 0.7)",fontSize:"12px",fontStyle:"italic",fontFamily:"Inter, system-ui, sans-serif"},children:"Perfect for modern web interfaces"})]})})]}),e.jsxs("div",{className:"code-section",children:[e.jsxs("div",{className:"code-tabs",children:[e.jsx("button",{className:"code-tab active",children:"CSS"}),e.jsx("button",{className:"code-tab",children:"HTML"})]}),e.jsxs("div",{className:"code-content",children:[e.jsx("pre",{className:"code-block",children:e.jsx("code",{children:c()})}),e.jsx("button",{className:"copy-code-btn",onClick:()=>j(c()),children:"📋 Copy CSS"})]})]})]}),e.jsxs("div",{className:"glassmorphism-controls-section",children:[e.jsxs("div",{className:"glassmorphism-controls-header",children:[e.jsx("h3",{children:"Glass Settings"}),e.jsx("p",{children:"Adjust glassmorphism properties"})]}),e.jsxs("div",{className:"glassmorphism-controls",children:[e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Blur: ",r,"px"]}),e.jsx("input",{type:"range",min:"0",max:"40",value:r,onChange:s=>p(parseInt(s.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Transparency: ",t]}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:t,onChange:s=>h(parseFloat(s.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Border Radius: ",n,"px"]}),e.jsx("input",{type:"range",min:"0",max:"50",value:n,onChange:s=>m(parseInt(s.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Border Width: ",i,"px"]}),e.jsx("input",{type:"range",min:"0",max:"5",value:i,onChange:s=>x(parseInt(s.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Border Opacity: ",l]}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:l,onChange:s=>g(parseFloat(s.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Shadow Intensity: ",o]}),e.jsx("input",{type:"range",min:"0",max:"2",step:"0.1",value:o,onChange:s=>b(parseFloat(s.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"action-btn",onClick:()=>j(u()),children:"📋 Copy HTML"}),e.jsx("button",{className:"action-btn",onClick:y,children:"🔄 Reset"}),e.jsx("button",{className:"action-btn primary",onClick:v,children:"📥 Download"})]}),e.jsxs("div",{className:"glassmorphism-info",children:[e.jsx("h4",{children:"Glassmorphism Properties:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Backdrop Filter:"})," Creates the blur effect"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Transparency:"})," Controls background opacity"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Border:"})," Semi-transparent border for depth"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Box Shadow:"})," Adds depth and elevation"]})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Browser Support:"})," Modern browsers support backdrop-filter. Use -webkit-backdrop-filter for Safari."]})]})]})]})]})]})}export{F as default};
