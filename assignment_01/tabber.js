class Tab {
  constructor($tab, tabber) {
    this.$tab = $tab;
    this.tabber = tabber;
    const id = `#tabcontent_${$tab.dataset.tabcontent}`;
    this.$content = document.querySelector(id);

    this.$tab.setAttribute('role', 'tab')
    this.$tab.setAttribute('aria-controls', id);
    this.$content.setAttribute('role', 'tabpanel');

    // @todo there's one more we should be using, aria-labelledby
    // skipped for now since the tabs don't have an ID attr

    this.$tab.addEventListener('click', e => {
      tabber.setActive(this);

      e.preventDefault();
      e.stopPropagation();
      return false;
    })
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
  constructor() {
    const $tabs = [...document.querySelectorAll('.tab')];
    this.tabs = $tabs.map($tab => new Tab($tab, this));

    this.setActive(this.tabs[0]);
  }
  setActive(activeTab) {
    if(typeof activeTab == 'number') activeTab = this.tabs[activeTab];
    for(const tab of this.tabs) {
      if(activeTab == tab) {
        tab.setActive();
      } else {
        tab.setInactive();
      }
    }
  }
}