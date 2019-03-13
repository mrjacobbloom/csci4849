window.addEventListener('load', () => {
  'use strict';

  // Enum for modes
  const M = {
    ROWS: 1,
    COLS: 2,
  };
  let mode = M.ROWS;
  let intervalLength = 500;

  const rows = [...document.querySelectorAll('.calculator_row:not(#display)')];
  let rowIndex = -1;
  let cols = null;
  let colIndex = null;

  let timeout;

  let func = () => {
    if(mode == M.ROWS) {
      if(rows[rowIndex]) rows[rowIndex].classList.remove('active_tabby');
      rowIndex = (rowIndex + 1) % rows.length;
      rows[rowIndex].classList.add('active_tabby');
    } else if(mode == M.COLS) {
      if(cols[colIndex]) cols[colIndex].classList.remove('active_tabby');
      colIndex = (colIndex + 1) % cols.length;
      cols[colIndex].classList.add('active_tabby');
    }
    timeout = window.setTimeout(func, intervalLength);
  };

  window.addEventListener('keypress', e => {
    e.preventDefault();
    e.stopPropagation();
    window.clearTimeout(timeout);
    if(mode == M.ROWS) {
      rows[rowIndex].classList.remove('active_tabby');
      rows[rowIndex].classList.add('mom_tabby');
      cols = [...rows[rowIndex].children, rows[rowIndex]];
      colIndex = -1;
      mode = M.COLS;
    } else if(mode == M.COLS) {
      rows[rowIndex].classList.remove('mom_tabby');
      if(cols[colIndex] == rows[rowIndex]) {
      } else {
        cols[colIndex].click();
        cols[colIndex].classList.remove('active_tabby');
      }
      rowIndex--;
      cols = colIndex = null;
      mode = M.ROWS;
    }
    func();
    return false;
  });

  func();

});