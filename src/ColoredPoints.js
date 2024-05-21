// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program


//Render List
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_globalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_globalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '  v_UV = a_UV;\n'  +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'uniform sampler2D u_Sampler0;\n' +
  'uniform int u_whichTexture;\n' +
  'void main() {\n' +
  '  gl_FragColor =  texture2D(u_Sampler0, v_UV); //vec4(v_UV.x, v_UV.y, 1.0, 1.0)\n' +
  '  if (u_whichTexture == -2) {\n'+
  '    gl_FragColor = u_FragColor;\n'+
  '  } else if (u_whichTexture == -1) {\n' +
  '    gl_FragColor = vec4(v_UV,1.0,1.0);\n'+
 '   } else if (u_whichTexture == 0) {\n'+
 '     gl_FragColor = texture2D(u_Sampler0, v_UV);\n'+
 '   } else {\n'+
  '    gl_FragColor = vec4(1,.2,.2,1);\n'+
  '  };\n'+
  '}'
//VARIABLE

var game = false;
var game_start = 0
var gl;
var canvas;
var a_Position;
let a_UV;
var u_FragColor;
var u_Size;
var u_ProjectionMatrix;
var u_ViewMatrix;
//gl.uniformMatrix4(matrix, false, iden.elements) //new matrix4 
let color_storage = [1.0, 1.0, 1.0, 1.0];
var radiansX = 0;
var radiansY = 0;
var radiansZ = 0;
var u_Sampler0;
var xVec = 0;
var YVec = 0;
var ZVec = 0
let pink_rot = 0;
let yellow_rot = 0;
var animation_on = false;
let leg;
let leg2;
let limb;
let limb2
let u_whichTexture;
let blocks_found = 0;
let pov;

var walls = [];
var wall_mat;
var rand;
var coin_flip;

var g_eye = [0, 0, 3]
var g_at = [0, 0, -100]
var g_up = [0, 1, 0]

let pyramid;

var game_start_time;
var g_startTime;
var g_seconds;


g_startTime = performance.now() / 1000;
g_seconds = (performance.now() / 1000) - (g_startTime)


let globalRotateMatrix = new Matrix4(); //You HAVE to declare this variable in the render function or else your rotation will be crazy inconsistent.
let cube_Method;
let leftArm;
let box;
var torso;

let pyr;
var render_list = []; //for animation function //use global lists to manage special animations, time, angle can be function parameters

var canvas;
var u_ModelMatrix;
var u_globalRotateMatrix;

var game_start_time;
let cube = new Cube(color=[1,0,0,1])
let cube2 = new Cube(color=[1,0,0,1])
let cube3 = new Cube(color=[0,0,1,1]) //sky
let frag_cube = new Cube(color=[0,0,1,1],tex=-1) //blue cube


var projMat = new Matrix4()
var viewMat = new Matrix4()

var game_red_i = []
var game_found_i = []
g_map = [
 [ 1, 0, 0, 0, 1, 0, 0, 1,0, 0, 0, 1, 0, 1, 0, 1,0, 0, 0, 0, 1, 1, 0, 0,0, 0, 0, 0, 1, 0, 0, 1], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0], 
 [ 1, 0, 1, 0, 0, 0, 0, 1,0, 0, 1, 0, 0, 1, 0, 1,1, 0, 1, 1, 0, 1, 0, 1,1, 1, 0, 1, 1, 0, 1, 1]
];

class Camera {
  constructor(fov=60.0,eye = [0,0,0], at = [0, 0, -1], up=[0,1,0]) {
    this.fov = fov
    this.eye = new Vector3(eye)
    this.at = new Vector3(at)
    this.up = new Vector3(up)
    this.forward = new Vector3(this.at.elements)
    this.forward.sub(this.eye);
    this.backward = new Vector3(this.eye.elements);
    this.backward.sub(this.at)
    this.temp_at = new Vector3()
    this.temp_at.set(this.at)
    this.side = new Vector3()
    //matrices
    this.rot_mat = new Matrix4()
    //this.rot_mat.setIdentity()
    this.x = 0;
    this.y = 0;
    this.rot = 0
    this.stat = new Vector3(0, 0, 0)
    this.cam_view = new Matrix4()
    //this.cam_view.setIdentity()
    this.cam_view.setLookAt(
      eye[0], at[0],up[0],
      
      eye[1], at[1],up[1],
      
      eye[2], at[2],up[2]
    )
    
    this.cam_proj = new Matrix4()
    //this.cam_proj.setIdentity() //possibly get rid of this depending on how set look at works
    this.cam_proj.setPerspective(fov, canvas.width/canvas.height, .1, 1000)
// projectionMatrix (Matrix4), initialize it with projectionMatrix.setPerspective(fov, canvas.width/canvas.height, 0.1, 1000).
// viewMatrix (Matrix4), initialize it with viewMatrix.setLookAt(eye.elements[0], ... at.elements[0], ..., up.elements[0], ...). 
// projectionMatrix (Matrix4), initialize it with projectionMatrix.setPerspective(fov, canvas.width/canvas.height, 0.1, 1000).
  }

  get_forward_vector() {
    this.forward.set(this.at)
    this.forward.sub(this.eye)
  }
  move_forward() {
    this.temp_at.set(this.at)
    this.temp_at.sub(this.eye)
    this.temp_at.normalize()
    this.temp_at.mul(1)
    //console.log("temp_at", this.temp_at)
    this.eye.add(this.temp_at)
    this.at.add(this.temp_at)
    this.y += 1
  } 
  move_backward() {
    this.temp_at.set(this.eye) //this will be eye - at instead of at - eye
    this.temp_at.sub(this.at)
    this.temp_at.normalize()
    this.temp_at.mul(1)
    this.eye.add(this.temp_at)
    this.at.add(this.temp_at)
    this.y -= 1;
  }
  left() {
    this.get_forward_vector()
    this.side = Vector3.cross(this.up, this.forward)
    this.side.normalize()
    this.side.mul(1)
    this.x -= 1;
    //console.log("side", side)
    this.eye.add(this.side)
    this.at.add(this.side)
  }  

  right() {
    this.get_forward_vector()
    this.side = Vector3.cross(this.forward, this.up)
    this.side.normalize()
    this.side.mul(1)
    this.eye.add(this.side)
    this.at.add(this.side)
  }

  panleft(alpha) {
//     In your camera class, create a function called "panLeft":
// Compute the forward vector  f = at - eye;
  //debugger;
  this.get_forward_vector()
// Rotate the vector f by alpha (decide a value) degrees around the up vector.
  //this.forward.add(tcohis.up);
// Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z). (Check)
// Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);
  //rot_mat_left.setIdentity();
  this.rot_mat.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2])
  var f_prime = this.rot_mat.multiplyVector3(this.forward)
  //debugger;
  this.rot -= alpha;
// Update the "at"vector to be at = eye + f_prime;
    f_prime.add(this.eye)
    this.at.set(f_prime)
  }
  panright(alpha) {
    
//     In your camera class, create a function called "panLeft":
// Compute the forward vector  f = at - eye;
  //debugger;
  this.get_forward_vector()
  this.rot += alpha;
  // Rotate the vector f by alpha (decide a value) degrees around the up vector.
    //this.forward.add(this.up);
  // Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z). (Check)
  // Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);
    //rot_mat_left.setIdentity();
    this.rot_mat.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2])
    var f_prime = this.rot_mat.multiplyVector3(this.forward)
    //debugger;
  // Update the "at"vector to be at = eye + f_prime;
      f_prime.add(this.eye)
      this.at.set(f_prime)
  }
  pan_gen(x_alpha, y_alpha, x, y) {
    
    //     In your camera class, create a function called "panLeft":
    // Compute the forward vector  f = at - eye;
      //debugger;
      this.get_forward_vector()
      // Rotate the vector f by alpha (decide a value) degrees around the up vector.
        //this.forward.add(this.up);
      // Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z). (Check)
      // Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);
        //rot_mat_left.setIdentity();
        this.rot_mat.setRotate(10,  y, x, this.up.elements[2])
        var f_prime = this.rot_mat.multiplyVector3(this.forward)
        //debugger;
      // Update the "at"vector to be at = eye + f_prime;
          f_prime.add(this.eye)
          this.at.set(f_prime)
      }
}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  gl.enable(gl.DEPTH_TEST);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}
var count=1;

// var g_eye = [0, 0, 3]
// var g_at = [0, 0, -100]
// var g_up = [0, 1, 0]
function keydown(ev) {
  if (ev.keyCode==8) {
    walls.pop()
  }  
  if (ev.keyCode==32) {
    var newCube = new Cube([1,1,1,1])
    newCube.matrix.translate(g_eye[0], g_eye[1], g_eye[2])
    //console.log(newCube.matrix)
    //console.log(pov)
    //newCube.matrix.translate(g_at[0], g_at[1], 0)
    //newCube.matrix.translate(g_up[0], g_up[1], 0)
    walls.push(newCube)
    count+=1
  }
  if (ev.keyCode==68) { //right
    pov.right()
    g_eye = pov.eye.elements;
    g_at = pov.at.elements;
    console.log("POV: ", pov)
  }
  if (ev.keyCode==87) { //forward
    pov.move_forward();
    g_eye = pov.eye.elements;
    g_at = pov.at.elements;
    console.log("POV: ", pov)
  }
  if (ev.keyCode==65) { //left
    pov.left()
    g_eye = pov.eye.elements;
    g_at = pov.at.elements;
    console.log("POV: ", pov)
  }
  if (ev.keyCode==83) { //back
    pov.move_backward()
    g_eye = pov.eye.elements;
    g_at = pov.at.elements;
    console.log("POV: ", pov)
  }
  if (ev.keyCode==81) {
    pov.panleft(1)
    g_at = pov.at.elements;
    g_eye = pov.eye.elements;
    g_up = pov.up.elements;
    console.log("POV: ", pov)
    //debugger;
  }
  if (ev.keyCode==69) {
    pov.panright(1)
    g_at = pov.at.elements;
    g_eye = pov.eye.elements;
    g_up = pov.up.elements;
    console.log("POV: ", pov)
  }
  //renderScene()
}

function connectVariablesToGLSL() {

  
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed get the storage location of a_Position');
    return;
  }
  a_UV = gl.getAttribLocation(gl.program, 'a_UV'); 
  if (a_UV < 0) {    
    console.log('Failed get the storage location of a_UV');
  }
  
  //Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor', u_FragColor);
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = 3;
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get model matrix')
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get u_Sampler0')
  }

  u_globalRotateMatrix = gl.getUniformLocation(gl.program, 'u_globalRotateMatrix');
  if (!u_globalRotateMatrix) {
    console.log('Failed to get global rotate matrix')
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get which texture')
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
  if(!u_whichTexture) {
    console.log('Failed to get u_ViewMatrix')
  }

  
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix')
  if(!u_ProjectionMatrix) {
    console.log('Failed to get u_ProjectionMatrix')
  }
  gl.enable(gl.DEPTH_TEST);

  return;

}

function addActionsforHTMLUI() {
  document.getElementById("rot_camX").value = 0;
  document.onkeydown = keydown
  document.getElementById("rot_camX").addEventListener("mousemove", function (event) {
    if (event.buttons == 1) {
      radiansX = this.value;
    }
  })

  document.getElementById("rot_camY").value = 0;
  document.getElementById("rot_camY").addEventListener("mousemove", function (event) {
    if (event.buttons == 1) {
      radiansY = this.value;
    }  
  })

  document.getElementById("rot_camZ").value = 0;
  document.getElementById("rot_camZ").addEventListener("mousemove", function (event) {
    if (event.buttons == 1) {
      radiansZ = this.value;
    }
  })


  document.getElementById("on").addEventListener("click", function (event) { 
    game = true;
    game_start = performance.now()
    game_red_i = []
    game_found_i = [false, false, false, false, false]
    console.log(walls)
    for (var r = 0; r < 5; r++) {
      var rand_ind = Math.floor(Math.random() * (walls.length - 1))
      console.log(walls[rand_ind])      
      while (walls[rand_ind].game_red) { // While 
        rand_ind = Math.random() * (walls.length - 1) 
      }
      game_red_i[r] = rand_ind
      walls[rand_ind].game_red = true;   
      walls[rand_ind].color = [1, 0, 0, 1];
      
    }
    console.log(game_red_i)
    blocks_found = 0; 
  })
}
function initTextures(image_src, texUnit) {
  var image = new Image()
  if (!image) {
    console.log('Failed to create the image object');
    return false;    
  } 
  image.onload = function() {
    

    sendTextureToGLSL(image, texUnit)}
    image.src = image_src;


  
  return true;  
}

function  sendTextureToGLSL(image, texUnit) {
  
  var texture = gl.createTexture(); 
  if(!texture) {
    console.log('Failed to create texture object'); 
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 

  switch (texUnit){
    case 0:
      gl.activeTexture(gl.TEXTURE0);
      break;
    
    case 1:
      gl.activeTexture(gl.TEXTURE1);
      break;

    case 2:
      gl.activeTexture(gl.TEXTURE2);
      break;
      
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); 
}
var coin_flip2;
function f_g_map() {
  rand = 5
  for (var a = 0; a < g_map.length; a++) {
    for (var b = 0; b < g_map.length; b++) {
        coin_flip = Math.floor(Math.random() * 2);
        if (g_map[a][b] == 1) {
          //make another for loop to add walls
          for (var x = 0; x < 2; x++) {
            var body = new Cube()
            body.color = [1,1,1,1]
            body.matrix.translate(a-4,x,b-8)
            body.x = a-4;
            body.y = x;
            body.z = b - 8;
            walls.push(body)
          }
        }
    }
  }
}
//array of red_true indices would help
//for each item in red_true indices check if there's collision
//I have that

var x;
var y;
var z;
function check_collision() {
  //debugger;
  var c; //how many true
  result = false;
  var ret_list = []
  for (var g = 0; g < game_red_i.length; g++) {
    c = 0;
    var index = game_red_i[g];
    console.log(x)
    y = walls[index].y
    x = walls[index].x
    // console.log("eye: ", pov.eye.elements)
    // console.log("at: ", pov.at.elements);
    // console.log("up: ", pov.up.elements)
    var neg = pov.eye.elements[2] * -1
    //console.log("x y ", x, y);
    //console.log("Diff: ",    Math.abs(pov.eye.elements[0] - x),   Math.abs(neg - y))
    if (Math.abs(pov.eye.elements[0] - x) <= 10) {
      c++;
    }
    if (Math.abs(neg - y) <= 10) {
      c++
    }
    //console.log("c: ", c)
    if (c == 2 && !game_found_i[g]) {
      console.log("You found a block! You have found ", blocks_found + 1, "so far.")
      game_found_i[g] = true
      console.log(game_found_i)
      blocks_found++;
      walls[index].game_red = false;
      walls[index].color = [1,1,1,1];
      ret_list.push([index, g])
    }
  }
  return ret_list;

}
function renderScene() {
  //global matrix set up
  //clear canvas 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  viewMat.setLookAt(
    g_eye[0],g_eye[1],g_eye[2], 
    g_at[0], g_at[1], g_at[2], 
    g_up[0],  g_up[1],  g_up[2]
  ) //the rows of the above matrix represent: eye, at, and up, respectively
  gl.uniformMatrix4fv(u_ViewMatrix, false,viewMat.elements);
  globalRotateMatrix.setIdentity()
  globalRotateMatrix.rotate(radiansX, 1, 0, 0);
  globalRotateMatrix.rotate(radiansY, 0, 1, 0);
  globalRotateMatrix.rotate(radiansZ, 0, 0, 1);  
  gl.uniformMatrix4fv(u_globalRotateMatrix, false, globalRotateMatrix.elements);
  gl.uniform1i(u_whichTexture, 0);
  gl.uniform1i(u_Sampler0, 1);
  cube.render() 
  gl.uniform1i(u_whichTexture, -1);
  cube2.render()
  gl.uniform1i(u_whichTexture, 0);
  gl.uniform1i(u_Sampler0, 0);
  cube3.render();
  gl.uniform1i(u_whichTexture, -2);
  frag_cube.render()
  if (game) {
    //console.log("Collision Check")
    var ret = check_collision();  
    //console.log("Collision Check Complete")
  }
  for (var w = 0; w < walls.length; w++) {
    if (game && walls[w].game_red) {
      walls[w].color = [1,0,0,1]
    }
    walls[w].render()
  }
}

let frames_rendered = 0;

var game_time;
var game_win = false;
function tick() {
  g_seconds = (performance.now() / 1000) - (g_startTime)
  renderScene()
  requestAnimationFrame(tick);


  let duration = performance.now() - start_time;
  frames_rendered += 1;
  if (!game) {
    var text = "No Game\n"
  } else {
    game_time = 30 - Math.floor((performance.now() - game_start) / 1000);
    var text = "Time Left: " + game_time + "\n" + "Blocks to Find: " + blocks_found + "/" + 5 + "\n"
  }
  if (game_win) {
    text += "\nYou won the last time you played the game!"
  } else {
    text += "\nYou either haven't tried yet or lost the last time you played this game!"
  }
  sendTextToHTML(text + " fps: " + Math.floor(1000* frames_rendered/duration), "perf");
  if (blocks_found == 5) {
    game = false;
    game_win = true;
  }  else if (game_time == 0) {
    game = false
    game_win = false
  }

}

function updateAnimationAngles(secs, cube_obj, angle) {   
  if (animation_on) {
    cube_obj.matrix.rotate(45*Math.sin(secs), 0, 0, 1);
  } else {    
    cube_obj.matrix.rotate(angle, 0, 0, 1);
  }
}



f_g_map();
function main() {
  
  start_time = performance.now();
  // var performance;
  setupWebGL();
  // Initialize shaders
  connectVariablesToGLSL();
  addActionsforHTMLUI();
  
  initTextures("./src/sky.jpg", 0);
  initTextures("./src/mona.webp", 1);

  
  cube.matrix.translate(.7, .2, -.2)
  cube.matrix.scale(.25,.25,.25)
  cube2.matrix.translate(0, -.75, 0)
  cube2.matrix.scale(60,0, 60)

  cube3.matrix.scale(60, 50, 60)
  frag_cube.matrix.scale(.5, .5, .5)
  frag_cube.matrix.translate(3.9, .2, -3)

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  document.onkeydown = keydown;
  
  if (canvas.ev == 1) {
    var preserveDrawingBuffer = true
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    click()
  }
  
  pov = new Camera()
  canvas.onmousedown = click;
  canvas.on
  canvas.onmousemove = function(ev) { 
    if(ev.buttons==1) {
      click(ev)
    }
  canvas.onmousedown = function(ev) {click(ev)}
  }
  wall_mat = new Matrix4();
  
  renderScene();
  requestAnimationFrame(tick);  
  
}


function sendTextToHTML(text, htmlID){
  var htmllm = document.getElementById(htmlID);
  if (!htmllm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmllm.innerHTML = text;
}
function click(ev) {
  var rect = ev.target.getBoundingClientRect();  
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  x = ((x - rect.left) - 400 / 2)/200;
  y = (400 / 2 - (y - rect.top))/200;
  var radiansX =  y * 360;
  var radiansY =  x * 360;
  pov.pan_gen(x, y, radiansX, radiansY)
  g_at = pov.at.elements;
  g_eye = pov.eye.elements;
  g_up = pov.up.elements;
  renderScene()  

}

