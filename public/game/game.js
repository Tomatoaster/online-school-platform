function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'gold';
  ctx.lineWidth = 4;
  ctx.stroke();
}

let canvas;
let canvasContext;

let timeout;
let running = false;
let answerTime = false;
let totalPoints = 0;
let roundNr = 0;

const imgs = [
  '/public/img/c1.jpg',
  '/public/img/c2.webp',
  '/public/img/c3.jpg',
  '/public/img/c4.jpg',
  '/public/img/c5.jpg',
  '/public/img/c6.jpg',
  'https://e1.pxfuel.com/desktop-wallpaper/826/289/desktop-wallpaper-2015-chevrolet-corvette-z06-corvette-zo6.jpg',
  '/public/img/c8.jpg',
];

function endGame() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.font = '70px Gill Sans';
  canvasContext.fillStyle = 'white';
  canvasContext.fillText('GAME OVER', 565, 280);

  canvasContext.font = '50px Gill Sans';
  canvasContext.fillStyle = 'gold';
  canvasContext.fillText(`Score: ${totalPoints}`, 666, 350);
}

let offsetX;
let offsetY;
function showImage() {
  roundNr++;
  canvasContext.clearRect(0, 50, canvas.width, canvas.height);
  canvasContext.clearRect(0, 0, 500, canvas.height);

  const img = new Image();
  img.src = imgs[Math.floor(Math.random() * 7.9)];
  offsetX = Math.random() * 800 + 50;
  offsetY = Math.random() * 340 + 50;
  img.onload = () => canvasContext.drawImage(img, offsetX, offsetY, 100, 180);
  setTimeout(() => {
    canvasContext.clearRect(0, 50, canvas.width, canvas.height);
    answerTime = true;
  }, timeout);
}

function clickTarget(evt) {
  if (!answerTime) {
    return;
  }

  answerTime = false;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const xPos = (evt.clientX - rect.left) * scaleX;
  const yPos = (evt.clientY - rect.top) * scaleY;
  const xTarget = offsetX + 50;
  const yTarget = offsetY + 90;

  drawLine(canvasContext, xPos, yPos, xTarget, yTarget);
  const newPoints = Math.floor(Math.max(1000 - Math.sqrt((xPos - xTarget) ** 2 + (yPos - yTarget) ** 2), 0));
  totalPoints += newPoints;
  canvasContext.font = '40px Gill Sans';

  canvasContext.clearRect(0, 0, canvas.width, 50);

  canvasContext.fillStyle = 'green';
  canvasContext.fillText(`+${newPoints}`, 0, 40);
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(`${totalPoints}`, 1430, 40);
  if (roundNr < 10) {
    setTimeout(() => showImage(), 1500);
  } else {
    setTimeout(() => endGame(), 1500);
  }
}

function difficultyHandler(ind, button) {
  if (running) {
    return;
  }

  button.style.color = 'gold';
  console.log(`Game started\nDifficulty: ${ind}`);
  switch (ind) {
    case 0: {
      timeout = 500;
      break;
    }
    case 1: {
      timeout = 250;
      break;
    }
    case 2: {
      timeout = 150;
      break;
    }
    default:
  }
  running = true;
  showImage();
}

window.onload = () => {
  canvas = document.getElementById('gameframe');
  canvas.width = 1536;
  canvas.height = 605;
  canvasContext = canvas.getContext('2d');

  canvas.addEventListener('click', clickTarget);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.font = '70px Gill Sans';
  canvasContext.fillStyle = 'gold';
  canvasContext.fillText('Choose Difficulty!', 500, 300);

  const diffArray = Array.from(document.getElementsByClassName('difficulty'));
  for (let i = 0; i < diffArray.length; i++) {
    diffArray[i].addEventListener('click', () => difficultyHandler(i, diffArray[i]));
  }
};
