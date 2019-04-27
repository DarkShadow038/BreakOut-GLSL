/* Vari�vei globais */

let {mat4, vec4, vec3, vec2} = glMatrix;

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
    width,
    height,
    projectionUniform,
    projection,
    loc = [0, 0, 0],
    modelUniform,
    block,
    //blockPos = [30, 0, 0],
    table,
    ball,
    viewUniform,
    view,
    eye,
    colorUniform,
    Color = [],
    color1 = [1, 0, 0],
    tableWidth = window.innerWidth,
    tableHeight = window.innerHeight,
    
    active = false,
    
    xUp = 0,
    yUp = 1,
    zEye = 50,
    activeLoop = true,

    xA = -50, yA = 30, zA = 1,
    xB = -45, yB = 30, zB = 1,
    xC = -50, yC = 28, zC = 1,
    xD = -45, yD = 28, zD = 1,
    xE = -50, yE = 30, zE = -1,
    xF = -45, yF = 30, zF = -1,
    xG = -50, yG = 28, zG = -1,
    xH = -45, yH = 28, zH = -1;

// Define as cores de cada bloco e armazena na matriz
function cores()
{    
    let coresLoop = 0;
    
    while (coresLoop < 3)
    {
        Color[coresLoop] = Math.round(Math.random());

        coresLoop++;
        
        if (Color[0] === 1 && Color[1] === 1 && Color[2] === 1 || Color[0] === 0 && Color[1] === 0 && Color[2] === 0)
        {
            coresLoop = 0;
        }
    }
    
}

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
            h: [xH, yH, zH]
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
        ...p.h, ...p.f, ...p.b, ...p.d, ...p.h
    ];    
 
    
    return {"points" : new Float32Array(faces)};
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
    block = mat4.create();
    modelUniform = gl.getUniformLocation(shaderProgram, "model");
    
    //table = mat4.fromTranslation([], tablePos);

    
    // 7.4 - COLOR UNIFORM
    colorUniform = gl.getUniformLocation(shaderProgram, "color");

    // 8 - Chamar o loop de redesenho
    render();
}

function render() 
{
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
 
    //Block
    gl.uniformMatrix4fv(modelUniform, false, block);
    gl.uniform3f(colorUniform, color1[0], color1[1], color1[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.polygonOffset(1, 1);
    gl.uniform3f(colorUniform, 0, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 36, 28);

    // gl.uniformMatrix4fv(modelUniform, false, table);
    // gl.uniform3f(colorUniform, color1[0], color1[1], color1[2]);
    // gl.drawArrays(gl.TRIANGLES, 0, 36);
        
   window.requestAnimationFrame(main);
}

function cam()
{      
    // Define de o frame aumenta ou diminui
    if (frameIncrease === true)
    {
       frame++;
    }
    else
    {
        frame--;
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

function activeButton()
{
    document.onkeydown = function(event) 
    {
        switch (event.keyCode) 
        {
            case 32:
                if (!active)
                {
                    active = true;
                }
                break;
        }   
    };
}

window.addEventListener("load", main);
window.addEventListener("keydown", activeButton)