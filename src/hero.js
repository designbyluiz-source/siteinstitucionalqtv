import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const host=document.querySelector('.hero-art');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');

// Independent geometry, lighting and soft contact shadows.
async function createHero(){
  if(!host)return;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.domElement.className='hero-canvas';
  renderer.domElement.setAttribute('role','img');
  renderer.domElement.setAttribute('aria-label','Marca Quantum inteira em metal tridimensional, com flutuação e rotação suaves e grupos de discos fixos que alternam o destaque de cor.');
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  renderer.shadowMap.enabled=false;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xffffff);
  const camera=new THREE.OrthographicCamera(-6.5,6.5,2.6,-2.6,.1,60);
  camera.position.set(0,7.5,12);
  camera.lookAt(0,0,0);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment();
  const env=pmrem.fromScene(room,.04);
  scene.environment=env.texture;
  scene.environmentIntensity=.9;
  room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0xbbb9b4,2));
  const key=new THREE.DirectionalLight(0xffffff,3.5);
  key.position.set(-3,9,5);key.castShadow=false;
  key.shadow.mapSize.set(2048,2048);
  Object.assign(key.shadow.camera,{left:-8,right:8,top:6,bottom:-6,near:.5,far:25});
  key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=5;
  scene.add(key);
  const rim=new THREE.DirectionalLight(0xffffff,2);rim.position.set(5,4,-6);scene.add(rim);
  const warm=new THREE.PointLight(0xffe3a0,6,12,2);warm.position.set(4,3,1);scene.add(warm);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({color:0x242424,opacity:.24}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.09;floor.receiveShadow=true;scene.add(floor);
  const silver=new THREE.MeshStandardMaterial({color:0x9c9ea3,metalness:1,roughness:.22});
  const darkMetal=new THREE.MeshStandardMaterial({color:0x1b1d20,metalness:.92,roughness:.26});
  function contactShadow(width,depth,opacity){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
    const ctx=canvas.getContext('2d');const gradient=ctx.createRadialGradient(64,64,3,64,64,62);
    gradient.addColorStop(0,'rgba(0,0,0,.9)');gradient.addColorStop(.35,'rgba(0,0,0,.65)');gradient.addColorStop(.7,'rgba(0,0,0,.15)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
    const texture=new THREE.CanvasTexture(canvas);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth),new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity,depthWrite:false}));
    mesh.rotation.x=-Math.PI/2;mesh.position.y=-.07;scene.add(mesh);return mesh;
  }
  const logoShadow=contactShadow(4.8,3.7,.4);
  // Extrude the complete official silhouette. The logo always moves as one object.
  const logo=new THREE.Group();
  const logoFace=silver.clone();
  logo.position.z=.65;logoShadow.position.z=.65;
  const source=await fetch('assets/quantum-icon.svg');
  if(!source.ok)throw new Error('Quantum symbol unavailable');
  const data=new SVGLoader().parse(await source.text());
  for(const path of data.paths){
    for(const shape of SVGLoader.createShapes(path)){
      const geometry=new THREE.ExtrudeGeometry(shape,{depth:96,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:3,bevelThickness:3,curveSegments:32});
      geometry.translate(-336.1,-198.06,0);geometry.scale(.0041,.0041,.0041);geometry.rotateX(Math.PI/2);
      const mesh=new THREE.Mesh(geometry,[logoFace,darkMetal]);
      mesh.position.y=.55;logo.add(mesh);
    }
  }
  logo.rotation.y=-.12;scene.add(logo);
  const stageColors=[new THREE.Color('#f0ae00'),new THREE.Color('#ead8ab'),new THREE.Color('#d9e2ea')];
  const glow=new THREE.PointLight(0xf0ae00,0,4,2);glow.position.set(0,1.1,.5);scene.add(glow);

  function iconTexture(type,activeColor=null){
    const c=document.createElement('canvas');c.width=c.height=256;
    const ctx=c.getContext('2d');
    const gradient=ctx.createLinearGradient(0,0,256,256);
    gradient.addColorStop(0,activeColor||'#16181a');
    gradient.addColorStop(.45,activeColor||'#030405');
    gradient.addColorStop(1,activeColor||'#101214');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,256,256);
    ctx.translate(128,128);ctx.strokeStyle=activeColor?'#111111':'#ffffff';ctx.fillStyle=ctx.strokeStyle;
    ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';
    const path=(points,closed=false)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(closed)ctx.closePath();ctx.stroke();};
    const ellipse=(x,y,rx,ry)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.stroke();};
    if(type==='globe'){ellipse(0,0,48,48);ellipse(0,0,21,48);path([[-48,0],[48,0]]);ellipse(0,0,48,19);}
    else if(type==='card'){ctx.strokeRect(-53,-35,106,70);path([[-53,-10],[53,-10]]);path([[-36,17],[-15,17]]);}
    else if(type==='layers'){for(const y of [-21,7,33])path([[-50,y],[0,y-26],[50,y],[0,y+26],[-50,y]]);}
    else if(type==='code'){path([[-24,-35],[-57,0],[-24,35]]);path([[24,-35],[57,0],[24,35]]);path([[12,-44],[-12,44]]);}
    else if(type==='exchange'){path([[-53,-22],[53,-22],[30,-45]]);path([[53,-22],[30,1]]);path([[53,25],[-53,25],[-30,48]]);path([[-53,25],[-30,2]]);}
    else if(type==='chart'){for(let i=0;i<3;i++)ctx.fillRect(-47+i*35,26-i*23,22,25+i*23);}
    else if(type==='diamond'){path([[0,-53],[40,0],[0,53],[-40,0]],true);path([[-40,0],[0,16],[40,0]]);path([[0,-53],[0,16]]);}
    else if(type==='cube'){path([[0,-48],[46,-22],[46,28],[0,53],[-46,28],[-46,-22]],true);path([[-46,-22],[0,4],[46,-22]]);path([[0,4],[0,53]]);path([[0,-48],[0,4]]);}
    else if(type==='network'){ellipse(0,-37,13,13);ellipse(-42,33,13,13);ellipse(42,33,13,13);path([[0,-24],[0,8],[-33,26]]);path([[0,8],[33,26]]);}
    else if(type==='shield'){path([[0,-52],[44,-35],[40,15],[0,53],[-40,15],[-44,-35]],true);}
    else if(type==='cloud'){ctx.beginPath();ctx.moveTo(-38,33);ctx.bezierCurveTo(-80,30,-66,-25,-32,-20);ctx.bezierCurveTo(-24,-69,42,-65,43,-12);ctx.bezierCurveTo(85,-9,77,36,40,33);ctx.closePath();ctx.stroke();}
    else if(type==='database'){ellipse(0,-34,45,16);path([[-45,-34],[-45,34]]);path([[45,-34],[45,34]]);ctx.beginPath();ctx.ellipse(0,34,45,16,0,0,Math.PI);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,45,16,0,0,Math.PI);ctx.stroke();}
    else if(type==='orbit'){ellipse(0,0,48,35);ctx.beginPath();ctx.arc(0,-35,11,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(0,35,11,0,Math.PI*2);ctx.fill();}
    else if(type==='bolt'){ctx.beginPath();ctx.moveTo(2,-55);ctx.lineTo(-36,8);ctx.lineTo(-3,8);ctx.lineTo(-14,57);ctx.lineTo(40,-17);ctx.lineTo(9,-17);ctx.closePath();ctx.fill();}
    else if(type==='star'){for(let i=0;i<8;i++){const angle=i*Math.PI/4;path([[Math.cos(angle)*15,Math.sin(angle)*15],[Math.cos(angle)*53,Math.sin(angle)*53]]);}}
    else if(type==='circles'){ellipse(0,-32,20,15);ellipse(-32,25,20,15);ellipse(32,25,20,15);}
    else if(type==='pie'){ctx.beginPath();ctx.arc(0,0,48,-Math.PI/2,Math.PI*2);ctx.stroke();path([[0,-48],[0,0],[45,17]]);}
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return texture;
  }
  const bodyGeometry=new THREE.CylinderGeometry(.34,.34,.075,64,1);
  const faceGeometry=new THREE.CircleGeometry(.324,64);faceGeometry.rotateX(-Math.PI/2);
  const rimGeometry=new THREE.TorusGeometry(.328,.009,8,64);rimGeometry.rotateX(Math.PI/2);
  const names=['globe','layers','card','chart','network','cube','shield','exchange','diamond','circles','cloud','database','orbit','code','bolt','star','pie','network','diamond'];
  // Fixed locations match the approved composition. As in the reference,
  // only the color groups change; the complete central logo floats and turns gently.
  const faceCenters=[[652,103],[439,200],[879,184],[1206,124],[1485,198],[240,315],[552,350],[1392,320],[1694,300],[1814,433],[1521,426],[1340,534],[1710,574],[1512,640],[1090,674],[726,609],[373,612],[505,500],[234,499]];
  const groupAssignment=[2,0,1,0,2,2,1,1,0,2,0,2,1,0,2,0,1,0,2];
  const phaseHex=['#f0ae00','#ead8ab','#d9e2ea'];
  const coins=names.map((type,i)=>{
    const coin=new THREE.Group();
    const body=new THREE.Mesh(bodyGeometry,silver);coin.add(body);
    const face=new THREE.Mesh(faceGeometry,new THREE.MeshBasicMaterial({map:iconTexture(type)}));
    face.position.y=.04;coin.add(face);
    const activeFace=new THREE.Mesh(faceGeometry,new THREE.MeshBasicMaterial({map:iconTexture(type,phaseHex[groupAssignment[i]]),transparent:true,opacity:0,depthWrite:false}));
    activeFace.position.y=.041;coin.add(activeFace);
    const rimMesh=new THREE.Mesh(rimGeometry,silver);rimMesh.position.y=.042;coin.add(rimMesh);
    const [cx,cy]=faceCenters[i];
    const yScreen=(.5-cy/793)*5.04;
    coin.position.set((cx/1983-.5)*12.6,.18,(.848*.18-yScreen)/.53);
    coin.rotation.y=-.15;
    for(const object of coin.children)object.userData.coinIndex=i;
    scene.add(coin);const shadow=contactShadow(1.15,1.15,.3);
    shadow.position.x=coin.position.x+.02;shadow.position.z=coin.position.z+.05;
    return{coin,shadow,activeFace,group:groupAssignment[i]};
  });
  const pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster();
  const headline=[...document.querySelectorAll('[data-hero-word]')];
  let visible=true,elapsed=0,last=0,frame=0,lastStage=-1,hovered=-1;
  const smooth=(value,start,end)=>{const t=THREE.MathUtils.clamp((value-start)/(end-start),0,1);return t*t*(3-2*t);};
  function update(time){
    const stage=reduceMotion.matches?0:Math.floor(time/4)%3;
    const local=reduceMotion.matches?0:time%4;
    const colorPulse=reduceMotion.matches?0:smooth(local,.25,.8)*(1-smooth(local,3,3.75));
    logo.position.y=reduceMotion.matches?0:Math.sin(time*.8)*.045;
    logo.rotation.y=-.12+(reduceMotion.matches?0:Math.sin(time*.35)*.075);
    logo.rotation.x=reduceMotion.matches?0:Math.sin(time*.45)*.012;
    logoFace.color.copy(silver.color).lerp(stageColors[stage],colorPulse*.55);
    logoFace.emissive.copy(stageColors[stage]);logoFace.emissiveIntensity=.035*colorPulse;
    glow.color.copy(stageColors[stage]);glow.intensity=colorPulse*.75;
    for(let i=0;i<coins.length;i++)coins[i].activeFace.material.opacity=Math.max(coins[i].group===stage?colorPulse:0,hovered===i?1:0);
    if(lastStage!==stage){headline.forEach((word,i)=>word.classList.toggle('is-current',i===stage));host.dataset.phase=String(stage);lastStage=stage;}
    renderer.render(scene,camera);host.dataset.frame=String(Math.floor(time*10));
  }
  function resize(){
    const {width,height}=host.getBoundingClientRect();
    renderer.setSize(width,height,false);
    const aspect=width/height;
    const viewWidth=aspect<1.8?11.8:12.6;
    const viewHeight=viewWidth/aspect;
    camera.left=-viewWidth/2;camera.right=viewWidth/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;camera.updateProjectionMatrix();
    update(elapsed);
  }
  function tick(now){
    frame=0;if(!visible||document.hidden||reduceMotion.matches){last=0;return;}
    if(last)elapsed+=Math.min((now-last)/1000,.05);last=now;
    update(elapsed);frame=requestAnimationFrame(tick);
  }
  function sync(){
    cancelAnimationFrame(frame);frame=0;last=0;
    host.dataset.motion=reduceMotion.matches?'reduced':(visible&&!document.hidden?'running':'paused');
    if(reduceMotion.matches)update(0);else if(visible&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  host.append(renderer.domElement);host.classList.add('is-webgl');host.dataset.renderer='three-webgl';
  new ResizeObserver(resize).observe(host);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'100px'}).observe(host);
  reduceMotion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  host.addEventListener('pointermove',event=>{const box=host.getBoundingClientRect();pointer.set((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(coins.map(item=>item.coin),true);hovered=hits[0]?.object.userData.coinIndex??-1;if(reduceMotion.matches)update(0);});
  host.addEventListener('pointerleave',()=>{hovered=-1;if(reduceMotion.matches)update(0);});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);host.classList.remove('is-webgl');host.dataset.motion='fallback';});
  sync();
}
createHero().catch(error=>{console.error('Quantum hero:',error);host?.classList.remove('is-webgl');});
