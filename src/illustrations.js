import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const descriptions={payments:'Três cartões de pagamento completos, com chip, aproximação e numeração mascarada, flutuando suavemente.',assets:'Três moedas sólidas em prata, grafite e dourado, com símbolos de dólar, ativo digital e bitcoin.',globe:'Globo com continentes e meridianos girando lentamente, cercado por uma órbita dourada contínua.'};
const material=(color,roughness=.25)=>new THREE.MeshStandardMaterial({color,metalness:1,roughness});

function textureFrom(canvas,renderer){
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return texture;
}
function softShadow(scene,width,depth,opacity=.22){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d');const grad=ctx.createRadialGradient(64,64,4,64,64,62);
  grad.addColorStop(0,'rgba(0,0,0,.7)');grad.addColorStop(.4,'rgba(0,0,0,.4)');grad.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(width,depth),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,opacity,depthWrite:false}));
  plane.rotation.x=-Math.PI/2;plane.position.y=-1.75;scene.add(plane);return plane;
}
function roundedShape(width,height,radius){
  const x=-width/2,y=-height/2,s=new THREE.Shape();
  s.moveTo(x+radius,y);s.lineTo(x+width-radius,y);s.quadraticCurveTo(x+width,y,x+width,y+radius);
  s.lineTo(x+width,y+height-radius);s.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);
  s.lineTo(x+radius,y+height);s.quadraticCurveTo(x,y+height,x,y+height-radius);
  s.lineTo(x,y+radius);s.quadraticCurveTo(x,y,x+radius,y);return s;
}
function faceGeometry(shape,width,height){
  const geometry=new THREE.ShapeGeometry(shape,32),positions=geometry.attributes.position,uv=geometry.attributes.uv;
  for(let i=0;i<positions.count;i++)uv.setXY(i,(positions.getX(i)+width/2)/width,(positions.getY(i)+height/2)/height);
  return geometry;
}
function cardTexture(theme,renderer){
  const c=document.createElement('canvas');c.width=1024;c.height=646;const ctx=c.getContext('2d');
  const dark=theme==='navy';const gradient=ctx.createLinearGradient(0,0,1024,646);
  if(dark){gradient.addColorStop(0,'#263f54');gradient.addColorStop(.52,'#112637');gradient.addColorStop(1,'#07131e');}
  else{gradient.addColorStop(0,theme==='silver'?'#fafafa':'#f8f6f0');gradient.addColorStop(.48,theme==='silver'?'#c5cbd0':'#e2e3df');gradient.addColorStop(1,theme==='silver'?'#f3f4f4':'#f7f7f4');}
  ctx.fillStyle=gradient;ctx.fillRect(0,0,c.width,c.height);
  // Fine engraving and a quiet studio reflection, drawn directly onto the card face.
  ctx.save();ctx.globalAlpha=dark?.045:.08;ctx.strokeStyle=dark?'#ffffff':'#7b858e';ctx.lineWidth=1;
  for(let y=2;y<646;y+=4){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1024,y-45);ctx.stroke();}ctx.restore();
  ctx.fillStyle=dark?'#f3f5f6':'#253441';ctx.font='500 30px Arial';ctx.fillText('PAYMENTS',78,94);
  ctx.fillStyle=dark?'#94a8b8':'#697681';ctx.font='19px Arial';ctx.fillText('GLOBAL INFRASTRUCTURE',78,131);
  // EMV chip: a solid module with its individual contacts, never a hole.
  const chip=ctx.createLinearGradient(80,215,224,307);chip.addColorStop(0,'#ffe7a1');chip.addColorStop(.45,'#d9b45d');chip.addColorStop(1,'#a17c31');
  ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect(80,215,147,104,15);ctx.fill();
  ctx.strokeStyle='#8c713b';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.roundRect(127,234,52,67,9);ctx.stroke();
  for(const y of [247,285]){ctx.beginPath();ctx.moveTo(80,y);ctx.lineTo(127,y);ctx.moveTo(179,y);ctx.lineTo(227,y);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(153,215);ctx.lineTo(153,234);ctx.moveTo(153,301);ctx.lineTo(153,319);ctx.stroke();
  ctx.strokeStyle=dark?'#e5ebef':'#54616b';ctx.lineWidth=5;ctx.lineCap='round';
  for(const r of [18,32,46]){ctx.beginPath();ctx.arc(265,267,r,-.78,.78);ctx.stroke();}
  ctx.fillStyle=dark?'#e8edf0':'#414e58';ctx.font='33px monospace';ctx.fillText('••••  ••••  ••••  ••••',80,432);
  ctx.fillStyle=dark?'#b7c3cc':'#6b757c';ctx.font='19px Arial';ctx.fillText('GLOBAL PAYMENTS',80,550);ctx.font='17px monospace';ctx.fillText('VALID THRU   ••/••',80,582);
  ctx.fillStyle=dark?'#e6ebed':'#68747e';ctx.beginPath();ctx.arc(853,548,34,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=.5;ctx.beginPath();ctx.arc(894,548,34,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  return textureFrom(c,renderer);
}
function paymentCards(scene,renderer){
  const shape=roundedShape(3.15,1.986,.16),face=faceGeometry(shape,3.15,1.986);
  const bodyGeo=new THREE.ExtrudeGeometry(shape,{depth:.055,steps:1,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:3,curveSegments:24});
  const cards=['silver','navy','pearl'].map((theme,i)=>{
    const group=new THREE.Group();
    const body=new THREE.Mesh(bodyGeo,material(theme==='navy'?0x172332:0x949ba0,.26));body.position.z=-.03;group.add(body);
    const front=new THREE.Mesh(face,new THREE.MeshBasicMaterial({map:cardTexture(theme,renderer)}));front.position.z=.04;group.add(front);
    const x=[-.28,0,.28][i],y=[.87,0,-.87][i],z=[-.5,0,.5][i];
    group.position.set(x,y,z);group.rotation.set(-.05,-.16,-.12);scene.add(group);return{group,x,y,z};
  });
  softShadow(scene,5.1,2.8,.24);
  return time=>cards.forEach(({group,x,y,z},i)=>{
    group.position.set(x+Math.sin(time*.55+i)*.025,y+Math.sin(time*.85+i*.7)*.065,z);
    group.rotation.y=-.16+Math.sin(time*.5+i)*.035;group.rotation.z=-.12+Math.sin(time*.65+i)*.012;
  });
}
function coinTexture(kind,palette,renderer){
  const c=document.createElement('canvas');c.width=c.height=768;const ctx=c.getContext('2d');
  const gold=palette==='gold',dark=palette==='graphite';
  const grad=ctx.createLinearGradient(80,60,700,740);
  [gold?'#fff0ae':dark?'#57616a':'#fbfcfc',gold?'#ddac36':dark?'#19252e':'#bfc6cc',gold?'#f4d67e':dark?'#3b4751':'#e7ecef'].forEach((color,i)=>grad.addColorStop(i*.5,color));
  ctx.fillStyle=grad;ctx.fillRect(0,0,768,768);
  const ink=gold?'#9c7121':dark?'#a1aeb7':'#7c8a95',light=gold?'#fff1b5':dark?'#d8e1e7':'#fff';
  ctx.strokeStyle=ink;ctx.lineWidth=3;
  for(const r of [325,312,293]){ctx.beginPath();ctx.arc(384,384,r,0,Math.PI*2);ctx.stroke();}
  ctx.globalAlpha=.45;ctx.strokeStyle=light;ctx.lineWidth=2;
  for(let i=0;i<80;i++){const a=i*Math.PI*2/80;ctx.beginPath();ctx.moveTo(384+Math.cos(a)*313,384+Math.sin(a)*313);ctx.lineTo(384+Math.cos(a)*325,384+Math.sin(a)*325);ctx.stroke();}ctx.globalAlpha=1;
  const drawSymbol=(color,dx=0,dy=0)=>{
    ctx.save();ctx.translate(384+dx,384+dy);ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=12;ctx.lineJoin='round';
    if(kind==='bitcoin'){
      ctx.font='bold 330px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('B',0,15);
      for(const x of [-32,25]){ctx.beginPath();ctx.moveTo(x,-178);ctx.lineTo(x,173);ctx.stroke();}
    }else if(kind==='dollar'){
      ctx.font='500 330px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('$',0,14);
    }else{
      ctx.beginPath();ctx.moveTo(0,-170);ctx.lineTo(111,0);ctx.lineTo(0,171);ctx.lineTo(-111,0);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-111,0);ctx.lineTo(0,49);ctx.lineTo(111,0);ctx.moveTo(0,-170);ctx.lineTo(0,49);ctx.stroke();
    }ctx.restore();
  };
  drawSymbol(light,-3,-5);drawSymbol(ink,2,3);
  return textureFrom(c,renderer);
}
function digitalCoins(scene,renderer){
  const bodyGeo=new THREE.CylinderGeometry(.94,.94,.135,96);bodyGeo.rotateX(Math.PI/2);
  const faceGeo=new THREE.CircleGeometry(.912,96),rimGeo=new THREE.TorusGeometry(.917,.018,12,96);
  const configurations=[{kind:'dollar',palette:'silver',color:0xb8c1c8,x:-.84,y:.5,z:-.25,turn:-.22},{kind:'asset',palette:'graphite',color:0x34434f,x:.82,y:.42,z:-.25,turn:.24},{kind:'bitcoin',palette:'gold',color:0xe8b73d,x:0,y:-.55,z:.42,turn:-.08}];
  const coins=configurations.map((config,i)=>{
    const group=new THREE.Group(),metal=material(config.color,.23);
    group.add(new THREE.Mesh(bodyGeo,metal));
    const face=new THREE.Mesh(faceGeo,new THREE.MeshBasicMaterial({map:coinTexture(config.kind,config.palette,renderer)}));face.position.z=.07;group.add(face);
    const rim=new THREE.Mesh(rimGeo,metal);rim.position.z=.072;group.add(rim);
    const ridges=new THREE.InstancedMesh(new THREE.BoxGeometry(.025,.027,.135),metal,80),dummy=new THREE.Object3D();
    for(let n=0;n<80;n++){const angle=n*Math.PI*2/80;dummy.position.set(Math.cos(angle)*.938,Math.sin(angle)*.938,0);dummy.rotation.z=angle;dummy.updateMatrix();ridges.setMatrixAt(n,dummy.matrix);}group.add(ridges);
    group.position.set(config.x,config.y,config.z);group.rotation.set(-.08,config.turn,[.12,-.12,-.08][i]);scene.add(group);return{...config,group};
  });
  softShadow(scene,4.7,2.5,.25);
  return time=>coins.forEach(({group,x,y,z,turn},i)=>{
    group.position.set(x,y+Math.sin(time*.8+i*1.4)*.075,z);
    group.rotation.y=turn+Math.sin(time*.55+i)*.08;group.rotation.x=-.08+Math.sin(time*.4+i)*.025;
  });
}
async function worldTexture(renderer){
  const response=await fetch('assets/world-land.geojson');if(!response.ok)throw new Error('World map unavailable');
  const data=await response.json(),c=document.createElement('canvas');c.width=2048;c.height=1024;const ctx=c.getContext('2d');
  ctx.fillStyle='#dce2e5';ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#83929d';ctx.strokeStyle='#70808d';ctx.lineWidth=.8;
  const point=([lon,lat])=>[(lon+180)/360*c.width,(90-lat)/180*c.height];
  for(const feature of data.features){
    const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
    for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){ring.forEach((coord,i)=>{const [x,y]=point(coord);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.closePath();}ctx.fill('evenodd');ctx.stroke();}
  }
  ctx.strokeStyle='rgba(53,74,89,.16)';ctx.lineWidth=1.5;
  for(let lon=-180;lon<=180;lon+=30){const x=(lon+180)/360*c.width;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}
  for(let lat=-60;lat<=60;lat+=30){const y=(90-lat)/180*c.height;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
  const texture=textureFrom(c,renderer);texture.wrapS=THREE.RepeatWrapping;return texture;
}
async function globalGlobe(scene,renderer){
  const globe=new THREE.Mesh(new THREE.SphereGeometry(1.15,96,64),new THREE.MeshStandardMaterial({map:await worldTexture(renderer),color:0xffffff,metalness:.23,roughness:.58}));
  globe.position.y=.12;globe.rotation.z=.08;scene.add(globe);
  const orbit=new THREE.Group();orbit.position.y=.12;orbit.rotation.set(.95,.12,-.52);
  const gold=material(0xe4ad28,.23),ring=new THREE.Mesh(new THREE.TorusGeometry(1.58,.031,12,192),gold);orbit.add(ring);
  const satellite=new THREE.Mesh(new THREE.SphereGeometry(.095,24,16),material(0x263746,.25));orbit.add(satellite);scene.add(orbit);
  const halo=new THREE.Mesh(new THREE.TorusGeometry(.1,.012,8,40),gold);halo.rotation.x=Math.PI/2;satellite.add(halo);
  softShadow(scene,4.2,2.6,.24);
  return time=>{globe.rotation.y=-1.1+time*.085;const angle=time*.3-2.2;satellite.position.set(Math.cos(angle)*1.58,Math.sin(angle)*1.58,0);};
}

async function mount(host){
  const kind=host.dataset.illustration;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  renderer.domElement.className='illustration-canvas';renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label',descriptions[kind]);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xffffff);
  const camera=new THREE.OrthographicCamera(-3,3,2.25,-2.25,.1,50);
  if(kind==='payments')camera.position.set(2.2,2.3,8);
  else if(kind==='assets')camera.position.set(.7,1.2,8);
  else camera.position.set(0,1.25,7);
  camera.lookAt(0,-.05,0);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);
  scene.environment=environment.texture;scene.environmentIntensity=.7;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0xb0b4b7,1.2));
  const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,5,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xffffff,1.4);rim.position.set(4,2,-3);scene.add(rim);
  const update=kind==='payments'?paymentCards(scene,renderer):kind==='assets'?digitalCoins(scene,renderer):await globalGlobe(scene,renderer);
  let frame=0,elapsed=0,last=0,visible=true;
  function draw(time){update(time);renderer.render(scene,camera);host.dataset.frame=String(Math.floor(time*10));}
  function tick(now){frame=0;if(!visible||document.hidden||reduced.matches){last=0;return;}if(last)elapsed+=Math.min((now-last)/1000,.06);last=now;draw(elapsed);frame=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(frame);frame=0;last=0;host.dataset.motion=reduced.matches?'reduced':visible&&!document.hidden?'running':'paused';if(reduced.matches)draw(0);else if(visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function resize(){const rect=host.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);const height=kind==='payments'?5.1:kind==='assets'?4.35:3.9;camera.left=-height*(rect.width/rect.height)/2;camera.right=-camera.left;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();draw(elapsed);}
  host.append(renderer.domElement);host.classList.add('has-illustration');host.dataset.renderer='three-webgl';
  new ResizeObserver(resize).observe(host);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'80px'}).observe(host);
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);host.classList.remove('has-illustration');host.dataset.motion='fallback';});sync();
}
const lazy=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;lazy.unobserve(entry.target);mount(entry.target).catch(error=>console.error('Quantum illustration:',error));}},{rootMargin:'180px'});
document.querySelectorAll('[data-illustration]').forEach(host=>lazy.observe(host));
