const Game = (() => {
  let gameData = {
    current_player: null,
    player1_wins: 0,
    player2_wins: 0,
    tie_games: 0
  };

  const clearGameData = () => {
    Game.gameData = {
      current_player: null,
      player1_wins: 0,
      player2_wins: 0,
      tie_games: 0
    };
  }

  console.log("Game initialized!");

  return { gameData, clearGameData }
})();

const Gameboard = (() => {

  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const _checkForWinner = (clickedSquareNum, currentPlayerMark) => {
    const winCons = [
      // Rows
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      // Columns
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      // Diagonal
      [0, 4, 8], [2, 4, 6],
    ];


    // First, filter all of the win cons down to an array of *possible* win cons based on these win con arrays containing the clicked square's number. We do this using `filter`, `includes`, and the clicked square's number…
    const possibleWinCons = winCons.filter(winCon => winCon.includes(clickedSquareNum));
    // Then, look through each possible win con array passed to us from the `filter` method using `some`. We use `some` instead of `forEach` here because once `some` returns true, it stops, whereas `forEach` would just keep going…
    const winConFound = possibleWinCons.some(possibleWinCon => 
                          // *Inside* of `some` we use `every` because we want to check every index of the gameboard array, but only at the current win con's indices. As we look at these specific indicies, we want to make sure all 3 contain the current player's mark. If they do, `every` returns true and stops, which causes `some` to return true and stop — because the expression inside of `some` is indeed true — which passes true to the variable `winConFound`.
                          possibleWinCon.every(index => gameboard[index] === currentPlayerMark));
    if (winConFound) {
      const matchingWinCon = possibleWinCons.findIndex(possibleWinCon => possibleWinCon.every(index => gameboard[index] === currentPlayerMark));
      const highlightArray = possibleWinCons[matchingWinCon];
      _highlightWinner(highlightArray);
      return winConFound;
    }
    const tieGame = gameboard.every(squareValue => squareValue !== "");
    if (tieGame) {
      return "tie";
    }

    return winConFound;
  }

  const _highlightWinner = winConArray => {
    let squares = document.querySelectorAll(".board-square");
    squares = [...squares];
    const squareMatches = squares.filter(square => winConArray.includes(parseInt(square.getAttribute("data-square"))));
    for (let square of squareMatches) {
      square.classList.add("highlight");
    }
  }

  const _createSquareText = text => {
    const squareText = document.createElement("span");
    const newTextContent = document.createTextNode(text);
    squareText.classList.add("board-square__text");
    squareText.appendChild(newTextContent);
    return squareText;
  }

  const _clickSquare = e => {
    const clickedEl = e.target.closest(".board-square");
    if (clickedEl.querySelector(".board-square__text")) {
      return;
    }

    let currentPlayerMark = GameController.currentPlayer.mark;
    let clickedSquareNum = parseInt(clickedEl.getAttribute("data-square"));
    gameboard[clickedEl.getAttribute("data-square")] = currentPlayerMark;
    clickedEl.appendChild(_createSquareText(currentPlayerMark));

    const winnerFound = _checkForWinner(clickedSquareNum, currentPlayerMark);
    if (winnerFound == true) {
      _setupClickEvents(winnerFound);
      GameUI.gameStatus.textContent = `${GameController.currentPlayer.name} wins!`;
      if (GameController.currentPlayer.mark === "X"){
        Game.gameData.player1_wins++;
        document.getElementById("player1-wins").textContent = Game.gameData.player1_wins;
      } else {
        Game.gameData.player2_wins++;
        document.getElementById("player2-wins").textContent = Game.gameData.player2_wins;
      }
    } else if (winnerFound == "tie") {
      _setupClickEvents(winnerFound);
      GameUI.gameStatus.textContent = "Tie game!";
      Game.gameData.tie_games++;
      document.getElementById("ties-games").textContent = Game.gameData.tie_games;
    } else {
      GameController.currentPlayer = GameController.setActivePlayer(GameController.currentPlayer);
      GameUI.gameStatus.textContent = `${GameController.currentPlayer.name}'s turn`;
    }
  }

  const _setupClickEvents = winner => {
    const boardSquares = document.querySelectorAll(".board-square");
    if (winner) {
      for (let square of boardSquares) {
        square.removeEventListener("click", _clickSquare, false);
        square.addEventListener("click", resetBoard, false);
      }
    }
    else if (!winner || winner === "tie") {
      for (let square of boardSquares) {
        square.removeEventListener("click", resetBoard, false);
        square.addEventListener("click", _clickSquare, false);
      }
    }
  }

  const _init = () => {
    _setupClickEvents();
    document.getElementById("player1-wins").textContent = Game.gameData.player1_wins;
    document.getElementById("player2-wins").textContent = Game.gameData.player2_wins;
    document.getElementById("ties-games").textContent = Game.gameData.tie_games;
  }
  
  const resetBoard = resetToPlayer1Boolean => {
    gameboard = ["", "", "", "", "", "", "", "", ""];
    const boardSquares = document.querySelectorAll(".board-square");
    for (let square of boardSquares) {
      square.textContent = "";
      square.classList.remove("highlight");
    }
    if (resetToPlayer1Boolean === true) {
      GameController.currentPlayer = GameController.setActivePlayer(undefined);
    } else {
      GameController.currentPlayer = GameController.setActivePlayer(GameController.currentPlayer);
    }
    GameUI.gameStatus.textContent = `${GameController.currentPlayer.name}'s turn`;
    _setupClickEvents();
  }
  
  _init();

  return {gameboard, resetBoard}
})();

const GameUI = (() => {
  const gameStatus = document.getElementById("game-status");
  const newGameButton = document.getElementById("new-game");
  
  newGameButton.addEventListener("click", function() {
    Gameboard.resetBoard(true);
    Game.clearGameData();
    document.getElementById("player1-wins").textContent = Game.gameData.player1_wins;
    document.getElementById("player2-wins").textContent = Game.gameData.player2_wins;
    document.getElementById("ties-games").textContent = Game.gameData.tie_games;
  }, false);

  return { gameStatus };
})();

const GameController = (() => {
  const Player = (name, mark) => {
    mark;
    name;
    return { name, mark };
  };

  const setActivePlayer = currentPlayer => {
    let activePlayer;
    if (currentPlayer === undefined) {
      activePlayer = player1;
    } else if ( currentPlayer === player1 ) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
    return activePlayer;
  }

  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = setActivePlayer();

  GameUI.gameStatus.textContent = `${currentPlayer.name}'s turn`;

  return { player1, player2, currentPlayer, setActivePlayer };
})();
