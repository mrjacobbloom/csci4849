const SPACE = Symbol('SPACE'),
      DEL = Symbol('DEL'),
      SUBMIT = Symbol('SUBMIT');
const QWERTY = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  [DEL, SPACE, SUBMIT]
];
const STATES = {
  idle: Symbol('STATES.idle'),
  dwell: Symbol('STATES.dwell'),
  success: Symbol('STATES.success'),
};
class Key {
  constructor(keyId, onType, onBackspace, onSubmit) {
    this.$button = document.createElement('div');
    this.$button.classList.add('keyboard-key');
    this.$button.setAttribute('tabindex', 0);
    this.keyId = keyId;
    this.onType = onType;
    this.onBackspace = onBackspace;
    this.onSubmit = onSubmit;
    this.state = STATES.idle;
    this.isHovered = false;
    switch(this.keyId) {
      case SPACE:
        this.$button.classList.add('keyboard-key-space');
        this.$button.textContent = '\u00a0';
        break;
      case DEL:
        this.$button.textContent = 'delete';
        break;
      case SUBMIT:
        this.$button.textContent = 'speak';
        break;
      default:
        this.$button.textContent = keyId;
    }
    this.$button.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.state = STATES.dwell;
      this.$button.classList.remove('success');
      this.$button.classList.add('dwell');
    });
    this.$button.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.state = STATES.idle;
      this.$button.classList.remove('success', 'dwell');
    });
    this.$button.addEventListener('animationend', () => {
      if(this.state == STATES.dwell) {
        this.onSelect();
        this.state = STATES.success;
        this.$button.classList.remove('dwell');
        this.$button.classList.add('success');
      } else if(this.state == STATES.success) {
        if(this.isHovered) {
          this.state = STATES.dwell;
          this.$button.classList.remove('success');
          this.$button.classList.add('dwell');
        } else {
          this.state = STATES.idle;
          this.$button.classList.remove('dwell', 'success');
        }
      }
    });
    this.$button.addEventListener('click', () => {
      this.onSelect();
      this.state = STATES.success;
      this.isHovered = false; // special case: don't want the dwell to restart here
      this.$button.classList.remove('dwell');
      this.$button.classList.add('success');
    });
  }
  onSelect() {
    switch(this.keyId) {
      case SPACE:
        this.onType(' ');
        break;
      case DEL:
        this.onBackspace();
        break;
      case SUBMIT:
        this.onSubmit();
        break;
      default:
        this.onType(this.keyId);
    }
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
    this.onSubmit = () => {
      onSubmit(this.value); this.value = '';
    };
    for(const rowData of QWERTY) {
      const row = new KeyboardRow(rowData, this.onType, this.onBackspace, this.onSubmit);
      this.rows.push(row);
      this.$container.appendChild(row.$row);
    }
  }
}