import './polyfills.server.mjs';
import{a as o}from"./chunk-RXR3CHT6.mjs";import{i as n}from"./chunk-AFOT676I.mjs";var i=class extends o{constructor(){if(super(),typeof createImageBitmap>"u")throw new Error("Cannot decode WebImage as `createImageBitmap` is not available");if(typeof document>"u"&&typeof OffscreenCanvas>"u")throw new Error("Cannot decode WebImage as neither `document` nor `OffscreenCanvas` is not available")}decode(s,r){return n(this,null,function*(){let d=new Blob([r]),e=yield createImageBitmap(d),t;typeof document<"u"?(t=document.createElement("canvas"),t.width=e.width,t.height=e.height):t=new OffscreenCanvas(e.width,e.height);let a=t.getContext("2d");return a.drawImage(e,0,0),a.getImageData(0,0,e.width,e.height).data.buffer})}};export{i as default};
