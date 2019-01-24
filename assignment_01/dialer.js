import {formatPhoneNumber} from './formatphonenumber.js';
const CONNECTING = 'Connecting...';

class Button {
  constructor($button, dialer) {
    this.$button = $button;
    this.dialer = dialer;
    this.value = this.$button.dataset.value;
    this.$button.addEventListener('click', e => {
      if(this.value == 'dial') {
        this.dialer.setValue(CONNECTING);
      } else if(this.value == 'clear') {
        this.dialer.setValue('');
      } else {
        this.dialer.append(this.value);
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    })
  }
}
export class Dialer {
  constructor() {
    this.$inputbox = document.querySelector('#dialer_inputbox');
    this._value = '';
    const $buttons = [...document.querySelectorAll('#tabcontent_dialer .dialer_button')];
    this.buttons = $buttons.map($button => new Button($button, this))
  }
  getValue() {
    return this._value;
  }
  setValue(value) {
    this._value = value;
    this._formatValue();
    this.$inputbox.innerHTML = '&nbsp;' + this._formatted;
  }
  append(value) {
    if(this._value == CONNECTING) {
      this.setValue(value);
    } else {
      this.setValue(this._value + value);
    }
  }
  _formatValue() {
    if(!this._value || this._value == CONNECTING) {
      this._formatted = this._value
      return;
    }
    this._formatted = formatPhoneNumber(this._value);
  }
}