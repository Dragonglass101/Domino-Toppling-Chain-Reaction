import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

export class Ball{
    constructor(x, y, z, r, tex){
        const ballGeometry = new THREE.SphereGeometry( r, 32, 16 );
        const ballMaterial = new THREE.MeshPhongMaterial( 
        { color: 0xaaaaaa,
            specular: 0xaaaaa,
            shininess: 500,
            emissive: 10,
            envMap: tex
        } );

        this.object = new THREE.Mesh( ballGeometry, ballMaterial );
        this.object.position.set(x, y, z)
        this.object.geometry.computeBoundingSphere();
        this.boundingsphere = new THREE.Sphere(this.object.position, 0.7);
        this.object.castShadow = true;
        // physics
        this.velocity = new THREE.Vector3(0, 0, 0);

        new RGBELoader().load("background-sky.hdr", function(texture){
            ballMaterial.envMap = texture;
          })
    }
    updatePosition(){
        this.object.position.x += this.velocity.x;
        this.object.position.y += this.velocity.y;
        this.object.position.z += this.velocity.z;
    }
}