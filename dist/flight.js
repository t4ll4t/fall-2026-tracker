/* Original folded-paper sculpture. Camera/geometry advance only when the user scrolls. */
const host=document.querySelector('#flight-canvas');
const story=document.querySelector('.flight-story');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let initStarted=false;
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!initStarted){initStarted=true;observer.disconnect();init().catch(()=>{story.classList.add('is-static');story.dataset.renderer='fallback';});}},{rootMargin:'1000px'});
observer.observe(story);
async function init(){
 const T=await import('./vendor/three.module.js');
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{story.classList.add('is-static');story.dataset.renderer='fallback';return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x000000,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,80);
 const plane=new T.Group();scene.add(plane);
 // An original low-poly paper dart: articulated wings, a deep keel, fold seams and copper edges.
 const surface=document.createElement('canvas');surface.width=1024;surface.height=1024;const ink=surface.getContext('2d');
 ink.fillStyle='#deded2';ink.fillRect(0,0,1024,1024);let seed=431;for(let i=0;i<22000;i++){seed=(seed*16807)%2147483647;const x=seed%1024;seed=(seed*16807)%2147483647;const y=seed%1024;ink.fillStyle=i%2?'#aaa99c16':'#ffffff26';ink.fillRect(x,y,1,2);}
 ink.fillStyle='#4b574c';ink.font='500 40px sans-serif';ink.fillText('FALL / 26',135,670);ink.font='16px sans-serif';ink.fillText('SAHIL MANDALIA',138,704);ink.fillStyle='#9b663e';ink.fillRect(138,728,144,3);ink.font='14px sans-serif';ink.fillText('17.12.2026',138,762);
 const texture=new T.CanvasTexture(surface);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const paper=new T.MeshPhysicalMaterial({map:texture,color:0xffffff,metalness:.36,roughness:.42,side:T.DoubleSide,clearcoat:.16,clearcoatRoughness:.4});
 const inner=new T.MeshStandardMaterial({color:0xb76b38,metalness:.5,roughness:.32,side:T.DoubleSide});
 const underside=new T.MeshStandardMaterial({color:0x8b9585,metalness:.2,roughness:.48,side:T.DoubleSide});
 const edgeMaterial=new T.LineBasicMaterial({color:0xf6c49a,transparent:true,opacity:.26});
 function facet(parent,points,material){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));g.setAttribute('uv',new T.Float32BufferAttribute(points.flatMap(v=>[(v[0]+2)/5,Math.abs(v[2])/2.15]),2));g.computeVertexNormals();const mesh=new T.Mesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);parent.add(new T.LineSegments(new T.EdgesGeometry(g),edgeMaterial));return mesh;}
 const wings=[];
 for(const side of [-1,1]){const wing=new T.Group();plane.add(wing);wings.push(wing);
  facet(wing,[[2.9,0,0],[-1.8,.07,side*2.15],[-.95,.02,side*.32]],paper);
  facet(wing,[[2.9,0,0],[-.95,.02,side*.32],[-1.75,-.18,side*.06]],inner);
  facet(wing,[[-1.8,.07,side*2.15],[-1.38,-.025,side*1.45],[-.95,.02,side*.32]],underside);
  facet(plane,[[2.9,0,0],[-1.75,-.18,side*.06],[-1.48,-.64,0]],underside);
 }
 const key=new T.DirectionalLight(0xffeed7,2.2);key.position.set(2,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;key.shadow.bias=-.0003;key.shadow.normalBias=.04;scene.add(key);
 const fill=new T.DirectionalLight(0xa7d5ec,1.0);fill.position.set(-5,2,-3);scene.add(fill);
 const rim=new T.DirectionalLight(0xffa45d,1.8);rim.position.set(2,-1,-5);scene.add(rim);
 scene.add(new T.HemisphereLight(0xe6edf0,0x263129,.7));
 // Soft studio reflection panels give the folded planes distinct, readable material highlights.
 const envScene=new T.Scene();envScene.background=new T.Color(0x55605a);
 for(const [x,y,z,sx,sy,color] of [[0,6,0,10,6,0xffecd9],[-6,1,0,4,9,0xacc8df],[6,0,-4,2,8,0xf4b075]]){const panel=new T.Mesh(new T.PlaneGeometry(sx,sy),new T.MeshBasicMaterial({color,side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);envScene.add(panel);}
 const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(envScene,.1);scene.environment=env.texture;scene.environmentIntensity=.7;
 const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.22}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.5;floor.receiveShadow=true;scene.add(floor);
 const points=[];for(let i=0;i<90;i++){const a=i*.73;points.push(Math.sin(a)*10,Math.cos(a*1.3)*6,-4-(i%11));}
 const dustGeometry=new T.BufferGeometry();dustGeometry.setAttribute('position',new T.Float32BufferAttribute(points,3));const dust=new T.Points(dustGeometry,new T.PointsMaterial({color:0xe1bd91,size:.017,transparent:true,opacity:.42}));scene.add(dust);
 const state={progress:0};let trigger,raf=0;
 const phases=['Prepare for takeoff','A little room to breathe','A change of perspective','On to the next chapter'];
 function draw(){raf=0;const mobile=host.clientWidth<768,p=state.progress;
  const keyframes=[{r:[.24,-.55,-.15],z:11.8,y:.25,fold:.36},{r:[.1,.32,.13],z:10.3,y:.65,fold:.04},{r:[.28,1.38,-.32],z:11.4,y:.25,fold:.1},{r:[.08,2.45,.3],z:12.3,y:1.1,fold:.015}];
  const position=p*3,i=Math.min(2,Math.floor(position)),t=position-i,k=keyframes[i],n=keyframes[i+1],mix=(a,b)=>a+(b-a)*t;
  plane.rotation.set(...k.r.map((v,j)=>mix(v,n.r[j])));
  plane.position.set(mobile?0:2.25,mobile?-1.85:mix(k.y,n.y),0);
  plane.scale.setScalar(mobile?.8:1.1);
  wings[0].rotation.x=-mix(k.fold,n.fold);wings[1].rotation.x=mix(k.fold,n.fold);
  camera.position.set(0,3.5,mobile?14:mix(k.z,n.z));camera.lookAt(0,0,0);
  rim.color.set(p>.65?0x89c9e8:0xffa45d);dust.rotation.y=p*.45;
  renderer.render(scene,camera);host.dataset.progress=p.toFixed(3);host.dataset.rotation=plane.rotation.y.toFixed(3);
  document.querySelector('.flight-phase').textContent=phases[Math.min(3,Math.floor(p*4))];
 }
 function requestDraw(){if(!raf)raf=requestAnimationFrame(draw);}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();requestDraw();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 function configure(){trigger?.kill();story.classList.toggle('is-static',reduced.matches);state.progress=.15;
  if(!reduced.matches&&window.ScrollTrigger){trigger=window.ScrollTrigger.create({id:'paper-flight',trigger:story,start:()=>host.clientWidth<768?'top top+=68':'top top+=82',end:'bottom bottom',onUpdate:self=>{state.progress=self.progress;requestDraw();},onRefresh:self=>{state.progress=self.progress;requestDraw();}});}
  resize();
 }
 reduced.addEventListener('change',configure);configure();story.dataset.renderer='webgl';
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();trigger?.kill();story.classList.add('is-static');story.dataset.renderer='fallback';});
 window.addEventListener('pagehide',event=>{if(event.persisted)return;trigger?.kill();resizeObserver.disconnect();reduced.removeEventListener('change',configure);cancelAnimationFrame(raf);scene.traverse(o=>{o.geometry?.dispose();});[paper,inner,underside,edgeMaterial].forEach(m=>m.dispose());texture.dispose();env.dispose();pmrem.dispose();renderer.dispose();},{once:true});
}
