import{j as e}from"./index-425a4db3.js";import{r}from"./vendor-8a332d8f.js";import"./router-2c18f3be.js";import"./ui-86c81d4e.js";function S(){const[a,b]=r.useState("check-a"),[t,l]=r.useState("#4CAF50"),[c,h]=r.useState("#ccc"),[i,u]=r.useState(24),[d,x]=r.useState(!0),g=[{id:"check-a",name:"Check A",description:"Animated checkmark"},{id:"check-b",name:"Check B",description:"Bouncing background"},{id:"check-c",name:"Check C",description:"Filled background"},{id:"check-d",name:"Check D",description:"Scale animation"},{id:"material",name:"Material",description:"Material Design style"},{id:"ios",name:"iOS",description:"Apple iOS style"},{id:"toggle",name:"Toggle",description:"Toggle switch style"},{id:"round",name:"Round",description:"Circular checkbox"}],n=()=>{const o={"check-a":`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${c};
  transition: all 0.2s ease-in-out;
}

.checkbox-container input:checked ~ .checkmark {
  border-color: ${t};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid ${t};
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  animation: checkmark 0.4s ease-in-out;
}

@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
  }
  50% {
    height: 0;
    width: 0.25em;
  }
  100% {
    height: 0.5em;
    width: 0.25em;
  }
}`,"check-b":`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${c};
  border-radius: 0.125em;
  transition: all 0.2s ease-in-out;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${t};
  border-color: ${t};
  animation: bounce 0.5s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}`,"check-c":`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: ${c};
  border-radius: 0.125em;
  transition: all 0.2s ease-in-out;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${t};
  animation: bounce 0.5s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.checkmark:after {
  content: "";
  position: absolute;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}`,"check-d":`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${c};
  border-radius: 0.125em;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${t};
  border-color: ${t};
  transform: scale(1.1);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  animation: scale-in 0.3s ease;
}

@keyframes scale-in {
  0% {
    transform: rotate(45deg) scale(0);
  }
  100% {
    transform: rotate(45deg) scale(1);
  }
}`,material:`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: transparent;
  border: 2px solid ${c};
  border-radius: 2px;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${t};
  border-color: ${t};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.3em;
  top: 0.1em;
  width: 0.2em;
  height: 0.4em;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}`,ios:`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 1px solid ${c};
  border-radius: 50%;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${t};
  border-color: ${t};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.2em;
  height: 0.4em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}`,toggle:`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 2em;
  background-color: ${c};
  border-radius: 1em;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${t};
}

.checkmark:after {
  content: "";
  position: absolute;
  top: 0.1em;
  left: 0.1em;
  width: 0.8em;
  height: 0.8em;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark:after {
  transform: translateX(1em);
}`,round:`
.checkbox-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: ${i}px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: white;
  border: 2px solid ${c};
  border-radius: 50%;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: ${t};
  border-color: ${t};
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.35em;
  top: 0.15em;
  width: 0.2em;
  height: 0.4em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}`};return o[a]||o["check-a"]},p=()=>`<label class="checkbox-container">
  <input type="checkbox"${d?" checked":""}>
  <span class="checkmark"></span>
</label>`,k=o=>{navigator.clipboard.writeText(o)},f=()=>{const o=n(),y=p(),w=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Checkbox</title>
    <style>
${o}
    </style>
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f3f4f6;">
        ${y}
    </div>
</body>
</html>`,j=new Blob([w],{type:"text/html"}),m=URL.createObjectURL(j),s=document.createElement("a");s.href=m,s.download=`${a}-checkbox.html`,s.click(),URL.revokeObjectURL(m)};return e.jsxs("div",{className:"tool-container",children:[e.jsxs("div",{className:"tool-header",children:[e.jsx("h1",{children:"CSS Checkbox Generator"}),e.jsx("p",{children:"Create beautiful custom checkboxes inspired by Checkbox.css"})]}),e.jsxs("div",{className:"css-checkbox-layout",children:[e.jsxs("div",{className:"checkbox-preview-section",children:[e.jsxs("div",{className:"preview-container",children:[e.jsx("h3",{children:"Preview"}),e.jsxs("div",{className:"checkbox-preview",children:[e.jsxs("label",{className:"checkbox-demo",children:[e.jsx("input",{type:"checkbox",checked:d,onChange:o=>x(o.target.checked)}),e.jsx("span",{className:"checkmark-demo"})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:n().replace(/\.checkbox-container/g,".checkbox-demo").replace(/\.checkmark/g,".checkmark-demo")}})]})]}),e.jsxs("div",{className:"code-section",children:[e.jsxs("div",{className:"code-tabs",children:[e.jsx("button",{className:"code-tab active",children:"CSS"}),e.jsx("button",{className:"code-tab",children:"HTML"})]}),e.jsxs("div",{className:"code-content",children:[e.jsx("pre",{className:"code-block",children:e.jsx("code",{children:n()})}),e.jsx("button",{className:"copy-code-btn",onClick:()=>k(n()),children:"📋 Copy CSS"})]})]})]}),e.jsxs("div",{className:"checkbox-controls-section",children:[e.jsxs("div",{className:"checkbox-controls-header",children:[e.jsx("h3",{children:"Checkbox Settings"}),e.jsx("p",{children:"Customize your checkbox design"})]}),e.jsxs("div",{className:"checkbox-controls",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Checkbox Style:"}),e.jsx("div",{className:"checkbox-types",children:g.map(o=>e.jsxs("button",{className:`checkbox-type-btn ${a===o.id?"active":""}`,onClick:()=>b(o.id),children:[e.jsx("span",{className:"checkbox-name",children:o.name}),e.jsx("span",{className:"checkbox-desc",children:o.description})]},o.id))})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Checked Color:"}),e.jsxs("div",{className:"color-input-group",children:[e.jsx("input",{type:"color",value:t,onChange:o=>l(o.target.value),className:"color-picker"}),e.jsx("input",{type:"text",value:t,onChange:o=>l(o.target.value),className:"color-text"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Unchecked Color:"}),e.jsxs("div",{className:"color-input-group",children:[e.jsx("input",{type:"color",value:c,onChange:o=>h(o.target.value),className:"color-picker"}),e.jsx("input",{type:"text",value:c,onChange:o=>h(o.target.value),className:"color-text"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Size: ",i,"px"]}),e.jsx("input",{type:"range",min:"16",max:"48",value:i,onChange:o=>u(parseInt(o.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"action-btn",onClick:()=>k(p()),children:"📋 Copy HTML"}),e.jsx("button",{className:"action-btn primary",onClick:f,children:"📥 Download"})]})]})]})]})]})}export{S as default};
