Ship = function(size, scene) {
    BABYLON.Mesh.call(this, "ship", scene);
    var vd = BABYLON.VertexData.CreateBox(size);
    vd.applyToMesh(this, false);

    this.killed = false;
    this.ammo = 0;
    this.position.x = 0;
    this.position.z = 0;
    this.position.y = size/2;

    // Movement attributes
    this.speed = 3;
    this.moveLeft = false;
    this.moveRight = false;

    this._initMovement();

    this._initLabelUpdate();

};

Ship.prototype = Object.create(BABYLON.Mesh.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.sendEvent = function() {
    var e = new Event('ammoUpdated');
    window.dispatchEvent(e);
};

Ship.prototype._initLabelUpdate = function() {

    var updateAmmoLabel = function() {
        document.getElementById("ammoLabel").innerHTML = "Score : "+ship.ammo;
    };

    BABYLON.Tools.RegisterTopRootEvents([{
        name:"ammoUpdated",
        handler : updateAmmoLabel
    }]);
};

Ship.prototype._initMovement = function() {

    var onKeyDown = function(evt) {
        console.log(evt.keyCode);
        if (evt.keyCode == 37) {
            ship.moveLeft = true;
            ship.moveRight = false;
        } else if (evt.keyCode == 39) {
            ship.moveRight = true;
            ship.moveLeft = false;
        }
    };

    var onKeyUp = function(evt) {
        ship.moveRight = false;
        ship.moveLeft = false;
    };

    // Register events
    BABYLON.Tools.RegisterTopRootEvents([{
        name: "keydown",
        handler: onKeyDown
    }, {
        name: "keyup",
        handler: onKeyUp
    }]);
};

Ship.prototype.move = function() {
    if (ship.moveRight) {
        ship.position.x += 1;
        camera.position.x += 1;
    }
    if (ship.moveLeft) {
        ship.position.x += -1;
        camera.position.x += -1;
    }
};
