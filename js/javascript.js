const Game = (() => {
  let gameData = {
    current_player: null,
    player1_wins: 0,
    player2_wins: 0
  };

  const clearGameData = gameData => {
    gameData = {};
  }

})();

const GameController = (() => {
  const Player = mark => {
    let playerMark = mark;
    return { playerMark };
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

  const player1 = Player("X");
  const player2 = Player("O");
  let currentPlayer = setActivePlayer();


  return { player1, player2, currentPlayer, setActivePlayer };
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const _checkForWinner = (clickedSquareNum, currentPlayerMark) => {
    console.log("Checking for winner…");
    console.log(clickedSquareNum);
    const winCons = [
      // Rows
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      // Columns
      [0, 3, 6], [1, 4, 8], [2, 5, 8],
      // Diagonal
      [0, 4, 8], [2, 4, 6],
    ];

                        // First, filter all of the win cons down to an array of *possible* win cons based on these win con arrays containing the clicked square's number. We do this using `filter`, `includes`, and the clicked square's number…
    const winConFound = winCons.filter(winCon => winCon.includes(clickedSquareNum))
                        // Then, look through each possible win con array passed to us from the `filter` method using `some`. We use `some` instead of `forEach` here because once `some` returns true, it stops, whereas `forEach` would just keep going…
                        .some(possibleWinCon => 
                          // *Inside* of `some` we use `every` because we want to check every index of the gameboard array, but only at the current win con's indices. As we look at these specific indicies, we want to make sure all 3 contain the current player's mark. If they do, `every` returns true and stops, which causes `some` to return true and stop — because the expression inside of `some` is indeed true — which passes true to the variable `winConFound`.
                          possibleWinCon.every(index => gameboard[index] === currentPlayerMark));
    console.log(winConFound);
    return winConFound;
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
      console.log("Already has text");
      return;
    }

    let currentPlayerMark = GameController.currentPlayer.playerMark;
    let clickedSquareNum = parseInt(clickedEl.getAttribute("data-square"));
    gameboard[clickedEl.getAttribute("data-square")] = currentPlayerMark;
    clickedEl.appendChild(_createSquareText(currentPlayerMark));

    const winnerFound = _checkForWinner(clickedSquareNum, currentPlayerMark);
    // Since a winner is found, pass true to the _render method and prevent further clicks
    _render(winnerFound);
    
    GameController.currentPlayer = GameController.setActivePlayer(GameController.currentPlayer);
  }

  const _render = (winnerFound) => {
    const boardSquares = document.querySelectorAll(".board-square");
    if (winnerFound) {
      for (let square of boardSquares) {
        square.removeEventListener("click", _clickSquare, false);
      }
    }
    else {
      for (let square of boardSquares) {
        square.addEventListener("click", _clickSquare, false);
      }
    }
  }

  _render();
  console.log("Game initialized!");

  return {gameboard}
})();