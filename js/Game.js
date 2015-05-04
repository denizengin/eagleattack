DEV.Game = function () {
    "use strict";

    var game,
        intro,
        video;

    var init = function () {
        intro = new DEV.Intro();
        video = new DEV.Video();
        game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'eagleAttack', { preload: preload, create: create, update: update, render: render });
    };

    var preload = function () {
        game.load.spritesheet('buttonHelp', 'assets/images/help.png', 193, 71);
        game.load.spritesheet('buttonWatchVideo', 'assets/images/watchVideo.png', 193, 71);
        game.load.spritesheet('buttonRestart', 'assets/images/restart.png', 193, 71);
        game.load.image('background', 'assets/images/background.jpg');
        game.load.atlasJSONHash('drone', 'assets/images/drone.png', 'assets/images/drone.json');
        game.load.atlasJSONHash('eagle', 'assets/images/eagle.png', 'assets/images/eagle.json');
    };

    var sprite1;
    var sprite2;
    var system = Phaser.Physics.ARCADE;
    var cursors;

    var eagleDirection = "left";

    var create = function () {

        //game.stage.bounds.width
        this.bg= game.add.sprite(0, 0, 'background');
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;

        document.getElementById("gameoverVideo").setAttribute("width", window.innerWidth);
        document.getElementById("gameoverVideo").setAttribute("height", window.innerHeight);
        document.getElementById("eagleVideo").setAttribute("width", window.innerWidth);
        document.getElementById("eagleVideo").setAttribute("height", window.innerHeight);

        game.physics.startSystem(system);

        game.world.setBounds(0, 0, this.bg.width, this.bg.height);

        document.getElementById('eagleAttack').style.display = 'block';

        sprite1 = game.add.sprite(50, 200, 'drone');
        sprite1.animations.add('fly');
        sprite1.animations.play('fly', 120, true);

        game.physics.enable(sprite1, system);

        sprite1.body.immovable = true;
        sprite1.body.collideWorldBounds = true;
        sprite1.body.drag.set(100);
        sprite1.anchor.set(0.5);

        sprite1.scaleX = 10;

        sprite2 = game.add.sprite(game.width, 200, 'eagle');
        sprite2.animations.add('fly');
        sprite2.animations.play('fly', 10, true);

        game.physics.enable(sprite2, system);

        sprite1.name = 'drone';

        sprite2.name = 'eagle';

        cursors = game.input.keyboard.createCursorKeys();

        this.points = 0;
        this.eagleSpeed = 70;

        var self = this;
        this.pointsInterval = setInterval(function () { updatePoints.call(self);}, 1000);

        var text = "Points: 0";
        var style = { font: "35px Arial", fill: "#ff0044", align: "center" };
        this.gameText = game.add.text(0, 0, text, style);

        var textGame = "Eagle Attack v.0.1 by Deniz Engin Vehbi";
        var style = { font: "35px Arial", fill: "#ff0044", align: "center" };
        game.add.text(game.world.width / 4, 0, textGame, style);

        this.buttonHelp = game.add.button(game.world.width - 200, 0, 'buttonHelp', actionOnClick, self, 2, 1, 0);
        this.buttonReplay = game.add.button(game.world.centerX - 95, 400, 'buttonRestart', actionOnClick, self, 2, 1, 0);
        this.buttonWatchVideo= game.add.button(game.world.centerX - 290, 400, 'buttonWatchVideo', actionOnClick, self, 2, 1, 0);
        this.buttonReplay.visible = false;
        this.buttonWatchVideo.visible = false;

        video.init();
        showIntro(true);
    };

    var showIntro = function () {
        var gameArea = document.getElementById('eagleAttack');
        game.paused = true;
        gameArea.style.display = "none";

        intro.toggle(handleIntroHide);
    };

    var handleIntroHide = function () {
        var gameArea = document.getElementById('eagleAttack');
        game.paused = false;
        gameArea.style.display = "block";
    };

    //refactor: also updates eagle speed
    var updatePoints = function () {
        if (this.game.paused) {
            return;
        }
        this.points++;
        this.gameText.text = "Points: " + this.points;
        this.eagleSpeed+=10;
    };

    var update = function () {
        game.physics.arcade.collide(sprite1, sprite2, collisionHandler, null, this);

        //change eagle anim based on direction

        if (cursors.up.isDown)
        {
            game.physics.arcade.accelerationFromRotation(sprite1.rotation, 300, sprite1.body.acceleration);
        }
        else if (cursors.down.isDown)
        {
            game.physics.arcade.accelerationFromRotation(sprite1.rotation, -300, sprite1.body.acceleration);
        }
        else
        {
            sprite1.body.acceleration.set(0);
        }

        if (cursors.left.isDown)
        {
            sprite1.body.angularVelocity = -300;
        }
        else if (cursors.right.isDown)
        {
            sprite1.body.angularVelocity = 300;
        }
        else
        {
            sprite1.body.angularVelocity = 0;
        }


        //console.log(sprite2.body.velocity.x);
        if (sprite2.body.velocity.x > 0) {
            if (eagleDirection === "left") {
                flipEagle();
                eagleDirection = "right";
            }
        } else if (sprite2.body.velocity.x < 0) {
            if (eagleDirection === "right") {
                flipEagle();
                eagleDirection = "left";
            }
        }

        function flipEagle() {
            sprite2.anchor.setTo(.5, 1); //so it flips around its middle
            sprite2.scale.x = sprite2.scale.x * -1;
        }


        game.physics.arcade.moveToObject(sprite2, sprite1, this.eagleSpeed, undefined);
        screenWrap(sprite2);
    };

    var collisionHandled = false;
    var collisionHandler = function (obj1, obj2) {

        if (collisionHandled === true)
            return;
        collisionHandled = true;

        clearInterval(this.pointsInterval);

        sprite2.body.velocity.x = 0;
        sprite1.body.velocity.x = 0;

        sprite1.visible = false;
        sprite2.visible = false;
        document.getElementsByTagName("canvas")[0].style.display = 'none';

        if (!window.gameOver) {
            window.gameOver = true;
            var video = document.getElementById("gameoverVideo");
            video.style.display = "block";
            video.play();
            var self = this;
            video.onended = function(e) {
                document.getElementsByTagName("canvas")[0].style.display = 'block';

                self.gameText.text = "Game Over. You've scored " + self.points + " points..";
                self.gameText.position.x = game.world.centerX - 350;
                self.gameText.position.y = game.world.centerY - 200;

                //hide instead
                video.style.display = "none";

                self.buttonReplay.visible = true;
                self.buttonWatchVideo.visible = true;
            };
        }
    };

    var actionOnClick = function () {
        if (arguments[0].key === "buttonRestart") {
            restartGame.call(this);
        } else if (arguments[0].key === "buttonWatchVideo") {
            playFullVideo.call(this);
        } else if (arguments[0].key === "buttonHelp") {
            showIntro();
        }
    };

    var restartGame = function () {
        this.gameText.text = "Points: 0";
        this.points = 0;
        this.eagleSpeed = 70;

        collisionHandled = false;

        window.gameOver = false;

        sprite1.reset(50, 200);
        sprite2.reset(game.width, 200);

        var self = this;
        this.pointsInterval = setInterval(function () { updatePoints.call(self);}, 1000);

        self.gameText.position.x = 0;
        self.gameText.position.y = 0;

        this.buttonReplay.visible = false;
        this.buttonWatchVideo.visible = false;
    };

    // video class
    var playFullVideo = function () {
        document.getElementById("eagleVideo").style.display = 'block';
        document.getElementById("eagleVideo").style.position = 'absolute';
        document.getElementById("eagleVideo").src += "&autoplay=1";
    };

    //not used
    var render = function () {
        /*     game.debug.body(sprite2);
         game.debug.body(sprite1);
         game.debug.body(sprite2);
         game.debug.spriteInfo(sprite1, 32, 32);*/
    };

    var screenWrap = function(sprite){
        if (sprite.x < 0 || sprite.x > game.width || sprite.y < 0 || sprite.y > game.height)
        {
            sprite.x = game.width;//getStartingPosition({axis: "x"});
            sprite.y = getStartingPosition({axis: "y"});
        }
    };

    var getStartingPosition = function (options) {
        if (options.axis === "x") {
            return getRandomInt(0, game.width);
        } else {
            return getRandomInt(0, game.height);
        }
    };

    // to helpers
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    return {init: init};

};

// TODO: responsive eagle attack
// window.onresize = start;