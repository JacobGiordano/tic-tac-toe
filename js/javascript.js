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
    let squares = GameUI.boardSquares;
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
    Gameboard.gameboard = gameboard;

    const winnerFound = _checkForWinner(clickedSquareNum, currentPlayerMark);
    if (winnerFound == true) {
      _setupClickEvents(winnerFound);
      GameUI.gameStatus.textContent = `${GameController.currentPlayer.name} wins!`;
      if (GameController.currentPlayer.mark === "X"){
        Game.gameData.player1_wins++;
        GameUI.player1Wins.textContent = Game.gameData.player1_wins;
        GameUI.player1Wins.closest(".tally-wrapper").classList.add("flash-text");
        const removeFlash = setInterval(() => {
          GameUI.player1Wins.closest(".tally-wrapper").classList.remove("flash-text");
          clearInterval(removeFlash);
        }, 1500);
      } else {
        Game.gameData.player2_wins++;
        GameUI.player2Wins.textContent = Game.gameData.player2_wins;
        GameUI.player2Wins.closest(".tally-wrapper").classList.add("flash-text");
        const removeFlash = setInterval(() => {
          GameUI.player2Wins.closest(".tally-wrapper").classList.remove("flash-text");
          clearInterval(removeFlash);
        }, 1500);
      }
      GameUI.boardMsg.classList.remove("opacity-0");
    } else if (winnerFound == "tie") {
      _setupClickEvents(winnerFound);
      GameUI.gameStatus.textContent = "Tie game!";
      Game.gameData.tie_games++;
      GameUI.tieGames.textContent = Game.gameData.tie_games;
      GameUI.tieGames.closest(".tally-wrapper").classList.add("flash-text");
      const removeFlash = setInterval(() => {
        GameUI.tieGames.closest(".tally-wrapper").classList.remove("flash-text");
        clearInterval(removeFlash);
      }, 1500);
      GameUI.boardMsg.classList.remove("opacity-0");
    } else {
      GameController.currentPlayer = GameController.setActivePlayer(GameController.currentPlayer);
      GameUI.gameStatus.textContent = `${GameController.currentPlayer.name}'s turn`;
    }
  }

  const _setupClickEvents = winner => {
    if (winner) {
      for (let square of GameUI.boardSquares) {
        square.removeEventListener("click", _clickSquare, false);
        square.addEventListener("click", resetBoard, false);
      }
    }
    else if (!winner || winner === "tie") {
      for (let square of GameUI.boardSquares) {
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
    for (let square of GameUI.boardSquares) {
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
    GameUI.boardMsg.classList.add("opacity-0");
  }

  return { gameboard, resetBoard, init }
})();

const GameUI = (() => {
  const innerWrapper = document.getElementById("device__inner-wrapper");
  const gameStatus = document.getElementById("game-status");
  const newGameBtn = document.getElementById("new-game-btn");
  const startGameBtn = document.getElementById("start-game-btn");
  const onePlayerGameBtn = document.getElementById("one-player-game-btn");
  const twoPlayerGameBtn = document.getElementById("two-player-game-btn");
  
  const startScreen = document.getElementById("start-screen");
  const playerNamesForm = document.getElementById("player-names-form");
  const player1NameWrapper = document.getElementById("player1-name-wrapper");
  const player2NameWrapper = document.getElementById("player2-name-wrapper");
  const player1Name = document.getElementById("player1-name");
  const player2Name = document.getElementById("player2-name");
  const playScreen = document.getElementById("play-screen");

  const player1TallyTitle = document.getElementById("player1-tally-title");
  const player2TallyTitle = document.getElementById("player2-tally-title");
  const player1Wins = document.getElementById("player1-wins");
  const player2Wins = document.getElementById("player2-wins");
  const tieGames = document.getElementById("tie-games");

  const boardMsg = document.getElementById("board-msg");
  const boardSquares = document.querySelectorAll(".board-square");

  const _checkForPlayerNames = () => {
    if (GameUI.player1Name.value.trim() !== "") {
      GameController.player1.name = GameUI.player1Name.value;
    }
    if (GameUI.player2Name.value.trim() !== "") {
      GameController.player2.name = GameUI.player2Name.value;
    }
  }

  const handleInnerShift = () => {
    if (innerWrapper.classList.contains("initial") || innerWrapper.classList.contains("unshift")) {
      innerWrapper.classList.add("shift");
      innerWrapper.classList.remove("initial");
      innerWrapper.classList.remove("unshift");
      startScreen.classList.add("hide");
      startScreen.classList.remove("show");
      playScreen.classList.add("show");
      playScreen.classList.remove("hide");
    } else {
      
      innerWrapper.classList.add("unshift");
      innerWrapper.classList.remove("shift");
      startScreen.classList.add("show");
      startScreen.classList.remove("hide");
      playScreen.classList.add("hide");
      playScreen.classList.remove("show");
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

  playerNamesForm.addEventListener("submit", function(e) {
    e.preventDefault();
    _checkForPlayerNames();
    _initGameUI();

    handleInnerShift();

    for (let i=0; i < boardSquares.length; i++) {
      let squareRevealDelay = setInterval(function() {
        boardSquares[i].classList.add("reveal");
        clearInterval(squareRevealDelay);
      }, i * 100);
      squareRevealDelay;
    }

  }, false);

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("material-icons")) {
      e.target.closest(".btn").click();
      return;
    }
    if (e.target === newGameBtn || e.target === onePlayerGameBtn || e.target === twoPlayerGameBtn) {
      Gameboard.resetBoard(true);
      Game.clearGameData();
      GameController.player1.name = "Player 1";
      GameController.player2.name = "Player 2";
      player1Name.value = null;
      player2Name.value = null;
      startGameBtn.disabled = true;

        if (e.target === newGameBtn) {
          handleInnerShift();
          player1NameWrapper.classList.add("hidden");
          player2NameWrapper.classList.add("hidden");
        }
      
      for (let square of boardSquares) {
        square.classList.contains("reveal") ? square.classList.remove("reveal") : null;
      }
      _initGameUI();
      
      if (e.target === onePlayerGameBtn) {
        e.target === onePlayerGameBtn ? Game.gameData.game_mode = "1 player" : null;
        GameController.player2.name = "Computer";
        player1NameWrapper.classList.remove("hidden");
        player2NameWrapper.classList.add("hidden");
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

  startScreen.classList.add("show");

  return { gameStatus, player1Name, player2Name, player1Wins, player2Wins, tieGames, boardMsg, boardSquares };
})();

const GameController = (() => {
  const Player = (name, mark) => {
    return { name, mark };
  };

  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const computerPlay = () => {
    const computerDelay = setTimeout(function() {
      let availableSquares = [];
      let gameboardData = document.querySelectorAll(".board-square");
      gameboardData.forEach((element, index) => {
        if (element.textContent === "") {
          availableSquares.push(index);
        }
      });
      let randomSelection = getRandomIntInclusive(0, availableSquares.length - 1);
      const selection = availableSquares[randomSelection];
      const targetSquare = document.querySelector('[data-square="' + selection + '"]');
      if (targetSquare.textContent === "") {
        targetSquare.click();
      } else {
        console.log("Game error. Computer attempted to click an already populated square: " + selection);
      }
      clearTimeout(computerDelay);
    }, 750);
    computerDelay;
  }

  const setActivePlayer = currentPlayer => {
    let activePlayer;
    if (currentPlayer === undefined) {
      activePlayer = player1;
    } else if ( currentPlayer === player1 ) {
      activePlayer = player2;
      Game.gameData.game_mode === "1 player" ? computerPlay(Gameboard.gameboard) : null;
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
