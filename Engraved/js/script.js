const bookFiles = {
"Genesis": "data/Genesis.json",
"Exodus": "data/Exodus.json",
"Leviticus": "data/Leviticus.json",
"Numbers": "data/Numbers.json",
"Deuteronomy": "data/Deuteronomy.json",
"Joshua": "data/Joshua.json",
"Judges": "data/Judges.json",
"Ruth": "data/Ruth.json",
"1 Samuel": "data/1_Samuel.json",
"2 Samuel": "data/2_Samuel.json",
"1 Kings": "data/1_Kings.json",
"2 Kings": "data/2_Kings.json",
"1 Chronicles": "data/1_Chronicles.json",
"2 Chronicles": "data/2_Chronicles.json",
"Ezra": "data/Ezra.json",
"Nehemiah": "data/Nehemiah.json",
"Esther": "data/Esther.json",
"Job": "data/Job.json",
"Psalms": "data/Psalms.json",
"Proverbs": "data/Proverbs.json",
"Ecclesiastes": "data/Ecclesiastes.json",
"Song of Solomon": "data/Song_of_Solomon.json",
"Isaiah": "data/Isaiah.json",
"Jeremiah": "data/Jeremiah.json",
"Lamentations": "data/Lamentations.json",
"Ezekiel": "data/Ezekiel.json",
"Daniel": "data/Daniel.json",
"Hosea": "data/Hosea.json",
"Joel": "data/Joel.json",
"Amos": "data/Amos.json",
"Obadiah": "data/Obadiah.json",
"Jonah": "data/Jonah.json",
"Micah": "data/Micah.json",
"Nahum": "data/Nahum.json",
"Habakkuk": "data/Habakkuk.json",
"Zephaniah": "data/Zephaniah.json",
"Haggai": "data/Haggai.json",
"Zechariah": "data/Zechariah.json",
"Malachi": "data/Malachi.json",
"Matthew": "data/Matthew.json",
"Mark": "data/Mark.json",
"Luke": "data/Luke.json",
"John": "data/John.json",
"Acts": "data/Acts.json",
"Romans": "data/Romans.json",
"1 Corinthians": "data/1_Corinthians.json",
"2 Corinthians": "data/2_Corinthians.json",
"Galatians": "data/Galatians.json",
"Ephesians": "data/Ephesians.json",
"Philippians": "data/Philippians.json",
"Colossians": "data/Colossians.json",
"1 Thessalonians": "data/1_Thessalonians.json",
"2 Thessalonians": "data/2_Thessalonians.json",
"1 Timothy": "data/1_Timothy.json",
"2 Timothy": "data/2_Timothy.json",
"Titus": "data/Titus.json",
"Philemon": "data/Philemon.json",
"Hebrews": "data/Hebrews.json",
"James": "data/James.json",
"1 Peter": "data/1_Peter.json",
"2 Peter": "data/2_Peter.json",
"1 John": "data/1_John.json",
"2 John": "data/2_John.json",
"3 John": "data/3_John.json",
"Jude": "data/Jude.json",
"Revelation": "data/Revelation.json"
}

const difficultyLevels = ["Easy", "Medium", "Hard"];

let book = null;
let currentChapter = null;
let currentVerseIndex = 0;
let difficultyLevel = "Easy";
let stage = 1;
let currentVerseDisplay = null;
let correctCount = 0;
let totalHiddenWords = 0;

let verseMode = "ordered";
let verseScores = [];
let verseOrder = [];
let verseOrderIndex = 0;
let verseTime = 0;
let selectedInput = null;
let hintCount = 0;

async function loadBook(bookName) {
    const response = await fetch(bookFiles[bookName]);
    book = await response.json();
    console.log(book);


    document.getElementById("reference").textContent = 
        book.book;

    fillChapterDropdown();

    currentChapter = book.chapters[0];

    document.getElementById("chapterSelect").value = 
        currentChapter.chapter;

    resetScore();    
    setupVerseOrder();
    displayCurrentVerse();
}

function fillBookDropdown() {
    const bookSelect = document.getElementById("bookSelect");

    Object.keys(bookFiles).forEach((bookName) => {
        const option = document.createElement("option");

        option.value = bookName;
        option.textContent = bookName;

        bookSelect.appendChild(option);
    });
}

function fillChapterDropdown() {
    const chapterSelect = document.getElementById("chapterSelect");
    chapterSelect.innerHTML = "";

    book.chapters.forEach((chapter) => {
        const option = document.createElement("option");
        option.value = chapter.chapter;
        option.textContent = chapter.chapter;
        chapterSelect.appendChild(option);
    });
}

function fillDifficultyDropdown() {
    const difficultySelect = document.getElementById("difficultySelect");

    difficultySelect.innerHTML = "";

    difficultyLevels.forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        difficultySelect.appendChild(option);
    });
}

function displayCurrentVerse() {
    const verse =
        verseOrder[verseOrderIndex]

    document.getElementById("reference").textContent =
        `${book.book} ${currentChapter.chapter}`;

    const difficulty =
        document.getElementById("difficultySelect").value;

    currentVerseDisplay =
        replacingWords(verse.text, difficulty);

    stage = 1;

    displayVerseWords();
    updateProgressBar();
}

function getCurrentVerse() {
    return verseOrder[verseOrderIndex];
}

function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");

    progressBar.value = verseOrderIndex;
    progressBar.max = verseOrder.length;

    document.getElementById("progressCurrent").textContent =
        `${currentChapter.chapter}:${getCurrentVerse().verse}`;

    document.getElementById("progressTotal").textContent =
        `${verseOrderIndex}/${verseOrder.length}`;
}

function replacingWords(text, difficultyLevel = "Easy") {
    const difficultiesMap = {
        Easy: 0.20,
        Medium: 0.40,
        Hard: 0.60
    };

    const difficulty =
        difficultiesMap[difficultyLevel] ?? 0.25;

    const splitWords = text
        .split(/[ —]+/)
        .filter(word => word.trim() !== "");

    const replaceableIndices = splitWords
        .map((word, index) => ({ word, index }))
        .filter(item =>
            item.word.length >= 3 &&
            /[a-zA-Z]/.test(item.word)
        )
        .map(item => item.index);

    const count = Math.max(
        1,
        Math.round(replaceableIndices.length * difficulty)
    );

    const shuffledIndices = replaceableIndices
        .sort(() => Math.random() - 0.5);

    const indicesToReplace =
        new Set(shuffledIndices.slice(0, count));

    const hiddenWords = [];

    const wordList = splitWords.map((word, index) => {
        const isHidden = indicesToReplace.has(index);

        if (isHidden) {
            hiddenWords.push(word);
        }

        return {
            word: word,
            isHidden: isHidden,
            index: index
        };
    });

    return {
        original: text,
        wordList: wordList,
        hiddenWords: hiddenWords
    };
}

function displayVerseWords() {

    startVerseTime();

    const verseText = 
        document.getElementById("verseText");

    const savedInputs = {};

    document.querySelectorAll(".verseInput").forEach(input => {
        savedInputs[input.dataset.index] = input.value;
    });

    verseText.innerHTML = "";

    currentVerseDisplay.wordList.forEach(item => {
        if (item.isHidden) {
            if (stage === 2) {
                const userInput =
                    savedInputs[item.index] || "";

                const isCorrect =
                    closeAnswer(userInput, item.word);

                verseText.innerHTML += `
                    <span class="${isCorrect ? "correctWord" : "wrongWord"}">
                        ${item.word}
                    </span>
                `;
            } else {            
                verseText.innerHTML += `
                    <input 
                        class="verseInput"
                        data-index="${item.index}"
                        data-answer="${item.word}"
                    />
                `;
            }
        } else {
            verseText.innerHTML += `
                <span>${item.word}</span>
            `;
        }

        verseText.innerHTML += " ";
    });

    if (stage === 1) {
        setupInputLogic();
    }
}

function closeAnswer(userAnswer, correctAnswer) {
    const cleanUser =
        userAnswer.toLowerCase().replace(/[^a-z]/g, "");

    const cleanCorrect =
        correctAnswer.toLowerCase().replace(/[^a-z]/g, "");

    return cleanUser === cleanCorrect;
}

function setupInputLogic(){
        const inputs =
            document.querySelectorAll(".verseInput");

        inputs.forEach((input, index) => {

            input.addEventListener("focus", (event) => {
                selectedInput = input;
            });
            
            input.addEventListener("input", (event) => {
                
                event.target.value = event.target.value
                    .toLowerCase()
                    .replace(/[^a-z]/g, "");

                const answer =
                    event.target.dataset.answer.toLowerCase();

                // if (
                //     event.target.value.length >= answer.length &&
                //     index < inputs.length - 1
                // ) {
                //     inputs[index + 2].focus();
                // }

                if (event.target.value === answer) {
                    event.target.classList.add("correct");
                } else {
                    event.target.classList.remove("correct");
                }
            });
        });
}

function calculateScore() {
    let verseCorrect = 0;
    let verseTotal = 0;

    currentVerseDisplay.wordList.forEach(item => {

        if (item.isHidden) {

            verseTotal++;

            const userInput =
                document.querySelector(
                    `input[data-index="${item.index}"]`
            )?.value || "" ;

            if (closeAnswer(userInput, item.word)) {
                verseCorrect++;
            }
        }
    });

    correctCount += verseCorrect;
    totalHiddenWords += verseTotal;

    verseScores.push({
        chapter: currentChapter.chapter,
        verse: verseOrderIndex + 1,
        correct: verseCorrect,
        total: verseTotal,
        time: getVerseElapsedTime()
    });
}    

function showScoreScreen() {
    verseOrderIndex = 0;
    document.getElementById("practiceScreen").classList.add("hidden");
    document.getElementById("scoreScreen").classList.remove("hidden");

    const chapterTotalTime =
        verseScores.reduce((sum, score) => sum + score.time, 0);

    document.getElementById("scoreHeader").textContent =
        `${book.book} ${currentChapter.chapter}`;
    document.getElementById("difficulty").textContent =
        `Difficulty: ${document.getElementById("difficultySelect").value}`;
    document.getElementById("hints").textContent =
        `Hints used: ${hintCount}`;

    document.getElementById("scoreText").textContent =
        `${correctCount}/${totalHiddenWords}
        (${formatTime(chapterTotalTime)})`

    const verseScoreList =
        document.getElementById("verseScoreList");

    verseScoreList.innerHTML = "";

    verseScores.forEach(score => {
        verseScoreList.innerHTML += `
            <p>
                ${score.chapter}:${score.verse} - ${score.correct}/${score.total} (${formatTime(score.time)})
            </p>
        `;
    });
}

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function ensureNoSequences(list) {
    if (list.length <= 1) {
        return list;
    }

    let shuffledList = [...list];
    let attempts = 0;

    while (attempts < 50) {
        let hasSequence = false;

        for (let i = 0; i < shuffledList.length - 1; i++) {
            const currentVerseNumber =
                Number(shuffledList[i].verse);

            const nextVerseNumber =
                Number(shuffledList[i + 1].verse);

            if (nextVerseNumber === currentVerseNumber + 1) {
                hasSequence = true;
                break;
            }
        }

        if (!hasSequence) {
            return shuffledList;
        }

        shuffledList = shuffleArray(list);
        attempts++;
    }

    return shuffledList;
}

function setupVerseOrder() {
    if (!currentChapter || !Array.isArray(currentChapter.verses)) {
        verseOrder = [];
        return;
    }

    if (verseMode === "random") {
        verseOrder = ensureNoSequences(
            shuffleArray(currentChapter.verses)
        );
    } else {
        verseOrder = currentChapter.verses;
    }

    verseOrderIndex = 0;

    console.log(
        "Verse order:",
        verseOrder.map(verse => verse.verse)
    );
}

function startVerseTime() {
    verseTime = Date.now();
}

function getVerseElapsedTime() {
    return Date.now() - verseTime;
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function resetScore() {
    correctCount = 0;
    totalHiddenWords = 0;
    verseScores = [];
    verseTime = 0;
}

function clearInputs() {
    document.querySelectorAll(".verseInput").forEach(input => {
        input.value = "";
    });
}

document
    .getElementById("bookSelect")
    .addEventListener("change", (event) => {
        loadBook(event.target.value);
    });

document
    .getElementById("chapterSelect")
    .addEventListener("change", (event) => {
        currentChapter = book.chapters.find(
            chapter => Number(chapter.chapter) === Number(event.target.value)
        );

        currentVerseIndex = 0;
        resetScore();    
        setupVerseOrder();
        displayCurrentVerse();
    });

document
    .getElementById("difficultySelect")
    .addEventListener("change", () => {
        resetScore();    
        displayCurrentVerse();
    });

document
    .getElementById("refreshBtn")
    .addEventListener("click", () => {
        displayCurrentVerse();
    });

document
    .getElementById("nextBtn")   
    .addEventListener("click", () => {

        if (stage === 1) {
            calculateScore();
            stage = 2;
            displayVerseWords();
            return;
        }

        if (stage === 2) {
            if (verseOrderIndex < verseOrder.length - 1) {
                verseOrderIndex++;
                stage = 1;
                displayCurrentVerse();
            } else {
                showScoreScreen();
            }
        }
    });

document
    .getElementById("submitBtn")   
    .addEventListener("click", () => {
        showScoreScreen();
    });

document
    .getElementById("prevBtn")
    .addEventListener("click", () => {
        verseOrderIndex = 0;
        resetScore();
        displayCurrentVerse();
    });    

document
    .getElementById("hintBtn")
    .addEventListener("click", () => {
        hintCount++;

        if (!selectedInput) {
            return;
        }

        const answer =
            selectedInput.dataset.answer
                .toLowerCase()
                .replace(/[^a-z]/g, "");

        const current =
            selectedInput.value
                .toLowerCase()
                .replace(/[^a-z]/g, "");

        if (current.length < answer.length) {
            const newText =
                answer.slice(0, current.length + 1);

            selectedInput.value = newText;

            selectedInput.focus();

            selectedInput.setSelectionRange(
                newText.length,
                newText.length
            );

            selectedInput.dispatchEvent(
                new Event("input")
            );
        }
    });

document
    .getElementById("clearBtn")
    .addEventListener("click", () => {
        clearInputs();
    });

document
    .getElementById("restartBtn")
    .addEventListener("click", () => {
        document.getElementById('scoreScreen').classList.add("hidden");
        document.getElementById('practiceScreen').classList.remove("hidden");

        stage = 1;
        displayCurrentVerse();
    });

document
.getElementById("modeSelect")
    .addEventListener("change", (event) => {
        verseMode = event.target.value;

        setupVerseOrder();
        displayCurrentVerse();
    });

fillDifficultyDropdown();
fillBookDropdown();
loadBook("Genesis");