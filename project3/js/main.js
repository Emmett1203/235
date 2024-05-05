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
        "images/wall.png",
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

let stage;

let startScene;
let gameScene,dot,scoreLabel,wall;
let gameOverScene;

let speed,score,highscore;

let paused = true;

const prefix = "eem1203-"; // change 'abc1234' to your banjo id
const highKey = prefix + "high";
const storedHigh = localStorage.getItem(highKey);
renderer = PIXI.autoDetectRenderer(width, height);renderer.view.style.position = 'absolute';renderer.view.style.left = Math.floor((baseWidth-width)/2)+'px';renderer.view.style.top = '0px';document.appendChild(renderer.view);
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
    wall = new Wall();
    gameScene.addChild(wall);

    // #8 - Start update loop
	app.ticker.add(gameLoop);

    speed = 1;
    score = 0;
    if (storedHigh){
        highscore = storedHigh;
    }else{
        highscore = 0; // a default value if `nameField` is not found
    }
    //Code from https://stackoverflow.com/questions/52097840/how-to-overwrite-text-in-p-tag-using-javascript
    document.getElementById('replace-me').innerText = "High Score: " + highscore;
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 43,
        fontFamily: 'Lineal',
    });

    let startLabel1 = new PIXI.Text("Opening in the wall");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 59,
        fontFamily: "Gill Sans",
        stroke: 0xFFFFFF,
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

    let textStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 18, 
        fontFamily: "Gill Sans",
        stroke: 0xFFFFFF,
        strokeThickness: 4
    });

    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);


    let gameOverText = new PIXI.Text(" Game Over!");
    textStyle = new PIXI.TextStyle({
        fill: 0x000000,
    	fontSize: 64,
	    fontFamily: "Gill Sans",
        stroke: 0xFFFFFF,
    	strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 110;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 190;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", reloadPage); // startGame is a function reference
    playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(playAgainButton);
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    dot.x = 20;
    dot.y = 300;
    speed = 1;
    score = 0;
    wall.x = 600;
    wall.y = 300;
    paused = false;
}

function gameLoop(){
	if (paused) return; // keep this commented out for now

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


    if (score >= 5){
        wall.scale.set(1, 2);
    }

    wall.x = wall.x - (1 + speed);

    if  (rectsIntersect(dot, wall) == true){
        end();
	    return;
    }

    if (wall.x <= -20){
        wall.x = 600;
        wall.y = getRandom(-10,550);
        increaseScoreBy(1);
        speed += 0.5;
    }

    if (score > highscore){
        localStorage.setItem(highKey, score);
    }
}

function increaseScoreBy(value){
    score += value;
    scoreLabel.text = `Score     ${score}`;
}

function end(){
    paused = true;

    gameScene.removeChild(dot);

    gameScene.removeChild(wall);

    gameOverScene.visible = true;
    gameScene.visible = false;
}

function reloadPage(){
    location.reload();
}