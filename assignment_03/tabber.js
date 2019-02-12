class Tab {
  constructor($tab, index, tabber) {
    this.$tab = $tab;
    this.tabber = tabber;
    this.index = index;
    this.name = this.$tab.textContent.trim();
    const id = `#tabcontent_${$tab.dataset.tabcontent}`;
    this.$content = document.querySelector(id);

    this.$tab.setAttribute('role', 'tab')
    this.$tab.setAttribute('aria-controls', id);
    this.$content.setAttribute('role', 'tabpanel');

    this.tabber._phone.registerKeyBinding(`Digit${this.index + 1}`, () => this.tabber.setActive(this), null, {ctrl: true});

    // @todo there's one more we should be using, aria-labelledby
    // skipped for now since the tabs don't have an ID attr

    this.$tab.addEventListener('click', e => {
      tabber.setActive(this);

      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
  setActive() {
    this.$tab.classList.add('active');
    this.$content.classList.add('active');
    this.$tab.setAttribute('aria-selected', 'true');
    this.$content.setAttribute('aria-hidden', 'false');
  }
  setInactive() {
    this.$tab.classList.remove('active');
    this.$content.classList.remove('active');
    this.$tab.setAttribute('aria-selected', 'false');
    this.$content.setAttribute('aria-hidden', 'true');
  }
}

export class Tabber {
  constructor(phone) {
    this._phone = phone;
    const $tabs = [...document.querySelectorAll('.tab')];
    this.tabs = $tabs.map(($tab, index) => new Tab($tab, index, this));

    this._phone.describeKeyBinding('CTRL + 1-4', 'Switch to tab 1-4');

    this.setActive(0);
  }
  setActive(activeTab) {
    if(typeof activeTab == 'number') {
      this.activeID = activeTab;
      activeTab = this.tabs[activeTab];
    } else {
      this.activeID = this.tabs.indexOf(activeTab);
    }
    for(const tab of this.tabs) {
      if(activeTab == tab) {
        tab.setActive();
      } else {
        tab.setInactive();
      }
    }
  }
}