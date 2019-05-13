/* Vari�vei globais */

let {mat4, vec4, vec3, vec2} = glMatrix;

let xAngle = 1,
    yAngle = 1,
    ballSpeed = 0.4,
    tableSpeed = 1,
	turnCamChance = 15;

let kl = 0, 
    kr = 0;


let i = 1,
    j = 1,
    k = 1,    
    frame = 0,
    frameIncrease = true,
    time,
    canvas,
    gl,
    vertexShaderSource,
    fragmentShaderSource,
    vertexShader,
    fragmentShader,
    shaderProgram,
    data,
    positionAttr,
    positionBuffer,
    width,height,
    projectionUniform,
    projection,
    loc = [0, 0, 0],
    modelUniform,
    block = [],
    maxBlocks = 100,
    showBlock = [],
    blockActive = true,
    blockPos = [0, 0, 0],
    table,
    tablePos = [0, 0, 0],
    ball,
    ballPos = [0, 0, 0],
    ballX = 0,
    ballY = 0,
    wallPos = [0, 0, 0],
    reverseBallX = true,   
    reverseBallY = true,
    viewUniform,
    view,
    eye,
    colorUniform,
    
    active = false,
    
    xUp = 0,
    yUp = 1,
    zEye = 50,
    activeLoop = true,

    xA = -50, yA = 30, zA =  1,
    xB = -45, yB = 30, zB =  1,
    xC = -50, yC = 28, zC =  1,
    xD = -45, yD = 28, zD =  1,
    xE = -50, yE = 30, zE = -1,
    xF = -45, yF = 30, zF = -1,
    xG = -50, yG = 28, zG = -1,
    xH = -45, yH = 28, zH = -1,

    xAt = -5, yAt = -30, zAt =  1,
    xBt =  5, yBt = -30, zBt =  1,
    xCt = -5, yCt = -32, zCt =  1,
    xDt =  5, yDt = -32, zDt =  1,
    xEt = -5, yEt = -30, zEt = -1,
    xFt =  5, yFt = -30, zFt = -1,
    xGt = -5, yGt = -32, zGt = -1,
    xHt =  5, yHt = -32, zHt = -1,

    xAb = -1, yAb = -28, zAb =  1,
    xBb =  1, yBb = -28, zBb =  1,
    xCb = -1, yCb = -30, zCb =  1,
    xDb =  1, yDb = -30, zDb =  1,
    xEb = -1, yEb = -28, zEb = -1,
    xFb =  1, yFb = -28, zFb = -1,
    xGb = -1, yGb = -30, zGb = -1,
    xHb =  1, yHb = -30, zHb = -1.
    
    xAw = -68, yAw = 38, zAw =0.1,
    xBw = -66, yBw = 38, zBw =0.1,
    xCw = -68, yCw =-65, zCw =0.1,
    xDw = -66, yDw =-65, zDw =0.1,
    xEw = -68, yEw = 38, zEw =-0.1,
    xFw = -66, yFw = 38, zFw =-0.1,
    xGw = -68, yGw =-65, zGw =-0.1,
    xHw = -66, yHw =-65, zHw =-0.1,
    
    xAw2 = -67, yAw2 = 38, zAw2 =0.12,
    xBw2 =  67, yBw2 = 38, zBw2 =0.12,
    xCw2 = -67, yCw2 = 36, zCw2 =0.12,
    xDw2 =  67, yDw2 = 36, zDw2 =0.12,
    xEw2 = -67, yEw2 = 38, zEw2 =-0.1,
    xFw2 =  67, yFw2 = 38, zFw2 =-0.1,
    xGw2 = -67, yGw2 = 36, zGw2 =-0.1,
    xHw2 =  67, yHw2 = 36, zHw2 =-0.1;

function resize() 
{
    if (!gl) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    gl.viewport(0, 0, width, height);
    let aspect = width / height;
    let near = 0.001;
    let far = 1000;
    let fovy = 1.3;
    projectionUniform = gl.getUniformLocation(shaderProgram, "projection");
    projection = mat4.perspective([], fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionUniform, false, projection);
}

function getCanvas() 
{
    return document.querySelector("canvas");
}

function getGLContext(canvas) 
{
    let gl = canvas.getContext("webgl");
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    return gl;
}

function compileShader(source, type, gl) 
{
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error("ERRO NA COMPILA��O", gl.getShaderInfoLog(shader));
    return shader;
}

function linkProgram(vertexShader, fragmentShader, gl) 
{
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.error("ERRO NA LINKAGEM");
    return program;
}

function getData() 
{    
    // Cria uma matriz de pontos com todos os pontos necess�rios para o bloco
    let p = {
            a: [xA, yA, zA], 
            b: [xB, yB, zB],
            c: [xC, yC, zC],
            d: [xD, yD, zD],
            e: [xE, yE, zE], 
            f: [xF, yF, zF],
            g: [xG, yG, zG],             
            h: [xH, yH, zH],

            at: [xAt, yAt, zAt], 
            bt: [xBt, yBt, zBt],
            ct: [xCt, yCt, zCt],
            dt: [xDt, yDt, zDt],
            et: [xEt, yEt, zEt], 
            ft: [xFt, yFt, zFt],
            gt: [xGt, yGt, zGt], 
            ht: [xHt, yHt, zHt],

            ab: [xAb, yAb, zAb], 
            bb: [xBb, yBb, zBb],
            cb: [xCb, yCb, zCb],
            db: [xDb, yDb, zDb],
            eb: [xEb, yEb, zEb], 
            fb: [xFb, yFb, zFb],
            gb: [xGb, yGb, zGb], 
            hb: [xHb, yHb, zHb],
            
            aw: [xAw, yAw, zAw], 
            bw: [xBw, yBw, zBw],
            cw: [xCw, yCw, zCw],
            dw: [xDw, yDw, zDw],
            ew: [xEw, yEw, zEw], 
            fw: [xFw, yFw, zFw],
            gw: [xGw, yGw, zGw], 
            hw: [xHw, yHw, zHw],

            aw2: [xAw2, yAw2, zAw2], 
            bw2: [xBw2, yBw2, zBw2],
            cw2: [xCw2, yCw2, zCw2],
            dw2: [xDw2, yDw2, zDw2],
            ew2: [xEw2, yEw2, zEw2], 
            fw2: [xFw2, yFw2, zFw2],
            gw2: [xGw2, yGw2, zGw2], 
            hw2: [xHw2, yHw2, zHw2],
    };        
            // A cada loop, adiciona no final da matriz todos os novos pontos
    let faces =  [
        //Front            
        ...p.a, ...p.b, ...p.c,
        ...p.d, ...p.c, ...p.b,
        //Back
        ...p.e, ...p.f, ...p.g,
        ...p.h, ...p.g, ...p.f,
        //Top
        ...p.e, ...p.f, ...p.a,
        ...p.b, ...p.a, ...p.f,
        //Down
        ...p.g, ...p.h, ...p.c,
        ...p.d, ...p.c, ...p.h,
        //Left
        ...p.a, ...p.e, ...p.c,
        ...p.g, ...p.c, ...p.e,
        //Right
        ...p.b, ...p.f, ...p.d,
        ...p.h, ...p.d, ...p.f,

        ...p.a, ...p.e, ...p.f, ...p.b, 
        ...p.a, ...p.c, ...p.g, ...p.e,
        ...p.a, ...p.b, ...p.d, ...p.c,
        ...p.a, ...p.e, ...p.f, ...p.h, ...p.g, ...p.e,
        ...p.g, ...p.h, ...p.d, ...p.c, ...p.g,
        ...p.h, ...p.f, ...p.b, ...p.d, ...p.h,
        //_______________//


        //Front            
        ...p.at, ...p.bt, ...p.ct,
        ...p.dt, ...p.ct, ...p.bt,
        //Back
        ...p.et, ...p.ft, ...p.gt,
        ...p.ht, ...p.gt, ...p.ft,
        //Top
        ...p.et, ...p.ft, ...p.at,
        ...p.bt, ...p.at, ...p.ft,
        //Down
        ...p.gt, ...p.ht, ...p.ct,
        ...p.dt, ...p.ct, ...p.ht,
        //Left
        ...p.at, ...p.et, ...p.ct,
        ...p.gt, ...p.ct, ...p.et,
        //Right
        ...p.bt, ...p.ft, ...p.dt,
        ...p.ht, ...p.dt, ...p.ft,

        ...p.at, ...p.et, ...p.ft, ...p.bt, 
        ...p.at, ...p.ct, ...p.gt, ...p.et,
        ...p.at, ...p.bt, ...p.dt, ...p.ct,
        ...p.at, ...p.et, ...p.ft, ...p.ht, ...p.gt, ...p.et,
        ...p.gt, ...p.ht, ...p.dt, ...p.ct, ...p.gt,
        ...p.ht, ...p.ft, ...p.bt, ...p.dt, ...p.ht,
        //_______________//


        //Front            
        ...p.ab, ...p.bb, ...p.cb,
        ...p.db, ...p.cb, ...p.bb,
        //Back
        ...p.eb, ...p.fb, ...p.gb,
        ...p.hb, ...p.gb, ...p.fb,
        //Top
        ...p.eb, ...p.fb, ...p.ab,
        ...p.bb, ...p.ab, ...p.fb,
        //Down
        ...p.gb, ...p.hb, ...p.cb,
        ...p.db, ...p.cb, ...p.hb,
        //Left
        ...p.ab, ...p.eb, ...p.cb,
        ...p.gb, ...p.cb, ...p.eb,
        //Right
        ...p.bb, ...p.fb, ...p.db,
        ...p.hb, ...p.db, ...p.fb,

        ...p.ab, ...p.eb, ...p.fb, ...p.bb, 
        ...p.ab, ...p.cb, ...p.gb, ...p.eb,
        ...p.ab, ...p.bb, ...p.db, ...p.cb,
        ...p.ab, ...p.eb, ...p.fb, ...p.hb, ...p.gb, ...p.eb,
        ...p.gb, ...p.hb, ...p.db, ...p.cb, ...p.gb,
        ...p.hb, ...p.fb, ...p.bb, ...p.db, ...p.hb,
        //_______________//


        //Front            
        ...p.aw, ...p.bw, ...p.cw,
        ...p.dw, ...p.cw, ...p.bw,
        //Back
        ...p.ew, ...p.fw, ...p.gw,
        ...p.hw, ...p.gw, ...p.fw,
        //Top
        ...p.ew, ...p.fw, ...p.aw,
        ...p.bw, ...p.aw, ...p.fw,
        //Down
        ...p.gw, ...p.hw, ...p.cw,
        ...p.dw, ...p.cw, ...p.hw,
        //Left
        ...p.aw, ...p.ew, ...p.cw,
        ...p.gw, ...p.cw, ...p.ew,
        //Right
        ...p.bw, ...p.fw, ...p.dw,
        ...p.hw, ...p.dw, ...p.fw,

        ...p.aw, ...p.ew, ...p.fw, ...p.bw, 
        ...p.aw, ...p.cw, ...p.gw, ...p.ew,
        ...p.aw, ...p.bw, ...p.dw, ...p.cw,
        ...p.aw, ...p.ew, ...p.fw, ...p.hw, ...p.gw, ...p.ew,
        ...p.gw, ...p.hw, ...p.dw, ...p.cw, ...p.gw,
        ...p.hw, ...p.fw, ...p.bw, ...p.dw, ...p.hw,
        //_______________//


        //Front            
        ...p.aw2, ...p.bw2, ...p.cw2,
        ...p.dw2, ...p.cw2, ...p.bw2,
        //Back
        ...p.ew2, ...p.fw2, ...p.gw2,
        ...p.hw2, ...p.gw2, ...p.fw2,
        //Top
        ...p.ew2, ...p.fw2, ...p.aw2,
        ...p.bw2, ...p.aw2, ...p.fw2,
        //Down
        ...p.gw2, ...p.hw2, ...p.cw2,
        ...p.dw2, ...p.cw2, ...p.hw2,
        //Left
        ...p.aw2, ...p.ew2, ...p.cw2,
        ...p.gw2, ...p.cw2, ...p.ew2,
        //Right
        ...p.bw2, ...p.fw2, ...p.dw2,
        ...p.hw2, ...p.dw2, ...p.fw2,

        ...p.aw2, ...p.ew2, ...p.fw2, ...p.bw2, 
        ...p.aw2, ...p.cw2, ...p.gw2, ...p.ew2,
        ...p.aw2, ...p.bw2, ...p.dw2, ...p.cw2,
        ...p.aw2, ...p.ew2, ...p.fw2, ...p.hw2, ...p.gw2, ...p.ew2,
        ...p.gw2, ...p.hw2, ...p.dw2, ...p.cw2, ...p.gw2,
        ...p.hw2, ...p.fw2, ...p.bw2, ...p.dw2, ...p.hw2
    ];    

    let n = {
        frente: [0,0,1],
        topo: [0,1,0],
        baixo: [0,-1,0],
        esquerda: [-1,0,0],
        direita: [1,0,0],
        fundo: [0,0,-1],
      };
    
      let faceNormals = {
        frente: [...n.frente, ...n.frente, ...n.frente, ...n.frente, ...n.frente, ...n.frente],
        topo: [...n.topo, ...n.topo, ...n.topo, ...n.topo, ...n.topo, ...n.topo],
        baixo: [...n.baixo, ...n.baixo, ...n.baixo, ...n.baixo, ...n.baixo, ...n.baixo],
        esquerda: [...n.esquerda, ...n.esquerda, ...n.esquerda, ...n.esquerda, ...n.esquerda, ...n.esquerda],
        direita: [...n.direita, ...n.direita, ...n.direita, ...n.direita, ...n.direita, ...n.direita],
        fundo: [...n.fundo, ...n.fundo, ...n.fundo, ...n.fundo, ...n.fundo, ...n.fundo],

        
        frente2: [...n.frente, ...n.frente, ...n.frente, ...n.frente],
        topo2: [...n.topo, ...n.topo, ...n.topo, ...n.topo],
        baixo2: [...n.baixo, ...n.baixo, ...n.baixo, ...n.baixo],
        esquerda2: [...n.esquerda, ...n.esquerda, ...n.esquerda, ...n.esquerda, ...n.esquerda, ...n.esquerda],
        direita2: [...n.direita, ...n.direita, ...n.direita, ...n.direita, ...n.direita],
        fundo2: [...n.fundo, ...n.fundo, ...n.fundo, ...n.fundo, ...n.fundo],
      };
    
      let normals = [
        ...faceNormals.frente,
        ...faceNormals.fundo,
        ...faceNormals.topo,
        ...faceNormals.baixo,
        ...faceNormals.esquerda,
        ...faceNormals.direita,

        ...faceNormals.frente2,
        ...faceNormals.fundo2,
        ...faceNormals.topo2,
        ...faceNormals.baixo2,
        ...faceNormals.esquerda2,
        ...faceNormals.direita2,
        
        ...faceNormals.frente,
        ...faceNormals.fundo,
        ...faceNormals.topo,
        ...faceNormals.baixo,
        ...faceNormals.esquerda,
        ...faceNormals.direita,

        ...faceNormals.frente2,
        ...faceNormals.fundo2,
        ...faceNormals.topo2,
        ...faceNormals.baixo2,
        ...faceNormals.esquerda2,
        ...faceNormals.direita2,
        
        ...faceNormals.frente,
        ...faceNormals.fundo,
        ...faceNormals.topo,
        ...faceNormals.baixo,
        ...faceNormals.esquerda,
        ...faceNormals.direita,

        ...faceNormals.frente2,
        ...faceNormals.fundo2,
        ...faceNormals.topo2,
        ...faceNormals.baixo2,
        ...faceNormals.esquerda2,
        ...faceNormals.direita2,
        
        ...faceNormals.frente,
        ...faceNormals.fundo,
        ...faceNormals.topo,
        ...faceNormals.baixo,
        ...faceNormals.esquerda,
        ...faceNormals.direita,

        ...faceNormals.frente2,
        ...faceNormals.fundo2,
        ...faceNormals.topo2,
        ...faceNormals.baixo2,
        ...faceNormals.esquerda2,
        ...faceNormals.direita2,
        
        ...faceNormals.frente,
        ...faceNormals.fundo,
        ...faceNormals.topo,
        ...faceNormals.baixo,
        ...faceNormals.esquerda,
        ...faceNormals.direita,

        ...faceNormals.frente2,
        ...faceNormals.fundo2,
        ...faceNormals.topo2,
        ...faceNormals.baixo2,
        ...faceNormals.esquerda2,
        ...faceNormals.direita2,
        
        
      ];
 
    
    return {"points" : new Float32Array(faces), "normals": new Float32Array(normals)};
}

async function main() 
{    
    // 1 - Carregar tela de desenho
    canvas = getCanvas();

    // 2 - Carregar o contexto (API) WebGL
    gl = getGLContext(canvas);

    // 3 - Ler os arquivos de shader
    vertexShaderSource = await fetch("Vertex.glsl").then(r => r.text());
    console.log("VERTEX", vertexShaderSource);
    fragmentShaderSource = await fetch("Fragment.glsl").then(r => r.text());
    console.log("FRAGMENT", fragmentShaderSource);

    // 4 - Compilar arquivos de shader
    vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
    fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl);
    

    // 5 - Linkar o programa de shader
    shaderProgram = linkProgram(vertexShader, fragmentShader, gl);
    gl.useProgram(shaderProgram);

    // 6 - Criar dados de par�metro
    data = getData();

    // 7 - Transferir os dados para GPU
    positionAttr = gl.getAttribLocation(shaderProgram, "position");
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0);

    normalAttr = gl.getAttribLocation(shaderProgram, "normal");
    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.normals, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttr);
    gl.vertexAttribPointer(normalAttr, 3, gl.FLOAT, false, 0, 0);

    // 7.1 - PROJECTION MATRIX UNIFORM
    resize();
    window.addEventListener("resize", resize);

    // 7.2 - VIEW MATRIX UNIFORM
    eye  = [0, 0, zEye];
    let up = [xUp, yUp, 0];
    let center = [0, 0, 0];
    view = mat4.lookAt([], eye, center, up);
    viewUniform = gl.getUniformLocation(shaderProgram, "view");
    gl.uniformMatrix4fv(viewUniform, false, view);

    // 7.3 - MODEL MATRIX UNIFORM
    modelUniform = gl.getUniformLocation(shaderProgram, "model");
    
    // 7.4 - COLOR UNIFORM
    colorUniform = gl.getUniformLocation(shaderProgram, "color");

    // 8 - Chamar o loop de redesenho
    render();
}

function render() 
{
    let hor = (kl + kr) * tableSpeed;
   
    tablePos[0] += hor;
	
    if(tablePos[0] < -60){
        tablePos[0] = -60;
    }
    if(tablePos[0] > 60){
        tablePos[0] = 60;
    }


    if (active)
    {	
        cam();
        
        if (time === 1 || time === 0)
        {
            active = false;
        }
    }
    
    // gl.POINTS
    // gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP
    // gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN 
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
    let i = 0,
        blockX = 0,
        blockY = 0;

    while (i <= maxBlocks) 
    {
        if(blockActive)
        {
            showBlock[i] = true;
        }

        if(i === 0)
        {
            block[i] = mat4.create();
        }
        else
        {
            if(showBlock[i] === true)
            {
                block[i] = mat4.fromTranslation([], blockPos);
                gl.uniformMatrix4fv(modelUniform, false, block[i]);
                gl.uniform3f(colorUniform, 1, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
                gl.polygonOffset(1, 1);
                gl.uniform3f(colorUniform, 0, 0, 0);
                gl.drawArrays(gl.LINE_STRIP, 36, 28);
            }
            if(i % 20 === 0)
            {
                blockY -= 2;
                blockX = 0;
            }
            else
            {   
                blockX += 5;
            }
        }


        blockPos[0] = blockX;
        blockPos[1] = blockY;

        i++;
    }

    blockActive = false;


    table = mat4.fromTranslation([], tablePos);
    gl.uniformMatrix4fv(modelUniform, false, table);
    gl.uniform3f(colorUniform, 0, 1, 1);
    gl.drawArrays(gl.TRIANGLES, 64, 36);
    gl.polygonOffset(1, 1);
    gl.uniform3f(colorUniform, 0, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 100, 28);

    ball = mat4.fromTranslation([], ballPos);
    gl.uniformMatrix4fv(modelUniform, false, ball);
    gl.uniform3f(colorUniform, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLES, 128, 36);
    gl.polygonOffset(1, 1);
    gl.uniform3f(colorUniform, 0, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 164, 28);

    wall = mat4.create();
    gl.uniformMatrix4fv(modelUniform, false, wall);
    gl.uniform3f(colorUniform, 1, 1, 0);
    gl.drawArrays(gl.TRIANGLES, 192, 36);
    
    wallPos[0] = 134;
    wall = mat4.fromTranslation([], wallPos);
    gl.uniformMatrix4fv(modelUniform, false, wall);
    gl.uniform3f(colorUniform, 1, 1, 0);
    gl.drawArrays(gl.TRIANGLES, 192, 36);
    
    wall2 = mat4.create();
    gl.uniformMatrix4fv(modelUniform, false, wall2);
    gl.uniform3f(colorUniform, 1, 1, 0);
    gl.drawArrays(gl.TRIANGLES, 256, 36);

    inverseBall();

	ballPos[0] = ballX * ballSpeed;
	ballPos[1] = ballY * ballSpeed;
	
    breakBlock();
    hitTable();
    hitWall();
	
	window.requestAnimationFrame(render);
}

function hitTable()
{
    let x1Table = tablePos[0] - 5,
        x2Table = tablePos[0] + 5,
        y1Table = tablePos[1] - 30,
        y2Table = tablePos[1] - 32,

        x1Ball = ballPos[0] - 1,
        x2Ball = ballPos[0] + 1,
        y1Ball = ballPos[1] - 28,
        y2Ball = ballPos[1] - 30;

    if(y2Ball <= y1Table && y2Ball >= y1Table - 1 && (x2Ball <= x2Table && x2Ball >= x1Table || x1Ball >= x1Table && x1Ball <= x2Table))
    { 
        if(x2Ball < x2Table && x2Ball >= x1Table + 5 || x1Ball >= x1Table + 5 && x1Ball <= x2Table)
        {
			xAngle = Math.abs((x2Table - x2Ball) / 5 - 1);
            reverseBallX = true;
        }
        else if(x2Ball > x1Table && x2Ball <= x2Table - 5 || x1Ball >= x1Table && x1 <= x2Table - 5)
        {
			xAngle = (x2Table - 5 - x2Ball) / 5;
            reverseBallX = false;
        }
        
        reverseBallY = true;  
    }
}

function breakBlock()
{
    let rand = Math.round(Math.random()*100);
    let x1Block,
        x2Block,
        y1Block,
        y2Block,

        x1Ball = ballPos[0] - 1,
        x2Ball = ballPos[0] + 1,
        y1Ball = ballPos[1] - 28,
        y2Ball = ballPos[1] - 30;

    for(let i = 1; i <= maxBlocks; i++)
    {   
        x1Block = block[i][12] - 50;
        x2Block = block[i][12] - 45;
        y1Block = block[i][13] + 30;
        y2Block = block[i][13] + 28;

        if(showBlock[i] === true)
        {
            // Acerta o bloco na direita
            if(x1Ball <= x2Block && x1Ball >= x2Block - 1 && ((y1Ball <= y1Block && y1Ball >= y2Block ) || (y2Ball >= y2Block && y2Ball <= y1Block)))
            {
                reverseBallX = true;  
                showBlock[i] = false;

                if (rand < turnCamChance)
                {
                    active = true;
                }
            }
            // Acerta o bloco na esquerda
            else if(x2Ball >= x1Block && x2Ball <= x1Block + 1 && ((y1Ball <= y1Block && y1Ball >= y2Block ) || (y2Ball >= y2Block && y2Ball <= y1Block)))
            {
                reverseBallX = false;  
                showBlock[i] = false;

                if (rand < turnCamChance)
                {
                    active = true;
                }
            }
            // Acerta o bloco em baixo
            else if(y1Ball >= y2Block && y1Ball <= y2Block + 1 && ((x1Ball >= x1Block && x1Ball <= x2Block ) || (x2Ball <= x2Block && x2Ball >= x1Block)))
            {
                reverseBallY = false;  
                showBlock[i] = false;

                if (rand < turnCamChance)
                {
                    active = true;
                }
            }
            // Acerta o bloco em cima
            else if(y2Ball <= y1Block && y2Ball >= y1Block - 1 && ((x1Ball >= x1Block && x1Ball <= x2Block ) || (x2Ball <= x2Block && x2Ball >= x1Block)))
            {
                reverseBallY = true;  
                showBlock[i] = false;

                if (rand < turnCamChance)
                {
                    active = true;
                }
            }
        }
    }    
}

function hitWall()
{
    let leftWall = xBw,
        rightWall = xBw + 132,
        topWall = yCw2,

        x1Ball = ballPos[0] - 1,
        x2Ball = ballPos[0] + 1,
        y1Ball = ballPos[1] - 28,
        y2Ball = ballPos[1] - 30;

    if(x1Ball <= leftWall)
    {
        reverseBallX = true;  
    }
    if(x2Ball >= rightWall)
    {
        reverseBallX = false;  
    }
    if(y1Ball >= topWall)
    {
        reverseBallY = false;  
    }
}

function inverseBall()
{
	if(!active)
	{
		if(reverseBallY == true)
		{
			ballY += yAngle;
		}
		else
		{
			ballY -= yAngle;
		}

		if(reverseBallX == true)
		{
			ballX += xAngle;
		}
		else
		{
			ballX -= xAngle;
		}
	}
}

function cam()
{      
    // Define se o frame aumenta ou diminui
    if (frameIncrease === true)
    {
       frame += 3;
    }
    else
    {
        frame -= 3;
    }

    time = frame / 120;

    // Faz com que o time sempre esteja entre 0 e 1
    if (time === 0)
    {
        frameIncrease = true;
    }
    else if (time === 1)
    {
        frameIncrease = false;
    }

    // Altera o Up de acordo com o time
    if (time <= 0.25)
    {
        xUp = time * 4;
    }
    else if (time <= 0.5)
    {
        yUp = -1 * (time * 4 - 2);
    }
    else if (time <= 0.75)
    {
        yUp = -1 * ((time - 0.5) * 4);    
    }
    else
    {
        xUp = -1 * ((time - 0.5) * 4 - 2);
    }
    
    // Altera o Eye de acordo com o time
    if (time <= 0.5)
    {
        zEye = 50 + (time * 120);    
    }
    else
    {
        zEye = 50 + (((time * 120) - 120) * -1);
    }
    
    eye  = [0, 0, zEye];
    up = [xUp, yUp, 0];
    center = [0, 0, 0];
    view = mat4.lookAt([], eye, center, up);
    gl.uniformMatrix4fv(viewUniform, false, view);
        
}

function keyUp(evt){
    if(evt.key === "a") return kl = 0;
    if(evt.key === "d") return kr = 0;
}

function keyPress(evt){
    
    if(evt.key === "a") {
        return kl = -1;
    }
    if(evt.key === "d") {
        return kr = 1;
    }
}

window.addEventListener("load", main);
window.addEventListener("keyup", keyUp);
window.addEventListener("keypress", keyPress);