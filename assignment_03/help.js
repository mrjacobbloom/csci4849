export class Help {
  constructor(phone) {
    this.phone = phone;
    this.$container = document.querySelector('#keyboard_shortcuts');

    this.phone.registerKeyBinding('Slash', () => this.phone.tabber.setActive(3), null, {shift: true});
    this.phone.describeKeyBinding('? (Shift+/)', 'Help');

    this.$container.innerHTML = this.generateTables();
  }
  generateTables() {
    let out = this.generateTable(this.phone.keyBindingDescriptions['GLOBAL']);
    for(let i = 0; i < this.phone.tabber.tabs.length; i++) { // say that 10 times fast
      if(!this.phone.keyBindingDescriptions[i]) continue;
      let tab = this.phone.tabber.tabs[i];
      out += `<h3>Tab ${i + 1}: ${tab.name}</h3>`;
      out += this.generateTable(this.phone.keyBindingDescriptions[i]);
    }
    return out;
  }
  generateTable(descriptions) {
    let out = `
    <table>
      <thead>
        <tr>
          <th>Shortcut</th>
          <th>Decription</th>
        </tr>
      </thead>
      <tbody>
        `;
    for(let [s, description] of descriptions) {
      let shortcuts = s.split('\n');
      for(let i = 0; i < shortcuts.length; i++) {
        out += `  <tr>
          <td>${shortcuts[i]}</td>
      `;
        if(i == 0) out += `<td rowspan="${shortcuts.length}">${description}</td>`;
        out += `</tr>`;
      }
    }


    out += `</tbody>
    </table>`;
    return out;
  }
}