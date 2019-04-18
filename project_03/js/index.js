import BoardDom from './BoardDom.js';
import Board from './Board.js';
import Player from './Player.js';

window.addEventListener('load', () => {
  let board = new Board();
  const ai = new Player();

  const boardDom = new BoardDom(document.querySelector('#board'));
  boardDom.onSelect = spaceIdx => {
    if(board.insert('x', spaceIdx)) { // returns t/f whether that move was legal
      boardDom.interval *= 0.85;
      board.insert('o', ai.getBestMove(board));
      boardDom.renderBoard(board);
      let terminal;
      if(terminal = board.isTerminal()) {
        boardDom.done = true;
        boardDom.highlightWinners(terminal.winners);
      }
    } else {
      boardDom.interval *= 0.7;
    }
    if(boardDom.interval < 60) boardDom.interval = 60;
  };

});