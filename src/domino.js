import * as THREE from "three";
// import { OBB } from 'three/addons/math/OBB.js';

export class Domino{
    constructor(x, y, z, dominoHeight, tex){
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, dominoHeight, 0.1),
            // new THREE.MeshStandardMaterial({ color: 0xff2222 })
            new THREE.MeshPhongMaterial( 
                { color: 0xff2222,
                  specular: 0x666666,
                  shininess: 50,
                  map: tex
                } )
        );
        this.mesh.position.set(0, dominoHeight/2, 0);
        this.mesh.castShadow = true;
        
        this.mesh.geometry.computeBoundingBox()
        this.boundingbox = new THREE.Box3();
        // this.boundingbox = this.mesh.geometry.boundingBox;

        this.object = new THREE.Group();
        
        this.object.add(this.mesh);
        // this.object.children[0].position.set(0, dominoHeight/2, 0);
        this.object.position.set(x, y, z);
        
        this.mesh.updateMatrixWorld()
        this.object.updateMatrixWorld()
        this.boundingbox.copy( this.mesh.geometry.boundingBox ).applyMatrix4( this.mesh.matrixWorld );
    }
    updateBoundingBox(){
        this.boundingbox.copy( this.mesh.geometry.boundingBox ).applyMatrix4( this.mesh.matrixWorld );
        // this.boundingbox = new THREE.Box3().setFromObject(this.object)
    }
}