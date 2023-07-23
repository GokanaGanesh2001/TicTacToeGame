const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const difficultySelect = document.getElementById('difficulty');
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let aiDifficulty = 2;

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === player)
    );
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function makeMove(row, col) {
    if (board[row * 3 + col] === '' && !isGameOver) {
        board[row * 3 + col] = currentPlayer;
        cells[row * 3 + col].textContent = currentPlayer;

        if (checkWin(currentPlayer)) {
        if (currentPlayer === 'X') {
            statusElement.innerHTML = `<span class="win-message human-win">${currentPlayer} wins!</span>`;
        } else {
            statusElement.innerHTML = `<span class="win-message ai-win">${currentPlayer} wins!</span>`;
        }
        isGameOver = true;
    } else if (checkDraw()) {
        statusElement.innerHTML = `<span class="draw">It's a draw!</span>`;
        isGameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.innerHTML = `<span class="turn-message">${currentPlayer}'s turn</span>`;

        if (currentPlayer === 'O' && aiDifficulty > 1) {
            makeAIMove();
        }
    }
}
}

function makeAIMove() {
    // AI logic for making a move
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    if (checkWin('O')) {
        statusElement.textContent = "AI wins!";
        isGameOver = true;
    } else if (checkDraw()) {
        statusElement.textContent = "It's a draw!";
        isGameOver = true;
    } else {
        currentPlayer = 'X';
        statusElement.textContent = `${currentPlayer}'s turn`;
    }
}

function minimax(board, depth, isMaximizingPlayer) {
    if (checkWin('O')) {
        return 10 - depth;
    } else if (checkWin('X')) {
        return depth - 10;
    } else if (checkDraw()) {
        return 0;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}

function changeDifficulty() {
    aiDifficulty = parseInt(difficultySelect.value);
    resetGame();
}

function resetGame() {
    board.fill('');
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    isGameOver = false;
    statusElement.textContent = "X's turn";
  statusElement.classList.remove('win-message', 'human-win', 'ai-win', 'draw');
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        makeMove(row, col);
    });
});

difficultySelect.addEventListener('change', changeDifficulty);

document.getElementById('humanVsAIButton').addEventListener('click', () => {
    aiDifficulty = parseInt(difficultySelect.value);
    currentPlayer = 'X';
    resetGame();
});

document.getElementById('humanVsHumanButton').addEventListener('click', () => {
    aiDifficulty = 0;
    currentPlayer = 'X';
    resetGame();
});
