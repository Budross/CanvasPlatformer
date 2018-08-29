
//Grabs Foreground Canvas Element (Top Layer)
let fg = document.getElementById('canvasLayer2');
//Grabs Background Canvas Element (Bottom Layer)
let bg = document.getElementById('canvasLayer1');
  
//Initializes Foreground Context for Canvas  
let fg_ctx = fg.getContext('2d');
//Initializes Background Context for Canvas
let bg_ctx = bg.getContext('2d');

//Tile Size in pixels, pretty straight forward...
const TILE_SIZE = 40;
const C_WIDTH = 2500;
//Loads First Dirt Sprite 
let dirtspriteLoaded = false;
let dirtSprite = new Image();
dirtSprite.src = "dirtSprite.png";
dirtSprite.onload = function() {
	dirtspriteLoaded = true;
}

//Loads Second Dirt Sprite
let dirtSprite2Loaded = false;
let dirtSprite2 = new Image();
dirtSprite2.src = "dirtSprite2.png";
dirtSprite2.onload = function (){
	dirtSprite2Loaded = true;
}
//Loads Grass Sprite
let grassSpriteLoaded = false;
let grassSprite = new Image();
grassSprite.src = "grassSprite.png";
grassSprite.onload = function() {
	grassSpriteLoaded = true;
}

let playerSpriteLoaded = false;
let playerSprite = new Image();
	playerSprite.src = "firstPlayer.png";
playerSprite.onload = function() {
	playerSpriteLoaded = true;
}

let player2SpriteLoaded = false;
let player2Sprite = new Image();
	player2Sprite.src = "firstPlayer2.png";
playerSprite.onload = function() {
	player2SpriteLoaded = true;
}


let collisionDetected = false;
let collision;
let flipped = false; 
//Main Game Function Calls Everything After The Window Has Loaded
window.onload = function(){
	class Player {
		constructor() {
			this.name = "Player"
			this.startX = 642;
			this.startY = 455;
			this.playerX = 0;
			this.playerY = 0;
			this.playerSpriteLoaded = false;
			this.playerSprite = new Image();
			this.playerSprite.src = "firstPlayer.png";
			this.x = this.startX + this.playerX;
			this.y = this.startY + this.playerY;
			this.width = 40;
			this.height = 80;
		}
	}
	var player1 = new Player();
	function drawPlayer(){
		fg_ctx.beginPath();
		fg_ctx.drawImage(playerSprite,player1.startX+player1.playerX, player1.startY+player1.playerY);
		fg_ctx.fill();
		fg_ctx.closePath();
	}
	function drawPlayer2(){
		fg_ctx.beginPath();
		fg_ctx.drawImage(player2Sprite,player1.startX+player1.playerX, player1.startY+player1.playerY);
		fg_ctx.fill();
		fg_ctx.closePath();
	}
	drawPlayer();
	function renderWorld(){
    	fg_ctx.clearRect(0,0,1280,720);
    	if(!flipped){
    		window.cancelAnimationFrame(drawPlayer2);
    		window.requestAnimationFrame(drawPlayer);
    	} else {
    		window.cancelAnimationFrame(drawPlayer);
    		window.requestAnimationFrame(drawPlayer2);
    	}

    }
    let renderLoop = setInterval(renderWorld,0);


	//Draws Grid, Grid Size is controlled by the Tile Size Constant
	function drawGrid(){	
		for(let i=0; i<=C_WIDTH; i+=TILE_SIZE) {
	    	
	    	bg_ctx.moveTo(i, 0);
	    	bg_ctx.lineTo(i, C_WIDTH);

	   		bg_ctx.moveTo(0, i);
	    	bg_ctx.lineTo(C_WIDTH, i);
	    	bg_ctx.stroke();
		}
	}
	drawGrid();
	//Sets The Default Starting Y Level For Player
	const FLOOR_LEVEL = 520;
	//Draws the floor with the grass sprite always on the top. Fills in the rest of the ground with the dirt sprite
	function floor() {
		let floorSprite = new Image();
		
		if(grassSpriteLoaded){
			for (let x = 0; x<canvasLayer1.width; x+=TILE_SIZE){
				bg_ctx.drawImage(grassSprite, x, FLOOR_LEVEL);
			}
		}
		if(dirtspriteLoaded && dirtSprite2Loaded){
			for (let x = 0; x<canvasLayer1.width; x+=TILE_SIZE){
				for (let y = FLOOR_LEVEL+TILE_SIZE; y<canvasLayer1.height; y+=TILE_SIZE){	
					switch (Math.floor(Math.random()*2)+1){
						case 1:
							floorSprite.src = "dirtSprite.png";
							break;
						case 2:
							floorSprite.src = "dirtSprite2.png";
							break;
						default:
							floorSprite.src = "dirtSprite2.png";
					}
					bg_ctx.drawImage(floorSprite, x, y);
				}
			}
		}
	}
	//Draws the floor
	floor();

	var Segment = function(x, y, vecx, vecy)
	{
		this.x = x;
		this.y = y;
		this.vecx = vecx;
		this.vecy = vecy;
		this.yLevel = this.y + this.vecy;
		this.xLevel = this.x + this.vecx;
		this.draw = function(width, color)
		{
			bg_ctx.beginPath();
			bg_ctx.lineWidth = width;
			bg_ctx.moveTo(this.x, this.y);
			bg_ctx.lineTo(this.x + vecx, this.y + vecy);
			bg_ctx.strokeStyle = color;
			bg_ctx.stroke();
		}
	}

	var segment = new Segment(TILE_SIZE*(Math.floor(Math.random()*16+1)), FLOOR_LEVEL,
							TILE_SIZE*(Math.floor(Math.random()*6+1)), (Math.floor(Math.random()*3)+1)*TILE_SIZE*-1);

	let floorSprite = new Image();
	segment.draw(2, 'red');
	
	function boundingBox(x, y, width, height){  
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		if (player1.x + player1.width <= this.x && player1.x >= this.x + this.width && player1.y + player1.height <= this.y && player1.y >= this.y + this.height){
			collisionDetected = true;
		} else {
			collisionDetected = false;
		}
	}
	setInterval(function(){
		boundingBox(segment.xLevel, segment.yLevel, canvasLayer1.width-segment.xLevel, canvasLayer1.height-segment.yLevel);
	}, 25);

	function testFloor(){
		for (let x = segment.xLevel; x<canvasLayer1.width; x+=TILE_SIZE){
				bg_ctx.drawImage(grassSprite, x, segment.yLevel);
		}
		for (let x = segment.xLevel; x<canvasLayer1.width; x+=TILE_SIZE){
			for (let y = segment.yLevel+TILE_SIZE; y<canvasLayer1.height; y+=TILE_SIZE){	
				switch (Math.floor(Math.random()*2)+1){
					case 1:
						floorSprite.src = "dirtSprite.png";
						break;
					case 2:
						floorSprite.src = "dirtSprite2.png";
						break;
					default:
						floorSprite.src = "dirtSprite2.png";
				}
				bg_ctx.drawImage(floorSprite, x, y);
				
			}
		}

	}
	testFloor();
		
	//setInterval(function(){
		//console.log(segment.yLevel);
		//console.log(player1.playerY + player1.startY);
	//}, 10);

	let stringifyPlayer =JSON.parse(JSON.stringify(player1.startY));
		//console.log(stringifyPlayer);



	let inAir = false;
	let jumping = false;
	function movePlayerUp(){
		if((player1.playerY+player1.startY)-(TILE_SIZE*2) < 440 && (player1.playerY+player1.startY)-(TILE_SIZE*2) > 240){
			inAir = true;

			var jump = setInterval(function(){
				for (let i = 0; i < 22; i +=1){
		 			player1.playerY -= 4;
					if(!flipped){
						window.cancelAnimationFrame(drawPlayer2);
						window.requestAnimationFrame(drawPlayer);
					} else {
						window.cancelAnimationFrame(drawPlayer);
						window.requestAnimationFrame(drawPlayer2);
					}
					if(i === 10){
						clearInterval(jump);
					}
				}
			}, 10);
			console.log("up");
			setTimeout(function() {	
				if (inAir){	
					if (player1.playerY === segment.yLevel - FLOOR_LEVEL || player1.startY+player1.playerY < FLOOR_LEVEL ){
						let gravityLoop = setInterval(function() {
							player1.playerY += 1;
							
							


							if (player1.startY+player1.playerY === FLOOR_LEVEL-65 || player1.startY+player1.playerY === segment.yLevel-65){
								if(player1.startX+player1.playerX >= segment.vecx && player1.startY+player1.playerY === segment.yLevel-65){
									
									inAir = false;
									console.log("first call");
								}
								if(player1.startY+player1.playerY === FLOOR_LEVEL-65){
									inAir = false;
								}
									console.log(player1.startY+player1.playerY);
							}

							if (!inAir){
								clearInterval(gravityLoop);
								collisionDetected = false;
							}
							if(!flipped){
								player1.y = FLOOR_LEVEL + (Math.max(player1.y+65,segment.yLevel-65)-FLOOR_LEVEL);
								window.cancelAnimationFrame(drawPlayer2);
								window.requestAnimationFrame(drawPlayer);
							} else {
								player1.y = FLOOR_LEVEL + (Math.max(player1.y+65,segment.yLevel-65)-FLOOR_LEVEL);
								window.cancelAnimationFrame(drawPlayer);
								window.requestAnimationFrame(drawPlayer2);
							}

						}, 10);

					}
				}
			}, 200);
		}
		console.log(stringifyPlayer+player1.playerY); 
	}

	function groundCheck(){
		if(player1.startX+player1.playerX < segment.vecx && player1.startY+player1.playerY < FLOOR_LEVEL){
			for(let i = player1.playerY; i < FLOOR_LEVEL; i++){
				setTimeout(function(){
					player1.playerY = i;
					if(flipped){
						window.requestAnimationFrame(drawPlayer2);
					} else {
						window.requestAnimationFrame(drawPlayer);
					}
				}, 10);
			}
		}
	}


	function movePlayerDown(){
		player1.playerY = 0;
		if(flipped){
			window.requestAnimationFrame(drawPlayer2);
		} else {
			window.requestAnimationFrame(drawPlayer);
		}
		console.log("down");
	}

	


	function movePlayerLeft(){
		if(player1.playerX+TILE_SIZE > -600){
			
			player1.playerX -= TILE_SIZE;
			bg_ctx.translate(-TILE_SIZE,0);
			console.log("left");

		}
	}
	function movePlayerRight(){
		if(player1.playerX+TILE_SIZE < 642){
			player1.playerX += TILE_SIZE;
			bg_ctx.translate(TILE_SIZE,0);
			console.log("right");
			
		}
	}

	document.addEventListener('keydown', function(e){
		let keyCode = e.keyCode || e.which;
		console.log(keyCode);
    	let arrow = {left: 65, up: 32, right: 68, down: 83 };
    	
    	if(e.keyCode === arrow.left){
    		if (flipped){
    		groundCheck();
    		window.requestAnimationFrame(movePlayerLeft);
    		}
    		flipped = true;
    		//movePlayerLeft();
    	} else if (keyCode === arrow.right){
    		if(!flipped){
    		groundCheck();
    		window.requestAnimationFrame(movePlayerRight);
    		}
    		flipped = false;
    		//movePlayerRight();
    	} else if (keyCode === arrow.up){
    		window.requestAnimationFrame(movePlayerUp);
    		//movePlayerUp();
    	} else if (keyCode === arrow.down){
    		window.requestAnimationFrame(movePlayerDown);
    	} else {
    		player1.playerX = player1.playerX;
    		player1.playerY = player1.playerY;
    	}
	});

	console.log(segment.yLevel);
}
