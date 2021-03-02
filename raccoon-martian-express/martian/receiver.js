const raccoon = 'hello';

const raccoonArr = raccoon.split('');

const test = raccoon.split('')[0].charCodeAt(0);
const test2 = raccoon.split('').map((el) => el.charCodeAt(0));
const dec = raccoon.split('').map((el) => el.charCodeAt(0));

const hex = dec.map((el) => el.toString(16));
const hex2 = dec.map((el) => String.fromCharCode(el));

console.log(hex);
console.log(hex2);
