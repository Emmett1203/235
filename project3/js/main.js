"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

app.loader.
    add([
        "images/dot.png",
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

let stage;

let startScene;
let gameScene,dot;
let gameOverScene;

//only body.appendChild when the page is loaded
function setup() {
	stage = app.stage;
	// #1 - Create the `start` scene
	startScene = new PIXI.Container();
    stage.addChild(startScene);

	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

	// #3 - Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

	// #4 - Create labels for all 3 scenes
	createLabelsAndButtons();

	// #5 - Create DOT
	dot = new Dot();
    gameScene.addChild(dot);

    // #8 - Start update loop
	app.ticker.add(gameLoop);
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 43,
        fontFamily: "Futura"
    });

    let startLabel1 = new PIXI.Text("Opening in the wall");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 59,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = 50;
    startLabel1.y = 75;
    startScene.addChild(startLabel1)

    let startButton = new PIXI.Text("PLAY");
    startButton.style = buttonStyle;
    startButton.x = 20;
    startButton.y = 300;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    dot.x = 20;
    dot.y = 300;
}

function gameLoop(){
	//if (paused) return; // keep this commented out for now

	// #1 - Calculate "delta time"
	let dt = 1/app.ticker.FPS;
    if (dt > 1/12){
        dt=1/12;
    }
	
	// #2 - Move Ship
	let mousePosition = app.renderer.plugins.interaction.mouse.global;
    //ship.position = mousePosition;
	
    let amt = 6 * dt;

    let newX = lerp(dot.x, mousePosition.x, amt);
    let newY = lerp(dot.y, mousePosition.y, amt);

    let w2 = dot.width/2;
    let h2 = dot.height/2;
    dot.x = clamp(newX,0 + w2, sceneWidth - w2)
    dot.y = clamp(newY,0 + h2, sceneHeight - h2)
}