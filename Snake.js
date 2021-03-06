var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var blockBtn = document.querySelector('.blockBtn');
var arrBtn = Array.from(document.getElementsByClassName('btn'));

if(document.body.clientWidth < 970 ) {
	canvas.width = document.body.clientWidth;
	canvas.height = 800;
	blockBtn.style.left = document.body.clientWidth/2 - 260 + "px";
	blockBtn.style.height = 300 + "px";
	blockBtn.style.width = 600 + "px";

	arrBtn.forEach(el => {
		el.style.width = 180 + "px";
		el.style.height = 120 + "px";
		el.style.marginTop = 0 +"px";
		el.style.marginBottom = 0 +"px";
	})

	arrBtn[0].style.marginLeft = 190+"px";
	arrBtn[0].style.marginRight = 190+"px";
	arrBtn[3].style.marginLeft = 190+"px";
	arrBtn[3].style.marginRight = 190+"px";
	arrBtn[2].style.marginLeft = 90+"px";
	arrBtn[2].style.marginRight = 0+"px";	
	arrBtn[1].style.marginLeft = 0+"px";
	arrBtn[1].style.marginRight = 90+"px";	
} else {
	canvas.width = 400;
	canvas.height = 400;
}
var width = canvas.width;
var height = canvas.height;
var blockSize = 10;
var widthInBlock = width / blockSize;
var heightInBlock = height / blockSize;
var score = 0;


var drawBorder = function() { // границы поля
	ctx.fillStyle = "Gray";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
	ctx.fillRect(0, 0, blockSize, height);
}
 
var drawScore = function() { // вывод счета в левом верхнем углу
	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Счет: "+ score, blockSize, blockSize); 
};

var gameOver = function() {
	clearInterval(intervalId)
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	ctx.fillText("Конец игры", width / 2, height / 2); 
};

var circle = function(x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, false);
	if(fillCircle){
		ctx.fill();
	} else {
		ctx.stroke();
	}
};
var Block = function(col, row) {
	this.col = col;
	this.row = row;
};
Block.prototype.drawSquare = function(color) {  // размер и форма блока тела
	var x = this.col * blockSize;
	var y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};
Block.prototype.drawCircle = function(color) { // размер и форма яблока
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
}; 
Block.prototype.equal = function(otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};
var Snake = function() {
	this.segments = [
		new Block(7,5), 
		new Block(6,5), 
		new Block(5,5)
	];
	this.direction = "right" ;
	this.nextDirection = "right";
};
Snake.prototype.draw = function() {
	for(var i=0; i < this.segments.length; i++) {
		this.segments[i].drawSquare("Blue")
	}
};

Snake.prototype.move = function() {
	var head = this.segments[0];
	var newHead;
	this.direction = this.nextDirection; 
	if(this.direction === "right") {
		newHead = new Block(head.col + 1, head.row);
	} else if(this.direction === "left") {
		newHead = new Block(head.col - 1, head.row);
	} else if(this.direction === "down") {
		newHead = new Block(head.col, head.row + 1);
	} else if(this.direction === "up") {
		newHead = new Block(head.col, head.row - 1);
	}
	if(this.checkCollision(newHead)) {
		gameOver();
		return;
	}
	this.segments.unshift(newHead);
	if(newHead.equal(apple.position)){
		score++;
		apple.move();
	} else {
		this.segments.pop();
	}
};
Snake.prototype.checkCollision = function(head) {
	var leftCollision = (head.col === 0);
	var topCollision = (head.row === 0);
	var rightCollision = (head.col === widthInBlock - 1);
	var downCollision = (head.row === heightInBlock - 1);
	var wallCollision = topCollision || leftCollision || rightCollision || downCollision;
	var selfCollision = false;
	for(var i=0; i < this.segments.length; i++) {
		if(head.equal(this.segments[i])) {
			selfCollision = true;
		}
	}
	return selfCollision || wallCollision;
};
Snake.prototype.setDirection = function(newDirection) {
	if(this.direction === "up" && newDirection === "down") {
		return;
	} else if(this.direction === "left" && newDirection === "right") {
		return;
	} else if(this.direction === "down" && newDirection === "up") {
		return;
	} else if(this.direction === "right" && newDirection === "left") {
		return;
	} 
	this.nextDirection = newDirection;
};
var Apple = function() {
	this.position = new Block(10, 10);
};
Apple.prototype.draw = function() {
	this.position.drawCircle("LimeGreen");
};
Apple.prototype.move = function() {
	var randomCol = Math.floor(Math.random() * (widthInBlock - 2) + 1);
	var randomRow = Math.floor(Math.random()*(heightInBlock - 2) + 1);
	this.position = new Block(randomCol,randomRow);
};

var snake = new Snake();
var apple = new Apple();
var intervalId = setInterval(function() {
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();
}, 100);
var directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};
document.addEventListener("keydown", (event) => {
	var newDirection = directions[event.keyCode];
	if(newDirection !== undefined) {
		snake.setDirection(newDirection);
	}
}); 

arrBtn.forEach(el => {
	el.addEventListener("click", (event)=>{
	snake.setDirection(event.target.classList[1]);
	})
});