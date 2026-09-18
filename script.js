// ==========================================
// SELECCIÓN DE PANTALLAS
// ==========================================
function selectGame(gameType) {
    document.getElementById('game-selector-screen').classList.add('hidden');
    if (gameType === 'dice') {
        document.getElementById('dice-game-section').classList.remove('hidden');
    } else if (gameType === 'crescent') {
        document.getElementById('crescent-game-section').classList.remove('hidden');
        initCrescentGame();
    }
}

function showSelector() {
    document.getElementById('dice-game-section').classList.add('hidden');
    document.getElementById('crescent-game-section').classList.add('hidden');
    document.getElementById('game-selector-screen').classList.remove('hidden');
}

// ==========================================
// LÓGICA CRESCENT SOLITAIRE
// ==========================================
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let foundationsTop = []; // K a A
let foundationsBot = []; // A a K
let outerPiles = Array.from({ length: 16 }, () => []);
let selectedCard = null;
let shufflesLeft = 6;

function initCrescentGame() {
    shufflesLeft = 6;
    selectedCard = null;
    document.getElementById('shuffles-left').innerText = shufflesLeft;

    // Crear 2 barajas completas
    let deck = [];
    for (let d = 0; d < 2; d++) {
        for (let s of suits) {
            for (let v of values) {
                deck.push({ suit: s, value: v, rank: values.indexOf(v) + 1 });
            }
        }
    }
    
    // Mezclar baraja
    deck.sort(() => Math.random() - 0.5);

    // Extraer 4 Reyes (K) para arriba y 4 Ases (A) para abajo
    foundationsTop = [];
    foundationsBot = [];

    suits.forEach(s => {
        let kIndex = deck.findIndex(c => c.value === 'K' && c.suit === s);
        foundationsTop.push([deck.splice(kIndex, 1)[0]]);

        let aIndex = deck.findIndex(c => c.value === 'A' && c.suit === s);
        foundationsBot.push([deck.splice(aIndex, 1)[0]]);
    });

    // Repartir las cartas restantes en los 16 montones
    outerPiles = Array.from({ length: 16 }, () => []);
    let pileIdx = 0;
    while (deck.length > 0) {
        outerPiles[pileIdx % 16].push(deck.pop());
        pileIdx++;
    }

    renderCrescentBoard();
}

function renderCrescentBoard() {
    // Renderizar Bases Superiores (K -> A)
    foundationsTop.forEach((stack, i) => {
        const el = document.getElementById(`f-top-${i}`);
        const topCard = stack[stack.length - 1];
        el.innerHTML = `${topCard.value}<br>${topCard.suit}`;
        el.className = `card-slot foundation ${['♥','♦'].includes(topCard.suit) ? 'red' : 'black'}`;
    });

    // Renderizar Bases Inferiores (A -> K)
    foundationsBot.forEach((stack, i) => {
        const el = document.getElementById(`f-bot-${i}`);
        const topCard = stack[stack.length - 1];
        el.innerHTML = `${topCard.value}<br>${topCard.suit}`;
        el.className = `card-slot foundation ${['♥','♦'].includes(topCard.suit) ? 'red' : 'black'}`;
    });

    // Renderizar 16 montones externos
    const container = document.getElementById('outer-piles-container');
    container.innerHTML = '';
    outerPiles.forEach((pile, i) => {
        const slot = document.createElement('div');
        slot.className = 'pile-slot';
        if (pile.length > 0) {
            const topCard = pile[pile.length - 1];
            const isRed = ['♥','♦'].includes(topCard.suit);
            slot.innerHTML = `<div class="card-slot ${isRed ? 'red' : 'black'}" onclick="selectOuterCard(${i})">
                ${topCard.value}<br>${topCard.suit}
            </div>`;
        }
        container.appendChild(slot);
    });
}

function selectOuterCard(pileIndex) {
    if (outerPiles[pileIndex].length === 0) return;
    selectedCard = { pileIndex, card: outerPiles[pileIndex][outerPiles[pileIndex].length - 1] };
    alert(`Carta seleccionada: ${selectedCard.card.value} de ${selectedCard.card.suit}. Ahora haz clic en la base correspondiente para colocarla.`);
}

function placeOnFoundation(type, foundationIndex) {
    if (!selectedCard) return;

    let targetStack = (type === 'top') ? foundationsTop[foundationIndex] : foundationsBot[foundationIndex];
    let topCard = targetStack[targetStack.length - 1];
    let cardToMove = selectedCard.card;

    // Regla: mismo palo
    if (cardToMove.suit === topCard.suit) {
        // En fila superior: orden descendente (ej. de K baja a Q, J...)
        if (type === 'top' && cardToMove.rank === topCard.rank - 1) {
            targetStack.push(outerPiles[selectedCard.pileIndex].pop());
        }
        // En fila inferior: orden ascendente (ej. de A sube a 2, 3...)
        else if (type === 'bot' && cardToMove.rank === topCard.rank + 1) {
            targetStack.push(outerPiles[selectedCard.pileIndex].pop());
        } else {
            alert("Movimiento inválido. Revisa la secuencia numérica.");
            return;
        }
    } else {
        alert("La carta debe ser del mismo palo.");
        return;
    }

    selectedCard = null;
    renderCrescentBoard();
    checkCrescentWin();
}

function shuffleCrescent() {
    if (shufflesLeft <= 0) {
        alert("Has agotado las 6 barajadas permitidas.");
        return;
    }
    shufflesLeft--;
    document.getElementById('shuffles-left').innerText = shufflesLeft;

    // Mueve la carta del fondo de cada montón hacia arriba
    outerPiles.forEach(pile => {
        if (pile.length > 1) {
            let bottom = pile.shift();
            pile.push(bottom);
        }
    });

    renderCrescentBoard();
}

function checkCrescentWin() {
    let topComplete = foundationsTop.every(s => s.length === 13);
    let botComplete = foundationsBot.every(s => s.length === 13);

    if (topComplete && botComplete) {
        showVideoModal();
    }
}

function showVideoModal() {
    document.getElementById('modal-title').innerText = "¡VICTORIA EN CRESCENT SOLITAIRE!";
    document.getElementById('modal-body').innerHTML = `
        <p>¡Has completado todas las secuencias de cartas!</p>
        <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin-top:15px;">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen 
                style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>
        </div>
    `;
    document.getElementById('info-modal').classList.remove('hidden');
}
