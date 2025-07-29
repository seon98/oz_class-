// Monster Catching Game
class MonsterGame {
  constructor() {
    this.gameArea = document.getElementById('gameArea');
    this.gameMessage = document.getElementById('gameMessage');
    this.scoreElement = document.getElementById('score');
    this.timerElement = document.getElementById('timer');
    this.livesElement = document.getElementById('lives');
    this.startBtn = document.getElementById('startBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.restartBtn = document.getElementById('restartBtn');

    this.score = 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.gameRunning = false;
    this.gamePaused = false;
    this.monsters = [];
    this.gameTimer = null;
    this.spawnTimer = null;

    this.monsterTypes = [
      { emoji: '👹', points: 10, speed: 3000 },
      { emoji: '👺', points: 15, speed: 2500 },
      { emoji: '🐉', points: 20, speed: 2000 },
      { emoji: '👻', points: 25, speed: 1500 }
    ];

    this.initEventListeners();
  }

  initEventListeners() {
    this.startBtn.addEventListener('click', () => this.startGame());
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.restartBtn.addEventListener('click', () => this.restartGame());
  }

  startGame() {
    this.gameRunning = true;
    this.gamePaused = false;
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.monsters = [];

    this.updateDisplay();
    this.hideMessage();
    this.pauseBtn.disabled = false;

    // Start game timer
    this.gameTimer = setInterval(() => {
      if (!this.gamePaused) {
        this.timeLeft--;
        this.updateDisplay();

        if (this.timeLeft <= 0) {
          this.endGame();
        }
      }
    }, 1000);

    // Start monster spawning
    this.spawnMonsters();
  }

  spawnMonsters() {
    if (!this.gameRunning || this.gamePaused) return;

    const spawnDelay = Math.random() * 2000 + 1000; // 1-3 seconds

    this.spawnTimer = setTimeout(() => {
      if (this.gameRunning && !this.gamePaused) {
        this.createMonster();
        this.spawnMonsters(); // Schedule next spawn
      }
    }, spawnDelay);
  }

  createMonster() {
    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const monsterSize = 60;
    const maxX = gameAreaRect.width - monsterSize;
    const maxY = gameAreaRect.height - monsterSize;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    const typeIndex = Math.floor(Math.random() * this.monsterTypes.length);
    const monsterType = this.monsterTypes[typeIndex];

    const monster = document.createElement('div');
    monster.className = `monster type${typeIndex + 1}`;
    monster.style.left = x + 'px';
    monster.style.top = y + 'px';
    monster.textContent = monsterType.emoji;
    monster.dataset.points = monsterType.points;
    monster.dataset.type = typeIndex;

    // Add click event
    monster.addEventListener('click', (e) => this.catchMonster(e, monster));

    this.gameArea.appendChild(monster);
    this.monsters.push(monster);

    // Auto-remove monster after its lifetime
    setTimeout(() => {
      if (monster.parentNode && this.gameRunning) {
        this.missMonster(monster);
      }
    }, monsterType.speed);
  }

  catchMonster(event, monster) {
    event.preventDefault();

    if (!this.gameRunning || this.gamePaused) return;

    const points = parseInt(monster.dataset.points);
    this.score += points;

    // Add catch animation
    monster.classList.add('caught');

    // Remove monster after animation
    setTimeout(() => {
      if (monster.parentNode) {
        monster.parentNode.removeChild(monster);
      }
      this.removeMonsterFromArray(monster);
    }, 500);

    this.updateDisplay();

    // Show points animation
    this.showPointsAnimation(event.clientX, event.clientY, points);
  }

  missMonster(monster) {
    if (!this.gameRunning) return;

    this.lives--;

    if (monster.parentNode) {
      monster.parentNode.removeChild(monster);
    }
    this.removeMonsterFromArray(monster);

    this.updateDisplay();

    if (this.lives <= 0) {
      this.endGame();
    }
  }

  removeMonsterFromArray(monster) {
    const index = this.monsters.indexOf(monster);
    if (index > -1) {
      this.monsters.splice(index, 1);
    }
  }

  showPointsAnimation(x, y, points) {
    const pointsElement = document.createElement('div');
    pointsElement.textContent = `+${points}`;
    pointsElement.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      color: #4CAF50;
      font-weight: bold;
      font-size: 1.5em;
      pointer-events: none;
      z-index: 1000;
      animation: pointsFloat 1s ease-out forwards;
    `;

    // Add CSS animation
    if (!document.getElementById('pointsAnimation')) {
      const style = document.createElement('style');
      style.id = 'pointsAnimation';
      style.textContent = `
        @keyframes pointsFloat {
          0% { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(-50px); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(pointsElement);

    setTimeout(() => {
      if (pointsElement.parentNode) {
        pointsElement.parentNode.removeChild(pointsElement);
      }
    }, 1000);
  }

  togglePause() {
    if (!this.gameRunning) return;

    this.gamePaused = !this.gamePaused;
    this.pauseBtn.textContent = this.gamePaused ? '계속하기' : '일시정지';

    if (this.gamePaused) {
      this.showMessage('게임이 일시정지되었습니다', '계속하려면 계속하기 버튼을 누르세요');
    } else {
      this.hideMessage();
      this.spawnMonsters(); // Resume spawning
    }
  }

  restartGame() {
    this.endGame();
    this.showMessage('몬스터 잡기 게임에 오신 것을 환영합니다!', '나타나는 몬스터를 클릭해서 잡으세요!', true);
  }

  endGame() {
    this.gameRunning = false;
    this.gamePaused = false;

    // Clear timers
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    if (this.spawnTimer) {
      clearTimeout(this.spawnTimer);
      this.spawnTimer = null;
    }

    // Remove all monsters
    this.monsters.forEach(monster => {
      if (monster.parentNode) {
        monster.parentNode.removeChild(monster);
      }
    });
    this.monsters = [];

    this.pauseBtn.disabled = true;
    this.pauseBtn.textContent = '일시정지';

    // Show game over message
    const isWin = this.timeLeft <= 0 && this.lives > 0;
    const title = isWin ? '게임 완료!' : '게임 오버!';
    const message = `최종 점수: ${this.score}점\n${isWin ? '시간을 모두 버텼습니다!' : '생명이 모두 소진되었습니다.'}`;

    this.showMessage(title, message, true);
  }

  showMessage(title, message, showStartButton = false) {
    this.gameMessage.innerHTML = `
      <h2>${title}</h2>
      <p>${message}</p>
      ${showStartButton ? '<button id="startBtn" class="start-btn">게임 시작</button>' : ''}
    `;
    this.gameMessage.style.display = 'block';

    if (showStartButton) {
      document.getElementById('startBtn').addEventListener('click', () => this.startGame());
    }
  }

  hideMessage() {
    this.gameMessage.style.display = 'none';
  }

  updateDisplay() {
    this.scoreElement.textContent = this.score;
    this.timerElement.textContent = this.timeLeft;
    this.livesElement.textContent = this.lives;
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MonsterGame();
});
