import * as THREE from 'three';

export class Player {
    constructor(scene, id, name, color) {
        this.scene = scene;
        this.name = name || 'Player 1';
        this.id = id;
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial({ color: color })
        );
        this.cube.position.y = 0.5;

        this.scene.add(this.cube);
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }   

    setName(name) {
        this.name = name;
    }

    getItem() {
        return this.cube;
    }

    setPosition(position) {
        this.cube.position = new THREE.Vector3(
            position.x, position.y, position.z
        )
    }

    getPositionTHREE() {
        return this.cube.position;
    }

    getPosition() {
        return {x: this.cube.position.x, y: this.cube.position.y, z: this.cube.position.z}
    }

}

export class PlayerSelf extends Player {
    constructor(id, name, color, camera) {
        super(id = id, name = name, color = color);

        this.camera = camera;

    }

    move(direction, speed = 0.005) {
        this.cube.position.x += direction.x * speed;
        this.cube.position.z += direction.z * speed;
        //this.camera.lookAt(this.cube.position);
    }
}