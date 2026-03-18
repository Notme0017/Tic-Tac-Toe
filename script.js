const playerStatus = document.querySelector("#status");

const GameBoard = (() =>{
	let gameBoard = Array(9).fill("");

	const getBoard = () => gameBoard;

	const placeMark = (index, mark) =>{
		if(gameBoard[index] != "")return false;
		gameBoard[index] = mark;
		return true;
	}

	const reset = () =>{
		for(let i = 0; i < 9; i++){
			gameBoard[i] = "";
		}
	}
	return { getBoard, placeMark,reset };
})();

let player1, player2;

const Player = (name, value) => ({name, value});

const GameController = (() =>{
	let currentPlayer;
	let gameOver = false;

	const startGame = () =>{
		currentPlayer = player1;
		gameOver = false;
		playerStatus.textContent = `${currentPlayer.name}'s turn`;
	}

	const switchPlayer = () =>{
		currentPlayer = currentPlayer === player1? player2:player1;
	}

	const playRound = (index) =>{
		if(gameOver) return;

		const success = GameBoard.placeMark(index, currentPlayer.value);
		if(!success) return;

		if(checkWin()){
			console.log(`${currentPlayer.name} wins!`);
			gameOver = true;
			playerStatus.textContent = `${currentPlayer.name} wins!`;
			return;
		}

		if(checkTie()){
			console.log("It's a tie");
			gameOver = true;
			playerStatus.textContent = "It's a tie"
			return;
		}

		switchPlayer();	

		playerStatus.textContent = `${currentPlayer.name}'s turn`;
	}

	const winningCombos = [
		[0,1,2], [3,4,5], [6,7,8],
		[0,3,6], [1,4,7], [2,5,8],
		[0,4,8], [2,4,6]
	];
	const checkWin = () =>{
		const board = GameBoard.getBoard();
		
		return winningCombos.some(combo =>
			combo.every(i =>board[i] === currentPlayer.value)
		);
	};

	const checkTie = () =>{
		return GameBoard.getBoard().every(cell =>cell !== "");
	};
	return {startGame, playRound};
})();

function DrawPlayerSelection(){
	const oldDialog = document.querySelector("#assignPlayers");
	if(oldDialog) oldDialog.remove();

	let dialog = document.createElement("dialog");
	dialog.id = "assignPlayers";
	
	const form = document.createElement('form');
	form.id = 'playerAssignForm';
	form.method = 'dialog';

	form.innerHTML = `
		<h2>Player Details</h2>

		<div class="form-player1">
		<h3>Player 1 </h3>
		<label for="name1">Player Name: </label>
		<input type="text" id="name1">
		<label for="value1">Player Choice: </label>
		<input type="text" id="value1">
		</div>


		<div class="form-player2">
		<h3>Player 2 </h3>
		<label for="name2">Player Name: </label>
		<input type="text" id="name2">
		<label for="value2">Player Choice: </label>
		<input type="text" id="value2">
		</div>


		<button type="submit" value="submit">Submit</button>
		<button type="button" value="close" id="close-btn">Close</button>

	`

	dialog.appendChild(form);
	document.body.appendChild(dialog);

	const closeButton = form.querySelector('#close-btn');
	closeButton.addEventListener('click', () =>{
		dialog.close();
	})

	dialog.addEventListener('close', () => {
		if(dialog.returnValue === 'submit'){
			const name1 = form.querySelector('#name1').value;
			const value1 = form.querySelector('#value1').value;

			const name2 = form.querySelector("#name2").value;
			const value2 = form.querySelector("#value2").value;

			AssignPlayers(name1, value1, name2, value2);
		}
	})

	dialog.showModal();
}

function AssignPlayers(name1, value1, name2, value2){
	player1 = Player(name1, value1);
	player2 = Player(name2, value2);

	start.textContent = "New Game";

	DrawBoard();
	render();
	GameController.startGame();
}

function DrawBoard() {
	const existingBoard = document.querySelector(".board");
	if (existingBoard) existingBoard.remove(); 

	const boardContainer = document.createElement("div");
	boardContainer.classList.add("board");

	for(let i = 0; i < 9; i++){
		const cell = document.createElement("div");
		cell.classList.add("cell");

		cell.addEventListener("click", () =>{
			GameController.playRound(i);
			render();
		});

		boardContainer.appendChild(cell);
	}
	document.body.appendChild(boardContainer);
}

function render(){
	const cells = document.querySelectorAll(".cell");
	const board = GameBoard.getBoard();
	cells.forEach((cell, i) =>{
		cell.textContent = board[i];
	})
}

const start = document.querySelector("#start");
start.addEventListener("click", () =>{
	DrawPlayerSelection();
})

const restart = document.querySelector("#restart");
restart.addEventListener("click", () =>{
	GameBoard.reset();
	render();
	GameController.startGame();
})
