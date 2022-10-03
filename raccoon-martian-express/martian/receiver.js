import {dom} from './dom'
import {name, url} from './const'
import {color} from './color'

const {MARS, EARTH} = name
const {BASE_PATH} = url
const {
  $earthInterpretButton,
  $marsInterpretButton,
  $earthInput,
  $marsInput,
  $earthInfo,
  $marsInfo,
  $send2earthButton,
  $send2marsButton,
  $arrow,
  $roulette
} = dom

$earthInterpretButton.addEventListener('click', interpretor);
$marsInterpretButton.addEventListener('click', interpretor);
$earthInput.addEventListener('keyup', immiInterpretor);
$marsInput.addEventListener('keyup', immiInterpretor);
$earthInput.addEventListener('click', initInput);
$marsInput.addEventListener('click', initInput);
$send2marsButton.addEventListener('click', send2mars);
$send2earthButton.addEventListener('click', send2earth);

let messageQueue = [];
let receiver = null;
let currentPlanet = MARS;
let status = null;
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

function setMessageQueue() {
  const dom = currentPlanet === MARS ? $marsInfo : $earthInfo
  let queue = [];
  dom.value.split('').forEach((el) => queue.push(el));
  messageQueue.push(queue);
  return messageQueue;
}

function isEmpty(arr) {
  return arr.length === 0;
}

async function messageReceiver() {
  return await fetch(`${BASE_PATH}/receiver`)
    .then((res) => res.json())
    .then(({data}) => {
      if (!data) return
      messageQueue.push(data)
      moveArrow(currentPlanet)
    })
    .catch((err) => {
      console.error(err)
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
  currentPlanet = EARTH;
  initDom($marsInfo);
  $send2marsButton.disabled = true;
  setMessage().then((res) => {
    if (res.code === 200) {
    }
  }).catch((err) => console.error(err))
  return;
}

function send2earth() {
  currentPlanet = MARS;
  initDom($earthInfo);
  $send2earthButton.disabled = true;
  setMessage().then((res) => {
    if (res.code === 200) {
    }
  }).catch((err) => console.error(err))
  return;
}

async function setMessage() {
  const dom = currentPlanet === MARS ? $marsInput : $earthInput
  const {value} = dom
  return await fetch(`${BASE_PATH}/receiver`, {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({data: value})
  })
}

function moveArrow(planet) {

  const inputHexOnMars = (str) => ($marsInfo.value += str);
  const inputHexOnEarth = (str) => ($earthInfo.value += str);
  const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const hexCode = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  let piece = 360 / hexCode.length;

  const message = messageQueue.shift()
  const hex = str2hex(message);
  console.log(hex)
  const hexList = hex.split('');

  $send2earthButton.disabled = true;
  $send2marsButton.disabled = true;

  (async () => {
    for (let el of hexList) {
      arrowStatus = true;
      await delay();

      let idx = hexCode.indexOf(el);
      if (idx === -1) {
        spaceAnimation();
      } else {

        let rotateDeg = (piece * idx * 2) / 2 + 10; // 보정
        arrowAnimation(rotateDeg);
        pieceAnimation(idx);
      }

        setTimeout(() => {
          if (planet === EARTH) inputHexOnMars(el);
          if (planet === MARS) inputHexOnEarth(el);
        }, 1000);

    }
    if (planet === EARTH) $marsInterpretButton.disabled = false;
    if (planet === MARS) $earthInterpretButton.disabled = false;

    $send2earthButton.disabled = false;
    $send2marsButton.disabled = false;
    arrowStatus = false;
  })();
}

function spaceAnimation() {
  $arrow.style.opacity = '50%';
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

function pieceAnimation(i) {
  setTimeout(() => {
    $roulette.querySelector(`.piece-${i}`).style.borderTopColor = `${Object.values(color)[i]}`;
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

