const STATES = {
  idle: Symbol('STATES.idle'),
  dwell: Symbol('STATES.dwell'),
  success: Symbol('STATES.success'),
};
export class HoverButton {
  constructor(value, onSelect, doReDwell = true) {
    this.$button = document.createElement('div');
    this.$button.classList.add('hover-button');
    this.$button.setAttribute('tabindex', 0);
    this.value = value;
    this.doReDwell = doReDwell;
    this.onSelect = onSelect;
    this.state = STATES.idle;
    this.isHovered = false;
    this.$button.textContent = this.value;

    this.$button.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.state = STATES.dwell;
      this.$button.classList.remove('hb-success');
      this.$button.classList.add('hb-dwell');
    });
    this.$button.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.state = STATES.idle;
      this.$button.classList.remove('hb-success', 'hb-dwell');
    });
    this.$button.addEventListener('animationend', () => {
      if(this.state == STATES.dwell) {
        this.onSelect();
        this.state = STATES.success;
        this.$button.classList.remove('hb-dwell');
        this.$button.classList.add('hb-success');
      } else if(this.state == STATES.success) {
        if(this.isHovered && this.doReDwell) {
          this.state = STATES.dwell;
          this.$button.classList.remove('hb-success');
          this.$button.classList.add('hb-dwell');
        } else {
          this.state = STATES.idle;
          this.$button.classList.remove('hb-dwell', 'hb-success');
        }
      }
    });
    this.$button.addEventListener('click', () => {
      this.onSelect();
      this.state = STATES.success;
      this.isHovered = false; // special case: don't want the dwell to restart here
      this.$button.classList.remove('hb-dwell');
      this.$button.classList.add('hb-success');
    });
  }
}