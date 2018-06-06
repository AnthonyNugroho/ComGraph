var canvas, engine, scene, camera, ship, ground;
document.addEventListener("DOMContentLoaded",function(){


	canvas = document.getElementById("renderCanvas");

	engine = new BABYLON.Engine(canvas, true);

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
	mat.specularTexture = new BABYLON.Texture("assets/grass.jpg",scene);
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
		d.diffuse = BABYLON.Color3.FromInts(204,196,255);

		ground = new BABYLON.Mesh.CreateGround("ground", 800, 2000, 2, scene);

		ship = new Ship(1, scene);

//var ball = new BABYLON.Mesh.CreateSphere("ball", 10, 1, scene);
//  ball.position = new BABYLON.Vector3(0,10,10);

//ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1, restitution:0.5, friction:0.2}, scene);





//ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor,{mass: 0, restitution: 0.2, friction: 0.2}, scene);
ground.material = mat;

scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
 scene.fogDensity = 0.01;


 var box = function() {
     var minZ = camera.position.z+500;
     var maxZ = camera.position.z+1500;
     var minX = camera.position.x - 100, maxX = camera.position.x+100;
     var minSize = 2, maxSize = 10;

     var randomX, randomZ, randomSize;

     randomX = randomNumber(minX, maxX);
     randomZ = randomNumber(minZ, maxZ);
     randomSize = randomNumber(minSize, maxSize);

     var b = BABYLON.Mesh.CreateBox("bb", randomSize, scene);

     b.scaling.x = randomNumber(0.5, 1.5);
     b.scaling.y = randomNumber(4, 8);
     b.scaling.z = randomNumber(2, 3);

     b.position.x = randomX;
     b.position.y = b.scaling.y/2 ;
     b.position.z = randomZ;

     // action manager
     b.actionManager = new BABYLON.ActionManager(scene);

     // on collision with ship
     var trigger = {trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: ship};
     var exec = new BABYLON.SwitchBooleanAction(trigger, ship, "killed");
     b.actionManager.registerAction(exec);

     // on pick
     // condition : ammo > 0
     var condition = new BABYLON.ValueCondition(b.actionManager, ship, "ammo", 0, BABYLON.ValueCondition.IsGreater);

     var onpickAction = new BABYLON.ExecuteCodeAction(
         BABYLON.ActionManager.OnPickTrigger,
         function(evt) {
             if (evt.meshUnderPointer) {
                 var meshClicked = evt.meshUnderPointer;
                 meshClicked.dispose();
                 ship.ammo -= 1;
                 ship.sendEvent();
             }
         },
         condition);

     b.actionManager.registerAction(onpickAction);
 };

 var ammoB = function() {
   var ammoB = BABYLON.Mesh.CreateSphere("sphere", 20, 5, scene);
   ammoB.material = new BABYLON.StandardMaterial("bonusMat", scene);
   ammoB.material.diffuseColor = BABYLON.Color3.Green();

   var minZ = camera.position.z+500;
   var maxZ = camera.position.z+1500;
   var minX = camera.position.x - 100, maxX = camera.position.x+100;

   ammoB.position.x = randomNumber(minX, maxX);
   ammoB.position.y = 2.5;
   ammoB.position.z = randomNumber(minZ, maxZ);

   ammoB.actionManager = new BABYLON.ActionManager(scene);

   var addAmmo = new BABYLON.IncrementValueAction(BABYLON.ActionManager.NothingTrigger, ship, "ammo", 1);
   var pickup = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.NothingTrigger, function(evt){
     ship.sendEvent();

   });

   var trigger = {trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: ship};
   var combine = new BABYLON.CombineAction(trigger, [addAmmo, pickup]);
   ammoB.actionManager.registerAction(combine);

 };

 var bullet = function(size, scene){
	BABYLON.Mesh.call(this, "bullet", scene);
 	var bul = BABYLON.Mesh.CreateSphere(size);
	bul.applyToMesh(this, false);
 	bul.material = new BABYLON.StandardMaterial("bonusMat", scene);
 	bul.material.diffuseColor = BABYLON.Color3.Black();

	this.position.x = ship.position.x;
	this.position.y = ship.position.y+1;
	this.position.z = ship.position.z+1;



 }




 /**
  * Random number
  * @param min
  * @param max
  * @returns {number}
  */
 var randomNumber = function (min, max) {
     if (min == max) {
         return (min);
     }
     var random = Math.random();
     return ((random * (max - min)) + min);
 }

 setInterval(box, 100);
 setInterval(ammoB, 1000);


 engine.runRenderLoop(function () {
 			if (! ship.killed) {
 					ship.move();

 					camera.position.z += ship.speed;
 					ship.position.z += ship.speed;
 					ground.position.z += ship.speed;
 			}
 			scene.render();
})
});
