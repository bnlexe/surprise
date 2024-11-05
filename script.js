const map = document.querySelector('#map');
const taskDisplay = document.getElementById('taskDisplay');
const answerInput = document.getElementById('answerInput');
const readyButton = document.getElementById('submitAnswer');
let currentTask = 1;

// Список заданий
const tasks = [
    { description: "Еркемммм я тебя очень сильно люблю и этот хоть и мини квест, но для тебя! Поцелуй меня туда куда мне больше всего нравиться иии получишь пароль для перехода дальше! p.s Я ТЕБЯ ЛЮБЛЮ БОЛЬШЕ ВСЕГО НА СВЕТЕ", checkAnswer: answer => answer === '2007' },
    { description: "Игра змейкаааа: Собери 7 яблок.", checkAnswer: () => startSnakeGame() },
    { description: "Викторина: Ответь правильно на 3 вопроса.", checkAnswer: () => startQuiz() },
    { description: "Вопрос на память, вкус чего тебе не понравился на шашлыках?", checkAnswer: answer => /^жир$/i.test(answer)},
    { description: "Игра Flappy Bird: Пройди через 5 препятствий.", checkAnswer: () => startFlappyBirdGame() },
    { description: "Викторина: Ответь правильно на 3 новых вопроса.", checkAnswer: () => startSecondQuiz() },
    { description: "Вопрос: Будешь ли ты всегда со мной?", checkAnswer: answer => /^да$/i.test(answer)},
    { description: "Знание языков тоже важно) 'My незабутня ay' переведи на Русский язык.", checkAnswer: answer => /^моя незабываемая луна$/i.test(answer)},
    { description: "Любимая, вот твой подарок! Люблю тебя, спасибо за каждую секунду проведенную с тобой - 37,8729373, 32,4933606", checkAnswer: () => true }
];

// Функция для создания клеток
function createCells() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'locked');
        cell.textContent = i + 1;

        // Сделаем только первую клетку активной
        if (i === 0) {
            cell.classList.remove('locked');
            cell.addEventListener('click', () => startTask(i + 1));
        }

        map.appendChild(cell);
    }
}

// Функция для начала задания
function startTask(taskNumber) {
    if (taskNumber !== currentTask) return; // Только текущая задача активна
    const task = tasks[taskNumber - 1];
    taskDisplay.textContent = task.description;

    // Проверяем, если это задача с вводом ответа
    if (task.checkAnswer.length === 1) { // Проверяем, что есть функция с одним аргументом
        answerInput.style.display = 'block'; // Показываем поле ввода
        readyButton.style.display = 'block';  // Показываем кнопку
        readyButton.onclick = () => {
            const answer = answerInput.value;
            if (task.checkAnswer(answer)) {
                showCorrectAnswer();
                unlockNextCell(taskNumber);
                answerInput.value = ''; // Очищаем поле ввода
            } else {
                showIncorrectAnswer();
            }
        };
    } else {
        // Убираем поле ввода и кнопку, если задание - игра
        answerInput.style.display = 'none';
        readyButton.style.display = 'none'; // Скрываем кнопку

        // Запускаем игру сразу
        task.checkAnswer(); 
    }
}

// Функция для разблокировки следующей клетки
function unlockNextCell(taskNumber) {
    currentTask++;
    const nextCell = document.querySelector(`.cell:nth-child(${taskNumber + 1})`);
    if (nextCell) {
        nextCell.classList.remove('locked');
        nextCell.addEventListener('click', () => {
            answerInput.style.display = 'none';
            readyButton.style.display = 'none';
            startTask(taskNumber + 1);
        });
    }

    // После разблокировки следующей клетки, восстанавливаем отображение карты
    //mapElement.style.display = "grid"; // Убедитесь, что отображение карты соответствует сетке
  //  taskDisplay.innerHTML = ""; // Очищаем дисплей задания
}
    

// Пример мини-игр (функции-заглушки, которые потом можно дополнить)
function startSnakeGame() {
    const mapElement = document.getElementById("map");
    const taskDisplay = document.getElementById("taskDisplay");

    // Скрываем карту, чтобы показать только игру
    mapElement.style.display = "none";
    taskDisplay.innerHTML = `
        <canvas id="snakeGame" width="300" height="300" style="background-color: #000;"></canvas>
        <div id="controls" style="text-align: center; margin-top: 10px;">
            <button id="up" style="width: 60px; height: 60px; font-size: 24px; margin: 10px;">↑</button>
            <div>
                <button id="left" style="width: 60px; height: 60px; font-size: 24px; margin: 10px;">←</button>
                <button id="right" style="width: 60px; height: 60px; font-size: 24px; margin: 10px;">→</button>
            </div>
            <button id="down" style="width: 60px; height: 60px; font-size: 24px; margin: 10px;">↓</button>
        </div>
    `;

    const canvas = document.getElementById("snakeGame");
    const ctx = canvas.getContext("2d");
    const box = 20; // Размер одной клетки
    let score = 0;

    // Начальные позиции змейки
    let snake = [{ x: 4 * box, y: 4 * box }];
    let food = { x: Math.floor(Math.random() * 10) * box, y: Math.floor(Math.random() * 10) * box };
    let direction;
    let gameInterval; // Переменная для хранения интервала игры

    // Управление с помощью кнопок
    document.getElementById("up").onclick = () => {
        if (direction !== "DOWN") direction = "UP";
    };
    document.getElementById("down").onclick = () => {
        if (direction !== "UP") direction = "DOWN";
    };
    document.getElementById("left").onclick = () => {
        if (direction !== "RIGHT") direction = "LEFT";
    };
    document.getElementById("right").onclick = () => {
        if (direction !== "LEFT") direction = "RIGHT";
    };

    // Обновление игры
    gameInterval = setInterval(draw, 150);

    function draw() {
        // Очистка экрана
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем змейку
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? "green" : "white";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        // Рисуем еду
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        // Движение змейки
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === "LEFT") snakeX -= box;
        if (direction === "UP") snakeY -= box;
        if (direction === "RIGHT") snakeX += box;
        if (direction === "DOWN") snakeY += box;

        // Проверка на съедание еды
        if (snakeX === food.x && snakeY === food.y) {
            score++;
            food = { x: Math.floor(Math.random() * 10) * box, y: Math.floor(Math.random() * 10) * box };
            if (score === 7) { // Увеличено до 20 для завершения игры
                clearInterval(gameInterval);
                showAchievementMessage();
                unlockNextCell(currentTask);
                mapElement.style.display = "grid"; // Возвращаем карту
                taskDisplay.innerHTML = ""; // Очищаем дисплей задания
                return;
            }
        } else {
            snake.pop(); // Удаляем последний элемент змейки, если не съели еду
        }

        // Добавляем новую голову змейки
        let newHead = { x: snakeX, y: snakeY };

        // Проверка столкновения с границей или телом змейки
        if (
            snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height ||
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
            clearInterval(gameInterval);
            showGameOver();
            restartSnakeGame(); // Перезапускаем игру
            return;
        }

        snake.unshift(newHead);
    }

    function restartSnakeGame() {
        score = 0;
        direction = null;
        snake = [{ x: 4 * box, y: 4 * box }];
        food = { x: Math.floor(Math.random() * 10) * box, y: Math.floor(Math.random() * 10) * box };
        clearInterval(gameInterval);
        gameInterval = setInterval(draw, 150);
    }
}


function startFlappyBirdGame() {
    const mapElement = document.getElementById("map");
    const taskDisplay = document.getElementById("taskDisplay");

    if (!mapElement || !taskDisplay) {
        console.error("Элементы map или taskDisplay не найдены.");
        return;
    }

    mapElement.style.display = "none";
    taskDisplay.innerHTML = `<canvas id="flappyBirdGame" width="320" height="480" style="background-color: #70c5ce;"></canvas>`;
    
    const canvas = document.getElementById("flappyBirdGame");
    const ctx = canvas.getContext("2d");

    const bird = {
        x: 50,
        y: 150,
        width: 20,
        height: 20,
        gravity: 0.5,
        lift: -8,
        velocity: 0
    };

    let pipes = [];
    let score = 0;
    let isGameOver = false;
    let pipeCount = 0;
    const pipeFrequency = 2000;
    const gap = 100;
    const targetPipeCount = 5; // Целевое количество пройденных труб
    let pipeInterval;

    function drawBird() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function drawPipes() {
        ctx.fillStyle = "green";
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
        });
    }

    function createPipe() {
        const minHeight = 20;
        const maxHeight = canvas.height - gap - minHeight;
        const top = Math.random() * maxHeight + minHeight;
        const bottom = canvas.height - top - gap;
        pipes.push({ x: canvas.width, top: top, bottom: bottom, width: 20 });
    }

    function updatePipes() {
        if (isGameOver) return;

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= 2;
            if (pipes[i].x + pipes[i].width < 0) {
                pipes.splice(i, 1);
                score++;
                pipeCount++;
            }
        }

        if (pipeCount >= targetPipeCount) {
            showPipeAchievement();
            returnToMap();
        }
    }

    function returnToMap() {
        isGameOver = true; // Останавливаем игру
        mapElement.style.display = "grid"; // Показываем карту
        taskDisplay.innerHTML = ""; // Очищаем игровое поле
        pipes.length = 0; // Очищаем трубы
        score = 0; // Сбрасываем счет
    
        // Открываем следующую клетку после победы
        unlockNextCell(currentTask);
    
        pipeCount = 0; // Сбрасываем счетчик труб
    }
        

    function checkCollision() {
        if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
            isGameOver = true;
        }
        pipes.forEach(pipe => {
            if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x) {
                if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
                    isGameOver = true;
                }
            }
        });
    }

    function restartFlappyBird() {
        bird.y = 150;
        bird.velocity = 0;
        pipes = [];  // Очищаем массив труб для нового запуска
        pipeCount = 0;
        score = 0;
        isGameOver = false;
        
        clearInterval(pipeInterval); // Очищаем старый интервал, если он есть
        pipeInterval = setInterval(createPipe, pipeFrequency);  // Запускаем новый интервал для труб
        createPipe(); // Создаем первую трубу сразу
        requestAnimationFrame(gameLoop);
    }

    function gameLoop() {
        if (isGameOver) {
            setTimeout(restartFlappyBird, 500); // Задержка перед перезапуском
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        drawBird();
        updatePipes();
        drawPipes();
        checkCollision();
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            bird.velocity = bird.lift;
        }
    });

    // Добавление управления для мобильных устройств
    document.addEventListener("touchstart", (event) => {
        bird.velocity = bird.lift; // Поднимаем птицу при касании
    });

    restartFlappyBird();
}



let currentQuestionIndex = 0;

// Список вопросов для первой викторины
const quizQuestions = [
    { question: "Насколько я тебя люблю?", answers: ["100", "100.000.000.000.000", "∞"], correct: "∞" },
    { question: "Будем ли мы с тобой всегда счастливы?", answers: ["ДА", "Посмотрим", "Нет"], correct: "ДА" },
    { question: "Ты мечтала об таком как я и я мечтал о такой как ты?", answers: ["Нет", "ДА", "Почти"], correct: "ДА" },
];

// Список вопросов для второй викторины
const secondQuizQuestions = [
    { question: "Думаю ли я о тебе часто?", answers: ["Да, очень часто", "Практически нет", "Sometimes"], correct: "Да, очень часто" },
    { question: "Помогаешь ли ты мне в моей жизни?", answers: ["Конечно", "нет..", "без комментариев"], correct: "Конечно" },
    { question: "Мой любимый цвет это?", answers: ["Черный", "Голубой", "Нету"], correct: "Нету" },
];

function startQuiz() {
    const mapElement = document.getElementById("map");
    const taskDisplay = document.getElementById("taskDisplay");

    // Скрываем карту, чтобы показать только викторину
    mapElement.style.display = "none";

    function displayQuestion() {
        if (currentQuestionIndex >= quizQuestions.length) {
            showAllQuestionsAnswered();
            unlockNextCell(currentTask);

            // Возвращаем карту обратно после завершения викторины
            mapElement.style.display = "grid";
            taskDisplay.innerHTML = ""; // Очищаем содержимое задания
            return;
        }

        const question = quizQuestions[currentQuestionIndex];
        taskDisplay.innerHTML = `<p>${question.question}</p>`;
        question.answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.onclick = () => checkAnswer(answer);
            taskDisplay.appendChild(button);
        });
    }

    function checkAnswer(selected) {
        if (selected === quizQuestions[currentQuestionIndex].correct) {
            showCorrectAnswerFeedback();
            currentQuestionIndex++;
            displayQuestion();
        } else {
            showIncorrectAnswerFeedback();
        }
    }

    displayQuestion();
}

// Функция для запуска второй викторины
function startSecondQuiz() {
    const mapElement = document.getElementById("map");
    const taskDisplay = document.getElementById("taskDisplay");
    currentQuestionIndex = 0; // Сброс индекса вопросов для новой викторины

    // Скрываем карту, чтобы показать только викторину
    mapElement.style.display = "none";

    function displayQuestion() {
        if (currentQuestionIndex >= secondQuizQuestions.length) {
            showAllQuestionsAnswered();
            unlockNextCell(currentTask);

            // Возвращаем карту обратно после завершения викторины
            mapElement.style.display = "grid";
            taskDisplay.innerHTML = ""; // Очищаем содержимое задания
            return;
        }

        const question = secondQuizQuestions[currentQuestionIndex];
        taskDisplay.innerHTML = `<p>${question.question}</p>`;
        question.answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.onclick = () => checkAnswer(answer);
            taskDisplay.appendChild(button);
        });
    }

    function checkAnswer(selected) {
        if (selected === secondQuizQuestions[currentQuestionIndex].correct) {
            showCorrectAnswerFeedback();
            currentQuestionIndex++;
            displayQuestion();
        } else {
            showIncorrectAnswerFeedback();
        }
    }

    displayQuestion();
}


function showCorrectAnswer() {
    Swal.fire({
        title: 'Ответ верный!',
        text: 'Следующая клетка разблокирована.',
        icon: 'success',
        confirmButtonText: 'ОК'
    });
}

function showIncorrectAnswer() {
    Swal.fire({
        title: 'Ответ неверный',
        text: 'Попробуйте снова.',
        icon: 'error',
        confirmButtonText: 'ОК'
    });
}

function showAchievementMessage() {
    Swal.fire({
        title: 'Ты достигла 7 яблок!',
        text: 'Клетка разблокирована.',
        icon: 'success',
        confirmButtonText: 'ОК'
    });
}

function showGameOver() {
    Swal.fire({
        title: 'Игра окончена',
        text: 'Перезапускаем игру...',
        icon: 'warning',
        confirmButtonText: 'ОК'
    }).then(() => {
        restartSnakeGame(); // Здесь вы можете вызвать вашу функцию перезапуска
    });
}

function showPipeAchievement() {
    Swal.fire({
        title: 'Поздравляем!',
        text: 'Ты прошла 5 труб! Переход на следующую клетку...',
        icon: 'success',
        confirmButtonText: 'ОК'
    }).then(() => {
        returnToMap(); // Здесь вы можете вызвать вашу функцию возвращения к карте
    });
}

function showAllQuestionsAnswered() {
    Swal.fire({
        title: 'Ты успешно ответила на все вопросы!',
        text: 'Клетка разблокирована.',
        icon: 'success',
        confirmButtonText: 'ОК'
    });
}

function showCorrectAnswerFeedback() {
    Swal.fire({
        title: 'Правильный ответ!',
        icon: 'success',
        confirmButtonText: 'ОК'
    });
}

function showIncorrectAnswerFeedback() {
    Swal.fire({
        title: 'Неправильный ответ',
        text: 'Попробуйте снова.',
        icon: 'error',
        confirmButtonText: 'ОК'
    });
}


// Запускаем создание клеток
createCells();
