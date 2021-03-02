// module: we only need one, so it's wrapped in an IIFE *that starts at the anonymous function's parameters*
const Game = (() => {
  // factory function: we need more than one instance so it's *NOT* wrapped in an IIFE
  const _Player = mark => {
    let playerMark = mark;
    return { playerMark };
  };

  // module: we only need one, so it's wrapped in an IIFE *that starts at the anonymous function's parameters*
  const Gameboard = (() => {
    let gameboard = [];

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
      } else { 
        gameboard.push({
          "square": clickedEl.getAttribute("data-square"),
          "value": currentPlayer.playerMark
        });
        clickedEl.appendChild(_createSquareText(currentPlayer.playerMark));
      }
      _render();
      currentPlayer = _setActivePlayer(currentPlayer);
    }

    const _render = () => {
      const boardSquares = document.querySelectorAll(".board-square");
      for (let square of boardSquares) {
        square.addEventListener("click", _clickSquare, false);
      }
      console.log(gameboard);
    }

    const _setActivePlayer = currentPlayer => {
      let activePlayer;
      if (currentPlayer === undefined) {
        console.log(`Starting activePlayer is undefined`);
        activePlayer = player1;
      } else if ( currentPlayer === player1 ) {
        console.log(`Starting activePlayer = ${currentPlayer.playerMark}`);
        activePlayer = player2;
      } else {
        console.log(`Starting activePlayer = ${currentPlayer.playerMark}`);
        activePlayer = player1;
      }
      console.log(`Ending activePlayer = ${activePlayer.playerMark}`);
      return activePlayer;
    }

    const player1 = _Player("X");
    const player2 = _Player("O");

    _render();
    let currentPlayer = _setActivePlayer();
    console.log("Game initialized!");

    return {gameboard}
  })();

  // return everything we want accessible in the public scope and nothing else
  return {Gameboard};
})();