
const $earthInterpretButton = document.querySelector('#earth-interpret--button');
const $marsInterpretButton = document.querySelector('#mars-interpret--button');
const $earthInput = document.querySelector('#earth--input');
const $marsInput = document.querySelector('#mars--input');
const $earthInfo = document.querySelector('#earth--info');
const $marsInfo = document.querySelector('#mars--info');
const $send2earthButton = document.querySelector('#send-to-earth--button');
const $send2marsButton = document.querySelector('#send-to-mars--button');

$earthInterpretButton.addEventListener('click', interpretor);
$marsInterpretButton.addEventListener('click', interpretor);
$earthInput.addEventListener('keyup', immiInterpretor);
$marsInput.addEventListener('keyup', immiInterpretor);
$send2marsButton.addEventListener('click', send2mars);
$send2earthButton.addEventListener('click', send2earth);

function immiInterpretor(e) {
  const isEarthInput = () => e.target.id === 'earth--input';
  const isMarsInput = () => e.target.id === 'mars--input';
  if (isEarthInput()) $earthInfo.value = str2hex(e.target.value);
  if (isMarsInput()) $marsInfo.value = str2hex(e.target.value);
}

function interpretor(e) {
  const isEarthInterpretButton = () => e.target.id === 'earth-interpret--button';
  const isMarsInterpretButton = () => e.target.id === 'mars-interpret--button';
  if (isEarthInterpretButton()) $earthInfo.value = hex2str($earthInfo.value);
  if (isMarsInterpretButton()) $marsInfo.value = hex2str($marsInfo.value);
}

function str2hex(str) {
  return str
    .split('')
    .map((el) => el.charCodeAt(0).toString(16))
    .join(' ');
}

function hex2str(hex) {
  return hex
    .split(' ')
    .map((el) => String.fromCharCode(parseInt(el, 16)))
    .join('');
}

function sendMessage() {}

function send2mars() {
  return moveArrow($earthInfo.value);
}
function moveArrow(value) {
  setHexData(value);
}

function setHexData(value) {
  $marsInfo.value = value;
}

function send2earth() {}

let helloHex = str2hex('hello');

console.log(`test hex: ${helloHex}`);
console.log(`test str: ${hex2str(helloHex)}`);

// ===== 여기는 지구 =====

// 1. 지구에서 메세지가 발신된다.
// 2. 메세지가 작성될 때, INFO에 변환 메세지가 나타난다.
//  ( 화성에서 화살표가 잘 작동하는지 보기 위해서 )

// ===== 여기는 화성 =====

// <수신모드>
// 1. 5초(혹은 더 짧게?)마다 메세지를 송신한다.
// 2. 메세지가 있으면 큐에 담는다.
//    2-1. 없으면 다시
// 3. 큐에 담긴 메세지를 하나씩 화살표에 전달한다.
//    3-1. 전달된 메세지는 큐에서 삭제
// 4. 화살표가 2초마다 hex-code를 가리킨다.
//    4-1. 배경이 깜빡거리는 애니메이션이 발생한다.
//    4-2. 글씨도 반전된다.
//    4-3. 화살표에도 애니메이션이 있다.
//    4-4. 화살표는 가까운 방향으로 회전한다.
// 5. 화살표가 hex-code를 가리킬 때, INFO에 글자가 나타난다.
// 6. 송신이 완료되고 (if promise가 5초간 펜딩이면) Interpret 버튼을 활성화시킨다.
// 7. 버튼을 누르면 해석이 된다.

// <발신모드>
// 8. input에 메세지가 입력되면 info에 실시간으로 해석된다.
// 9. 버튼을 누르면 화살표가 2초간격으로 메세지를 가리킨다.
// 10. 화살표가 메세지를 가리킬때 지구의 INFO에 문자가 바로 출력된다.
// 11. Interpret하면 해석한다.

class RaccoonPromise {
  constructor() {
    this.status = {
      PENDING: 'pending',
      FULFILLED: 'fulfilled',
      REJECTED: 'rejected',
    };
  }
  resolve() {
    console.log('내가 해냈어!!!');
  }

  reject() {
    console.log('미안하지만 이번엔 실패야...');
  }

  then() {
    console.log('자! 다음은 뭐지?!');
  }

  catch() {
    console.log('너의 실패 이유다!');
  }
}
