
const icons = ["bars","bug","bowling-ball","coffee","couch","football-ball","gem","laptop"];
const powerIcon = ["bomb"];
const btnStart = document.querySelector('.btnStart');
const gameOverEle = document.getElementById('gameOverEle');
const container = document.getElementById('container');
const box = document.querySelector('.box');
const base = document.querySelector('.base');
const scoreDash = document.querySelector('.scoreDash');
const progressBar = document.querySelector('.progress-bar');

const boxCenter = [
		box.offsetLeft + (box.offsetWidth / 2),
		box.offsetTop + (box.offsetHeight / 2)];

//let rect = box.getBoundingClientRect();

let gamePlay = false;
let hit = false;
let isPowerUp = false;
let powerRand = 0;
let player;
let animateGame;
let states = [false, false, false, false];
let enemyVelocity = STARTING_ENEMIES_VELOCITY;

btnStart.addEventListener('click', startGame);
container.addEventListener('mousedown', mousedown);
container.addEventListener('mousemove', movePosition);



function startGame() {
	gamePlay = true;
	gameOverEle.style.display = 'none';

	player = {
		score: 0,
		barwidth:PLAYER_BAR_WIDTH,
		lives:PLAYER_LIVES
	} 

	//setup badguys
	setupBadguys(STARTING_NUMBER_ENEMIES);
	powerupMaker();

	animateGame = requestAnimationFrame(playGame);

}

function moveEnemy() {
	let tempEnemys = document.querySelectorAll('.baddy');
	let tempShots = document.querySelectorAll('.fireme');

	for(let enemy of tempEnemys) {
		if(enemy.offsetTop > 550 || enemy.offsetTop < 0 ||
			enemy.offsetLeft > 750 || enemy.offsetLeft < 0) {
			enemy.parentNode.removeChild(enemy);
			badmaker();
		}else {
			enemy.style.top = enemy.offsetTop + enemy.movery + 'px';
			enemy.style.left = enemy.offsetLeft + enemy.moverx + 'px';
			for(let shot of tempShots) {
				if(isCollide(shot, enemy) && gamePlay) {
					player.score += enemy.points;
					enemy.parentNode.removeChild(enemy);
					shot.parentNode.removeChild(shot);
					updateDash();
					badmaker();
					break;
				}
			}
		}
		
		if(isCollide(box, enemy)) {
			hit = true;
			player.lives -= ENEMY_DAMAGE;
			enemy.parentNode.removeChild(enemy);
			badmaker();
			if(player.lives <= 0) { gameOver();}
		}
	}

	if(hit) {
		base.style.backgroundColor = 'red';
		hit = false;
		isPowerUp = false;
		powerRand = 0;
		powerupMaker();
	}else {
		base.style.backgroundColor = '';
	}

}

function movePowerUps() {
	let tempPowerUps = document.querySelectorAll('.power');
	let tempShots = document.querySelectorAll('.fireme');

	for(let powerUp of tempPowerUps) {
		if(powerUp.offsetTop > 550 || powerUp.offsetTop < 0 ||
			powerUp.offsetLeft > 750 || powerUp.offsetLeft < 0) {
			powerUp.parentNode.removeChild(powerUp);
			powerupMaker();
		}else {
			powerUp.style.top = powerUp.offsetTop + powerUp.movery + 'px';
			powerUp.style.left = powerUp.offsetLeft + powerUp.moverx + 'px';
			for(let shot of tempShots) {
				if(isCollide(shot, powerUp) && gamePlay){
					shot.parentNode.removeChild(shot);
					powerUp.parentNode.removeChild(powerUp);
					isPowerUp = true;
					powerRand = randomMe(NUMBER_OF_POWER_UPS);
					break;
				}
			}
		}
	}


}



function gameOver() {
	cancelAnimationFrame(animateGame);
	gameOverEle.style.display = 'block';
	gameOverEle.querySelector('span').innerHTML = 'GAME OVER <br> Your Score' + player.score;
	gamePlay = false;
	enemyVelocity = STARTING_ENEMIES_VELOCITY;
	isPowerUp = false;
	let tempEnemys = document.querySelectorAll('.baddy');
	let tempShots = document.querySelectorAll('.fireme');
	let tempPowerUps = document.querySelectorAll('.power');

	for(let i = 0; i < states.length; i++) {
		states[i] = false;
	}

	for(let enemy of tempEnemys) {
		enemy.parentNode.removeChild(enemy);
	}

	for(let shot of tempShots) {
		shot.parentNode.removeChild(shot);
	}

	for(let powerUp of tempPowerUps) {
		powerUp.parentNode.removeChild(powerUp);
	}

}


function updateDash() {
	scoreDash.innerHTML = player.score;
	let tempPercent = (player.lives / player.barwidth) * 100 + '%';
	progressBar.style.width = tempPercent;

}


function movePosition(e) {
	let deg = getDeg(e);
	box.style.webkitTransform = 'rotate(' + deg + 'deg)';
    box.style.mozTransform = 'rotate(' + deg + 'deg)';
    box.style.msTransform = 'rotate(' + deg + 'deg)';
    box.style.oTransform = 'rotate(' + deg + 'deg)';
	box.style.transform = 'rotate('+deg+'deg)';


}

function getDeg(e) {
	return (Math.atan2( e.clientX - boxCenter[0], -(e.clientY - boxCenter[1]))) * (180 / Math.PI);
}


function degRad(deg) {
	return deg * (Math.PI / 180);
}


function mousedown(e) {
	if(gamePlay){
		if(isPowerUp){
			powerUp(e, powerRand);
		}else{
			createShoot(e, 0);
		}
		
		
			
	}
}

function powerUp(e, rand){
	switch(rand){
			case 0:
				createShoot(e, 0);
				createShoot(e, 0.25);
				createShoot(e, -0.25); 
			break;
			case 1:
				createShoot(e, 0);
				createShoot(e, 2);
				createShoot(e, -2);
			break;
			case 2: 
				createShoot(e, 0);
				createShoot(e, 3.1);
			break;
			case 3: 
				createShoot(e, 0);
				createShoot(e, 1);
				createShoot(e, 2);
				createShoot(e, 3.1);
				createShoot(e, -1);
				createShoot(e, -2);
			break;
			default:
			break;
		}
}

function createShoot(e, offset) {
	let div = document.createElement('div');
	let deg = getDeg(e);
	div.setAttribute('class', 'fireme');
	div.moverx =  FIRE_SHOOT_VELOCITY * Math.sin(degRad(deg) + offset);
	div.movery = -FIRE_SHOOT_VELOCITY * Math.cos(degRad(deg) + offset);
	div.style.left =  ( boxCenter[0] - 5 ) + 'px';
	div.style.top =  ( boxCenter[1] - 5 ) + 'px';
	div.style.width = 10 + 'px';
	div.style.height = 10 + 'px';
	container.appendChild(div);
}



function setupBadguys(numberBadguys) {
	for (let i = 0; i < numberBadguys; i++) {
		badmaker();
	}
}


function randomMe(argument) {
	return Math.floor(Math.random() * argument);
}



function badmaker() {
	let div = document.createElement('div');
	let myIcon = 'fa-' + icons[randomMe(icons.length)];
	let x, y, xmove, ymove;
	let randomStart =  randomMe(4);
	//let dirSet = randomMe(5) + 2;
	let dirSet = enemyVelocity;
	let dirPos = randomMe(7) - 3;
	switch(randomStart) {
		case 0: 
			x = 0;
			y = randomMe(600);
			ymove = dirPos;
			xmove = dirSet;
		break;
		case 1: 
			x = 800;
			y = randomMe(600);
			ymove = dirPos;
			xmove = dirSet * -1;
		break;
		case 2: 
			x = randomMe(800);
			y = 0;
			ymove = dirSet;
			xmove = dirPos;
		break;
		case 3: 
			x = randomMe(800);
			y = 600;
			ymove = dirSet * -1;
			xmove = dirPos;
		break;
		default: console.log('something went wrong');  break;
	} 
	div.style.color = randomColor();
	div.innerHTML = '<i class="fas ' + myIcon + '"></i>';
	div.setAttribute('class','baddy');
	div.style.fontSize = randomMe(20) + 30 + 'px';
	div.style.left = x + 'px';
	div.style.top  = y + 'px';
	div.points = randomMe(5) + 1;
	div.moverx = xmove; 
	div.movery = ymove;
	container.appendChild(div);
}

function powerupMaker() {
	let div = document.createElement('div');
	let myIcon = 'fa-' + powerIcon[0];
	let x, y, xmove, ymove;
	let randomStart =  randomMe(4);
	let dirSet = enemyVelocity;
	let dirPos = randomMe(7) - 3;
	switch(randomStart) {
		case 0: 
			x = 0;
			y = randomMe(600);
			ymove = dirPos;
			xmove = dirSet;
		break;
		case 1: 
			x = 800;
			y = randomMe(600);
			ymove = dirPos;
			xmove = dirSet * -1;
		break;
		case 2: 
			x = randomMe(800);
			y = 0;
			ymove = dirSet;
			xmove = dirPos;
		break;
		case 3: 
			x = randomMe(800);
			y = 600;
			ymove = dirSet * -1;
			xmove = dirPos;
		break;
		default: console.log('something went wrong');  break;
	} 
	div.style.color = randomColor();
	div.innerHTML = '<i class="fas ' + myIcon + '"></i>';
	div.setAttribute('class','power');
	div.style.fontSize = randomMe(20) + 30 + 'px';
	div.style.left = x + 'px';
	div.style.top  = y + 'px';
	div.points = randomMe(5) + 1;
	div.moverx = xmove; 
	div.movery = ymove;
	container.appendChild(div);
}

function randomColor() {
	function c() {
		let hex = randomMe(256).toString(16);
		return ('0' + String(hex)).substr(-2);
	}
	return '#'+ c() + c() + c(); 
}


function moveShots() {
	if(hit)return;
	let tempShots = document.querySelectorAll('.fireme');
	for(let shot of tempShots){
		if(shot.offsetTop > 600 || shot.offsetTop < 0 || 
			shot.offsetLeft > 800 || shot.offsetLeft < 0){
			shot.parentNode.removeChild(shot);
		}else{
			shot.style.top = shot.offsetTop + shot.movery + 'px';
			shot.style.left = shot.offsetLeft + shot.moverx + 'px';
		}
		
	}
}



function isCollide(elemnent, enemy) {
	let elementRect = elemnent.getBoundingClientRect();
	let enemyRect   = enemy.getBoundingClientRect();

	return !(
		(elementRect.bottom < enemyRect.top)  || 
		(elementRect.top > enemyRect.bottom)  ||
		(elementRect.right < enemyRect.left)  ||
		(elementRect.left  > enemyRect.right)
	);

}


function updateEnemyNumbers() {
	
	if(player.score > UPDATE_DIFFICULTY && !states[0]) {
		enemyVelocity += VELOCITY_ENEMY_INCREASE;
		states[0] = true;
	}else if(player.score > (UPDATE_DIFFICULTY * 2) && !states[1]) {
		enemyVelocity += VELOCITY_ENEMY_INCREASE;
		states[1] = true;
	}else if(player.score > (UPDATE_DIFFICULTY * 2) && !states[2]) {
		enemyVelocity += VELOCITY_ENEMY_INCREASE;
		states[2] = true;
	}else if(player.score > (UPDATE_DIFFICULTY * 2) && !states[3]) {
		enemyVelocity += VELOCITY_ENEMY_INCREASE;
		states[3] = true;
	}

}





function playGame(argument) {
	
	if(gamePlay) {
		//move shots
		moveShots();
		//move dashboard
		updateDash();
		//move enemy
		moveEnemy();
		movePowerUps();

		updateEnemyNumbers();
		animateGame = requestAnimationFrame(playGame); 
	}

}


