const $earthInterpretButton = document.querySelector('#earth-interpret--button');
const $marsInterpretButton = document.querySelector('#mars-interpret--button');
const $earthInput = document.querySelector('#earth--input');
const $marsInput = document.querySelector('#mars--input');
const $earthInfo = document.querySelector('#earth--info');
const $marsInfo = document.querySelector('#mars--info');
const $send2earthButton = document.querySelector('#send-to-earth--button');
const $send2marsButton = document.querySelector('#send-to-mars--button');
const $arrow = document.querySelector('.arrow-circle');
const $roulette = document.querySelector('.roulette');

const MARS = 'mars';
const EARTH = 'earth';

const colorSet = {
  blue: '#0d6efd',
  indigo: '#6610f2',
  purple: '#6f42c1',
  pink: '#d63384',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  green: '#198754',
  teal: '#20c997',
  cyan: '#0dcaf0',
  gray: '#6c757d',
  grayDark: '#343a40',
  primary: '#0d6efd',
  secondary: '#6c757d',
  success: '#198754',
  info: '#0dcaf0',
  warning: '#ffc107',
  danger: '#dc3545',
  dark: '#212529',
};

$earthInterpretButton.addEventListener('click', interpretor);
$marsInterpretButton.addEventListener('click', interpretor);
$earthInput.addEventListener('keyup', immiInterpretor);
$marsInput.addEventListener('keyup', immiInterpretor);
$earthInput.addEventListener('click', initInput);
$marsInput.addEventListener('click', initInput);
$send2marsButton.addEventListener('click', send2mars);
$send2earthButton.addEventListener('click', send2earth);

// Send to Mars 버튼을 누르면 여기에 데이터가 저장된다.
// 이걸 서버에 저장할 수 있나...
let hexQueue = [];
let receiver;
let arrowStatus = false;

function initInput(e) {
  if (e.currentTarget.value.length > 0) e.currentTarget.value = '';
}

function immiInterpretor(e) {
  const isEarthInput = () => e.target.id === 'earth--input';
  const isMarsInput = () => e.target.id === 'mars--input';
  if (isEarthInput()) $earthInfo.value = str2hex(e.target.value);
  if (isMarsInput()) $marsInfo.value = str2hex(e.target.value);
}

function interpretor(e) {
  const isEarthInterpretButton = () => e.target.id === 'earth-interpret--button';
  const isMarsInterpretButton = () => e.target.id === 'mars-interpret--button';
  if (isEarthInterpretButton()) {
    $earthInfo.value = hex2str($earthInfo.value);
    $earthInterpretButton.disabled = true;
    $send2earthButton.disabled = false;
  }
  if (isMarsInterpretButton()) {
    $marsInfo.value = hex2str($marsInfo.value);
    $marsInterpretButton.disabled = true;
    $send2marsButton.disabled = false;
  }
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

function initDom(dom) {
  if (arrowStatus) return;
  if (dom.value.length > 0) dom.value = '';
}

function setHexQueue() {
  let queue = [];
  $earthInfo.value.split('').forEach((el) => queue.push(el));
  hexQueue.push(queue);
  return hexQueue;
}

function isEmpty(arr) {
  return arr.length === 0;
}

function messageReceiver() {
  return new Promise((resolve) => {
    resolve(hexQueue);
  }).then((data) => {
    if (isEmpty(data)) return;
    moveArrow(EARTH, data);
  });
}

function startReceiver() {
  // console.log('start receiver');
  if (receiver) stopReceiver();
  receiver = setInterval(messageReceiver, 5000);
}

function stopReceiver() {
  // console.log('stop receiver');
  clearInterval(receiver);
}

startReceiver();

function send2mars() {
  setHexQueue();
  $send2marsButton.disabled = true;
  initDom($marsInfo);
  return;
}

function send2earth() {
  initDom($earthInfo);
  $send2earthButton.disabled = true;
  return moveArrow(MARS, [$marsInfo.value.split('')]);
}

function moveArrow(planet, valueArr) {
  const inputHexOnMars = (str) => ($marsInfo.value += str);
  const inputHexOnEarth = (str) => ($earthInfo.value += str);
  const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const hexCode = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  let piece = 360 / hexCode.length;

  let arr = Array.prototype.slice.call(valueArr[0]); // 배열복사

  hexQueue.shift();
  console.log(hexQueue);
  (async () => {
    for (let el of arr) {
      arrowStatus = true;
      await delay(); // 아.. 얘가 '기다려~' 하는 애라서 await이네...
      // await은 promise를 기다린다. from DD
      let idx = hexCode.indexOf(el);
      if (idx === -1) {
        spaceAnimation();
      } else {
        let rotateDeg = (piece * idx * 2) / 2 + 10; // 보정
        arrowAnimation(rotateDeg);
        pieceAnamation(idx);
      }

      // 여긴 못빼고있다.....
      // ...아...
      setTimeout(() => {
        if (planet === EARTH) inputHexOnMars(el);
        if (planet === MARS) inputHexOnEarth(el);
      }, 1000);
    }
    if (planet === EARTH) $marsInterpretButton.disabled = false;
    if (planet === MARS) $earthInterpretButton.disabled = false;

    arrowStatus = false;
  })();
}

function spaceAnimation() {
  $arrow.style.background = `${Object.values(colorSet)[Math.floor(Math.random() * (Object.values(colorSet).length - 0) + 0)]}`;
  $arrow.style.transition = `1s ease-in-out`;
  setTimeout(() => {
    $arrow.removeAttribute('style');
    $arrow.style.transition = `1s ease-in-out`;
  }, 1000);
}

function arrowAnimation(deg) {
  $arrow.style.transform = `rotate(${deg}deg)`;
  $arrow.style.transition = `1s ease-in-out`;
}

function pieceAnamation(i) {
  setTimeout(() => {
    $roulette.querySelector(`.piece-${i}`).style.borderTopColor = `${Object.values(colorSet)[i]}`;
    $roulette.querySelector(`.piece-${i}`).style.opacity = `50%`;
    $roulette.querySelector(`.piece-${i}`).style.transition = `1s ease-in-out`;
  }, 500);
  setTimeout(() => {
    $roulette.querySelector(`.piece-${i}`).removeAttribute('style');
    $roulette.querySelector(`.piece-${i}`).style.transition = `1s ease-in-out`;
  }, 1000);
}

// ===== 여기는 지구 =====

// v 1. 지구에서 메세지가 발신된다.
// v 2. 메세지가 작성될 때, INFO에 변환 메세지가 나타난다.
//   ( 화성에서 화살표가 잘 작동하는지 보기 위해서 )

// ===== 여기는 화성 =====

// <수신모드>
// 1. 5초(혹은 더 짧게?)마다 메세지를 송신한다.
// 2. 메세지가 있으면 큐에 담는다.
//    2-1. 없으면 다시
// 3. 큐에 담긴 메세지를 하나씩 화살표에 전달한다.
//    3-1. 전달된 메세지는 큐에서 삭제
//v 4. 화살표가 2초마다 hex-code를 가리킨다.
//   v 4-1. 배경이 깜빡거리는 애니메이션이 발생한다.
//   v 4-2. 글씨도 반전된다.
//   v 4-3. 화살표에도 애니메이션이 있다.
//   v 4-4. 화살표는 가까운 방향으로 회전한다.
// v 5. 화살표가 hex-code를 가리킬 때, INFO에 글자가 나타난다.
// 6. 송신이 완료되고 (if promise가 5초간 펜딩이면) Interpret 버튼을 활성화시킨다.
// v 7. 버튼을 누르면 해석이 된다.

// <발신모드>
// v 8. input에 메세지가 입력되면 info에 실시간으로 해석된다.
// v 9. 버튼을 누르면 화살표가 2초간격으로 메세지를 가리킨다.
// v 10. 화살표가 메세지를 가리킬때 지구의 INFO에 문자가 바로 출력된다.
// v 11. Interpret하면 해석한다.

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
