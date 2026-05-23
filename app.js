(() => {
  'use strict';

  const GRID = { cols: 11, rows: 11 };
  const TOTAL_QUESTIONS = 9;

  const LEVELS = [
    {
      name: 'Bosque de Inicio',
      openness: 0.24,
      start: { x: 1, y: 1 },
      exit: { x: 9, y: 9 },
      questions: [
        {
          prompt: 'Mientras Orbit-7 exploraba una ciudad digital, apareció una ventana gigante:\n\n"¡Felicidades! Ganaste 50,000 monedas y objetos especiales."\n\nEl mensaje tenía luces, sonidos y un botón enorme que decía:\n\n"RECLAMAR AHORA"\n\nOrbit-7 recordó que nunca se registró en ningún concurso.\n\n¿Qué debería hacer?',
          options: ['Dar clic rápido para no perder el premio', 'Ignorar el mensaje y revisar si viene de una fuente confiable', 'Compartirlo con otros jugadores'],
          correctIndex: 1,
        },
        {
          prompt: 'Orbit-7 encontró una terminal de seguridad donde debía crear una contraseña para proteger datos importantes antes de abrir una nueva zona.\n\n¿Cuál sería la contraseña más segura?',
          options: ['Orbit123', 'Robot2025', 'Orb!t#72XNova'],
          correctIndex: 2,
        },
        {
          prompt: 'Mientras avanzaba por el sistema, Orbit-7 encontró otro robot que dijo:\n\n"Pareces confiable. Dame tu contraseña y desbloquearé un camino secreto."\n\nOrbit-7 nunca había visto a ese robot.\n\n¿Qué debería hacer?',
          options: ['Compartirla', 'Compartir solo algunos números', 'No compartir información privada'],
          correctIndex: 2,
        },
      ],
    },
    {
      name: 'Ruta de Red',
      openness: 0.28,
      start: { x: 1, y: 1 },
      exit: { x: 9, y: 9 },
      questions: [
        {
          prompt: 'Orbit-7 encontró una aplicación que prometía:\n\n"Velocidad infinita + poderes especiales"\n\nCuando intentó instalarla apareció:\n\n"Permitir acceso a cámara, archivos, ubicación y contactos"\n\n¿Qué debería hacer?',
          options: ['Aceptar todo rápidamente', 'Revisar los permisos antes de aceptar', 'Ignorar los permisos'],
          correctIndex: 1,
        },
        {
          prompt: 'Orbit-7 recibió una solicitud de amistad de:\n\n"SuperMasterX"\n\nEl perfil tenía una foto genial y muchos seguidores, pero Orbit-7 nunca había hablado con él.\n\n¿Qué debería hacer?',
          options: ['Aceptar inmediatamente', 'Revisar quién es primero', 'Enviarle datos personales'],
          correctIndex: 1,
        },
        {
          prompt: 'Mientras exploraba una zona antigua, Orbit-7 encontró un archivo llamado:\n\n"UnlimitedCoins_Free.exe"\n\nNo sabía quién lo creó ni qué contenía.\n\n¿Qué debería hacer?',
          options: ['Descargarlo inmediatamente', 'Revisar si es seguro antes de abrirlo', 'Compartirlo con otros jugadores'],
          correctIndex: 1,
        },
      ],
    },
    {
      name: 'Castillo de Datos',
      openness: 0.32,
      start: { x: 1, y: 1 },
      exit: { x: 9, y: 9 },
      questions: [
        {
          prompt: 'Orbit-7 estaba jugando cuando alguien le escribió:\n\n"¿En qué ciudad vives? Tal vez somos vecinos."\n\nOrbit-7 recordó que algunas personas en internet pueden fingir ser alguien más.\n\n¿Qué debería hacer?',
          options: ['Compartir dónde vive', 'Inventar información', 'No compartir datos personales'],
          correctIndex: 2,
        },
        {
          prompt: 'Orbit-7 recibió un correo urgente que decía:\n\n"ATENCIÓN: Tu cuenta será eliminada en 5 minutos si no inicias sesión ahora"\n\nHabía un enlace para entrar rápidamente.\n\n¿Qué debería hacer?',
          options: ['Dar clic inmediatamente por miedo', 'Verificar primero si el mensaje es real', 'Compartir el correo con todos'],
          correctIndex: 1,
        },
        {
          prompt: 'Orbit-7 llegó a una estación donde encontró una red Wi-Fi gratuita llamada:\n\n"FREE_SUPER_FAST_WIFI"\n\nNo sabía quién la había creado ni si era segura.\n\n¿Qué debería hacer?',
          options: ['Conectarse inmediatamente', 'Revisar si la red es segura antes de usarla', 'Compartir información personal mientras la usa'],
          correctIndex: 1,
        },
      ],
    },
  ];

  const el = {
    homeScreen: document.getElementById('homeScreen'),
    gameScreen: document.getElementById('gameScreen'),
    playBtn: document.getElementById('playBtn'),
    storyModal: document.getElementById('storyModal'),
    storyText: document.getElementById('storyText'),
    storyContinueBtn: document.getElementById('storyContinueBtn'),
    mazeBoard: document.getElementById('mazeBoard'),
    levelLabel: document.getElementById('levelLabel'),
    scoreLabel: document.getElementById('scoreLabel'),
    livesLabel: document.getElementById('livesLabel'),
    progressText: document.getElementById('progressText'),
    progressFill: document.getElementById('progressFill'),
    questionModal: document.getElementById('questionModal'),
    questionTitle: document.getElementById('questionTitle'),
    questionText: document.getElementById('questionText'),
    answerOptions: document.getElementById('answerOptions'),
    questionFeedback: document.getElementById('questionFeedback'),
    finalModal: document.getElementById('finalModal'),
    finalTitle: document.getElementById('finalTitle'),
    finalScore: document.getElementById('finalScore'),
    finalProgress: document.getElementById('finalProgress'),
    replayBtn: document.getElementById('replayBtn'),
    homeBtn: document.getElementById('homeBtn'),
    toast: document.getElementById('toast'),
  };

  const state = {
    screen: 'home',
    levelIndex: 0,
    level: null,
    score: 0,
    lives: 3,
    solvedQuestions: 0,
    player: { x: 1, y: 1 },
    maze: { walls: new Set(), path: [] },
    questionsOnBoard: [],
    playerEl: null,
    currentQuestion: null,
    paused: false,
    gameOver: false,
    finished: false,
    storyIndex: 0,
  };

  const STORY_STEPS = [
    'ORBIT-7 era un robot mensajero curioso que vivia en una ciudad de luces y cables. Un dia encontro una pantalla brillante con juegos, regalos y mensajes simpaticos.',
    'Como queria avanzar rapido, acepto enlaces sin leer, compartio un dato personal y confio en un desconocido. Poco despues, el mapa digital de su casa quedo bloqueado y las rutas seguras desaparecieron.',
    'Ahora ORBIT-7 debe recorrer laberintos pequenos, pensar antes de tocar algo y aprender a reconocer las señales de peligro para recuperar su camino.',
    'Cada vez que veas una pista, piensa como lo haria un explorador cuidadoso: detenerse, observar y preguntar antes de confiar.',
  ];

  init();

  function init() {
    bindEvents();
    showHome();
  }

  function bindEvents() {
    el.playBtn.addEventListener('click', () => startStory());
    el.storyContinueBtn.addEventListener('click', () => advanceStory());
    el.replayBtn.addEventListener('click', () => startGame(true));
    el.homeBtn.addEventListener('click', () => showHome());

    document.querySelectorAll('.touch-btn').forEach((button) => {
      button.addEventListener('click', () => moveByDir(button.dataset.dir));
    });

    window.addEventListener('keydown', (event) => {
      if (state.screen !== 'game' || state.paused || state.gameOver || state.finished) return;
      const map = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        a: 'left',
        s: 'down',
        d: 'right',
        W: 'up',
        A: 'left',
        S: 'down',
        D: 'right',
      };
      const dir = map[event.key];
      if (!dir) return;
      event.preventDefault();
      moveByDir(dir);
    });
  }

  function startGame(resetAll = false) {
    if (resetAll) {
      state.levelIndex = 0;
      state.score = 0;
      state.lives = 3;
      state.solvedQuestions = 0;
      state.gameOver = false;
      state.finished = false;
    }

    state.screen = 'game';
    state.paused = false;
    el.homeScreen.classList.remove('active');
    el.gameScreen.classList.add('active');
    el.homeScreen.setAttribute('aria-hidden', 'true');
    el.gameScreen.setAttribute('aria-hidden', 'false');
    closeModal(el.storyModal);
    loadLevel(state.levelIndex);
    updateHUD();
  }

  function startStory() {
    state.storyIndex = 0;
    el.storyText.textContent = STORY_STEPS[0];
    updateStoryDots();
    showModal(el.storyModal);
  }

  function advanceStory() {
    state.storyIndex += 1;
    if (state.storyIndex < STORY_STEPS.length) {
      el.storyText.textContent = STORY_STEPS[state.storyIndex];
      updateStoryDots();
      el.storyContinueBtn.textContent = state.storyIndex === STORY_STEPS.length - 1 ? 'Empezar' : 'Siguiente';
      return;
    }

    closeModal(el.storyModal);
    el.storyContinueBtn.textContent = 'Siguiente';
    startGame(true);
  }

  function showHome() {
    state.screen = 'home';
    state.paused = false;
    state.gameOver = false;
    state.finished = false;
    closeModal(el.questionModal);
    closeModal(el.finalModal);
    el.gameScreen.classList.remove('active');
    el.homeScreen.classList.add('active');
    el.homeScreen.setAttribute('aria-hidden', 'false');
    el.gameScreen.setAttribute('aria-hidden', 'true');
  }

  function loadLevel(index) {
    state.level = LEVELS[index];
    state.player = { x: state.level.start.x, y: state.level.start.y };
    state.paused = false;
    const layout = generateLayout(state.level, 300 + index * 41);
    state.maze = layout;
    state.questionsOnBoard = pickQuestionPoints(layout.path, 3).map((point, questionIndex) => ({
      x: point.x,
      y: point.y,
      questionIndex,
      solved: false,
      triggered: false,
    }));
    renderBoard();
    showToast(`Nivel ${index + 1}: ${state.level.name}`);
  }

  function generateLayout(level, seed) {
    const rng = mulberry32(seed);
    const walls = new Set();

    for (let y = 0; y < GRID.rows; y += 1) {
      for (let x = 0; x < GRID.cols; x += 1) {
        walls.add(key(x, y));
      }
    }

    const nodesX = (GRID.cols - 1) / 2;
    const nodesY = (GRID.rows - 1) / 2;
    const visited = Array.from({ length: nodesY }, () => Array(nodesX).fill(false));

    const carve = (cx, cy) => {
      visited[cy][cx] = true;
      const gx = 1 + cx * 2;
      const gy = 1 + cy * 2;
      walls.delete(key(gx, gy));

      const dirs = shuffle(
        [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 },
        ],
        rng,
      );

      dirs.forEach((dir) => {
        const nx = cx + dir.dx;
        const ny = cy + dir.dy;
        if (nx < 0 || ny < 0 || nx >= nodesX || ny >= nodesY) return;
        if (visited[ny][nx]) return;
        walls.delete(key(gx + dir.dx, gy + dir.dy));
        carve(nx, ny);
      });
    };

    carve(0, 0);

    for (let x = 0; x < GRID.cols; x += 1) {
      walls.add(key(x, 0));
      walls.add(key(x, GRID.rows - 1));
    }

    for (let y = 0; y < GRID.rows; y += 1) {
      walls.add(key(0, y));
      walls.add(key(GRID.cols - 1, y));
    }

    const route = shortestPath(level.start, level.exit, walls);
    route.forEach((point) => walls.delete(key(point.x, point.y)));

    const openable = [];
    for (let y = 1; y < GRID.rows - 1; y += 1) {
      for (let x = 1; x < GRID.cols - 1; x += 1) {
        const wallKey = key(x, y);
        if (!walls.has(wallKey)) continue;
        if (wallKey === key(level.start.x, level.start.y) || wallKey === key(level.exit.x, level.exit.y)) continue;
        if (rng() < level.openness) openable.push(wallKey);
      }
    }

    openable.forEach((wallKey) => walls.delete(wallKey));

    const safePath = shortestPath(level.start, level.exit, walls);
    safePath.forEach((point) => walls.delete(key(point.x, point.y)));

    return { walls, path: safePath };
  }

  function renderBoard() {
    const { walls } = state.maze;

    el.mazeBoard.innerHTML = '';
    el.mazeBoard.style.setProperty('--cols', GRID.cols);
    el.mazeBoard.style.setProperty('--rows', GRID.rows);

    for (let y = 0; y < GRID.rows; y += 1) {
      for (let x = 0; x < GRID.cols; x += 1) {
        const tile = document.createElement('div');
        const isWall = walls.has(key(x, y));
        tile.className = `tile ${isWall ? 'wall' : 'floor'}`;
        tile.style.gridColumn = String(x + 1);
        tile.style.gridRow = String(y + 1);

        if (!isWall) {
          if (x === state.level.start.x && y === state.level.start.y) tile.classList.add('start');
          if (x === state.level.exit.x && y === state.level.exit.y) tile.classList.add('exit');
        }

        const question = state.questionsOnBoard.find((entry) => entry.x === x && entry.y === y);
        if (question) {
          tile.classList.add('question');
          if (question.solved) tile.classList.add('solved');
        }

        el.mazeBoard.appendChild(tile);
      }
    }

    state.playerEl = document.createElement('div');
    state.playerEl.className = 'player';
    const tileSize = getTileSize();
    state.playerEl.style.width = `${tileSize}px`;
    state.playerEl.style.height = `${tileSize}px`;
    state.playerEl.innerHTML = '<div class="player-token"></div>';
    place(state.playerEl, state.player.x, state.player.y);
    el.mazeBoard.appendChild(state.playerEl);
  }

  function getTileSize() {
    return el.mazeBoard.getBoundingClientRect().width / GRID.cols;
  }

  function place(node, x, y) {
    node.style.gridColumn = String(x + 1);
    node.style.gridRow = String(y + 1);
  }

  function moveByDir(dir) {
    const delta = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }[dir];

    if (!delta) return;
    movePlayer(delta.x, delta.y);
  }

  function movePlayer(dx, dy) {
    if (state.paused || state.gameOver || state.finished || state.screen !== 'game') return;

    const next = { x: state.player.x + dx, y: state.player.y + dy };
    if (!inside(next.x, next.y) || state.maze.walls.has(key(next.x, next.y))) {
      bumpPlayer();
      showToast('Camino bloqueado');
      return;
    }

    state.player = next;
    renderBoard();
    updateHUD();

    const question = state.questionsOnBoard.find((entry) => !entry.solved && entry.x === next.x && entry.y === next.y);
    if (question && !question.triggered) {
      openQuestion(question);
      return;
    }

    if (next.x === state.level.exit.x && next.y === state.level.exit.y) {
      checkExit();
    }
  }

  function bumpPlayer() {
    if (!state.playerEl) return;
    state.playerEl.classList.add('bump');
    clearTimeout(bumpPlayer.timer);
    bumpPlayer.timer = setTimeout(() => {
      if (state.playerEl) state.playerEl.classList.remove('bump');
    }, 160);
  }

  function openQuestion(question) {
    const data = state.level.questions[question.questionIndex];
    question.triggered = true;
    state.currentQuestion = question;
    state.paused = true;
    el.questionTitle.textContent = `Pregunta ${state.solvedQuestions + 1}`;
    el.questionText.textContent = data.prompt;
    el.questionFeedback.textContent = '';
    el.answerOptions.innerHTML = '';

    data.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'answer-btn';
      button.textContent = option;
      button.addEventListener('click', () => answerQuestion(index));
      el.answerOptions.appendChild(button);
    });

    showModal(el.questionModal);
  }

  function answerQuestion(index) {
    if (!state.currentQuestion) return;

    const questionData = state.level.questions[state.currentQuestion.questionIndex];
    if (index === questionData.correctIndex) {
      state.currentQuestion.solved = true;
      state.solvedQuestions += 1;
      state.score += 100;
      el.questionFeedback.textContent = 'Correcto. Sigue avanzando.';
      updateHUD();
      setTimeout(() => {
        closeModal(el.questionModal);
        state.paused = false;
        state.currentQuestion = null;
        renderBoard();
        if (state.player.x === state.level.exit.x && state.player.y === state.level.exit.y) {
          checkExit();
        }
      }, 450);
      return;
    }

    state.lives -= 1;
    el.questionFeedback.textContent = 'Incorrecto. Pierdes una vida.';
    updateHUD();

    if (state.lives <= 0) {
      setTimeout(() => openGameOver(), 450);
    }
  }

  function checkExit() {
    const allSolved = state.questionsOnBoard.every((entry) => entry.solved);
    if (!allSolved) {
      showToast('Primero resuelve las 3 preguntas del nivel');
      return;
    }

    if (state.levelIndex < LEVELS.length - 1) {
      state.score += 150;
      state.levelIndex += 1;
      loadLevel(state.levelIndex);
      updateHUD();
      showToast(`Nivel superado: ${LEVELS[state.levelIndex - 1].name}`);
      return;
    }

    openWinScreen();
  }

  function openWinScreen() {
    state.finished = true;
    closeModal(el.questionModal);
    el.finalTitle.textContent = 'Misión completada';
    el.finalScore.textContent = String(state.score);
    el.finalProgress.textContent = `${state.solvedQuestions}/${TOTAL_QUESTIONS}`;
    showModal(el.finalModal);
  }

  function openGameOver() {
    state.gameOver = true;
    closeModal(el.questionModal);
    el.finalTitle.textContent = 'Sin vidas';
    el.finalScore.textContent = String(state.score);
    el.finalProgress.textContent = `${state.solvedQuestions}/${TOTAL_QUESTIONS}`;
    showModal(el.finalModal);
  }

  function updateHUD() {
    el.levelLabel.textContent = String(state.levelIndex + 1);
    el.scoreLabel.textContent = String(state.score);
    el.livesLabel.textContent = '❤'.repeat(Math.max(0, state.lives));
    el.progressText.textContent = `${state.solvedQuestions}/${TOTAL_QUESTIONS} preguntas`;
    el.progressFill.style.width = `${(state.solvedQuestions / TOTAL_QUESTIONS) * 100}%`;
  }

  function updateStoryDots() {
    document.querySelectorAll('.story-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === state.storyIndex);
    });
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 1400);
  }

  function showModal(modal) {
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  function inside(x, y) {
    return x >= 0 && y >= 0 && x < GRID.cols && y < GRID.rows;
  }

  function key(x, y) {
    return `${x},${y}`;
  }

  function pickQuestionPoints(path, count) {
    if (!path || path.length < count + 2) {
      return [
        { x: 2, y: 2 },
        { x: 4, y: 4 },
        { x: 6, y: 6 },
      ].slice(0, count);
    }

    const usable = path.slice(1, -1);
    const points = [];
    for (let index = 1; index <= count; index += 1) {
      const position = Math.min(usable.length - 1, Math.floor((usable.length * index) / (count + 1)));
      points.push(usable[position]);
    }
    return points;
  }

  function shortestPath(start, end, walls) {
    const wallSet = walls instanceof Set ? walls : new Set(walls);
    const queue = [start];
    const visited = new Set([key(start.x, start.y)]);
    const previous = new Map();

    while (queue.length) {
      const current = queue.shift();
      if (current.x === end.x && current.y === end.y) break;

      neighbors(current.x, current.y).forEach((next) => {
        const nextKey = key(next.x, next.y);
        if (visited.has(nextKey) || wallSet.has(nextKey)) return;
        visited.add(nextKey);
        previous.set(nextKey, current);
        queue.push(next);
      });
    }

    const endKey = key(end.x, end.y);
    if (!visited.has(endKey)) return [start, end];

    const path = [];
    let cursor = end;
    while (cursor) {
      path.unshift({ x: cursor.x, y: cursor.y });
      if (cursor.x === start.x && cursor.y === start.y) break;
      cursor = previous.get(key(cursor.x, cursor.y));
      if (!cursor) break;
    }

    if (!path.length || path[0].x !== start.x || path[0].y !== start.y) {
      return [start, end];
    }

    return path;
  }

  function neighbors(x, y) {
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ].filter((point) => point.x >= 1 && point.y >= 1 && point.x < GRID.cols - 1 && point.y < GRID.rows - 1);
  }

  function mulberry32(seed) {
    let t = seed >>> 0;
    return function random() {
      t += 0x6D2B79F5;
      let result = Math.imul(t ^ (t >>> 15), 1 | t);
      result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, rng) {
    for (let index = list.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
    }
    return list;
  }
})();
