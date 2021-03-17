const Game = (() => {
  let gameData = {
    current_player: null,
    player1_wins: 0,
    player2_wins: 0,
    tie_games: 0,
    game_mode: null
  };

  const clearGameData = () => {
    Game.gameData = {
      current_player: null,
      player1_wins: 0,
      player2_wins: 0,
      tie_games: 0,
      game_mode: null
    };
  }

  console.log("Game initialized!");

  return { gameData, clearGameData }
})();

const Gameboard = (() => {

  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const _checkForWinner = (clickedSquareNum, currentPlayerMark) => {
    const winCons = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
      [0, 4, 8], [2, 4, 6] // Diagonal
    ];

    const possibleWinCons = winCons.filter(winCon => winCon.includes(clickedSquareNum));
    const winConFound = possibleWinCons.some(possibleWinCon => possibleWinCon.every(index => gameboard[index] === currentPlayerMark));
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
      document.getElementById("tie-games").textContent = Game.gameData.tie_games;
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

  const init = () => {
    _setupClickEvents();
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
  
  // _init();

  return { gameboard, resetBoard, init }
})();

const GameUI = (() => {
  const gameStatus = document.getElementById("game-status");
  const newGameBtn = document.getElementById("new-game-btn");
  const startGameBtn = document.getElementById("start-game-btn");
  const onePlayerGameBtn = document.getElementById("one-player-game-btn");
  const twoPlayerGameBtn = document.getElementById("two-player-game-btn");
  const header = document.getElementById("header");
  const main = document.getElementById("main");

  const player1NameWrapper = document.getElementById("player1-name-wrapper");
  const player2NameWrapper = document.getElementById("player2-name-wrapper");
  const player1Name = document.getElementById("player1-name");
  const player2Name = document.getElementById("player2-name");

  const player1TallyTitle = document.getElementById("player1-tally-title");
  const player2TallyTitle = document.getElementById("player2-tally-title");
  const player1Wins = document.getElementById("player1-wins");
  const player2Wins = document.getElementById("player2-wins");
  const tieGames = document.getElementById("tie-games");

  const _checkForPlayerNames = () => {
    if (GameUI.player1Name.value.trim() !== "") {
      GameController.player1.name = GameUI.player1Name.value;
    }
    if (GameUI.player2Name.value.trim() !== "") {
      GameController.player2.name = GameUI.player2Name.value;
    }
  }

  const _initGameUI = () => {
    player1TallyTitle.textContent = GameController.player1.name + ": ";
    player2TallyTitle.textContent = GameController.player2.name + ": ";
    player1Wins.textContent = Game.gameData.player1_wins;
    player2Wins.textContent = Game.gameData.player2_wins;
    tieGames.textContent = Game.gameData.tie_games;
    gameStatus.textContent = GameController.currentPlayer.name + "'s turn";
    Gameboard.init();
  }

  startGameBtn.addEventListener("click", function() {
    _checkForPlayerNames();
    _initGameUI();
    header.classList.remove("hidden");
    main.classList.remove("hidden");
  }, false);

  document.addEventListener("click", function(e) {
    if (e.target === newGameBtn || e.target === onePlayerGameBtn || e.target === twoPlayerGameBtn) {
      Gameboard.resetBoard(true);
      Game.clearGameData();
      player1NameWrapper.classList.add("hidden");
      player2NameWrapper.classList.add("hidden");
      GameController.player1.name = "Player 1";
      GameController.player2.name = "Player 2";
      player1Name.value = null;
      player2Name.value = null;
      startGameBtn.disabled = true;
      _initGameUI();
      
      if (e.target === onePlayerGameBtn) {
        e.target === onePlayerGameBtn ? Game.gameData.game_mode = "1 player" : null;
        GameController.player2.name = "Computer";
        player1NameWrapper.classList.remove("hidden");
      }
      if (e.target === twoPlayerGameBtn) {
        e.target === twoPlayerGameBtn ? Game.gameData.game_mode = "2 player" : null;
        player1NameWrapper.classList.remove("hidden");
        player2NameWrapper.classList.remove("hidden");
      }
    }
  }, false);

  document.addEventListener("input", function(e) {
    if (Game.gameData.game_mode == "2 player" && player1Name.value.length !== 0 && player2Name.value.length !== 0) {
      startGameBtn.removeAttribute("disabled");
    } else if (Game.gameData.game_mode == "1 player" && player1Name.value.length !== 0) {
      startGameBtn.removeAttribute("disabled");
    } else if (e.target === player1Name || e.target === player2Name) {
      startGameBtn.disabled = true;
    }
  });

  return { gameStatus, player1Name, player2Name};
})();

const GameController = (() => {
  const Player = (name, mark) => {
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
