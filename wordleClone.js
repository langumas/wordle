const WORDS = [
    'ABABACHAR',  // Ababachar(se)  
    'ABACORAO',   // sin salida 
    'ABOCARRIBA', // boca arriba  
    'ABOMBAO',    // haber comido mucho  
    'ACHUCHARSE', // acurrucarse / comer rápido  
    'ACOTEJAR',   // acomodar, arreglar 
    'AGALLU',     // quiere todo para él 
    'AFRENTOSO',  // atrevido / vergonzoso  
    'BOCHINCHE',  // chisme / fiesta / alboroto   
    'MANGANZON',  // persona perezosa / inmadura 
    'RASQUIÑA',   // picazón, comezón  
    'DEGUAÑINGAO',// agotado / debilitado 
    'POLOCHE',   // tipo de camiseta "polo" local 
    'YEYO',      // “Yeyo” (desmayo) lo puse con L extra porque es más fácil adaptarlo  
    'VAINA',    // cosa cualquiera
    'CHIVO',    // cabra, también “chivo” como fraude
    'ÑAPA',     // extra, añadido
    'YIPETA',    // 
    'CORO',     // grupo de amigos 
    'FULLIN',   // trasero, nalgas 
    'PALOMO',   // alguien que se deja engañar 
    'MANGAR',   // conseguir/disfrutar algo 
    'KUKIKA',   // de mala calidad 
    'GUAREMATE',// “lambón”, hace mandados 
    'CHIN',      // pequeño, poca cosa
    'JEVI',    // genial, estupendo
    'FRESCO',   // descarado, sinvergüenza
    'PANA',     // amigo cercano 
    'CONCHO',    // taxi compartido 
    'BULTO',    // paquete, carga
    'KLK',
    'CHOPO',
    'JUMO',
    'BULTERO',
    'TRIPEAR',
    'RULAY',        // tranquilo, chill
    'FO',           // expresión de asco
    'JARTURA',      // comer demasiado
    'JARTAR',       // comer mucho
    'QUILLADO',     // molesto, irritado
    'CURTIO',       // con experiencia o “curtido”
    'APLATANADO',   // adaptado al estilo dominicano
    'ZAFACON',      // basurero
    'BREGAR',       // manejar/sortear una situación
    'JOSEAR',       // buscarse el dinero, rebuscar
    'TIGUERON',     // astuto, callejero
    'TATO',         // todo bien
    'PLANCHAO',     // muy bien hecho o perfecto
    'RAQUITIQUITO', // muy flaco
    'MOÑA',         // billete, dinero
    'PAPO',         // mentira o exageración
    'BACANO',       // chévere, cool
    'CUERO',        // prostituta (cuidado al usarlo)
    'PRIVAR',       // aparentar, hacerse el importante
    'COTORRA',      // labia/mentira
    'LAMBON',       // guaremate, persona que vive pegada
    'PELAO',        // sin dinero
    'APRETAO',      // tacaño
    'QUEMAO',       // cansado o fracasado en algo
    'DESGUABINAO',  // golpeado o maltratado
    'PIQUE',       // molestia, pique
    'MAQUINON',     // carro lujoso

];


let currentRow = 0;
let currentCol = 0;
let gameBoard = [];
let targetWord = '';
let wordLength = 5;
let gameOver = false;

function init() {
    setupKeyboard();
    newGame();
}

function createGameBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameBoard = [];

    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        gameBoard[i] = [];

        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${i}-${j}`;
            row.appendChild(tile);
            gameBoard[i][j] = '';
        }

        board.appendChild(row);
    }
}

function setupKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const keyValue = key.getAttribute('data-key');
            handleKeyPress(keyValue);
        });
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'enter') {
            handleKeyPress('enter');
        } else if (key === 'backspace') {
            handleKeyPress('backspace');
        } else if (key.match(/[a-zñ]/)) {
            handleKeyPress(key);
        }
    });
}

function newGame() {
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    wordLength = targetWord.length;

    currentRow = 0;
    currentCol = 0;
    gameOver = false;

    createGameBoard();
    resetKeyboard();

    document.getElementById('gameStats').style.display = 'none';

    console.log('Target word:', targetWord); 
}

function resetKeyboard() {
    document.querySelectorAll('.key').forEach(key => {
        key.className = key.classList.contains('wide') ? 'key wide' : 'key';
    });
}

function handleKeyPress(key) {
    if (gameOver) return;

    if (key === 'enter') {
        if (currentCol === wordLength) {
            submitGuess();
        } else {
            showMessage('No suficientes letras');
        }
    } 
    else if (key === 'backspace') {
        if (currentCol > 0) {
            currentCol--;
            const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
            tile.textContent = '';
            tile.classList.remove('filled');
            gameBoard[currentRow][currentCol] = '';
        }
    } 
    else if (key.match(/[a-zñ]/) && currentCol < wordLength) {
        const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
        tile.textContent = key.toUpperCase();
        tile.classList.add('filled');
        gameBoard[currentRow][currentCol] = key.toUpperCase();
        currentCol++;
    }
}

function submitGuess() {
    const guess = gameBoard[currentRow].join('');

    if (!WORDS.includes(guess)) {
        showMessage('No es una palabra en la lista');
        
    } 

    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    const letterCount = {};

    targetLetters.forEach(letter => {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    // Primera pasada: correctos
    for (let i = 0; i < wordLength; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            const tile = document.getElementById(`tile-${currentRow}-${i}`);
            tile.classList.add('correct');
            updateKeyboard(guessLetters[i], 'correct');
            letterCount[guessLetters[i]]--;
        }
    }

    // Segunda pasada: presentes y ausentes
    for (let i = 0; i < wordLength; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);

        if (!tile.classList.contains('correct')) {
            if (letterCount[guessLetters[i]] > 0) {
                tile.classList.add('present');
                updateKeyboard(guessLetters[i], 'present');
                letterCount[guessLetters[i]]--;
            } else {
                tile.classList.add('absent');
                updateKeyboard(guessLetters[i], 'absent');
            }
        }
    }

    if (guess === targetWord) {
        gameOver = true;
        setTimeout(() => {
            showMessage('¡Ganaste!');
            showStats(`Ganaste en ${currentRow + 1} intentos!`);
        }, 1000);

    } else if (currentRow === 5) {
        gameOver = true;
        setTimeout(() => {
            showMessage(`La palabra era: ${targetWord}`);
            showStats('Game over');
        }, 1000);

    } else {
        currentRow++;
        currentCol = 0;
    }
}

function updateKeyboard(letter, status) {
    const key = document.querySelector(`[data-key="${letter.toLowerCase()}"]`);
    if (key && !key.classList.contains('correct')) {
        if (status === 'correct' ||
            (status === 'present' && !key.classList.contains('present'))) {
            key.className = `key${key.classList.contains('wide') ? ' wide' : ''} ${status}`;
        } else if (status === 'absent' && 
                   !key.classList.contains('present')) {
            key.className = `key${key.classList.contains('wide') ? ' wide' : ''} ${status}`;
        }
    }
}

function showMessage(text) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

function showStats(result) {
    document.getElementById('gameResult').textContent = result;
    document.getElementById('gameStats').style.display = 'block';
}

init();
