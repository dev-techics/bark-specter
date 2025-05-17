// useful functions
function isEmailMatch(masked, real) {
  let pattern = masked.replace(/([.+?^${}()|\[\]\\])/g, '\\$1');
  pattern = pattern.replace(/\*/g, '.');
  const regex = new RegExp('^' + pattern + '$', 'i');
  return regex.test(real);
}

function isPhoneMatch(maskedPhone, realPhone) {
  let cleanMasked = maskedPhone.replace(/\s+/g, '');
  let pattern = cleanMasked.replace(/([.+?^${}()|\[\]\\])/g, '\\$1');
  pattern = pattern.replace(/\*/g, '.');
  const regex = new RegExp('^' + pattern + '$');
  console.log(realPhone)
  return regex.test(realPhone);
return false;
}
