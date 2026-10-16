// ==========================================
// 1. SELECCIÓN DE PANTALLAS (REGISTRADO PRIMERO)
// ==========================================
function selectGame(gameType) {
    var selector = document.getElementById('game-selector-screen');
    var diceSec = document.getElementById('dice-game-section');
    var crescentSec = document.getElementById('crescent-game-section');
    var crazySec = document.getElementById('crazyeights-game-section');

    if (selector) selector.classList.add('hidden');

    if (gameType === 'dice' && diceSec) {
        diceSec.classList.remove('hidden');
    } else if (gameType === 'crescent' && crescentSec) {
        crescentSec.classList.remove('hidden');
        if (typeof initCrescentGame === 'function') initCrescentGame();
    } else if (gameType === 'crazyeights' && crazySec) {
        crazySec.classList.remove('hidden');
        if (typeof initCrazyEightsGame === 'function') initCrazyEightsGame();
    }
}

function showSelector() {
    var selector = document.getElementById('game-selector-screen');
    var diceSec = document.getElementById('dice-game-section');
    var crescentSec = document.getElementById('crescent-game-section');
    var crazySec = document.getElementById('crazyeights-game-section');

    if (diceSec) diceSec.classList.add('hidden');
    if (crescentSec) crescentSec.classList.add('hidden');
    if (crazySec) crazySec.classList.add('hidden');
    if (selector) selector.classList.remove('hidden');
}

// ==========================================
// 2. JUEGO 1: DEVIL DICE (DADOS)
// ==========================================
var diceValues = [1, 1, 1, 1, 1];
var heldDice = [false, false, false, false, false];
var turnsLeft = 10;
var hasRolled = false;

var combosCompleted = {
    trio: false,
    full: false,
    straight: false,
    generala: false
};

var comboTitles = {
    trio: "INFOGRAFÍA 1: EVOLUCIÓN DEL MERCADO (2016-2026)",
    full: "INFOGRAFÍA 2: PERCEPCIÓN DE VALOR",
    straight: "INFOGRAFÍA 3: PATRONES DE COMPRA EN BOGOTÁ",
    generala: "INFOGRAFÍA 4: EL FENÓMENO DEL BACKLOG DIGITAL"
};

var academicFindings = [
    "Hallazgo Académico: La desmaterialización en los videojuegos responde a una decisión estratégica de la industria para eliminar costos de manufactura y distribución.",
    "Hallazgo Académico: El factor decisivo para el formato digital es la comodidad e inmediatez de descarga.",
    "Hallazgo Académico: Las licencias digitales cambian la propiedad por un derecho de uso condicionado.",
    "Hallazgo Académico: La disponibilidad inmediata es un predictor sólido de la intención de compra."
];

function rollDice() {
    if (turnsLeft <= 0) return;
    for (var i = 0; i < 5; i++) {
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
    var turnsEl = document.getElementById('turns-left');
    if (turnsEl) turnsEl.innerText = turnsLeft;

    var diceElements = document.querySelectorAll('.die');
    diceElements.forEach(function(el, index) {
        el.innerText = hasRolled ? diceValues[index] : '?';
        if (heldDice[index]) {
            el.classList.add('held');
        } else {
            el.classList.remove('held');
        }
    });

    var msgEl = document.getElementById('game-message');
    var btnRoll = document.getElementById('btn-roll');
    if (turnsLeft === 0 && !checkAllCompleted()) {
        if (msgEl) msgEl.innerText = "¡Se agotaron los turnos! Intenta de nuevo.";
        if (btnRoll) btnRoll.disabled = true;
    }
}

function getFrequencies() {
    var counts = {};
    diceValues.forEach(function(x) { counts[x] = (counts[x] || 0) + 1; });
    return Object.values(counts);
}

function checkCombo(type) {
    if (!hasRolled) return false;
    var freqs = getFrequencies();

    if (type === 'trio') return freqs.some(function(count) { return count >= 3; });
    if (type === 'full') return (freqs.includes(3) && freqs.includes(2)) || freqs.includes(5);
    if (type === 'straight') {
        var uniqueSorted = Array.from(new Set(diceValues)).sort(function(a,b) { return a - b; });
        var maxSeq = 1, currentSeq = 1;
        for (var i = 0; i < uniqueSorted.length - 1; i++) {
            if (uniqueSorted[i+1] === uniqueSorted[i] + 1) {
                currentSeq++;
                maxSeq = Math.max(maxSeq, currentSeq);
            } else {
                currentSeq = 1;
            }
        }
        return maxSeq >= 4;
    }
    if (type === 'generala') return freqs.includes(5);
    return false;
}

function claimCombo(type) {
    if (combosCompleted[type]) return;

    if (checkCombo(type)) {
        combosCompleted[type] = true;
        var cardEl = document.getElementById('card-' + type);
        if (cardEl) cardEl.classList.add('completed');

        var btn = document.querySelector('#card-' + type + ' .btn-claim');
        if (btn) btn.disabled = true;

        heldDice = [false, false, false, false, false];
        showDiceModal(type);
        updateDiceUI();

        var msgEl = document.getElementById('game-message');
        if (checkAllCompleted() && msgEl) {
            msgEl.innerText = "¡FELICITACIONES! Has desbloqueado toda la investigación.";
        }
    } else {
        alert("Los dados actuales no cumplen con la condición de este combo.");
    }
}

function checkAllCompleted() {
    return Object.values(combosCompleted).every(function(val) { return val === true; });
}

function showDiceModal(type) {
    var title = comboTitles[type];
    var randomFinding = academicFindings[Math.floor(Math.random() * academicFindings.length)];

    var modalTitle = document.getElementById('modal-title');
    var modalBody = document.getElementById('modal-body');
    var infoModal = document.getElementById('info-modal');

    if (modalTitle) modalTitle.innerText = title;
    if (modalBody) {
        modalBody.innerHTML = '<div style="font-size: 0.95rem; line-height: 1.5; padding: 15px; color: #FFF;"><p><strong>' + randomFinding + '</strong></p></div>';
    }
    if (infoModal) infoModal.classList.remove('hidden');
}

function closeModal() {
    var infoModal = document.getElementById('info-modal');
    if (infoModal) infoModal.classList.add('hidden');
}

// ==========================================
// 3. JUEGO 2: CRESCENT SOLITAIRE
// ==========================================
var suits = ['♠', '♥', '♦', '♣'];
var values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

var foundationsTop = [];
var foundationsBot = [];
var outerPiles = Array.from({ length: 16 }, function() { return []; });
var selectedCard = null;
var shufflesLeft = 6;

function initCrescentGame() {
    shufflesLeft = 6;
    selectedCard = null;
    var shufflesEl = document.getElementById('shuffles-left');
    if (shufflesEl) shufflesEl.innerText = shufflesLeft;

    var deck = [];
    for (var d = 0; d < 2; d++) {
        for (var i = 0; i < suits.length; i++) {
            for (var j = 0; j < values.length; j++) {
                deck.push({ suit: suits[i], value: values[j], rank: j + 1 });
            }
        }
    }
    
    deck.sort(function() { return Math.random() - 0.5; });

    foundationsTop = [];
    foundationsBot = [];

    suits.forEach(function(s) {
        var kIndex = deck.findIndex(function(c) { return c.value === 'K' && c.suit === s; });
        foundationsTop.push([deck.splice(kIndex, 1)[0]]);

        var aIndex = deck.findIndex(function(c) { return c.value === 'A' && c.suit === s; });
        foundationsBot.push([deck.splice(aIndex, 1)[0]]);
    });

    outerPiles = Array.from({ length: 16 }, function() { return []; });
    var pileIdx = 0;
    while (deck.length > 0) {
        outerPiles[pileIdx % 16].push(deck.pop());
        pileIdx++;
    }

    renderCrescentBoard();
}

function renderCrescentBoard() {
    foundationsTop.forEach(function(stack, i) {
        var el = document.getElementById('f-top-' + i);
        if (el) {
            var topCard = stack[stack.length - 1];
            el.innerHTML = topCard.value + '<br>' + topCard.suit;
            el.className = 'card-slot foundation ' + (['♥','♦'].includes(topCard.suit) ? 'red' : 'black');
        }
    });

    foundationsBot.forEach(function(stack, i) {
        var el = document.getElementById('f-bot-' + i);
        if (el) {
            var topCard = stack[stack.length - 1];
            el.innerHTML = topCard.value + '<br>' + topCard.suit;
            el.className = 'card-slot foundation ' + (['♥','♦'].includes(topCard.suit) ? 'red' : 'black');
        }
    });

    var container = document.getElementById('outer-piles-container');
    if (container) {
        container.innerHTML = '';
        outerPiles.forEach(function(pile, i) {
            var slot = document.createElement('div');
            slot.className = 'pile-slot';
            if (pile.length > 0) {
                var topCard = pile[pile.length - 1];
                var isRed = ['♥','♦'].includes(topCard.suit);
                slot.innerHTML = '<div class="card-slot ' + (isRed ? 'red' : 'black') + '" onclick="selectOuterCard(' + i + ')">' + topCard.value + '<br>' + topCard.suit + '</div>';
            }
            container.appendChild(slot);
        });
    }
}

function selectOuterCard(pileIndex) {
    if (outerPiles[pileIndex].length === 0) return;
    selectedCard = { pileIndex: pileIndex, card: outerPiles[pileIndex][outerPiles[pileIndex].length - 1] };
    alert("Carta seleccionada: " + selectedCard.card.value + " de " + selectedCard.card.suit);
}

function placeOnFoundation(type, foundationIndex) {
    if (!selectedCard) return;

    var targetStack = (type === 'top') ? foundationsTop[foundationIndex] : foundationsBot[foundationIndex];
    var topCard = targetStack[targetStack.length - 1];
    var cardToMove = selectedCard.card;

    if (cardToMove.suit === topCard.suit) {
        if (type === 'top' && cardToMove.rank === topCard.rank - 1) {
            targetStack.push(outerPiles[selectedCard.pileIndex].pop());
        } else if (type === 'bot' && cardToMove.rank === topCard.rank + 1) {
            targetStack.push(outerPiles[selectedCard.pileIndex].pop());
        } else {
            alert("Movimiento inválido.");
            return;
        }
    } else {
        alert("La carta debe ser del mismo palo.");
        return;
    }

    selectedCard = null;
    renderCrescentBoard();
}

function shuffleCrescent() {
    if (shufflesLeft <= 0) {
        alert("Sin barajadas restantes.");
        return;
    }
    shufflesLeft--;
    var shufflesEl = document.getElementById('shuffles-left');
    if (shufflesEl) shufflesEl.innerText = shufflesLeft;

    outerPiles.forEach(function(pile) {
        if (pile.length > 1) {
            var bottom = pile.shift();
            pile.push(bottom);
        }
    });

    renderCrescentBoard();
}

// ==========================================
// 4. JUEGO 3: OCHO LOCO (CRAZY EIGHTS)
// ==========================================
var ceDeck = [];
var ceUserHand = [];
var ceBotHand = [];
var ceDiscardPile = [];
var ceCurrentSuit = '';
var ceSelectedIndices = [];
var ceDrawnThisTurn = 0;
var ceIsUserTurn = true;
var ceIsGameOver = false;

function createCrazyEightsDeck() {
    ceDeck = [];
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            ceDeck.push({ suit: suits[i], value: values[j] });
        }
    }
    ceDeck.sort(function() { return Math.random() - 0.5; });
}

function initCrazyEightsGame() {
    createCrazyEightsDeck();
    ceUserHand = [];
    ceBotHand = [];
    ceDiscardPile = [];
    ceSelectedIndices = [];
    ceDrawnThisTurn = 0;
    ceIsUserTurn = true;
    ceIsGameOver = false;

    for (var i = 0; i < 7; i++) {
        ceUserHand.push(ceDeck.pop());
        ceBotHand.push(ceDeck.pop());
    }

    var top = ceDeck.pop();
    ceDiscardPile.push(top);
    ceCurrentSuit = top.suit;

    setCEStatus(top.value === '8' ? "Carta inicial: 8." : "¡Juego iniciado!");
    renderCrazyEightsBoard();
}

function setCEStatus(msg) {
    var el = document.getElementById('ce-status-msg');
    if (el) el.innerText = msg;
}

function renderCrazyEightsBoard() {
    var dCount = document.getElementById('deck-count');
    var bCount = document.getElementById('bot-count');
    var sDisplay = document.getElementById('current-suit-display');

    if (dCount) dCount.innerText = ceDeck.length;
    if (bCount) bCount.innerText = ceBotHand.length;
    if (sDisplay) sDisplay.innerText = ceCurrentSuit;

    var botHandEl = document.getElementById('bot-hand');
    if (botHandEl) {
        botHandEl.innerHTML = '';
        ceBotHand.forEach(function() {
            var cardDiv = document.createElement('div');
            cardDiv.className = 'ce-card back';
            botHandEl.appendChild(cardDiv);
        });
    }

    var topCardContainer = document.getElementById('top-card-container');
    if (topCardContainer) {
        topCardContainer.innerHTML = '';
        if (ceDiscardPile.length > 0) {
            topCardContainer.appendChild(createCECardElement(ceDiscardPile[ceDiscardPile.length - 1]));
        }
    }

    var userHandEl = document.getElementById('user-hand');
    if (userHandEl) {
        userHandEl.innerHTML = '';
        ceUserHand.forEach(function(card, index) {
            var cardEl = createCECardElement(card);
            if (ceSelectedIndices.includes(index)) {
                cardEl.classList.add('selected');
            }
            cardEl.onclick = function() { toggleSelectUserCard(index); };
            userHandEl.appendChild(cardEl);
        });
    }

    var playBtn = document.getElementById('ce-play-btn');
    var passBtn = document.getElementById('ce-pass-btn');

    if (playBtn) playBtn.disabled = !ceIsUserTurn || ceSelectedIndices.length === 0 || ceIsGameOver;
    if (passBtn) passBtn.disabled = !ceIsUserTurn || ceDrawnThisTurn === 0 || ceIsGameOver;
}

function createCECardElement(card) {
    var cardDiv = document.createElement('div');
    var isRed = ['♥', '♦'].includes(card.suit);
    cardDiv.className = 'ce-card ' + (isRed ? 'red' : 'black');
    cardDiv.innerHTML = '<div>' + card.value + '</div><div class="suit-center">' + card.suit + '</div><div style="text-align: right;">' + card.value + '</div>';
    return cardDiv;
}

function toggleSelectUserCard(index) {
    if (!ceIsUserTurn || ceIsGameOver) return;
    var pos = ceSelectedIndices.indexOf(index);
    if (pos > -1) {
        ceSelectedIndices.splice(pos, 1);
    } else {
        if (ceSelectedIndices.length > 0) {
            var firstCard = ceUserHand[ceSelectedIndices[0]];
            var currentCard = ceUserHand[index];
            if (firstCard.value !== currentCard.value) {
                ceSelectedIndices = [index];
            } else {
                ceSelectedIndices.push(index);
            }
        } else {
            ceSelectedIndices.push(index);
        }
    }
    renderCrazyEightsBoard();
}

function playSelectedCards() {
    if (!ceIsUserTurn || ceSelectedIndices.length === 0 || ceIsGameOver) return;

    var cardsToPlay = ceSelectedIndices.map(function(i) { return ceUserHand[i]; });
    var firstCard = cardsToPlay[0];
    var topCard = ceDiscardPile[ceDiscardPile.length - 1];

    var isValidMove = (firstCard.value === '8') || (firstCard.suit === ceCurrentSuit) || (firstCard.value === topCard.value);

    if (!isValidMove) {
        setCEStatus("Jugada inválida.");
        return;
    }

    ceSelectedIndices.sort(function(a, b) { return b - a; }).forEach(function(i) {
        ceUserHand.splice(i, 1);
    });

    cardsToPlay.forEach(function(c) { ceDiscardPile.push(c); });
    ceSelectedIndices = [];
    ceDrawnThisTurn = 0;

    var lastPlayed = cardsToPlay[cardsToPlay.length - 1];

    if (lastPlayed.value === '8') {
        var suitModal = document.getElementById('suit-modal');
        if (suitModal) suitModal.classList.remove('hidden');
        renderCrazyEightsBoard();
        return;
    } else {
        ceCurrentSuit = lastPlayed.suit;
    }

    if (checkCrazyEightsWin()) return;

    ceIsUserTurn = false;
    setCEStatus("Turno de la IA...");
    renderCrazyEightsBoard();
    setTimeout(botTurn, 1000);
}

function selectSuit(suit) {
    ceCurrentSuit = suit;
    var suitModal = document.getElementById('suit-modal');
    if (suitModal) suitModal.classList.add('hidden');

    if (checkCrazyEightsWin()) return;

    ceIsUserTurn = false;
    setCEStatus("Palo cambiado a " + suit + ". Turno IA...");
    renderCrazyEightsBoard();
    setTimeout(botTurn, 1000);
}

function drawCardUser() {
    if (!ceIsUserTurn || ceIsGameOver) return;
    if (ceDeck.length === 0) return;

    var drawnCard = ceDeck.pop();
    ceUserHand.push(drawnCard);
    ceDrawnThisTurn++;
    setCEStatus("Robaste una carta.");
    renderCrazyEightsBoard();
}

function passTurn() {
    if (!ceIsUserTurn || ceDrawnThisTurn === 0 || ceIsGameOver) return;
    ceSelectedIndices = [];
    ceDrawnThisTurn = 0;
    ceIsUserTurn = false;
    setCEStatus("Pasaste turno.");
    renderCrazyEightsBoard();
    setTimeout(botTurn, 1000);
}

function botTurn() {
    if (ceIsGameOver) return;

    var topCard = ceDiscardPile[ceDiscardPile.length - 1];
    var validIndices = [];

    ceBotHand.forEach(function(card, idx) {
        if (card.value === '8' || card.suit === ceCurrentSuit || card.value === topCard.value) {
            validIndices.push(idx);
        }
    });

    if (validIndices.length > 0) {
        var playIndex = validIndices[0];
        var playedCard = ceBotHand.splice(playIndex, 1)[0];
        ceDiscardPile.push(playedCard);

        if (playedCard.value === '8') {
            ceCurrentSuit = '♠';
        } else {
            ceCurrentSuit = playedCard.suit;
        }

        if (checkCrazyEightsWin()) return;
    } else {
        if (deckLength > 0) ceBotHand.push(ceDeck.pop());
    }

    ceIsUserTurn = true;
    renderCrazyEightsBoard();
}

function checkCrazyEightsWin() {
    if (ceUserHand.length === 0) {
        ceIsGameOver = true;
        alert("¡Ganaste Ocho Loco!");
        return true;
    }
    if (ceBotHand.length === 0) {
        ceIsGameOver = true;
        alert("Ganó la IA.");
        return true;
    }
    return false;
}

