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

export default class BoardDom {
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

    this.interval = 400;
    this.highlightIndex = -1;
    this.onInterval = this.onInterval.bind(this);
    this.onInterval();

    this.done = false;
    window.addEventListener('keydown', this.onKeydown.bind(this));
  }
  onInterval() {
    if(this.spaces[this.highlightIndex]) this.spaces[this.highlightIndex].unHighlight();
    if(!this.done) {
      this.highlightIndex = (this.highlightIndex + 1) % 9;
      this.spaces[this.highlightIndex].highlight();
      setTimeout(this.onInterval, this.interval);
    }
  }
  onKeydown(e) {
    if(e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if(this.onSelect) this.onSelect(this.highlightIndex);
      return false;
    }
  }
  renderBoard(board) {
    for(let i = 0; i < 9; i++) {
      this.spaces[i].setValue(board.state[i]);
    }
  }
  highlightWinners(winners) {
    for(let winner of winners) {
      this.spaces[winner].highlightWinner();
    }
    this.$elem.classList.add('winners');
  }
}