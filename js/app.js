const difficultyDiv = document.getElementById('difficulty');
const gameDiv = document.getElementById('game');
const restartBtn = document.getElementById('restart');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const messageDisplay = document.getElementById('message');
const characterImg = document.getElementById('character-img');
const hammerImg = document.getElementById('hammer-img');
const cookies = document.querySelectorAll('.cookie');
const darkBtn = document.getElementById('light/dark');
const body = document.body;
const music = document.getElementById('background-music');
const playMusicBtn = document.getElementById('play-music-btn');
const backButton = document.getElementById('back-button');

let difficulty = 'easy';
let timer;
let time = 90;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentCookieIndex = 0;
let currentAnswer = null;
const totalCookies = cookies.length;

function initGame() {
    document.getElementById('how-to-play').style.display = 'none';
    setTimeBasedOnDifficulty();
    difficultyDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    restartBtn.style.display = 'none';
    score = 0;
    currentCookieIndex = 0;
    updateScore();
    updateTimer();
    startTimer();
    generateQuestion();
    positionCharacter();
}

function positionCharacter() {
    characterImg.style.left = '0px';
    hammerImg.style.display = 'none';
}

function startTimer() {
    timer = setInterval(() => {
        time--;
        updateTimer();
        if (time <= 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function setTimeBasedOnDifficulty() {
    if (difficulty === 'easy') time = 90;
    else if (difficulty === 'medium') time = 120;
    else if (difficulty === 'hard') time = 150;
    else if (difficulty === 'extreme') time = 300;
}

function updateTimer() {
    timerDisplay.textContent = `Time: ${time}s`;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    document.getElementById('high-score').textContent = `High Score: ${highScore}`;
}

function getNumberRange() {
    if (difficulty === 'easy') return [1, 10];
    if (difficulty === 'medium') return [10, 50];
    if (difficulty === 'hard') return [50, 100];
    if (difficulty === 'extreme') return [1, 100];
    return [1, 10];
}

function generateQuestion() {
    const [min, max] = getNumberRange();
    let question;
    let xValue;

    if (difficulty === 'extreme') {
        const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num3 = Math.floor(Math.random() * (max - min + 1)) + min;
        xValue = Math.floor(Math.random() * (max - min + 1)) + min;

        const y = num1 * xValue + num2 - num3;
        question = `Solve for x: (${num1}x + ${num2}) - ${num3} = ${y}`;
        currentAnswer = parseFloat(((y + num3 - num2) / num1).toFixed(2));

    } else {
        const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2 = Math.floor(Math.random() * (max - min + 1)) + min;

        let operator;
        if (difficulty === 'easy') operator = ['+', '-'][Math.floor(Math.random() * 2)];
        else if (difficulty === 'medium') operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        else operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];

        if (operator === '/') {
            question = `${num1 * num2} / ${num2}`;
            currentAnswer = num1;
        } else {
            question = `${num1} ${operator} ${num2}`;
            currentAnswer = eval(question);
        }
    }
    questionDisplay.textContent = `Question: ${question}`;
}

function updateHammerPosition() {
    const charRect = characterImg.getBoundingClientRect();
    const containerRect = document.getElementById('game-area').getBoundingClientRect();
    const offsetLeft = charRect.left - containerRect.left;
    hammerImg.style.left = `${offsetLeft + 20}px`;
}

function moveCharacterToCookie(cookie) {
    const containerRect = document.getElementById('cookie-container').getBoundingClientRect();
    const cookieRect = cookie.getBoundingClientRect();
    const offset = cookieRect.left - containerRect.left;

    characterImg.style.left = `${offset}px`;

    setTimeout(() => {
        cookie.classList.add('pop');
        characterImg.src = './image/happycrayon.JPG';

        setTimeout(() => {
            characterImg.src = './image/crayon.JPG';
            cookie.classList.add('eaten');
        }, 600);
    }, 300);

    updateHammerPosition();
}

function showHammerEffect() {
    updateHammerPosition();
    hammerImg.style.bottom = '450px';
    hammerImg.style.display = 'block';
    hammerImg.classList.add('shake');
    characterImg.src = './image/sadcrayon.JPG';

    setTimeout(() => {
        hammerImg.style.display = 'none';
        hammerImg.classList.remove('shake');
        characterImg.src = './image/crayon.JPG';
    }, 1000);
}

function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value.trim());
    if (isNaN(userAnswer)) {
        answerInput.value = '';
        return;
    }

    if (userAnswer === currentAnswer) {
        score++;
        updateScore();

        if (currentCookieIndex < cookies.length) {
            moveCharacterToCookie(cookies[currentCookieIndex]);
            currentCookieIndex++;
        }

        answerInput.value = '';

        if (score === totalCookies) {
            endGame(true);
        } else {
            generateQuestion();
        }
    } else {
        showHammerEffect();
        answerInput.value = '';
        generateQuestion();
    }
}

function endGame(win) {
    clearInterval(timer);
    if (win) {
        messageDisplay.textContent = 'Congratulations! You ate all the cookies! 🎉';
        messageDisplay.classList.add('win');
    } else {
        messageDisplay.textContent = 'Time’s Up! 😢';
    }
    restartBtn.style.display = 'block';
    submitBtn.disabled = true;
}

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        difficulty = e.target.dataset.difficulty;
        initGame();
    });
});

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') checkAnswer();
});

restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    difficultyDiv.style.display = 'block';
    gameDiv.style.display = 'none';
    restartBtn.style.display = 'none';
    messageDisplay.textContent = 'Welcome to Math Quiz World';
    messageDisplay.classList.remove('win');
    answerInput.value = '';
    score = 0;
    time = 90;
    updateScore();
    updateTimer();
    positionCharacter();
    cookies.forEach(cookie => cookie.classList.remove('eaten'));
});

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
    }
    highScore = localStorage.getItem('highScore') || 0;
    document.getElementById('high-score').textContent = `High Score: ${highScore}`;
});

darkBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

let isMusicPlaying = false;

playMusicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        music.pause();
        playMusicBtn.textContent = '🎶';
    } else {
        music.play();
        playMusicBtn.textContent = '🔇';
    }
    isMusicPlaying = !isMusicPlaying;
});

backButton.addEventListener('click', () => {
    clearInterval(timer);
    difficultyDiv.style.display = 'block';
    gameDiv.style.display = 'none';
    restartBtn.style.display = 'none';
    messageDisplay.textContent = 'Welcome to Math Quiz World';
    messageDisplay.classList.remove('win');
    answerInput.value = '';
    score = 0;
    time = 90;
    updateScore();
    updateTimer();
    positionCharacter();
    cookies.forEach(cookie => cookie.classList.remove('eaten'));
});
