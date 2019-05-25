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
    let posX = -30,
        posY = 15;

    cubes.forEach(cube => {

        scene.add(cube);

        cube.translateX(posX);
        cube.translateY(posY);
        posX += 3;

        if (posX === 30)
        {
            posX = -30;
            posY -= 1;
        }
    });

    // 3 - Criar luzes
    createLights();

    // 4 - Posicionar câmera
    camera.position.z = 25;
    camera.position.y = 3;

    camera.lookAt(0, 0, 0);

    // 5 - Inicia Loop de Redesenho
    animate();
}

function animate() 
{
    //cube[1].translateX(2);
    //cube.rotateY(Math.PI / 30); 
    //cubes[1].position.x += 0.01
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function createLights()
{
    var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    var light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(50, 50, 50);
    scene.add(light);
}

function getCubeData()
{
    var geometry = new THREE.BoxGeometry(3, 1, 1);
    var material = new THREE.MeshLambertMaterial({color: 0x00ff00});

    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
        new THREE.Vector3(-1.5, 0.5, -0.5), // A
        new THREE.Vector3(1.5, 0.5, -0.5),  // B
        new THREE.Vector3(1.5, 0.5, 0.5),   // C
        new THREE.Vector3(-1.5, 0.5, 0.5),  // D
        new THREE.Vector3(-1.5, 0.5, -0.5), // A
        new THREE.Vector3(-1.5, -0.5, -0.5), // F
        new THREE.Vector3(-1.5, -0.5, 0.5), // E
        new THREE.Vector3(-1.5, 0.5, 0.5), // D
        new THREE.Vector3(1.5, 0.5, 0.5),   // C
        new THREE.Vector3(1.5, -0.5, 0.5),   // H
        new THREE.Vector3(-1.5, -0.5, 0.5), // E
        new THREE.Vector3(-1.5, -0.5, -0.5), // F
        new THREE.Vector3(1.5, -0.5, -0.5), // G
        new THREE.Vector3(1.5, -0.5, 0.5),   // H
        new THREE.Vector3(1.5, -0.5, -0.5), // G
        new THREE.Vector3(1.5, 0.5, -0.5),  // B
    );
    
    
    for(let i = 0; i < maxBlocks; i++)
    {
        cubes[i] = new THREE.Mesh(geometry, material);
        cubes[i].add(new THREE.Line(lineGeometry, lineMaterial));
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