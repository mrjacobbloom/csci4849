import {formatPhoneNumber} from './formatphonenumber.js';

export class Contact {
  constructor(contactList, firstName, lastName, phone, email) {
    this.contactList = contactList;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;

    this._needsRerender = true;
    this._rendered = null;
  }
  render() { // I should really be using a templating engine or something, this is terrible
    if(this._rendered && !this._needsRerender) return this._rendered;
    this._needsRerender = false;

    this._rendered = document.createElement('div');
    this._rendered.classList.add('contact_card');

    const userIcon = document.createElement('i');
    userIcon.classList.add('fas', 'fa-user-circle', 'contact_card_user_icon');
    this._rendered.appendChild(userIcon)
    
    const nameArea = document.createElement('h2');
    nameArea.classList.add('contact_card_name');
    nameArea.appendChild(document.createTextNode(`${this.firstName} ${this.lastName}`));
    this._rendered.appendChild(nameArea);


    const meansOfContact = document.createElement('div');
    meansOfContact.classList.add('contact_card_meansofcontact_list')
    this._rendered.appendChild(meansOfContact);

    const phone = document.createElement('a');
    phone.href = '#';
    phone.classList.add('contact_card_meansofcontact');
    const phoneIcon = document.createElement('i');
    phoneIcon.classList.add('fas', 'fa-phone');
    phone.appendChild(phoneIcon)
    phone.appendChild(document.createTextNode(formatPhoneNumber(this.phone)));
    meansOfContact.appendChild(phone);
    phone.addEventListener('click', () => {
      this.contactList.callContact(this);
    });

    const email = document.createElement('a');
    email.href = '#';
    email.classList.add('contact_card_meansofcontact');
    const emailIcon = document.createElement('i');
    emailIcon.classList.add('fas', 'fa-envelope');
    email.appendChild(emailIcon)
    email.appendChild(document.createTextNode(this.email));
    meansOfContact.appendChild(email);


    return this._rendered;
  }
}

export class ContactList {
  constructor(phone) {
    this.phone = phone;
    this.$container = document.querySelector('#tabcontent_contacts');
    this.contacts = [
      new Contact(this, 'Jon', 'Doe', '12345678900', 'Jon.Doe@mailinator.mom'),
      new Contact(this, 'Jane', 'Doe', '0987654321', 'Jane.Doe@failinator.nep'),
      new Contact(this, 'Empire', 'Today', '8005882300', '8005882300@empire.today'),
    ];
  }
  render() {
    while(this.$container.firstChild) this.$container.firstChild.remove(); // empty $container
    this.contacts.sort((a,b) => {
      if(a.lastName == b.lastName) {
        if(a.firstName == b.firstName) {
          return 0;
        } else {
          return a.firstName < b.firstName ? -1 : 1;
        }
      } else {
        return a.lastName < b.lastName ? -1 : 1;
      }
    });
    for(const contact of this.contacts) {
      this.$container.appendChild(contact.render());
    }
  }
  callContact(contact) {
    this.phone.tabber.setActive(0);
    this.phone.dialer.setValue(contact.phone);
  }
}