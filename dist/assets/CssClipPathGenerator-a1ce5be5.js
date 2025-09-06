import{j as e}from"./index-425a4db3.js";import{r as p}from"./vendor-8a332d8f.js";import"./router-2c18f3be.js";import"./ui-86c81d4e.js";function N(){const[n,d]=p.useState("triangle"),[s,c]=p.useState("polygon(50% 0%, 0% 100%, 100% 100%)"),h=[{id:"triangle",name:"Triangle",path:"polygon(50% 0%, 0% 100%, 100% 100%)"},{id:"trapezoid",name:"Trapezoid",path:"polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"},{id:"parallelogram",name:"Parallelogram",path:"polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"},{id:"rhombus",name:"Rhombus",path:"polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"},{id:"pentagon",name:"Pentagon",path:"polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"},{id:"hexagon",name:"Hexagon",path:"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"},{id:"octagon",name:"Octagon",path:"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"},{id:"star",name:"Star",path:"polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"},{id:"circle",name:"Circle",path:"circle(50% at 50% 50%)"},{id:"ellipse",name:"Ellipse",path:"ellipse(25% 40% at 50% 50%)"},{id:"inset",name:"Inset",path:"inset(10% 20% 30% 40%)"},{id:"left-arrow",name:"Left Arrow",path:"polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)"},{id:"right-arrow",name:"Right Arrow",path:"polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)"},{id:"cross",name:"Cross",path:"polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)"},{id:"message",name:"Message",path:"polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)"},{id:"close",name:"Close",path:"polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)"}],m=t=>{d(t.id),c(t.path)},a=t=>{navigator.clipboard.writeText(t)},i=()=>`.clipped-element {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  clip-path: ${s};
  -webkit-clip-path: ${s};
}`,o=()=>'<div class="clipped-element"></div>',x=()=>{const t=i(),g=o(),j=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Clip Path</title>
    <style>
${t}

/* Center the demo */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f0f0f0;
}
    </style>
</head>
<body>
    ${g}
</body>
</html>`,b=new Blob([j],{type:"text/html"}),r=URL.createObjectURL(b),l=document.createElement("a");l.href=r,l.download=`${n}-clip-path.html`,l.click(),URL.revokeObjectURL(r)};return e.jsxs("div",{className:"tool-container",children:[e.jsxs("div",{className:"tool-header",children:[e.jsx("h1",{children:"CSS Clip Path Generator"}),e.jsx("p",{children:"Create complex shapes with CSS clip-path property inspired by Clippy"})]}),e.jsxs("div",{className:"css-clippath-layout",children:[e.jsxs("div",{className:"clippath-preview-section",children:[e.jsxs("div",{className:"preview-container",children:[e.jsx("h3",{children:"Preview"}),e.jsx("div",{className:"clippath-preview",children:e.jsx("div",{className:"clipped-demo",style:{width:"200px",height:"200px",background:"linear-gradient(45deg, #ff6b6b, #4ecdc4)",clipPath:s,WebkitClipPath:s}})})]}),e.jsxs("div",{className:"code-section",children:[e.jsxs("div",{className:"code-tabs",children:[e.jsx("button",{className:"code-tab active",children:"CSS"}),e.jsx("button",{className:"code-tab",children:"HTML"})]}),e.jsxs("div",{className:"code-content",children:[e.jsx("pre",{className:"code-block",children:e.jsx("code",{children:i()})}),e.jsx("button",{className:"copy-code-btn",onClick:()=>a(i()),children:"📋 Copy CSS"})]})]})]}),e.jsxs("div",{className:"clippath-controls-section",children:[e.jsxs("div",{className:"clippath-controls-header",children:[e.jsx("h3",{children:"Clip Path Shapes"}),e.jsx("p",{children:"Choose from predefined shapes"})]}),e.jsxs("div",{className:"clippath-controls",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Current Clip Path:"}),e.jsxs("div",{className:"clippath-input-group",children:[e.jsx("input",{type:"text",value:s,onChange:t=>c(t.target.value),className:"clippath-input",placeholder:"Enter custom clip-path value"}),e.jsx("button",{className:"copy-btn",onClick:()=>a(`clip-path: ${s};`),children:"📋"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Shape Library:"}),e.jsx("div",{className:"shape-grid",children:h.map(t=>e.jsxs("button",{className:`shape-btn ${n===t.id?"active":""}`,onClick:()=>m(t),title:t.path,children:[e.jsx("div",{className:"shape-preview",style:{clipPath:t.path,WebkitClipPath:t.path}}),e.jsx("span",{className:"shape-name",children:t.name})]},t.id))})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"action-btn",onClick:()=>a(o()),children:"📋 Copy HTML"}),e.jsx("button",{className:"action-btn primary",onClick:x,children:"📥 Download"})]}),e.jsxs("div",{className:"clippath-info",children:[e.jsx("h4",{children:"Clip Path Types:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Polygon:"})," Complex shapes with multiple points"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Circle:"})," Perfect circles with radius and position"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Ellipse:"})," Oval shapes with custom dimensions"]}),e.jsxs("li",{children:["• ",e.jsx("strong",{children:"Inset:"})," Rectangular cutouts with rounded corners"]})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Browser Support:"})," Modern browsers support clip-path. Use -webkit-clip-path for older WebKit browsers."]})]})]})]})]})]})}export{N as default};
