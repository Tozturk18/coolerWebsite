/* app.js
 * Created by Ozgur Tuna Ozturk
 * Last edited on 02/12/2022
 * This Javascript file is meant to create the distribution page for all the other
 * pages owned by Tuna. This Javascript file uses THREE JS to create a 3D simulation
 * of the Earth, the Moon, the Sun, and location linked node points for each website.
 */

/* --- Imports --- */

import * as THREE from 'https://unpkg.com/three@0.138.0/build/three.module.js';	// THREE JS Library
//import gsap from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js';
import { OrbitControls } from "./orbitControls.js";								// Edited OrbitControls Library
import { Lensflare, LensflareElement } from './lensflare.js';					// Edited Lensflare Library

/* --- End of Imports --- */

/* --- ShortCuts --- */

// Create a shortcut to load textures
const textureLoader = new THREE.TextureLoader();
// Create a shortcut to create dates
const dt = new Date();

/* --- End of ShortCuts --- */

/* --- Textures --- */

// 
const lensflareTexture = textureLoader.load( "./textures/lensflare.png" );		// LensFlare Texture

/* Textures are created by Tom Patterson and can be found on Natural Earth III - Texture Maps at
 * https://www.shadedrelief.com/natural3/pages/textures.html 
 */
const skySphereTexture = textureLoader.load( "./textures/starfield.jpeg" );		// Sky Sphere Texture
const mercuryTexture = textureLoader.load("./textures/mercury.jpeg");
const venusTexture = textureLoader.load("./textures/venus.jpeg");
const earthDayTexture = textureLoader.load( "./textures/earth.jpeg" );			// Earth Day Texture
const moonTexture = textureLoader.load( "./textures/moon.jpeg" );				// Moon Texture
const marsTexture = textureLoader.load("./textures/mars.jpeg");
const jupiterTexture = textureLoader.load("./textures/jupiter.jpeg");
const saturnTexture = textureLoader.load("./textures/saturn.jpeg");
const saturnRingsTexture = textureLoader.load("./textures/saturn_ring.png");
const uranusTexture = textureLoader.load("./textures/uranus.jpeg");
const neptuneTexture = textureLoader.load("./textures/neptune.jpeg");

/* --- End of Textures --- */

/* --- Global Variables --- */

var aspectRatio = 1;	// Aspect ratio of the screen relative to with menu ON/OFF
var FOV = 45;			// Default FOV of the scene

var canvasWidth = document.body.clientWidth * aspectRatio;		// Save default canvas width;
var canvasHeight = document.body.clientHeight * aspectRatio;	// Save default canvas height

// Define a variable to hold the multiplier that changes the FOV according to the canvasWidth and canvasHeihgt
var cameraMultiplier = 0;
if (canvasWidth > canvasHeight) {
	// For larger devices like computers
	cameraMultiplier = ( ( 1440/821 ) / ( canvasWidth / canvasHeight ) );
} else {
	// For smaller devices like phones
	cameraMultiplier = ( ( 1440/821 ) / ( canvasHeight / canvasWidth/2 ) );
}

// The radius of camera from the origin (0,0,0)
//var cameraRadius = 1.65 * cameraMultiplier;
var cameraRadius = 200 * cameraMultiplier;

/* --- End of Global Variables --- */

/* --- Renderer --- */

// Create a THREE JS WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true } );
// Renderer Settings
renderer.setSize( document.body.clientWidth * aspectRatio, document.body.clientHeight * aspectRatio ); // Renderer Aspect Ratio
renderer.shadowMap.enabled = true; // Renderer Shadow options
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
document.getElementById("main").appendChild( renderer.domElement ); // Instantiate the Renderer on the Webpage

/* --- End of Renderer --- */

/* --- Camera --- */

// Create a THREE JS Scene
const scene = new THREE.Scene();
// Create a THREE JS Perspective Camera
const camera = new THREE.PerspectiveCamera( FOV, document.body.clientWidth / document.body.clientHeight, 0.1, 1000 );
// Adjust the camera FOV according to the aspect ratio of the device
if (canvasWidth > canvasHeight) {
	// Adjust for larger devices like computers
	camera.fov = FOV * cameraMultiplier
} else {
	// Adjust for smaller devices like phones
	camera.fov = FOV * cameraMultiplier / 2
}

// Instantiate the Camera in the scene
scene.add( camera );
// Set the initial Camera Position so the Northern Hemisphere is in focus
camera.position.z = cameraRadius * Math.cos(Math.PI/10);
camera.position.y = cameraRadius * Math.sin(Math.PI/10);
// Create an Orbital Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
// Lock the Camera scroll at 5 units away from the center
//controls.maxDistance = cameraRadius; 
//controls.minDistance = cameraRadius;
controls.enableZoom = false;
// Disable Automatic Rotation feature
controls.autoRotate = false;
// Disable the Pan Feature so that the User cannot wonder around.
controls.enablePan = false;

/* --- End of Camera --- */

/* --- Sun --- */

// Calculate the current day of the year
const DOY = Math.ceil((dt - new Date(dt.getFullYear(),0,1)) / 86400000);
// Create a new THREE.DirectionalLight object to imitate the Sun
const sunLight = new THREE.DirectionalLight( 0xffffff, 1, 2000 );
// Set the position of the sunLight Object with respect to Earth
sunLight.position.set(0,0,0);
// Instantiate the sunLight Object into the scene
scene.add(sunLight);
// Create a THREE JS LensFlare Object to create a lensflare effect when looked at the sun
const sunFlare = new Lensflare();
// Add the LensFlare Texture and Settings
sunFlare.addElement( new LensflareElement( lensflareTexture, 1000, 0 ) );
// Instantiate the LensFlare
sunLight.add(sunFlare);

/* --- End of Sun --- */

/* --- Atmospheric Lighting --- */

// Create a THREE.AmbientLight object to imitate the Atmospherical Light Reflections
const atmoLight = new THREE.AmbientLight( 0xF0F0F0 ); // soft white light
// Instantiate the atmoLight
scene.add( atmoLight );

/* --- End of Atmospheric Lighting --- */

/* --- SkySphere --- */

// Create a new THREE.Mesh Sphere object and render a 360 image of the night sky
const skySphere = new THREE.Mesh( new THREE.SphereGeometry(305), new THREE.MeshBasicMaterial({ color: 0xffffff, map: skySphereTexture, }) );
// Only render the texture in the inside of the Sphere
skySphere.material.side = THREE.BackSide;
// Instantiate the skySphere
scene.add(skySphere);

/* --- End of SkySphere --- */

/* --- Mercury --- */

// --- Mercury Base ---
// Create a new MeshPhysicalMaterial for Earth
const mercuryMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: mercuryTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Mercury = new THREE.Mesh( new THREE.SphereGeometry(0.5), mercuryMaterial );
// Instantiate the Earth on the scene
scene.add( Mercury );
Mercury.position.set(25*Math.cos(((DOY+10)/88)*Math.PI*2 - Math.PI/2), 0.5*Math.sin((DOY/88)*Math.PI*2 - Math.PI/2), 25*Math.sin(((DOY+10)/88)*Math.PI*2 - Math.PI/2));

/* --- End of Mercury --- */

/* --- Venus --- */

// --- Venus Base ---
// Create a new MeshPhysicalMaterial for Earth
const venusMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: venusTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Venus = new THREE.Mesh( new THREE.SphereGeometry(1.24), venusMaterial );
// Instantiate the Earth on the scene
scene.add( Venus );
Venus.position.set(35*Math.cos(((DOY+100)/225)*Math.PI*2 - Math.PI/2), 0.55*Math.sin((DOY/225)*Math.PI*2 - Math.PI/2), 35*Math.sin(((DOY+100)/225)*Math.PI*2 - Math.PI/2));

/* --- End of Earth --- */

/* --- Earth --- */

// --- Earth Base ---
// Create a new MeshPhysicalMaterial for Earth
const earthMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: earthDayTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Earth = new THREE.Mesh( new THREE.SphereGeometry(1.31), earthMaterial );
// Instantiate the Earth on the scene
scene.add( Earth );
Earth.position.set(45*Math.cos(((DOY)/365)*Math.PI*2 - Math.PI/2), 0, 45*Math.sin((DOY/365)*Math.PI*2 - Math.PI/2));

/* --- End of Earth --- */

/* --- Moon --- */

// Create a THREE.MeshPhysicalMaterial for moon to have moon cycles due to Shadow Casting
const moonMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,                                   // Set Moon's Base Color White
  map: moonTexture, // Load the Moon texture
  metalness: 0.0,                                    // 0.0% Metalness
  roughness: 1.0,                                    // 100% Roughness
  clearcoat: 1.0,                                    // 100% Clearcoat
  clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  reflectivity: 0.0,                                 // 0.0% Reflectivity
});
// Create a THREE.Mesh Sphere object with moonmaterial
const moon = new THREE.Mesh( new THREE.SphereGeometry(0.36), moonMaterial );
// Set the moon's current position using the Day of the Year to find the exact spot on the Orbit
moon.position.set(45*Math.cos(((DOY)/365)*Math.PI*2 - Math.PI/2) + 3*Math.sin((DOY/27)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/27)*Math.PI*2 - Math.PI/2), 45*Math.sin((DOY/365)*Math.PI*2 - Math.PI/2) + 3*Math.cos((DOY/27)*Math.PI*2 - Math.PI/2));
// Instantiate moon
scene.add(moon);

/* --- End of Moon --- */

/* --- Mars --- */

// --- Mars ---
// Create a new MeshPhysicalMaterial for Earth
const marsMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: marsTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Mars = new THREE.Mesh( new THREE.SphereGeometry(0.69), marsMaterial );
// Instantiate the Earth on the scene
scene.add( Mars );
Mars.position.set(55*Math.cos(((DOY+200)/687)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/687)*Math.PI*2 - Math.PI/2), 55*Math.sin(((DOY+200)/687)*Math.PI*2 - Math.PI/2));

/* --- End of Mars --- */

/* --- Jupiter --- */

// --- Jupiter Base ---
// Create a new MeshPhysicalMaterial for Earth
const jupiterMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: jupiterTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Jupiter = new THREE.Mesh( new THREE.SphereGeometry(14.32), jupiterMaterial );
// Instantiate the Earth on the scene
scene.add( Jupiter );
Jupiter.position.set(155*Math.cos(((DOY+2000)/4333)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/4333)*Math.PI*2 - Math.PI/2), 155*Math.sin(((DOY+2000)/4333)*Math.PI*2 - Math.PI/2));

/* --- End of Jupiter --- */

/* --- Saturn --- */

// --- Saturn Base ---
// Create a new MeshPhysicalMaterial for Earth
const saturnMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: saturnTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Saturn = new THREE.Mesh( new THREE.SphereGeometry(11.93), saturnMaterial );
// Instantiate the Earth on the scene
scene.add( Saturn );
Saturn.position.set(195*Math.cos(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2), 0.3*Math.sin((DOY/10756)*Math.PI*2 - Math.PI/2), 195*Math.sin(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2));

// --- Saturn Rings ---
const geometry = new THREE.RingBufferGeometry(3, 5, 64);
var pos = geometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++){
	v3.fromBufferAttribute(pos, i);
	geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
}
  
const material = new THREE.MeshBasicMaterial({
	map: saturnRingsTexture,
	side: THREE.DoubleSide,
	transparent: true,                                 // Does show behind
	blending: THREE.AdditiveBlending,                  // Blends with the environment behind using THREE.AdditiveBlending
	depthWrite: false,                                 // Lightblocking off
});
const rings = new THREE.Mesh(geometry, material);
scene.add(rings);
rings.scale.set(4,4,4);
rings.rotation.x = Math.PI/2;
rings.position.set(195*Math.cos(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2), 0.3*Math.sin((DOY/10756)*Math.PI*2 - Math.PI/2), 195*Math.sin(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2));

/* --- End of Saturn --- */

/* --- Uranus --- */

// --- Uranus Base ---
// Create a new MeshPhysicalMaterial for Earth
const uranusMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: uranusTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Uranus = new THREE.Mesh( new THREE.SphereGeometry(5.20), uranusMaterial );
// Instantiate the Earth on the scene
scene.add( Uranus );
Uranus.position.set(235*Math.cos(((DOY+10000)/30681)*Math.PI*2 - Math.PI/2), 1*Math.sin((DOY/30681)*Math.PI*2 - Math.PI/2), 235*Math.sin(((DOY+10000)/30681)*Math.PI*2 - Math.PI/2));

/* --- End of Earth --- */

/* --- Neptune --- */

// --- Neptune Base ---
// Create a new MeshPhysicalMaterial for Earth
const neptuneMaterial = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,                                   // Set Moon's Base Color White
	map: neptuneTexture,
	transparent: false,   
  	metalness: 0.0,                                    // 0.0% Metalness
  	roughness: 1.0,                                    // 100% Roughness
  	clearcoat: 1.0,                                    // 100% Clearcoat
  	clearcoatRoughness: 1.0,                           // 100% ClearcoatRoughness
  	reflectivity: 0.0,                                 // 0.0% Reflectivity
} );
// Instantiate the Earth variable as a new THREE.Mesh using the custom MeshPhysicalMaterial
const Neptune = new THREE.Mesh( new THREE.SphereGeometry(5.05), neptuneMaterial );
// Instantiate the Earth on the scene
scene.add( Neptune );
Neptune.position.set(275*Math.cos(((DOY-50000)/60266.3)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/60266.3)*Math.PI*2 - Math.PI/2), 275*Math.sin(((DOY-50000)/60266.3)*Math.PI*2 - Math.PI/2));

/* --- End of Neptune --- */

/* --- Orbital Rings --- */

// Common material
const orbitMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
});

// --- Marcury Orbit ---
// Create a ring at the orbit of Mercury to represent Mercury's orbit
const mercuryOrbitGeometry = new THREE.RingGeometry(25, 25.1, 64);
const mercuryOrbit = new THREE.Mesh(mercuryOrbitGeometry, orbitMaterial);
mercuryOrbit.rotation.x = Math.PI/2;
scene.add(mercuryOrbit);
// --- End of Mercury Orbit ---

// --- Venus Orbit ---
// Create a ring at the orbit of Venus to represent Venus's orbit
const venusOrbitGeometry = new THREE.RingGeometry(35, 35.1, 64);
const venusOrbit = new THREE.Mesh(venusOrbitGeometry, orbitMaterial);
venusOrbit.rotation.x = Math.PI/2;
scene.add(venusOrbit);
// --- End of Venus Orbit ---

// --- Earth Orbit ---
// Create a ring at the orbit of Earth to represent Earth's orbit
const earthOrbitGeometry = new THREE.RingGeometry(45, 45.1, 64);
const earthOrbit = new THREE.Mesh(earthOrbitGeometry, orbitMaterial);
earthOrbit.rotation.x = Math.PI/2;
scene.add(earthOrbit);
// --- End of Earth Orbit ---

// --- Mars Orbit ---
// Create a ring at the orbit of Mars to represent Mars's orbit
const marsOrbitGeometry = new THREE.RingGeometry(55, 55.1, 64);
const marsOrbit = new THREE.Mesh(marsOrbitGeometry, orbitMaterial);
marsOrbit.rotation.x = Math.PI/2;
scene.add(marsOrbit);
// --- End of Mars Orbit ---

// --- Jupiter Orbit ---
// Create a ring at the orbit of Jupiter to represent Jupiter's orbit
const jupiterOrbitGeometry = new THREE.RingGeometry(155, 155.1, 64);
const jupiterOrbit = new THREE.Mesh(jupiterOrbitGeometry, orbitMaterial);
jupiterOrbit.rotation.x = Math.PI/2;
scene.add(jupiterOrbit);
// --- End of Jupiter Orbit ---

// --- Saturn Orbit ---
// Create a ring at the orbit of Saturn to represent Saturn's orbit
const saturnOrbitGeometry = new THREE.RingGeometry(195, 195.1, 64);
const saturnOrbit = new THREE.Mesh(saturnOrbitGeometry, orbitMaterial);
saturnOrbit.rotation.x = Math.PI/2;
scene.add(saturnOrbit);
// --- End of Saturn Orbit ---

// --- Uranus Orbit ---
// Create a ring at the orbit of Uranus to represent Uranus's orbit
const uranusOrbitGeometry = new THREE.RingGeometry(235, 235.1, 64);
const uranusOrbit = new THREE.Mesh(uranusOrbitGeometry, orbitMaterial);
uranusOrbit.rotation.x = Math.PI/2;
scene.add(uranusOrbit);
// --- End of Uranus Orbit ---

// --- Neptune Orbit ---
// Create a ring at the orbit of Neptune to represent Neptune's orbit
const neptuneOrbitGeometry = new THREE.RingGeometry(275, 275.1, 64);
const neptuneOrbit = new THREE.Mesh(neptuneOrbitGeometry, orbitMaterial);
neptuneOrbit.rotation.x = Math.PI/2;
scene.add(neptuneOrbit);
// --- End of Neptune Orbit ---

window.addEventListener('mousedown', function() {
	gsap.to(camera.position, {
		z: Earth.position.z + 2,
		y: Earth.position.y + 2,
		x: Earth.position.x + 2,
		duration: 1.5
	});

	controls.target.set(Earth.position.x, Earth.position.y, Earth.position.z);

	console.log(camera.position);
});


/* --- end of Orbital Rings --- */

/* animate() Function
 * Parameters:
 *  - none
 * Returns:
 *  - none but it sets the animations for THREE.Mesh objects.
 */
function animate() {
  requestAnimationFrame( animate );

  /*
  Mercury.position.set(25*Math.cos(((DOY+10)/88)*Math.PI*2 - Math.PI/2), 0.5*Math.sin((DOY/88)*Math.PI*2 - Math.PI/2), 25*Math.sin(((DOY+10)/88)*Math.PI*2 - Math.PI/2));
  Venus.position.set(35*Math.cos(((DOY+100)/225)*Math.PI*2 - Math.PI/2), 0.55*Math.sin((DOY/225)*Math.PI*2 - Math.PI/2), 35*Math.sin(((DOY+100)/225)*Math.PI*2 - Math.PI/2));
  Earth.position.set(45*Math.cos(((DOY)/365)*Math.PI*2 - Math.PI/2), 0, 45*Math.sin((DOY/365)*Math.PI*2 - Math.PI/2));
  moon.position.set(45*Math.cos(((DOY)/365)*Math.PI*2 - Math.PI/2) + 3*Math.sin((DOY/27)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/27)*Math.PI*2 - Math.PI/2), 45*Math.sin((DOY/365)*Math.PI*2 - Math.PI/2) + 3*Math.cos((DOY/27)*Math.PI*2 - Math.PI/2));
  Mars.position.set(55*Math.cos(((DOY+200)/687)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/687)*Math.PI*2 - Math.PI/2), 55*Math.sin(((DOY+200)/687)*Math.PI*2 - Math.PI/2));
  Jupiter.position.set(85*Math.cos(((DOY+500)/4333)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/4333)*Math.PI*2 - Math.PI/2), 85*Math.sin(((DOY+500)/4333)*Math.PI*2 - Math.PI/2));
  Saturn.position.set(125*Math.cos(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2), 0.3*Math.sin((DOY/10756)*Math.PI*2 - Math.PI/2), 125*Math.sin(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2));
  rings.position.set(125*Math.cos(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2), 0.3*Math.sin((DOY/10756)*Math.PI*2 - Math.PI/2), 125*Math.sin(((DOY-1000)/10756)*Math.PI*2 - Math.PI/2));
  Uranus.position.set(165*Math.cos(((DOY+10000)/30681)*Math.PI*2 - Math.PI/2), 1*Math.sin((DOY/30681)*Math.PI*2 - Math.PI/2), 165*Math.sin(((DOY+10000)/30681)*Math.PI*2 - Math.PI/2));
  Neptune.position.set(205*Math.cos(((DOY-50000)/60266.3)*Math.PI*2 - Math.PI/2), 0.1*Math.sin((DOY/60266.3)*Math.PI*2 - Math.PI/2), 205*Math.sin(((DOY-50000)/60266.3)*Math.PI*2 - Math.PI/2));
  */

  // Update the controls for the Orbital Camera to rotate automatically
  controls.update();

  // Rerender the scene
  renderer.render(scene, camera);
}
/* --- End of Functions --- */

// Call the animate() function
animate();