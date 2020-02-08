/**
*@file MP 1: Dancing Logo
* @author Eric Shaffer <shaffer1@eillinois.edu>
* @author Xinhang Chen <xinhang2@illinois.edu>
Use HelloAnimation.js as setup code.
*/
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

//a global variable which controls animation played
var type = 1;

// Create a place to store vertex colors
var vertexColorBuffer;

var mvMatrix = mat4.create();
var rotAngle = 0;
var lastTime = 0;
var frameNumber = 0;

/**
 * Sends projection/modelview matrices to shader
 */
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


/**
 * Translates degrees to radians
 * @param {Number} degrees Degree input to function
 * @return {Number} The radians that correspond to the degree input
 */
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}


/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
}
function deformSin(x,y,angle){
  var pointOffset = glMatrix.vec2.fromValues(x,y);
  var displacement = 0.3* Math.sin(angle+degToRad(defAngle));
  glMatrix.vec2.normalize(pointOffset,pointOffset);
  glMatrix.vec2.scale(pointOffset,pointOffset,displacement);
  return pointOffset;
}
/**
 * Populate buffers with data
 */
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var a1 = [-0.5,0.5,0.0]
  var a2 = [0.5,0.5,0.0]
  var a3 = [-0.5,0.25,0.0]
  var a4 = [-0.25,0.25,0.0]
  var a5 = [0.25,0.25,0.0]
  var a6 = [0.5,0.25,0.0]
  var a7 = [-0.25,-0.25,0.0]
  var a8 = [0.25,-0.25,0.0]
  var a9 = [-0.5,-0.5,0.0]
  var a10 = [0.5,-0.5,0.0]
  var a11 = [-0.5,-0.25,0.0]
  var a12 = [0.5,-0.25,0.0]
  var b1 = [-0.525,0.525,0.0]
  var b2 = [0.525,0.525,0.0]
  var b3 = [-0.525,0.225,0.0]
  var b6 = [0.525,0.225,0.0]
  var b4 = [-0.275,0.225,0.0]
  var b5 = [0.275,0.225,0.0]
  var b7 = [-0.275,-0.225,0.0]
  var b8 = [0.275,-0.225,0.0]
  var b9 = [-0.525,-0.525,0.0]
  var b10 = [0.525,-0.525,0.0]
  var b11 = [-0.525,-0.225,0.0]
  var b12 = [0.525,-0.225,0.0]
  var triangleVertices = a1.concat(a3,a4 ,a1,a2,a4 ,a2,a4,a5, a2,a5,a6, a4,a5,a7, a5,a7,a8, a11,a7,a9, a7,a8,a10, a7,a9,a10, a8,a12,a10, b1,a1,a2, b1,b2,a2, b1,a1,a3, b3,a3,b1, a3,a4,b3, b3,b4,a4, a2,b2,a6, b6,a6,b2, a5,a6,b6, a5,b5,b6, a4,b4,a7, b4,b7,a7, b11,b7,a7, 
   b11,a11,a7, b11,a11,a9, b11,b9,a9, b9,a9,a10, b9,b10,a10, a12,a10,b10, a12,b12,b10, a12,b12,b8,  b8,a8,a12, a8,b8,a5, a5,b5,b8)
  for (i = 0; i <= triangleVertices.length;i+=3){
     triangleVertices[i]+=frameNumber*0.002;
    //  triangleVertices[i+1]+=frameNumber*0.05;
     console.log(triangleVertices[0],'success')
  }
  console.log(frameNumber);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 102;

  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    var i = 0;
    var color = [1.0, 69.0/255, 0.0, 1.0]
    var colors = []
    for (;i < 30;i++){
        colors = colors.concat(color);
    }
    i = 0;
    color = [70.0/255,130.0/255,180.0/255,1.0]
    for(;i<72;i++){
        colors = colors.concat(color);
    }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 102;
}

/**
 * Draw call that applies matrix transformations to model and draws model in frame
 */
function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  mat4.identity(mvMatrix);
   mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle));
  var rotateM = mat4.create();
  var scaleM = mat4.create();
  var scale = Math.abs(Math.cos(degToRad(rotAngle)));
  mat4.fromScaling(scaleM,[0.5+0.5*scale,1.0,1.0]);
  mat4.fromRotation(rotateM,degToRad(rotAngle),[0.0,0.0,1.0]);
  mat4.multiply(mvMatrix,mvMatrix,rotateM);
  mat4.multiply(mvMatrix,scaleM,mvMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}
function draw2(){
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  mat4.identity(mvMatrix);
   mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle));
  // var rotateM = mat4.create();
  // var scaleM = mat4.create();
  // var scale = Math.abs(Math.cos(degToRad(rotAngle)));
  // mat4.fromScaling(scaleM,[0.5+0.5*scale,1.0,1.0]);
  // mat4.fromRotation(rotateM,degToRad(rotAngle),[0.0,0.0,1.0]);
  // mat4.multiply(mvMatrix,mvMatrix,rotateM);
  // mat4.multiply(mvMatrix,scaleM,mvMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

/**
 * Animation to be called from tick. Updates globals and performs animation for each tick.
 */
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;    
        rotAngle= (rotAngle+1.0) % 360;
     }
    lastTime = timeNow;
}

/** 
 * My animation which changes colors for each point by time
*/
function animate2(){
  var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;  
        rotAngle= (rotAngle+1.0) % 360;
        vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var a1 = [-0.5,0.5,0.0]
  var a2 = [0.5,0.5,0.0]
  var a3 = [-0.5,0.25,0.0]
  var a4 = [-0.25,0.25,0.0]
  var a5 = [0.25,0.25,0.0]
  var a6 = [0.5,0.25,0.0]
  var a7 = [-0.25,-0.25,0.0]
  var a8 = [0.25,-0.25,0.0]
  var a9 = [-0.5,-0.5,0.0]
  var a10 = [0.5,-0.5,0.0]
  var a11 = [-0.5,-0.25,0.0]
  var a12 = [0.5,-0.25,0.0]
  var b1 = [-0.525,0.525,0.0]
  var b2 = [0.525,0.525,0.0]
  var b3 = [-0.525,0.225,0.0]
  var b6 = [0.525,0.225,0.0]
  var b4 = [-0.275,0.225,0.0]
  var b5 = [0.275,0.225,0.0]
  var b7 = [-0.275,-0.225,0.0]
  var b8 = [0.275,-0.225,0.0]
  var b9 = [-0.525,-0.525,0.0]
  var b10 = [0.525,-0.525,0.0]
  var b11 = [-0.525,-0.225,0.0]
  var b12 = [0.525,-0.225,0.0]
  var triangleVertices = a1.concat(a3,a4 ,a1,a2,a4 ,a2,a4,a5, a2,a5,a6, a4,a5,a7, a5,a7,a8, a11,a7,a9, a7,a8,a10, a7,a9,a10, a8,a12,a10, b1,a1,a2, b1,b2,a2, b1,a1,a3, b3,a3,b1, a3,a4,b3, b3,b4,a4, a2,b2,a6, b6,a6,b2, a5,a6,b6, a5,b5,b6, a4,b4,a7, b4,b7,a7, b11,b7,a7, 
   b11,a11,a7, b11,a11,a9, b11,b9,a9, b9,a9,a10, b9,b10,a10, a12,a10,b10, a12,b12,b10, a12,b12,b8,  b8,a8,a12, a8,b8,a5, a5,b5,b8)
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 102;
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    var i = 0;
    var color = [1.0, 69.0/255+(Math.sin(degToRad(rotAngle))), 0.0, 1.0]
    var colors = []
    for (;i < 30;i++){
        color[1]+=0.03
        colors = colors.concat(color);
    }
    i = 0;
    color = [70.0/255,130.0/255,180.0/255,1.0];
    for(;i<72;i++){
        colors = colors.concat(color);
    }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 30;  
    }
    lastTime = timeNow;
}

/**
 * Startup function called from html code to start program.
 */
 function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

/**
 * Tick called for every animation frame.
 */
function tick() {
    if(type == 1){
      requestAnimFrame(tick);
      setupBuffers();
    draw();
    animate();
    frameNumber++;
    }else{
      requestAnimFrame(tick);
      draw2();
      animate2();
    }
}

/**
 * change to my animation
*/
function Myanimation(){
  type = 0;
  frameNumber = 0;
}

/**
 * change to Logo animation
 */
function Logoanimation(){
  type = 1;
  frameNumber = 0;
}
