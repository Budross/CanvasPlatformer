

let fg = document.getElementById('canvasLayer2');
let bg = document.getElementById('canvasLayer1');
  
let fg_ctx = fg.getContext('2d');
let bg_ctx = bg.getContext('2d');

const TILE_SIZE = 20;

let dirtspriteLoaded = false;
let dirtSprite = new Image();
dirtSprite.src = "dirtSprite.png";
dirtSprite.onload = function() {
	dirtspriteLoaded = true;
}

let dirtSprite2Loaded = false;
let dirtSprite2 = new Image();
dirtSprite2.src = "dirtSprite2.png";
dirtSprite2.onload = function (){
	dirtSprite2Loaded = true;
}
let grassSpriteLoaded = false;
let grassSprite = new Image();
grassSprite.src = "grassSprite.png";
grassSprite.onload = function() {
	grassSpriteLoaded = true;
}

window.onload = function(){

	function drawGrid(){	
		for(let i=0; i<=1280; i+=TILE_SIZE) {
	    	
	    	bg_ctx.moveTo(i, 0);
	    	bg_ctx.lineTo(i, 1280);

	   		bg_ctx.moveTo(0, i);
	    	bg_ctx.lineTo(1280, i);
	    	bg_ctx.stroke();
		}
	}
	//drawGrid();

	const FLOOR_LEVEL = 520;
	function floor() {
		let floorSprite = new Image();
		
		if(grassSpriteLoaded){
			for (let x = 0; x<canvasLayer1.width; x+=TILE_SIZE*2){
				bg_ctx.drawImage(grassSprite, x, FLOOR_LEVEL);
			}
		}
		if(dirtspriteLoaded && dirtSprite2Loaded){
			for (let x = 0; x<canvasLayer1.width; x+=TILE_SIZE*2){
				for (let y = FLOOR_LEVEL+TILE_SIZE*2; y<canvasLayer1.height; y+=TILE_SIZE){	
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
	floor();






}
