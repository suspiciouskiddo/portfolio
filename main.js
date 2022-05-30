import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { randFloat } from 'three/src/math/MathUtils';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(35, 32, 60);

const controls = new OrbitControls(camera, renderer.domElement);

//światło ambient
const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

//światło punktowe
const point_light = new THREE.PointLight(0xffffff);
point_light.position.set(15, -10, -40);
scene.add(point_light);

//pudło stanley
const stanley = new THREE.TextureLoader().load('stanley.jpg');
const stanley_geometry = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({ map: stanley })
);
stanley_geometry.position.set(-80, -10, -10);
scene.add(stanley_geometry);

//tło
const tlo = new THREE.TextureLoader().load('tlo.jpg');
scene.background = tlo;




//helper grid
const gridHelper = new THREE.GridHelper(100, 10);
scene.add(gridHelper);

//helper light
const lightHelper = new THREE.PointLightHelper(point_light, 5);
scene.add(lightHelper);



//kot
const mtlloader = new MTLLoader();
mtlloader.load('cat.mtl', function (materials) {
  materials.preload();
  const objloader = new OBJLoader();
  objloader.setMaterials(materials);
  objloader.load('cat.obj', function (object) {
    object.position.x = 0;
    object.position.z = -60;
    object.position.y = -40;
    object.rotation.x = 4.7;
    scene.add(object);
  });
});

//kot ciastek 
const mtlloader2 = new MTLLoader();
mtlloader2.load('cat_real_model/catrm.mtl', function (materials) {
  materials.preload();
  const objloader = new OBJLoader();
  objloader.setMaterials(materials);
  objloader.load('cat_real_model/catrm.obj', function (object) {
    object.position.x = 0;
    object.position.z = 20;
    object.position.y = -80;
    object.rotation.x = 4.7;
    object.rotation.z = 1.5;
    scene.add(object);
  });
});

//kulki
function kulki() {
  const geometry = new THREE.SphereGeometry(THREE.MathUtils.randFloat(0.10, 0.55), 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: THREE.MathUtils.randInt(0x000000, 0xffffff) });
  const kulka = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  kulka.position.set(x, y, z);
  scene.add(kulka);
}
Array(600).fill().forEach(kulki);


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.04;
  camera.position.x = t * -0.002;
  camera.position.y = t * -0.002;

}
document.body.onscroll = moveCamera;


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera);
}

function recursive_all() {
  requestAnimationFrame(recursive_all);
  stanley_geometry.rotation.x += 0.003;
  stanley_geometry.rotation.y += 0.01;
  stanley_geometry.rotation.z += 0.01;
  renderer.render(scene, camera);
}
recursive_all();
