import {Tabber} from './tabber.js';
import {Dialer} from './dialer.js';
import {ContactList, Contact} from './contactlist.js';
import {NewContactPage} from './newcontactpage.js';
import {Help} from './help.js';

class Phone {
  constructor() {
    this._keyBindingMap = new Map();
    this.keyBindingDescriptions = {};

    this.tabber = new Tabber(this);
    this.dialer = new Dialer(this);
    this.contactlist = new ContactList(this);
    this.contactlist.render();
    this.Contact = Contact;
    this.newcontactpage = new NewContactPage(this);

    this.help = new Help(this);

    window.addEventListener('keydown', e => {
      if(e.code == 'Enter' && e.target.matches('a, button')) return;
      console.log(e.code);
      let matchFound = false;
      let codeList = this._keyBindingMap.get(e.code);
      if(codeList) {
        for(let binding of codeList) {
          if((binding.limitedToTab === null || binding.limitedToTab === this.tabber.activeID)
          && Boolean(binding.modifierKeys.shift) == e.shiftKey
          && Boolean(binding.modifierKeys.ctrl) == (e.metaKey || e.ctrlKey)) {
            matchFound = true;
            binding.callback();
          }
        }
      }
      if(matchFound) e.preventDefault();
    });
  }
  registerKeyBinding(code, callback, limitedToTab = null, modifierKeys = {}) {
    if(!this._keyBindingMap.has(code)) {
      this._keyBindingMap.set(code, []);
    }
    this._keyBindingMap.get(code).push({
      modifierKeys, limitedToTab, callback
    });
  }
  describeKeyBinding(binding, description, tab = 'GLOBAL') {
    if(!this.keyBindingDescriptions[tab]) this.keyBindingDescriptions[tab] = [];
    this.keyBindingDescriptions[tab].push([binding, description]);
  }
}

window.addEventListener('load', () => {
  new Phone();
});