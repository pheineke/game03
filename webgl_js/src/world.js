import * as THREE from 'three';

export class World {
    constructor() {
        this.terrain = new Terrain();
        
        this.players = {}
    }

    getTerrain() {
        return this.terrain.getItem();
    }

    addPlayer(player) {
        this.players[player.getID()] = player;
    }

    getPlayer(id) {
        return this.players[id];
    }

    getPlayers() {
        return this.players;
    }

    removePlayer(id) {
        delete this.players[id];
    }

}

export class Terrain {
    constructor(size = 100) {
        this.size = size;
        this.segments = size * 2;

        // Plane mit ausreichend Segmenten erstellen
        this.geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
        this.material = new THREE.MeshBasicMaterial({ color: 0x7a89a1 }); // Wireframe hilft beim Debuggen

        this.plane = new THREE.Mesh(this.geometry, this.material);

        // Rotiert die Plane, sodass sie horizontal liegt
        this.plane.rotation.x = -Math.PI / 2;

    }

    getItem() {
        return this.plane;
    }
}
