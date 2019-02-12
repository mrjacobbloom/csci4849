import {formatPhoneNumber} from './formatphonenumber.js';

export class Contact {
  constructor(contactList, firstName, lastName, phone, email) {
    this.contactList = contactList;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;

    this._rendered = null;
  }
  render() { // I should really be using a templating engine or something, this is terrible
    if(this._rendered) return this._rendered;

    const tr = document.createElement('tr');
    tr.classList.add('contact_card');

    tr.appendChild(this.renderTD('user_icon', document.createElement('img')));

    tr.appendChild(this.renderTD('first_name', this.firstName));
    tr.appendChild(this.renderTD('last_name', this.lastName));

    tr.appendChild(this.renderMOC(formatPhoneNumber(this.phone), true));
    tr.appendChild(this.renderMOC(this.email));

    this._rendered = tr;
    this.requestPhoto();
    return this._rendered;
  }
  renderMOC(data, isPhone = false) {
    const moc = document.createElement('a');
    moc.setAttribute('href', '#');
    moc.classList.add('contact_card_meansofcontact_link');
    const icon = document.createElement('i');
    icon.classList.add('fas', isPhone ? 'fa-phone' : 'fa-envelope');
    icon.setAttribute('aria-hidden', 'true');
    moc.appendChild(icon);
    moc.appendChild(document.createTextNode(data));
    if(isPhone) {
      moc.addEventListener('click', () => {
        this.contactList.callContact(this);
      });
  };
    return this.renderTD('meansofcontact', moc);
  }
  renderTD(className, content) {
    const td = document.createElement('td');
    td.classList.add(`contact_card_${className}`);
    if(typeof content == 'string') {
      content = document.createTextNode(content);
    }
    td.appendChild(content);
    return td;
  }
  requestPhoto() {
    fetch(`https://api.thecatapi.com/v1/images/search?pleasenocache=${Math.random()}`)
      .then(res => res.json())
      .then(res => {
        const img = this._rendered.querySelector('.contact_card_user_icon img');
        img.setAttribute('alt', `Contact photo for ${this.firstName} ${this.lastName}`);
        img.setAttribute('src', res[0].url);
      });
  }
}

export class ContactList {
  constructor(phone) {
    this.phone = phone;
    this.$tbody = document.querySelector('#contacts_tbody');
    this.contacts = [
      new Contact(this, 'Jon', 'Doe', '12345678900', 'Jon.Doe@mailinator.mom'),
      new Contact(this, 'Jane', 'Doe', '0987654321', 'Jane.Doe@failinator.nep'),
      new Contact(this, 'Empire', 'Today', '8005882300', '8005882300@empire.today'),
    ];
  }
  render() {
    while(this.$tbody.firstChild) this.$tbody.firstChild.remove(); // empty $tbody
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
      this.$tbody.appendChild(contact.render());
    }
  }
  callContact(contact) {
    this.phone.tabber.setActive(0);
    this.phone.dialer.setValue(contact.phone);
  }
}