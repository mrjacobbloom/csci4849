export class ToneSlider {
  constructor($container, onChange) {
    this.$container = $container;
    this._onChange = onChange;
    this.$track = document.createElement('div');
    this.$track.classList.add('tone-track');
    this.$container.appendChild(this.$track);
    this.$thumb = document.createElement('div');
    this.$thumb.classList.add('tone-thumb');
    this.$thumb.appendChild(document.createTextNode('TONE'));
    this.$track.appendChild(this.$thumb);
    this.height = this.$container.getBoundingClientRect().height;
    this.$container.addEventListener('resize', () => {
      this.height = this.$container.getBoundingClientRect().height;
    });
    this.$buttons = document.createElement('div');
    this.$buttons.classList.add('tone-buttons');
    this.$container.appendChild(this.$buttons);

    this.$container.addEventListener('mousemove', e => {
      const frac = e.offsetY/this.height;
      this.$container.style.setProperty('--frac', frac);
      this._onChange(1 - frac);
    });
  }
  setOnChangeCallback(cb) {
    this._onChange = cb;
  }
  addButton(button) {
    this.$buttons.appendChild(button.$button);
  }
}