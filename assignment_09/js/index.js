import { Keyboard } from './keyboard.js';

window.addEventListener('load', () => {
  const $display = document.querySelector('#display');
  const keyboard = new Keyboard(document.querySelector('#keyboard'), val => $display.textContent = val, () => $display.textContent = '');
});