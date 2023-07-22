import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
// import { OBB } from 'three/addons/math/OBB.js';
// import "./style.css";
import { GUI } from "dat.gui";
// import { gouroudV, phongV, gouroudPhongBingV } from "./vertexShader";
// import { gouroudF, phongBlingF, phongF } from "./fragmentShader";

import { Domino } from "./domino.js";
import { Ball } from "./ball.js";

// renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creating scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Window Sizes
const constants = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/* camera */
const camera = new THREE.PerspectiveCamera(
  60,
  constants.width / constants.height,
  0.1,
  500
);
camera.position.set(-110, 30, -30);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);

/* lights */
const pointLight = new THREE.PointLight( 0xB88E06 , 5, 200 );
pointLight.castShadow = true;
pointLight.position.set( 70, 70, 70 );
const ambLight = new THREE.AmbientLight( 0x888888 ); // soft white light
const spotLight = new THREE.SpotLight( 0xff0000 );
spotLight.angle = Math.PI/6


/* Environment Load */
new RGBELoader().load("background-sky.hdr", function(texture){
  scene.add( pointLight );
  scene.add( ambLight );
  scene.add( spotLight );
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
})
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.2;
renderer.outputEncoding = THREE.sRGBEncoding;

/* Dat Gui */
let lightSettings = {
  pointLight: true,
  ambLight: true,
  spotLight: true,
};
const gui = new GUI();
let folder1 = gui.addFolder("Light Settings");

folder1.add(lightSettings, 'pointLight').onChange(function(value) {
  if(value)
    scene.add(pointLight);
  else
    scene.remove(pointLight);

  lightSettings.pointLight = value;
});
folder1.add(lightSettings, 'ambLight').onChange(function(value) {
  if(value)
    scene.add(ambLight);
  else
    scene.remove(ambLight);

  lightSettings.ambLight = value;
});
folder1.add(lightSettings, 'spotLight').onChange(function(value) {
  if(value)
    scene.add(spotLight);
  else
    scene.remove(spotLight);

  lightSettings.spotLight = value;
});

/* dominos init */
const loader = new THREE.TextureLoader();
const wood = loader.load('checker-tex2.jpg')
const envTex = loader.load('background-sky.hdr')

var animationNumber = 0;
const listOfDominos = [];
const numDominos =  40;
const dominoHeight = 4;
const dist = 1.3
const calculationLimit = 10

const radius = 40;
const angle = -Math.PI/3
for(let i=0;i<numDominos;i++){
    var x = radius * Math.cos((angle*(numDominos-i) - i*angle)/numDominos);
    var z = radius * Math.sin((angle*(numDominos-i) - i*angle)/numDominos) - 20;
    // const domino = new Domino(0, 0, dist*(i - (numDominos/2)), dominoHeight)
    const domino = new Domino(x, 0, z, dominoHeight, wood)

    // console.log(domino)

    scene.add(domino.object);
    listOfDominos.push(domino);
}
spotLight.position.set(listOfDominos[0].object.position.x, 4, listOfDominos[0].object.position.z)
spotLight.target = listOfDominos[0].object;

/* ball init */
const ball1 = new Ball(listOfDominos[numDominos-1].object.position.x, 
  1.5, 
  listOfDominos[numDominos-1].object.position.z + 2,
  1.5,
  envTex);
scene.add(ball1.object);

/* Pit */
const cy_geometry = new THREE.CylinderGeometry( 2.5, 2.5, 2, 32 ); 
const cy_material = new THREE.MeshPhongMaterial( {color: 0x000000} );
const cylinder1 = new THREE.Mesh( cy_geometry, cy_material ); scene.add( cylinder1 );
cylinder1.position.y = -0.9;
const cylinder2 = new THREE.Mesh( cy_geometry, cy_material ); scene.add( cylinder2 );
cylinder2.position.y = -0.9;
cylinder2.position.z = -35

/* Path */
// domino camera curve
const fix1 = new THREE.Vector3(listOfDominos[0].object.position.x + 5, listOfDominos[0].object.position.y + 1, listOfDominos[0].object.position.z - 15)
const fix2 = new THREE.Vector3(listOfDominos[numDominos-1].object.position.x + 15, listOfDominos[numDominos-1].object.position.y + 1, listOfDominos[numDominos-1].object.position.z - 5)
const anchor1 = new THREE.Vector3(listOfDominos[10].object.position.x + 15, listOfDominos[10].object.position.y + 3, listOfDominos[10].object.position.z - 10)
const anchor2 = new THREE.Vector3(listOfDominos[30].object.position.x + 25, listOfDominos[30].object.position.y + 3, listOfDominos[30].object.position.z - 10)
const dominoCameraCurve = new THREE.CubicBezierCurve3(fix1, anchor1, anchor2, fix2);

// const material_child = new THREE.MeshPhongMaterial({
//     color: new THREE.Color(0,1,0),
//     specular: new THREE.Color(0.2,0.2,0.2)
// });
// const geometry_child = new THREE.SphereGeometry(0.5, 20, 20);
// const group = new THREE.Group();
// let i = 0; const len = numDominos;
// while(i < len){
//     const mesh = new THREE.Mesh(geometry_child, material_child);
//     group.add(mesh);
//     i += 1;
// }
// scene.add(group);
// group.children.forEach( (mesh, i, arr) => {
//   const a4 = (i) / (arr.length);
//   mesh.position.copy( dominoCameraCurve.getPoint(a4) );
// });

// ball camera curve
const fix3 = new THREE.Vector3(-ball1.object.position.x, 10, 50);
const anchor3 = new THREE.Vector3(ball1.object.position.x + 10, 30, 70);
const anchor4 = new THREE.Vector3(-ball1.object.position.x + 20, 20, 70);
const balloCameraCurve = new THREE.CubicBezierCurve3(fix2, anchor3, anchor4, fix3);

// const ball_material_child = new THREE.MeshPhongMaterial({
//   color: new THREE.Color(1,0,0),
//   specular: new THREE.Color(0.2,0.2,0.2)
// });
// const ball_geometry_child = new THREE.SphereGeometry(0.5, 20, 20);
// const ball_group = new THREE.Group();
// i = 0; const ball_len = numDominos;
// while(i < ball_len){
//   const mesh = new THREE.Mesh(ball_geometry_child, ball_material_child);
//   ball_group.add(mesh);
//   i += 1;
// }
// scene.add(ball_group);
// ball_group.children.forEach( (mesh, i, arr) => {
//   const a4 = (i) / (arr.length);
//   mesh.position.copy( balloCameraCurve.getPoint(a4) );
// });

/* rotator1 */
const rotator1 = new THREE.Mesh(
  new THREE.BoxGeometry(16, 2.5, 0.1),
  // new THREE.MeshStandardMaterial({ color: 0xff2222 })
  new THREE.MeshPhongMaterial( 
      { color: 0xffff00,
        specular: 0xffffff,
        shininess: 100
      } )
  );
rotator1.position.set(ball1.object.position.x + 1.5, 2.5/2, 40);
rotator1.geometry.computeBoundingBox();
scene.add(rotator1);
const rotator2 = new THREE.Mesh(
  new THREE.BoxGeometry(20, 2.5, 0.1),
  // new THREE.MeshStandardMaterial({ color: 0xff2222 })
  new THREE.MeshPhongMaterial( 
      { color: 0x00ffff,
        specular: 0xff0000,
        shininess: 100
      } )
);
rotator2.position.set(-ball1.object.position.x, 2.5/2, 40);
rotator2.rotation.y = -Math.PI/4;
scene.add(rotator2);

cylinder1.position.x = -26.21;
cylinder2.position.x = -26.21;

const plane = new THREE.Mesh(
  new THREE.BoxGeometry(150, 150, 1000),
  new THREE.MeshPhongMaterial( { color: 0xff8828, shininess:10 } )
);
// const plane = new THREE.Mesh( geometryFloor, new THREE.MeshStandardMaterial( { map: groundTexture } ) );
plane.rotation.x = -Math.PI/2;
plane.position.y = -500
plane.receiveShadow = true;
scene.add( plane );

// grid helper
const size = 20;
const divisions = 20;
const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);


var collisionList = [listOfDominos[0].object];
var collisionAngle = [0];
var id = 0;
var play = true;
var theta = 0;

const Frame_time_dominos = 230;
const Frame_time_ball = 150;
var totalCurvePoints_domino = 0;
var totalCurvePoints_ball = 0;
var offset = 0;

window.addEventListener('keydown', function(e){
  if(e.key == "s"){
    animationNumber = 1;
  }
  if(e.key == "p")
    play = !play;

  if(e.key == "a"){
      theta += Math.PI/10;
  }
  if(e.key == "d"){
    theta -= Math.PI/10;
  }
})

function completeAnimation(){
  if(!play) return;

  if(animationNumber != 0)
    rotator1.rotation.y = (rotator1.rotation.y + Math.PI/20)%(Math.PI);
  
  if(animationNumber === 1){
      
      var fallSpeed = 0.05;

      if(collisionList.length > 1){
        for(let c=collisionList.length-1;c>0;c--){
          collisionAngle[c-1] = (collisionAngle[c] + Math.asin(((collisionList[c].position.z - collisionList[c-1].position.z) * Math.sin(Math.PI/2 + collisionAngle[c]))/dominoHeight))
        }
      }
      fallSpeed += 0.03
      if(collisionAngle[id] + fallSpeed <= Math.PI/2)
        collisionAngle[id] += fallSpeed;
      else{
        collisionAngle[id] = Math.PI/2;
        if(id == numDominos-1)
          animationNumber = 2;
      }

      for(let c=0;c<collisionList.length;c++){
        collisionList[c].rotation.x = collisionAngle[c]
      }

      if(id < numDominos-1){
        const a1 = (totalCurvePoints_domino) / (Frame_time_dominos);
        const a2 = (totalCurvePoints_domino + 1) / (Frame_time_dominos);
        const newCamPos = dominoCameraCurve.getPoint(a1);
        const newCamPosNext = dominoCameraCurve.getPoint(a2);

        // const center = new THREE.Vector3(newCamPosNext.x-2, newCamPosNext.y, newCamPosNext.z + 1);
        // const pos = computeNewPointOnCircle(newCamPos, center, theta)

        // camera.position.set(pos.x, pos.y, pos.z);
        camera.position.set(newCamPos.x, newCamPos.y, newCamPos.z);
        camera.lookAt(newCamPosNext.x-2, newCamPosNext.y, newCamPosNext.z + 1)
        totalCurvePoints_domino++;

        var firstBB = new THREE.Box3().setFromObject(listOfDominos[id].object);
        var secondBB = new THREE.Box3().setFromObject(listOfDominos[id + 1].object);
        var collision = firstBB.intersectsBox(secondBB);

        if(collision) {
          spotLight.position.set(listOfDominos[id].object.position.x, 4, listOfDominos[id].object.position.z)
          spotLight.target = listOfDominos[id+1].object;

          fallSpeed = 0.05;
          
          collisionList.push(listOfDominos[id+1].object)
          collisionAngle.push(0)
          id++;
        }
      }
      if(id === numDominos-1){
        // console.log("dom", totalCurvePoints_domino)
        camera.lookAt(ball1.object.position)
        const a1 = (totalCurvePoints_ball) / (Frame_time_ball);
        const a2 = (totalCurvePoints_ball + 1) / (Frame_time_ball);
        const newCamPos = balloCameraCurve.getPoint(a1);
        const newCamPosNext = balloCameraCurve.getPoint(a2);
        camera.position.set(newCamPos.x, newCamPos.y, newCamPos.z);
        totalCurvePoints_ball++;

        var firstBB = new THREE.Box3().setFromObject(listOfDominos[id].object);
        var secondBB = ball1.boundingsphere;
        var collision = firstBB.intersectsSphere(secondBB);
        if(collision){
          spotLight.target = ball1.object;
          ball1.velocity.set(0, 0, 0.5)
        }
        ball1.updatePosition();
      }
    }

    if(animationNumber === 2){
      // console.log(frame)
      
      const a1 = (totalCurvePoints_ball) / (Frame_time_ball);
      const a2 = (totalCurvePoints_ball + 1) / (Frame_time_ball);
      const newCamPos = balloCameraCurve.getPoint(a1);
      const newCamPosNext = balloCameraCurve.getPoint(a2);
      const center = ball1.object.position;
      const pos = computeNewPointOnCircle(newCamPos, center, theta)

      camera.position.set(pos.x, pos.y, pos.z);
      // camera.position.set(newCamPos.x, newCamPos.y, newCamPos.z - 1);

      // camera.position.set(ball1.object.position.x, ball1.object.position.y + 2, ball1.object.position.z - 10)
      camera.lookAt(ball1.object.position.x, ball1.object.position.y, ball1.object.position.z)
      if(rotator1.rotation.y <= Math.PI/2 && rotator1.rotation.y > Math.PI/2-Math.PI/50 && ball1.object.position.z > 30 && ball1.object.position.x > 0){
        offset = rotator2.position.z - ball1.object.position.z;
        ball1.velocity.set(-0.5, 0, 0)
        // ball1.object.material.color.setHex("#f1f0000")
      }

      if(ball1.object.position.x <= (rotator2.position.x - offset + 2)){
        ball1.velocity.set(0, 0, -0.3)
      }

      if(ball1.object.position.x > rotator2.position.x)
        totalCurvePoints_ball++;
      
      if(ball1.object.position.z > 0){
        spotLight.position.set(ball1.object.position.x, 3, ball1.object.position.z);
        ball1.updatePosition()
      }
      else{
        animationNumber = 3;
      }
    }

    if(animationNumber == 3){
      // console.log(ball1.object.position)
      // console.log("ball", totalCurvePoints_ball)
      if(ball1.object.position.y > -3){
        ball1.object.position.y -= 0.5
      }
      camera.lookAt(ball1.object.position.x, 0, ball1.object.position.z);
      // else{
      //   camera.position.set(-110, 30, -30)
      //   animationNumber = 4;
      // }
    }
}

function computeNewPointOnCircle(currentPoint, center, theta) {
  const radius = currentPoint.distanceTo(center); // Get the radius of the circle
  const angle = Math.atan2(currentPoint.z - center.z, currentPoint.x - center.x); // Get the current angle of the point on the circle
  const newAngle = angle + theta; // Add the input angle theta to the current angle
  const newX = center.x + radius * Math.cos(newAngle); // Compute the new x-coordinate of the point
  const newZ = center.z + radius * Math.sin(newAngle); // Compute the new y-coordinate of the point
  const newPoint = new THREE.Vector3(newX, currentPoint.y, newZ); // Create a new Three.js vector for the new point
  return newPoint;
}

var frame = 0;
function animate() {
  frame++;

  controls.update();

  completeAnimation();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();