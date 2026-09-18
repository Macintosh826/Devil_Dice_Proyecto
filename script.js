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
// JUEGO 1: DEVIL DICE (DADOS)
// ==========================================
let diceValues = [1, 1, 1, 1, 1];
let heldDice = [false, false, false, false, false];
let turnsLeft = 10;
let hasRolled = false;

const combosCompleted = {
    trio: false,
    full: false,
    straight: false,
    generala: false
};

const comboTitles = {
    trio: "INFOGRAFÍA 1: EVOLUCIÓN DEL MERCADO (2016-2026)",
    full: "INFOGRAFÍA 2: PERCEPCIÓN DE VALOR",
    straight: "INFOGRAFÍA 3: PATRONES DE COMPRA EN BOGOTÁ",
    generala: "INFOGRAFÍA 4: EL FENÓMENO DEL BACKLOG DIGITAL"
};

let academicFindings = [
    "Hallazgo Académico: La desmaterialización en los videojuegos no responde solo a la preferencia del usuario, sino a una decisión estratégica de la industria para eliminar costos de manufactura, almacenamiento y logística física, ampliando el alcance global.",
    "Hallazgo Académico: El factor de decisión más determinante para la adopción masiva del formato digital entre jóvenes de 20 a 30 años es la comodidad y la inmediatez de descarga, superando al precio y a la calidad percibida del producto.",
    "Hallazgo Académico: La transición a licencias digitales ha cambiado la propiedad por una licencia de uso condicionado, donde la plataforma puede modificar, restringir o revocar el acceso al contenido de forma unilateral.",
    "Hallazgo Académico: La satisfacción de uso, la disponibilidad inmediata y las funciones de juego en línea son predictores más sólidos de la intención de compra digital que la posesión del producto en sí.",
    "Hallazgo Académico: El consumidor del formato digital pierde la facultad de prestar, revender o conservar de forma autónoma sus videojuegos, asumiendo una asimetría de poder estructural frente a las plataformas de distribución.",
    "Hallazgo Académico: La desaparición del soporte físico elimina elementos simbólicos de alto valor afectivo para el usuario, como cajas impresas, portadas ilustradas, manuales y colecciones de ediciones especiales.",
    "Hallazgo Académico: En contextos latinoamericanos como Bogotá, la transición digital enfrenta brechas particulares como el acceso limitado a medios de pago internacionales y niveles de conectividad desigual.",
    "Hallazgo Académico: La existencia de mercados informales de videojuegos físicos en Bogotá actúa como una alternativa que aún sostiene la circulación del formato tangible frente a las tiendas digitales globales.",
    "Hallazgo Académico: El mercado global de videojuegos generó $187.700 millones de dólares en 2023, donde el segmento digital y los servicios de suscripción fueron el motor principal de crecimiento sobre el formato físico.",
    "Hallazgo Académico: El usuario mixto habita en una constante negociación entre el apego emocional a las ediciones físicas y la practicidad o rebajas del entorno digital.",
    "Hallazgo Académico: La migración a catálogos digitales ha transformado el valor del videojuego: ya no depende de la tenencia del soporte, sino de las comunidades, servicios e interacciones de la plataforma.",
    "Hallazgo Académico: En la población de 20 a 30 años en Bogotá, la primera generación testigo directo de la transición completa de soporte, la valoración del formato físico reaparece principalmente en títulos con fuerte valor nostálgico o afectivo.",
    "Hallazgo Académico: Las plataformas de distribución por suscripción (como Game Pass y PS Plus) han desplazado la compra individual de títulos hacia el consumo de catálogos rotativos bajo pago recurrente.",
    "Hallazgo Académico: El gasto en contenido digital a nivel global ha llevado a las ventas físicas a representar una fracción marginal del mercado global de entretenimiento interactivo.",
    "Hallazgo Académico: Las decisiones de compra en entornos digitales están altamente condicionadas por eventos de oferta temporal, impulsando compras no planificadas de licencias.",
    "Hallazgo Académico: La desmaterialización del consumo cultural modifica la relación económica del usuario, transitando del concepto tradicional de comprador de bienes al de suscriptor de servicios."
];

function rollDice() {
    if (turnsLeft <= 0) return;

    for (let i = 0; i < 5; i++) {
        if (!heldDice[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }

    turnsLeft--;
    hasRolled = true;
    updateDiceUI();
}

function toggleHold(index) {
    if (!hasRolled) return;
    heldDice[index] = !heldDice[index];
    updateDiceUI();
}

function updateDiceUI() {
    document.getElementById('turns-left').innerText = turnsLeft;
    
    const diceElements = document.querySelectorAll('.die');
    diceElements.forEach((el, index) => {
        el.innerText = hasRolled ? diceValues[index] : '?';
        if (heldDice[index]) {
            el.classList.add('held');
        } else {
            el.classList.remove('held');
        }
    });

    if (turnsLeft === 0 && !checkAllCompleted()) {
        document.getElementById('game-message').innerText = "¡Se agotaron los turnos! Intenta de nuevo.";
        document.getElementById('btn-roll').disabled = true;
    }
}

function getFrequencies() {
    const counts = {};
    diceValues.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
    return Object.values(counts);
}

function checkCombo(type) {
    if (!hasRolled) return false;
    const freqs = getFrequencies();

    if (type === 'trio') {
        return freqs.some(count => count >= 3);
    }
    if (type === 'full') {
        return (freqs.includes(3) && freqs.includes(2)) || freqs.includes(5);
    }
    if (type === 'straight') {
        const uniqueSorted = [...new Set(diceValues)].sort((a,b) => a-b);
        let maxSeq = 1, currentSeq = 1;
        for (let i = 0; i < uniqueSorted.length - 1; i++) {
            if (uniqueSorted[i+1] === uniqueSorted[i] + 1) {
                currentSeq++;
                maxSeq = Math.max(maxSeq, currentSeq);
            } else {
                currentSeq = 1;
            }
        }
        return maxSeq >= 4;
    }
    if (type === 'generala') {
        return freqs.includes(5);
    }
    return false;
}

function claimCombo(type) {
    if (combosCompleted[type]) return;

    if (checkCombo(type)) {
        combosCompleted[type] = true;
        document.getElementById(`card-${type}`).classList.add('completed');
        
        const btn = document.querySelector(`#card-${type} .btn-claim`);
        if (btn) btn.disabled = true;

        heldDice = [false, false, false, false, false];
        
        showDiceModal(type);
        updateDiceUI();

        if (checkAllCompleted()) {
            document.getElementById('game-message').innerText = "¡FELICITACIONES! Has desbloqueado toda la investigación.";
        }
    } else {
        alert("Los dados actuales no cumplen con la condición de este combo. ¡Sigue intentando!");
    }
}

function checkAllCompleted() {
    return Object.values(combosCompleted).every(val => val === true);
}

function getRandomFinding() {
    if (academicFindings.length === 0) {
        return "Hallazgo Académico: Has revisado todos los datos disponibles de la investigación.";
    }
    const randomIndex = Math.floor(Math.random() * academicFindings.length);
    const selectedFinding = academicFindings[randomIndex];
    academicFindings.splice(randomIndex, 1);
    return selectedFinding;
}

function showDiceModal(type) {
    const title = comboTitles[type];
    const randomFinding = getRandomFinding();

    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = `
        <div style="font-size: 0.95rem; line-height: 1.5; padding: 15px; color: #FFF;">
            <p><strong>${randomFinding}</strong></p>
        </div>
    `;
    document.getElementById('info-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('info-modal').classList.add('hidden');
}

// ==========================================
// JUEGO 2: CRESCENT SOLITAIRE
// ==========================================
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let foundationsTop = [];
let foundationsBot = [];
let outerPiles = Array.from({ length: 16 }, () => []);
let selectedCard = null;
let shufflesLeft = 6;

function initCrescentGame() {
    shufflesLeft = 6;
    selectedCard = null;
    document.getElementById('shuffles-left').innerText = shufflesLeft;

    let deck = [];
    for (let d = 0; d < 2; d++) {
        for (let s of suits) {
            for (let v of values) {
                deck.push({ suit: s, value: v, rank: values.indexOf(v) + 1 });
            }
        }
    }
    
    deck.sort(() => Math.random() - 0.5);

    foundationsTop = [];
    foundationsBot = [];

    suits.forEach(s => {
        let kIndex = deck.findIndex(c => c.value === 'K' && c.suit === s);
        foundationsTop.push([deck.splice(kIndex, 1)[0]]);

        let aIndex = deck.findIndex(c => c.value === 'A' && c.suit === s);
        foundationsBot.push([deck.splice(aIndex, 1)[0]]);
    });

    outerPiles = Array.from({ length: 16 }, () => []);
    let pileIdx = 0;
    while (deck.length > 0) {
        outerPiles[pileIdx % 16].push(deck.pop());
        pileIdx++;
    }

    renderCrescentBoard();
}

function renderCrescentBoard() {
    foundationsTop.forEach((stack, i) => {
        const el = document.getElementById(`f-top-${i}`);
        const topCard = stack[stack.length - 1];
        el.innerHTML = `${topCard.value}<br>${topCard.suit}`;
        el.className = `card-slot foundation ${['♥','♦'].includes(topCard.suit) ? 'red' : 'black'}`;
    });

    foundationsBot.forEach((stack, i) => {
        const el = document.getElementById(`f-bot-${i}`);
        const topCard = stack[stack.length - 1];
        el.innerHTML = `${topCard.value}<br>${topCard.suit}`;
        el.className = `card-slot foundation ${['♥','♦'].includes(topCard.suit) ? 'red' : 'black'}`;
    });

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
    alert(`Carta seleccionada: ${selectedCard.card.value} de ${selectedCard.card.suit}. Haz clic en la base del centro para moverla.`);
}

function placeOnFoundation(type, foundationIndex) {
    if (!selectedCard) return;

    let targetStack = (type === 'top') ? foundationsTop[foundationIndex] : foundationsBot[foundationIndex];
    let topCard = targetStack[targetStack.length - 1];
    let cardToMove = selectedCard.card;

    if (cardToMove.suit === topCard.suit) {
        if (type === 'top' && cardToMove.rank === topCard.rank - 1) {
            targetStack.push(outerPiles[selectedCard.pileIndex].pop());
        } else if (type === 'bot' && cardToMove.rank === topCard.rank + 1) {
            targetStack.push(outerPiles[selectedCard.pileIndex].pop());
        } else {
            alert("Movimiento inválido. Revisa la secuencia.");
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
}
