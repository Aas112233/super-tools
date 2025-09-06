import{j as e}from"./index-425a4db3.js";import{r as s}from"./vendor-8a332d8f.js";import"./router-2c18f3be.js";import"./ui-86c81d4e.js";function N(){const[o,m]=s.useState("spinner"),[n,c]=s.useState("#3b82f6"),[i,v]=s.useState(40),[a,x]=s.useState(1),$=[{id:"spinner",name:"Spinner",description:"Classic rotating spinner"},{id:"dots",name:"Dots",description:"Three bouncing dots"},{id:"pulse",name:"Pulse",description:"Pulsing circle"},{id:"bars",name:"Bars",description:"Loading bars"},{id:"ring",name:"Ring",description:"Rotating ring"},{id:"wave",name:"Wave",description:"Wave animation"},{id:"ripple",name:"Ripple",description:"Ripple effect loader"},{id:"grid",name:"Grid",description:"3x3 grid animation"},{id:"heart",name:"Heart",description:"Beating heart loader"},{id:"hourglass",name:"Hourglass",description:"Hourglass rotation"}],r=()=>{const t={spinner:`
.loader {
  width: ${i}px;
  height: ${i}px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${n};
  border-radius: 50%;
  animation: spin ${2/a}s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,dots:`
.loader {
  display: inline-block;
  position: relative;
  width: ${i*2}px;
  height: ${i/2}px;
}

.loader div {
  position: absolute;
  top: 0;
  width: ${i/4}px;
  height: ${i/4}px;
  border-radius: 50%;
  background: ${n};
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader div:nth-child(1) {
  left: ${i/8}px;
  animation: dots1 ${1.2/a}s infinite;
}

.loader div:nth-child(2) {
  left: ${i/8}px;
  animation: dots2 ${1.2/a}s infinite;
}

.loader div:nth-child(3) {
  left: ${i/2.67}px;
  animation: dots2 ${1.2/a}s infinite;
}

.loader div:nth-child(4) {
  left: ${i/1.6}px;
  animation: dots3 ${1.2/a}s infinite;
}

@keyframes dots1 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes dots3 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}

@keyframes dots2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(${i/2.67}px, 0); }
}`,pulse:`
.loader {
  display: inline-block;
  width: ${i}px;
  height: ${i}px;
  background-color: ${n};
  border-radius: 100%;
  animation: pulse-scale ${1/a}s infinite ease-in-out;
}

@keyframes pulse-scale {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1.0);
    opacity: 0;
  }
}`,bars:`
.loader {
  display: inline-block;
  position: relative;
  width: ${i}px;
  height: ${i}px;
}

.loader div {
  display: inline-block;
  position: absolute;
  left: ${i/10}px;
  width: ${i/8}px;
  background: ${n};
  animation: bars ${1.2/a}s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.loader div:nth-child(1) {
  left: ${i/10}px;
  animation-delay: -${.24/a}s;
}

.loader div:nth-child(2) {
  left: ${i/3.33}px;
  animation-delay: -${.12/a}s;
}

.loader div:nth-child(3) {
  left: ${i/2}px;
  animation-delay: 0;
}

@keyframes bars {
  0% {
    top: ${i/10}px;
    height: ${i*.8}px;
  }
  50%, 100% {
    top: ${i/2.5}px;
    height: ${i/2.5}px;
  }
}`,ring:`
.loader {
  display: inline-block;
  width: ${i}px;
  height: ${i}px;
}

.loader:after {
  content: " ";
  display: block;
  width: ${i*.8}px;
  height: ${i*.8}px;
  margin: ${i*.1}px;
  border-radius: 50%;
  border: ${i*.1}px solid ${n};
  border-color: ${n} transparent ${n} transparent;
  animation: ring ${1.2/a}s linear infinite;
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`,wave:`
.loader {
  display: inline-block;
  position: relative;
  width: ${i}px;
  height: ${i}px;
}

.loader div {
  position: absolute;
  top: ${i/2.5}px;
  width: ${i/8}px;
  height: ${i/8}px;
  border-radius: 50%;
  background: ${n};
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader div:nth-child(1) {
  left: ${i/10}px;
  animation: wave1 ${.6/a}s infinite;
}

.loader div:nth-child(2) {
  left: ${i/10}px;
  animation: wave2 ${.6/a}s infinite;
}

.loader div:nth-child(3) {
  left: ${i/2.5}px;
  animation: wave2 ${.6/a}s infinite;
}

.loader div:nth-child(4) {
  left: ${i/1.67}px;
  animation: wave3 ${.6/a}s infinite;
}

@keyframes wave1 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes wave3 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}

@keyframes wave2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(${i/2.5}px, 0); }
}`,ripple:`
.loader {
  display: inline-block;
  position: relative;
  width: ${i}px;
  height: ${i}px;
}

.loader div {
  position: absolute;
  border: 4px solid ${n};
  opacity: 1;
  border-radius: 50%;
  animation: ripple ${1/a}s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.loader div:nth-child(2) {
  animation-delay: -${.5/a}s;
}

@keyframes ripple {
  0% {
    top: ${i/2.22}px;
    left: ${i/2.22}px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: ${i*.9}px;
    height: ${i*.9}px;
    opacity: 0;
  }
}`,grid:`
.loader {
  display: inline-block;
  position: relative;
  width: ${i}px;
  height: ${i}px;
}

.loader div {
  position: absolute;
  width: ${i/6}px;
  height: ${i/6}px;
  border-radius: 50%;
  background: ${n};
  animation: grid ${1.2/a}s linear infinite;
}

.loader div:nth-child(1) { top: ${i/10}px; left: ${i/10}px; animation-delay: 0s; }
.loader div:nth-child(2) { top: ${i/10}px; left: ${i/2.5}px; animation-delay: -${.4/a}s; }
.loader div:nth-child(3) { top: ${i/10}px; left: ${i/1.43}px; animation-delay: -${.8/a}s; }
.loader div:nth-child(4) { top: ${i/2.5}px; left: ${i/10}px; animation-delay: -${.4/a}s; }
.loader div:nth-child(5) { top: ${i/2.5}px; left: ${i/2.5}px; animation-delay: -${.8/a}s; }
.loader div:nth-child(6) { top: ${i/2.5}px; left: ${i/1.43}px; animation-delay: -${1.2/a}s; }
.loader div:nth-child(7) { top: ${i/1.43}px; left: ${i/10}px; animation-delay: -${.8/a}s; }
.loader div:nth-child(8) { top: ${i/1.43}px; left: ${i/2.5}px; animation-delay: -${1.2/a}s; }
.loader div:nth-child(9) { top: ${i/1.43}px; left: ${i/1.43}px; animation-delay: -${1.6/a}s; }

@keyframes grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}`,heart:`
.loader {
  display: inline-block;
  position: relative;
  width: ${i}px;
  height: ${i}px;
  transform: rotate(45deg);
  transform-origin: ${i/2}px ${i/2}px;
}

.loader div {
  top: ${i/2.5}px;
  left: ${i/2.5}px;
  position: absolute;
  width: ${i/2.5}px;
  height: ${i/2.5}px;
  background: ${n};
  animation: heart ${1.2/a}s infinite ease-in-out;
}

.loader div:after,
.loader div:before {
  content: ' ';
  position: absolute;
  display: block;
  width: ${i/2.5}px;
  height: ${i/2.5}px;
  background: ${n};
}

.loader div:before {
  left: -${i/3.57}px;
  border-radius: 50% 0 0 50%;
}

.loader div:after {
  top: -${i/3.57}px;
  border-radius: 50% 50% 0 0;
}

@keyframes heart {
  0% {
    transform: scale(0.95);
  }
  5% {
    transform: scale(1.1);
  }
  39% {
    transform: scale(0.85);
  }
  45% {
    transform: scale(1);
  }
  60% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(0.9);
  }
}`,hourglass:`
.loader {
  display: inline-block;
  position: relative;
  width: ${i}px;
  height: ${i}px;
}

.loader:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: ${i/10}px;
  box-sizing: border-box;
  border: ${i/2.5}px solid ${n};
  border-color: ${n} transparent ${n} transparent;
  animation: hourglass ${1.2/a}s infinite;
}

@keyframes hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}`};return t[o]||t.spinner},d=()=>{const t={spinner:'<div class="loader"></div>',dots:'<div class="loader"><div></div><div></div><div></div><div></div></div>',pulse:'<div class="loader"></div>',bars:'<div class="loader"><div></div><div></div><div></div></div>',ring:'<div class="loader"></div>',wave:'<div class="loader"><div></div><div></div><div></div><div></div></div>',ripple:'<div class="loader"><div></div><div></div></div>',grid:'<div class="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',heart:'<div class="loader"><div></div></div>',hourglass:'<div class="loader"></div>'};return t[o]||t.spinner},p=t=>{navigator.clipboard.writeText(t)},f=()=>{const t=r(),u=d(),b=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Loader</title>
    <style>
${t}
    </style>
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        ${u}
    </div>
</body>
</html>`,g=new Blob([b],{type:"text/html"}),h=URL.createObjectURL(g),l=document.createElement("a");l.href=h,l.download=`${o}-loader.html`,l.click(),URL.revokeObjectURL(h)};return e.jsxs("div",{className:"tool-container",children:[e.jsxs("div",{className:"tool-header",children:[e.jsx("h1",{children:"CSS Loader Generator"}),e.jsx("p",{children:"Create beautiful loading animations with customizable CSS"})]}),e.jsxs("div",{className:"css-loader-layout",children:[e.jsxs("div",{className:"loader-preview-section",children:[e.jsxs("div",{className:"preview-container",children:[e.jsx("h3",{children:"Preview"}),e.jsxs("div",{className:"loader-preview",children:[e.jsx("div",{className:"loader-demo",dangerouslySetInnerHTML:{__html:d()}}),e.jsx("style",{dangerouslySetInnerHTML:{__html:r()}})]})]}),e.jsxs("div",{className:"code-section",children:[e.jsxs("div",{className:"code-tabs",children:[e.jsx("button",{className:"code-tab active",children:"CSS"}),e.jsx("button",{className:"code-tab",children:"HTML"})]}),e.jsxs("div",{className:"code-content",children:[e.jsx("pre",{className:"code-block",children:e.jsx("code",{children:r()})}),e.jsx("button",{className:"copy-code-btn",onClick:()=>p(r()),children:"📋 Copy CSS"})]})]})]}),e.jsxs("div",{className:"loader-controls-section",children:[e.jsxs("div",{className:"loader-controls-header",children:[e.jsx("h3",{children:"Loader Settings"}),e.jsx("p",{children:"Customize your loading animation"})]}),e.jsxs("div",{className:"loader-controls",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Loader Type:"}),e.jsx("div",{className:"loader-types",children:$.map(t=>e.jsxs("button",{className:`loader-type-btn ${o===t.id?"active":""}`,onClick:()=>m(t.id),children:[e.jsx("span",{className:"loader-name",children:t.name}),e.jsx("span",{className:"loader-desc",children:t.description})]},t.id))})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Primary Color:"}),e.jsxs("div",{className:"color-input-group",children:[e.jsx("input",{type:"color",value:n,onChange:t=>c(t.target.value),className:"color-picker"}),e.jsx("input",{type:"text",value:n,onChange:t=>c(t.target.value),className:"color-text"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Size: ",i,"px"]}),e.jsx("input",{type:"range",min:"20",max:"100",value:i,onChange:t=>v(parseInt(t.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{children:["Speed: ",a,"x"]}),e.jsx("input",{type:"range",min:"0.5",max:"3",step:"0.1",value:a,onChange:t=>x(parseFloat(t.target.value)),className:"range-slider"})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"action-btn",onClick:()=>p(d()),children:"📋 Copy HTML"}),e.jsx("button",{className:"action-btn primary",onClick:f,children:"📥 Download"})]})]})]})]})]})}export{N as default};
