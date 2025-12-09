const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turnIndicator');
const humanScoreDisplay = document.getElementById('humanScore');
const aiScoreDisplay = document.getElementById('aiScore');
const drawScoreDisplay = document.getElementById('drawScore');

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
const humanPlayer = 'X';
const aiPlayer = 'O';

let humanScore = 0;
let aiScore = 0;
let drawScore = 0;

const winningConditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (board[index] !== '' || !gameActive) return;

  makeMove(index, humanPlayer);

  if (gameActive) {
    const bestMove = getBestMove();
    makeMove(bestMove, aiPlayer);
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add('filled');

  if (checkWinner(player, true)) {
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    alert('Draw!');
    drawScore++;
    updateScore();
    gameActive = false;
    return;
  }

  if (player === humanPlayer) {
    turnIndicator.textContent = `AI's turn: ${aiPlayer}`;
  } else {
    turnIndicator.textContent = `Your turn: ${humanPlayer}`;
  }
}

function checkWinner(player, highlight = false) {
  let won = false;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      won = true;
      if (highlight) {
        cells[a].classList.add('win');
        cells[b].classList.add('win');
        cells[c].classList.add('win');
      }
      break;
    }
  }

  if (won) {
    alert(player + ' wins!');
    if (player === humanPlayer) humanScore++;
    else aiScore++;
    updateScore();
  }

  return won;
}

function updateScore() {
  humanScoreDisplay.textContent = `X: ${humanScore}`;
  aiScoreDisplay.textContent = `O: ${aiScore}`;
  drawScoreDisplay.textContent = `Draws: ${drawScore}`;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((v,i) => v === '' ? i : null).filter(v => v !== null);

  if (checkWin(newBoard, humanPlayer)) return {score: -10};
  if (checkWin(newBoard, aiPlayer)) return {score: 10};
  if (availSpots.length === 0) return {score: 0};

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) {
      const result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  return bestMove;
}

function getBestMove() {
  return minimax(board, aiPlayer).index;
}

function checkWin(boardState, player) {
  return winningConditions.some(condition => {
    const [a, b, c] = condition;
    return boardState[a] === player && boardState[b] === player && boardState[c] === player;
  });
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('filled', 'win');
  });
gameActive = true;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('resetBtn').addEventListener('click', resetGame);