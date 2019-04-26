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
    model,
    viewUniform,
    view,
    eye,
    colorUniform,
    allColor = [],
    color = [],
    blockColor, 
    
    active = false;
    
    xUp = 0,
    yUp = 1,
    zEye = 50,
    activeLoop = true,
    qntdBlock = 100,
    p = [],
    faces = [],
    valor = [];
  
// Define as cores de cada bloco e armazena na matriz
function cores()
{    
    let coresLoop = 0;
    
    while (coresLoop < 3)
    {
        color[coresLoop] = Math.round(Math.random());

        coresLoop++;
        
        if (color[0] === 1 && color[1] === 1 && color[2] === 1 || color[0] === 0 && color[1] === 0 && color[2] === 0)
        {
            coresLoop = 0;
        }
    }

    blockColor = [color[0], color[1], color[2]];
    
    coresLoop = 0;
}

// Define a localiza��o de cada ponto e armazena em uma matriz
function valorPonto()
{       
    let pontoLoop = 0;
    
    valor[0] = [
        xA = -50, yA = 30, zA = 1,
        xB = -45, yB = 30, zB = 1,
        xC = -50, yC = 28, zC = 1,
        xD = -45, yD = 28, zD = 1,
        xE = -50, yE = 30, zE = -1,
        xF = -45, yF = 30, zF = -1,
        xG = -50, yG = 28, zG = -1,
        xH = -45, yH = 28, zH = -1
    ];
    
    while (pontoLoop < qntdBlock)
    {
        // Enquanto n�o chegar no final da linha, X � aumentado
        if (pontoLoop % 20 !== 0 && pontoLoop !== 0)
        {
            xA += 5;
            xB += 5;
            xC += 5;
            xD += 5;
            xE += 5;
            xF += 5;
            xG += 5;
            xH += 5;
        }
        // Aumenta o Y quando chega na quantidade definida do X
        else
        {
            xA = -50;
            xB = -45;      
            xC = -50;
            xD = -45;
            xE = -50;
            xF = -45;
            xG = -50;
            xH = -45;
            
            yA -= 2;
            yB -= 2;      
            yC -= 2;
            yD -= 2;
            yE -= 2;
            yF -= 2;
            yG -= 2;
            yH -= 2;
        }

        // Adiciona os valores na matriz
        valor[pontoLoop] = {
            xA: xA, yA: yA, zA: zA, 
            xB: xB, yB: yB, zB: zB, 
            xC: xC, yC: yC, zC: zC, 
            xD: xD, yD: yD, zD: zD, 
            xE: xE, yE: yE, zE: zE, 
            xF: xF, yF: yF, zF: zF, 
            xG: xG, yG: yG, zG: zG, 
            xH: xH, yH: yH, zH: zH
        };        
        
        pontoLoop++;
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
    let dataLoop = 0;
    
    while (dataLoop < qntdBlock)
    {    
        // Cria uma matriz de pontos com todos os pontos necess�rios para o bloco
        p[dataLoop] = {
            a: [valor[dataLoop].xA, valor[dataLoop].yA, valor[dataLoop].zA], 
            b: [valor[dataLoop].xB, valor[dataLoop].yB, valor[dataLoop].zB],
            c: [valor[dataLoop].xC, valor[dataLoop].yC, valor[dataLoop].zC],
            d: [valor[dataLoop].xD, valor[dataLoop].yD, valor[dataLoop].zD],
            e: [valor[dataLoop].xE, valor[dataLoop].yE, valor[dataLoop].zE], 
            f: [valor[dataLoop].xF, valor[dataLoop].yF, valor[dataLoop].zF],
            g: [valor[dataLoop].xG, valor[dataLoop].yG, valor[dataLoop].zG], 
            h: [valor[dataLoop].xH, valor[dataLoop].yH, valor[dataLoop].zH]     
        };      

        if (activeLoop === true)
        {
            // A cada loop, adiciona no final da matriz todos os novos pontos
            faces.push (
                //Front            
                ...p[dataLoop].a, ...p[dataLoop].b, ...p[dataLoop].c,
                ...p[dataLoop].d, ...p[dataLoop].c, ...p[dataLoop].b,
                //Back
                ...p[dataLoop].e, ...p[dataLoop].f, ...p[dataLoop].g,
                ...p[dataLoop].h, ...p[dataLoop].g, ...p[dataLoop].f,
                //Top
                ...p[dataLoop].e, ...p[dataLoop].f, ...p[dataLoop].a,
                ...p[dataLoop].b, ...p[dataLoop].a, ...p[dataLoop].f,
                //Down
                ...p[dataLoop].g, ...p[dataLoop].h, ...p[dataLoop].c,
                ...p[dataLoop].d, ...p[dataLoop].c, ...p[dataLoop].h,
                //Left
                ...p[dataLoop].a, ...p[dataLoop].e, ...p[dataLoop].c,
                ...p[dataLoop].g, ...p[dataLoop].c, ...p[dataLoop].e,
                //Right
                ...p[dataLoop].b, ...p[dataLoop].f, ...p[dataLoop].d,
                ...p[dataLoop].h, ...p[dataLoop].d, ...p[dataLoop].f
            );    

            cores();   

            // Adiciona na matriz as cores de cada bloco
            allColor.push (                
                blockColor, //Front
            );
        }
        dataLoop++;
    }
    
    if (dataLoop === qntdBlock)
    {
        activeLoop = false;
    }
    
    return {"points": new Float32Array(faces)};
}

async function main() 
{
    // 0.1 - Adiciona todos os pontos dos blocos
    valorPonto();
    
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
    model = mat4.create();
    modelUniform = gl.getUniformLocation(shaderProgram, "model");
    gl.uniformMatrix4fv(modelUniform, false, model);
    
    // 7.4 - COLOR UNIFORM
    colorUniform = gl.getUniformLocation(shaderProgram, "color");

    // 8 - Chamar o loop de redesenho
    render();
}

function render() 
{
    let renderLoop = 0;
    
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
 
    while (renderLoop < qntdBlock)
    {
        // Front
        gl.uniform3f(colorUniform, allColor[renderLoop][0], allColor[renderLoop][1], allColor[renderLoop][2]);
        gl.drawArrays(gl.TRIANGLES, (renderLoop * 30 + renderLoop * 6) + 0, 6);
        // Back
        gl.uniform3f(colorUniform, allColor[renderLoop][0], allColor[renderLoop][1], allColor[renderLoop][2]);
        gl.drawArrays(gl.TRIANGLES, (renderLoop * 30 + renderLoop * 6) + 6, 6);
        // Top
        gl.uniform3f(colorUniform, allColor[renderLoop][0], allColor[renderLoop][1], allColor[renderLoop][2]);
        gl.drawArrays(gl.TRIANGLES, (renderLoop * 30 + renderLoop * 6) + 12, 6);
        // Down
        gl.uniform3f(colorUniform, allColor[renderLoop][0], allColor[renderLoop][1], allColor[renderLoop][2]);
        gl.drawArrays(gl.TRIANGLES, (renderLoop * 30 + renderLoop * 6) + 18, 6);
        // Left
        gl.uniform3f(colorUniform, allColor[renderLoop][0], allColor[renderLoop][1], allColor[renderLoop][2]);
        gl.drawArrays(gl.TRIANGLES, (renderLoop * 30 + renderLoop * 6) + 24, 6);
        // Right
        gl.uniform3f(colorUniform, allColor[renderLoop][0], allColor[renderLoop][1], allColor[renderLoop][2]);
        gl.drawArrays(gl.TRIANGLES, (renderLoop * 30 + renderLoop * 6) + 30, 6);
        
        renderLoop++;
    }
        
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