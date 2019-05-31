let kl = 0, 
    kr = 0;

let scene,
    camera,
    aspect,
    fovy,
    near,
    far,
    renderer,
    ball,
    ballPosX = 0,
    ballPosY = 0,
    ballSpeed = 0.25,
    table,
    tablePosX = 0,
    tablePosY = 0,
    tableSpeed = 0.5,
    walls = [],
    wallPosX = 0,
    wallPosY = 0,
    cont = 0,
    blocks = [],
    blockPosX = 0,
    blockPosY = 0;

const maxBlocks = 120,
      maxWalls = 3;

function main()
{
    // 1 - Setup da Cena / Camera e Renderer
    setup();

    // 2.0 - Cria as geometrias
    getBlockData();
    getTableData();
    getBallData();
    getWallData();

    // 2.1 - Adicionar à cena    
    scene.add(table);
    scene.add(ball);

    // 3 - Criar luzes
    createLights();

    // 4 - Posicionar câmera
    camera.position.z = 27.5;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // 5 - Inicia Loop de Redesenho
    animate();
}

function animate() 
{
    renderer.render(scene, camera);
    drawBlocks();
    drawWalls();
    moveBall();
    moveTable();
    breakBlock();
    requestAnimationFrame(animate);
}

function createLights()
{
    var ambient = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambient);
}

function getBlockData()
{
    let material,
        geometry = new THREE.BoxGeometry(3, 1, 1), // Dimensões da geometria
        texture = new THREE.TextureLoader().load('Textures/Cube.png' ); // Imagem de Textura
				
    for(let i = 0; i < maxBlocks; i++)
    {		
        if(i < 20)
                material = new THREE.MeshLambertMaterial({color: 0xff0000, map: texture});
        else if (i < 40)
                material = new THREE.MeshLambertMaterial({color: 0xffaf00, map: texture});
        else if (i < 60)
                material = new THREE.MeshLambertMaterial({color: 0xffff00, map: texture});
        else if (i < 80)
                material = new THREE.MeshLambertMaterial({color: 0x00ff00, map: texture});
        else if (i < 100)
                material = new THREE.MeshLambertMaterial({color: 0x00bbff, map: texture});
        else if (i < 120)
                material = new THREE.MeshLambertMaterial({color: 0xaa55ff, map: texture});
		
        blocks[i] = new THREE.Mesh(geometry, material);
    }
}

function drawBlocks()
{
    blockPosX = -30;
    blockPosY = 15;

    blocks.forEach(block => {

        if(block !== null)
        {
            scene.add(block);

            block.translateX(blockPosX);
            block.translateY(blockPosY);
        }
        else
            console.log(block);
		
        blockPosX += 3;

        if (blockPosX >= 30)
        {
            blockPosX = -30;
            blockPosY -= 1;
        }
    });	    
}

function drawWalls()
{
    wallPosX = -40;
    wallPosY = 0;
    
    walls.forEach(wall => {
        
        cont++;
        scene.add(wall);

        wall.translateX(wallPosX);
        wall.translateY(wallPosY);
		
        wallPosX += 80;

        if (cont === 3)
        {
            wall.position.x = 0;
            wall.position.y = 20.25;
            wall.position.z = -0.01;
        }
    });	
}

function getTableData()
{
	let geometry = new THREE.BoxGeometry(5, 1, 1), // Dimensões da geometria
		texture = new THREE.TextureLoader().load('Textures/Cube.png' ), // Imagem de Textura
		material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});
		
    table = new THREE.Mesh(geometry, material);
	
	tablePosY = -15;
	table.translateY(tablePosY);
}

function getBallData()
{
	let geometry = new THREE.SphereGeometry(0.5, 32, 32 ), // Dimensões da geometria
		texture = new THREE.TextureLoader().load('Textures/Cube.png' ), // Imagem de Textura
		material = new THREE.MeshLambertMaterial({color: 0xff8800});
		
    ball = new THREE.Mesh(geometry, material);	
	ballPosY = -14;
	ball.translateY(ballPosY);
}

function getWallData()
{ 
    let material,
        geometry,
        texture = new THREE.TextureLoader().load('Textures/Cube.png' ); // Imagem de Textura
        
    for(let i = 0; i < maxWalls; i++)
    {		
        if(i !== 2)
        {
            geometry = new THREE.BoxGeometry(1, 50, 1), // Dimensões da geometria
            material = new THREE.MeshLambertMaterial({color: 0xff0000, map: texture});
        }
        else
        {
            geometry = new THREE.BoxGeometry(80, 1, 1), // Dimensões da geometria
            material = new THREE.MeshLambertMaterial({color: 0xff0000, map: texture});
        }
		
        walls[i] = new THREE.Mesh(geometry, material);
    }    
}

function moveBall()
{
	ballPosX = ballSpeed;
	ballPosY = ballSpeed;
	ball.translateX(ballPosX);
	ball.translateY(ballPosY);
}

function moveTable()
{
    tablePosX = (kl + kr) * tableSpeed;
    table.translateX(tablePosX);
    
    if(table.position.x < -37)
        table.position.x = -37;
    
    if(table.position.x > 37)
        table.position.x = 37;
}

function breakBlock()
{
    let cubeLeftSide,
        cubeRightSide,
        cubeTopSide,
        cubeBottomSide;

        for(let i = 0; i < maxBlocks; i++)
        {
            if(blocks[i] !== null)
            {
                cubeLeftSide = blocks[i].position.x - 1.5;
                cubeRightSide = blocks[i].position.x + 1.5;
                cubeTopSide = blocks[i].position.y + 0.5;
                cubeBottomSide = blocks[i].position.x - 0.5;
            }
        }
        
        blocks[97] = null;

}

function setup()
{
    aspect = window.innerWidth / window.innerHeight;
    fovy = 75;
    near = 0.1;
    far = 1000;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fovy, aspect, near, far);
    renderer = new THREE.WebGLRenderer();
        
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


function keyUp(evt)
{
    if(evt.key === "a") return kl = 0;
    if(evt.key === "d") return kr = 0;
}

function keyPress(evt)
{    
    if(evt.key === "a") return kl = -1;
    
    if(evt.key === "d") return kr = 1;
}

main();
window.addEventListener("keyup", keyUp);
window.addEventListener("keypress", keyPress);