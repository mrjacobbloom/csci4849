import {Tabber} from './tabber.js';
import {Dialer} from './dialer.js';
import {ContactList, Contact} from './contactlist.js';

class Phone {
  constructor() {
    this.tabber = new Tabber(this);
    this.dialer = new Dialer(this);
    this.contactlist = new ContactList(this);
    this.contactlist.render();

    this.initNewContactPage();
  }
  initNewContactPage() {
    const [$save, $cancel] = [...document.querySelectorAll('#tabcontent_newcontact .dialer_button')];
    const $firstName = document.querySelector('#newcontact_firstName');
    const $lastName = document.querySelector('#newcontact_lastName');
    const $phone = document.querySelector('#newcontact_phone');
    const $email = document.querySelector('#newcontact_email');
    const clear = () => {
      $firstName.value = $lastName.value = $phone.value = $email.value = '';
    };
    $save.addEventListener('click', () => {
      this.contactlist.contacts.push(new Contact(this.contactlist, $firstName.value, $lastName.value, $phone.value, $email.value));
      this.contactlist.render();
      this.tabber.setActive(1);
      clear();
    })
    $cancel.addEventListener('click', () => {
      this.tabber.setActive(1);
      clear();
    });
  }
}

window.addEventListener('load', () => {
  new Phone();
});