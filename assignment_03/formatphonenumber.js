export function formatPhoneNumber(phoneNumber) {
  let [, digits, misc] = phoneNumber.match(/^(\d*)(\D.*)?$/) || [null, '', ''];
  let formatted;
  if(digits[0] == 1) {
    formatted = '1 ';
    digits = digits.slice(1);
  } else {
    formatted = '';
  }
  if(digits.length <= 3 ) {
    formatted += digits;
  } else if(digits.length <= 7) {
    formatted += digits.slice(0,3) + ' ' + digits.slice(3);
  } else if(digits.length <= 10) {
    formatted += digits.slice(0,3) + ' ' + digits.slice(3,6) + ' ' + digits.slice(6);
  } else {
    formatted += digits.slice(0,3) + ' ' + digits.slice(3,6) + ' ' + digits.slice(6,10) + ' ' + digits.slice(10);
  }

  if(misc) formatted += ' ' + misc;
  return formatted;
}