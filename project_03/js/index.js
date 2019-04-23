import BoardDom from './BoardDom.js';
import Board from './Board.js';
import Player from './Player.js';

window.addEventListener('load', () => {
  let board = new Board();
  const ai = new Player(1);

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
        setTimeout(boardDom.promptReset, 350);
      }
    } else {
      boardDom.interval *= 0.7;
    }
    if(boardDom.interval < 60) boardDom.interval = 80;
  };
  boardDom.onReset = () => {
    board = new Board();
  };

  // this is such a hack, don't do code like this code
  document.querySelector('#controls').addEventListener('click', e => {
    if(e.target.name == 'smartness') {
      ai.max_depth = Number(e.target.value);
    }
    if(e.target.name == 'speed') {
      boardDom.intervalModifier = Number(e.target.value);
    }
    if(e.target.value == 'restart') {
      boardDom.reset();
    }

  })

});