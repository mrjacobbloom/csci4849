import { HoverButton } from './hover-button.js';

const SPACE = Symbol('SPACE'),
      DEL = Symbol('DEL'),
      SUBMIT = Symbol('SUBMIT');
const QWERTY = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  [DEL, SPACE, SUBMIT]
];
class Key extends HoverButton {
  constructor(keyId, onType, onBackspace, onSubmit) {
    let value, onSelect;
    switch(keyId) {
      case SPACE:
        value = '\u00a0';
        onSelect = () => onType(' ')
        break;
      case DEL:
        value = 'delete';
        onSelect = onBackspace;
        break;
      case SUBMIT:
        value = 'speak';
        onSelect = onSubmit;
        break;
      default:
        value = keyId;
        onSelect = () => onType(keyId);
    }
    super(value, onSelect);
    this.$button.classList.add('keyboard-key');
    if(keyId == SPACE) this.$button.classList.add('keyboard-key-space');
  }
}
class KeyboardRow {
  constructor(rowData, onType, onBackspace, onSubmit) {
    this.$row = document.createElement('div');
    this.$row.classList.add('keyboard-row');
    this.keys = [];
    this.onType = onType;
    this.onBackspace = onBackspace;
    this.onSubmit = onSubmit;
    for(const keyId of rowData) {
      const key = new Key(keyId, this.onType, this.onBackspace, this.onSubmit);
      this.keys.push(key);
      this.$row.appendChild(key.$button);
    }
  }
}
export class Keyboard {
  constructor($container, onChange, onSubmit) {
    this.$container = $container;
    this.rows = [];
    this.value = '';
    this.onType = l => {
      this.value += l;
      onChange(this.value);
    };
    this.onBackspace = () => {
      this.value = this.value.slice(0, this.value.length-1);
      onChange(this.value);
    };
    this._submitCallback = onSubmit;
    this.onSubmit = () => {
      this._submitCallback(this.value);
      this.value = '';
    };
    for(const rowData of QWERTY) {
      const row = new KeyboardRow(rowData, this.onType, this.onBackspace, this.onSubmit);
      this.rows.push(row);
      this.$container.appendChild(row.$row);
    }
  }
  setSubmitCallback(cb) {
    this._submitCallback = cb;
  }
}