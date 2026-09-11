// Estado del juego
let diceValues = [1, 1, 1, 1, 1];
let heldDice = [false, false, false, false, false];
let turnsLeft = 10;
let hasRolled = false;

// Estado de combos completados
const combosCompleted = {
    trio: false,
    full: false,
    straight: false,
    generala: false
};

// Datos de la Investigación (Contenido de Infografías)[cite: 1]
const researchData = {
    trio: {
        title: "INFOGRAFÍA 1: EVOLUCIÓN DEL MERCADO (2016-2026)",
        desc: "¡Combo Trío Completado!",
        content: "<b>Hallazgo Académico:</b> Durante el periodo 2016–2026 en Bogotá, la disponibilidad física disminuyó en un 65% mientras el consumo por plataformas digitales y suscripciones (Game Pass, PS Plus) se consolidó como el canal principal de acceso."
    },
    full: {
        title: "INFOGRAFÍA 2: PERCEPCIÓN DE VALOR",
        desc: "¡Combo Full House Completado!",
        content: "<b>Hallazgo Académico:</b> El <i>Coleccionista</i> otorga valor simbólico al objeto físico, reventa y caja. El <i>Nativo Digital</i> prioriza la inmediatez, comodidad y precio bajo sobre la propiedad tangible."
    },
    straight: {
        title: "INFOGRAFÍA 3: PATRONES DE COMPRA BOGOTÁ",
        desc: "¡Combo Escalera Completado!",
        content: "<b>Hallazgo Académico:</b> Los jóvenes de 20-30 años en Bogotá realizan compras digitales impulsivas aprovechando rebajas de temporada, mientras que la compra de formato físico es planificada para títulos específicos de alto valor afectivo."
    },
    generala: {
        title: "INFOGRAFÍA 4: EL FENÓMENO DEL BACKLOG DIGITAL",
        desc: "¡Combo 5 Iguales Completado!",
        content: "<b>Hallazgo Académico:</b> La acumulación de licencias digitales sin jugar (<i>Backlog</i>) representa la nueva forma de consumo. El usuario acumula decenas de títulos en bibliotecas virtuales a los que raramente regresa."
    }
};

// Función para lanzar dados
function rollDice() {
    if (turnsLeft <= 0) return;

    for (let i = 0; i < 5; i++) {
        if (!heldDice[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }

    turnsLeft--;
    hasRolled = true;
    updateUI();
}

// Alternar dado retenido
function toggleHold(index) {
    if (!hasRolled) return;
    heldDice[index] = !heldDice[index];
    updateUI();
}

// Actualizar interfaz
function updateUI() {
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

// Lógica de evaluación de combos
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

// Reclamar combo y desbloquear infografía
function claimCombo(type) {
    if (combosCompleted[type]) return;

    if (checkCombo(type)) {
        combosCompleted[type] = true;
        document.getElementById(`card-${type}`).classList.add('completed');
        
        // Resetear reservas para el siguiente tiro
        heldDice = [false, false, false, false, false];
        
        showModal(type);
        updateUI();

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

// Modal
function showModal(type) {
    const data = researchData[type];
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-desc').innerText = data.desc;
    document.getElementById('modal-body').innerHTML = `
        <p>${data.content}</p>
        <p><small>* En tu versión final de GitHub puedes reemplazar este texto con la imagen <img src="assets/infografia_${type}.png"> de Canva.</small></p>
    `;
    document.getElementById('info-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('info-modal').classList.add('hidden');
}
