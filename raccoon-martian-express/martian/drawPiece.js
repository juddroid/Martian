const $roulette = document.querySelector('#roulette');

const hexCode = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

function drawPiece() {
  let pieceDiv = ``;
  for (let i = 0; i < hexCode.length; i++) {
    pieceDiv += `
    <div class="piece-${i}">
      <span class="hex-code hex-${hexCode[i]}">${hexCode[i]}</span>
    </div>
    `;
  }
  return $roulette.insertAdjacentHTML('beforeend', pieceDiv);
}

drawPiece();