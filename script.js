document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameContainer = document.getElementById('game-container');
    const walls = document.querySelectorAll('.wall');
    const letters = document.querySelectorAll('.letter');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeButton = document.getElementById('close-button');

    let playerPos = { x: 10, y: 10 };
    const playerSpeed = 3; // Velocidade ajustada para o loop de animação
    let lettersCollected = 0;

    // Objeto para rastrear o estado do movimento
    const movement = { up: false, down: false, left: false, right: false };

    function updatePlayerPosition() {
        player.style.left = playerPos.x + 'px';
        player.style.top = playerPos.y + 'px';
    }

    function isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    }

    function checkWallCollision(newX, newY) {
        const playerRect = { left: newX, top: newY, right: newX + player.offsetWidth, bottom: newY + player.offsetHeight };
        if (playerRect.left < 0 || playerRect.right > gameContainer.clientWidth || playerRect.top < 0 || playerRect.bottom > gameContainer.clientHeight) {
            return true;
        }
        for (const wall of walls) {
            const relativeWallRect = { left: wall.offsetLeft, top: wall.offsetTop, right: wall.offsetLeft + wall.offsetWidth, bottom: wall.offsetTop + wall.offsetHeight };
            if (isColliding(playerRect, relativeWallRect)) {
                return true;
            }
        }
        return false;
    }

    function checkLetterCollision() {
        const playerRect = player.getBoundingClientRect();
        letters.forEach(letter => {
            if (letter.style.display !== 'none') {
                if (isColliding(player.getBoundingClientRect(), letter.getBoundingClientRect())) {
                    letter.style.display = 'none';
                    lettersCollected++;
                    showMessage(letter.dataset.message);
                }
            }
        });
    }

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.classList.remove('hidden');
        if (lettersCollected === letters.length) {
            setTimeout(() => {
                messageText.innerHTML += "<br><br><strong>Parabéns! Você encontrou todas as declarações de amor!</strong>";
            }, 100);
        }
    }

    closeButton.addEventListener('click', () => messageBox.classList.add('hidden'));

    // --- Lógica de Controle Unificada ---
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': movement.up = true; break;
            case 'ArrowDown': movement.down = true; break;
            case 'ArrowLeft': movement.left = true; break;
            case 'ArrowRight': movement.right = true; break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowUp': movement.up = false; break;
            case 'ArrowDown': movement.down = false; break;
            case 'ArrowLeft': movement.left = false; break;
            case 'ArrowRight': movement.right = false; break;
        }
    });

    // Eventos para os botões na tela (mouse e toque)
    const setupButtonEvents = (button, direction) => {
        button.addEventListener('mousedown', () => movement[direction] = true);
        button.addEventListener('mouseup', () => movement[direction] = false);
        button.addEventListener('mouseleave', () => movement[direction] = false);
        button.addEventListener('touchstart', (e) => { e.preventDefault(); movement[direction] = true; });
        button.addEventListener('touchend', (e) => { e.preventDefault(); movement[direction] = false; });
    };

    setupButtonEvents(document.getElementById('btn-up'), 'up');
    setupButtonEvents(document.getElementById('btn-down'), 'down');
    setupButtonEvents(document.getElementById('btn-left'), 'left');
    setupButtonEvents(document.getElementById('btn-right'), 'right');

    // --- Game Loop Principal ---
    function gameLoop() {
        if (messageBox.classList.contains('hidden')) {
            let newX = playerPos.x;
            let newY = playerPos.y;

            if (movement.up) newY -= playerSpeed;
            if (movement.down) newY += playerSpeed;
            if (movement.left) newX -= playerSpeed;
            if (movement.right) newX += playerSpeed;
            
            // Move no eixo X se não houver colisão
            if (newX !== playerPos.x && !checkWallCollision(newX, playerPos.y)) {
                playerPos.x = newX;
            }
            // Move no eixo Y se não houver colisão
            if (newY !== playerPos.y && !checkWallCollision(playerPos.x, newY)) {
                playerPos.y = newY;
            }

            updatePlayerPosition();
            checkLetterCollision();
        }
        requestAnimationFrame(gameLoop); // Continua o loop
    }

    updatePlayerPosition();
    gameLoop(); // Inicia o loop do jogo
});