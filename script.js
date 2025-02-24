document.getElementById('easy-button').addEventListener('click', () => setDifficulty('easy'));
document.getElementById('medium-button').addEventListener('click', () => setDifficulty('medium'));
document.getElementById('hard-button').addEventListener('click', () => setDifficulty('hard'));
document.getElementById('mute-button').addEventListener('click', toggleMute);
document.getElementById('volume-slider').addEventListener('input', (e) => {
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = e.target.value;
});

let flippedCards = [];
let matchedCards = [];
let difficulty = 'easy'; // Varsayılan zorluk seviyesi
let isMuted = false;

function setDifficulty(level) {
    difficulty = level;
    startGame();
}

function startGame() {
    // Zorluk butonlarını gizle
    const difficultyButtons = document.getElementById('difficulty-buttons');
    difficultyButtons.style.display = 'none';

    // Ses kontrolünü göster
    const audioControls = document.getElementById('audio-controls');
    audioControls.style.display = 'flex';

    // Müziği başlat ve ses seviyesini %50 olarak ayarla
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = 0.5; // Ses seviyesi %50 olarak ayarlandı
    backgroundMusic.play();

    // Kartları oluştur ve karıştır
    const cards = createCards();
    shuffle(cards);
    displayCards(cards);
}

function createCards() {
    const cards = [];
    let cardCount;

    switch (difficulty) {
        case 'easy':
            cardCount = 8; // 4x4 (16 kart)
            break;
        case 'medium':
            cardCount = 12; // 6x4 (24 kart)
            break;
        case 'hard':
            cardCount = 18; // 6x6 (36 kart)
            break;
        default:
            cardCount = 8;
    }

    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'];
    const selectedEmojis = emojis.slice(0, cardCount);

    for (let i = 0; i < cardCount; i++) {
        cards.push(selectedEmojis[i]);
        cards.push(selectedEmojis[i]); // Her karttan iki tane
    }
    return cards;
}

function shuffle(array) {
    for (let k = 0; k < 3; k++) { // 3 kez karıştır
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

function displayCards(cards) {
    const cardArea = document.getElementById('card-area');
    cardArea.innerHTML = ''; // Önceki kartları temizle

    let columns;
    switch (difficulty) {
        case 'easy':
            columns = 4; // 4 sütun (4x4)
            break;
        case 'medium':
            columns = 6; // 6 sütun (6x4)
            break;
        case 'hard':
            columns = 6; // 6 sütun (6x6)
            break;
        default:
            columns = 4;
    }

    // Grid sütun sayısını ayarla
    cardArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.value = card;
        cardElement.innerHTML = `
            <div class="front"></div>
            <div class="back">${card}</div>
        `;
        cardElement.addEventListener('click', () => flipCard(cardElement));
        cardArea.appendChild(cardElement);
    });
}

function flipCard(card) {
    // Eğer kart zaten açıksa veya eşleşmişse, tıklamayı engelle
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        console.log("Kart zaten açık veya eşleşmiş, tıklama engellendi.");
        return;
    }

    // Tıklama sesini çal
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0; // Ses dosyasını başa sar
    clickSound.play();

    if (flippedCards.length === 2) {
        // Eğer 2 kart zaten açıksa, yanlış olanları kapat
        flippedCards.forEach(flippedCard => {
            if (!matchedCards.includes(flippedCard)) {
                flippedCard.classList.remove('flipped');
            }
        });
        flippedCards = [];
    }

    if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card)) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        matchedCards.push(card1, card2);
        card1.classList.add('matched'); // Eşleşen kartlara özel bir sınıf ekle
        card2.classList.add('matched'); // Eşleşen kartlara özel bir sınıf ekle
        console.log("Kartlar eşleşti ve kilitlendi:", card1, card2);

        // Eşleşme sesini çal
        const matchSound = document.getElementById('match-sound');
        matchSound.currentTime = 0; // Ses dosyasını başa sar
        matchSound.play();

        // Son iki kart eşleştiğinde konfeti patlat
        if (matchedCards.length === (difficulty === 'easy' ? 16 : difficulty === 'medium' ? 24 : 36)) {
            triggerConfetti(); // Konfeti patlat
            setTimeout(resetGame, 3000); // 3 saniye sonra ana ekrana dön
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
}

function resetGame() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.classList.add('fade-out'); // Geçiş efekti ekle

    setTimeout(() => {
        // Kartları temizle
        const cardArea = document.getElementById('card-area');
        cardArea.innerHTML = '';

        // Zorluk butonlarını tekrar göster
        const difficultyButtons = document.getElementById('difficulty-buttons');
        difficultyButtons.style.display = 'block';

        // Ses kontrolünü gizle
        const audioControls = document.getElementById('audio-controls');
        audioControls.style.display = 'none';

        // Müziği durdur
        const backgroundMusic = document.getElementById('background-music');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        // Oyun durumunu sıfırla
        flippedCards = [];
        matchedCards = [];

        // Geçiş efektini kaldır
        gameContainer.classList.remove('fade-out');
    }, 1000); // 1 saniye sonra ana sayfaya dön
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function toggleMute() {
    const backgroundMusic = document.getElementById('background-music');
    const muteButton = document.getElementById('mute-button');

    if (isMuted) {
        backgroundMusic.muted = false;
        muteButton.textContent = '🎵'; // Melodi ikonu sabit kalır
    } else {
        backgroundMusic.muted = true;
        muteButton.textContent = '🎵'; // Melodi ikonu sabit kalır
    }

    isMuted = !isMuted;
}
