import{j as t}from"./index-425a4db3.js";import{r}from"./vendor-8a332d8f.js";import"./router-2c18f3be.js";import"./ui-86c81d4e.js";function C(){const[n,u]=r.useState("normal"),[s,l]=r.useState("#40bfc1"),[o,d]=r.useState("#f0134d"),[e,$]=r.useState(50),[p,g]=r.useState(!0),m=[{id:"normal",name:"Normal",description:"MoreToggles normal style"},{id:"ios",name:"iOS",description:"Apple iOS style toggle"},{id:"android",name:"Android",description:"Material Android style"},{id:"square",name:"Square",description:"Square toggle switch"},{id:"heart",name:"Heart",description:"Heart-shaped toggle"},{id:"star",name:"Star",description:"Star-shaped toggle"},{id:"emoji",name:"Emoji",description:"Emoji toggle switch"},{id:"transparent",name:"Transparent",description:"Transparent style"}],a=()=>{const i={normal:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*2.33}px;
  height: ${e}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${o};
  border-radius: ${e*.5}px;
  border: 1px solid rgba(117, 117, 117, 0.31);
  box-shadow: inset 0px 0px ${e*.08}px 0px rgba(0, 0, 0, 0.2), 0 -${e*.06}px ${e*.08}px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "";
  top: ${e*.08}px;
  left: ${e*.08}px;
  width: ${e*.83}px;
  height: ${e*.83}px;
  border-radius: ${e*.67}px;
  background: #fff;
  box-shadow: inset 1px -2px 2px rgba(0, 0, 0, 0.35);
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: -${e*.1}px;
  left: -${e*.08}px;
  width: calc(100% + ${e*.17}px);
  height: calc(100% + ${e*.17}px);
  background: transparent;
  border-radius: ${e}px;
  box-shadow: inset 0px ${e*.04}px ${e*.08}px -${e*.04}px rgba(0, 0, 0, 0.2), 0px ${e*.03}px ${e*.04}px 0px rgba(151, 151, 151, 0.2);
}

input:checked + .slider {
  background: ${s};
}

input:checked + .slider:before {
  transform: translateX(${e*1.4}px);
}`,ios:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*1.67}px;
  height: ${e}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f8f8;
  border-radius: ${e*.5}px;
  box-shadow: inset 0 0 0 0px ${s}, 0 0 0 ${e*.06}px #dddddd;
  transition: 0.25s ease-in-out;
}

.slider:before {
  position: absolute;
  content: "";
  width: ${e}px;
  height: ${e}px;
  border-radius: ${e*.5}px;
  background: #fff;
  box-shadow: 0 ${e*.125}px ${e*.125}px rgba(0, 0, 0, 0.2), 0 0 0 ${e*.06}px #dddddd;
  transition: 0.25s ease-in-out;
}

input:checked + .slider {
  box-shadow: inset 0 0 0 ${e*.5}px ${s}, 0 0 0 ${e*.06}px ${s};
}

input:checked + .slider:before {
  transform: translateX(${e*.67}px);
  box-shadow: 0 0 0 ${e*.06}px transparent, 0 ${e*.125}px ${e*.125}px rgba(0, 0, 0, 0.3);
}`,android:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*1.33}px;
  height: ${e*.58}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #848484 0%, #848484 50%, ${s} 50%, ${s} 100%);
  background-size: ${e*2.67}px ${e*.57}px;
  border-radius: ${e*.29}px;
  transition: all 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "";
  width: ${e*.75}px;
  height: ${e*.75}px;
  top: -${e*.08}px;
  left: 0;
  border-radius: ${e*.67}px;
  background: #fff;
  box-shadow: 0 ${e*.04}px ${e*.125}px rgba(0, 0, 0, 0.5);
  transition: 0.3s ease;
}

input:checked + .slider {
  background-position: -100%;
}

input:checked + .slider:before {
  transform: translateX(${e*.58}px);
}`,square:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*2}px;
  height: ${e}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${o};
  border-radius: ${e*.1}px;
  transition: 0.3s ease;
  border: 2px solid #ddd;
}

.slider:before {
  position: absolute;
  content: "";
  top: ${e*.05}px;
  left: ${e*.05}px;
  width: ${e*.85}px;
  height: ${e*.85}px;
  border-radius: ${e*.05}px;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${s};
  border-color: ${s};
}

input:checked + .slider:before {
  transform: translateX(${e*.95}px);
}`,heart:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*2}px;
  height: ${e}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${o};
  border-radius: ${e*.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "♡";
  top: 50%;
  left: ${e*.2}px;
  transform: translateY(-50%);
  font-size: ${e*.6}px;
  color: #fff;
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: ${e*.1}px;
  left: ${e*.1}px;
  width: ${e*.8}px;
  height: ${e*.8}px;
  border-radius: 50%;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${s};
}

input:checked + .slider:before {
  content: "♥";
  left: ${e*1.2}px;
}

input:checked + .slider:after {
  transform: translateX(${e}px);
}`,star:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*2}px;
  height: ${e}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${o};
  border-radius: ${e*.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "☆";
  top: 50%;
  left: ${e*.2}px;
  transform: translateY(-50%);
  font-size: ${e*.6}px;
  color: #fff;
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: ${e*.1}px;
  left: ${e*.1}px;
  width: ${e*.8}px;
  height: ${e*.8}px;
  border-radius: 50%;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${s};
}

input:checked + .slider:before {
  content: "★";
  left: ${e*1.2}px;
}

input:checked + .slider:after {
  transform: translateX(${e}px);
}`,emoji:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*2}px;
  height: ${e}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${o};
  border-radius: ${e*.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "😴";
  top: 50%;
  left: ${e*.15}px;
  transform: translateY(-50%);
  font-size: ${e*.5}px;
  transition: 0.3s ease;
}

.slider:after {
  position: absolute;
  content: "";
  top: ${e*.1}px;
  left: ${e*.1}px;
  width: ${e*.8}px;
  height: ${e*.8}px;
  border-radius: 50%;
  background: #fff;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: ${s};
}

input:checked + .slider:before {
  content: "😊";
  left: ${e*1.05}px;
}

input:checked + .slider:after {
  transform: translateX(${e}px);
}`,transparent:`
.switch {
  position: relative;
  display: inline-block;
  width: ${e*2}px;
  height: ${e}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  border: 2px solid ${o};
  border-radius: ${e*.5}px;
  transition: 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "";
  top: ${e*.05}px;
  left: ${e*.05}px;
  width: ${e*.85}px;
  height: ${e*.85}px;
  border-radius: 50%;
  background: ${o};
  transition: 0.3s ease;
}

input:checked + .slider {
  border-color: ${s};
}

input:checked + .slider:before {
  background: ${s};
  transform: translateX(${e*.95}px);
}`};return i[n]||i.normal},h=()=>`<label class="switch">
  <input type="checkbox"${p?" checked":""}>
  <span class="slider"></span>
</label>`,x=i=>{navigator.clipboard.writeText(i)},f=()=>{const i=a(),w=h(),k=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Toggle Switch</title>
    <style>
${i}
    </style>
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f3f4f6;">
        ${w}
    </div>
</body>
</html>`,j=new Blob([k],{type:"text/html"}),b=URL.createObjectURL(j),c=document.createElement("a");c.href=b,c.download=`${n}-switch.html`,c.click(),URL.revokeObjectURL(b)};return t.jsxs("div",{className:"tool-container",children:[t.jsxs("div",{className:"tool-header",children:[t.jsx("h1",{children:"CSS Switch Generator"}),t.jsx("p",{children:"Create beautiful toggle switches inspired by MoreToggles.css"})]}),t.jsxs("div",{className:"css-switch-layout",children:[t.jsxs("div",{className:"switch-preview-section",children:[t.jsxs("div",{className:"preview-container",children:[t.jsx("h3",{children:"Preview"}),t.jsxs("div",{className:"switch-preview",children:[t.jsxs("label",{className:"switch-demo",children:[t.jsx("input",{type:"checkbox",checked:p,onChange:i=>g(i.target.checked)}),t.jsx("span",{className:"slider-demo"})]}),t.jsx("style",{dangerouslySetInnerHTML:{__html:a().replace(/\.switch/g,".switch-demo").replace(/\.slider/g,".slider-demo")}})]})]}),t.jsxs("div",{className:"code-section",children:[t.jsxs("div",{className:"code-tabs",children:[t.jsx("button",{className:"code-tab active",children:"CSS"}),t.jsx("button",{className:"code-tab",children:"HTML"})]}),t.jsxs("div",{className:"code-content",children:[t.jsx("pre",{className:"code-block",children:t.jsx("code",{children:a()})}),t.jsx("button",{className:"copy-code-btn",onClick:()=>x(a()),children:"📋 Copy CSS"})]})]})]}),t.jsxs("div",{className:"switch-controls-section",children:[t.jsxs("div",{className:"switch-controls-header",children:[t.jsx("h3",{children:"Switch Settings"}),t.jsx("p",{children:"Customize your toggle switch"})]}),t.jsxs("div",{className:"switch-controls",children:[t.jsxs("div",{className:"control-group",children:[t.jsx("label",{children:"Switch Style:"}),t.jsx("div",{className:"switch-types",children:m.map(i=>t.jsxs("button",{className:`switch-type-btn ${n===i.id?"active":""}`,onClick:()=>u(i.id),children:[t.jsx("span",{className:"switch-name",children:i.name}),t.jsx("span",{className:"switch-desc",children:i.description})]},i.id))})]}),t.jsxs("div",{className:"control-group",children:[t.jsx("label",{children:"Primary Color (ON):"}),t.jsxs("div",{className:"color-input-group",children:[t.jsx("input",{type:"color",value:s,onChange:i=>l(i.target.value),className:"color-picker"}),t.jsx("input",{type:"text",value:s,onChange:i=>l(i.target.value),className:"color-text"})]})]}),t.jsxs("div",{className:"control-group",children:[t.jsx("label",{children:"Secondary Color (OFF):"}),t.jsxs("div",{className:"color-input-group",children:[t.jsx("input",{type:"color",value:o,onChange:i=>d(i.target.value),className:"color-picker"}),t.jsx("input",{type:"text",value:o,onChange:i=>d(i.target.value),className:"color-text"})]})]}),t.jsxs("div",{className:"control-group",children:[t.jsxs("label",{children:["Size: ",e,"px"]}),t.jsx("input",{type:"range",min:"20",max:"80",value:e,onChange:i=>$(parseInt(i.target.value)),className:"range-slider"})]}),t.jsxs("div",{className:"action-buttons",children:[t.jsx("button",{className:"action-btn",onClick:()=>x(h()),children:"📋 Copy HTML"}),t.jsx("button",{className:"action-btn primary",onClick:f,children:"📥 Download"})]})]})]})]})]})}export{C as default};
