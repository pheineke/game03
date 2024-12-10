import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ConnectionHandler } from './connectionhandler.js';
import { Player, PlayerSelf } from './player.js';
import { World } from './world.js';


const canvas = document.getElementById('canvas');

// Szene erstellen
const scene = new THREE.Scene();

// Kamera erstellen
const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 10;
camera.position.y = 10;

camera.lookAt(new THREE.Vector3(0,0,0))


// Renderer erstellen
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const deltaTime = time - lastTime;
    lastTime = time;
    
    movePlayer(deltaTime);

    renderer.render(scene, camera);
}


// Controls:
// - W, A, S, D to move the cube

let direction = new THREE.Vector3();

let lastTime = 0;
let deltaTime = 0;


document.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
        case 'w':
            direction.z = -1;
            break;
        case 's':
            direction.z = 1;
            break;
        case 'a':
            direction.x = -1;
            break;
        case 'd':
            direction.x = 1;
            break;
        case ' ':
            player.jump(2);
            break;
        default:
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key.toLowerCase()) {
        case 'w':
            direction.z = 0;
            break;
        case 's':
            direction.z = 0;
            break;
        case 'a':
            direction.x = 0;
            break;
        case 'd':
            direction.x = 0;
            break;
        default:
            break;
    }
});

const queue = [];

let connection = new ConnectionHandler(`ws://localhost:8089?username=${name}&color=${color}`, queue);

function buildConnection(name, color) {´
    connection.socket.send(
        JSON.stringify(
            {
                type: 'JOIN',
                playername: name,
                color: color
            }
        )
    )
    connection.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type == 'SETID') {
            return message.id;
        }
    }
}

// World erstellen
const world = new World();
scene.add(world.getTerrain(100));

// Würfel erstellen
let player = null;

const playertable = document.getElementsByClassName('clients')[0]

function main() {
    const name = username_prompt();
    const userColor = getColorInput();
    const id = buildConnection(name, userColor);

    player = new PlayerSelf(scene, id, name, userColor, camera)
    animate();

    setInterval(function(){
        if (queue.length > 0) {
            const instruction = queue.pop();

            console.log("Instruction " + JSON.stringify(instruction))
            
            switch (instruction.type) {
                case 'INFO':
                    info(instruction);
                    break;
                case 'WORLDCHANGE':
                    break;
                case 'JOIN':
                    if (instruction.id == id) { return; }
                    world.addPlayer(
                        new Player(
                            id = instruction.id,
                            name = instruction.name,
                            color = instruction.color
                        )
                    )
                case 'LEAVE':
                    world.removePlayer(
                        instruction.clientid
                    )
                default:
                    break;
            }
        }

        connection.send(
            JSON.stringify(
                {
                    type: 'POSITION',
                    position: player.getPosition(),
                    TIME: new Date().toLocaleTimeString(),
                }
            )
        );
        
    }, 200);
}

main();

function username_prompt() {
    let person = prompt("Please enter your name", "Harry Potter");
    if (person == null || person == "") {
        username_prompt();
    } else {
        return person;
    }
}

function getColorInput() {
    let color = prompt("Enter a color in the format 0x000000 (hexadecimal):");

    // Validate input
    while (!/^0x[0-9A-Fa-f]{6}$/.test(color)) {
        alert("Invalid color format! Please use the format 0x000000.");
        color = prompt("Enter a color in the format 0x000000 (hexadecimal):");
    }

    return color;
}

function movePlayer(deltaTime) {
    direction.normalize();
    direction.multiplyScalar(deltaTime);
    
    player.move(direction);
}

function info(message) {
    const clients = message.client_info;

    let board = ""

    Object.keys(clients).forEach(id => {
        board += (clients[id].name + " \n") 
    });

    playertable.innerHTML = board


}

