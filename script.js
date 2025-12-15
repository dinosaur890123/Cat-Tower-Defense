const CONFIG = {
    catSpeed: 2,
    chaseSpeed: 3.5,
    spawnRate: 1500,
    distractionRadius: 150,
    tunaRadius: 30
};
let state = {
    isPlaying: false,
    score: 0,
    lastTime: 0,
    spawnTimer: 0,
    mouse: {x: window.innerWidth / 2, y: window.innerHeight / 2},
    cats: []
};
const gameArea = document.getElementById('game-area');
const laser = document.getElementById('laser');
const scoreDisplay = document.getElementById('score-display');
const finalScoreDisplay = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over-screen');
const startScreen = document.getElementById('start-screen');
const tunaElement = document.getElementById('tuna');
document.addEventListener('mousemove', (e) => {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
    laser.style.left = state.mouse.x + 'px';
    laser.style.top = state.mouse.y + 'px';
});
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    state.mouse.x = e.touches[0].clientX;
    state.mouse.y = e.touches[0].clientY;
    laser.style.left = state.mouse.x + 'px';
    laser.style.top = state.mouse.y + 'px';
}, {passive: false});

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameArea.style.cursor = 'none';
    state.isPlaying = true;
    state.score = 0;
    state.cats = [];
    state.spawnTimer = 0;
    scoreDisplay.textContent = '0';
    const existingCats = document.querySelectorAll('.cat');
    existingCats.forEach(c => c.remove());
    requestAnimationFrame(gameLoop);
}
function restartGame() {
    startGame();
}
function gameOver() {
    state.isPlaying = false;
    gameArea.style.cursor = 'default';
    finalScoreDisplay.textContent = state.score;
    gameOverScreen.style.display = 'flex';
}
function spawnCat() {
    const element = document.createElement('div');
    element.classList.add('cat');
    element.textContent = '🐱';
    gameArea.appendChild(element);
    let x, y;
    const side = Math.floor(Math.random() * 4);
    const buffer = 50;
    switch(side) {
        case 0: x = Math.random() * window.innerWidth; y = -buffer; break;
        case 1: x = window.innerWidth + buffer; y = Math.random() * window.innerHeight; break;
        case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + buffer; break;
        case 3: x = -buffer; y = Math.random() * window.innerHeight; break;
    }
    state.cats.push({
        element: element,
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        isDistracted: false
    });
}
function updateCosts(dt) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const tunaX = w / 2;
    const tunaY = h / 2;
    for (let i = state.cats.length - 1; i >= 0; i--) {
        let cat = state.cats[i];
        const dxTuna = tunaX - cat.x;
        const dyTuna = tunaY - cat.y;
        const distTuna = Math.sqrt(dxTuna * dxTuna + dyTuna * dyTuna);
        const dxLaser = state.mouse.x - cat.x;
        const dyLaser = state.mouse.y - cat.y;
        const distLaser = Math.sqrt(dxLaser * dxLaser + dyLaser * dyLaser);
        if (distLaser < CONFIG.distractionRadius) {
            cat.isDistracted = true;
            cat.element.classList.add('distracted');
        } else {
            cat.isDistracted = false;
            cat.element.classList.remove('distracted');
        }
        let targetX, targetY, speed;
        if (cat.isDistracted) {
            targetX = state.mouse.x;
            targetY = state.mouse.y;
            speed = CONFIG.chaseSpeed;
        } else {
            targetX = tunaX;
            targetY = tunaY;
            speed = CONFIG.catSpeed;
        }
    }
}
