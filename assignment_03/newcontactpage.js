export class NewContactPage {
  constructor(phone) {
    this.phone = phone;
    const btns = [...document.querySelectorAll('#tabcontent_newcontact .dialer_button')];
    this.$save = btns[0];
    this.$cancel = btns[1];
    this.$firstName = document.querySelector('#newcontact_firstName');
    this.$lastName = document.querySelector('#newcontact_lastName');
    this.$phone = document.querySelector('#newcontact_phone');
    this.$email = document.querySelector('#newcontact_email');
    this.$save.addEventListener('click', this.addContact.bind(this))
    this.$cancel.addEventListener('click', this.clear.bind(this));

    this.phone.registerKeyBinding('Enter', this.addContact.bind(this), 2);
    this.phone.describeKeyBinding('Enter', 'Add contact', 2);

    this.phone.registerKeyBinding('Escape', this.clear.bind(this), 2);
    this.phone.registerKeyBinding('Backspace', this.clear.bind(this), 2);
    this.phone.registerKeyBinding('Delete', this.clear.bind(this), 2);
    this.phone.describeKeyBinding('Esc\nBackspace\nDelete', 'Clear', 2);
  }
  addContact() {
    this.phone.contactlist.contacts.push(new this.phone.Contact(this.phone.contactlist, this.$firstName.value, this.$lastName.value, this.$phone.value, this.$email.value));
    this.phone.contactlist.render();
    this.phone.tabber.setActive(1);
    this.clear();
  }
  clear() {
    this.$firstName.value = this.$lastName.value = this.$phone.value = this.$email.value = '';
  }
}