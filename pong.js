/* Global constants*/
var canvas, c, keystate, count = 3,

player = {
    
    x: null,
    y: null,
    width:  20,
	height: 100,
	score: 0,
	name:'Dk',
    
    update: function() {
        if (keystate[87] || keystate[38]) this.y -= 7;
		if (keystate[83] || keystate[40]) this.y += 7;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, 600 - this.height), 0);
    },
    
    draw: function() {
        c.fillRect(this.x, this.y, this.width, this.height);
    }
    
},

ai = {
    x: null,
    y: null,
    width:  20,
	height: 100,
    score: 0,
    update: function() {
        // calculate ideal position
		var desty = ball.y - (this.height - ball.side)*0.5;
		// ease the movement towards the ideal position
		this.y += (desty - this.y) * 0.1;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, 600 - this.height), 0);
    },
    
    draw: function() {
        c.fillRect(this.x, this.y, this.width, this.height);
    }
},

ball = {
    
    x: null,
    y: null,
    vel: null,
    side:20,
    
    speed:10,
    
    update: function() {
        // update position with current velocity
		this.x += this.vel.x;
		this.y += this.vel.y;
		
		// Fixing bounds on Canvas Y-axis
		if (0 > this.y || this.y+this.side > 600) {
			// calculate and add the right offset, i.e. how far
			// inside of the canvas the ball is
			var offset = this.vel.y < 0 ? 0 - this.y : 600 - (this.y+this.side);
			this.y += 10*offset;
			// mirror the y velocity
			this.vel.y *= -1;
		}
		
		// Collision Detection
		var collision = function(ax, ay, aw, ah, bx, by, bw, bh) {
			return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
		};
		
		var other = this.vel.x < 0 ? player : ai;
		
		if (collision(other.x, other.y, other.width, other.height,
				this.x, this.y, this.side, this.side)
		) {	
			// set the x position and calculate reflection angle
			this.x = other===player ? player.x+player.width : ai.x - this.side;
			var n = (this.y+this.side - other.y)/(other.height+this.side);
			var phi = 0.25*Math.PI*(2*n - 1); // pi/4 = 45
			// Add a smash if the ball angle reaches a threshold
			var smash = Math.abs(phi) > 0.2*Math.PI ? 1.5 : 1;
			this.vel.x = smash*(other===player ? 1 : -1)*this.speed*Math.cos(phi);
			this.vel.y = smash*this.speed*Math.sin(phi);
		}
        
    },
    
    draw: function() {
        c.fillRect(this.x, this.y, 20, 20);
    }
    
}

;


function setup(){
   
    player.x = player.width;
	player.y = (600 - player.height)/2;
	ai.x = 900 - (player.width + ai.width);
	ai.y = (600 - ai.height)/2;
	
	ball.x = 440;
	ball.y = 310;
	
	ball.vel = {
        		x: 0,
        		y: 0
    };
	
	//to randomly select angle
	var r = Math.random();
	var side = Math.random() >= 0.5 ? 1 : -1 ;  // 1 is right, -1 is left
	var phi = 0.1*Math.PI*(1 - 2*r);
	count = 3;
	var countdown = setInterval(function(){
	    if(count === 0){
	        // set velocity direction and magnitude
        	ball.vel = {
        		x: side*ball.speed*Math.cos(phi),
        		y: ball.speed*Math.sin(phi)
        	}
        	clearInterval(countdown);
	    }
	    count-- ;
	}, 1000);
	
	
};

//Function used to update the gamestate
function update(){
    
    ball.update();
	player.update();
	ai.update();
	
	// reset the ball and add score
		if (0 > ball.x+ball.side || ball.x > 900) {
		    
		    if(0 > ball.x+ball.side)
		        ai.score += 1;
		    else if(ball.x > 900)
		        player.score += 1
			setup();
		}
};

//Function used to paint the canvas
function draw(){
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    c.fillStyle = "white";
    c.font="50px Bungee Inline";
	ball.draw();
	player.draw();
	ai.draw();
	
	//draw the score
	c.fillText(player.name, (0.25*900)-(c.measureText(player.name).width/2), 40, 100);
	c.fillText(player.score, (0.25*900)-(c.measureText(player.score).width/2), 80, 100);
	c.fillText("AI", (0.75*900)-(c.measureText("AI").width/2), 40, 100);
	c.fillText(ai.score, (0.75*900)-(c.measureText(ai.score).width/2), 80, 100);
	//draw the countdown
	
	if(count > 0)
	{
	    c.font="70px Bungee Inline";
	    c.fillText(count, (900-c.measureText(count).width)/2, 280, 100);
	}
	else if(count == 0)
	{
	    c.font="70px Bungee Inline";
	    c.fillText("GO", (900-c.measureText("GO").width)/2, 280, 100);
	}
	var w = 4;
	var x = (900 - w)*0.5;
	var y = 0;
	var step = 30; // how many net segments
	while (y < 600) {
		c.fillRect(x, y+step*0.25, w, step*0.5);
		y += step;
	}
};

function main(){
    canvas = document.getElementById("pong");
    c = canvas.getContext('2d');
    setup();
    
    keystate = {};
	// keep track of keyboard presses
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});
    
    // The main game loop
	var loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop);
	};
	window.requestAnimationFrame(loop);
};

//main();