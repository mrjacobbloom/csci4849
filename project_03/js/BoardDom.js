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
    const resetPromptWrapper = document.createElement('div');
    resetPromptWrapper.classList.add('board-reset-prompt-wrapper');
    const resetPrompt = document.createElement('div');
    resetPrompt.appendChild(document.createTextNode('Space to reset'))
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