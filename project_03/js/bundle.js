(function () {
  'use strict';

  class Space {
    constructor(parent, row, col) {
      this.parent = parent;
      this.row = row;
      this.col = col;
      this.$elem = document.createElement('div');
      this.$elem.classList.add('board-space');
      this.value = '';
    }
    highlight() {
      this.$elem.classList.add('highlight');
    }
    unHighlight() {
      this.$elem.classList.remove('highlight');
    }
    setValue(value) {
      this.value = value;
      switch(value) {
        case '':
          this.$elem.classList.remove('x', 'o');
          break;
        case 'x':
          this.$elem.classList.remove('o');
          this.$elem.classList.add('x');
          break;
        case 'o':
          this.$elem.classList.remove('x');
          this.$elem.classList.add('o');
          break;
      }
    }
    highlightWinner() {
      this.$elem.classList.add('winner');
    }
  }

  class BoardDom {
    constructor($elem) {
      this.$elem = $elem;
      this.$elem.classList.add('board');
      this.spaces = [];
      for(let rowIdx = 0; rowIdx < 3; rowIdx++) {
        const $row = document.createElement('div');
        $row.classList.add('board-row');
        this.$elem.appendChild($row);
        for(let colIdx = 0; colIdx < 3; colIdx++) {
          const space = new Space(this, rowIdx, colIdx);
          this.spaces.push(space);
          $row.appendChild(space.$elem);
        }
      }
      const resetPromptWrapper = document.createElement('div');
      resetPromptWrapper.classList.add('board-reset-prompt-wrapper');
      const resetPrompt = document.createElement('div');
      resetPrompt.appendChild(document.createTextNode('Space to reset'));
      resetPrompt.classList.add('board-reset-prompt');
      resetPromptWrapper.appendChild(resetPrompt);
      this.$elem.appendChild(resetPromptWrapper);
      this.timeout = null;
      this.intervalModifier = 1;

      this.onInterval = this.onInterval.bind(this);
      this.promptReset = this.promptReset.bind(this);
      window.addEventListener('keydown', this.onKeydown.bind(this));
      this.reset();
    }
    onInterval() {
      if(this.spaces[this.highlightIndex]) this.spaces[this.highlightIndex].unHighlight();
      if(!this.done) {
        this.highlightIndex = (this.highlightIndex + 1) % 9;
        this.spaces[this.highlightIndex].highlight();
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onInterval, this.interval * this.intervalModifier);
      }
    }
    onKeydown(e) {
      if(e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        if(this.isPrompting) {
          this.reset();
        } else {
          if(this.onSelect) this.onSelect(this.highlightIndex);
        }
        return false;
      }
    }
    renderBoard(board) {
      for(let i = 0; i < 9; i++) {
        this.spaces[i].setValue(board.state[i]);
      }
    }
    highlightWinners(winners) {
      clearTimeout(this.timeout);
      this.timeout = null;
      if(this.spaces[this.highlightIndex]) this.spaces[this.highlightIndex].unHighlight();
      for(let winner of winners) {
        this.spaces[winner].highlightWinner();
      }
      this.$elem.classList.add('winners');
    }
    reset() {
      this.$elem.classList.remove('winners', 'prompting');
      this.isPrompting = false;
      this.interval = 400;
      this.done = false;
      this.isPrompting = false;
      this.highlightIndex = -1;
      for(const space of this.spaces) {
        space.$elem.classList.remove('winner', 'highlight');
        space.setValue('');
      }
      clearTimeout(this.timeout);
      this.timeout = null;
      this.onInterval();
    }
    promptReset() {
      this.isPrompting = true;
      this.$elem.classList.add('prompting');
    }
  }

  /*
   * Adapted from https://github.com/alialaa/js-tic-tac-toe
   */

  /**
    * @desc This class represents the board, contains methods that checks board state, insert a symbol, etc..
    * @param {Array.<string>} state - an array representing the state of the board
  */
  class Board {
      //Initializing the board
      constructor(state = ['','','','','','','','','']) {
          this.state = state;
      }
      //Logs a visualised board with the current state to the console
      printFormattedBoard() {
          let formattedString = '';
          this.state.forEach((cell, index) => {
              formattedString += cell ? ` ${cell} |` : '   |';
              if((index + 1) % 3 == 0)  {
                  formattedString = formattedString.slice(0,-1);
                  if(index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
              }
          });
          console.log('%c' + formattedString, 'color: #6d4e42;font-size:16px');
      }
      //Checks if board has no symbols yet
      isEmpty() {
          return this.state.every(cell => !cell);
      }
      //Check if board has no spaces available
      isFull() {
          return this.state.every(cell => cell);
      }
      /**
       * Inserts a new symbol(x,o) into
       * @param {string} symbol 
       * @param {number} position
       * @return {boolean} boolean represent success of the operation
       */
      insert(symbol, position) {
          if(position > 8 || this.state[position]) return false; //Cell is either occupied or does not exist
          this.state[position] = symbol;
          return true;
      }
      //Returns an array containing available moves for the current state
      getAvailableMoves() {
          const moves = [];
          this.state.forEach((cell, index) => {
              if(!cell) moves.push(index); 
          });
          return moves;
      }
      /**
       * Checks if the board has a terminal state ie. a player wins or the board is full with no winner
       * @return {Object} an object containing the winner, direction of winning and row number
       */
      isTerminal() {
          //Return False if board in empty
          if(this.isEmpty()) return false;

          //Checking Horizontal Wins
          if(this.state[0] == this.state[1] && this.state[0] == this.state[2] && this.state[0]) {
              return {'winner': this.state[0], 'direction': 'H', 'row': 1, 'winners': [0,1,2]};
          }
          if(this.state[3] == this.state[4] && this.state[3] == this.state[5] && this.state[3]) {
              return {'winner': this.state[3], 'direction': 'H', 'row': 2, 'winners': [3,4,5]};
          }
          if(this.state[6] == this.state[7] && this.state[6] == this.state[8] && this.state[6]) {
              return {'winner': this.state[6], 'direction': 'H', 'row': 3, 'winners': [6,7,8]};
          }

          //Checking Vertical Wins
          if(this.state[0] == this.state[3] && this.state[0] == this.state[6] && this.state[0]) {
              return {'winner': this.state[0], 'direction': 'V', 'row': 1, 'winners': [0,3,6]};
          }
          if(this.state[1] == this.state[4] && this.state[1] == this.state[7] && this.state[1]) {
              return {'winner': this.state[1], 'direction': 'V', 'row': 2, 'winners': [1,4,7]};
          }
          if(this.state[2] == this.state[5] && this.state[2] == this.state[8] && this.state[2]) {
              return {'winner': this.state[2], 'direction': 'V', 'row': 3, 'winners': [2,5,8]};
          }

          //Checking Diagonal Wins
          if(this.state[0] == this.state[4] && this.state[0] == this.state[8] && this.state[0]) {
              return {'winner': this.state[0], 'direction': 'D', 'row': 1, 'winners': [0,4,8]};
          }
          if(this.state[2] == this.state[4] && this.state[2] == this.state[6] && this.state[2]) {
              return {'winner': this.state[2], 'direction': 'D', 'row': 2, 'winners': [2,4,6]};
          }

          //If no winner but the board is full, then it's a draw
          if(this.isFull()) {
              return {'winner': 'draw', 'winners': []};
          }
          
          //return false otherwise
          return false;
      }
  }

  /*
   * Adapted from https://github.com/alialaa/js-tic-tac-toe
   */

  /**
    * @desc This class represents the computer player, contains a single method that uses minimax to get the best move
    * @param {number} max_depth - limits the depth of searching
    * @param {Map} nodes_map - stores the heuristic values for each possible move
  */
  class Player {
  	constructor(max_depth = -1) {
          this.max_depth = max_depth;
          this.nodes_map = new Map();
      }
      /**
       * Uses minimax algorithm to get the best move
       * @param {Board} board - an instant of the board class
       * @param {boolean} maximizing - whether the player is a maximizing or a minimizing player
       * @param {function} callback - a function to run after the best move calculation is done
       * @param {number} [depth] - used internally in the function to increment the depth each recursive call
       * @return {number} the index of the best move
       */
  	getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
  		//Throw an error if the first argument is not a board
  		if(board.constructor.name !== "Board") throw('The first argument to the getBestMove method should be an instance of Board class.');
  		//Decides whether to log each tree iteration to the console
  		const TRACE = window.trace_ttt; 
  		//clear nodes_map if the function is called for a new move
  		if(depth == 0) this.nodes_map.clear();

  		//If the board state is a terminal one, return the heuristic value
  		if(board.isTerminal() || depth == this.max_depth ) {
  			if(board.isTerminal().winner == 'x') {
  				return 100 - depth;
  			} else if (board.isTerminal().winner == 'o') {
  				return -100 + depth;
  			} 
  			return 0;
  		}

  		//Defining some styles for console logging
  		const console_styles = {
  			turn_and_available_moves: 'background: #7f3192; color: #fff; font-size:14px;padding: 0 5px;',
  			exploring_parent: 'background: #353535;color: #fff;padding: 0 5px;font-size:18px',
  			exploring_child: 'background: #f03;color: #fff;padding: 0 5px',
  			parent_heuristic: 'background: #26d47c; color: #fff; font-size:14px;padding: 0 5px;',
  			child_heuristic: 'background: #5f9ead; color: #fff; font-size:14px;padding: 0 5px;',
  			all_moves: 'background: #e27a50;color: #fff;padding: 0 5px;font-size:14px',
  			best_move: 'background: #e8602a;color: #fff;padding: 0 5px;font-size:18px'
  		};
  		//Destructuring Styles
  		const {turn_and_available_moves, exploring_parent, exploring_child, child_heuristic, parent_heuristic, all_moves, best_move} = console_styles;

  		//Console Tracing Code
  		if(TRACE) {
  			let p = maximizing ? 'Maximizing' : 'Minimizing';
  			console.log(`%c${p} player's turn Depth: ${depth}`, turn_and_available_moves);
  			console.log(`%cAvailable Moves: ${board.getAvailableMoves().join(' ')}`, turn_and_available_moves);
  			if(depth == 0) board.printFormattedBoard();
  		}

  		//Current player is maximizing
  		if(maximizing) {
  			//Initializ best to the lowest possible value
  			let best = -100;
  			//Loop through all empty cells
  			board.getAvailableMoves().forEach(index => {
  				//Initialize a new board with the current state (slice() is used to create a new array and not modify the original)
  				let child = new Board(board.state.slice());
  				//Create a child node by inserting the maximizing symbol x into the current emoty cell
  				child.insert('x', index);

  				//Console Tracing Code
  				if(TRACE) {
  					let styles = (depth == 0) ? exploring_parent : exploring_child;
  					console.log(`%cExploring move ${index}`, styles);
  					child.printFormattedBoard();
  				}

  				//Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth
  				let node_value = this.getBestMove(child, false, callback, depth + 1);
  				//Updating best value
  				best = Math.max(best, node_value);

  				//Console Tracing Code
  				if(TRACE) {
  					if(depth == 0) {
  						console.log(`%cMove ${index} yielded a heuristic value of ${node_value}`, parent_heuristic);
  					} else {
  						console.log(`%cChild move ${index} yielded a heuristic value of ${node_value}`, child_heuristic);
  					}
  				}
  				
  				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies
  				if(depth == 0) {
  					//Comma seperated indicies if multiple moves have the same heuristic value
  					var moves = this.nodes_map.has(node_value) ? `${this.nodes_map.get(node_value)},${index}` : index;
  					this.nodes_map.set(node_value, moves);
  				}
  			});
  			//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value
  			if(depth == 0) {
  				if(typeof this.nodes_map.get(best) == 'string') {
  					var arr = this.nodes_map.get(best).split(',');
  					var rand = Math.floor(Math.random() * arr.length);
  					var ret = arr[rand];
  				} else {
  					ret = this.nodes_map.get(best);
  				}
  				//Console Tracing Code
  				if(TRACE) {
  					this.nodes_map.forEach((index,value) => {
  						console.log(`%cMove(s) ${index} yielded ${value}`, all_moves);
  					});
  					console.log(`%cMove ${ret} was decided as the best move`, best_move);
  				}
  				//run a callback after calculation and return the index
  				callback(ret);
  				return ret;
  			}
  			//If not main call (recursive) return the heuristic value for next calculation
  			return best;
  		}

  		if(!maximizing) {
  			//Initializ best to the highest possible value
  			let best = 100;
  			//Loop through all empty cells
  			board.getAvailableMoves().forEach(index => {
  				//Initialize a new board with the current state (slice() is used to create a new array and not modify the original)
  				let child = new Board(board.state.slice());
  				//Create a child node by inserting the minimizing symbol o into the current emoty cell
  				child.insert('o', index);

  				//Console Tracing Code
  				if(TRACE) {
  					let styles = (depth == 0) ? exploring_parent : exploring_child; 
  					console.log(`%cExploring move ${index}`, styles);
  					child.printFormattedBoard();
  				}
  			
  				//Recursively calling getBestMove this time with the new board and maximizing turn and incrementing the depth
  				let node_value = this.getBestMove(child, true, callback, depth + 1);
  				//Updating best value
  				best = Math.min(best, node_value);

  				//Console Tracing Code
  				if(TRACE) {
  					if(depth == 0) {
  						console.log(`%cMove ${index} yielded a heuristic value of ${node_value}`, parent_heuristic);
  					} else {
  						console.log(`%cChild move ${index} yielded a heuristic value of ${node_value}`, child_heuristic);
  					}
  				}
  				
  				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies
  				if(depth == 0) {
  					//Comma seperated indicies if multiple moves have the same heuristic value
  					var moves = this.nodes_map.has(node_value) ? this.nodes_map.get(node_value) + ',' + index : index;
  					this.nodes_map.set(node_value, moves);
  				}
  			});
  			//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value
  			if(depth == 0) {
  				if(typeof this.nodes_map.get(best) == 'string') {
  					var arr = this.nodes_map.get(best).split(',');
  					var rand = Math.floor(Math.random() * arr.length);
  					var ret = arr[rand];
  				} else {
  					ret = this.nodes_map.get(best);
  				}
  				//Console Tracing Code
  				if(TRACE) {
  					this.nodes_map.forEach((index,value) => {
  						console.log(`%cMove(s) ${index} yielded ${value}`, all_moves);
  					});
  					console.log(`%cMove ${ret} was decided as the best move`, best_move);
  				}
  				//run a callback after calculation and return the index
  				callback(ret);
  				return ret;
  			}
  			//If not main call (recursive) return the heuristic value for next calculation
  			return best;
  		}

  	}
  }

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

    // this is such a hack, don't do code like this code
    document.querySelector('#controls').addEventListener('click', e => {
      if(e.target.name == 'smartness') {
        ai.max_depth = Number(e.target.value);
      }
      if(e.target.name == 'speed') {
        boardDom.intervalModifier = Number(e.target.value);
      }
      if(e.target.value == 'restart') {
        board = new Board();
        boardDom.reset();
      }

    });

  });

}());
