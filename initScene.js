var canvas, engine, scene, camera, ground;
document.addEventListener("DOMContentLoaded",function(){
//get renderCanvas
canvas = document.getElementById("renderCanvas");

//create babylon engine
engine = new BABYLON.Engine(canvas,true);

//create scene
scene = new BABYLON.Scene(engine);


gravity = new BABYLON.Vector3(0,-9.81,0);
physicsEngine = new BABYLON.CannonJSPlugin();

scene.enablePhysics(gravity, physicsEngine);

camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 5, -30), scene);
camera.maxZ = 1000;
camera.speed = 4;


var mat = new BABYLON.StandardMaterial("material",scene);

mat.specularColor = new BABYLON.Color3(0,1,0);
mat.diffuseTexture = new BABYLON.Texture("ground.png",scene);
//mat.specularTexture = new BABYLON.Texture("assets/grass.jpg",scene);
mat.specularPower = 25;
//mat.emissiveColor = new BABYLON.Color3(0.2,0.2,0.2);
mat.ambientColor = new BABYLON.Color3(0.23,0.90,0.53);
//transparency
mat.alpha = 1;

//create light
var light = new BABYLON.HemisphericLight("hlight", new BABYLON.Vector3(0,8,0),scene);
light.intensity = 0.6;

var d = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0,-0.5,0.5), scene);
    d.position = new BABYLON.Vector3(0.1,100,-100);
    d.intensity = 0.4;
    // Purple haze, all around !
    d.diffuse = BABYLON.Color3.FromInts(204,196,255);

var ball = new BABYLON.Mesh.CreateSphere("ball", 10, 1, scene);
  ball.position = new BABYLON.Vector3(0,10,10);

ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1, restitution:0.5, friction:0.2}, scene);



ground = new BABYLON.Mesh.CreateGround("ground", 800, 2000, 2, scene);

ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor,{mass: 0, restitution: 0.2, friction: 0.2}, scene);
ground.material = mat;


engine.runRenderLoop(function(){
  scene.render();
});
});
