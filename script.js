const btnStart = document.querySelector('.btnStart');
const gameOverEle = document.getElementById('gameOverEle');
const container = document.getElementById('container');
let gamePlay = false;
let player;
let animateGame;


btnStart.addEventListener('click', startGame);
container.addEventListener('mousedown', mousedown);


function mousedown(e) {
	if(gamePlay){
		console.log('fire');
	}
}


function startGame() {
	gamePlay = true;
	gameOverEle.style.display = 'none';

	player = {
		score: 0,
		barwidth:100,
		lives:100
	} 

	//setup badguys
	animateGame = requestAnimationFrame(playGame);

}

function playGame(argument) {
	
	if(gamePlay) {
		//move shots
		//move dashboard
		//move enemy
		animateGame = requestAnimationFrame(playGame); 
	}

}