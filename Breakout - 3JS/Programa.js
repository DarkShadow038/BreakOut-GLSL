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
	table,
	tablePosX = 0,
	tablePosY = 0,
    cubes = [],
	cubePosX = 0,
    cubePosY = 0;
	
	
const maxBlocks = 120;

function main()
{
    // 1 - Setup da Cena / Camera e Renderer
    setup();

    // 2.0 - Cria as geometrias
    getCubeData();
    getTableData();
    getBallData();

    // 2.1 - Adicionar à cena
    cubePosX = -30;
    cubePosY = 15;

    cubes.forEach(cube => {

        scene.add(cube);

        cube.translateX(cubePosX);
        cube.translateY(cubePosY);
		
        cubePosX += 3;

        if (cubePosX >= 30)
        {
            cubePosX = -30;
            cubePosY -= 1;
        }
    });	
		
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
	moveBall();
	requestAnimationFrame(animate);
}

function createLights()
{
    var ambient = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambient);
}

function getCubeData()
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
		
        cubes[i] = new THREE.Mesh(geometry, material);
    }
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

function moveBall()
{
	ballPosX = 0.4;
	ballPosY = 0.4;
	ball.translateX(ballPosX);
	ball.translateY(ballPosY);
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

main();