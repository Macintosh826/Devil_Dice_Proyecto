// ==========================================
// 1. SELECCIÓN DE PANTALLAS
// ==========================================
function selectGame(gameType) {
    var selector = document.getElementById('game-selector-screen');
    var diceSec = document.getElementById('dice-game-section');
    var crescentSec = document.getElementById('crescent-game-section');
    var crazySec = document.getElementById('crazyeights-game-section');
    var gofishSec = document.getElementById('gofish-game-section');

    if (selector) selector.classList.add('hidden');

    if (gameType === 'dice' && diceSec) {
        diceSec.classList.remove('hidden');
    } else if (gameType === 'crescent' && crescentSec) {
        crescentSec.classList.remove('hidden');
        if (typeof initCrescentGame === 'function') initCrescentGame();
    } else if (gameType === 'crazyeights' && crazySec) {
        crazySec.classList.remove('hidden');
        if (typeof initCrazyEightsGame === 'function') initCrazyEightsGame();
    } else if (gameType === 'gofish' && gofishSec) {
        gofishSec.classList.remove('hidden');
    }
}

function showSelector() {
    var selector = document.getElementById('game-selector-screen');
    var diceSec = document.getElementById('dice-game-section');
    var crescentSec = document.getElementById('crescent-game-section');
    var crazySec = document.getElementById('crazyeights-game-section');
    var gofishSec = document.getElementById('gofish-game-section');

    if (diceSec) diceSec.classList.add('hidden');
    if (crescentSec) crescentSec.classList.add('hidden');
    if (crazySec) crazySec.classList.add('hidden');
    if (gofishSec) gofishSec.classList.add('hidden');
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
        if (ceDeck.length > 0) ceBotHand.push(ceDeck.pop());
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

// ==========================================
// 5. JUEGO 4: GO FISH (VE A PESCAR)
// ==========================================
var gfNumPlayers = 2; // Por defecto 2 jugadores
var gfDeck = [];
var gfPlayers = []; // { id: 0 (Tú), name: 'Tú'/'Bill'/etc, hand: [], books: 0, isBot: boolean }
var gfCurrentTurnIndex = 0;
var gfSelectedTargetIndex = 1;
var gfPendingFishRank = null; // Rango pedido esperando que el usuario pesque
var gfIsGameOver = false;

function setGFNumPlayers(num, btn) {
    gfNumPlayers = num;
    var btns = document.querySelectorAll('.btn-gf-num');
    btns.forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
}

function createGFDeck() {
    var deck = [];
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            deck.push({ suit: suits[i], value: values[j] });
        }
    }
    deck.sort(function() { return Math.random() - 0.5; });
    return deck;
}

function initGoFishGame() {
    gfDeck = createGFDeck();
    gfPlayers = [];
    gfIsGameOver = false;
    gfPendingFishRank = null;

    var botNames = ['Bill', 'Pedro', 'Ana'];
    gfPlayers.push({ id: 0, name: 'Tú', hand: [], books: 0, isBot: false });

    for (var p = 1; p < gfNumPlayers; p++) {
        gfPlayers.push({ id: p, name: botNames[p - 1], hand: [], books: 0, isBot: true });
    }

    // Regla de reparto: 2 jugadores = 7 cartas c/u; 3 o 4 jugadores = 6 o 5 cartas c/u
    var initialCards = (gfNumPlayers === 2) ? 7 : (gfNumPlayers === 3 ? 6 : 5);

    for (var c = 0; c < initialCards; c++) {
        for (var p = 0; p < gfPlayers.length; p++) {
            gfPlayers[p].hand.push(gfDeck.pop());
        }
    }

    // Seleccionar primer jugador al azar
    gfCurrentTurnIndex = Math.floor(Math.random() * gfPlayers.length);

    // Ocultar configuración y mostrar mesa
    var setupPanel = document.getElementById('gf-setup-panel');
    var playArea = document.getElementById('gf-play-area');
    if (setupPanel) setupPanel.classList.add('hidden');
    if (playArea) playArea.classList.remove('hidden');

    // Verificar libros iniciales
    for (var p = 0; p < gfPlayers.length; p++) {
        checkAndRemoveBooks(p);
    }

    setGFStatus("Juego listo. Empieza " + gfPlayers[gfCurrentTurnIndex].name + ".");
    renderGoFishBoard();

    if (gfPlayers[gfCurrentTurnIndex].isBot) {
        setTimeout(processGFBotTurn, 1500);
    }
}

function setGFStatus(msg) {
    var banner = document.getElementById('gf-status-banner');
    if (banner) banner.innerText = msg;
}

function checkAndRemoveBooks(playerIdx) {
    var player = gfPlayers[playerIdx];
    var counts = {};

    player.hand.forEach(function(card) {
        counts[card.value] = (counts[card.value] || 0) + 1;
    });

    for (var val in counts) {
        if (counts[val] === 4) {
            // Remover las 4 cartas del libro
            player.hand = player.hand.filter(function(card) { return card.value !== val; });
            player.books++;
            setGFStatus(player.name + " ¡ha formado un libro de " + val + "s!");
        }
    }
}

function renderGoFishBoard() {
    // Render Oponentes
    var opContainer = document.getElementById('gf-opponents-container');
    if (opContainer) {
        opContainer.innerHTML = '';
        for (var i = 1; i < gfPlayers.length; i++) {
            var p = gfPlayers[i];
            var box = document.createElement('div');
            box.className = 'gf-opponent-box ' + (gfCurrentTurnIndex === i ? 'active-turn' : '');
            box.innerHTML = '<div class="gf-op-name">' + p.name + '</div><div class="gf-op-stats">Cartas: ' + p.hand.length + ' | Libros: ' + p.books + '</div>';
            opContainer.appendChild(box);
        }
    }

    // Render Mazo central (Piscina)
    var poolCards = document.getElementById('gf-pool-graphics');
    if (poolCards) {
        poolCards.innerText = " Cartas: " + gfDeck.length;
    }

    // Libros del usuario
    var uBooks = document.getElementById('gf-user-books');
    if (uBooks) uBooks.innerText = gfPlayers[0].books;

    // Mano del Usuario
    var uHandEl = document.getElementById('gf-user-hand');
    if (uHandEl) {
        uHandEl.innerHTML = '';
        // Ordenar mano por rango para mejor visualización
        gfPlayers[0].hand.sort(function(a, b) { return values.indexOf(a.value) - values.indexOf(b.value); });

        gfPlayers[0].hand.forEach(function(card) {
            var isRed = ['♥', '♦'].includes(card.suit);
            var cardDiv = document.createElement('div');
            cardDiv.className = 'ce-card ' + (isRed ? 'red' : 'black');
            cardDiv.innerHTML = '<div>' + card.value + '</div><div class="suit-center">' + card.suit + '</div><div style="text-align: right;">' + card.value + '</div>';
            uHandEl.appendChild(cardDiv);
        });
    }

    // Panel de Solicitud de cartas (Turno del usuario)
    var askPanel = document.getElementById('gf-ask-panel');
    if (askPanel) {
        if (gfCurrentTurnIndex === 0 && !gfPendingFishRank && !gfIsGameOver) {
            askPanel.classList.remove('hidden');
            renderGFAskPanel();
        } else {
            askPanel.classList.add('hidden');
        }
    }
}

function renderGFAskPanel() {
    var targetDiv = document.getElementById('gf-target-selectors');
    var rankDiv = document.getElementById('gf-rank-buttons');

    if (targetDiv) {
        targetDiv.innerHTML = '';
        if (gfPlayers.length > 2) {
            targetDiv.innerHTML = '<span>Pedir a: </span>';
            for (var i = 1; i < gfPlayers.length; i++) {
                (function(idx) {
                    var btn = document.createElement('button');
                    btn.className = 'btn-gf-target ' + (gfSelectedTargetIndex === idx ? 'selected' : '');
                    btn.innerText = gfPlayers[idx].name;
                    btn.onclick = function() {
                        gfSelectedTargetIndex = idx;
                        renderGFAskPanel();
                    };
                    targetDiv.appendChild(btn);
                })(i);
            }
        } else {
            gfSelectedTargetIndex = 1; // Solo hay 1 rival (Bill)
        }
    }

    if (rankDiv) {
        rankDiv.innerHTML = '';
        // Regla: Solo se puede pedir rangos que el jugador ya tenga en la mano
        var userRanks = Array.from(new Set(gfPlayers[0].hand.map(function(c) { return c.value; })));

        if (userRanks.length === 0) {
            // Si el usuario no tiene cartas, debe robar
            refillHandIfEmpty(0);
            renderGoFishBoard();
            return;
        }

        userRanks.forEach(function(rank) {
            var btn = document.createElement('button');
            btn.className = 'btn-gf-ask';
            btn.innerText = rank;
            btn.onclick = function() { userAskRank(rank); };
            rankDiv.appendChild(btn);
        });
    }
}

function userAskRank(rank) {
    if (gfCurrentTurnIndex !== 0 || gfIsGameOver) return;

    var targetPlayer = gfPlayers[gfSelectedTargetIndex];
    setGFStatus("Le pides " + rank + "s a " + targetPlayer.name + "...");

    var matchingCards = targetPlayer.hand.filter(function(c) { return c.value === rank; });

    if (matchingCards.length > 0) {
        // Entrega las cartas y obtiene otro turno
        targetPlayer.hand = targetPlayer.hand.filter(function(c) { return c.value !== rank; });
        gfPlayers[0].hand = gfPlayers[0].hand.concat(matchingCards);

        checkAndRemoveBooks(0);
        setGFStatus("¡" + targetPlayer.name + " tenía " + matchingCards.length + " " + rank + "(s)! Obtienes otro turno.");

        refillHandIfEmpty(gfSelectedTargetIndex);
        checkGameOver();
        renderGoFishBoard();
    } else {
        // "VE A PESCAR" (Go Fish)
        setGFStatus(targetPlayer.name + ' dice: "¡VE A PESCAR!". Haz clic en el montón del centro para pescar.');
        gfPendingFishRank = rank;
        renderGoFishBoard();
    }
}

function fishFromOcean() {
    if (gfCurrentTurnIndex !== 0 || !gfPendingFishRank || gfIsGameOver) return;

    if (gfDeck.length > 0) {
        var drawnCard = gfDeck.pop();
        gfPlayers[0].hand.push(drawnCard);

        setGFStatus("Pescaste: " + drawnCard.value + " de " + drawnCard.suit);

        checkAndRemoveBooks(0);

        if (drawnCard.value === gfPendingFishRank) {
            setGFStatus("¡Pescaste el " + gfPendingFishRank + " que pediste! Obtienes otro turno.");
            gfPendingFishRank = null;
            renderGoFishBoard();
            return;
        }
    } else {
        setGFStatus("El montón de pesca está vacío.");
    }

    gfPendingFishRank = null;
    passGFTurn();
}

function passGFTurn() {
    checkGameOver();
    if (gfIsGameOver) return;

    gfCurrentTurnIndex = (gfCurrentTurnIndex + 1) % gfPlayers.length;
    renderGoFishBoard();

    if (gfPlayers[gfCurrentTurnIndex].isBot) {
        setTimeout(processGFBotTurn, 1500);
    }
}

function processGFBotTurn() {
    if (gfIsGameOver) return;

    var bot = gfPlayers[gfCurrentTurnIndex];

    refillHandIfEmpty(gfCurrentTurnIndex);
    if (bot.hand.length === 0) {
        passGFTurn();
        return;
    }

    // Elegir objetivo y rango al azar de su mano
    var targetIdx = 0;
    do {
        targetIdx = Math.floor(Math.random() * gfPlayers.length);
    } while (targetIdx === gfCurrentTurnIndex);

    var targetPlayer = gfPlayers[targetIdx];
    var randomCard = bot.hand[Math.floor(Math.random() * bot.hand.length)];
    var askedRank = randomCard.value;

    setGFStatus(bot.name + " le pide " + askedRank + "s a " + targetPlayer.name + "...");

    setTimeout(function() {
        var matchingCards = targetPlayer.hand.filter(function(c) { return c.value === askedRank; });

        if (matchingCards.length > 0) {
            targetPlayer.hand = targetPlayer.hand.filter(function(c) { return c.value !== askedRank; });
            bot.hand = bot.hand.concat(matchingCards);

            checkAndRemoveBooks(gfCurrentTurnIndex);
            setGFStatus(targetPlayer.name + " le dio " + matchingCards.length + " " + askedRank + "(s) a " + bot.name + ". " + bot.name + " juega de nuevo.");

            refillHandIfEmpty(targetIdx);
            checkGameOver();

            if (!gfIsGameOver) setTimeout(processGFBotTurn, 1500);
        } else {
            setGFStatus(targetPlayer.name + ' dice: "¡VE A PESCAR!" a ' + bot.name + '.');

            setTimeout(function() {
                if (gfDeck.length > 0) {
                    var drawnCard = gfDeck.pop();
                    bot.hand.push(drawnCard);
                    checkAndRemoveBooks(gfCurrentTurnIndex);

                    if (drawnCard.value === askedRank) {
                        setGFStatus(bot.name + " pescó lo que pidió y juega otra vez.");
                        if (!gfIsGameOver) setTimeout(processGFBotTurn, 1500);
                        return;
                    }
                }
                passGFTurn();
            }, 1200);
        }
        renderGoFishBoard();
    }, 1200);
}

function refillHandIfEmpty(playerIdx) {
    var player = gfPlayers[playerIdx];
    if (player.hand.length === 0 && gfDeck.length > 0) {
        var initialCards = (gfNumPlayers === 2) ? 7 : (gfNumPlayers === 3 ? 6 : 5);
        for (var i = 0; i < initialCards && gfDeck.length > 0; i++) {
            player.hand.push(gfDeck.pop());
        }
        setGFStatus(player.name + " se quedó sin cartas y robó del montón.");
    }
}

function checkGameOver() {
    var totalBooks = gfPlayers.reduce(function(sum, p) { return sum + p.books; }, 0);

    // Fin de juego: 13 libros completados o mazo vacío sin cartas
    if (totalBooks === 13 || (gfDeck.length === 0 && gfPlayers.every(function(p) { return p.hand.length === 0; }))) {
        gfIsGameOver = true;

        var winner = gfPlayers[0];
        gfPlayers.forEach(function(p) {
            if (p.books > winner.books) winner = p;
        });

        document.getElementById('modal-title').innerText = "¡FIN DEL JUEGO GO FISH!";
        document.getElementById('modal-body').innerHTML = '<p><strong>Ganador: ' + winner.name + ' con ' + winner.books + ' libros.</strong></p>';
        document.getElementById('info-modal').classList.remove('hidden');
    }
}

