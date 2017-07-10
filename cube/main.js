var vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    'varying vec3 fargColor;',
    '',
    'void main()',
    '{',
    '   fargColor = vertColor;',
    '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
].join('\n');

var fargmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fargColor;',
    'void main()',
    '{',
    '   gl_FragColor = vec4(fargColor, 1.0);',
    '}'
].join('\n');

var InitDemo = function() {
    var canvas = document.getElementById("gl-surface");
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('Webgl not supported without experimental_webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support webgl!');
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fargmentShaderText);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl,getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    //
    var boxVertices = [
        // X, Y, Z          R, G, B
        // Top
        -1.0, 1.0, -1.0,    0.125, 0.135, 0.845,
        -1.0, 1.0, 1.0,     0.125, 0.135, 0.845,
        1.0, 1.0, 1.0,      0.125, 0.135, 0.845,
        1.0, 1.0, -1.0,     0.125, 0.135, 0.845,

        // Left
        -1.0, 1.0, 1.0,     0.25, 0.56, 0.27,
        -1.0, -1.0, 1.0,    0.25, 0.56, 0.27,
        -1.0, -1.0, -1.0,   0.25, 0.56, 0.27,
        -1.0, 1.0, -1.0,    0.25, 0.56, 0.27,

        // Right
        1.0, 1.0, 1.0,      0.575, 0.375, 0.575,
        1.0, -1.0, 1.0,     0.575, 0.375, 0.575,
        1.0, -1.0, -1.0,    0.575, 0.375, 0.575,
        1.0, 1.0, -1.0,     0.575, 0.375, 0.575,

        // Front
        1.0, 1.0, 1.0,      0.5, 0.76, 0.5,
        1.0, -1.0, 1.0,     0.5, 0.76, 0.5,
        -1.0, -1.0, 1.0,    0.5, 0.76, 0.5,
        -1.0, 1.0, 1.0,     0.5, 0.76, 0.5,

        // Back
        1.0, 1.0, -1.0,     0.225, 0.625, 0.325,
        1.0, -1.0, -1.0,    0.225, 0.625, 0.325,
        -1.0, -1.0, -1.0,   0.225, 0.625, 0.325,
        -1.0, 1.0, -1.0,    0.225, 0.625, 0.325,

        // Bottom
        -1.0, -1.0, -1.0,     0.15, 0.35, 0.75,
        -1.0, -1.0, 1.0,     0.15, 0.35, 0.75,
        1.0, -1.0, 1.0,     0.15, 0.35, 0.75,
        1.0, -1.0, -1.0,     0.15, 0.35, 0.75,
    ];

    var boxIndices = [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14 ,12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];


    var boxVertexBufferObj = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObj);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObj = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObj);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elemnets
        gl.FALSE, // Weather or not normalize
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of single vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elemnets
        gl.FALSE, // Weather or not normalize
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of single vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Use program then set uniform
    gl.useProgram(program);

    var mWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var mViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var mProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -7], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(mViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(mProjUniformLocation, gl.FALSE, projMatrix);

    //
    // Render loop
    //
    var angle = 0;
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle / 3, [1, 0, 0]);
        mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};