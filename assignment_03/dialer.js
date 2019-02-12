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
  constructor(phone) {
    this._phone = phone;
    this.$inputbox = document.querySelector('#dialer_inputbox');
    this._value = '';
    const $buttons = [...document.querySelectorAll('#tabcontent_dialer .dialer_button')];
    this.buttons = $buttons.map($button => new Button($button, this))

    this._phone.registerKeyBinding('Digit1', () => this.append('1'), 0);
    this._phone.registerKeyBinding('Digit2', () => this.append('2'), 0);
    this._phone.registerKeyBinding('Digit3', () => this.append('3'), 0);
    this._phone.registerKeyBinding('Digit4', () => this.append('4'), 0);
    this._phone.registerKeyBinding('Digit5', () => this.append('5'), 0);
    this._phone.registerKeyBinding('Digit6', () => this.append('6'), 0);
    this._phone.registerKeyBinding('Digit7', () => this.append('7'), 0);
    this._phone.registerKeyBinding('Digit8', () => this.append('8'), 0);
    this._phone.registerKeyBinding('Digit9', () => this.append('9'), 0);
    this._phone.registerKeyBinding('Digit0', () => this.append('0'), 0);
    this._phone.describeKeyBinding('0-9', 'Dial a digit', 0);

    this._phone.registerKeyBinding('Digit3', () => this.append('#'), 0, {shift: true});
    this._phone.describeKeyBinding('# (Shift+3)', 'Dial pound sign', 0);
    this._phone.registerKeyBinding('Digit8', () => this.append('*'), 0, {shift: true});
    this._phone.describeKeyBinding('* (Shift+8)', 'Dial star', 0);

    this._phone.registerKeyBinding('Enter', () => this.setValue(CONNECTING), 0);
    this._phone.registerKeyBinding('Space', () => this.setValue(CONNECTING), 0);
    this._phone.describeKeyBinding('Space\nEnter', 'Call', 0);

    this._phone.registerKeyBinding('Backspace', () => this.setValue(''), 0);
    this._phone.registerKeyBinding('Delete', () => this.setValue(''), 0);
    this._phone.describeKeyBinding('Backspace\nDelete', 'Clear dialer', 0);
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