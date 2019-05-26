let scene,
    camera,
    aspect,
    fovy,
    near,
    far,
    renderer,
    cubes = [],
    maxBlocks = 100;

function main()
{
    // 1 - Setup da Cena / Camera e Renderer
    setup();

    // 2.0 - Criar cubo
    getCubeData();

    // 2.1 - Adicionar à cena
    let posX = -30;
        posY = 15;

    cubes.forEach(cube => {

        scene.add(cube);

        cube.translateX(posX);
        cube.translateY(posY);
		
        posX += 3;

        if (posX >= 30)
        {
            posX = -30;
            posY -= 1;
        }
    });

    // 3 - Criar luzes
    createLights();

    // 4 - Posicionar câmera
    camera.position.z = 27;
    camera.position.y = 0;

    camera.lookAt(0, 0, 0);

    // 5 - Inicia Loop de Redesenho
    animate();
}

function animate() 
{
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function createLights()
{
    var ambient = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambient);
}

function getCubeData()
{
	let random,
		material,
		geometry = new THREE.BoxGeometry(3, 1, 1), // Dimensões da geometria
		texture = new THREE.TextureLoader().load('Textures/Cube.png' ); // Imagem de Textura
				
    for(let i = 0; i < maxBlocks; i++)
    {
		random = Math.round(Math.random() * 3);
		
		if(random === 0)
			material = new THREE.MeshLambertMaterial({color: 0xffff00, map: texture});
		else if (random === 1)
			material = new THREE.MeshLambertMaterial({color: 0x00ff00, map: texture});
		else if (random === 2)
			material = new THREE.MeshLambertMaterial({color: 0x0000ff, map: texture});
		else if (random === 3)
			material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});
		
        cubes[i] = new THREE.Mesh(geometry, material);
    }
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
