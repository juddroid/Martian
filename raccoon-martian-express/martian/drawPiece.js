const $roulette = document.querySelector('#roulette');
const PIECE = 16;
// const colorSet = {
//   blue: '#0d6efd',
//   indigo: '#6610f2',
//   purple: '#6f42c1',
//   pink: '#d63384',
//   red: '#dc3545',
//   orange: '#fd7e14',
//   yellow: '#ffc107',
//   green: '#198754',
//   teal: '#20c997',
//   cyan: '#0dcaf0',
//   white: '#fff',
//   gray: '#6c757d',
//   grayDark: '#343a40',
//   primary: '#0d6efd',
//   secondary: '#6c757d',
//   success: '#198754',
//   info: '#0dcaf0',
//   warning: '#ffc107',
//   danger: '#dc3545',
//   light: '#f8f9fa',
//   dark: '#212529',
// };
const hexCode = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

function drawPeice() {
  let peiceDiv = ``;
  for (let i = 0; i < PIECE; i++) {
    peiceDiv += `
    <div class="peice-${i}">
      <span class="hex-code hex-${hexCode[i]}">${hexCode[i]}</span>
    </div>
    `;
  }
  return $roulette.insertAdjacentHTML('beforeend', peiceDiv);
}

drawPeice();
